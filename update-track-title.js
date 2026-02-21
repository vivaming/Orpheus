import Database from 'better-sqlite3';

const db = new Database('orpheus.db');

// 更新标题为原始标题
const updateTrack = db.prepare('UPDATE tracks SET title = ? WHERE id = ?');
updateTrack.run('relative rise and fall of the power  China, Japan, and South Korea', 6);

console.log('✅ 标题已更新为原始标题');

// 验证
const track = db.prepare(`
  SELECT t.id, t.title, a.name as artist_name
  FROM tracks t
  JOIN artists a ON t.artist_id = a.id
  WHERE t.id = 6
`).get();

console.log('🎵 Track:', track);

db.close();
