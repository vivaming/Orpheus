import { NextResponse } from 'next/server';
import { searchTracks, searchPlaylists } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    
    const tracks = searchTracks(q);
    const playlists = searchPlaylists(q);
    
    return NextResponse.json({ tracks, playlists });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
