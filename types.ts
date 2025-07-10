import React from 'react';

export enum SourcePlatform {
  YOUTUBE = 'YouTube',
  SPOTIFY = 'Spotify',
  APPLE_MUSIC = 'Apple Music',
  BEATSTARS = 'BeatStars',
  OTHER = 'Other',
}

export interface Source {
  platform: SourcePlatform;
  url: string;
  isEmbeddable: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  duration: number; // in seconds
  sources: Source[];
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  year: number;
  albumArtUrl: string;
  tracks: Track[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: string;
  icon: React.ReactNode;
  earned: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success';
}

export enum AppTheme {
  XL_BEATS = 'xl-beats',
  PLATINUM_BRONCO_SLAY = 'platinum-bronco-slay',
  SWINN_OR_LOSE = 'swinn-or-lose',
  BOBBY_OCHOA = 'bobby-ochoa',
  RUDEBOI_SLYMM = 'rudeboi-slymm',
  THE_CIRCLE_BOYZ = 'the-circle-boyz',
}

export interface IndexedTrack {
  trackTitle: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}