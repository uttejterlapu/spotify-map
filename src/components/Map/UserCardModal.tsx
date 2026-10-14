'use client';

import React from 'react';
import { MapUser } from '@/types';
import { MessageSquare, MapPin, ExternalLink, X, Music, Ghost } from 'lucide-react';

interface UserCardModalProps {
  user: MapUser | null;
  currentUserId?: string;
  onClose: () => void;
  onOpenDm: (user: MapUser) => void;
}

export default function UserCardModal({
  user,
  currentUserId,
  onClose,
  onOpenDm,
}: UserCardModalProps) {
  if (!user) return null;

  const isSelf = user.id === currentUserId || user.isSelf;
  const isAnon = user.isAnonymous || user.name === 'Anonymous Listener';
  const track = user.nowPlaying;

  return (
    <div
      className="apple-glass user-card-modal-container"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            {isAnon ? (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                }}
              >
                <Ghost size={18} color="#c084fc" />
              </div>
            ) : user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(29, 185, 84, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--spotify-green)',
                }}
              >
                {user.name.charAt(0)}
              </div>
            )}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: isAnon ? '#c084fc' : 'var(--spotify-green)',
                border: '2px solid var(--panel-solid)',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {isAnon ? 'Anonymous Listener' : user.name}
              </span>
              {isSelf && <span style={{ fontSize: '11px', color: 'var(--spotify-green)' }}>(You)</span>}
              {isAnon && (
                <span style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  fontWeight: 600,
                }}>
                  Ghost
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <MapPin size={11} color="var(--spotify-green)" />
              <span>{user.location.city || 'Worldwide'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="apple-icon-btn"
          style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Now Playing info */}
      <div
        className="airbnb-card"
        style={{
          padding: '12px',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
          Now Streaming
        </div>

        {track ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {track.albumArt ? (
              <img
                src={track.albumArt}
                alt=""
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--btn-subtle-bg)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Music size={16} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {track.title}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {track.artist}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Not currently playing audio
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {isSelf ? (
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--spotify-green)',
              background: 'rgba(29, 185, 84, 0.1)',
              borderRadius: '9999px',
              padding: '8px',
              fontWeight: 600,
              border: '1px solid rgba(29, 185, 84, 0.25)',
              pointerEvents: 'none',
            }}
          >
            Your Live Profile
          </div>
        ) : (
          <button
            onClick={() => onOpenDm(user)}
            className="spotify-btn"
            style={{ flex: 1, justifyContent: 'center', padding: '8px 14px', fontSize: '12px' }}
          >
            <MessageSquare size={13} />
            <span>Send Message</span>
          </button>
        )}

        {track?.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-icon-btn"
            style={{ width: '36px', height: '36px' }}
            title="Open in Spotify"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
