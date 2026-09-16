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
      udyamReg,
      bankDetails,
      panNumber,
      artisanCert,
      govtSchemeInfo
    } = body;

    if (!name || !phone || !password || !shopName || !craftType) {
      return NextResponse.json({ error: 'Missing required seller fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ error: 'Mobile number already registered' }, { status: 400 });
    }

    // Create user and seller profile
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash: password, // Store password string for demo/dev
        role: 'SELLER',
        preferredLang,
        sellerProfile: {
          create: {
            shopName,
            craftType,
            productCategory: productCategory || 'Handicrafts',
            location: location || 'Craft Hub',
            state: state || 'Telangana',
            district: district || 'Bhuvanagiri',
            yearsOfExperience: Number(yearsOfExperience) || 1,
            numberOfWorkers: Number(numberOfWorkers) || 1,
            productionCapacity,
            gstin: gstin || null,
            udyamReg: udyamReg || null,
            bankDetails: bankDetails || null,
            panNumber: panNumber || null,
            artisanCert: artisanCert || null,
            govtSchemeInfo: govtSchemeInfo || null,
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
    console.error('Error in register-seller:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
