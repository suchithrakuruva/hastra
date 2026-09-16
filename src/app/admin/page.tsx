'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Users, Store, ShoppingBag, IndianRupee, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    sellers: 4,
    buyers: 1,
    products: 4,
    orders: 6,
    revenue: 14700,
    aiStats: '98.4% Success Rate'
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <span className="text-xs font-bold bg-[#243B53] text-white px-3 py-1 rounded-full uppercase">
            Platform Administration
          </span>
          <h1 className="text-3xl font-black text-[#243B53] mt-2">HASTRA Platform Overview & Moderation</h1>
          <p className="text-xs text-gray-500 mt-1">National artisan onboarding metrics, AI processing status, and verifications.</p>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">Total Sellers</p>
            <p className="text-3xl font-black text-[#243B53] mt-1">{stats.sellers}</p>
          </div>
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">B2B Buyers</p>
            <p className="text-3xl font-black text-[#C65D3B] mt-1">{stats.buyers}</p>
          </div>
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">Active Products</p>
            <p className="text-3xl font-black text-[#243B53] mt-1">{stats.products}</p>
          </div>
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">Total Orders</p>
            <p className="text-3xl font-black text-[#3E6650] mt-1">{stats.orders}</p>
          </div>
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">GMV Revenue</p>
            <p className="text-2xl font-black text-[#243B53] mt-1">₹{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="soft-card p-5 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">AI Health</p>
            <p className="text-xs font-bold text-[#3E6650] bg-emerald-50 px-2 py-1 rounded mt-2">{stats.aiStats}</p>
          </div>
        </div>

        {/* SELLER VERIFICATION APPROVALS */}
        <div className="soft-card p-6 bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#243B53] border-b border-[#EAE3D2] pb-3">
            Pending Seller Verifications & Certifications
          </h3>

          <div className="space-y-3">
            {[
              { shop: 'Lakshmi Handlooms', craft: 'Pochampally Ikat', location: 'Pochampally, TS', cert: 'GSTIN: 36ABCDE1234F1Z5 • Udyam Verified' },
              { shop: 'Srinivasa Woodcraft', craft: 'Teakwood Carving', location: 'Kondapalli, AP', cert: 'Udyam Registration Verified' },
              { shop: 'Meera Terracotta Works', craft: 'Clay Pottery', location: 'Gorakhpur, UP', cert: 'Artisan Pehchan Card Verification' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 bg-[#FAF8F3] rounded-xl border border-[#EAE3D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#243B53]">{s.shop}</h4>
                  <p className="text-xs text-gray-600">{s.craft} • {s.location}</p>
                  <p className="text-xs text-[#3E6650] font-bold mt-0.5">{s.cert}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => alert(`${s.shop} verified!`)} className="btn-touch bg-[#3E6650] text-white text-xs px-3.5 py-1.5 rounded-lg">
                    Approve & Verify ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
