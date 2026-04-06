import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.spock.replit.dev", "*.repl.co"],
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
    ],
  },
  webpack(config) {
    config.resolve.alias["@assets"] = path.resolve(__dirname, "attached_assets");
    return config;
  },
};

export default nextConfig;
