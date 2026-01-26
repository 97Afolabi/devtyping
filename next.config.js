/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use webpack as the bundler instead of Turbopack
  transpilePackages: ["next"],
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
