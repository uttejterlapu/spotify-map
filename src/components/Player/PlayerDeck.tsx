'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Track } from '@/types';
import { Play, Pause, ExternalLink, Send, Radio, Music } from 'lucide-react';

interface PlayerDeckProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onShareTrackToChat: (track: Track) => void;
  broadcastLocation: boolean;
  onToggleBroadcast: () => void;
  isSpotifyConnected: boolean;
}

export default function PlayerDeck({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onShareTrackToChat,
  broadcastLocation,
  onToggleBroadcast,
  isSpotifyConnected,
}: PlayerDeckProps) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio preview if previewUrl is available
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (currentTrack?.previewUrl) {
      if (audio.src !== currentTrack.previewUrl) {
        audio.src = currentTrack.previewUrl;
      }
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentTrack, isPlaying]);

  return (
    <div
      className="apple-glass player-deck-container"
    >
      {/* Album Artwork with subtle rounded corners */}
      <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
        {currentTrack?.albumArt ? (
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          />
        ) : (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--btn-subtle-bg)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Music size={16} />
          </div>
        )}

        {/* Live animated Equalizer when track is actively playing */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              background: 'rgba(0, 0, 0, 0.75)',
              borderRadius: '4px',
              padding: '2px 3px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
            }}
          >
            <div className="live-eq-bar" />
            <div className="live-eq-bar" />
            <div className="live-eq-bar" />
          </div>
        )}
      </div>

      {/* Song Details */}
      <div style={{ minWidth: 0, flex: 1, marginRight: '4px' }}>
        {currentTrack ? (
          <>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '160px',
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '160px',
              }}
            >
              {currentTrack.artist}
            </div>
          </>
        ) : (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isSpotifyConnected
              ? 'Play music on Spotify to broadcast'
              : 'Connect Spotify to sync'}
          </div>
        )}
      </div>

      {/* Preview Play/Pause button if preview available */}
      {currentTrack?.previewUrl && (
        <button
          onClick={onTogglePlay}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'var(--text-primary)',
            color: 'var(--bg-canvas)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? (
            <Pause size={13} color="currentColor" />
          ) : (
            <Play size={13} color="currentColor" style={{ marginLeft: '1px' }} />
          )}
        </button>
      )}

      {/* Action Buttons: Share & Broadcast Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {currentTrack && (
          <button
            onClick={() => onShareTrackToChat(currentTrack)}
            className="apple-pill-btn hide-mobile"
            style={{ padding: '5px 8px', fontSize: '11px' }}
            title="Share track with listeners"
          >
            <Send size={11} color="var(--spotify-green)" />
            <span>Share</span>
          </button>
        )}

        {currentTrack?.spotifyUrl && (
          <a
            href={currentTrack.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-icon-btn hide-mobile"
            style={{ width: '28px', height: '28px' }}
            title="Open in Spotify"
          >
            <ExternalLink size={12} />
          </a>
        )}

        {/* Location Visibility Pill */}
        <button
          onClick={onToggleBroadcast}
          className="apple-pill-btn"
          style={{
            borderColor: broadcastLocation ? 'rgba(29, 185, 84, 0.3)' : 'var(--border-glass)',
            color: broadcastLocation ? 'var(--spotify-green)' : 'var(--text-muted)',
            padding: '5px 9px',
            fontSize: '11px',
          }}
          title={broadcastLocation ? 'Visible on map' : 'Hidden from map'}
        >
          <Radio size={11} />
          <span className="hide-mobile-text">{broadcastLocation ? 'Broadcasting' : 'Hidden'}</span>
        </button>
      </div>
    </div>
  );
}
