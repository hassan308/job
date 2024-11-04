/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-image-domains.com'], // Lägg till domäner för dina bilder
  },
}

module.exports = nextConfig 