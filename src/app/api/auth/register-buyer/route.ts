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
      companyName,
      buyerType = 'RETAILER',
      gstin,
      businessLocation,
      procurementCategories
    } = body;

    if (!name || !phone || !password || !companyName) {
      return NextResponse.json({ error: 'Missing required buyer fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ error: 'Mobile number already registered' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash: password,
        role: 'BUYER',
        preferredLang: 'en',
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
    console.error('Error in register-buyer:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
