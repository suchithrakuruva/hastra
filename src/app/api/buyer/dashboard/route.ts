import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    
    if (!session || session.role !== 'BUYER' || !session.buyerProfileId) {
      return NextResponse.json({ error: 'Unauthorized buyer access. Please log in.' }, { status: 401 });
    }

    const buyer = await prisma.buyerProfile.findUnique({
      where: { id: session.buyerProfileId },
      include: {
        user: { select: { name: true, phone: true, email: true, preferredLang: true } },
        rfqs: { include: { quotes: true } },
        orders: true
      }
    });

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer profile not found' }, { status: 404 });
    }

    const totalRfqs = buyer.rfqs.length;
    const totalQuotesReceived = buyer.rfqs.reduce((acc, r) => acc + r.quotes.length, 0);
    const totalOrders = buyer.orders.length;

    const wishlistCount = await prisma.favorite.count({
      where: { userId: session.userId }
    });

    return NextResponse.json({
      success: true,
      buyerName: buyer.user.name,
      companyName: buyer.companyName,
      buyerType: buyer.buyerType,
      preferredLang: buyer.user.preferredLang || 'en',
      stats: {
        totalRfqs,
        totalQuotesReceived,
        totalOrders,
        wishlistCount
      },
      recentRfqs: buyer.rfqs.slice(0, 5),
      recentOrders: buyer.orders.slice(0, 5)
    });
  } catch (err: any) {
    console.error('Error in buyer dashboard API:', err);
    return NextResponse.json({ error: 'Failed to load buyer dashboard' }, { status: 500 });
  }
}
