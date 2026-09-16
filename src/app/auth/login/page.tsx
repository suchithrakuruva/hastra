'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { KeyRound, Phone, ArrowRight, Store, ShoppingBag, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, customPhone?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const p = customPhone || phone;
    const pwd = customPass || password;

    if (!p || !pwd) {
      setError('Please enter your mobile number and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: p, password: pwd })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoSeller = () => {
    setPhone('+919876543210');
    setPassword('password123');
    handleLogin(undefined, '+919876543210', 'password123');
  };

  const fillDemoBuyer = () => {
    setPhone('+919999988888');
    setPassword('password123');
    handleLogin(undefined, '+919999988888', 'password123');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12">
        <div className="soft-card p-6 md:p-8 bg-white space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#C65D3B] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#243B53]">Welcome Back to HASTRA</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to manage your artisan store or procurement account.</p>
          </div>

          {/* DEMO QUICK ACCESS PRESETS */}
          <div className="bg-[#F4EBDD]/70 p-4 rounded-xl border border-[#E2D7C3] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C65D3B]">
              <Sparkles className="w-3.5 h-3.5" /> <span>Quick Demo Accounts (1-Click Login):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={fillDemoSeller}
                className="bg-white border border-[#C65D3B] text-[#C65D3B] px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#C65D3B] hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <Store className="w-3.5 h-3.5" /> Demo Seller
              </button>
              <button
                type="button"
                onClick={fillDemoBuyer}
                className="bg-white border border-[#243B53] text-[#243B53] px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#243B53] hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Demo Buyer
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={e => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl pl-10 pr-4 py-3 text-sm text-[#243B53]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-touch btn-terracotta text-lg flex items-center justify-center gap-2 mt-4 shadow-md"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
