'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles, User, ShoppingBag, Store, LogOut, Globe, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          setLang(data.user.preferredLang || 'en');
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#EAE3D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#C65D3B] flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            ह
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[#243B53]">HASTRA</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-[#C65D3B] bg-[#F4EBDD] px-2 py-0.5 rounded-full">
              Craft. Connect. Grow.
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-[#243B53]">
          <Link href="/marketplace" className={`hover:text-[#C65D3B] transition-colors ${pathname === '/marketplace' ? 'text-[#C65D3B] font-semibold' : ''}`}>
            B2B Marketplace
          </Link>
          {user?.role === 'SELLER' && (
            <>
              <Link href="/seller/dashboard" className={`hover:text-[#C65D3B] transition-colors ${pathname?.startsWith('/seller') ? 'text-[#C65D3B] font-semibold' : ''}`}>
                Artisan Dashboard
              </Link>
              <Link href="/seller/product/new" className="flex items-center gap-1.5 text-xs font-bold bg-[#C65D3B] text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#b04e2f]">
                <Sparkles className="w-3.5 h-3.5" /> + Add Product
              </Link>
            </>
          )}
          {user?.role === 'BUYER' && (
            <Link href="/buyer/rfqs" className="hover:text-[#C65D3B] transition-colors">
              My RFQs & Orders
            </Link>
          )}
          <Link href="/seller/market-connections" className="hover:text-[#C65D3B] transition-colors">
            GeM & Export Connections
          </Link>
        </nav>

        {/* Language & Account Actions */}
        <div className="flex items-center gap-3">
          {/* Language Indicator */}
          <div className="flex items-center gap-1 bg-[#F4EBDD] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#243B53]">
            <Globe className="w-3.5 h-3.5 text-[#C65D3B]" />
            <span className="uppercase">{lang === 'te' ? '🇮🇳 Telugu' : lang === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#243B53] text-white px-3.5 py-1.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#1a2c3f]"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#EAE3D2] py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold">Signed in as</p>
                    <p className="text-sm font-bold text-[#243B53] truncate">{user.name}</p>
                    <span className="text-[10px] bg-[#F4EBDD] text-[#C65D3B] font-bold px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'SELLER' && (
                    <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                      <Store className="w-4 h-4 text-[#C65D3B]" /> Artisan Studio
                    </Link>
                  )}
                  <Link href="/marketplace" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                    <ShoppingBag className="w-4 h-4 text-[#3E6650]" /> B2B Marketplace
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-sm font-bold text-[#243B53] px-3 py-1.5 hover:text-[#C65D3B]">
                Login
              </Link>
              <Link href="/auth/register-seller" className="text-xs font-bold bg-[#C65D3B] text-white px-3.5 py-2 rounded-xl shadow-sm hover:bg-[#b04e2f]">
                Start Selling
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
