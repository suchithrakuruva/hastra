import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let rfqs = [];
    if (session.role === 'BUYER' && session.buyerProfileId) {
      rfqs = await prisma.rFQ.findMany({
        where: { buyerProfileId: session.buyerProfileId },
        include: {
          product: { include: { images: true } },
          quotes: { include: { sellerProfile: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (session.role === 'SELLER' && session.sellerProfileId) {
      rfqs = await prisma.rFQ.findMany({
        where: {
          OR: [
            { product: { sellerProfileId: session.sellerProfileId } },
            { quotes: { some: { sellerProfileId: session.sellerProfileId } } }
          ]
        },
        include: {
          product: { include: { images: true } },
          buyerProfile: { include: { user: { select: { name: true, phone: true } } } },
          quotes: { where: { sellerProfileId: session.sellerProfileId } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      rfqs = await prisma.rFQ.findMany({
        include: { product: true, quotes: true },
        take: 20
      });
    }

    return NextResponse.json({ success: true, count: rfqs.length, rfqs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'BUYER' || !session.buyerProfileId) {
      return NextResponse.json({ error: 'Only registered buyers can request quotes' }, { status: 401 });
    }

    const {
      productId,
      title,
      quantityRequired,
      deliveryLocation,
      targetBudget,
      customizationDetails
    } = await req.json();

    if (!title || !quantityRequired || !deliveryLocation) {
      return NextResponse.json({ error: 'Missing required RFQ fields' }, { status: 400 });
    }

    const rfq = await prisma.rFQ.create({
      data: {
        buyerProfileId: session.buyerProfileId,
        productId: productId || null,
        title,
        quantityRequired: Number(quantityRequired),
        deliveryLocation,
        targetBudget: targetBudget ? Number(targetBudget) : null,
        customizationDetails,
        status: 'OPEN'
      }
    });

    return NextResponse.json({ success: true, rfq });
  } catch (err: any) {
    console.error('Error creating RFQ:', err);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}
