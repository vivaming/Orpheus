'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import { Menu, X } from 'lucide-react';
import type { Track } from '@/lib/types';

interface LayoutProps {
  children: React.ReactNode;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Layout({ 
  children, 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#121212] via-[#282828] to-[#121212] border-b border-white/5 flex items-center justify-between px-4 z-40 backdrop-blur-xl">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#282828] transition-colors"
        >
          <Menu size={24} className="text-white" />
        </button>
        
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#1DB954] bg-clip-text text-transparent">
          Orpheus
        </h1>

        <div className="w-10 h-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-[#121212] z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <span className="text-xl font-bold text-white">菜单</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#282828] transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-32 lg:pb-28">
        {children}
      </main>

      {/* Player */}
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </div>
  );
}
