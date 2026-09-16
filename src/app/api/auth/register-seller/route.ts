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
      preferredLang = 'en',
      shopName,
      craftType,
      productCategory,
      location,
      state,
      district,
      yearsOfExperience = 1,
      numberOfWorkers = 1,
      productionCapacity = '50 items/month',
      gstin,
      udyamReg
    } = body;

    if (!name || !phone || !password || !shopName || !craftType) {
      return NextResponse.json({ error: 'Please fill in all mandatory seller fields.' }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Password and confirm password do not match.' }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\s+/g, '');

    // Check duplicate mobile number
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

    // Check duplicate email if email is provided
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: email.trim() } });
      if (existingEmail) {
        return NextResponse.json({ error: 'This email address is already registered. Please sign in.' }, { status: 400 });
      }
    }

    // Create user with seller profile
    const user = await prisma.user.create({
      data: {
        name,
        phone: normalizedPhone,
        email: email ? email.trim() : null,
        passwordHash: password,
        role: 'SELLER',
        preferredLang,
        sellerProfile: {
          create: {
            shopName,
            craftType,
            productCategory: productCategory || 'Handloom & Textiles',
            location: location || 'Village Craft Hub',
            state: state || 'Telangana',
            district: district || 'Bhuvanagiri',
            yearsOfExperience: Number(yearsOfExperience) || 1,
            numberOfWorkers: Number(numberOfWorkers) || 1,
            productionCapacity,
            gstin: gstin || null,
            udyamReg: udyamReg || null,
            isVerified: true
          }
        }
      },
      include: { sellerProfile: true }
    });

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: 'SELLER',
      sellerProfileId: user.sellerProfile?.id,
      preferredLang: user.preferredLang
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        sellerProfile: user.sellerProfile
      },
      token
    });

    res.cookies.set('hastra_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err: any) {
    console.error('Register Seller error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
