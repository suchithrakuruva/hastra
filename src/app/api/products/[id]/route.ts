import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        sellerProfile: {
          include: {
            user: { select: { name: true, phone: true, email: true } }
          }
        },
        category: true,
        inventory: true,
        priceSuggestions: true,
        reviews: { include: { user: { select: { name: true } } } }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        detailedDescription: body.detailedDescription,
        price: body.price ? Number(body.price) : undefined,
        minOrderQty: body.minOrderQty ? Number(body.minOrderQty) : undefined,
        bulkPrice: body.bulkPrice ? Number(body.bulkPrice) : undefined,
        status: body.status || undefined
      }
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
