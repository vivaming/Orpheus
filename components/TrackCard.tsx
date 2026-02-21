'use client';
import { useState } from 'react';
import { Play, Pause, Music2, Heart, MoreHorizontal } from 'lucide-react';
import type { Track } from '@/lib/types';

interface TrackCardProps {
  track: Track;
  onPlay?: (track: Track) => void;
  isPlaying?: boolean;
}

export default function TrackCard({ track, onPlay, isPlaying }: TrackCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gradientBackgrounds = [
    'from-purple-600 via-pink-500 to-red-500',
    'from-blue-600 via-cyan-500 to-teal-500',
    'from-green-600 via-emerald-500 to-teal-500',
    'from-yellow-600 via-orange-500 to-red-500',
    'from-indigo-600 via-purple-500 to-pink-500',
  ];

  const gradientClass = gradientBackgrounds[track.id % gradientBackgrounds.length];

  return (
    <div 
      className="group relative bg-[#181818] hover:bg-[#282828] rounded-lg p-3 md:p-4 transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105 hover:shadow-2xl active:scale-95"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay?.(track)}
    >
      {/* Album Art with Gradient Fallback */}
      <div className="relative mb-3 md:mb-4 aspect-square rounded-md md:rounded-lg overflow-hidden shadow-xl">
        {track.cover_url && !imageError ? (
          <img 
            src={track.cover_url} 
            alt={`${track.title} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <Music2 size={48} className="text-white/80" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-14 md:h-14 bg-[#1DB954] hover:bg-[#1ed760] rounded-full flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.(track);
            }}
          >
            {isPlaying ? (
              <Pause size={24} className="text-black md:w-7 md:h-7" />
            ) : (
              <Play size={24} className="text-black ml-1 md:w-7 md:h-7" />
            )}
          </button>
        </div>

        {/* Now Playing Indicator */}
        {isPlaying && (
          <div className="absolute top-3 left-3 bg-[#1DB954] rounded-full px-3 py-1 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-black animate-pulse rounded" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-4 bg-black animate-pulse rounded" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-2 bg-black animate-pulse rounded" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs font-bold text-black">NOW PLAYING</span>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="space-y-1">
        <h3 className="text-white font-semibold truncate text-sm md:text-base group-hover:text-[#1DB954] transition-colors">
          {track.title}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm truncate group-hover:text-gray-300 transition-colors">
          {track.artist_name}
        </p>
        <div className="flex items-center justify-between mt-1 md:mt-2">
          <span className="text-gray-500 text-xs">{formatDuration(track.duration)}</span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="text-gray-400 hover:text-[#1DB954] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={16} />
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
