import { NextResponse } from 'next/server';
import { getAllTracks } from '@/lib/data';

export async function GET() {
  try {
    const tracks = getAllTracks();
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Failed to fetch tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 在静态版本中，不实际创建，只返回成功消息
    return NextResponse.json({ message: 'Track creation not supported in static version' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}
