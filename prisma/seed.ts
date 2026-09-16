import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HASTRA database...');

  // 1. Categories
  const categories = [
    { name: 'Handloom & Textiles', slug: 'handloom-textiles', icon: 'Scissors', description: 'Traditional handwoven sarees, fabrics, shawls, and garments.' },
    { name: 'Woodcraft & Carvings', slug: 'woodcraft-carvings', icon: 'Box', description: 'Handcarved wooden decor, boxes, furniture, and artifacts.' },
    { name: 'Pottery & Terracotta', slug: 'pottery-terracotta', icon: 'Flame', description: 'Earthy terracotta pots, vases, clay cookware, and figurines.' },
    { name: 'Bamboo & Cane', slug: 'bamboo-cane', icon: 'TreeBamboo', description: 'Eco-friendly bamboo baskets, mats, and woven utilities.' },
    { name: 'Home Decor & Metalware', slug: 'home-decor', icon: 'Sparkles', description: 'Brass lamps, wall hangings, and decorative artifacts.' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
  }

  const handloomCat = await prisma.category.findUnique({ where: { slug: 'handloom-textiles' } });
  const woodCat = await prisma.category.findUnique({ where: { slug: 'woodcraft-carvings' } });
  const terraCat = await prisma.category.findUnique({ where: { slug: 'pottery-terracotta' } });
  const bambooCat = await prisma.category.findUnique({ where: { slug: 'bamboo-cane' } });

  // 2. Demo Sellers
  // Password for all demo accounts: "password123"
  // (In real app bcrypt is used; we store sample hashes or plain for demo seed)
  const passwordHash = '$2a$10$abcdefghijklmnopqrstuu';

  const seller1User = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      name: 'Lakshmi Devi',
      phone: '+919876543210',
      email: 'lakshmi@handlooms.in',
      passwordHash,
      role: 'SELLER',
      preferredLang: 'te',
      sellerProfile: {
        create: {
          shopName: 'Lakshmi Handlooms',
          craftType: 'Pochampally Ikat & Pure Cotton Weaving',
          productCategory: 'Handloom & Textiles',
          location: 'Pochampally',
          state: 'Telangana',
          district: 'Yadadri Bhuvanagiri',
          yearsOfExperience: 18,
          numberOfWorkers: 6,
          productionCapacity: '40 sarees/month',
          gstin: '36ABCDE1234F1Z5',
          udyamReg: 'UDYAM-TS-01-0012345',
          isVerified: true,
          story: 'Our family has preserved the traditional geometric Ikat weaving technique for 3 generations. Every saree is woven on pit looms with natural vegetable dyes.'
        }
      }
    },
    include: { sellerProfile: true }
  });

  const seller2User = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      name: 'Srinivasa Rao',
      phone: '+919876543211',
      email: 'srinivasa@woodcraft.in',
      passwordHash,
      role: 'SELLER',
      preferredLang: 'te',
      sellerProfile: {
        create: {
          shopName: 'Srinivasa Woodcraft',
          craftType: 'Rosewood & Teakwood Carving',
          productCategory: 'Woodcraft & Carvings',
          location: 'Kondapalli',
          state: 'Andhra Pradesh',
          district: 'NTR District',
          yearsOfExperience: 22,
          numberOfWorkers: 8,
          productionCapacity: '150 items/month',
          gstin: '37BCDEF2345G1Z6',
          udyamReg: 'UDYAM-AP-02-0045678',
          isVerified: true,
          story: 'We specialize in intricate traditional wood carving using seasoned rosewood and sustainable softwoods, finished with organic lacquer.'
        }
      }
    },
    include: { sellerProfile: true }
  });

  const seller3User = await prisma.user.upsert({
    where: { phone: '+919876543212' },
    update: {},
    create: {
      name: 'Meera Kumhar',
      phone: '+919876543212',
      email: 'meera@terracotta.in',
      passwordHash,
      role: 'SELLER',
      preferredLang: 'hi',
      sellerProfile: {
        create: {
          shopName: 'Meera Terracotta Works',
          craftType: 'Traditional Terracotta & Pottery',
          productCategory: 'Pottery & Terracotta',
          location: 'Gorakhpur',
          state: 'Uttar Pradesh',
          district: 'Gorakhpur',
          yearsOfExperience: 14,
          numberOfWorkers: 4,
          productionCapacity: '200 pieces/month',
          isVerified: true,
          story: 'Handcrafted red clay pottery molded by master potters using traditional wood-fired kilns.'
        }
      }
    },
    include: { sellerProfile: true }
  });

  const seller4User = await prisma.user.upsert({
    where: { phone: '+919876543213' },
    update: {},
    create: {
      name: 'Ananya Gogoi',
      phone: '+919876543213',
      email: 'ananya@bamboocrafts.in',
      passwordHash,
      role: 'SELLER',
      preferredLang: 'en',
      sellerProfile: {
        create: {
          shopName: 'Ananya Bamboo Crafts',
          craftType: 'Assam Bamboo & Cane Weaving',
          productCategory: 'Bamboo & Cane',
          location: 'Silchar',
          state: 'Assam',
          district: 'Cachar',
          yearsOfExperience: 10,
          numberOfWorkers: 5,
          productionCapacity: '120 baskets/month',
          isVerified: true,
          story: 'Sustainable bamboo storage and lifestyle utilities crafted by women self-help group members.'
        }
      }
    },
    include: { sellerProfile: true }
  });

  // 3. Demo Buyer
  const buyerUser = await prisma.user.upsert({
    where: { phone: '+919999988888' },
    update: {},
    create: {
      name: 'Rajesh Malhotra',
      phone: '+919999988888',
      email: 'procurement@heritageboutique.com',
      passwordHash,
      role: 'BUYER',
      preferredLang: 'en',
      buyerProfile: {
        create: {
          companyName: 'Heritage Crafts Retail & Wholesale',
          buyerType: 'BOUTIQUE',
          gstin: '07AAACH1234F1Z8',
          businessLocation: 'New Delhi',
          procurementCategories: 'Handloom & Textiles, Home Decor, Woodcraft',
          isVerified: true
        }
      }
    },
    include: { buyerProfile: true }
  });

  // 4. Demo Products
  const productsData = [
    {
      sellerProfileId: seller1User.sellerProfile!.id,
      categoryId: handloomCat?.id,
      title: 'Handwoven Pochampally Ikat Pure Cotton Saree',
      shortDescription: 'Authentic 100% pure cotton saree woven with traditional geometric Ikat motifs.',
      detailedDescription: 'Handcrafted by master weaver Lakshmi Devi using traditional pit looms. Features double Ikat weave with natural dyes, soft breathable pure cotton fabric, and contrast temple border.',
      craftType: 'Pochampally Ikat',
      material: '100% Pure Cotton',
      origin: 'Pochampally, Telangana',
      dimensions: '6.3 Meters (With Blouse)',
      weight: '550g',
      color: 'Deep Terracotta & Indigo Blue',
      careInstructions: 'Dry clean recommended for first wash. Gentle hand wash in cold water.',
      price: 2450.0,
      minOrderQty: 5,
      bulkPrice: 2150.0,
      estimatedProdTime: '3-5 Days',
      keywords: 'ikat saree, cotton saree, handloom, pochampally, handmade',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      stock: 18
    },
    {
      sellerProfileId: seller2User.sellerProfile!.id,
      categoryId: woodCat?.id,
      title: 'Handcarved Teakwood Decorative Jewellery Box',
      shortDescription: 'Intricately hand-carved floral motif wood box with antique brass latch.',
      detailedDescription: 'Made from seasoned solid teakwood, hand-carved with traditional floral filigree work. Features velvet-lined interior and brass fittings.',
      craftType: 'Teakwood Carving',
      material: 'Seasoned Teakwood & Brass',
      origin: 'Kondapalli, Andhra Pradesh',
      dimensions: '10 x 6 x 4 Inches',
      weight: '850g',
      color: 'Natural Dark Mahogany Finish',
      careInstructions: 'Wipe clean with soft dry cloth. Apply beeswax polish occasionally.',
      price: 1850.0,
      minOrderQty: 10,
      bulkPrice: 1550.0,
      estimatedProdTime: '4-7 Days',
      keywords: 'wooden box, carved box, teakwood, handicrafts, gift box',
      images: [
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'
      ],
      stock: 35
    },
    {
      sellerProfileId: seller3User.sellerProfile!.id,
      categoryId: terraCat?.id,
      title: 'Handcrafted Terracotta Decorative Flower Vase',
      shortDescription: 'Earthy hand-turned red clay vase with hand-painted folk tribal art.',
      detailedDescription: 'Traditional Gorakhpur terracotta artwork shaped on manual potter wheel and kiln-fired. Features tribal motif hand painting using natural earth pigments.',
      craftType: 'Terracotta Pottery',
      material: 'Natural Red Clay',
      origin: 'Gorakhpur, Uttar Pradesh',
      dimensions: '12 Inches Height x 6 Inches Base',
      weight: '1200g',
      color: 'Terracotta Red & Ochre Yellow',
      careInstructions: 'Handle with care. Clean with dry or damp cloth.',
      price: 1250.0,
      minOrderQty: 12,
      bulkPrice: 980.0,
      estimatedProdTime: '5-8 Days',
      keywords: 'terracotta vase, clay pot, pottery, home decor, handmade vase',
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
      ],
      stock: 40
    },
    {
      sellerProfileId: seller4User.sellerProfile!.id,
      categoryId: bambooCat?.id,
      title: 'Eco-Friendly Woven Bamboo Storage Basket Set',
      shortDescription: 'Set of 3 handwoven bamboo utility baskets with lid and leather handles.',
      detailedDescription: 'Handcrafted by Northeast women artisans using natural treated golden bamboo. Lightweight, durable, eco-friendly storage solution for modern homes.',
      craftType: 'Bamboo Weaving',
      material: '100% Natural Bamboo & Leather',
      origin: 'Silchar, Assam',
      dimensions: 'Large: 14", Medium: 12", Small: 10"',
      weight: '900g (Set)',
      color: 'Natural Golden Honey',
      careInstructions: 'Keep in dry area. Clean with brush or damp cloth.',
      price: 1650.0,
      minOrderQty: 8,
      bulkPrice: 1350.0,
      estimatedProdTime: '3-6 Days',
      keywords: 'bamboo basket, storage basket, sustainable, assam craft, eco friendly',
      images: [
        'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      ],
      stock: 25
    }
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        sellerProfileId: prod.sellerProfileId,
        categoryId: prod.categoryId,
        title: prod.title,
        shortDescription: prod.shortDescription,
        detailedDescription: prod.detailedDescription,
        craftType: prod.craftType,
        material: prod.material,
        origin: prod.origin,
        dimensions: prod.dimensions,
        weight: prod.weight,
        color: prod.color,
        careInstructions: prod.careInstructions,
        price: prod.price,
        minOrderQty: prod.minOrderQty,
        bulkPrice: prod.bulkPrice,
        estimatedProdTime: prod.estimatedProdTime,
        keywords: prod.keywords,
        images: {
          create: prod.images.map((url, idx) => ({
            originalUrl: url,
            enhancedUrl: url,
            isPrimary: idx === 0
          }))
        },
        inventory: {
          create: {
            quantityAvailable: prod.stock,
            lowStockThreshold: 5
          }
        },
        priceSuggestions: {
          create: {
            rawMaterialCost: prod.price * 0.4,
            laborCost: prod.price * 0.25,
            packagingCost: prod.price * 0.05,
            shippingCost: prod.price * 0.08,
            desiredMargin: prod.price * 0.22,
            suggestedMin: prod.price * 0.9,
            suggestedMax: prod.price * 1.15,
            suggestedExact: prod.price,
            explanation: 'AI price suggestion based on craft category historical benchmarks and material cost breakdown.'
          }
        }
      }
    });

    console.log(`Created product: ${createdProduct.title}`);
  }

  // 5. Demo RFQ
  const firstProd = await prisma.product.findFirst({ where: { title: { contains: 'Pochampally' } } });
  if (firstProd && buyerUser.buyerProfile) {
    await prisma.rFQ.create({
      data: {
        buyerProfileId: buyerUser.buyerProfile.id,
        productId: firstProd.id,
        title: 'Bulk Order Enquiry: Pochampally Cotton Sarees for Festive Season',
        quantityRequired: 50,
        deliveryLocation: 'Connaught Place, New Delhi',
        targetBudget: 110000,
        customizationDetails: 'Require custom brand tags on saree packaging. Delivery before October end.',
        status: 'OPEN',
        quotes: {
          create: {
            sellerProfileId: firstProd.sellerProfileId,
            offeredPrice: 2100,
            quantityAvailable: 50,
            productionDays: 14,
            shippingEstimate: 3500,
            terms: '50% advance payment upon order confirmation, balance before dispatch.',
            status: 'PENDING'
          }
        }
      }
    });
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
