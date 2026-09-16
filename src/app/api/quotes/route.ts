import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'SELLER' || !session.sellerProfileId) {
      return NextResponse.json({ error: 'Unauthorized seller action' }, { status: 401 });
    }

    const {
      rfqId,
      offeredPrice,
      quantityAvailable,
      productionDays,
      shippingEstimate,
      terms
    } = await req.json();

    if (!rfqId || !offeredPrice || !quantityAvailable) {
      return NextResponse.json({ error: 'Missing required quote details' }, { status: 400 });
    }

    const quote = await prisma.quote.create({
      data: {
        rfqId,
        sellerProfileId: session.sellerProfileId,
        offeredPrice: Number(offeredPrice),
        quantityAvailable: Number(quantityAvailable),
        productionDays: Number(productionDays) || 5,
        shippingEstimate: shippingEstimate ? Number(shippingEstimate) : null,
        terms,
        status: 'PENDING'
      }
    });

    // Update RFQ status to QUOTED
    await prisma.rFQ.update({
      where: { id: rfqId },
      data: { status: 'QUOTED' }
    });

    return NextResponse.json({ success: true, quote });
  } catch (err: any) {
    console.error('Error creating quote:', err);
    return NextResponse.json({ error: 'Failed to send quote' }, { status: 500 });
  }
}
