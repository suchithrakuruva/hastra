import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sellerId = searchParams.get('sellerId');

    const where: any = { status: 'ACTIVE' };

    if (sellerId) {
      where.sellerProfileId = sellerId;
      delete where.status; // Sellers can see all their products regardless of status
    }

    if (category) {
      where.OR = [
        { categoryId: category },
        { craftType: { contains: category } },
        { title: { contains: category } }
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { craftType: { contains: search } },
        { material: { contains: search } },
        { keywords: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        sellerProfile: true,
        category: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'SELLER' || !session.sellerProfileId) {
      return NextResponse.json({ error: 'Unauthorized seller action' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      shortDescription,
      detailedDescription,
      craftType,
      material,
      origin,
      dimensions,
      weight,
      color,
      careInstructions,
      price,
      minOrderQty = 1,
      bulkPrice,
      estimatedProdTime,
      keywords,
      images = [],
      stockQuantity = 10
    } = body;

    if (!title || !price || !craftType) {
      return NextResponse.json({ error: 'Title, price, and craft type are required' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        sellerProfileId: session.sellerProfileId,
        title,
        shortDescription,
        detailedDescription,
        craftType,
        material: material || 'Handicraft',
        origin: origin || 'India',
        dimensions,
        weight,
        color,
        careInstructions,
        price: Number(price),
        minOrderQty: Number(minOrderQty) || 1,
        bulkPrice: bulkPrice ? Number(bulkPrice) : null,
        estimatedProdTime: estimatedProdTime || '3-5 days',
        keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
        status: 'ACTIVE',
        images: {
          create: (images.length > 0 ? images : ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80']).map((imgUrl: string, index: number) => ({
            originalUrl: imgUrl,
            enhancedUrl: imgUrl,
            isPrimary: index === 0
          }))
        },
        inventory: {
          create: {
            quantityAvailable: Number(stockQuantity) || 10,
            lowStockThreshold: 5
          }
        }
      },
      include: {
        images: true,
        inventory: true
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: err.message || 'Product creation failed' }, { status: 500 });
  }
}
