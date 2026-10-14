import { NextRequest, NextResponse } from 'next/server';
import { MapUser } from '@/types';

// In-memory real active users registry
const activeUsers = new Map<string, MapUser>();

export async function GET() {
  const now = Date.now();
  // Filter users active in the last 2 minutes
  const activeList: MapUser[] = [];
  for (const [id, user] of activeUsers.entries()) {
    if (now - user.lastActive < 120000) {
      activeList.push(user);
    } else {
      activeUsers.delete(id);
    }
  }
  return NextResponse.json({ users: activeList });
}

export async function POST(request: NextRequest) {
  try {
    const user: MapUser = await request.json();
    if (!user || !user.id || !user.location) {
      return NextResponse.json({ error: 'Invalid user payload' }, { status: 400 });
    }

    user.lastActive = Date.now();
    
    // Privacy safeguard: scrub identifiable info if user selected anonymous mode
    if (user.isAnonymous) {
      user.name = 'Anonymous Listener';
      user.avatar = undefined;
    }

    const key = user.deviceId || user.id;
    activeUsers.set(key, user);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
