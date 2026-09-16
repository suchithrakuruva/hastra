import { NextRequest, NextResponse } from 'next/server';
import { generateCatalogFromVoice } from '@/lib/ai-services';

export async function POST(req: NextRequest) {
  try {
    const { transcription, detectedLang = 'en' } = await req.json();

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json({ error: 'Voice input transcription is required' }, { status: 400 });
    }

    const catalog = await generateCatalogFromVoice(transcription, detectedLang);

    return NextResponse.json({
      success: true,
      catalog
    });
  } catch (err: any) {
    console.error('Error in AI Voice Catalog:', err);
    return NextResponse.json({
      success: false,
      error: 'AI couldn’t complete this step. You can try again or continue manually.'
    }, { status: 500 });
  }
}
