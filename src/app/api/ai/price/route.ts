import { NextRequest, NextResponse } from 'next/server';
import { calculatePriceAdvice, askBusinessAssistant } from '@/lib/ai-services';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'assistant') {
      const session = getSessionFromRequest(req);
      const sellerProfileId = session?.sellerProfileId || '';
      const reply = await askBusinessAssistant(sellerProfileId, body.query || '');
      return NextResponse.json({ success: true, reply });
    }

    // Default: Price Advisor
    const result = await calculatePriceAdvice(body);

    return NextResponse.json({
      success: true,
      result,
      disclaimer: 'AI-generated estimate based on available historical/reference data.'
    });
  } catch (err: any) {
    console.error('Error in AI Price Advisor:', err);
    return NextResponse.json({
      success: false,
      error: 'AI couldn’t complete this step. You can enter pricing manually.'
    }, { status: 500 });
  }
}
