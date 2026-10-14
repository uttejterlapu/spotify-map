import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertCircle, Music, ShieldAlert, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Spotify Map',
  description: 'Terms and Conditions for using Spotify Map live spatial music discovery and chat service.',
};

export default function TermsPage() {
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
              <BookOpen size={20} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Terms of Service
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
              <Award size={16} color="var(--spotify-green)" />
              1. Acceptance of Terms
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              By accessing or using Spotify Map (the &quot;Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you do not agree with any part of these terms, please discontinue using the service and disconnect your Spotify account.
            </p>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music size={16} color="var(--spotify-green)" />
              2. Spotify Integration & Trademark Disclaimers
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Spotify Map is an independent third-party web application built using the official Spotify Web API.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Spotify®</strong> and the Spotify logo are registered trademarks of Spotify AB.</li>
              <li>Spotify Map is <strong>not affiliated, endorsed, certified, or sponsored</strong> by Spotify AB in any way.</li>
              <li>Use of Spotify metadata, song previews, and album art complies with Spotify Developer Terms and Developer Policy.</li>
            </ul>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="var(--spotify-green)" />
              3. Spatial Chat & Community Conduct
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              The live chat feed enables spontaneous conversation between music lovers worldwide. You agree NOT to post or transmit:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Hate speech, harassment, threats, defamation, or discriminatory comments.</li>
              <li>Spam, promotional solicitations, malware, or phishing links.</li>
              <li>Explicit, obscene, or infringing material.</li>
              <li>Personal identifying information of other individuals without explicit permission.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
              We reserve the right to moderate, remove messages, or block abusive device IDs without prior notice.
            </p>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="var(--spotify-green)" />
              4. Location Data & Accuracy Disclaimer
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Geolocation displayed on the map is coarse and approximate, provided strictly for artistic visualization and entertainment purposes.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              The Service must never be relied upon for emergency dispatch, navigation, high-risk activities, or precise tracking.
            </p>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              5. Limitation of Liability & &quot;As-Is&quot; Service
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Spotify Map is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              In no event shall the authors, maintainers, or contributors be held liable for any direct, indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="apple-glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              6. Contact Information
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you have any questions or concerns regarding these Terms of Service, please reach out to us at{' '}
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
