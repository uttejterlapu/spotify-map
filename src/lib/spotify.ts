import { Track } from '@/types';

export const SPOTIFY_SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-top-read',
  'user-read-email',
  'user-read-private',
].join(' ');

export function getEffectiveOrigin(request: { headers: { get: (name: string) => string | null }; nextUrl: { host: string; protocol: string } }): string {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    try {
      const u = new URL(process.env.SPOTIFY_REDIRECT_URI);
      return u.origin;
    } catch (e) {}
  }

  const fwdHost = request.headers.get('x-forwarded-host');
  const fwdProto = request.headers.get('x-forwarded-proto') || 'https';
  if (fwdHost) {
    return `${fwdProto}://${fwdHost}`;
  }

  const host = request.headers.get('host') || request.nextUrl.host;
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const proto = isLocal ? 'http' : 'https';
  return `${proto}://${host}`;
}

export function getRedirectUri(request: { headers: { get: (name: string) => string | null }; nextUrl: { host: string; protocol: string } }): string {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }
  const origin = getEffectiveOrigin(request);
  return `${origin}/api/spotify/callback`;
}

export async function fetchUserProfile(accessToken: string): Promise<{ id: string; name: string; avatar?: string } | null> {
  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      name: data.display_name || data.id,
      avatar: data.images?.[0]?.url,
    };
  } catch (err) {
    console.error('Failed to fetch Spotify user profile:', err);
    return null;
  }
}

export async function fetchCurrentlyPlaying(accessToken: string): Promise<Track | null> {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    });

    if (res.status === 204 || res.status > 400) {
      return await fetchRecentlyPlayed(accessToken);
    }

    const data = await res.json();
    if (!data || !data.item) return null;

    return formatSpotifyTrack(data.item, data.is_playing, data.progress_ms);
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    return null;
  }
}

export async function fetchRecentlyPlayed(accessToken: string): Promise<Track | null> {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0].track;
    return formatSpotifyTrack(item, false, 0);
  } catch (error) {
    console.error('Error fetching recently played track:', error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatSpotifyTrack(item: any, isPlaying: boolean = true, progressMs: number = 0): Track {
  return {
    id: item.id || `spotify-${Date.now()}`,
    title: item.name,
    artist: item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
    album: item.album?.name || 'Unknown Album',
    albumArt: item.album?.images?.[0]?.url || undefined,
    durationMs: item.duration_ms || 0,
    progressMs: progressMs,
    isPlaying: isPlaying,
    previewUrl: item.preview_url || undefined,
    spotifyUrl: item.external_urls?.spotify || `https://open.spotify.com/track/${item.id}`,
  };
}
