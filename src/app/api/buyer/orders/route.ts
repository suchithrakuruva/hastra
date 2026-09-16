import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET: Buyer orders with full tracking detail
export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'BUYER' || !session.buyerProfileId) {
      return NextResponse.json({ error: 'Unauthorized. Buyer login required.' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerProfileId: session.buyerProfileId },
      include: {
        sellerProfile: {
          select: {
            shopName: true, craftType: true, location: true, state: true,
            user: { select: { name: true, phone: true } }
          }
        },
        items: {
          include: {
            product: {
              include: { images: { take: 1 } }
            }
          }
        },
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error('Buyer orders error:', err);
    return NextResponse.json({ error: 'Failed to load orders.' }, { status: 500 });
  }
}
