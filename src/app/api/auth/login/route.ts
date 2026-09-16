import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { sellerProfile: true, buyerProfile: true }
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid mobile number or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as 'SELLER' | 'BUYER' | 'ADMIN',
      sellerProfileId: user.sellerProfile?.id,
      buyerProfileId: user.buyerProfile?.id,
      preferredLang: user.preferredLang
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        sellerProfile: user.sellerProfile,
        buyerProfile: user.buyerProfile
      },
      token
    });

    res.cookies.set('hastra_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
