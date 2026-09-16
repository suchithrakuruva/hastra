import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const sellerId = session?.sellerProfileId;

    const where = sellerId ? { sellerProfileId: sellerId } : {};
    const products = await prisma.product.findMany({
      where,
      include: { sellerProfile: true }
    });

    // Generate CSV Header
    let csvContent = 'Product ID,Title,Craft Type,Material,Origin,Price (INR),Min Order Qty,Seller Shop,State,GSTIN,Udyam Reg\n';

    products.forEach(p => {
      const row = [
        `"${p.id}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.craftType}"`,
        `"${p.material}"`,
        `"${p.origin || ''}"`,
        p.price,
        p.minOrderQty,
        `"${p.sellerProfile.shopName}"`,
        `"${p.sellerProfile.state}"`,
        `"${p.sellerProfile.gstin || ''}"`,
        `"${p.sellerProfile.udyamReg || ''}"`
      ].join(',');
      csvContent += row + '\n';
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="HASTRA_Artisan_Catalog_Export.csv"'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to export catalog' }, { status: 500 });
  }
}
