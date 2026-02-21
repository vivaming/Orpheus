import { NextResponse } from 'next/server';
import { getAllPlaylists, createPlaylist } from '@/lib/db';

export async function GET() {
  try {
    const playlists = getAllPlaylists();
    return NextResponse.json({ playlists });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = createPlaylist(body);
    return NextResponse.json({ id, message: 'Playlist created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
