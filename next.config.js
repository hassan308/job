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
      'arbetsformedlingen.se'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.arbetsformedlingen.se',
      },
    ],
  },
}

module.exports = nextConfig 