/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Stäng av ESLint under bygget om du vill ignorera alla varningar
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Stäng av TypeScript-fel under bygget
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'www.arbetsformedlingen.se',
      'arbetsformedlingen.se',
      'smidra.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.arbetsformedlingen.se',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://smidra.com/:path*',
      },
    ];
  },
}

module.exports = nextConfig 