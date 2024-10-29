/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'lh3.googleusercontent.com',
      'googleusercontent.com'
    ],
  },
};

module.exports = nextConfig;
