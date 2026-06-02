/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Serve the brand SVG for the legacy /favicon.ico probe so the console
    // stays free of 404s (app/icon.svg only covers the <link rel="icon">).
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
