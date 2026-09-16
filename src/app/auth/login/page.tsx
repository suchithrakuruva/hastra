'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { KeyRound, AtSign, ArrowRight, Store, ShoppingBag, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, customId?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const id = customId || identifier;
    const pwd = customPass || password;

    if (!id || !pwd) {
      setError('Please enter your mobile number or email address and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, password: pwd })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else if (data.user.role === 'BUYER') {
        router.push('/buyer/dashboard');
      } else {
        router.push('/marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoSeller = () => {
    setIdentifier('+919876543210');
    setPassword('password123');
    handleLogin(undefined, '+919876543210', 'password123');
  };

  const fillDemoBuyer = () => {
    setIdentifier('+919999988888');
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
              <label className="block text-sm font-bold text-[#243B53] mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. lakshmi@handlooms.in or +91 9876543210"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl pl-10 pr-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 pr-11 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#243B53]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-touch btn-terracotta text-lg flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Register Options */}
          <div className="border-t border-[#EAE3D2] pt-4 text-center space-y-2">
            <p className="text-xs text-gray-500 font-medium">Don&apos;t have an account?</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/auth/register-seller"
                className="text-xs font-bold text-[#C65D3B] border border-[#C65D3B] px-3 py-2 rounded-lg hover:bg-[#F4EBDD] transition-colors text-center"
              >
                Register as Seller
              </Link>
              <Link
                href="/auth/register-buyer"
                className="text-xs font-bold text-[#243B53] border border-[#243B53] px-3 py-2 rounded-lg hover:bg-[#F4EBDD] transition-colors text-center"
              >
                Register as Buyer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
