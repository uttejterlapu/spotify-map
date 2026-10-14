import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveOrigin, getRedirectUri } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const origin = getEffectiveOrigin(request);

  if (error || !code) {
    return NextResponse.redirect(`${origin}/?spotify_error=${error || 'no_code'}`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = getRedirectUri(request);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/?spotify_error=missing_credentials`);
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Spotify token exchange failed:', tokenData);
      return NextResponse.redirect(`${origin}/?spotify_error=token_exchange_failed`);
    }

    const response = NextResponse.redirect(`${origin}/?spotify_connected=true`);

    // Store tokens in secure cookies
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 3600,
    });

    if (tokenData.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 3600, // 30 days
      });
    }

    return response;
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(`${origin}/?spotify_error=server_error`);
  }
}
