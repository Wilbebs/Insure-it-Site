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

    // Make image imports from attached_assets/ return URL strings (not StaticImageData objects).
    // This allows them to be used directly in <img src>, background-image:url(), poster=, etc.
    config.module.rules.unshift({
      test: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i,
      include: path.resolve(__dirname, "attached_assets"),
      type: "asset/resource",
      generator: {
        filename: "static/media/[hash][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
