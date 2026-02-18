import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    };
    return config;
  },
};

export default nextConfig;