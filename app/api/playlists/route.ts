import { NextResponse } from 'next/server';
import { getAllPlaylists } from '@/lib/data';

export async function GET() {
  try {
    const playlists = getAllPlaylists();
    return NextResponse.json({ playlists });
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Playlist creation not supported in static version' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
