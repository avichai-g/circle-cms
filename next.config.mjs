import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd());
    config.resolve.alias["@/lib"] = path.resolve(process.cwd(), "app/lib");
    config.experiments = { ...config.experiments, topLevelAwait: true };

    return config;
  },
};

export default nextConfig;
