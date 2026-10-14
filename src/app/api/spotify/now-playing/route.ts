import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentlyPlaying, fetchUserProfile } from '@/lib/spotify';

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  let accessToken = request.cookies.get('spotify_access_token')?.value;
  const refreshToken = request.cookies.get('spotify_refresh_token')?.value;

  if (!accessToken && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token;
    }
  }

  if (!accessToken) {
    return NextResponse.json({
      connected: false,
      isPlaying: false,
      track: null,
      user: null,
    });
  }

  try {
    const [track, userProfile] = await Promise.all([
      fetchCurrentlyPlaying(accessToken),
      fetchUserProfile(accessToken),
    ]);

    return NextResponse.json({
      connected: true,
      isPlaying: track?.isPlaying || false,
      track: track,
      user: userProfile,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Now playing error:', error);
    return NextResponse.json({
      connected: false,
      isPlaying: false,
      track: null,
      user: null,
    });
  }
}
