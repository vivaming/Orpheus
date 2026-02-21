import { NextResponse } from 'next/server';
import { searchTracks, searchPlaylists } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ tracks: [], playlists: [] });
    }

    const tracks = searchTracks(q);
    const playlists = searchPlaylists(q);

    return NextResponse.json({ tracks, playlists });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
