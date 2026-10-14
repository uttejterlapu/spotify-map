import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check client IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

    // If on localhost / private IP, call public IP resolver or ipwho.is directly
    const isLocalhost = !clientIp || clientIp === '::1' || clientIp === '127.0.0.1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.');

    const url = isLocalhost ? 'https://ipwho.is/' : `https://ipwho.is/${clientIp}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.latitude && data.longitude) {
        return NextResponse.json({
          city: data.city || 'Unknown City',
          country: data.country || 'Unknown Country',
          region: data.region || data.region_code || '',
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          isApproximate: true,
          ip: data.ip,
        });
      }
    }

    // Secondary fallback: freeipapi.com
    const secondaryRes = await fetch('https://freeipapi.com/api/json', {
      headers: { 'Accept': 'application/json' },
    });

    if (secondaryRes.ok) {
      const data = await secondaryRes.json();
      if (data && data.latitude && data.longitude) {
        return NextResponse.json({
          city: data.cityName || 'City',
          country: data.countryName || 'Country',
          region: data.regionName || '',
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          isApproximate: true,
          ip: data.ipAddress,
        });
      }
    }

    // Default safe fallback (Hyderabad / Music Hub)
    return NextResponse.json({
      city: 'Hyderabad',
      country: 'India',
      region: 'Telangana',
      lat: 17.3850 + (Math.random() - 0.5) * 0.02,
      lng: 78.4867 + (Math.random() - 0.5) * 0.02,
      isApproximate: true,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('IP Location lookup failed:', error);
    return NextResponse.json({
      city: 'Hyderabad',
      country: 'India',
      region: 'Telangana',
      lat: 17.3850,
      lng: 78.4867,
      isApproximate: true,
    });
  }
}
