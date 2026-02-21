'use client';
import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import TrackCard from '@/components/TrackCard';
import Layout from '@/components/Layout';
import type { Track, Playlist } from '@/lib/types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  useEffect(() => {
    if (query.length > 0) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setTracks(data.tracks || []);
          setPlaylists(data.playlists || []);
        })
        .catch(console.error);
    } else {
      setTracks([]);
      setPlaylists([]);
    }
  }, [query]);

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
        {/* Search Bar */}
        <section className="mb-8">
          <div className="max-w-2xl">
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索歌曲、艺术家、专辑..."
                className="w-full h-12 md:h-14 pl-12 pr-4 bg-[#242424] text-white rounded-full border-none outline-none focus:ring-2 focus:ring-[#1DB954] transition text-base md:text-lg"
                autoFocus
              />
            </div>
          </div>
        </section>

        {/* Results */}
        {query.length > 0 && (
          <>
            {/* Tracks */}
            {tracks.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">歌曲</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                  {tracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={handlePlayTrack}
                      isPlaying={currentTrack?.id === track.id && isPlaying}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {playlists.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">播放列表</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-3" />
                      <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {tracks.length === 0 && playlists.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">没有找到 "{query}" 相关的结果</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {query.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">输入关键词开始搜索</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
