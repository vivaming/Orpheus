import Database from 'better-sqlite3';
import type { Track, Playlist, Artist, Album, PlaylistTrack } from './types';

const db = new Database('orpheus.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT,
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    cover_url TEXT,
    release_date TEXT,
    FOREIGN KEY (artist_id) REFERENCES artists(id)
  );

  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    album_id INTEGER,
    duration INTEGER NOT NULL,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (album_id) REFERENCES albums(id)
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS playlist_tracks (
    playlist_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
  );
`);

// Check if we need to seed data
const trackCount = db.prepare('SELECT COUNT(*) as count FROM tracks').get() as { count: number };

if (trackCount.count === 0) {
  // Seed artists
  const insertArtist = db.prepare('INSERT INTO artists (name, image_url, bio) VALUES (?, ?, ?)');

  const artists = [
    { name: '周杰伦', image_url: '/artists/jay.jpg', bio: '华语流行音乐天王' },
    { name: '邓紫棋', image_url: '/artists/gem.jpg', bio: '香港创作歌手' },
    { name: '林俊杰', image_url: '/artists/jj.jpg', bio: '新加坡华语流行歌手' },
    { name: '陈奕迅', image_url: '/artists/eason.jpg', bio: '香港流行音乐歌手' },
    { name: '薛之谦', image_url: '/artists/joker.jpg', bio: '华语流行男歌手' },
    { name: 'Documentary', image_url: '/artists/doc.jpg', bio: '纪录片和历史内容' },
    { name: '三木説', image_url: '/artists/sanmu.jpg', bio: '二战历史播客' },
  ];

  const artistIds: number[] = [];
  for (const artist of artists) {
    const result = insertArtist.run(artist.name, artist.image_url, artist.bio);
    artistIds.push(result.lastInsertRowid as number);
  }

  // Seed albums
  const insertAlbum = db.prepare('INSERT INTO albums (title, artist_id, cover_url, release_date) VALUES (?, ?, ?, ?)');

  const albums = [
    { title: '最伟大的作品', artist_id: artistIds[0], cover_url: '/albums/greatest.jpg', release_date: '2022-07-15' },
    { title: '摩天动物园', artist_id: artistIds[1], cover_url: '/albums/zoo.jpg', release_date: '2019-12-27' },
    { title: '幸存者', artist_id: artistIds[2], cover_url: '/albums/survivor.jpg', release_date: '2020-10-20' },
    { title: '认了吧', artist_id: artistIds[3], cover_url: '/albums/admit.jpg', release_date: '2007-04-24' },
    { title: '尘', artist_id: artistIds[4], cover_url: '/albums/dust.jpg', release_date: '2020-12-31' },
  ];

  const albumIds: number[] = [];
  for (const album of albums) {
    const result = insertAlbum.run(album.title, album.artist_id, album.cover_url, album.release_date);
    albumIds.push(result.lastInsertRowid as number);
  }

  // Seed tracks (using placeholder audio URLs)
  const insertTrack = db.prepare('INSERT INTO tracks (title, artist_id, album_id, duration, audio_url, cover_url) VALUES (?, ?, ?, ?, ?, ?)');

  const tracks = [
    { title: '最伟大的作品', artist_id: artistIds[0], album_id: albumIds[0], duration: 286, audio_url: '/audio/track_1.mp3', cover_url: '/albums/greatest.jpg' },
    { title: '光年之外', artist_id: artistIds[1], album_id: albumIds[1], duration: 235, audio_url: '/audio/track_2.mp3', cover_url: '/albums/zoo.jpg' },
    { title: '修炼爱情', artist_id: artistIds[2], album_id: albumIds[2], duration: 298, audio_url: '/audio/track_3.mp3', cover_url: '/albums/survivor.jpg' },
    { title: '十年', artist_id: artistIds[3], album_id: albumIds[3], duration: 203, audio_url: '/audio/track_4.mp3', cover_url: '/albums/admit.jpg' },
    { title: '演员', artist_id: artistIds[4], album_id: albumIds[4], duration: 301, audio_url: '/audio/track_5.mp3', cover_url: '/albums/dust.jpg' },
    { title: 'relative rise and fall of the power  China, Japan, and South Korea', artist_id: artistIds[5], album_id: null, duration: 1231, audio_url: '/audio/chinajapan_korea_power.mp3', cover_url: null },
  ];

  const trackIds: number[] = [];
  for (const track of tracks) {
    const result = insertTrack.run(track.title, track.artist_id, track.album_id, track.duration, track.audio_url, track.cover_url);
    trackIds.push(result.lastInsertRowid as number);
  }

  // Seed playlists
  const insertPlaylist = db.prepare('INSERT INTO playlists (title, description, cover_url) VALUES (?, ?, ?)');

  const playlists = [
    { title: '华语经典', description: '精选华语流行经典歌曲', cover_url: '/playlists/classics.jpg' },
    { title: '深夜情歌', description: '适合深夜聆听的情歌', cover_url: '/playlists/night.jpg' },
  ];

  const playlistIds: number[] = [];
  for (const playlist of playlists) {
    const result = insertPlaylist.run(playlist.title, playlist.description, playlist.cover_url);
    playlistIds.push(result.lastInsertRowid as number);
  }

  // Add tracks to playlists
  const insertPlaylistTrack = db.prepare('INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (?, ?, ?)');

  // 华语经典 - all tracks
  trackIds.forEach((trackId, index) => {
    insertPlaylistTrack.run(playlistIds[0], trackId, index + 1);
  });

  // 深夜情歌 - selected tracks
  [trackIds[1], trackIds[2], trackIds[3]].forEach((trackId, index) => {
    insertPlaylistTrack.run(playlistIds[1], trackId, index + 1);
  });

  console.log('Database seeded successfully!');
}

// Database operations
export function getAllTracks(): Track[] {
  return db.prepare(`
    SELECT t.*, a.name as artist_name, al.title as album_title
    FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    LEFT JOIN albums al ON t.album_id = al.id
    ORDER BY t.id
  `).all() as Track[];
}

export function getTrackById(id: number): Track | undefined {
  return db.prepare(`
    SELECT t.*, a.name as artist_name, al.title as album_title
    FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    LEFT JOIN albums al ON t.album_id = al.id
    WHERE t.id = ?
  `).get(id) as Track | undefined;
}

export function createTrack(track: Omit<Track, 'id'>): number {
  const result = db.prepare(`
    INSERT INTO tracks (title, artist_id, album_id, duration, audio_url, cover_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(track.title, track.artist_id, track.album_id, track.duration, track.audio_url, track.cover_url);
  return result.lastInsertRowid as number;
}

export function getAllPlaylists(): (Playlist & { track_count: number })[] {
  return db.prepare(`
    SELECT p.*, COUNT(pt.track_id) as track_count
    FROM playlists p
    LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all() as (Playlist & { track_count: number })[];
}

export function getPlaylistById(id: number): (Playlist & { track_count: number }) | undefined {
  return db.prepare(`
    SELECT p.*, COUNT(pt.track_id) as track_count
    FROM playlists p
    LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(id) as (Playlist & { track_count: number }) | undefined;
}

export function getPlaylistTracks(playlistId: number): Track[] {
  return db.prepare(`
    SELECT t.*, a.name as artist_name, al.title as album_title
    FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    LEFT JOIN albums al ON t.album_id = al.id
    JOIN playlist_tracks pt ON t.id = pt.track_id
    WHERE pt.playlist_id = ?
    ORDER BY pt.position
  `).all(playlistId) as Track[];
}

export function createPlaylist(playlist: Omit<Playlist, 'id' | 'created_at'>): number {
  const result = db.prepare(`
    INSERT INTO playlists (title, description, cover_url)
    VALUES (?, ?, ?)
  `).run(playlist.title, playlist.description, playlist.cover_url);
  return result.lastInsertRowid as number;
}

export function addTrackToPlaylist(playlistId: number, trackId: number): void {
  const maxPosition = db.prepare(`
    SELECT COALESCE(MAX(position), 0) as max_pos FROM playlist_tracks WHERE playlist_id = ?
  `).get(playlistId) as { max_pos: number };

  db.prepare(`
    INSERT INTO playlist_tracks (playlist_id, track_id, position)
    VALUES (?, ?, ?)
  `).run(playlistId, trackId, maxPosition.max_pos + 1);
}

export function searchTracks(query: string): Track[] {
  return db.prepare(`
    SELECT t.*, a.name as artist_name, al.title as album_title
    FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    LEFT JOIN albums al ON t.album_id = al.id
    WHERE t.title LIKE ? OR a.name LIKE ? OR al.title LIKE ?
    ORDER BY t.id
  `).all(`%${query}%`, `%${query}%`, `%${query}%`) as Track[];
}

export function searchPlaylists(query: string): Playlist[] {
  return db.prepare(`
    SELECT * FROM playlists
    WHERE title LIKE ? OR description LIKE ?
    ORDER BY created_at DESC
  `).all(`%${query}%`, `%${query}%`) as Playlist[];
}

export function getAllArtists(): Artist[] {
  return db.prepare('SELECT * FROM artists ORDER BY name').all() as Artist[];
}

export { db };
