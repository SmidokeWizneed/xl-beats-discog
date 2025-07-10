import { Album, SourcePlatform, Track } from '../types';

const tracks: Track[] = [
  {
    id: 'xlb001',
    title: 'Flint Town Hustle',
    artist: 'XL Beats',
    album: 'Concrete Dreams',
    albumArtUrl: 'https://picsum.photos/seed/xlb001/500/500',
    duration: 185,
    sources: [
      { platform: SourcePlatform.YOUTUBE, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isEmbeddable: true },
      { platform: SourcePlatform.SPOTIFY, url: '#', isEmbeddable: false },
    ],
  },
  {
    id: 'xlb002',
    title: '810 Freeway',
    artist: 'XL Beats ft. Rudeboi Slymm',
    album: 'Concrete Dreams',
    albumArtUrl: 'https://picsum.photos/seed/xlb001/500/500',
    duration: 210,
    sources: [
      { platform: SourcePlatform.YOUTUBE, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isEmbeddable: true },
      { platform: SourcePlatform.SPOTIFY, url: '#', isEmbeddable: false },
      { platform: SourcePlatform.APPLE_MUSIC, url: '#', isEmbeddable: false },
    ],
  },
  {
    id: 'xlb003',
    title: 'Chevy in the Hole',
    artist: 'XL Beats',
    album: 'Concrete Dreams',
    albumArtUrl: 'https://picsum.photos/seed/xlb001/500/500',
    duration: 192,
    sources: [{ platform: SourcePlatform.SPOTIFY, url: '#', isEmbeddable: false }],
  },
  {
    id: 'xlb004',
    title: 'Platinum Bronco',
    artist: 'XL Beats',
    album: 'Vaporwave Nights',
    albumArtUrl: 'https://picsum.photos/seed/xlb004/500/500',
    duration: 220,
    sources: [
      { platform: SourcePlatform.YOUTUBE, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isEmbeddable: true },
    ],
  },
   {
    id: 'xlb005',
    title: 'Slay Ride',
    artist: 'XL Beats',
    album: 'Vaporwave Nights',
    albumArtUrl: 'https://picsum.photos/seed/xlb004/500/500',
    duration: 205,
    sources: [
      { platform: SourcePlatform.YOUTUBE, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isEmbeddable: true },
      { platform: SourcePlatform.BEATSTARS, url: '#', isEmbeddable: false },
    ],
  },
];

export const albums: Album[] = [
  {
    id: 'album01',
    name: 'Concrete Dreams',
    artist: 'XL Beats',
    year: 2023,
    albumArtUrl: 'https://picsum.photos/seed/xlb001/500/500',
    tracks: tracks.filter(t => t.album === 'Concrete Dreams'),
  },
  {
    id: 'album02',
    name: 'Vaporwave Nights',
    artist: 'XL Beats',
    year: 2021,
    albumArtUrl: 'https://picsum.photos/seed/xlb004/500/500',
    tracks: tracks.filter(t => t.album === 'Vaporwave Nights'),
  },
];

export const singles: Track[] = [
    {
        id: 'xls01',
        title: 'Summer in the City',
        artist: 'XL Beats',
        album: 'Single',
        albumArtUrl: 'https://picsum.photos/seed/xls01/500/500',
        duration: 180,
        sources: [
            { platform: SourcePlatform.YOUTUBE, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isEmbeddable: true },
            { platform: SourcePlatform.SPOTIFY, url: '#', isEmbeddable: false },
        ]
    }
];