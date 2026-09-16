import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET: Fetch message conversations for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const withUserId = searchParams.get('with'); // optional: fetch thread with a specific user

    if (withUserId) {
      // Fetch message thread between current user and another user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: withUserId },
            { senderId: withUserId, receiverId: session.userId }
          ]
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } }
        },
        orderBy: { createdAt: 'asc' }
      });

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: { receiverId: session.userId, senderId: withUserId, isRead: false },
        data: { isRead: true }
      });

      return NextResponse.json({ success: true, messages });
    }

    // Fetch all conversation partners (inbox summary)
    const sentMessages = await prisma.message.findMany({
      where: { senderId: session.userId },
      select: { receiverId: true, receiver: { select: { id: true, name: true, role: true } }, content: true, createdAt: true, isRead: true },
      orderBy: { createdAt: 'desc' }
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: session.userId },
      select: { senderId: true, sender: { select: { id: true, name: true, role: true } }, content: true, createdAt: true, isRead: true },
      orderBy: { createdAt: 'desc' }
    });

    // Build unique conversation threads
    const conversationMap = new Map<string, any>();
    
    for (const m of sentMessages) {
      const partnerId = m.receiverId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: m.receiver.name,
          partnerRole: m.receiver.role,
          lastMessage: m.content,
          lastMessageAt: m.createdAt,
          unreadCount: 0
        });
      }
    }

    for (const m of receivedMessages) {
      const partnerId = m.senderId;
      const existing = conversationMap.get(partnerId);
      const unread = !m.isRead ? 1 : 0;
      if (existing) {
        existing.unreadCount = (existing.unreadCount || 0) + unread;
        if (new Date(m.createdAt) > new Date(existing.lastMessageAt)) {
          existing.lastMessage = m.content;
          existing.lastMessageAt = m.createdAt;
        }
      } else {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: m.sender.name,
          partnerRole: m.sender.role,
          lastMessage: m.content,
          lastMessageAt: m.createdAt,
          unreadCount: unread
        });
      }
    }

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    const unreadTotal = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return NextResponse.json({ success: true, conversations, unreadTotal });
  } catch (err: any) {
    console.error('Messages GET error:', err);
    return NextResponse.json({ error: 'Failed to load messages.' }, { status: 500 });
  }
}

// POST: Send a new message
export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Please log in to send messages.' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver ID and message content are required.' }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ error: 'Recipient not found.' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.userId,
        receiverId,
        content: content.trim(),
        isRead: false
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      }
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: any) {
    console.error('Messages POST error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
