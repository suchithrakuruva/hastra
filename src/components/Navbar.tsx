'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles, User, ShoppingBag, Store, LogOut, Globe, ChevronDown, FileText, Heart, Package, MessageSquare } from 'lucide-react';

const LANGUAGES = [
  { id: 'en', label: '🇬🇧 English', short: 'EN' },
  { id: 'hi', label: '🇮🇳 हिंदी', short: 'HI' },
  { id: 'te', label: '🇮🇳 తెలుగు', short: 'TE' }
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load language from localStorage first for immediate display
    const savedLang = localStorage.getItem('hastra_lang') || 'en';
    setLang(savedLang);

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          const userLang = data.user.preferredLang || savedLang;
          setLang(userLang);
          localStorage.setItem('hastra_lang', userLang);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

  const handleLanguageChange = async (newLang: string) => {
    setLang(newLang);
    setLangOpen(false);
    localStorage.setItem('hastra_lang', newLang);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('hastra-lang-change', { detail: { lang: newLang } }));

    // Persist to DB if logged in
    if (user) {
      try {
        await fetch('/api/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferredLang: newLang })
        });
      } catch (e) {}
    }
  };

  const currentLang = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

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
          <Link href="/marketplace" className={`hover:text-[#C65D3B] transition-colors text-sm ${pathname === '/marketplace' ? 'text-[#C65D3B] font-semibold' : ''}`}>
            B2B Marketplace
          </Link>
          {user?.role === 'SELLER' && (
            <>
              <Link href="/seller/dashboard" className={`hover:text-[#C65D3B] transition-colors text-sm ${pathname?.startsWith('/seller') ? 'text-[#C65D3B] font-semibold' : ''}`}>
                Artisan Dashboard
              </Link>
              <Link href="/seller/product/new" className="flex items-center gap-1.5 text-xs font-bold bg-[#C65D3B] text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#b04e2f]">
                <Sparkles className="w-3.5 h-3.5" /> + Add Product
              </Link>
            </>
          )}
          {user?.role === 'BUYER' && (
            <>
              <Link href="/buyer/dashboard" className={`hover:text-[#C65D3B] transition-colors text-sm ${pathname?.startsWith('/buyer') ? 'text-[#C65D3B] font-semibold' : ''}`}>
                Buyer Dashboard
              </Link>
              <Link href="/buyer/rfqs" className="hover:text-[#C65D3B] transition-colors text-sm">
                My RFQs
              </Link>
            </>
          )}
          <Link href="/seller/market-connections" className="hover:text-[#C65D3B] transition-colors text-sm">
            GeM &amp; Export
          </Link>
        </nav>

        {/* Language & Account Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 bg-[#F4EBDD] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#243B53] hover:bg-[#E2D7C3] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C65D3B]" />
              <span>{currentLang.short}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#EAE3D2] py-1 z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleLanguageChange(l.id)}
                    className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#F4EBDD] transition-colors ${
                      lang === l.id ? 'font-bold text-[#C65D3B] bg-[#F4EBDD]' : 'text-[#243B53] font-medium'
                    }`}
                  >
                    {lang === l.id && <span className="w-1.5 h-1.5 rounded-full bg-[#C65D3B] inline-block" />}
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#243B53] text-white px-3.5 py-1.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#1a2c3f]"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[90px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#EAE3D2] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold">Signed in as</p>
                    <p className="text-sm font-bold text-[#243B53] truncate">{user.name}</p>
                    <span className="text-[10px] bg-[#F4EBDD] text-[#C65D3B] font-bold px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'SELLER' && (
                    <>
                      <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <Store className="w-4 h-4 text-[#C65D3B]" /> Artisan Studio
                      </Link>
                      <Link href="/seller/product/new" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <Sparkles className="w-4 h-4 text-[#C65D3B]" /> Add Product
                      </Link>
                    </>
                  )}

                  {user.role === 'BUYER' && (
                    <>
                      <Link href="/buyer/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <ShoppingBag className="w-4 h-4 text-[#3E6650]" /> Buyer Dashboard
                      </Link>
                      <Link href="/buyer/rfqs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <FileText className="w-4 h-4 text-[#243B53]" /> My RFQs
                      </Link>
                      <Link href="/buyer/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <Heart className="w-4 h-4 text-rose-500" /> Saved Products
                      </Link>
                      <Link href="/buyer/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <Package className="w-4 h-4 text-[#3E6650]" /> My Orders
                      </Link>
                      <Link href="/buyer/enquiries" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                        <MessageSquare className="w-4 h-4 text-purple-600" /> Enquiries
                      </Link>
                    </>
                  )}

                  <Link href="/marketplace" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#243B53] hover:bg-[#F4EBDD]">
                    <ShoppingBag className="w-4 h-4 text-[#3E6650]" /> B2B Marketplace
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
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
