import { NextRequest, NextResponse } from 'next/server';
import { SPOTIFY_SCOPES, getEffectiveOrigin, getRedirectUri } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customClientId = searchParams.get('client_id');
  const clientId = customClientId || process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  const origin = getEffectiveOrigin(request);
  const redirectUri = getRedirectUri(request);

  if (!clientId) {
    return NextResponse.redirect(`${origin}/?spotify_error=no_client_id`);
  }

  const state = Math.random().toString(36).substring(7);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES,
    state: state,
    show_dialog: 'true',
  });

  const response = NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  response.cookies.set('spotify_auth_state', state, { httpOnly: true, path: '/' });
  return response;
}
