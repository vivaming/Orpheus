// 静态数据 - Vercel 兼容
export const artists = [
  { id: 1, name: '周杰伦', image_url: '/artists/jay.jpg', bio: '华语流行音乐天王' },
  { id: 2, name: '邓紫棋', image_url: '/artists/gem.jpg', bio: '香港创作歌手' },
  { id: 3, name: '林俊杰', image_url: '/artists/jj.jpg', bio: '新加坡华语流行歌手' },
  { id: 4, name: '陈奕迅', image_url: '/artists/eason.jpg', bio: '香港流行音乐歌手' },
  { id: 5, name: '薛之谦', image_url: '/artists/joker.jpg', bio: '华语流行男歌手' },
  { id: 6, name: 'Documentary', image_url: '/artists/doc.jpg', bio: '纪录片和历史内容' },
];

export const albums = [
  { id: 1, title: '最伟大的作品', artist_id: 1, cover_url: '/albums/greatest.jpg', release_date: '2022-07-15' },
  { id: 2, title: '摩天动物园', artist_id: 2, cover_url: '/albums/zoo.jpg', release_date: '2019-12-27' },
  { id: 3, title: '幸存者', artist_id: 3, cover_url: '/albums/survivor.jpg', release_date: '2020-10-20' },
  { id: 4, title: '认了吧', artist_id: 4, cover_url: '/albums/admit.jpg', release_date: '2007-04-24' },
  { id: 5, title: '尘', artist_id: 5, cover_url: '/albums/dust.jpg', release_date: '2020-12-31' },
];

export const tracks = [
  { id: 1, title: '最伟大的作品', artist_id: 1, album_id: 1, duration: 286, audio_url: '/audio/track_1.mp3', cover_url: '/albums/greatest.jpg', artist_name: '周杰伦', album_title: '最伟大的作品' },
  { id: 2, title: '光年之外', artist_id: 2, album_id: 2, duration: 235, audio_url: '/audio/track_2.mp3', cover_url: '/albums/zoo.jpg', artist_name: '邓紫棋', album_title: '摩天动物园' },
  { id: 3, title: '修炼爱情', artist_id: 3, album_id: 3, duration: 298, audio_url: '/audio/track_3.mp3', cover_url: '/albums/survivor.jpg', artist_name: '林俊杰', album_title: '幸存者' },
  { id: 4, title: '十年', artist_id: 4, album_id: 4, duration: 203, audio_url: '/audio/track_4.mp3', cover_url: '/albums/admit.jpg', artist_name: '陈奕迅', album_title: '认了吧' },
  { id: 5, title: '演员', artist_id: 5, album_id: 5, duration: 301, audio_url: '/audio/track_5.mp3', cover_url: '/albums/dust.jpg', artist_name: '薛之谦', album_title: '尘' },
  { id: 6, title: 'relative rise and fall of the power  China, Japan, and South Korea', artist_id: 6, album_id: null, duration: 1231, audio_url: '/audio/chinajapan_korea_power.mp3', cover_url: null, artist_name: 'Documentary', album_title: null },
];

export const playlists = [
  { id: 1, title: '华语经典', description: '精选华语流行经典歌曲', cover_url: '/playlists/classics.jpg', track_count: 5 },
  { id: 2, title: '深夜情歌', description: '适合深夜聆听的情歌', cover_url: '/playlists/night.jpg', track_count: 3 },
];

// 辅助函数
export function getAllTracks() {
  return tracks;
}

export function getTrackById(id: number) {
  return tracks.find(t => t.id === id);
}

export function getAllPlaylists() {
  return playlists;
}

export function searchTracks(query: string) {
  const q = query.toLowerCase();
  return tracks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist_name?.toLowerCase().includes(q) ||
    t.album_title?.toLowerCase().includes(q)
  );
}

export function searchPlaylists(query: string) {
  const q = query.toLowerCase();
  return playlists.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  );
}
