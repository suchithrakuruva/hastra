'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(d => {
        if (d.favorites) setFavorites(d.favorites);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    fetchWishlist();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
          <div>
            <h1 className="text-3xl font-black text-[#243B53]">Saved Products / Wishlist</h1>
            <p className="text-xs text-gray-500 mt-1">Review your saved artisan crafts for wholesale procurement.</p>
          </div>
          <Link href="/marketplace" className="btn-touch btn-terracotta text-sm">
            Browse More Products <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="soft-card p-12 text-center bg-white space-y-4">
            <Heart className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-xl font-bold text-[#243B53]">No Saved Products Yet</h3>
            <p className="text-xs text-gray-500">Explore the B2B Marketplace and save products to view them here.</p>
            <Link href="/marketplace" className="inline-block btn-touch btn-indigo text-sm">
              Explore B2B Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((fav, idx) => (
              <div key={idx} className="soft-card overflow-hidden bg-white flex flex-col justify-between">
                <div>
                  <img
                    src={fav.product?.images?.[0]?.enhancedUrl || fav.product?.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                    alt={fav.product?.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-[#C65D3B]">{fav.product?.craftType}</span>
                    <h3 className="font-bold text-sm text-[#243B53] line-clamp-2">{fav.product?.title}</h3>
                    <p className="text-lg font-black text-[#243B53]">₹{fav.product?.price?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-[#EAE3D2] flex items-center justify-between gap-2">
                  <Link
                    href={`/marketplace/product/${fav.product?.id}`}
                    className="flex-1 btn-touch btn-indigo text-xs text-center py-2"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(fav.product?.id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
