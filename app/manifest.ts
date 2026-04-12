import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FaizNation - Portfolio',
    short_name: 'FaizNation',
    description: 'Official portfolio of FaizNation. Explore my projects and connect with me.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/globe.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
