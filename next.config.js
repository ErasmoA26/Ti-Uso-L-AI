/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per sito statico
  output: 'export',
  trailingSlash: true,
  
  // Ottimizzazioni performance
  compress: true,
  poweredByHeader: false,
  
  // Headers di sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/admin(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/(.*\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Configurazione immagini
  images: {
    unoptimized: true
  },
  
  // Configurazione per Vercel
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig 