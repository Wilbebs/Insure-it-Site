import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();
console.log('🔍 DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
console.log('🔍 AWS_REGION loaded:', process.env.AWS_REGION ? 'YES' : 'NO');

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./logger";
import { runMigrations } from "./migrate";
import next from "next";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.resolve(process.cwd()) });
const handle = nextApp.getRequestHandler();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  await nextApp.prepare();

  try {
    await runMigrations();
  } catch (err) {
    console.warn('⚠️  DB unavailable at startup — skipping migrations, continuing anyway.');
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  app.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  const port = parseInt(process.env.PORT || '5000', 10);

  const startListening = (retriesLeft = 8, delayMs = 1500): void => {
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`serving on port ${port} (${dev ? 'development' : 'production'})`);
    });
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
        console.warn(`⚠️  Port ${port} busy — retrying in ${delayMs}ms (${retriesLeft} left)…`);
        server.close(() => setTimeout(() => startListening(retriesLeft - 1, delayMs), delayMs));
      } else {
        console.error('Fatal server error:', err);
        process.exit(1);
      }
    });
  };

  startListening();
})();
