export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
  previewUrl?: string;
  spotifyUrl?: string;
}

export interface UserLocation {
  city: string;
  country: string;
  region?: string;
  lat: number;
  lng: number;
  isApproximate: boolean;
  accuracy?: number;
}

export interface MapUser {
  id: string;
  deviceId?: string;
  name: string;
  avatar?: string;
  location: UserLocation;
  nowPlaying?: Track | null;
  lastActive: number;
  isSelf?: boolean;
  isAnonymous?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderCity?: string;
  text: string;
  timestamp: number;
  channelId: string; // 'global' or 'dm_{userId}'
  trackAttachment?: Track | null;
  isAnonymous?: boolean;
}
