import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spotify Map - Live Global Music Map & Spatial Chat',
    short_name: 'Spotify Map',
    description: 'Real-time music discovery map connecting Spotify listeners worldwide with live spatial chat and ghost mode privacy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#1db954',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
