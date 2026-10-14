'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import { MapUser } from '@/types';
import { Crosshair, Box } from 'lucide-react';

if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

interface MapViewerProps {
  users: MapUser[];
  currentUser: MapUser | null;
  selectedUser: MapUser | null;
  onSelectUser: (user: MapUser) => void;
  onRefreshLocation?: () => void;
  isRightPanelOpen?: boolean;
  theme?: 'dark' | 'light';
}

export default function MapViewer({
  users,
  currentUser,
  selectedUser,
  onSelectUser,
  onRefreshLocation,
  isRightPanelOpen,
  theme = 'dark',
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const hasCenteredOnAccurateLocation = useRef(false);

  // Resize map smoothly when right panel opens or closes
  useEffect(() => {
    if (map.current) {
      const timer = setTimeout(() => {
        map.current?.resize();
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isRightPanelOpen]);

  // Dynamically update map style when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const styleUrl =
      theme === 'light'
        ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
    map.current.setStyle(styleUrl);
  }, [theme, mapLoaded]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initialLng = currentUser?.location.lng ?? 78.4867;
    const initialLat = currentUser?.location.lat ?? 17.3850;

    const initialStyleUrl =
      theme === 'light'
        ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    const mapInstance = new MapLibreMap({
      container: mapContainer.current,
      style: initialStyleUrl,
      center: [initialLng, initialLat],
      zoom: 3.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    mapInstance.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'bottom-right'
    );

    mapInstance.on('load', () => {
      setMapLoaded(true);

      // Attempt to add 3D building extrusions if vector data exists
      try {
        const layers = mapInstance.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout && (layer.layout as Record<string, unknown>)['text-field']
        )?.id;

        if (!mapInstance.getLayer('3d-buildings') && mapInstance.getSource('carto')) {
          mapInstance.addLayer(
            {
              id: '3d-buildings',
              source: 'carto',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 13,
              paint: {
                'fill-extrusion-color': '#202028',
                'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 16, ['get', 'render_height']],
                'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 13, 0, 16, ['get', 'render_min_height']],
                'fill-extrusion-opacity': 0.85,
              },
            },
            labelLayerId
          );
        }
      } catch (e) {
        // Fallback gracefully if building layer is not available
      }
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Center on current user when location is known (zoom in close when real GPS is obtained)
  useEffect(() => {
    if (!map.current || !currentUser || !mapLoaded) return;

    if (!currentUser.location.isApproximate && !hasCenteredOnAccurateLocation.current) {
      hasCenteredOnAccurateLocation.current = true;
      map.current.flyTo({
        center: [currentUser.location.lng, currentUser.location.lat],
        zoom: 14.5,
        speed: 1.4,
        pitch: is3D ? 60 : 0,
      });
    } else if (currentUser.location.isApproximate && !hasCenteredOnAccurateLocation.current) {
      map.current.flyTo({
        center: [currentUser.location.lng, currentUser.location.lat],
        zoom: 5.5,
        speed: 1.2,
        pitch: is3D ? 60 : 0,
      });
    }
  }, [currentUser?.location.lat, currentUser?.location.lng, currentUser?.location.isApproximate, mapLoaded, is3D]);

  // Handle selected user fly-to
  useEffect(() => {
    if (!map.current || !selectedUser) return;
    map.current.flyTo({
      center: [selectedUser.location.lng, selectedUser.location.lat],
      zoom: 14,
      speed: 1.2,
      pitch: is3D ? 60 : 0,
    });
  }, [selectedUser, is3D]);

  // Toggle 3D Perspective Mode
  const toggle3D = () => {
    if (!map.current) return;
    const nextState = !is3D;
    setIs3D(nextState);
    map.current.easeTo({
      pitch: nextState ? 60 : 0,
      bearing: nextState ? 25 : 0,
      duration: 1000,
    });
  };

  // Sync Markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const allUsers = [...users];
    if (currentUser && !allUsers.some((u) => u.id === currentUser.id)) {
      allUsers.push(currentUser);
    }

    const currentMarkerIds = new Set(Object.keys(markersRef.current));
    const newMarkerIds = new Set(allUsers.map((u) => u.id));

    // Remove deleted markers
    currentMarkerIds.forEach((id) => {
      if (!newMarkerIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    allUsers.forEach((user) => {
      const isSelf = user.id === currentUser?.id;
      const isPlaying = !!user.nowPlaying?.isPlaying;

      if (!markersRef.current[user.id]) {
        const el = document.createElement('div');
        el.className = 'clean-map-marker';
        el.style.position = 'relative';
        el.style.cursor = 'pointer';
        el.style.width = '36px';
        el.style.height = '36px';

        const marker = new Marker({ element: el })
          .setLngLat([user.location.lng, user.location.lat])
          .addTo(map.current!);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectUser(user);
        });

        markersRef.current[user.id] = marker;
      }

      const markerEl = markersRef.current[user.id].getElement();
      const isAnon = user.isAnonymous || user.name === 'Anonymous Listener';
      const isLight = theme === 'light';
      const borderColor = isSelf
        ? (isAnon ? '#c084fc' : '#1db954')
        : (isAnon ? '#a855f7' : (isLight ? '#334155' : '#ffffff'));

      markerEl.innerHTML = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          ${isSelf && !user.location.isApproximate ? '<div class="gps-accuracy-ring"></div>' : ''}
          ${isPlaying ? `<div class="marker-pulse" style="${isAnon ? 'background: rgba(168, 85, 247, 0.4);' : ''}"></div>` : ''}
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${isLight ? '#ffffff' : '#18181b'};
            border: 2px solid ${borderColor};
            overflow: hidden;
            box-shadow: ${isLight ? '0 2px 10px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
          ">
            ${isAnon
              ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%);">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>
                 </div>`
              : user.avatar
                ? `<img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;object-fit:cover;" />`
                : `<span style="font-size:12px;color:#1db954;font-weight:700;">${user.name.charAt(0)}</span>`
            }
          </div>

          <!-- Mini Tooltip -->
          <div class="marker-hover-tip" style="
            position: absolute;
            bottom: 42px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isLight ? '#ffffff' : '#18181b'};
            border: 1px solid ${isAnon ? '#7c3aed' : (isLight ? '#e2e8f0' : '#27272a')};
            color: ${isLight ? '#0f172a' : '#ffffff'};
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
            box-shadow: ${isLight ? '0 4px 14px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.5)'};
            z-index: 10;
          ">
            ${isSelf ? (isAnon ? 'You (Ghost)' : 'You') : (isAnon ? 'Anonymous Listener' : user.name)} • ${user.location.city}${isSelf && user.location.accuracy ? ` (±${user.location.accuracy}m)` : ''}
            ${user.nowPlaying ? ` • ♫ ${user.nowPlaying.title}` : ''}
          </div>
        </div>
      `;

      markerEl.onmouseenter = () => {
        const tip = markerEl.querySelector('.marker-hover-tip') as HTMLElement;
        if (tip) tip.style.opacity = '1';
      };
      markerEl.onmouseleave = () => {
        const tip = markerEl.querySelector('.marker-hover-tip') as HTMLElement;
        if (tip) tip.style.opacity = '0';
      };

      markersRef.current[user.id].setLngLat([user.location.lng, user.location.lat]);
    });
  }, [users, currentUser, selectedUser, mapLoaded, theme]);

  // Center on Me
  const centerOnSelf = () => {
    if (!map.current || !currentUser) return;
    const targetZoom = currentUser.location.isApproximate ? 11 : 15;
    map.current.flyTo({
      center: [currentUser.location.lng, currentUser.location.lat],
      zoom: targetZoom,
      speed: 1.4,
      pitch: is3D ? 60 : 0,
    });
    if (onRefreshLocation) {
      onRefreshLocation();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Floating Bottom-Left Controls: 3D View & My Location */}
      <div className="map-controls-container">
        {/* 3D Perspective Toggle Button */}
        <button
          onClick={toggle3D}
          className="apple-pill-btn"
          style={{
            borderColor: is3D ? 'rgba(29, 185, 84, 0.4)' : 'var(--border-glass)',
            color: is3D ? 'var(--spotify-green)' : 'var(--text-primary)',
            background: is3D ? 'rgba(29, 185, 84, 0.14)' : 'var(--panel-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          title={is3D ? 'Switch to 2D Top-Down View' : 'Switch to 3D Perspective Angle'}
        >
          <Box size={13} color={is3D ? 'var(--spotify-green)' : 'var(--text-muted)'} />
          <span>{is3D ? '3D Active' : '3D View'}</span>
        </button>

        {/* Recenter Button */}
        {currentUser && (
          <button
            onClick={centerOnSelf}
            className="apple-pill-btn"
            style={{
              background: 'var(--panel-bg)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            title="Center on my location"
          >
            <Crosshair size={13} color="var(--spotify-green)" />
            <span>My Location</span>
          </button>
        )}
      </div>
    </div>
  );
}
