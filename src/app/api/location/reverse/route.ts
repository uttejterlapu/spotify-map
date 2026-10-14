import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SpotineoMapApp/1.0',
        'Accept-Language': 'en',
      },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      
      const localArea =
        addr.neighbourhood ||
        addr.suburb ||
        addr.residential ||
        addr.quarter ||
        addr.city_district ||
        addr.village ||
        '';

      const broadCity =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.county ||
        data.name ||
        '';

      let formattedCity = broadCity;
      if (localArea && broadCity && localArea.toLowerCase() !== broadCity.toLowerCase()) {
        formattedCity = `${localArea}, ${broadCity}`;
      } else if (localArea) {
        formattedCity = localArea;
      } else if (!formattedCity) {
        formattedCity = 'My Location';
      }

      return NextResponse.json({
        city: formattedCity,
        suburb: localArea,
        state: addr.state,
        country: addr.country || '',
        displayName: data.display_name,
      });
    }

    return NextResponse.json({ city: 'My Location' });
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_')) {
      throw err;
    }
    console.error('Reverse geocode error:', err);
    return NextResponse.json({ city: 'My Location' });
  }
}
