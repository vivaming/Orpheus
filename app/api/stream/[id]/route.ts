import { NextRequest, NextResponse } from 'next/server';
import { getTrackById } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackId = parseInt(id);

    if (isNaN(trackId)) {
      return NextResponse.json({ error: 'Invalid track ID' }, { status: 400 });
    }

    const track = getTrackById(trackId);

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // 在 Vercel 上，音频文件是静态的，直接重定向到文件路径
    return NextResponse.redirect(new URL(track.audio_url, request.url));
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json({ error: 'Failed to stream audio' }, { status: 500 });
  }
}
