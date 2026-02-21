import Database from 'better-sqlite3';

const db = new Database('orpheus.db');

// 添加新的艺术家
const insertArtist = db.prepare('INSERT INTO artists (name, image_url, bio) VALUES (?, ?, ?)');
const artistResult = insertArtist.run('Documentary', '/artists/doc.jpg', '纪录片和历史内容');
const artistId = artistResult.lastInsertRowid;

console.log(`✅ 新艺术家已添加: ID ${artistId}`);

// 添加新音轨
const insertTrack = db.prepare(`
  INSERT INTO tracks (title, artist_id, album_id, duration, audio_url, cover_url)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const trackResult = insertTrack.run(
  'Rise and Fall of China, Japan, and South Korea',
  artistId,
  null,
  1231, // 20 分 31 秒
  '/audio/chinajapan_korea_power.mp3',
  null
);

console.log('✅ 新音轨已添加');
console.log(`Track ID: ${trackResult.lastInsertRowid}`);

// 验证
const track = db.prepare(`
  SELECT t.*, a.name as artist_name
  FROM tracks t
  JOIN artists a ON t.artist_id = a.id
  WHERE t.id = ?
`).get(trackResult.lastInsertRowid);

console.log('🎵 Track info:', track);

db.close();
