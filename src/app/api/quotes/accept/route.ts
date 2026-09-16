import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// POST: Accept or reject a quote (creates order on accept)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'BUYER' || !session.buyerProfileId) {
      return NextResponse.json({ error: 'Only buyers can respond to quotes.' }, { status: 401 });
    }

    const { quoteId, action } = await req.json(); // action: 'ACCEPT' | 'REJECT'

    if (!quoteId || !action) {
      return NextResponse.json({ error: 'quoteId and action are required.' }, { status: 400 });
    }

    // Find the quote and its RFQ
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { rfq: true, sellerProfile: true }
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
    }

    // Verify this RFQ belongs to the authenticated buyer
    if (quote.rfq.buyerProfileId !== session.buyerProfileId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    if (action === 'REJECT') {
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Quote rejected.' });
    }

    if (action === 'ACCEPT') {
      // Create an order from the accepted quote
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const totalAmount = quote.offeredPrice * quote.quantityAvailable + (quote.shippingEstimate || 0);

      const [updatedQuote, order] = await prisma.$transaction([
        prisma.quote.update({
          where: { id: quoteId },
          data: { status: 'ACCEPTED' }
        }),
        prisma.rFQ.update({
          where: { id: quote.rfqId },
          data: { status: 'ACCEPTED' }
        }),
        prisma.order.create({
          data: {
            orderNumber,
            buyerProfileId: session.buyerProfileId,
            sellerProfileId: quote.sellerProfileId,
            totalAmount,
            status: 'CONFIRMED',
            shippingAddress: quote.rfq.deliveryLocation,
            paymentStatus: 'PENDING'
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Quote accepted! Order placed successfully.',
        orderNumber
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use ACCEPT or REJECT.' }, { status: 400 });
  } catch (err: any) {
    console.error('Quote action error:', err);
    return NextResponse.json({ error: 'Failed to process quote action.' }, { status: 500 });
  }
}
