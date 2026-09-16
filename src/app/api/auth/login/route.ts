import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { identifier, phone, email, password } = await req.json();
    const loginInput = (identifier || phone || email || '').trim();

    if (!loginInput || !password) {
      return NextResponse.json({ error: 'Please enter your email/mobile number and password.' }, { status: 400 });
    }

    // Detect if input is Email or Mobile Number
    const isEmail = loginInput.includes('@');
    
    // Normalize mobile number (strip spaces/dashes)
    let normalizedPhone = loginInput;
    if (!isEmail) {
      normalizedPhone = loginInput.replace(/\s+/g, '').replace(/-/g, '');
    }

    // Search user by email OR phone
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: loginInput.toLowerCase() }
        : {
            OR: [
              { phone: normalizedPhone },
              { phone: `+91${normalizedPhone}` },
              { phone: normalizedPhone.replace(/^\+91/, '') }
            ]
          },
      include: { sellerProfile: true, buyerProfile: true }
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid mobile/email or password.' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as 'SELLER' | 'BUYER' | 'ADMIN',
      sellerProfileId: user.sellerProfile?.id,
      buyerProfileId: user.buyerProfile?.id,
      preferredLang: user.preferredLang || 'en'
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        preferredLang: user.preferredLang,
        sellerProfile: user.sellerProfile,
        buyerProfile: user.buyerProfile
      },
      token
    });

    res.cookies.set('hastra_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
