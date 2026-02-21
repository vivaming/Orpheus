export interface Artist {
  id: number;
  name: string;
  image_url?: string;
  bio?: string;
}

export interface Album {
  id: number;
  title: string;
  artist_id: number;
  cover_url?: string;
  release_date?: string;
}

export interface Track {
  id: number;
  title: string;
  artist_id: number;
  album_id?: number;
  duration: number; // in seconds
  audio_url: string;
  cover_url?: string;
  artist_name?: string; // joined from artist
  album_title?: string; // joined from album
}

export interface Playlist {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  created_at: string;
  track_count?: number;
}

export interface PlaylistTrack {
  playlist_id: number;
  track_id: number;
  position: number;
  added_at: string;
}

export interface SearchResult {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
}
