/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
};

export default nextConfig;
