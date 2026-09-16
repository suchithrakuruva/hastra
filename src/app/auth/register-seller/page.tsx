'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Check, ArrowRight, ArrowLeft, Mic, ShieldCheck, Sparkles, Store, Building, Info } from 'lucide-react';

export default function RegisterSellerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    phone: '',
    email: '',
    password: '',
    preferredLang: 'en',
    // Step 2
    shopName: '',
    craftType: 'Pochampally Ikat & Handloom Weaving',
    productCategory: 'Handloom & Textiles',
    location: '',
    state: 'Telangana',
    district: '',
    yearsOfExperience: 5,
    numberOfWorkers: 2,
    productionCapacity: '30 items/month',
    // Step 3
    gstin: '',
    udyamReg: '',
    bankDetails: '',
    panNumber: '',
    artisanCert: '',
    govtSchemeInfo: ''
  });

  const craftTypes = [
    'Pochampally Ikat & Handloom Weaving',
    'Teakwood & Rosewood Carving',
    'Terracotta & Clay Pottery',
    'Assam Bamboo & Cane Weaving',
    'Brassware & Metal Handicrafts',
    'Kalamkari & Block Printing',
    'Zardosi & Embroidery Crafts'
  ];

  const categories = [
    'Handloom & Textiles',
    'Woodcraft & Carvings',
    'Pottery & Terracotta',
    'Bamboo & Cane',
    'Home Decor & Metalware'
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.password) {
        setError('Please fill in your name, mobile number, and password.');
        return;
      }
    } else if (step === 2) {
      if (!formData.shopName || !formData.location) {
        setError('Please enter your shop name and village/town location.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/seller/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        
        {/* Progress Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-[#EAE3D2] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-[#243B53]">Artisan Seller Onboarding</h1>
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#F4EBDD] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#C65D3B] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#243B53]/70 mt-3">
            <span className={step >= 1 ? 'text-[#C65D3B]' : ''}>1. Basic Info</span>
            <span className={step >= 2 ? 'text-[#C65D3B]' : ''}>2. Business & Craft</span>
            <span className={step >= 3 ? 'text-[#C65D3B]' : ''}>3. Official Verification</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="soft-card p-6 md:p-8 space-y-5 bg-white">
            <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#C65D3B]" /> Step 1: Basic Information
            </h2>
            <p className="text-xs text-gray-500">First, tell us who you are so buyers can identify your business.</p>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lakshmi Devi"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-base text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Mobile Number (10 digits) *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +919876543210"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-base text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Password / 4-Digit PIN *</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-base text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. lakshmi@handlooms.in"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-base text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-2">Preferred Voice Language</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'en', label: '🇬🇧 English' },
                  { id: 'hi', label: '🇮🇳 हिंदी (Hindi)' },
                  { id: 'te', label: '🇮🇳 తెలుగు (Telugu)' },
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLang: l.id })}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.preferredLang === l.id
                        ? 'bg-[#C65D3B] text-white border-[#C65D3B]'
                        : 'bg-[#FAF8F3] text-[#243B53] border-[#EAE3D2]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full btn-touch btn-terracotta text-lg mt-4 flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Business & Craft Info */}
        {step === 2 && (
          <div className="soft-card p-6 md:p-8 space-y-5 bg-white">
            <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#C65D3B]" /> Step 2: Business & Craft Information
            </h2>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Business / Shop Name *</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="e.g. Lakshmi Handlooms"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-base text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Craft Specialization *</label>
              <select
                value={formData.craftType}
                onChange={e => setFormData({ ...formData, craftType: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] font-medium"
              >
                {craftTypes.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Product Category</label>
              <select
                value={formData.productCategory}
                onChange={e => setFormData({ ...formData, productCategory: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] font-medium"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Village / Town Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Pochampally"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Telangana"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={e => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Number of Workers</label>
                <input
                  type="number"
                  value={formData.numberOfWorkers}
                  onChange={e => setFormData({ ...formData, numberOfWorkers: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 btn-touch btn-terracotta text-base flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Business Details & Certifications */}
        {step === 3 && (
          <div className="soft-card p-6 md:p-8 space-y-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3E6650]" /> Step 3: Official Details (Optional)
              </h2>
              <button
                onClick={handleSubmit}
                className="text-xs font-bold text-[#C65D3B] hover:underline"
              >
                Skip for now
              </button>
            </div>

            <div className="bg-[#F4EBDD]/60 p-3.5 rounded-xl border border-[#E2D7C3] flex items-start gap-2.5 text-xs text-[#243B53]/80">
              <Info className="w-4 h-4 text-[#C65D3B] shrink-0 mt-0.5" />
              <span>Adding GSTIN or Udyam certification gives you a "Verified Artisan" badge on the B2B marketplace.</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">GSTIN (If Applicable)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="e.g. 36ABCDE1234F1Z5"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyamReg}
                onChange={e => setFormData({ ...formData, udyamReg: e.target.value })}
                placeholder="e.g. UDYAM-TS-01-0012345"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#243B53] mb-1">Artisan / Weaver ID Card / Certification</label>
              <input
                type="text"
                value={formData.artisanCert}
                onChange={e => setFormData({ ...formData, artisanCert: e.target.value })}
                placeholder="e.g. Pehchan Artisan Card #102948"
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-2/3 btn-touch btn-terracotta text-lg flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? 'Registering Store...' : 'Complete Seller Registration'} <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
