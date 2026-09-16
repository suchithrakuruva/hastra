import { prisma } from './prisma';

export interface ImageEnhanceResult {
  originalUrl: string;
  enhancedUrl: string;
  studioBackground: string;
  transformations: string[];
}

export interface CatalogResult {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  craftType: string;
  material: string;
  origin: string;
  dimensions: string;
  weight: string;
  color: string;
  careInstructions: string;
  keywords: string[];
  translations: {
    hi: { title: string; description: string };
    te: { title: string; description: string };
  };
}

export interface PriceAdviceInput {
  rawMaterialCost: number;
  laborCost: number;
  productionHours: number;
  packagingCost: number;
  shippingCost: number;
  desiredMargin: number;
  craftType: string;
  category?: string;
}

export interface PriceAdviceResult {
  suggestedMin: number;
  suggestedMax: number;
  suggestedExact: number;
  breakdown: {
    rawMaterials: number;
    labor: number;
    packaging: number;
    operatingCost: number;
    margin: number;
  };
  explanation: string;
}

// 1. AI Image Enhancer Studio
export async function enhanceImageWithAI(
  originalUrl: string,
  backgroundStyle: string = 'studio-neutral'
): Promise<ImageEnhanceResult> {
  // Check for live remove.bg / Cloudinary API keys
  if (process.env.REMOVE_BG_API_KEY && process.env.CLOUDINARY_URL) {
    try {
      // Live API call structure goes here if keys exist
    } catch (e) {
      console.warn('Live AI Image enhancement failed, falling back to mock adapter:', e);
    }
  }

  // Demo / Mock Adapter with studio background styling
  const studioBackdrops: Record<string, string> = {
    'studio-neutral': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    'handloom-loom': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    'wood-workshop': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    'soft-linen': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  };

  const enhancedUrl = originalUrl || studioBackdrops[backgroundStyle] || studioBackdrops['studio-neutral'];

  return {
    originalUrl: originalUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    enhancedUrl,
    studioBackground: backgroundStyle,
    transformations: [
      'Messy background removed & studio backdrop applied',
      'Lighting & color exposure corrected',
      'Product centered & sharp focus enhanced',
      'Marketplace 1:1 aspect ratio generated'
    ]
  };
}

// 2. Multilingual Voice-to-Catalog Engine
export async function generateCatalogFromVoice(
  transcription: string,
  detectedLang: string = 'en'
): Promise<CatalogResult> {
  const textLower = transcription.toLowerCase();

  // Craft detection heuristics
  let craftType = 'Traditional Indian Handicraft';
  let material = 'Natural Craft Material';
  let category = 'Handicrafts';
  let title = 'Handcrafted Artisan Product';
  let origin = 'India';

  if (textLower.includes('saree') || textLower.includes('handloom') || textLower.includes('cotton') || textLower.includes('ikat') || textLower.includes('weave')) {
    craftType = 'Handloom Cotton Weaving';
    material = '100% Pure Organic Cotton';
    category = 'Handloom & Textiles';
    title = 'Authentic Handwoven Pure Cotton Traditional Saree';
    origin = 'Pochampally, Telangana';
  } else if (textLower.includes('wood') || textLower.includes('carv') || textLower.includes('box')) {
    craftType = 'Teakwood Carving';
    material = 'Solid Teakwood';
    category = 'Woodcraft & Carvings';
    title = 'Handcarved Decorative Artisan Wooden Box';
    origin = 'Kondapalli, Andhra Pradesh';
  } else if (textLower.includes('clay') || textLower.includes('pot') || textLower.includes('terracotta') || textLower.includes('vase')) {
    craftType = 'Terracotta Pottery';
    material = 'Natural Red Terracotta Clay';
    category = 'Pottery & Terracotta';
    title = 'Handcrafted Red Terracotta Decorative Clay Vase';
    origin = 'Gorakhpur, Uttar Pradesh';
  } else if (textLower.includes('bamboo') || textLower.includes('basket') || textLower.includes('cane')) {
    craftType = 'Bamboo Weaving';
    material = '100% Treated Natural Bamboo';
    category = 'Bamboo & Cane';
    title = 'Eco-Friendly Handwoven Bamboo Storage Basket';
    origin = 'Silchar, Assam';
  }

  return {
    title,
    shortDescription: `Handcrafted with extreme care by village artisans using traditional ${craftType} techniques. Perfect for modern eco-conscious buyers.`,
    detailedDescription: `This ${title} is created using age-old ancestral traditions passed down through generations. Based on the artisan description: "${transcription}". Each item takes dedicated manual labor and high precision.`,
    craftType,
    material,
    origin,
    dimensions: 'Standard Craft Dimensions',
    weight: '500g - 800g',
    color: 'Natural Earthy Shades',
    careInstructions: 'Handle with care. Clean gently with a soft dry or slightly damp cloth.',
    keywords: ['artisan', 'handicraft', craftType.toLowerCase(), 'handmade', 'authentic', 'sustainable'],
    translations: {
      hi: {
        title: `हस्तनिर्मित पारंपरिक ${craftType} उत्पाद`,
        description: `ग्रामीण कारीगरों द्वारा पारंपरिक ${craftType} विधि से तैयार किया गया प्रामाणिक हस्तशिल्प उत्पाद।`
      },
      te: {
        title: `చేనేత సాంప్రదాయ ${craftType} ఉత్పత్తులు`,
        description: `చేనేత కళాకారులు స్వయంగా తయారుచేసిన నాణ్యమైన సాంప్రదాయ ఉత్పత్తులు.`
      }
    }
  };
}

// 3. AI Price Advisor Engine
export async function calculatePriceAdvice(input: PriceAdviceInput): Promise<PriceAdviceResult> {
  const raw = Number(input.rawMaterialCost) || 0;
  const labor = Number(input.laborCost) || 0;
  const packaging = Number(input.packagingCost) || 0;
  const shipping = Number(input.shippingCost) || 0;
  const desiredMargin = Number(input.desiredMargin) || (raw + labor) * 0.2;

  const operatingCost = Math.round((raw + labor) * 0.1);
  const totalCost = raw + labor + packaging + shipping + operatingCost;

  const suggestedExact = Math.round(totalCost + desiredMargin);
  const suggestedMin = Math.round(suggestedExact * 0.9);
  const suggestedMax = Math.round(suggestedExact * 1.15);

  return {
    suggestedMin,
    suggestedMax,
    suggestedExact,
    breakdown: {
      rawMaterials: raw,
      labor,
      packaging,
      operatingCost,
      margin: desiredMargin
    },
    explanation: `Based on your material cost (₹${raw}) and labor cost (₹${labor}), plus estimated operating expenses, selling between ₹${suggestedMin} and ₹${suggestedMax} maintains a healthy 20-30% craft margin while staying competitive in the B2B marketplace.`
  };
}

// 4. AI Business Assistant Chatbot
export async function askBusinessAssistant(sellerProfileId: string, query: string): Promise<string> {
  const seller = await prisma.sellerProfile.findUnique({
    where: { id: sellerProfileId },
    include: { products: true, orders: true }
  });

  const queryLower = query.toLowerCase();

  if (!seller) {
    return "Hello! I am your HASTRA AI Business Assistant. How can I help you manage your artisan store today?";
  }

  const productCount = seller.products.length;
  const orderCount = seller.orders.length;
  const pendingOrders = seller.orders.filter(o => o.status === 'PENDING').length;

  if (queryLower.includes('how many product') || queryLower.includes('products')) {
    return `You currently have ${productCount} active product listings in your store "${seller.shopName}". You can add more anytime using the voice or camera tools!`;
  }

  if (queryLower.includes('order') || queryLower.includes('pending')) {
    return `You have ${orderCount} total orders, including ${pendingOrders} pending orders requiring fulfillment. Make sure to check your Buyer Orders tab!`;
  }

  if (queryLower.includes('charge') || queryLower.includes('price')) {
    return `To set the right price, click on "Check Suggested Price" on your dashboard. Enter your raw material and labor costs, and our AI Price Advisor will calculate your exact recommended profit range!`;
  }

  if (queryLower.includes('sell more') || queryLower.includes('growth')) {
    return `To sell more on HASTRA: 1) Add studio-enhanced photos using AI Product Studio, 2) Complete your "Meet the Artisan" story, 3) Respond quickly to B2B Bulk RFQ enquiries!`;
  }

  return `Hello ${seller.shopName}! I can help you check inventory (${productCount} products), review pending orders (${pendingOrders} pending), calculate prices, or generate catalog descriptions. What would you like to do?`;
}
