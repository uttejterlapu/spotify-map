import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/types';

// In-memory store for real chat messages
const messages: ChatMessage[] = [];

export async function GET(request: NextRequest) {
  const channel = request.nextUrl.searchParams.get('channel') || 'global';
  const filtered = messages.filter((m) => m.channelId === channel).slice(-50);
  return NextResponse.json({ messages: filtered });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.text?.trim() && !body.trackAttachment) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const isAnonymous = Boolean(body.isAnonymous);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderId: body.senderId || 'anon',
      senderName: isAnonymous ? 'Anonymous Listener' : (body.senderName || 'Anonymous'),
      senderAvatar: isAnonymous ? undefined : body.senderAvatar,
      senderCity: body.senderCity,
      text: body.text || '',
      timestamp: Date.now(),
      channelId: body.channelId || 'global',
      trackAttachment: body.trackAttachment || null,
      isAnonymous,
    };

    messages.push(newMsg);
    if (messages.length > 500) {
      messages.shift();
    }

    return NextResponse.json({ message: newMsg });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}
