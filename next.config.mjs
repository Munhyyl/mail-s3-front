/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["my-munhyyl-image-storage.s3.us-east-1.amazonaws.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*", // Spring Boot API
      },
    ];
  },
};

export default nextConfig;
