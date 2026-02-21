'use client';
import { Play } from 'lucide-react';
import Link from 'next/link';

interface Playlist {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  track_count?: number;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div className="group relative bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition cursor-pointer">
        <div className="relative mb-4">
          <div className="w-full aspect-square bg-gradient-to-br from-purple-700 to-blue-300 rounded-md overflow-hidden flex items-center justify-center">
            {playlist.cover_url ? (
              <img src={playlist.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🎶</span>
            )}
          </div>
          <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition shadow-lg">
            <Play size={24} className="text-black ml-1" />
          </button>
        </div>
        <h3 className="text-white font-medium truncate mb-1">{playlist.title}</h3>
        <p className="text-gray-400 text-sm truncate">{playlist.description || `${playlist.track_count || 0} 首歌曲`}</p>
      </div>
    </Link>
  );
}
