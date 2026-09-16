import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.userId },
      include: {
        product: {
          include: {
            images: true,
            sellerProfile: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, favorites });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Please log in to save products.' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existing = await prisma.favorite.findFirst({
      where: { userId: session.userId, productId }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, saved: false, message: 'Removed from wishlist' });
    } else {
      await prisma.favorite.create({
        data: { userId: session.userId, productId }
      });
      return NextResponse.json({ success: true, saved: true, message: 'Added to wishlist' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
