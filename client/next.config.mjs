/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-inventorymanagement.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
    typescript: {
    ignoreBuildErrors: true, // Add this line to ignore TypeScript errors during the build
  },
};

export default nextConfig;
