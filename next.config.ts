import type { NextConfig } from "next";

const devMode = process.env.DEVELOPER_MODE === "true";

const nextConfig: NextConfig = {
  output: devMode ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_DEVELOPER_MODE: devMode ? "true" : "false",
  },
  pageExtensions: devMode
    ? ["tsx", "ts", "jsx", "js", "dev.tsx", "dev.ts"]
    : ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
