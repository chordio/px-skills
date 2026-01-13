import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server-side rendering for API routes
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
