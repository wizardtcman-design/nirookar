import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* نشانگر توسعه Next.js در گوشه صفحه با نوار ناوبری اپ تداخل دارد */
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
