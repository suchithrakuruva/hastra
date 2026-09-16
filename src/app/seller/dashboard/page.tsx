'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SellerBottomNav from '@/components/SellerBottomNav';
import AIBusinessAssistant from '@/components/AIBusinessAssistant';
import { Camera, Mic, Sparkles, IndianRupee, Package, ShoppingBag, MessageSquare, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/seller')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    productsListed: 4,
    totalOrders: 6,
    pendingOrders: 2,
    revenue: 14700,
    inventory: 78,
    buyerEnquiries: 5
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24 font-sans text-[#243B53]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP GREETING BANNER */}
        <div className="bg-gradient-to-r from-[#243B53] to-[#1a2c3f] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-[#C65D3B]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-[#C65D3B] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                Artisan Virtual Manager
              </span>
              <span className="text-xs text-[#F4EBDD] font-medium">Verified Producer ✓</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Good morning, {data?.sellerName || 'Lakshmi Devi'} 👋
            </h1>
            <p className="text-sm text-[#F4EBDD]/80 font-medium mt-1">
              Store: <span className="font-bold text-white">{data?.shopName || 'Lakshmi Handlooms'}</span> ({data?.craftType || 'Pochampally Ikat'})
            </p>
          </div>

          <Link
            href="/seller/product/new"
            className="btn-touch btn-terracotta text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 voice-pulse shrink-0"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>📸 Add New Product</span>
          </Link>
        </div>

        {/* LARGE VISUAL STATISTICS CARDS */}
        <div>
          <h2 className="text-xl font-bold text-[#243B53] mb-4">Store Performance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-[#243B53]">
              <p className="text-xs text-gray-500 font-bold uppercase">Products Listed</p>
              <p className="text-3xl font-black text-[#243B53] mt-1">{stats.productsListed}</p>
            </div>

            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-[#3E6650]">
              <p className="text-xs text-gray-500 font-bold uppercase">Total Orders</p>
              <p className="text-3xl font-black text-[#3E6650] mt-1">{stats.totalOrders}</p>
            </div>

            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-[#C65D3B]">
              <p className="text-xs text-gray-500 font-bold uppercase">Pending Orders</p>
              <p className="text-3xl font-black text-[#C65D3B] mt-1">{stats.pendingOrders}</p>
            </div>

            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-[#243B53]">
              <p className="text-xs text-gray-500 font-bold uppercase">Revenue</p>
              <p className="text-2xl font-black text-[#243B53] mt-1">₹{stats.revenue.toLocaleString()}</p>
            </div>

            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-amber-500">
              <p className="text-xs text-gray-500 font-bold uppercase">Inventory</p>
              <p className="text-3xl font-black text-amber-600 mt-1">{stats.inventory}</p>
            </div>

            <div className="soft-card p-4 text-center bg-white border-l-4 border-l-purple-600">
              <p className="text-xs text-gray-500 font-bold uppercase">Buyer Enquiries</p>
              <p className="text-3xl font-black text-purple-700 mt-1">{stats.buyerEnquiries}</p>
            </div>

          </div>
        </div>

        {/* MAIN QUICK ACTIONS GRID */}
        <div>
          <h2 className="text-xl font-bold text-[#243B53] mb-4">Quick Business Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Action 1: Add Product */}
            <Link
              href="/seller/product/new"
              className="soft-card p-6 soft-card-hover bg-[#C65D3B] text-white flex flex-col justify-between h-44 shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">Voice & Camera</span>
              </div>
              <div>
                <h3 className="text-xl font-black group-hover:translate-x-1 transition-transform">📸 Add Product</h3>
                <p className="text-xs text-white/90 font-medium mt-1">Guided 7-step wizard with AI Studio</p>
              </div>
            </Link>

            {/* Action 2: Voice Description */}
            <Link
              href="/seller/product/new?step=3"
              className="soft-card p-6 soft-card-hover bg-[#243B53] text-white flex flex-col justify-between h-44 shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Mic className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold bg-[#C65D3B] text-white px-2.5 py-1 rounded-full">Telugu / Hindi</span>
              </div>
              <div>
                <h3 className="text-xl font-black group-hover:translate-x-1 transition-transform">🎙️ Describe With Voice</h3>
                <p className="text-xs text-white/90 font-medium mt-1">Speak in your mother tongue</p>
              </div>
            </Link>

            {/* Action 3: AI Product Studio */}
            <Link
              href="/seller/product/new?step=2"
              className="soft-card p-6 soft-card-hover bg-white border border-[#EAE3D2] text-[#243B53] flex flex-col justify-between h-44 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold bg-[#F4EBDD] text-[#C65D3B] px-2.5 py-1 rounded-full">Background AI</span>
              </div>
              <div>
                <h3 className="text-xl font-black group-hover:translate-x-1 transition-transform">✨ AI Product Studio</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Clean backdrop & lighting fixer</p>
              </div>
            </Link>

            {/* Action 4: Check Suggested Price */}
            <Link
              href="/seller/product/new?step=5"
              className="soft-card p-6 soft-card-hover bg-[#3E6650] text-white flex flex-col justify-between h-44 shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <IndianRupee className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">Profit Advisor</span>
              </div>
              <div>
                <h3 className="text-xl font-black group-hover:translate-x-1 transition-transform">💰 Check Suggested Price</h3>
                <p className="text-xs text-white/90 font-medium mt-1">Cost breakdown & margins</p>
              </div>
            </Link>

          </div>
        </div>

        {/* RECENT PRODUCTS & ENQUIRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Store Products */}
          <div className="lg:col-span-8 soft-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
              <h3 className="text-lg font-bold text-[#243B53]">My Listed Artisan Products</h3>
              <Link href="/marketplace" className="text-xs font-bold text-[#C65D3B] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentProducts || []).map((p: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#EAE3D2] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.enhancedUrl || p.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                      alt={p.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#243B53] line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-gray-500">{p.craftType} • Min Order: {p.minOrderQty} pcs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base text-[#243B53]">₹{p.price.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-[#3E6650] bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Enquiries Panel */}
          <div className="lg:col-span-4 soft-card p-6 bg-white space-y-4">
            <h3 className="text-lg font-bold text-[#243B53] border-b border-[#EAE3D2] pb-4">Buyer B2B Enquiries</h3>
            <div className="p-4 bg-[#F4EBDD]/60 rounded-xl border border-[#E2D7C3] space-y-2">
              <span className="text-xs font-bold bg-[#C65D3B] text-white px-2 py-0.5 rounded">NEW BULK RFQ</span>
              <h4 className="font-bold text-sm text-[#243B53]">Heritage Crafts Retail</h4>
              <p className="text-xs text-gray-600">Requested 50 pcs Pochampally Cotton Sarees for Delhi store.</p>
              <Link
                href="/buyer/rfqs"
                className="inline-block text-xs font-bold text-[#243B53] bg-white border border-[#243B53] px-3 py-1.5 rounded-lg mt-2 hover:bg-[#243B53] hover:text-white"
              >
                Send Price Quote
              </Link>
            </div>
          </div>

        </div>

      </main>

      <SellerBottomNav />
      <AIBusinessAssistant />
    </div>
  );
}
