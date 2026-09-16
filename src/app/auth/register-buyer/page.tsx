'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterBuyerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    companyName: '',
    buyerType: 'RETAILER',
    gstin: '',
    businessLocation: ''
  });

  const buyerTypes = [
    { id: 'RETAILER', label: 'Retailer' },
    { id: 'WHOLESALER', label: 'Wholesaler' },
    { id: 'BOUTIQUE', label: 'Boutique Owner' },
    { id: 'EXPORTER', label: 'Exporter' },
    { id: 'CORPORATE', label: 'Corporate Buyer' },
    { id: 'GOVERNMENT', label: 'Government / Institution' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password || !formData.companyName) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/marketplace');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10">
        <div className="soft-card p-6 md:p-8 bg-white space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#243B53] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShoppingBag className="w-8 h-8 text-[#F4EBDD]" />
            </div>
            <h1 className="text-2xl font-black text-[#243B53]">B2B Buyer Registration</h1>
            <p className="text-xs text-gray-500 mt-1">Connect directly with authentic Indian artisans and weavers.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Your Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Malhotra"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Company / Business Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Heritage Crafts Retail Ltd"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9999988888"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Buyer Organization Type</label>
              <select
                value={formData.buyerType}
                onChange={e => setFormData({ ...formData, buyerType: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] font-medium"
              >
                {buyerTypes.map((bt, i) => (
                  <option key={i} value={bt.id}>{bt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Business Location / City</label>
              <input
                type="text"
                value={formData.businessLocation}
                onChange={e => setFormData({ ...formData, businessLocation: e.target.value })}
                placeholder="e.g. New Delhi"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-touch btn-indigo text-lg flex items-center justify-center gap-2 mt-4 shadow-md"
            >
              {loading ? 'Creating Buyer Account...' : 'Register as B2B Buyer'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
