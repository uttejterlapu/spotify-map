import { ImageResponse } from 'next/og';

export const alt = 'Spotify Map - Live Global Music Map & Spatial Chat';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #0d131f 50%, #05070e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '20%',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(29, 185, 84, 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '15%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(29, 185, 84, 0.12)',
            border: '1px solid rgba(29, 185, 84, 0.4)',
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: 18,
            fontWeight: 600,
            color: '#1db954',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#1db954',
              boxShadow: '0 0 10px #1db954',
            }}
          />
          REAL-TIME GLOBAL MUSIC RADAR
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Spotify Map
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 26,
            color: '#a1a1aa',
            maxWidth: '800px',
            textAlign: 'center',
            lineHeight: 1.4,
            margin: '0 0 40px 0',
          }}
        >
          Explore what people are streaming right now worldwide. Interactive vector map with spatial chat & Ghost Mode privacy.
        </p>

        {/* Feature Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: 16,
              color: '#f4f4f5',
            }}
          >
            🎵 Live Spotify Sync
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: 16,
              color: '#f4f4f5',
            }}
          >
            🗺️ Open-Source Vector Maps
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: 16,
              color: '#f4f4f5',
            }}
          >
            👻 Ghost Mode Privacy
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
