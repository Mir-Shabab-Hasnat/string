/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**', // Matches all paths
      },
    ],
  },
};

module.exports = nextConfig;
