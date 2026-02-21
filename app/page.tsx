'use client';
import { useState, useEffect } from 'react';
import TrackCard from '@/components/TrackCard';
import PlaylistCard from '@/components/PlaylistCard';
import Layout from '@/components/Layout';
import type { Track, Playlist as PlaylistType } from '@/lib/types';

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  useEffect(() => {
    fetch('/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data.tracks || []))
      .catch(console.error);

    fetch('/api/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data.playlists || []))
      .catch(console.error);
  }, []);

  const handlePlayTrack = (track: Track) => {
    const index = tracks.findIndex(t => t.id === track.id);
    setCurrentTrackIndex(index);
    
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
      setIsPlaying(true);
    }
  };

  return (
    <Layout
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-b from-[#121212] via-[#181818] to-[#121212]">
        {/* Welcome Section */}
        <section className="mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-[#1DB954]/20 via-purple-900/20 to-[#1DB954]/20 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 bg-gradient-to-r from-white via-[#1DB954] to-white bg-clip-text text-transparent">
              欢迎回来
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              发现你的私人音乐收藏 • {tracks.length} 首歌曲
            </p>
          </div>
        </section>

        {/* Recently Played */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">最近播放</h2>
            <button className="text-gray-400 hover:text-white text-xs md:text-sm font-medium transition-colors">
              查看全部
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {tracks.slice(0, 5).map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onPlay={handlePlayTrack}
                isPlaying={currentTrack?.id === track.id && isPlaying}
              />
            ))}
          </div>
        </section>

        {/* Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">播放列表</h2>
            <button className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs md:text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
              创建播放列表
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
