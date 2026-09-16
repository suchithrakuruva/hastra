import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      password,
      confirmPassword,
      companyName,
      buyerType = 'RETAILER',
      preferredLang = 'en',
      gstin,
      businessLocation,
      procurementCategories
    } = body;

    if (!name || !phone || !password || !companyName) {
      return NextResponse.json({ error: 'Please fill in all mandatory buyer fields.' }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Password and confirm password do not match.' }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\s+/g, '');

    const existingPhone = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { phone: `+91${normalizedPhone}` },
          { phone: normalizedPhone.replace(/^\+91/, '') }
        ]
      }
    });

    if (existingPhone) {
      return NextResponse.json({ error: 'This mobile number is already registered. Please sign in.' }, { status: 400 });
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: email.trim() } });
      if (existingEmail) {
        return NextResponse.json({ error: 'This email address is already registered. Please sign in.' }, { status: 400 });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone: normalizedPhone,
        email: email ? email.trim() : null,
        passwordHash: password,
        role: 'BUYER',
        preferredLang,
        buyerProfile: {
          create: {
            companyName,
            buyerType,
            gstin: gstin || null,
            businessLocation: businessLocation || null,
            procurementCategories: procurementCategories || null,
            isVerified: true
          }
        }
      },
      include: { buyerProfile: true }
    });

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: 'BUYER',
      buyerProfileId: user.buyerProfile?.id,
      preferredLang: user.preferredLang
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        buyerProfile: user.buyerProfile
      },
      token
    });

    res.cookies.set('hastra_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err: any) {
    console.error('Register Buyer error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
