import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET: Fetch RFQs based on user role
export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Please log in to view RFQs.' }, { status: 401 });
    }

    if (session.role === 'BUYER' && session.buyerProfileId) {
      // Return buyer's own RFQs with received quotes
      const rfqs = await prisma.rFQ.findMany({
        where: { buyerProfileId: session.buyerProfileId },
        include: {
          product: { include: { images: true } },
          quotes: {
            include: {
              sellerProfile: {
                select: { shopName: true, craftType: true, location: true, state: true, isVerified: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ success: true, rfqs });
    }

    if (session.role === 'SELLER' && session.sellerProfileId) {
      // Return open/quoted RFQs relevant to seller's category (market view)
      const rfqs = await prisma.rFQ.findMany({
        where: { status: { in: ['OPEN', 'QUOTED'] } },
        include: {
          product: { include: { images: true } },
          buyerProfile: {
            select: { companyName: true, buyerType: true, businessLocation: true }
          },
          quotes: {
            where: { sellerProfileId: session.sellerProfileId }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      return NextResponse.json({ success: true, rfqs });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err: any) {
    console.error('RFQ GET error:', err);
    return NextResponse.json({ error: 'Failed to load RFQs' }, { status: 500 });
  }
}

// POST: Create a new RFQ (Buyer only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'BUYER' || !session.buyerProfileId) {
      return NextResponse.json({ error: 'Only authenticated buyers can create RFQs.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      quantityRequired,
      deliveryLocation,
      requiredByDate,
      targetBudget,
      customizationDetails,
      productId
    } = body;

    if (!title || !quantityRequired || !deliveryLocation) {
      return NextResponse.json({
        error: 'Title, quantity required, and delivery location are mandatory.'
      }, { status: 400 });
    }

    const rfq = await prisma.rFQ.create({
      data: {
        buyerProfileId: session.buyerProfileId,
        title: title.trim(),
        quantityRequired: Number(quantityRequired),
        deliveryLocation: deliveryLocation.trim(),
        requiredByDate: requiredByDate ? new Date(requiredByDate) : null,
        targetBudget: targetBudget ? Number(targetBudget) : null,
        customizationDetails: customizationDetails?.trim() || null,
        productId: productId || null,
        status: 'OPEN'
      },
      include: {
        quotes: true,
        product: { include: { images: true } }
      }
    });

    return NextResponse.json({ success: true, rfq }, { status: 201 });
  } catch (err: any) {
    console.error('RFQ POST error:', err);
    return NextResponse.json({ error: 'Failed to create RFQ' }, { status: 500 });
  }
}
