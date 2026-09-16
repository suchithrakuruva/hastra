import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
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

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' });
  res.cookies.delete('hastra_token');
  return res;
}
