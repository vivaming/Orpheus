'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat, ListMusic, ChevronUp, ChevronDown } from 'lucide-react';
import type { Track } from '@/lib/types';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function Player({ currentTrack, isPlaying = false, onPlayPause, onNext, onPrevious }: PlayerProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gradientBackgrounds = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-cyan-600',
    'from-green-600 to-teal-600',
    'from-yellow-600 to-orange-600',
    'from-indigo-600 to-purple-600',
  ];

  const gradientClass = currentTrack ? gradientBackgrounds[currentTrack.id % gradientBackgrounds.length] : gradientBackgrounds[0];

  return (
    <>
      {/* Desktop Player */}
      <div className="hidden lg:flex fixed bottom-0 left-64 right-0 h-28 bg-gradient-to-r from-[#181818] via-[#282828] to-[#181818] border-t border-gray-800/50 backdrop-blur-xl items-center px-6 gap-4 shadow-2xl z-50">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-80">
          {currentTrack ? (
            <>
              <div className="relative group">
                <div className={`w-16 h-16 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br ${gradientClass}`}>
                  {currentTrack.cover_url ? (
                    <img 
                      src={currentTrack.cover_url} 
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ListMusic size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <button 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart size={12} className={isLiked ? 'text-white fill-current' : 'text-white'} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate text-base">{currentTrack.title}</p>
                <p className="text-gray-400 text-sm truncate">{currentTrack.artist_name}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#282828] rounded-lg flex items-center justify-center">
                <ListMusic size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">选择歌曲开始播放</p>
            </div>
          )}
        </div>

        {/* Center Controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-4">
            <button 
              className={`text-gray-400 hover:text-white transition-colors ${isShuffled ? 'text-[#1DB954]' : ''}`}
              onClick={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle size={18} />
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onPrevious}
            >
              <SkipBack size={22} fill="currentColor" />
            </button>
            <button 
              onClick={onPlayPause}
              className="w-12 h-12 bg-white hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? (
                <Pause size={22} className="text-black" fill="black" />
              ) : (
                <Play size={22} className="text-black ml-1" fill="black" />
              )}
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onNext}
            >
              <SkipForward size={22} fill="currentColor" />
            </button>
            <button 
              className={`text-gray-400 hover:text-white transition-colors ${repeatMode !== 'off' ? 'text-[#1DB954]' : ''}`}
              onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
            >
              <Repeat size={18} />
            </button>
          </div>

          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-gray-400 w-10 text-right">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
            </span>
            <div 
              className="flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {currentTrack ? formatTime(currentTrack.duration) : '0:00'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-64 justify-end">
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-28 h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-[#1DB954]"
          />
        </div>
      </div>

      {/* Mobile Player */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isExpanded ? 'h-[85vh]' : 'h-20'} bg-gradient-to-t from-[#121212] via-[#181818] to-[#121212] border-t border-white/5 backdrop-blur-xl shadow-2xl z-50 transition-all duration-500 ease-in-out`}>
        {/* Progress Bar - Always visible */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-[#4d4d4d] cursor-pointer z-10"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-[#1DB954]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!isExpanded ? (
          /* Collapsed Mobile Player */
          <div 
            className="flex items-center h-20 px-4 gap-3"
            onClick={() => setIsExpanded(true)}
          >
            <div className={`w-12 h-12 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br ${gradientClass} flex-shrink-0`}>
              {currentTrack?.cover_url ? (
                <img 
                  src={currentTrack.cover_url} 
                  alt={currentTrack?.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ListMusic size={20} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate text-sm">{currentTrack?.title || '选择歌曲'}</p>
              <p className="text-gray-400 text-xs truncate">{currentTrack?.artist_name || '开始播放'}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayPause?.();
              }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" />
              ) : (
                <Play size={20} className="text-black ml-0.5" />
              )}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-400"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        ) : (
          /* Expanded Mobile Player */
          <div className="flex flex-col h-full pt-8 pb-6 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setIsExpanded(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#282828] text-gray-400"
              >
                <ChevronDown size={24} />
              </button>
              <span className="text-white font-medium">正在播放</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#282828] text-gray-400">
                <Heart size={20} />
              </button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center mb-8">
              <div className={`w-72 h-72 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${gradientClass}`}>
                {currentTrack?.cover_url ? (
                  <img 
                    src={currentTrack.cover_url}
                    alt={currentTrack?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ListMusic size={80} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold mb-2 truncate">{currentTrack?.title || '未知歌曲'}</h2>
              <p className="text-gray-400 text-lg truncate">{currentTrack?.artist_name || '未知艺术家'}</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div 
                className="h-1 bg-[#4d4d4d] rounded-full cursor-pointer mb-2"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-[#1DB954] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                <span>{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <button 
                className={`text-gray-400 ${isShuffled ? 'text-[#1DB954]' : ''}`}
                onClick={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle size={20} />
              </button>
              <button className="text-gray-400" onClick={onPrevious}>
                <SkipBack size={28} />
              </button>
              <button 
                onClick={onPlayPause}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause size={28} className="text-black" />
                ) : (
                  <Play size={28} className="text-black ml-1" />
                )}
              </button>
              <button className="text-gray-400" onClick={onNext}>
                <SkipForward size={28} />
              </button>
              <button 
                className={`text-gray-400 ${repeatMode !== 'off' ? 'text-[#1DB954]' : ''}`}
                onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
              >
                <Repeat size={20} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <button 
                className="text-gray-400"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="flex-1 h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-[#1DB954]"
              />
            </div>
          </div>
        )}
      </div>

      {currentTrack && (
        <audio 
          ref={audioRef}
          src={`/api/stream/${currentTrack.id}`}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onNext}
        />
      )}
    </>
  );
}
