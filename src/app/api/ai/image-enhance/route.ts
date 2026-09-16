import { NextRequest, NextResponse } from 'next/server';
import { enhanceImageWithAI } from '@/lib/ai-services';

export async function POST(req: NextRequest) {
  try {
    const { originalUrl, backgroundStyle = 'studio-neutral' } = await req.json();

    const result = await enhanceImageWithAI(originalUrl, backgroundStyle);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (err: any) {
    console.error('Error in AI Image Enhancer:', err);
    return NextResponse.json({
      success: false,
      error: 'AI couldn’t complete this step. You can try again or continue manually.',
      canRetry: true
    }, { status: 500 });
  }
}
