import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, signToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { sellerProfile: true, buyerProfile: true }
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      preferredLang: user.preferredLang,
      sellerProfile: user.sellerProfile,
      buyerProfile: user.buyerProfile
    }
  });
}

// PATCH: Update user preferences (language, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { preferredLang } = body;

    if (!preferredLang || !['en', 'hi', 'te'].includes(preferredLang)) {
      return NextResponse.json({ error: 'Invalid language. Choose en, hi, or te.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { preferredLang }
    });

    // Re-issue token with updated lang
    const newToken = signToken({
      userId: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role as 'SELLER' | 'BUYER' | 'ADMIN',
      sellerProfileId: session.sellerProfileId,
      buyerProfileId: session.buyerProfileId,
      preferredLang: updatedUser.preferredLang
    });

    const res = NextResponse.json({
      success: true,
      preferredLang: updatedUser.preferredLang
    });
    res.cookies.set('hastra_token', newToken, { httpOnly: true, path: '/' });
    return res;
  } catch (err: any) {
    console.error('PATCH /api/auth/me error:', err);
    return NextResponse.json({ error: 'Failed to update preferences.' }, { status: 500 });
  }
}

// POST: Logout
export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' });
  res.cookies.delete('hastra_token');
  return res;
}
