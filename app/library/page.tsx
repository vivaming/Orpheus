'use client';
import { useState, useEffect } from 'react';
import TrackCard from '@/components/TrackCard';
import Layout from '@/components/Layout';
import type { Track } from '@/lib/types';

export default function Library() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  useEffect(() => {
    fetch('/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data.tracks || []))
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
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            音乐库
          </h1>
          <p className="text-gray-400 text-lg">
            全部 {tracks.length} 首音轨
          </p>
        </section>

        {/* All Tracks */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
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
      </div>
    </Layout>
  );
}
