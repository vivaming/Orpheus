import { NextResponse } from 'next/server';
import { getAllTracks, createTrack } from '@/lib/db';

export async function GET() {
  try {
    const tracks = getAllTracks();
    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = createTrack(body);
    return NextResponse.json({ id, message: 'Track created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}
