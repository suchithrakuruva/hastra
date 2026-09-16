'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Camera, Mic, IndianRupee, Store, ArrowRight, ShieldCheck, Sparkles, Globe, Users, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#243B53] flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-24 bg-gradient-to-b from-[#F4EBDD]/70 via-[#FAF8F3] to-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-[#F4EBDD] border border-[#E2D7C3] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#C65D3B]">
                <Sparkles className="w-4 h-4 text-[#C65D3B]" />
                <span>Virtual Business Manager for Artisans & Weavers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#243B53] leading-tight tracking-tight">
                From Local Craft to <span className="text-[#C65D3B]">Global Market.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#243B53]/80 font-medium max-w-2xl leading-relaxed">
                An AI-powered digital business manager helping artisans, weavers, and micro-entrepreneurs digitize products, create professional listings, understand pricing, and connect with B2B buyers.
              </p>

              {/* Dual Persona Choice CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/auth/register-seller"
                  className="btn-touch btn-terracotta text-lg shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Store className="w-6 h-6" />
                  <span>I AM A SELLER (Start Selling)</span>
                </Link>

                <Link
                  href="/marketplace"
                  className="btn-touch btn-indigo text-lg shadow-md hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-6 h-6 text-[#F4EBDD]" />
                  <span>I AM A BUYER (Find Products)</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#EAE3D2] flex flex-wrap items-center gap-6 text-xs font-bold text-[#243B53]/70">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3E6650]" /> Verified Artisan Profiles
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#C65D3B]" /> Hindi & Telugu Voice Support
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#243B53]" /> Direct B2B Procurement
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                  alt="Indian Weaver at Handloom"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#243B53]/90 via-[#243B53]/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold text-[#F4EBDD] bg-[#C65D3B] px-2.5 py-1 rounded-md self-start mb-2">
                    Lakshmi Handlooms • Telangana
                  </span>
                  <h3 className="text-xl font-bold">Pochampally Ikat Handloom Master Artisans</h3>
                  <p className="text-xs text-white/80 mt-1">Digitized in 2 minutes using HASTRA Voice AI</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE THREE FEATURES */}
      <section className="py-16 bg-white border-y border-[#EAE3D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-[#243B53]">Everything You Need to Grow Your Craft Business</h2>
            <p className="text-[#243B53]/70 font-medium mt-2">Designed specifically for low-literacy artisans with voice-first controls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: AI Product Studio */}
            <div className="soft-card p-8 soft-card-hover flex flex-col items-start bg-[#FAF8F3]">
              <div className="w-14 h-14 rounded-2xl bg-[#C65D3B] text-white flex items-center justify-center mb-6 shadow-md">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#243B53] mb-2">📸 AI Product Studio</h3>
              <p className="text-sm text-[#243B53]/80 leading-relaxed mb-4">
                Photograph your craft on a messy bed or floor. Our AI automatically removes background noise, enhances lighting, and places your item in a professional studio setting.
              </p>
              <span className="text-xs font-bold text-[#C65D3B] flex items-center gap-1 mt-auto">
                Studio Quality Photos <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            {/* Feature 2: Voice-to-Catalog */}
            <div className="soft-card p-8 soft-card-hover flex flex-col items-start bg-[#FAF8F3]">
              <div className="w-14 h-14 rounded-2xl bg-[#243B53] text-white flex items-center justify-center mb-6 shadow-md">
                <Mic className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#243B53] mb-2">🎙️ Voice-to-Catalog</h3>
              <p className="text-sm text-[#243B53]/80 leading-relaxed mb-4">
                No typing required! Tap the microphone and describe your saree or craft in Hindi, Telugu, or English. The AI generates title, detailed descriptions, and SEO specifications.
              </p>
              <span className="text-xs font-bold text-[#243B53] flex items-center gap-1 mt-auto">
                Multilingual AI Engine <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            {/* Feature 3: Smart Pricing */}
            <div className="soft-card p-8 soft-card-hover flex flex-col items-start bg-[#FAF8F3]">
              <div className="w-14 h-14 rounded-2xl bg-[#3E6650] text-white flex items-center justify-center mb-6 shadow-md">
                <IndianRupee className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#243B53] mb-2">💰 Smart Pricing</h3>
              <p className="text-sm text-[#243B53]/80 leading-relaxed mb-4">
                Enter your raw material cost and labor hours. The AI Price Advisor analyzes category market benchmarks and gives you a transparent breakdown and recommended price range.
              </p>
              <span className="text-xs font-bold text-[#3E6650] flex items-center gap-1 mt-auto">
                Cost & Profit Intelligence <ArrowRight className="w-4 h-4" />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (6 STEPS) */}
      <section className="py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-[#243B53]">How HASTRA Works for Artisans</h2>
            <p className="text-[#243B53]/70 font-medium mt-2">6 simple steps from photo capture to B2B sale</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { step: '1', title: 'Capture Product', desc: 'Snap photo with phone camera' },
              { step: '2', title: 'Speak Language', desc: 'Describe item with voice' },
              { step: '3', title: 'AI Listing', desc: 'Auto-generates title & specs' },
              { step: '4', title: 'Smart Pricing', desc: 'Get cost breakdown & margins' },
              { step: '5', title: 'Connect Buyers', desc: 'Receive B2B quotes & RFQs' },
              { step: '6', title: 'Sell Year-Round', desc: 'Manage orders & growth' },
            ].map((st, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#EAE3D2] shadow-xs flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#F4EBDD] text-[#C65D3B] font-black text-lg flex items-center justify-center mb-3">
                  {st.step}
                </div>
                <h4 className="font-bold text-sm text-[#243B53] mb-1">{st.title}</h4>
                <p className="text-xs text-[#243B53]/70">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE PREVIEW */}
      <section className="py-16 bg-white border-t border-[#EAE3D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#243B53]">Featured B2B Artisan Products</h2>
              <p className="text-[#243B53]/70 text-sm font-medium mt-1">Authentic handcrafted products ready for wholesale & retail procurement.</p>
            </div>
            <Link href="/marketplace" className="btn-touch btn-terracotta text-sm">
              Explore All Marketplace Products <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <div key={idx} className="soft-card overflow-hidden soft-card-hover flex flex-col bg-[#FAF8F3]">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={p.images?.[0]?.enhancedUrl || p.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#243B53] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {p.craftType}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[11px] font-bold text-[#C65D3B]">{p.sellerProfile?.shopName}</span>
                  <h3 className="font-bold text-sm text-[#243B53] mt-1 line-clamp-2">{p.title}</h3>
                  <div className="mt-auto pt-3 border-t border-[#EAE3D2] flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Min Order: {p.minOrderQty} pcs</p>
                      <p className="text-lg font-black text-[#243B53]">₹{p.price.toLocaleString()}</p>
                    </div>
                    <Link href={`/marketplace/product/${p.id}`} className="bg-[#243B53] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#1a2c3f]">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#243B53] text-white py-12 border-t border-[#243B53]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C65D3B] flex items-center justify-center text-white font-bold">
                ह
              </div>
              <span className="text-xl font-black tracking-tight">HASTRA</span>
            </div>
            <p className="text-xs text-[#F4EBDD]/70 mt-1">Virtual Business Manager for Artisans, Micro-Entrepreneurs & Traditional Producers.</p>
          </div>
          <div className="text-xs text-[#F4EBDD]/70 font-medium">
            © 2026 HASTRA Platform. Built with Voice AI & Earthy Design System.
          </div>
        </div>
      </footer>
    </div>
  );
}
