import { NextRequest, NextResponse } from 'next/server';
import { getTrackById } from '@/lib/db';
import fs from 'fs';
import path from 'path';

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

    // Construct file path
    const audioPath = path.join(process.cwd(), 'public', track.audio_url);

    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
    }

    // Get file stats
    const stat = fs.statSync(audioPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      // Handle range request (for seeking)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.openSync(audioPath, 'r');
      const buffer = Buffer.alloc(chunksize);
      fs.readSync(file, buffer, 0, chunksize, start);
      fs.closeSync(file);

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'audio/mpeg',
        },
      });
    } else {
      // Return full file
      const fileBuffer = fs.readFileSync(audioPath);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
        },
      });
    }
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json({ error: 'Failed to stream audio' }, { status: 500 });
  }
}
