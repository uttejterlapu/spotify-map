import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.json({ success: true, message: 'Disconnected from Spotify' });

  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  response.cookies.delete('spotify_auth_state');

  return response;
}
