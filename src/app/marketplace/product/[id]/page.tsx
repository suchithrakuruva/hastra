'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { MapPin, ShieldCheck, Clock, Package, Award, Sparkles, MessageSquare, ShoppingCart, Send, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqForm, setRfqForm] = useState({
    quantityRequired: 20,
    deliveryLocation: 'New Delhi',
    targetBudget: 40000,
    customizationDetails: 'Require custom brand tags & festive gift boxes.'
  });

  useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.product) {
          setProduct(d.product);
          setSelectedImage(d.product.images?.[0]?.enhancedUrl || d.product.images?.[0]?.originalUrl || '');
        }
      });
  }, [resolvedParams.id]);

  const handleRfqSubmit = async () => {
    try {
      const res = await fetch('/api/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          title: `Bulk Order Quote Request for ${product.title}`,
          quantityRequired: rfqForm.quantityRequired,
          deliveryLocation: rfqForm.deliveryLocation,
          targetBudget: rfqForm.targetBudget,
          customizationDetails: rfqForm.customizationDetails
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Your Bulk Quote Request (RFQ) has been sent directly to the artisan! They will review and submit their quote.');
        setRfqModalOpen(false);
        router.push('/buyer/rfqs');
      } else {
        alert(data.error || 'Please login as a registered buyer first.');
      }
    } catch (e) {
      alert('Failed to submit quote request. Make sure you are logged in.');
    }
  };

  const handleContactSeller = async () => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: product.sellerProfile?.userId,
          productId: product.id,
          content: `Hi ${product.sellerProfile?.shopName || 'Artisan'}, I am interested in your product "${product.title}". Could you provide more details?`
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/buyer/enquiries');
      } else {
        alert(data.error || 'Please sign in as a buyer to send enquiries.');
      }
    } catch (e) {
      alert('Failed to send message. Please log in.');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F3]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 font-bold">
          Loading Artisan Product...
        </div>
      </div>
    );
  }

  const seller = product.sellerProfile;

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/marketplace" className="hover:text-[#C65D3B]">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{product.craftType}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#243B53] font-bold truncate max-w-xs">{product.title}</span>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="soft-card overflow-hidden bg-white p-3 rounded-3xl border border-[#EAE3D2] shadow-md">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'}
                alt={product.title}
                className="w-full h-[450px] object-cover rounded-2xl"
              />
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images?.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.enhancedUrl || img.originalUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === (img.enhancedUrl || img.originalUrl)
                      ? 'border-[#C65D3B] scale-105 shadow-md'
                      : 'border-[#EAE3D2] opacity-70'
                  }`}
                >
                  <img src={img.enhancedUrl || img.originalUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, AI Specs, B2B Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-[#C65D3B] text-white px-2.5 py-0.5 rounded">
                  {product.craftType}
                </span>
                <span className="text-xs font-bold text-[#3E6650] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  100% Authentic Handmade ✓
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#243B53] leading-tight">{product.title}</h1>
              <p className="text-xs text-gray-500 mt-1">Origin: {product.origin || seller?.state}</p>
            </div>

            {/* Pricing Card */}
            <div className="soft-card p-5 bg-white border border-[#EAE3D2] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">B2B Wholesale Price</p>
                  <p className="text-3xl font-black text-[#243B53]">₹{product.price.toLocaleString()}</p>
                </div>
                {product.bulkPrice && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Bulk Tier (&gt;20 pcs)</p>
                    <p className="text-xl font-bold text-[#C65D3B]">₹{product.bulkPrice.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#EAE3D2] grid grid-cols-2 gap-2 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#C65D3B]" /> Min Order: <strong className="text-[#243B53]">{product.minOrderQty} pcs</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#3E6650]" /> Production: <strong className="text-[#243B53]">{product.estimatedProdTime || '3-5 days'}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#243B53]">Product Story & AI Description</h3>
              <p className="text-sm text-[#243B53]/80 leading-relaxed font-medium bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE3D2]">
                {product.detailedDescription || product.shortDescription}
              </p>
            </div>

            {/* B2B CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setRfqModalOpen(true)}
                className="w-full btn-touch btn-terracotta text-lg shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Request Bulk Quote / Customize
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleContactSeller}
                  className="btn-touch btn-indigo text-sm flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Contact Seller
                </button>
                <button
                  onClick={() => setRfqModalOpen(true)}
                  className="btn-touch bg-[#3E6650] text-white text-sm flex items-center justify-center gap-1.5 hover:bg-[#2d4d3c]"
                >
                  <ShoppingCart className="w-4 h-4" /> Buy Sample
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SPECIFICATIONS & MEET THE ARTISAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Product Specifications Table */}
          <div className="lg:col-span-6 soft-card p-6 bg-white space-y-4">
            <h3 className="text-lg font-bold text-[#243B53] border-b border-[#EAE3D2] pb-3">
              Craft Specifications
            </h3>
            <div className="divide-y divide-[#EAE3D2] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Craft Type</span>
                <span className="font-bold text-[#243B53]">{product.craftType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Material</span>
                <span className="font-bold text-[#243B53]">{product.material}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Dimensions</span>
                <span className="font-bold text-[#243B53]">{product.dimensions || 'Standard'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Weight</span>
                <span className="font-bold text-[#243B53]">{product.weight || '500g'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Color</span>
                <span className="font-bold text-[#243B53]">{product.color || 'Natural'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-semibold">Care Instructions</span>
                <span className="font-bold text-[#243B53]">{product.careInstructions || 'Gentle wash'}</span>
              </div>
            </div>
          </div>

          {/* MEET THE ARTISAN STORY CARD */}
          <div className="lg:col-span-6 soft-card p-6 bg-gradient-to-br from-white to-[#F4EBDD]/40 space-y-4 border-2 border-[#C65D3B]/20">
            <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#C65D3B] text-white flex items-center justify-center font-bold">
                  ह
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243B53]">Meet the Artisan</h3>
                  <p className="text-xs text-gray-500">{seller?.shopName || 'Lakshmi Handlooms'}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#3E6650] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Verified Producer ✓
              </span>
            </div>

            <p className="text-xs text-[#243B53]/90 leading-relaxed font-medium italic">
              "{seller?.story || 'Our family has preserved traditional handloom weaving techniques for over three generations, creating authentic heritage crafts with zero compromise on quality.'}"
            </p>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE3D2]">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Experience</p>
                <p className="font-bold text-sm text-[#243B53]">{seller?.yearsOfExperience || 15}+ Yrs</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE3D2]">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Weavers/Workers</p>
                <p className="font-bold text-sm text-[#243B53]">{seller?.numberOfWorkers || 6} Artisans</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE3D2]">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Location</p>
                <p className="font-bold text-sm text-[#243B53] truncate">{seller?.location || 'Telangana'}</p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* RFQ MODAL */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-4 border border-[#EAE3D2] shadow-2xl">
            <h3 className="text-xl font-bold text-[#243B53]">Request Bulk Quote for {product.title}</h3>
            
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Quantity Required (pcs)</label>
              <input
                type="number"
                value={rfqForm.quantityRequired}
                onChange={e => setRfqForm({ ...rfqForm, quantityRequired: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2 text-sm text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Delivery Destination / City</label>
              <input
                type="text"
                value={rfqForm.deliveryLocation}
                onChange={e => setRfqForm({ ...rfqForm, deliveryLocation: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2 text-sm text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Target Budget (₹ Optional)</label>
              <input
                type="number"
                value={rfqForm.targetBudget}
                onChange={e => setRfqForm({ ...rfqForm, targetBudget: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2 text-sm text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Customization / Branding Notes</label>
              <textarea
                value={rfqForm.customizationDetails}
                onChange={e => setRfqForm({ ...rfqForm, customizationDetails: e.target.value })}
                rows={3}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl p-3 text-xs text-[#243B53]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setRfqModalOpen(false)} className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm">
                Cancel
              </button>
              <button onClick={handleRfqSubmit} className="w-2/3 btn-touch btn-terracotta text-base">
                Submit RFQ to Artisan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
