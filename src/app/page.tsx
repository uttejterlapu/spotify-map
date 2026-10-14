'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapUser, Track, ChatMessage } from '@/types';
import Header from '@/components/Header/Header';
import PlayerDeck from '@/components/Player/PlayerDeck';
import RightPanel from '@/components/Sidebar/RightPanel';
import UserCardModal from '@/components/Map/UserCardModal';

// Dynamically load map component without SSR
const MapViewer = dynamic(() => import('@/components/Map/MapViewer'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0e0e10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a1a1aa',
        fontSize: '13px',
      }}
    >
      Loading map...
    </div>
  ),
});

export default function Home() {
  // Current user state (starts clean, zero mock data)
  const [currentUser, setCurrentUser] = useState<MapUser>({
    id: 'user-self',
    name: 'You',
    location: {
      city: 'Locating...',
      country: '',
      lat: 17.3850,
      lng: 78.4867,
      isApproximate: true,
    },
    nowPlaying: null,
    lastActive: 0,
    isSelf: true,
  });

  const [deviceId, setDeviceId] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<MapUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MapUser | null>(null);
  const [broadcastLocation, setBroadcastLocation] = useState(true);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({});
  const [activeDmUser, setActiveDmUser] = useState<MapUser | null>(null);

  // Anonymous / Ghost Mode state (scrubs public name & avatar from presence & chat)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [realProfile, setRealProfile] = useState<{ name: string; avatar?: string }>({
    name: 'You',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spotify_map_anonymous_mode');
      if (stored === 'true') {
        setIsAnonymous(true);
      }
    }
  }, []);

  const handleToggleAnonymous = () => {
    setIsAnonymous((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_map_anonymous_mode', String(next));
      }
      return next;
    });
  };

  // Theme state ('dark' | 'light') with system detection and persistence
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('spotify_map_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_map_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
      return next;
    });
  };

  // Initialize persistent device ID (one user per device)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('spotify_map_device_id');
      if (!id) {
        id = `dev-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('spotify_map_device_id', id);
      }
      setDeviceId(id);
      setCurrentUser((prev) => ({
        ...prev,
        id: prev.id === 'user-self' ? id : prev.id,
        deviceId: id,
      }));
    }
  }, []);

  // Geolocation resolution: requests high-accuracy GPS with fallback to Wi-Fi triangulation and IP
  const resolveLocation = useCallback(async (isUserInitiated = false) => {
    let gpsResolved = false;

    const handleCoordsSuccess = async (pos: GeolocationPosition) => {
      gpsResolved = true;
      const { latitude, longitude, accuracy } = pos.coords;

      let detectedCity = 'My Location';
      let detectedCountry = '';
      try {
        const revRes = await fetch(`/api/location/reverse?lat=${latitude}&lng=${longitude}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData.city) {
            detectedCity = revData.city;
            detectedCountry = revData.country || '';
          }
        }
      } catch (e) {
        console.error('Reverse geocode error:', e);
      }

      setCurrentUser((prev) => ({
        ...prev,
        location: {
          city: detectedCity,
          country: detectedCountry,
          lat: latitude,
          lng: longitude,
          isApproximate: false,
          accuracy: accuracy ? Math.round(accuracy) : undefined,
        },
      }));
    };

    const fetchIpLocation = async () => {
      if (gpsResolved) return;
      try {
        const res = await fetch('/api/location');
        if (res.ok && !gpsResolved) {
          const data = await res.json();
          if (data && data.lat && data.lng) {
            setCurrentUser((prev) => {
              if (prev.location.isApproximate === false) return prev;
              return {
                ...prev,
                location: {
                  city: data.city || 'City',
                  country: data.country || 'Country',
                  region: data.region || '',
                  lat: data.lat,
                  lng: data.lng,
                  isApproximate: true,
                },
              };
            });
          }
        }
      } catch (err) {
        console.error('IP location error:', err);
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      // 1. Try high accuracy GPS (satellite / hardware)
      navigator.geolocation.getCurrentPosition(
        handleCoordsSuccess,
        (err) => {
          console.warn('High-accuracy GPS note:', err.message, '- retrying with standard accuracy');
          // 2. Retry with standard Wi-Fi/cellular triangulation
          navigator.geolocation.getCurrentPosition(
            handleCoordsSuccess,
            (err2) => {
              console.warn('Standard geolocation failed:', err2.message, '- falling back to IP');
              if (!isUserInitiated) {
                fetchIpLocation();
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 8000,
              maximumAge: 60000,
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    } else {
      fetchIpLocation();
    }
  }, []);

  useEffect(() => {
    resolveLocation();

    // Continuous watchPosition: refines location if precision improves
    let watchId: number | null = null;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          async (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            let detectedCity: string | undefined;
            try {
              const revRes = await fetch(`/api/location/reverse?lat=${latitude}&lng=${longitude}`);
              if (revRes.ok) {
                const revData = await revRes.json();
                if (revData.city) detectedCity = revData.city;
              }
            } catch (e) {
              // Ignore
            }

            setCurrentUser((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                city: detectedCity || prev.location.city,
                lat: latitude,
                lng: longitude,
                isApproximate: false,
                accuracy: accuracy ? Math.round(accuracy) : undefined,
              },
            }));
          },
          (err) => console.log('watchPosition note:', err.message),
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } catch (e) {
        // Ignored
      }
    }

    return () => {
      if (watchId !== null && typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [resolveLocation]);

  // 2. Poll Spotify Playback & Profile (with tab visibility check and adaptive interval)
  const checkSpotify = useCallback(async () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    try {
      const res = await fetch('/api/spotify/now-playing');
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setIsSpotifyConnected(true);
          if (data.user?.name || data.user?.avatar) {
            setRealProfile((prev) => {
              if (prev.name === data.user.name && prev.avatar === data.user.avatar) {
                return prev;
              }
              return {
                name: data.user.name || 'Listener',
                avatar: data.user.avatar,
              };
            });
          }
          setCurrentUser((prev) => {
            const newTrackId = data.track?.id;
            const prevTrackId = prev.nowPlaying?.id;
            const newIsPlaying = data.isPlaying ?? false;
            if (
              prev.id === (data.user?.id || prev.id) &&
              prevTrackId === newTrackId &&
              prev.nowPlaying?.isPlaying === newIsPlaying
            ) {
              return prev; // Same state, skip re-render
            }
            return {
              ...prev,
              id: data.user?.id || prev.id,
              name: data.user?.name || prev.name,
              avatar: data.user?.avatar || prev.avatar,
              nowPlaying: data.track || null,
            };
          });
          if (data.isPlaying !== undefined) {
            setIsPlaying(data.isPlaying);
          }
        } else {
          setIsSpotifyConnected(false);
        }
      }
    } catch (err) {
      console.error('Spotify poll error:', err);
    }
  }, []);

  useEffect(() => {
    // Check if returned from Spotify OAuth
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('spotify_connected') === 'true') {
        setIsSpotifyConnected(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    checkSpotify();
    // Poll every 10s if Spotify is active, or 25s if disconnected to save bandwidth
    const interval = setInterval(checkSpotify, isSpotifyConnected ? 10000 : 25000);
    return () => clearInterval(interval);
  }, [checkSpotify, isSpotifyConnected]);

  // Compute effective user object for public display & presence broadcasting (memoized)
  const effectiveCurrentUser: MapUser = useMemo(() => ({
    ...currentUser,
    name: isAnonymous ? 'Anonymous Listener' : (realProfile.name || currentUser.name || 'You'),
    avatar: isAnonymous ? undefined : (realProfile.avatar || currentUser.avatar),
    isAnonymous,
  }), [currentUser, isAnonymous, realProfile]);

  // Keep refs synchronized so background interval timers don't recreate on every render
  const effectiveCurrentUserRef = useRef(effectiveCurrentUser);
  useEffect(() => {
    effectiveCurrentUserRef.current = effectiveCurrentUser;
  }, [effectiveCurrentUser]);

  const broadcastLocationRef = useRef(broadcastLocation);
  useEffect(() => {
    broadcastLocationRef.current = broadcastLocation;
  }, [broadcastLocation]);

  // 3. Real Presence Sync (runs on clean interval without restarting on every render)
  useEffect(() => {
    const syncPresence = async () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      const user = effectiveCurrentUserRef.current;
      if (broadcastLocationRef.current && user.location.city !== 'Locating...') {
        try {
          await fetch('/api/presence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          });
        } catch (e) { }
      }

      try {
        const res = await fetch('/api/presence');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.users)) {
            const currentUserId = user.id;
            const filtered = data.users.filter(
              (u: MapUser) =>
                u.id !== currentUserId &&
                (!deviceId || (u.deviceId !== deviceId && u.id !== deviceId)) &&
                !u.isSelf
            );
            setActiveUsers((prev) => {
              if (
                prev.length === filtered.length &&
                prev.every((u, i) => u.id === filtered[i].id && u.nowPlaying?.id === filtered[i].nowPlaying?.id)
              ) {
                return prev; // Same users and songs, skip re-render
              }
              return filtered;
            });
          }
        }
      } catch (e) { }
    };

    syncPresence();
    const interval = setInterval(syncPresence, 12000);
    return () => clearInterval(interval);
  }, [deviceId]);

  // 4. Real Chat Polling (only updates state when new messages arrive)
  const fetchChat = useCallback(async () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    try {
      const res = await fetch('/api/chat?channel=global');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setGlobalMessages((prev) => {
            if (
              prev.length === data.messages.length &&
              (prev.length === 0 || prev[prev.length - 1]?.id === data.messages[data.messages.length - 1]?.id)
            ) {
              return prev; // Same messages, skip re-render
            }
            return data.messages;
          });
        }
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 6000);
    return () => clearInterval(interval);
  }, [fetchChat]);

  // Send Message
  const handleSendGlobalMessage = async (text: string, trackAttachment?: Track | null) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: effectiveCurrentUser.id,
          senderName: isAnonymous ? 'Anonymous Listener' : effectiveCurrentUser.name,
          senderAvatar: isAnonymous ? undefined : effectiveCurrentUser.avatar,
          senderCity: effectiveCurrentUser.location.city,
          text,
          channelId: 'global',
          trackAttachment,
          isAnonymous,
        }),
      });
      if (res.ok) {
        fetchChat();
      }
    } catch (e) { }
  };

  const handleSendDirectMessage = (recipientId: string, text: string, trackAttachment?: Track | null) => {
    // Prevent chatting with yourself
    if (recipientId === currentUser.id || (deviceId && recipientId === deviceId)) {
      return;
    }

    const newMsg: ChatMessage = {
      id: `dm-${Date.now()}`,
      senderId: effectiveCurrentUser.id,
      senderName: isAnonymous ? 'Anonymous Listener' : effectiveCurrentUser.name,
      senderAvatar: isAnonymous ? undefined : effectiveCurrentUser.avatar,
      senderCity: effectiveCurrentUser.location.city,
      text,
      timestamp: Date.now(),
      channelId: `dm_${recipientId}`,
      trackAttachment,
      isAnonymous,
    };

    setDirectMessages((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMsg],
    }));
  };

  const handleConnectSpotify = () => {
    window.location.href = '/api/spotify/login';
  };

  const handleDisconnectSpotify = async () => {
    await fetch('/api/spotify/disconnect', { method: 'POST' });
    setIsSpotifyConnected(false);
    setCurrentUser((prev) => ({
      ...prev,
      nowPlaying: null,
    }));
  };

  const totalListeners = activeUsers.length + (broadcastLocation ? 1 : 0);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Clean Minimal Apple/Airbnb Header */}
      <Header
        currentUser={effectiveCurrentUser}
        activeCount={totalListeners}
        isSpotifyConnected={isSpotifyConnected}
        onConnectSpotify={handleConnectSpotify}
        onDisconnectSpotify={handleDisconnectSpotify}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        onRecenterSelf={() => resolveLocation(true)}
        isAnonymous={isAnonymous}
        onToggleAnonymous={handleToggleAnonymous}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        profileName={realProfile.name || (currentUser.name !== 'Anonymous Listener' ? currentUser.name : '') || 'Listener'}
        profileAvatar={realProfile.avatar || currentUser.avatar}
      />

      {/* Clean Vector Map */}
      <MapViewer
        users={activeUsers}
        currentUser={broadcastLocation ? effectiveCurrentUser : null}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onRefreshLocation={() => resolveLocation(true)}
        isRightPanelOpen={isRightPanelOpen}
        theme={theme}
      />

      {/* Listener Detail Flyout */}
      <UserCardModal
        user={selectedUser}
        currentUserId={effectiveCurrentUser.id}
        onClose={() => setSelectedUser(null)}
        onOpenDm={(user) => {
          if (user.id !== effectiveCurrentUser.id && (!deviceId || user.deviceId !== deviceId)) {
            setActiveDmUser(user);
            setIsRightPanelOpen(true);
          }
        }}
      />

      {/* Mobile & Tablet Backdrop for Sidebar Drawer */}
      {isRightPanelOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsRightPanelOpen(false)}
          aria-label="Close Sidebar Backdrop"
        />
      )}

      {/* Dedicated Right Chat & Discovery Block */}
      <RightPanel
        currentUser={effectiveCurrentUser}
        users={activeUsers}
        globalMessages={globalMessages}
        directMessages={directMessages}
        onSendGlobalMessage={handleSendGlobalMessage}
        onSendDirectMessage={handleSendDirectMessage}
        activeDmUser={activeDmUser}
        onSelectDmUser={setActiveDmUser}
        onFlyToUser={(user) => setSelectedUser(user)}
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        isAnonymous={isAnonymous}
        onToggleAnonymous={handleToggleAnonymous}
      />

      {/* Apple Music Floating Dynamic Island Player */}
      <PlayerDeck
        currentTrack={effectiveCurrentUser.nowPlaying || null}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onShareTrackToChat={(track) => {
          handleSendGlobalMessage(`Listening to "${track.title}" by ${track.artist} 🎵`, track);
          setIsRightPanelOpen(true);
        }}
        broadcastLocation={broadcastLocation}
        onToggleBroadcast={() => setBroadcastLocation(!broadcastLocation)}
        isSpotifyConnected={isSpotifyConnected}
      />
    </main>
  );
}
