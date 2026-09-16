'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, FileText, Heart, MessageSquare, Search, ArrowRight, Package, Store } from 'lucide-react';

export default function BuyerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/buyer/dashboard')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    totalRfqs: 2,
    totalQuotesReceived: 3,
    totalOrders: 1,
    wishlistCount: 4
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#243B53] to-[#1a2c3f] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-[#C65D3B]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-[#C65D3B] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                B2B Procurement Workspace
              </span>
              <span className="text-xs text-[#F4EBDD] font-medium">{data?.buyerType || 'RETAILER'}</span>
            </div>
            <h1 className="text-3xl font-black">Welcome, {data?.buyerName || 'Buyer'} 👋</h1>
            <p className="text-sm text-[#F4EBDD]/80 mt-1">Company: <span className="font-bold text-white">{data?.companyName || 'Heritage Retail'}</span></p>
          </div>

          <Link href="/marketplace" className="btn-touch btn-terracotta text-base shadow-lg hover:scale-105 transition-transform flex items-center gap-2 shrink-0">
            <Search className="w-5 h-5" /> Browse Marketplace
          </Link>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/buyer/rfqs" className="soft-card p-5 bg-white text-center hover:scale-105 transition-transform">
            <p className="text-xs text-gray-500 font-bold uppercase">Sent RFQs</p>
            <p className="text-3xl font-black text-[#243B53] mt-1">{stats.totalRfqs}</p>
          </Link>

          <Link href="/buyer/rfqs" className="soft-card p-5 bg-white text-center hover:scale-105 transition-transform">
            <p className="text-xs text-gray-500 font-bold uppercase">Received Quotes</p>
            <p className="text-3xl font-black text-[#C65D3B] mt-1">{stats.totalQuotesReceived}</p>
          </Link>

          <Link href="/buyer/orders" className="soft-card p-5 bg-white text-center hover:scale-105 transition-transform">
            <p className="text-xs text-gray-500 font-bold uppercase">Total Orders</p>
            <p className="text-3xl font-black text-[#3E6650] mt-1">{stats.totalOrders}</p>
          </Link>

          <Link href="/buyer/wishlist" className="soft-card p-5 bg-white text-center hover:scale-105 transition-transform">
            <p className="text-xs text-gray-500 font-bold uppercase">Saved Products</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{stats.wishlistCount}</p>
          </Link>
        </div>

        {/* QUICK ACTION NAVIGATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/marketplace" className="soft-card p-6 bg-white hover:border-[#C65D3B] transition-all space-y-2 group">
            <Search className="w-8 h-8 text-[#C65D3B]" />
            <h3 className="font-bold text-base text-[#243B53] group-hover:text-[#C65D3B]">Browse & Search Products</h3>
            <p className="text-xs text-gray-500">Filter by craft type, material, location & price.</p>
          </Link>

          <Link href="/buyer/rfqs" className="soft-card p-6 bg-white hover:border-[#C65D3B] transition-all space-y-2 group">
            <FileText className="w-8 h-8 text-[#243B53]" />
            <h3 className="font-bold text-base text-[#243B53] group-hover:text-[#C65D3B]">Manage Bulk RFQs</h3>
            <p className="text-xs text-gray-500">Submit requirements & compare artisan quotes.</p>
          </Link>

          <Link href="/buyer/wishlist" className="soft-card p-6 bg-white hover:border-[#C65D3B] transition-all space-y-2 group">
            <Heart className="w-8 h-8 text-rose-500" />
            <h3 className="font-bold text-base text-[#243B53] group-hover:text-[#C65D3B]">Saved / Wishlist Items</h3>
            <p className="text-xs text-gray-500">Review saved items for bulk ordering.</p>
          </Link>

          <Link href="/buyer/orders" className="soft-card p-6 bg-white hover:border-[#C65D3B] transition-all space-y-2 group">
            <Package className="w-8 h-8 text-[#3E6650]" />
            <h3 className="font-bold text-base text-[#243B53] group-hover:text-[#C65D3B]">Order History</h3>
            <p className="text-xs text-gray-500">Track shipments and order fulfillments.</p>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
