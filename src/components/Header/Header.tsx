'use client';

import React from 'react';
import { MapPin, LogOut, Radio, PanelRightClose, PanelRightOpen, Music, Ghost, Sun, Moon } from 'lucide-react';
import { MapUser } from '@/types';

interface HeaderProps {
  currentUser: MapUser | null;
  activeCount: number;
  isSpotifyConnected: boolean;
  onConnectSpotify: () => void;
  onDisconnectSpotify: () => void | Promise<void>;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
  onRecenterSelf?: () => void;
  isAnonymous?: boolean;
  onToggleAnonymous?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  profileName?: string;
  profileAvatar?: string;
}

export default function Header({
  currentUser,
  activeCount,
  isSpotifyConnected,
  onConnectSpotify,
  onDisconnectSpotify,
  isRightPanelOpen = false,
  onToggleRightPanel,
  onRecenterSelf,
  isAnonymous = false,
  onToggleAnonymous,
  theme = 'dark',
  onToggleTheme,
  profileName,
  profileAvatar,
}: HeaderProps) {
  return (
    <header
      className={`apple-glass header-container ${isRightPanelOpen ? 'panel-open' : ''}`}
    >
      {/* Brand & Live Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1db954 0%, #15883e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(29, 185, 84, 0.35)',
              flexShrink: 0,
            }}
          >
            <Radio size={15} color="#000" />
          </div>
          <span className="header-brand-title" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Spotify Map
          </span>
        </div>

        {/* Airbnb-style Live Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--tag-bg)',
            border: '1px solid var(--border-glass)',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--spotify-green)',
              boxShadow: '0 0 8px var(--spotify-green)',
            }}
          />
          <span>{activeCount} live</span>
        </div>
      </div>

      {/* Center: Airbnb-style Location Chip (Hidden on mobile to preserve header layout) */}
      {currentUser?.location.city && (
        <button
          onClick={onRecenterSelf}
          className="apple-pill-btn hide-mobile"
          style={{
            maxWidth: '220px',
            background: 'var(--card-bg)',
            border: `1px solid ${currentUser.location.isApproximate ? 'var(--border-glass)' : 'rgba(29, 185, 84, 0.3)'}`,
            padding: '5px 12px',
            flexShrink: 1,
          }}
          title={
            currentUser.location.isApproximate
              ? 'Coarse / IP-based location (Click to locate)'
              : `High-accuracy GPS locked (Click to center)`
          }
        >
          <MapPin
            size={12}
            color={currentUser.location.isApproximate ? '#eab308' : 'var(--spotify-green)'}
          />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser.location.city}
          </span>
          {!currentUser.location.isApproximate && currentUser.location.accuracy && (
            <span style={{ fontSize: '10px', color: 'var(--spotify-green)', fontWeight: 600 }}>
              ±{currentUser.location.accuracy}m
            </span>
          )}
        </button>
      )}

      {/* Right Actions: Ghost Mode, Spotify Profile, Theme & Sidebar Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Ghost Mode Toggle */}
        <button
          onClick={onToggleAnonymous}
          className="apple-pill-btn"
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 500,
            background: isAnonymous ? 'rgba(168, 85, 247, 0.16)' : 'var(--btn-subtle-bg)',
            border: isAnonymous
              ? '1px solid rgba(168, 85, 247, 0.45)'
              : '1px solid var(--border-glass)',
            color: isAnonymous ? '#d8b4fe' : 'var(--text-secondary)',
            boxShadow: isAnonymous ? '0 0 12px rgba(168, 85, 247, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          title={
            isAnonymous
              ? 'Ghost Mode is ON: Your name & photo are masked from other listeners on the map. Click to turn off.'
              : 'Ghost Mode is OFF: Your name & photo are visible to other listeners. Click to go anonymous.'
          }
        >
          <Ghost size={14} color={isAnonymous ? '#c084fc' : 'var(--text-muted)'} />
          <span className="hide-mobile-text">Ghost Mode</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isAnonymous ? '#c084fc' : 'rgba(255, 255, 255, 0.25)',
              boxShadow: isAnonymous ? '0 0 6px #c084fc' : 'none',
              marginLeft: '2px',
            }}
          />
        </button>

        {isSpotifyConnected ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--tag-bg)',
              border: '1px solid var(--border-glass)',
              padding: '4px 6px 4px 8px',
              borderRadius: '9999px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(profileAvatar || currentUser?.avatar) ? (
                <img
                  src={profileAvatar || currentUser?.avatar}
                  alt=""
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--spotify-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#000',
                  }}
                >
                  {(profileName || currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hide-mobile-text" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profileName || currentUser?.name || 'Listener'}
              </span>
            </div>

            <button
              onClick={onDisconnectSpotify}
              className="apple-icon-btn"
              style={{ width: '24px', height: '24px', border: 'none', background: 'transparent' }}
              title="Disconnect Spotify"
            >
              <LogOut size={13} color="var(--text-muted)" />
            </button>
          </div>
        ) : (
          <button onClick={onConnectSpotify} className="spotify-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <Music size={13} />
            <span className="hide-mobile-text">Connect Spotify</span>
          </button>
        )}

        {/* Theme Switcher Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className="apple-icon-btn"
          style={{
            width: '32px',
            height: '32px',
            color: theme === 'light' ? '#f59e0b' : 'var(--text-primary)',
            background: theme === 'light' ? 'rgba(245, 158, 11, 0.12)' : 'var(--btn-subtle-bg)',
            borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-glass)',
            flexShrink: 0,
          }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Dedicated Sidebar Toggle Icon */}
        {onToggleRightPanel && (
          <button
            onClick={onToggleRightPanel}
            className="apple-icon-btn"
            style={{
              width: '32px',
              height: '32px',
              borderColor: isRightPanelOpen ? 'var(--spotify-green)' : 'var(--border-glass)',
              color: isRightPanelOpen ? 'var(--spotify-green)' : 'var(--text-primary)',
              flexShrink: 0,
            }}
            title={isRightPanelOpen ? 'Hide Chat & Listeners' : 'Open Chat & Listeners'}
          >
            {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        )}
      </div>
    </header>
  );
}
