'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, ShieldCheck, MapPin, Tag, Sparkles, Filter, ShoppingBag } from 'lucide-react';

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Products' },
    { id: 'Handloom & Textiles', label: '🧵 Handloom & Textiles' },
    { id: 'Woodcraft & Carvings', label: '🪵 Woodcraft' },
    { id: 'Pottery & Terracotta', label: '🏺 Pottery & Terracotta' },
    { id: 'Bamboo & Cane', label: '🎋 Bamboo & Cane' },
    { id: 'Home Decor & Metalware', label: '✨ Home Decor' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HEADER & SEARCH BAR */}
        <div className="bg-gradient-to-r from-[#243B53] to-[#1a2c3f] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-[#C65D3B]">
          <div>
            <span className="text-xs font-bold bg-[#C65D3B] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              B2B Artisan Marketplace
            </span>
            <h1 className="text-3xl font-black mt-2">Discover Authentic Indian Craftsmanship</h1>
            <p className="text-xs text-[#F4EBDD]/80 mt-1">Source directly from verified weavers, potters, and traditional producers.</p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProducts()}
              placeholder="Search sarees, terracotta, woodcraft..."
              className="w-full bg-white text-[#243B53] rounded-2xl pl-11 pr-24 py-3 text-sm font-medium focus:outline-none shadow-md"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            <button
              onClick={fetchProducts}
              className="absolute right-2 top-2 bg-[#C65D3B] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#b04e2f]"
            >
              Search
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#C65D3B] text-white border-[#C65D3B] shadow-md'
                  : 'bg-white text-[#243B53] border-[#EAE3D2] hover:bg-[#F4EBDD]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS FEED GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="soft-card h-80 animate-pulse bg-gray-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <div key={idx} className="soft-card overflow-hidden soft-card-hover flex flex-col bg-white">
                
                {/* Product Image */}
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={p.images?.[0]?.enhancedUrl || p.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Craft Badge */}
                  <span className="absolute top-3 left-3 bg-[#243B53] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {p.craftType}
                  </span>

                  {/* Handmade Badge */}
                  <span className="absolute top-3 right-3 bg-[#3E6650] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    Handmade ✓
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#C65D3B] font-bold mb-1">
                      <span>{p.sellerProfile?.shopName || 'Lakshmi Handlooms'}</span>
                      <span className="flex items-center gap-0.5 text-gray-500 font-normal">
                        <MapPin className="w-3 h-3 text-red-500" /> {p.sellerProfile?.state || 'Telangana'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#243B53] line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.shortDescription}</p>
                  </div>

                  {/* Pricing & MOQ Footer */}
                  <div className="mt-4 pt-3 border-t border-[#EAE3D2] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Min Order: {p.minOrderQty} pcs</p>
                      <p className="text-xl font-black text-[#243B53]">₹{p.price.toLocaleString()}</p>
                    </div>

                    <Link
                      href={`/marketplace/product/${p.id}`}
                      className="bg-[#243B53] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#1a2c3f] transition-colors"
                    >
                      View & Quote
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
