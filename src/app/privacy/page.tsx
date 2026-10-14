import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, MapPin, EyeOff, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Spotify Map',
  description: 'Learn how Spotify Map handles your data, Spotify integration, geolocation privacy, and Ghost Mode anonymous protection.',
};

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-canvas)',
      color: 'var(--text-primary)',
      padding: '40px 20px 80px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Top Back Navigation */}
        <Link
          href="/"
          className="apple-pill-btn"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Live Map</span>
        </Link>

        {/* Header Title */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(29, 185, 84, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--spotify-green)',
            }}>
              <Shield size={20} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Privacy Policy
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Last Updated: October 15, 2026 • Effective Immediately
          </p>
        </div>

        {/* Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.6', fontSize: '15px' }}>
          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--spotify-green)" />
              1. Overview & Commitment
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Spotify Map (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) is an open, real-time spatial music discovery platform.
              We respect your privacy and believe you should always retain full transparency and control over your personal data and live location.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              This policy explains what information is collected when you access Spotify Map, connect your Spotify account, or participate in spatial chat.
            </p>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="var(--spotify-green)" />
              2. Data We Collect & Access
            </h2>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Spotify Profile & Playback:</strong> When you voluntarily connect Spotify via OAuth, we retrieve your Spotify User ID, display name, avatar URL, and currently playing track (title, artist, album art, 30-second preview URL, and Spotify open link).
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Location Information:</strong> With your explicit browser consent, we access geographic coordinates (latitude and longitude) to position your listener icon on the global map. If GPS is unavailable, we use approximate IP geolocation or fall back to a city center. You may disable broadcasting at any time with the &quot;Hidden&quot; toggle.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Device Identifier:</strong> A randomly generated anonymous device key (stored locally on your device via localStorage) ensures you are represented as a single entity and prevents duplicate icons.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Spatial Chat Messages:</strong> Text and optional song cards you share in the global or direct chat feed.
              </li>
            </ul>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff size={16} color="#c084fc" />
              3. Ghost Mode (Incognito & Anonymity)
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Spotify Map includes a built-in <strong style={{ color: '#c084fc' }}>Ghost Mode</strong> designed for maximum privacy:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Your display name is permanently masked as <strong style={{ color: 'var(--text-primary)' }}>&quot;Anonymous Listener&quot;</strong> on the public map and in live presence feeds.</li>
              <li>Your personal Spotify profile photo is replaced with a private purple ghost avatar.</li>
              <li>Chat messages you post while in Ghost Mode are marked with the ghost badge and scrubbed of any identifiable personal data.</li>
              <li>You can toggle Ghost Mode on or off at any moment in the header bar or chat composer.</li>
            </ul>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--spotify-green)" />
              4. Spotify Developer Policy Compliance & Data Retention
            </h2>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>No Long-term Listening Logs:</strong> We do NOT create or sell persistent historical logs of your listening habits. Active presence on the map is held in ephemeral in-memory memory and automatically expires after 90 seconds of inactivity.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Authentication & Cookies:</strong> Spotify OAuth tokens are stored in secure, encrypted HTTP-only session cookies. We never store your Spotify passwords.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>One-Click Disconnect:</strong> Clicking the disconnect icon in the header immediately invalidates session tokens, deletes presence from the map, and severs all API communication with Spotify.
              </li>
            </ul>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--spotify-green)" />
              5. Third-Party Integrations
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Our service interacts with the following external providers:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Spotify AB:</strong> For track metadata, album artwork, and user verification.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Carto & MapLibre GL:</strong> For vector base tiles (Dark Matter and Positron).</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>OpenStreetMap Nominatim:</strong> For converting coordinates into human-readable city labels.</li>
            </ul>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              6. Your Rights & Data Inquiries
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Under GDPR, CCPA, and applicable global privacy laws, you have the right to access, rectify, or request deletion of any data associated with your interaction.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              To revoke Spotify Map access directly from your Spotify account, you can visit{' '}
              <a
                href="https://www.spotify.com/account/apps/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--spotify-green)', textDecoration: 'underline' }}
              >
                Spotify App Management
              </a>{' '}
              at any time. For privacy inquiries or takedown requests, contact{' '}
              <a href="mailto:[EMAIL_ADDRESS]" style={{ color: 'var(--spotify-green)' }}>
                [EMAIL_ADDRESS]
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
