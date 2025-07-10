import React from 'react';
import { Badge, SourcePlatform } from './types';

export const ADMIN_EMAIL = 'xlathon@gmail.com';

export const IconPlay = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M8 5v14l11-7z" })
  )
);

export const IconPause = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" })
  )
);

export const IconNext = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { d: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" })
    )
);

export const IconPrev = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { d: "M6 6h2v12H6zm3.5 6l8.5 6V6z" })
    )
);

export const IconShuffle = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { d: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" })
    )
);

export const IconRepeat = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { d: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" })
    )
);

export const IconExternalLink = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504-1.125-1.125-1.125h-4.5A1.125 1.125 0 0110.5 10.5z" })
    )
);

export const IconUpvote = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);

export const IconUpvoteFilled = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { fillRule: "evenodd", d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z", clipRule: "evenodd" })
    )
);

export const IconShare = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.044.586.06.353.033.715.055 1.08.069 1.06.033 2.137.063 3.204.088 1.487.034 2.97.085 4.44.137m-6.118-2.518a2.25 2.25 0 10-4.305 1.332A2.25 2.25 0 007.217 10.907zM11.695 14.707a2.25 2.25 0 10-2.186 0m2.186 0c.025-.195.044-.39.06-.586.033-.353.055-.715.069-1.08.033-1.06.063-2.137.088-3.204.034-1.487.085-2.97.137-4.44m-6.118 10.985a2.25 2.25 0 104.305-1.332A2.25 2.25 0 0011.695 14.707z" })
  )
);

export const IconSearch = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" })
    )
);

export const IconMenu = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" })
    )
);


export const IconYouTube = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" })
  )
);

export const IconSpotify = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
        React.createElement("path", { d: "M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.183 14.232c-.276.432-.828.576-1.26.3-2.94-1.8-6.6-2.22-10.92-1.224-.528.12-.996-.204-1.116-.732-.12-.528.204-.996.732-1.116 4.704-1.092 8.784-.6 11.976 1.38.432.276.576.828.3 1.26l-.272.132zm1.14-2.592c-.336.516-1.008.684-1.524.348-3.3-2.028-8.328-2.604-12.384-1.416-.624.18-.126-.408.204-1.032.18-.624.816-1.02 1.44-.84 4.5.12 9.948.792 13.62 3.108.516.336.684 1.008.348 1.524l-.3.492zm.12-2.736C12.912 8.676 6.78 8.448 3.972 9.324c-.72.216-1.464-.204-1.68-.924-.216-.72.204-1.464.924-1.68C7.128 5.7 13.8 5.928 17.652 8.04c.648.36 1.296.06 1.08-1.02.36-.648.06-1.296-1.02-1.08l.6.36z" })
    )
);

export const PLATFORM_ICONS: { [key in SourcePlatform]?: React.FC<React.SVGProps<SVGSVGElement>> } = {
  [SourcePlatform.YOUTUBE]: IconYouTube,
  [SourcePlatform.SPOTIFY]: IconSpotify,
};

export const IconAward = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);

export const IconMapPin = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" })
    )
);

export const IconDisc = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 9l10.5-3m0 6.563l-10.5 3M9 9v.01M9 15v.01M15 9v.01M15 15v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);

export const IconVolumeUp = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" })
    )
);

export const IconVolumeMute = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { ...props, fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-3l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" })
    )
);


export const INITIAL_BADGES: Badge[] = [
  {
    id: 'collector',
    name: 'Collector',
    description: 'You\'ve got good taste. Keep curating your favorites list.',
    criteria: 'Upvote 5 different songs.',
    icon: React.createElement(IconAward, { className: 'h-8 w-8' }),
    earned: false,
  },
  {
    id: 'flint-ambassador',
    name: 'Flint Ambassador',
    description: 'You\'re exploring the catalog and repping the 810.',
    criteria: 'Play 8 unique tracks.',
    icon: React.createElement(IconMapPin, { className: 'h-8 w-8' }),
    earned: false,
  },
  {
    id: 'album-completer',
    name: 'Album Completer',
    description: 'Full spin, no skips. A true listener.',
    criteria: 'Listen to an entire album from start to finish.',
    icon: React.createElement(IconDisc, { className: 'h-8 w-8' }),
    earned: false,
  },
  {
    id: 'retro-futurist',
    name: 'Retro Futurist',
    description: 'Vibing with the retro wave.',
    criteria: "Play all tracks from the 'Vaporwave Nights' album.",
    icon: React.createElement(IconDisc, { className: 'h-8 w-8' }),
    earned: false,
   },
   {
    id: 'day-one',
    name: 'Day One',
    description: 'Down since the Concrete Dreams.',
    criteria: "Play all tracks from the 'Concrete Dreams' album.",
    icon: React.createElement(IconDisc, { className: 'h-8 w-8' }),
    earned: false,
   },
];