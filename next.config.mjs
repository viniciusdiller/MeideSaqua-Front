/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.16.32.199",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["http://172.16.32.199:3000"],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:3301/uploads/:path*", // Proxy interno para o backend
      },
    ];
  },
};

export default nextConfig;
