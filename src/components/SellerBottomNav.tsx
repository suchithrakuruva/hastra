'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Plus, TrendingUp, User } from 'lucide-react';

export default function SellerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/seller/dashboard' },
    { label: 'Products', icon: Package, href: '/marketplace' },
    { label: 'Add', icon: Plus, href: '/seller/product/new', isCenter: true },
    { label: 'Business', icon: TrendingUp, href: '/seller/market-connections' },
    { label: 'Profile', icon: User, href: '/seller/dashboard' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F3] border-t border-[#EAE3D2] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#C65D3B] text-white flex items-center justify-center shadow-lg border-4 border-[#FAF8F3] group-active:scale-95 transition-transform voice-pulse">
                  <Plus className="w-8 h-8 font-black" />
                </div>
                <span className="text-[11px] font-bold text-[#C65D3B] mt-1">Add</span>
              </Link>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 ${isActive ? 'text-[#C65D3B] font-bold' : 'text-[#243B53]/70 font-medium'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
