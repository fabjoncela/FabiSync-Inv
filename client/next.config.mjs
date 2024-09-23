/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-fabi-inv.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
    typescript: {
    ignoreBuildErrors: true, // Add this line to ignore TypeScript errors during the build
  },
};
//https://s3-fabi-inv.s3.eu-central-1.amazonaws.com/product1.png
export default nextConfig;
