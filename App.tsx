import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Album, AppTheme, Badge, Track, Source, SourcePlatform, IndexedTrack, ToastNotification } from './types';
import { albums as initialAlbums, singles as initialSingles } from './data/musicData';
import { ADMIN_EMAIL, IconPlay, IconPause, IconNext, IconPrev, IconShuffle, IconRepeat, IconExternalLink, PLATFORM_ICONS, IconYouTube, IconUpvote, IconUpvoteFilled, IconShare, INITIAL_BADGES, IconSearch, IconMenu, IconVolumeUp, IconVolumeMute } from './constants';
import { indexTracksWithGemini, generateBadgesWithGemini } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

enum RepeatMode {
    OFF = 'off',
    ALL = 'all',
    ONE = 'one',
}

// --- THEME CONTEXT ---
interface ThemeStyle {
  bg: string;
  text: string;
  card: string;
  // Accent styles
  accentText: string;
  accentBg: string;
  accentBgHover: string;
  accentRing: string;
  accentShadow: string;
  accentActiveBg: string;
  accentBorder: string;
  accentRange: string;
  accentChartFill: string;
}

const ThemeContext = createContext<{ theme: AppTheme; setTheme: (theme: AppTheme) => void; }>({
    theme: AppTheme.XL_BEATS,
    setTheme: () => {},
});

const THEME_CLASSES: { [key in AppTheme]: ThemeStyle } = {
    [AppTheme.XL_BEATS]: {
        bg: 'bg-black', text: 'text-gray-100', card: 'bg-gray-900',
        accentText: 'text-amber-500',
        accentBg: 'bg-amber-600',
        accentBgHover: 'hover:bg-amber-700',
        accentRing: 'focus:ring-amber-500',
        accentShadow: 'shadow-amber-900/50',
        accentActiveBg: 'bg-amber-600/20',
        accentBorder: 'border-amber-500',
        accentRange: 'accent-amber-600',
        accentChartFill: '#f59e0b', // amber-500
    },
    [AppTheme.PLATINUM_BRONCO_SLAY]: {
        bg: 'bg-slate-900', text: 'text-sky-100', card: 'bg-slate-800',
        accentText: 'text-sky-400',
        accentBg: 'bg-sky-500',
        accentBgHover: 'hover:bg-sky-600',
        accentRing: 'focus:ring-sky-500',
        accentShadow: 'shadow-sky-900/50',
        accentActiveBg: 'bg-sky-500/20',
        accentBorder: 'border-sky-400',
        accentRange: 'accent-sky-500',
        accentChartFill: '#38bdf8', // sky-400
    },
    [AppTheme.SWINN_OR_LOSE]: {
        bg: 'bg-green-900', text: 'text-yellow-200', card: 'bg-green-800',
        accentText: 'text-orange-400', accentBg: 'bg-orange-500', accentBgHover: 'hover:bg-orange-600', accentRing: 'focus:ring-orange-500', accentShadow: 'shadow-orange-900/50', accentActiveBg: 'bg-orange-500/20', accentBorder: 'border-orange-400', accentRange: 'accent-orange-500', accentChartFill: '#fb923c'
    },
    [AppTheme.BOBBY_OCHOA]: {
        bg: 'bg-blue-900', text: 'text-white', card: 'bg-blue-800',
        accentText: 'text-teal-300', accentBg: 'bg-teal-400', accentBgHover: 'hover:bg-teal-500', accentRing: 'focus:ring-teal-400', accentShadow: 'shadow-teal-900/50', accentActiveBg: 'bg-teal-400/20', accentBorder: 'border-teal-300', accentRange: 'accent-teal-400', accentChartFill: '#5eead4'
    },
    [AppTheme.RUDEBOI_SLYMM]: {
        bg: 'bg-purple-900', text: 'text-gray-200', card: 'bg-purple-800',
        accentText: 'text-lime-400', accentBg: 'bg-lime-500', accentBgHover: 'hover:bg-lime-600', accentRing: 'focus:ring-lime-500', accentShadow: 'shadow-lime-900/50', accentActiveBg: 'bg-lime-500/20', accentBorder: 'border-lime-400', accentRange: 'accent-lime-500', accentChartFill: '#a3e635'
    },
    [AppTheme.THE_CIRCLE_BOYZ]: {
        bg: 'bg-yellow-900', text: 'text-black', card: 'bg-yellow-800',
        accentText: 'text-red-700', accentBg: 'bg-red-600', accentBgHover: 'hover:bg-red-700', accentRing: 'focus:ring-red-600', accentShadow: 'shadow-red-900/50', accentActiveBg: 'bg-red-600/20', accentBorder: 'border-red-700', accentRange: 'accent-red-600', accentChartFill: '#b91c1c'
    },
};

// --- TOAST CONTEXT ---
const ToastContainer: React.FC<{ toasts: ToastNotification[] }> = ({ toasts }) => (
    <div className="fixed top-5 right-5 z-[100] space-y-2 w-full max-w-sm">
        {toasts.map(toast => (
            <div key={toast.id} className="bg-green-500 text-white font-bold p-4 rounded-lg shadow-lg animate-fade-in text-center">
                {toast.message}
            </div>
        ))}
    </div>
);

interface ToastContextType { addToast: (message: string) => void; }
const ToastContext = createContext<ToastContextType | null>(null);
const useToast = () => useContext(ToastContext)!;

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const addToast = useCallback((message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type: 'success' }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

// --- BADGES CONTEXT ---
interface BadgesContextType {
    badges: Badge[];
    unlockBadge: (badgeId: string) => void;
}
const BadgesContext = createContext<BadgesContextType | null>(null);
const useBadges = () => useContext(BadgesContext)!;

const BadgesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
    const { addToast } = useToast();

    useEffect(() => {
        const storedBadges = localStorage.getItem('xl_beats_earned_badges');
        if (storedBadges) {
            try {
                const earnedIds = new Set(JSON.parse(storedBadges));
                setBadges(prevBadges => prevBadges.map(b => ({ ...b, earned: earnedIds.has(b.id) })));
            } catch (e) { console.error("Failed to parse earned badges:", e); }
        }
    }, []);

    const unlockBadge = useCallback((badgeId: string) => {
        setBadges(prevBadges => {
            const newBadges = [...prevBadges];
            const badgeIndex = newBadges.findIndex(b => b.id === badgeId);
            if (badgeIndex !== -1 && !newBadges[badgeIndex].earned) {
                const unlockedBadge = { ...newBadges[badgeIndex], earned: true };
                newBadges[badgeIndex] = unlockedBadge;

                addToast(`Achievement Unlocked: ${unlockedBadge.name}!`);
                
                const earnedIds = newBadges.filter(b => b.earned).map(b => b.id);
                localStorage.setItem('xl_beats_earned_badges', JSON.stringify(earnedIds));
            }
            return newBadges;
        });
    }, [addToast]);

    return (
        <BadgesContext.Provider value={{ badges, unlockBadge }}>
            {children}
        </BadgesContext.Provider>
    );
};

// --- FAVORITES CONTEXT ---
interface FavoritesContextType {
    favoritedSongIds: Set<string>;
    isFavorited: (trackId: string) => boolean;
    toggleFavorite: (trackId: string) => void;
}
const FavoritesContext = createContext<FavoritesContextType | null>(null);
const useFavorites = () => useContext(FavoritesContext)!;

const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favoritedSongIds, setFavoritedSongIds] = useState<Set<string>>(new Set());
    const { unlockBadge } = useBadges();

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('xl_beats_favorited_songs');
            if (storedFavorites) {
                setFavoritedSongIds(new Set(JSON.parse(storedFavorites)));
            }
        } catch (error) {
            console.error("Failed to load favorited songs from localStorage", error);
        }
    }, []);

    const toggleFavorite = (trackId: string) => {
        setFavoritedSongIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(trackId)) {
                newIds.delete(trackId);
            } else {
                newIds.add(trackId);
                if(newIds.size >= 5) unlockBadge('collector');
            }
            try {
                localStorage.setItem('xl_beats_favorited_songs', JSON.stringify(Array.from(newIds)));
            } catch (error) {
                 console.error("Failed to save favorited songs to localStorage", error);
            }
            return newIds;
        });
    };
    
    const isFavorited = (trackId: string) => favoritedSongIds.has(trackId);
    
    return (
        <FavoritesContext.Provider value={{ favoritedSongIds, isFavorited, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// --- MUSIC PLAYER CONTEXT ---
interface MusicPlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    playTrack: (track: Track, playlist?: Track[]) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    activeSource: Source | null;
    setActiveSource: (source: Source) => void;
    trackProgress: number;
    setTrackProgress: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    isShuffle: boolean;
    repeatMode: RepeatMode;
    toggleShuffle: () => void;
    cycleRepeatMode: () => void;
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
}
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);
const useMusicPlayer = () => useContext(MusicPlayerContext)!;

const MusicPlayerProvider: React.FC<{ children: React.ReactNode; allAlbums: Album[] }> = ({ children, allAlbums }) => {
    const { setTheme } = useContext(ThemeContext);
    const { unlockBadge } = useBadges();
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<Track[]>([]);
    const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [activeSource, setActiveSource] = useState<Source | null>(null);
    const [trackProgress, setTrackProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.OFF);
    const [playedTrackIds, setPlayedTrackIds] = useState<Set<string>>(new Set());
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const storedPlayed = localStorage.getItem('xl_beats_played_tracks');
        if (storedPlayed) {
            try {
                setPlayedTrackIds(new Set(JSON.parse(storedPlayed)))
            } catch(e) { console.error(e); }
        }
    }, [])
    
    useEffect(() => {
        if(currentTrack) {
           const preferredSource = currentTrack.sources.find(s => s.isEmbeddable) || currentTrack.sources[0];
           setActiveSource(preferredSource);
           setDuration(currentTrack.duration);
           setTrackProgress(0);
        }
    }, [currentTrack]);

    useEffect(() => {
        if (currentTrack) {
            let newTheme = AppTheme.XL_BEATS;
            if (currentTrack.album === 'Vaporwave Nights') {
                newTheme = AppTheme.PLATINUM_BRONCO_SLAY;
            } else if (currentTrack.artist.includes('Rudeboi Slymm')) {
                newTheme = AppTheme.RUDEBOI_SLYMM;
            }
            setTheme(newTheme);
        } else {
            setTheme(AppTheme.XL_BEATS);
        }
    }, [currentTrack, setTheme]);

    const playTrack = (track: Track, playlist: Track[] = [track]) => {
        const newOriginalQueue = [...playlist];
        setOriginalQueue(newOriginalQueue);

        let newQueue = newOriginalQueue;
        if (isShuffle) {
            const current = track;
            let rest = newOriginalQueue.filter(t => t.id !== current.id);
            for (let i = rest.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rest[i], rest[j]] = [rest[j], rest[i]];
            }
            newQueue = [current, ...rest];
        }

        setQueue(newQueue);
        setCurrentTrack(track);
        setCurrentIndex(newQueue.findIndex(t => t.id === track.id));
        setIsPlaying(true);

        setPlayedTrackIds(prevPlayed => {
            const newPlayed = new Set(prevPlayed);
            newPlayed.add(track.id);
            localStorage.setItem('xl_beats_played_tracks', JSON.stringify(Array.from(newPlayed)));
            if (newPlayed.size >= 8) {
                unlockBadge('flint-ambassador');
            }
            return newPlayed;
        });
    };

    const togglePlay = () => {
        if (currentTrack) {
            setIsPlaying(!isPlaying);
        }
    };
    
    const playNext = useCallback(() => {
        if (queue.length === 0) return;

        if (repeatMode === RepeatMode.ONE) {
            setTrackProgress(0);
            setCurrentTrack(track => track ? { ...track } : null);
            setIsPlaying(true);
            return;
        }

        const isLastTrack = currentIndex >= queue.length - 1;

        if (isLastTrack) {
             const albumCompleted = allAlbums.find(album => 
                album.tracks.length > 1 &&
                album.tracks.length === originalQueue.length && 
                album.tracks.every(t => originalQueue.some(qt => qt.id === t.id))
            );
            if (albumCompleted) {
                unlockBadge('album-completer');
                if (albumCompleted.name === 'Vaporwave Nights') unlockBadge('retro-futurist');
                if (albumCompleted.name === 'Concrete Dreams') unlockBadge('day-one');
            }

            if (repeatMode === RepeatMode.ALL) {
                const nextIndex = 0;
                setCurrentIndex(nextIndex);
                setCurrentTrack(queue[nextIndex]);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        } else {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentTrack(queue[nextIndex]);
            setIsPlaying(true);
        }
    }, [queue, currentIndex, repeatMode, unlockBadge, originalQueue, allAlbums]);

    const playPrev = () => {
        if (queue.length === 0) return;
        const isFirstTrack = currentIndex === 0;
        if (isFirstTrack && repeatMode !== RepeatMode.ALL) {
            setTrackProgress(0);
            return;
        }
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentIndex(prevIndex);
        setCurrentTrack(queue[prevIndex]);
        setIsPlaying(true);
    };

    const toggleShuffle = () => {
        const newShuffleState = !isShuffle;
        setIsShuffle(newShuffleState);

        if (!currentTrack) return;

        if (newShuffleState) {
            const shuffled = [...originalQueue];
            const current = shuffled.splice(originalQueue.findIndex(t => t.id === currentTrack.id), 1)[0];
             for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const newQueue = [current, ...shuffled];
            setQueue(newQueue);
            setCurrentIndex(0);
        } else {
            setQueue(originalQueue);
            setCurrentIndex(originalQueue.findIndex(t => t.id === currentTrack.id));
        }
    };

    const cycleRepeatMode = () => {
        setRepeatMode(current => {
            if (current === RepeatMode.OFF) return RepeatMode.ALL;
            if (current === RepeatMode.ALL) return RepeatMode.ONE;
            return RepeatMode.OFF;
        });
    };

    return (
        <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, playNext, playPrev, activeSource, setActiveSource, trackProgress, setTrackProgress, duration, isShuffle, repeatMode, toggleShuffle, cycleRepeatMode, volume, setVolume }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

// --- HELPER COMPONENTS ---

const SourceIcon: React.FC<{ source: Source; className?: string }> = ({ source, className = "h-5 w-5" }) => {
    const Icon = PLATFORM_ICONS[source.platform];
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    if (Icon) {
        return <Icon className={`${className} ${themeStyle.text}`} />;
    }
    return <span className={`text-xs ${themeStyle.text}`}>{source.platform}</span>;
};

const TrackItem: React.FC<{ track: Track; onPlay: (track: Track) => void; isPlaying: boolean; currentTrackId?: string; }> = ({ track, onPlay, isPlaying, currentTrackId }) => {
    const { theme } = useContext(ThemeContext);
    const { isFavorited, toggleFavorite } = useFavorites();
    const themeStyle = THEME_CLASSES[theme];
    const primarySource = track.sources.find(s => s.isEmbeddable) || track.sources[0];
    const needsRedirect = !primarySource.isEmbeddable;
    const isActive = track.id === currentTrackId;

    return (
        <div className={`flex items-center p-3 rounded-lg transition-colors duration-300 ${isActive ? themeStyle.accentActiveBg : `hover:${themeStyle.card} hover:bg-opacity-50`}`}>
            <button onClick={() => onPlay(track)} className="mr-4">
                {isActive && isPlaying ? <IconPause className={`h-6 w-6 ${themeStyle.accentText}`} /> : <IconPlay className={`h-6 w-6 text-gray-400 hover:${themeStyle.accentText}`} />}
            </button>
            <img src={track.albumArtUrl} alt={track.album} className="h-12 w-12 rounded-md object-cover mr-4"/>
            <div className="flex-grow">
                <p className={`font-bold ${isActive ? themeStyle.accentText : themeStyle.text}`}>{track.title}</p>
                <p className="text-sm text-gray-400">{track.artist}</p>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
                 <button onClick={() => toggleFavorite(track.id)} className="group">
                    {isFavorited(track.id) ? 
                        <IconUpvoteFilled className={`h-6 w-6 ${themeStyle.accentText}`} /> : 
                        <IconUpvote className={`h-6 w-6 text-gray-500 group-hover:${themeStyle.accentText} transition-colors`} />
                    }
                </button>
                {primarySource && <SourceIcon source={primarySource} />}
                {needsRedirect && <IconExternalLink className="h-5 w-5 text-yellow-400" title="Opens in new tab" />}
                <span className="text-sm w-12 text-right">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

const AlbumCard: React.FC<{ album: Album; onAlbumSelect: (album: Album) => void; }> = ({ album, onAlbumSelect }) => {
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];
    return (
        <div onClick={() => onAlbumSelect(album)} className={`p-4 rounded-lg ${themeStyle.card} bg-opacity-70 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300 cursor-pointer group`}>
            <img src={album.albumArtUrl} alt={album.name} className="w-full h-auto rounded-md object-cover aspect-square mb-4 group-hover:scale-105 transition-transform duration-300" />
            <h3 className="font-bold text-lg text-gray-100">{album.name}</h3>
            <p className="text-sm text-gray-400">{album.artist} &bull; {album.year}</p>
        </div>
    );
};

// --- MAIN UI COMPONENTS ---

const Header: React.FC<{ onLogoClick: () => void; onMenuClick: () => void; searchQuery: string; setSearchQuery: (q: string) => void; }> = ({ onLogoClick, onMenuClick, searchQuery, setSearchQuery }) => {
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];
    return (
        <header className={`p-4 ${themeStyle.card} bg-opacity-50 backdrop-blur-md flex justify-between items-center gap-4 sticky top-0 z-20`}>
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden text-gray-300 hover:text-white">
                    <IconMenu className="h-6 w-6" />
                </button>
                <h1 onClick={onLogoClick} className={`text-3xl ${themeStyle.accentText} font-brand cursor-pointer select-none`}>XL Beats</h1>
            </div>
             <div className="relative flex-grow max-w-lg">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <IconSearch className="h-5 w-5 text-gray-400" />
                </span>
                <input
                    type="search"
                    placeholder="Search for tracks, artists, albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full p-2 pl-10 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${themeStyle.accentRing}`}
                />
            </div>
        </header>
    );
};

const Sidebar: React.FC<{ onNavigate: (view: string) => void; currentView: string }> = ({ onNavigate, currentView }) => {
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];
    
    const navItemClasses = (view: string) => `w-full text-left p-3 rounded-md transition-colors font-semibold ${currentView === view ? `${themeStyle.accentText} ${themeStyle.accentActiveBg}` : `text-gray-300 hover:bg-gray-700/50`}`;

    return (
        <nav className="p-4 space-y-2">
            <button onClick={() => onNavigate('home')} className={navItemClasses('home')}>Home</button>
            <button onClick={() => onNavigate('favorites')} className={navItemClasses('favorites')}>Favorites</button>
            <button onClick={() => onNavigate('singles')} className={navItemClasses('singles')}>Singles</button>
            <button onClick={() => onNavigate('badges')} className={navItemClasses('badges')}>Badges</button>
            <div className="pt-4 mt-4 border-t border-gray-700">
                <h3 className="px-3 pb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Socials</h3>
                <a href="#" target="_blank" className="block p-3 rounded-md text-gray-300 hover:bg-gray-700/50">Spotify</a>
                <a href="#" target="_blank" className="block p-3 rounded-md text-gray-300 hover:bg-gray-700/50">Apple Music</a>
                <a href="#" target="_blank" className="block p-3 rounded-md text-gray-300 hover:bg-gray-700/50">YouTube</a>
            </div>
        </nav>
    );
};

const Player: React.FC = () => {
    const { currentTrack, isPlaying, togglePlay, playNext, playPrev, activeSource, trackProgress, setTrackProgress, duration, isShuffle, repeatMode, toggleShuffle, cycleRepeatMode, volume, setVolume } = useMusicPlayer();
    const { theme } = useContext(ThemeContext);
    const { isFavorited, toggleFavorite } = useFavorites();
    const themeStyle = THEME_CLASSES[theme];

    const [isFullScreen, setIsFullScreen] = useState(false);
    
    useEffect(() => {
        let interval: number;
        if (isPlaying && activeSource?.isEmbeddable) {
            interval = window.setInterval(() => {
                setTrackProgress(prev => {
                    if (prev >= duration) {
                        playNext();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, duration, activeSource, setTrackProgress, playNext]);
    
    const handleShare = async () => {
        if (!currentTrack) return;
        const shareData = {
            title: `XL Beats - ${currentTrack.title}`,
            text: `Check out "${currentTrack.title}" by XL Beats!`,
            url: window.location.href, // Or a specific link to the track if available
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Sharing is not supported on this browser.');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (!currentTrack || !activeSource) return null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrackProgress(Number(e.target.value));
    };
    
    const MiniPlayer = () => (
        <div onClick={() => setIsFullScreen(true)} className={`fixed bottom-0 left-0 right-0 h-20 ${themeStyle.card} bg-opacity-80 backdrop-blur-lg border-t border-gray-700 p-2 flex items-center cursor-pointer z-50`}>
            <img src={currentTrack.albumArtUrl} alt={currentTrack.album} className="h-16 w-16 rounded-md object-cover mr-4" />
            <div className="flex-grow">
                <p className="font-bold text-white">{currentTrack.title}</p>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center space-x-4 pr-4">
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(currentTrack.id); }} className="group">
                     {isFavorited(currentTrack.id) ? 
                        <IconUpvoteFilled className={`h-7 w-7 ${themeStyle.accentText}`} /> : 
                        <IconUpvote className={`h-7 w-7 text-gray-400 group-hover:${themeStyle.accentText} transition-colors`} />
                    }
                </button>
                <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className={`${themeStyle.accentBg} rounded-full p-2 text-white`}>
                    {isPlaying ? <IconPause className="h-6 w-6" /> : <IconPlay className="h-6 w-6" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); playNext(); }}><IconNext className="h-6 w-6 text-gray-300 hover:text-white" /></button>
            </div>
        </div>
    );

    const FullScreenPlayer = () => {
        const [lastVolume, setLastVolume] = useState(volume);

        const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVolume = Number(e.target.value);
            setVolume(newVolume);
            if (newVolume > 0) {
                setLastVolume(newVolume);
            }
        };
    
        const toggleMute = () => {
            if (volume > 0) {
                setLastVolume(volume);
                setVolume(0);
            } else {
                setVolume(lastVolume > 0 ? lastVolume : 1);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-2xl z-50 flex flex-col p-8 animate-fade-in">
                <button onClick={() => setIsFullScreen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div className="flex-1 flex flex-col items-center justify-center text-white">
                    <div className="w-full max-w-md">
                        {activeSource.isEmbeddable && activeSource.platform === SourcePlatform.YOUTUBE ? (
                            <div className={`aspect-video bg-black rounded-lg mb-8 shadow-2xl ${themeStyle.accentShadow}`}>
                                <IconYouTube className="w-full h-full text-gray-800" />
                                <p className="text-center text-gray-500 mt-2">YouTube embed simulation</p>
                            </div>
                        ) : (
                            <img src={currentTrack.albumArtUrl} alt={currentTrack.title} className={`w-full h-auto aspect-square rounded-lg mb-8 shadow-2xl ${themeStyle.accentShadow}`} />
                        )}

                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-4">
                               <h2 className="text-4xl font-bold">{currentTrack.title}</h2>
                                <button onClick={() => toggleFavorite(currentTrack.id)} className="group">
                                    {isFavorited(currentTrack.id) ? 
                                        <IconUpvoteFilled className={`h-8 w-8 ${themeStyle.accentText}`} /> : 
                                        <IconUpvote className={`h-8 w-8 text-gray-500 group-hover:${themeStyle.accentText} transition-colors`} />
                                    }
                                </button>
                            </div>
                            <p className="text-lg text-gray-400">{currentTrack.artist}</p>
                            <p className="text-sm text-gray-500">Produced by XL Beats</p>
                        </div>

                        <div className="w-full">
                            <input type="range" min="0" max={duration} value={trackProgress} onChange={handleSeek} className={`w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm ${themeStyle.accentRange}`} />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{formatTime(trackProgress)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={toggleShuffle}><IconShuffle className={`h-6 w-6 transition-colors hover:text-white ${isShuffle ? themeStyle.accentText : 'text-gray-400'}`} /></button>
                            <button onClick={playPrev}><IconPrev className="h-8 w-8 text-gray-300 hover:text-white" /></button>
                            <button onClick={togglePlay} className={`${themeStyle.accentBg} rounded-full p-4 text-white`}>
                                {isPlaying ? <IconPause className="h-10 w-10" /> : <IconPlay className="h-10 w-10" />}
                            </button>
                            <button onClick={playNext}><IconNext className="h-8 w-8 text-gray-300 hover:text-white" /></button>
                            <button onClick={cycleRepeatMode} className="relative">
                                <IconRepeat className={`h-6 w-6 transition-colors hover:text-white ${repeatMode !== RepeatMode.OFF ? themeStyle.accentText : 'text-gray-400'}`} />
                                {repeatMode === RepeatMode.ONE && (
                                    <span className={`absolute -top-1 -right-1.5 text-xs font-bold text-white ${themeStyle.accentBg} rounded-full h-4 w-4 flex items-center justify-center border-2 border-black`}>1</span>
                                )}
                            </button>
                        </div>

                        <div className="mt-8 flex justify-between items-center w-full">
                            <div className="flex items-center gap-2 w-1/3">
                                <button onClick={toggleMute} className="text-gray-400 hover:text-white p-2">
                                    {volume > 0 ? <IconVolumeUp className="h-6 w-6" /> : <IconVolumeMute className="h-6 w-6" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className={`w-full max-w-xs h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm ${themeStyle.accentRange}`}
                                />
                            </div>
                             <div className="flex justify-center items-center space-x-4 w-1/3">
                                {currentTrack.sources.map(source => (
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.platform} className={`p-2 rounded-full transition-colors ${activeSource.platform === source.platform ? `${themeStyle.accentBg}/50` : `bg-gray-700 hover:bg-gray-600`}`}>
                                        <SourceIcon source={source} className="h-6 w-6" />
                                    </a>
                                ))}
                            </div>
                            <div className="flex justify-end w-1/3">
                                <button onClick={handleShare} className="text-gray-400 hover:text-white p-2"><IconShare className="h-6 w-6"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return isFullScreen ? <FullScreenPlayer /> : <MiniPlayer />;
};

// --- VIEWS / PAGES ---

const HomeView: React.FC<{ allAlbums: Album[]; onAlbumSelect: (album: Album) => void; }> = ({ allAlbums, onAlbumSelect }) => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allAlbums.map(album => <AlbumCard key={album.id} album={album} onAlbumSelect={onAlbumSelect} />)}
        </div>
        <div className="mt-12 p-4 bg-gray-800 rounded-lg">
           <p className="text-center text-gray-400">Ad Placeholder - Tasteful Banner Ad</p>
        </div>
    </div>
);

const AlbumView: React.FC<{ album: Album; onBack: () => void; }> = ({ album, onBack }) => {
    const { playTrack } = useMusicPlayer();
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];
    
    return (
        <div className="p-8">
            <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">&larr; Back to Home</button>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <img src={album.albumArtUrl} alt={album.name} className="w-full md:w-56 h-auto aspect-square rounded-lg object-cover shadow-lg"/>
                <div className="flex flex-col justify-end">
                    <p className="text-sm font-bold text-gray-400">ALBUM</p>
                    <h2 className="text-5xl font-black text-white">{album.name}</h2>
                    <p className="text-lg text-gray-300 mt-2">{album.artist} &bull; {album.year}</p>
                    <button onClick={() => playTrack(album.tracks[0], album.tracks)} className={`mt-4 w-48 flex items-center justify-center gap-2 ${themeStyle.accentBg} text-white font-bold py-3 px-6 rounded-full ${themeStyle.accentBgHover} transition-colors`}>
                        <IconPlay className="h-6 w-6" /> Play
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                {album.tracks.map(track => (
                    <TrackItemWrapper key={track.id} track={track} onPlay={() => playTrack(track, album.tracks)} />
                ))}
            </div>
        </div>
    );
};

// Wrapper to pass context-dependent values to TrackItem
const TrackItemWrapper: React.FC<{ track: Track; onPlay: () => void; }> = ({ track, onPlay }) => {
    const { currentTrack, isPlaying } = useMusicPlayer();
    return <TrackItem track={track} onPlay={onPlay} isPlaying={isPlaying} currentTrackId={currentTrack?.id} />;
};

const SinglesView: React.FC<{ allSingles: Track[] }> = ({ allSingles }) => {
    const { playTrack } = useMusicPlayer();
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Singles & Features</h2>
            <div className="space-y-2">
                 {allSingles.map(track => (
                    <TrackItemWrapper key={track.id} track={track} onPlay={() => playTrack(track, allSingles)} />
                ))}
            </div>
        </div>
    );
};

const FavoritesView: React.FC<{ allAlbums: Album[]; allSingles: Track[] }> = ({ allAlbums, allSingles }) => {
    const { playTrack } = useMusicPlayer();
    const { favoritedSongIds } = useFavorites();
    const allTracks = [...allAlbums.flatMap(a => a.tracks), ...allSingles];
    const favoritedTracks = allTracks.filter(t => favoritedSongIds.has(t.id));

    if (favoritedTracks.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">Favorites</h2>
                <p className="text-gray-400">Songs you upvote will appear here. Click the up arrow icon on any track to add it.</p>
            </div>
        );
    }
    
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Favorites</h2>
            <div className="space-y-2">
                 {favoritedTracks.map(track => (
                    <TrackItemWrapper key={track.id} track={track} onPlay={() => playTrack(track, favoritedTracks)} />
                ))}
            </div>
        </div>
    );
};

const BadgesView: React.FC = () => {
    const { badges } = useBadges();
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Achievements & Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map(badge => (
                    <div key={badge.id} className={`p-6 rounded-lg bg-gray-800 border-2 ${badge.earned ? themeStyle.accentBorder : 'border-gray-700'} ${badge.earned ? '' : 'opacity-60'} transition-all`}>
                        <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center ${badge.earned ? `${themeStyle.accentActiveBg} ${themeStyle.accentText}` : 'bg-gray-700 text-gray-500'}`}>
                            {badge.icon}
                        </div>
                        <h3 className={`text-xl font-bold text-center ${badge.earned ? 'text-white' : 'text-gray-400'}`}>{badge.name}</h3>
                        <p className="text-center text-sm text-gray-400 mt-2">{badge.earned ? badge.description : badge.criteria}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SearchView: React.FC<{
    results: { albums: Album[], tracks: Track[] };
    onAlbumSelect: (album: Album) => void;
}> = ({ results, onAlbumSelect }) => {
    const { playTrack } = useMusicPlayer();

    if (results.albums.length === 0 && results.tracks.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <h2 className="text-2xl font-bold text-white mb-2">No results found.</h2>
                <p>Try searching for a different track, artist, or album.</p>
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in">
            {results.tracks.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-white">Tracks</h2>
                    <div className="space-y-2">
                        {results.tracks.map(track => (
                            <TrackItemWrapper key={track.id} track={track} onPlay={() => playTrack(track, results.tracks)} />
                        ))}
                    </div>
                </div>
            )}
            {results.albums.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-white">Albums</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {results.albums.map(album => (
                            <AlbumCard key={album.id} album={album} onAlbumSelect={onAlbumSelect} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const OnboardingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className={`bg-gray-800 p-8 rounded-lg max-w-lg text-center shadow-2xl ${themeStyle.accentShadow.replace('/50', '/30')} animate-fade-in`}>
                <h2 className={`text-2xl font-bold ${themeStyle.accentText} mb-4`}>Welcome to the XL Beats Experience!</h2>
                <p className="text-gray-300 mb-6">
                    This app unifies music from different platforms. Some tracks may open in external apps like Spotify or Apple Music for the best quality and to respect platform rules. Look for the <IconExternalLink className="h-4 w-4 inline-block -mt-1 text-yellow-400" /> icon!
                </p>
                <button onClick={onClose} className={`${themeStyle.accentBg} text-white font-bold py-2 px-6 rounded-full ${themeStyle.accentBgHover} transition-colors`}>
                    Got It
                </button>
            </div>
        </div>
    );
}

// --- ADMIN COMPONENTS ---
const AdminLogin: React.FC<{ onLogin: (isLoggedIn: boolean) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(email.toLowerCase() === ADMIN_EMAIL) {
            onLogin(true);
        } else {
            setError('Access Denied. Invalid credentials.');
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-white">
            <h1 className={`text-4xl ${themeStyle.accentText} font-brand mb-4`}>Admin Panel</h1>
            <p className="text-gray-400 mb-8">Restricted Access</p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    className={`w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${themeStyle.accentRing}`}
                />
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button type="submit" className={`w-full mt-4 ${themeStyle.accentBg} text-white font-bold py-3 rounded-md ${themeStyle.accentBgHover} transition-colors`}>Login</button>
            </form>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];
    const COLORS = [themeStyle.accentChartFill, '#4b5563'];
    
    const dummyData = {
        plays: [
            { name: 'Flint Town Hustle', plays: 4500 },
            { name: '810 Freeway', plays: 3200 },
            { name: 'Platinum Bronco', plays: 2800 },
            { name: 'Slay Ride', plays: 1500 },
        ],
        dau: [{ name: 'DAU', value: 1200 }, { name: 'Rest', value: 8800 }],
        wau: [{ name: 'WAU', value: 4500 }, { name: 'Rest', value: 5500 }],
        mau: [{ name: 'MAU', value: 8000 }, { name: 'Rest', value: 2000 }],
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Most Played Songs</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dummyData.plays} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} tick={{ fill: '#d1d5db' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                            <Legend />
                            <Bar dataKey="plays" fill={themeStyle.accentChartFill} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Active Listeners</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dummyData.dau} dataKey="value" nameKey="name" cx="20%" cy="50%" outerRadius={60} fill="#8884d8">
                                {dummyData.dau.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Pie data={dummyData.wau} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#82ca9d">
                                 {dummyData.wau.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Pie data={dummyData.mau} dataKey="value" nameKey="name" cx="80%" cy="50%" outerRadius={60} fill="#ffc658">
                                 {dummyData.mau.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const IndexerTool: React.FC<{ onSave: (tracks: IndexedTrack[]) => void; }> = ({ onSave }) => {
    const [trackList, setTrackList] = useState('');
    const [artistName, setArtistName] = useState('XL Beats');
    const [indexedTracks, setIndexedTracks] = useState<IndexedTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    const handleIndex = async () => {
        const titles = trackList.split('\n').filter(t => t.trim() !== '');
        if (titles.length === 0) {
            setError('Please enter at least one track title.');
            return;
        }
        setError('');
        setIsLoading(true);
        setIndexedTracks([]);
        const results = await indexTracksWithGemini(titles, artistName);
        setIndexedTracks(results);
        setIsLoading(false);
    };

    const handleSave = () => {
        onSave(indexedTracks);
        setIndexedTracks([]);
        setTrackList('');
    }

    return (
        <div className="p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Back-Catalog Indexing Tool</h2>
            <p className="text-gray-400 mb-6">Powered by Gemini. Paste track titles (one per line) to find streaming links automatically.</p>
            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="mb-4">
                    <label htmlFor="artistName" className="block text-sm font-medium text-gray-300 mb-1">Artist Name</label>
                    <input
                        type="text"
                        id="artistName"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className={`w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${themeStyle.accentRing}`}
                    />
                </div>
                <textarea 
                    value={trackList}
                    onChange={(e) => setTrackList(e.target.value)}
                    placeholder="Flint Town Hustle&#10;810 Freeway&#10;..."
                    className={`w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${themeStyle.accentRing}`}
                />
                <button onClick={handleIndex} disabled={isLoading} className={`mt-4 ${themeStyle.accentBg} text-white font-bold py-3 px-6 rounded-md ${themeStyle.accentBgHover} transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed`}>
                    {isLoading ? 'Indexing...' : 'Start Indexing'}
                </button>
                {error && <p className="text-yellow-400 text-sm mt-2">{error}</p>}
            </div>

            {indexedTracks.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Indexing Results</h3>
                    <div className="overflow-x-auto bg-gray-800 rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700 text-sm uppercase text-gray-300">
                                <tr>
                                    <th className="p-3">Track Title</th>
                                    <th className="p-3">YouTube</th>
                                    <th className="p-3">Spotify</th>
                                    <th className="p-3">Apple Music</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indexedTracks.map((track, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="p-3 font-semibold">{track.trackTitle}</td>
                                        <td className="p-3"><input type="text" defaultValue={track.youtubeUrl} className="bg-gray-600 p-1 rounded w-full text-sm" /></td>
                                        <td className="p-3"><input type="text" defaultValue={track.spotifyUrl} className="bg-gray-600 p-1 rounded w-full text-sm" /></td>
                                        <td className="p-3"><input type="text" defaultValue={track.appleMusicUrl} className="bg-gray-600 p-1 rounded w-full text-sm" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <button onClick={handleSave} className="mt-4 bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors">Save to Database</button>
                </div>
            )}
        </div>
    );
};

const AdminPanel: React.FC<{ onLogout: () => void; allAlbums: Album[]; allSingles: Track[], onSaveTracks: (tracks: IndexedTrack[]) => void; }> = ({ onLogout, allAlbums, allSingles, onSaveTracks }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { theme } = useContext(ThemeContext);
    const themeStyle = THEME_CLASSES[theme];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <AdminDashboard />;
            case 'indexer': return <IndexerTool onSave={onSaveTracks} />;
            case 'content': return <div className="p-8 text-white">Manual content management coming soon.</div>;
            default: return <AdminDashboard />;
        }
    };
    
    const tabClass = (tabName: string) => `px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === tabName ? `bg-gray-800 ${themeStyle.accentText}` : 'text-gray-400 hover:bg-gray-700'}`;

    return (
        <div className="flex flex-col h-full">
            <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Admin Controls</h2>
                <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white">Logout</button>
            </header>
            <div className="border-b border-gray-700 px-4">
                <nav className="flex space-x-2 -mb-px">
                    <button onClick={() => setActiveTab('dashboard')} className={tabClass('dashboard')}>Dashboard</button>
                    <button onClick={() => setActiveTab('indexer')} className={tabClass('indexer')}>Indexer Tool</button>
                    <button onClick={() => setActiveTab('content')} className={tabClass('content')}>Content Mgmt</button>
                </nav>
            </div>
            <div className="flex-grow overflow-y-auto">{renderContent()}</div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [view, setView] = useState('home');
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [theme, setTheme] = useState<AppTheme>(AppTheme.XL_BEATS);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [lastLogoClickTime, setLastLogoClickTime] = useState(0);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    
    // State for all music data, now dynamic
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);
    const [allSingles, setAllSingles] = useState<Track[]>([]);

    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ albums: Album[], tracks: Track[] }>({ albums: [], tracks: [] });

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('xl_beats_onboarding');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
        // Load data from localStorage or use initial data
        const storedAlbums = localStorage.getItem('xl_beats_albums');
        const storedSingles = localStorage.getItem('xl_beats_singles');

        if (storedAlbums && storedSingles) {
            try {
                setAllAlbums(JSON.parse(storedAlbums));
                setAllSingles(JSON.parse(storedSingles));
            } catch (e) {
                console.error("Failed to parse music data from storage, resetting.", e);
                setAllAlbums(initialAlbums);
                setAllSingles(initialSingles);
            }
        } else {
            setAllAlbums(initialAlbums);
            setAllSingles(initialSingles);
        }
    }, []);

    const handleCloseOnboarding = () => {
        localStorage.setItem('xl_beats_onboarding', 'true');
        setShowOnboarding(false);
    };

    const handleNavigate = (newView: string) => {
        if (newView !== 'admin' && adminLoggedIn) {
             setAdminLoggedIn(false); // Log out of admin when navigating away
        }
        setSearchQuery(''); // Clear search on navigation
        setSelectedAlbum(null);
        setView(newView);
        setIsMobileNavOpen(false); // Close mobile nav on any navigation
    };

    const handleLogoClick = () => {
        // First, perform the navigation a single click would do
        if (view !== 'home' || searchQuery) {
            handleNavigate('home');
        }

        // Then, handle the multi-click logic for admin access
        const now = Date.now();
        const newCount = (now - lastLogoClickTime > 1000) ? 1 : logoClickCount + 1;

        setLogoClickCount(newCount);
        setLastLogoClickTime(now);

        if (newCount >= 7) {
            handleNavigate('admin');
            setLogoClickCount(0); // Reset after trigger
        }
    };
    
     // Search useEffect
    useEffect(() => {
        if (searchQuery.trim().toLowerCase() === '/admin-protocol') {
            handleNavigate('admin');
            return;
        }

        if (searchQuery.trim() === '') {
            setSearchResults({ albums: [], tracks: [] });
            return;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        const allTracks = [...allSingles, ...allAlbums.flatMap(a => a.tracks)];
        
        const filteredTracks = allTracks.filter(track =>
            track.title.toLowerCase().includes(lowerCaseQuery) ||
            track.artist.toLowerCase().includes(lowerCaseQuery) ||
            track.album.toLowerCase().includes(lowerCaseQuery)
        );

        const filteredAlbums = allAlbums.filter(album =>
            album.name.toLowerCase().includes(lowerCaseQuery) ||
            album.artist.toLowerCase().includes(lowerCaseQuery)
        );

        setSearchResults({ tracks: filteredTracks, albums: filteredAlbums });
    }, [searchQuery, allAlbums, allSingles]);

    const handleAlbumSelect = (album: Album) => {
        setSearchQuery('');
        setSelectedAlbum(album);
        setView('album');
    };
    
    const handleAdminLogin = (isLoggedIn: boolean) => {
        if(isLoggedIn) {
            setAdminLoggedIn(true);
            setView('admin');
        }
    };

    const handleAdminLogout = () => {
        setAdminLoggedIn(false);
        setView('home');
    };

    const { addToast } = useToast() || {}; // Use a temp toast provider for admin actions
    const handleSaveNewTracks = (tracks: IndexedTrack[]) => {
        const newTracks: Track[] = tracks.map(t => ({
            id: `track-${Date.now()}-${Math.random()}`,
            title: t.trackTitle,
            artist: 'XL Beats', // Or get from Indexer tool
            album: 'Single',
            albumArtUrl: `https://picsum.photos/seed/${t.trackTitle}/500/500`,
            duration: 180, // Default duration
            sources: [
                ...(t.youtubeUrl ? [{ platform: SourcePlatform.YOUTUBE, url: t.youtubeUrl, isEmbeddable: true }] : []),
                ...(t.spotifyUrl ? [{ platform: SourcePlatform.SPOTIFY, url: t.spotifyUrl, isEmbeddable: false }] : []),
                ...(t.appleMusicUrl ? [{ platform: SourcePlatform.APPLE_MUSIC, url: t.appleMusicUrl, isEmbeddable: false }] : []),
            ].filter(s => s.url && s.url !== 'Error fetching')
        }));
        setAllSingles(prev => [...prev, ...newTracks]);
        if(addToast) addToast(`${newTracks.length} tracks added to Singles!`);
    };

    const themeStyle = THEME_CLASSES[theme];

    const renderMainContent = () => {
        if (view === 'admin') {
            return adminLoggedIn ? <AdminPanel onLogout={handleAdminLogout} allAlbums={allAlbums} allSingles={allSingles} onSaveTracks={handleSaveNewTracks} /> : <AdminLogin onLogin={handleAdminLogin}/>;
        }
        if (searchQuery) {
            return <SearchView results={searchResults} onAlbumSelect={handleAlbumSelect} />;
        }
        if (view === 'album' && selectedAlbum) {
            return <AlbumView album={selectedAlbum} onBack={() => handleNavigate('home')} />;
        }
        if (view === 'singles') {
            return <SinglesView allSingles={allSingles} />;
        }
        if (view === 'favorites') {
            return <FavoritesView allAlbums={allAlbums} allSingles={allSingles} />;
        }
         if (view === 'badges') {
            return <BadgesView />;
        }
        return <HomeView allAlbums={allAlbums} onAlbumSelect={handleAlbumSelect} />;
    };

    const AppWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
        const currentTheme = useContext(ThemeContext);
        const style = THEME_CLASSES[currentTheme.theme];
        return <div className={`min-h-screen ${style.bg} ${style.text}`}>{children}</div>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <AppWrapper>
                <ToastProvider>
                    <BadgesProvider>
                        <MusicPlayerProvider allAlbums={allAlbums}>
                            <FavoritesProvider>
                                {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
                                {view === 'admin' && !adminLoggedIn ? (
                                    <AdminLogin onLogin={handleAdminLogin}/>
                                ) : (
                                    <>
                                        {/* --- MOBILE NAVIGATION --- */}
                                        {isMobileNavOpen && (
                                            <div className="fixed inset-0 z-40 md:hidden">
                                                <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileNavOpen(false)}></div>
                                                <div className={`relative w-64 h-full ${themeStyle.card} bg-opacity-95 shadow-xl animate-slide-in-left`}>
                                                    <div onClick={handleLogoClick} className={`h-20 flex items-center px-6 text-3xl ${themeStyle.accentText} font-brand select-none cursor-pointer`}>XL Beats</div>
                                                    <Sidebar onNavigate={handleNavigate} currentView={view} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex">
                                            {/* --- DESKTOP SIDEBAR --- */}
                                            <aside className={`w-64 ${themeStyle.card} bg-opacity-30 hidden md:block h-screen sticky top-0`}>
                                                <div onClick={handleLogoClick} className={`h-20 flex items-center px-6 text-3xl ${themeStyle.accentText} font-brand select-none cursor-pointer`}>XL Beats</div>
                                                <Sidebar onNavigate={handleNavigate} currentView={view} />
                                            </aside>
                                            
                                            <main className="flex-1 pb-20">
                                                {view !== 'admin' && (
                                                    <Header 
                                                        onLogoClick={handleLogoClick}
                                                        onMenuClick={() => setIsMobileNavOpen(true)}
                                                        searchQuery={searchQuery} 
                                                        setSearchQuery={setSearchQuery} 
                                                    />
                                                )}
                                                {renderMainContent()}
                                            </main>
                                        </div>
                                    </>
                                )}
                                <Player />
                            </FavoritesProvider>
                        </MusicPlayerProvider>
                    </BadgesProvider>
                </ToastProvider>
            </AppWrapper>
        </ThemeContext.Provider>
    );
}
