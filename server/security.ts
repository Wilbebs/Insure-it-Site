import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || "";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_API_TOKEN) {
    return res.status(503).json({
      success: false,
      message:
        "Admin endpoints are disabled because ADMIN_API_TOKEN is not configured on the server.",
    });
  }

  const header = req.get("authorization") || "";
  const expected = `Bearer ${ADMIN_API_TOKEN}`;

  if (header.length !== expected.length) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let mismatch = 0;
  for (let i = 0; i < header.length; i++) {
    mismatch |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  next();
}

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions from this IP. Please try again later.",
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many upload requests from this IP. Please try again later.",
  },
});

export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

export function safeExtensionForMime(mime: string): string {
  return MIME_TO_EXT[mime] || "bin";
}

export const ALLOWED_UPLOAD_MIMES = Object.keys(MIME_TO_EXT);

export const ALLOWED_DOCUMENT_PREFIX = "contact-documents/";

export function isSafeDocumentKey(key: string): boolean {
  if (!key.startsWith(ALLOWED_DOCUMENT_PREFIX)) return false;
  if (key.includes("..")) return false;
  if (key.includes("\0")) return false;
  return true;
}
