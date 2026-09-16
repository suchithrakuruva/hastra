import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    
    // Default fallback to first demo seller if session not active
    let sellerProfileId = session?.sellerProfileId;
    if (!sellerProfileId) {
      const firstSeller = await prisma.sellerProfile.findFirst({
        include: { user: true }
      });
      sellerProfileId = firstSeller?.id;
    }

    if (!sellerProfileId) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { id: sellerProfileId },
      include: {
        user: { select: { name: true, phone: true, preferredLang: true } },
        products: { include: { images: true, inventory: true } },
        orders: { include: { items: true, buyerProfile: true }, orderBy: { createdAt: 'desc' } },
        quotes: { include: { rfq: true } }
      }
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const totalProducts = seller.products.length;
    const totalOrders = seller.orders.length;
    const pendingOrders = seller.orders.filter(o => o.status === 'PENDING').length;
    const totalRevenue = seller.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalInventory = seller.products.reduce((acc, p) => acc + (p.inventory?.quantityAvailable || 0), 0);
    
    // Count buyer enquiries (RFQs matching seller products)
    const buyerEnquiriesCount = await prisma.rFQ.count({
      where: {
        product: { sellerProfileId }
      }
    });

    return NextResponse.json({
      success: true,
      sellerName: seller.user.name,
      shopName: seller.shopName,
      craftType: seller.craftType,
      stats: {
        productsListed: totalProducts,
        totalOrders,
        pendingOrders,
        revenue: totalRevenue,
        inventory: totalInventory,
        buyerEnquiries: buyerEnquiriesCount + seller.quotes.length
      },
      recentProducts: seller.products.slice(0, 5),
      recentOrders: seller.orders.slice(0, 5)
    });
  } catch (err: any) {
    console.error('Error fetching seller dashboard:', err);
    return NextResponse.json({ error: 'Failed to load seller dashboard' }, { status: 500 });
  }
}
