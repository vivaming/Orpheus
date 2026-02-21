'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Plus, Heart, Settings, Music2, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { icon: Home, label: '首页', href: '/' },
    { icon: Search, label: '搜索', href: '/search' },
    { icon: Library, label: '音乐库', href: '/library' },
  ];

  const playlists = [
    { label: '华语经典', icon: Heart },
    { label: '深夜情歌', icon: Heart },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#000000] via-[#121212] to-[#000000] flex flex-col border-r border-white/5 z-50">
      {/* Logo */}
      <div className="p-6 mb-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Music2 size={24} className="text-black" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-[#1DB954] bg-clip-text text-transparent">
            Orpheus
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 mb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#282828] text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#282828]/50'
              }`}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <item.icon 
                size={24} 
                className={`transition-all duration-200 ${
                  isActive || hoveredItem === item.href ? 'text-[#1DB954]' : ''
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <Sparkles size={16} className="ml-auto text-[#1DB954] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Playlists Section */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">播放列表</span>
          <button className="w-6 h-6 rounded-full bg-[#282828] hover:bg-[#1DB954] flex items-center justify-center transition-colors group">
            <Plus size={14} className="text-gray-400 group-hover:text-black" />
          </button>
        </div>
        
        {playlists.map((playlist, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#282828]/50 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <playlist.icon size={14} className="text-white" />
            </div>
            <span className="text-sm truncate">{playlist.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#282828]/50 transition-all duration-200">
          <Settings size={18} />
          <span className="text-sm">设置</span>
        </button>
        <p className="text-xs text-gray-600 text-center mt-3">🎵 私人音乐收藏</p>
      </div>
    </aside>
  );
}
