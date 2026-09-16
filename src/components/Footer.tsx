'use client';

import React from 'react';
import Link from 'next/link';
import { PLATFORM_CONFIG } from '@/lib/config';
import { Globe, Heart, Share2, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#243B53] text-white pt-12 pb-8 border-t border-[#1a2c3f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1a2c3f]">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#C65D3B] flex items-center justify-center text-white font-black text-xl shadow-md">
                ह
              </div>
              <span className="text-2xl font-black tracking-tight">{PLATFORM_CONFIG.appName}</span>
            </div>

            <p className="text-sm text-[#F4EBDD]/80 leading-relaxed font-normal max-w-md">
              {PLATFORM_CONFIG.description} Empowering rural weavers and traditional craft producers with Voice AI, transparent pricing intelligence, and global B2B access.
            </p>

            {/* Social Media & Contact Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={PLATFORM_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#F4EBDD] hover:bg-[#C65D3B] hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PLATFORM_CONFIG.contactEmail}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#F4EBDD] hover:bg-[#C65D3B] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${PLATFORM_CONFIG.supportPhone}`}
                aria-label="Phone"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#F4EBDD] hover:bg-[#C65D3B] hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={PLATFORM_CONFIG.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#F4EBDD] hover:bg-[#C65D3B] hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#F4EBDD] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-white/80">
              {PLATFORM_CONFIG.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-[#C65D3B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#F4EBDD] uppercase tracking-wider">Support & Legal</h4>
            <ul className="space-y-2 text-xs text-white/80">
              {PLATFORM_CONFIG.supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#C65D3B] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-xs text-[#F4EBDD]/70">
              <p>Toll-Free Support: <strong className="text-white">{PLATFORM_CONFIG.supportPhone}</strong></p>
              <p>Email: <strong className="text-white">{PLATFORM_CONFIG.contactEmail}</strong></p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4EBDD]/60 gap-4">
          <p>© 2026 HASTRA Platform. Built for Indian Artisan Empowerment.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#C65D3B] fill-current" /> for Weavers & Micro-Entrepreneurs
          </p>
        </div>

      </div>
    </footer>
  );
}
