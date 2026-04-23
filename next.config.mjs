/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lexinton.com.ar',
        pathname: '/**',
      },
      // Tokko Broker CDN — fotos de propiedades (watermarked, original, thumb)
      {
        protocol: 'https',
        hostname: 'static.tokkobroker.com',
        pathname: '/**',
      },
      {
        // Tokko sometimes serves images over http in older entries
        protocol: 'http',
        hostname: 'static.tokkobroker.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
