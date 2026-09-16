'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Building, Phone, Mail, MapPin, Globe, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

const LANGUAGES = [
  { id: 'en', label: '🇬🇧 English', desc: 'All content in English' },
  { id: 'hi', label: '🇮🇳 हिंदी', desc: 'सामग्री हिंदी में' },
  { id: 'te', label: '🇮🇳 తెలుగు', desc: 'కంటెంట్ తెలుగులో' }
];

const BUYER_TYPES = [
  { id: 'RETAILER', label: 'Retailer' },
  { id: 'WHOLESALER', label: 'Wholesaler' },
  { id: 'BOUTIQUE', label: 'Boutique Owner' },
  { id: 'EXPORTER', label: 'Exporter' },
  { id: 'CORPORATE', label: 'Corporate Buyer' },
  { id: 'GOVERNMENT', label: 'Government / Institution' },
  { id: 'OTHER', label: 'Other' }
];

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [lang, setLang] = useState('en');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setProfile(data.user);
          setLang(data.user.preferredLang || 'en');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveLanguage = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredLang: lang })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save');

      localStorage.setItem('hastra_lang', lang);
      window.dispatchEvent(new CustomEvent('hastra-lang-change', { detail: { lang } }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-4 w-full">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
        </main>
      </div>
    );
  }

  if (!profile || profile.role !== 'BUYER') {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-xl font-bold text-[#243B53]">Buyer Login Required</h2>
            <p className="text-sm text-gray-500">Please sign in as a buyer to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  const buyer = profile.buyerProfile;

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#243B53] to-[#1a2c3f] text-white p-6 md:p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#C65D3B] flex items-center justify-center text-3xl font-black shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">{profile.name}</h1>
              <p className="text-[#F4EBDD]/80 text-sm mt-0.5">{buyer?.companyName}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold bg-[#C65D3B] text-white px-2.5 py-0.5 rounded-full">
                  B2B {buyer?.buyerType || 'BUYER'}
                </span>
                {buyer?.isVerified && (
                  <span className="text-xs font-bold bg-[#3E6650] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
          </div>
        )}

        {/* Account Details Card */}
        <div className="soft-card p-6 bg-white space-y-5">
          <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
            <User className="w-5 h-5 text-[#C65D3B]" /> Account Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{profile.name}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{buyer?.companyName || '—'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{profile.phone}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{profile.email || 'Not provided'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Location</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{buyer?.businessLocation || 'Not set'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GSTIN</label>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-[#243B53]">{buyer?.gstin || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Buyer Type Badge */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer Organization Type</label>
            <div className="flex flex-wrap gap-2">
              {BUYER_TYPES.map(bt => (
                <span
                  key={bt.id}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    buyer?.buyerType === bt.id
                      ? 'bg-[#243B53] text-white border-[#243B53]'
                      : 'bg-[#FAF8F3] text-gray-400 border-[#EAE3D2]'
                  }`}
                >
                  {bt.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Language Preferences Card */}
        <div className="soft-card p-6 bg-white space-y-5">
          <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C65D3B]" /> Language Preferences
          </h2>
          <p className="text-xs text-gray-500">
            Select your preferred language for the HASTRA platform. This setting applies across all pages and is saved to your account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  lang === l.id
                    ? 'border-[#C65D3B] bg-[#F4EBDD]'
                    : 'border-[#EAE3D2] bg-[#FAF8F3] hover:border-[#C65D3B]/50'
                }`}
              >
                <div className="font-bold text-sm text-[#243B53]">{l.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{l.desc}</div>
                {lang === l.id && (
                  <div className="mt-2">
                    <span className="text-[10px] font-bold bg-[#C65D3B] text-white px-2 py-0.5 rounded-full">Active</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleSaveLanguage}
            disabled={saving}
            className="btn-touch btn-terracotta flex items-center gap-2 text-base disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Language Preference'}
          </button>
        </div>

        {/* Procurement Categories */}
        {buyer?.procurementCategories && (
          <div className="soft-card p-6 bg-white space-y-4">
            <h2 className="text-xl font-bold text-[#243B53]">Procurement Interests</h2>
            <div className="flex flex-wrap gap-2">
              {buyer.procurementCategories.split(',').map((cat: string, i: number) => (
                <span key={i} className="text-xs font-bold bg-[#F4EBDD] text-[#C65D3B] px-3 py-1.5 rounded-full border border-[#E2D7C3]">
                  {cat.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
