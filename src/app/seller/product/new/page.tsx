'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SellerBottomNav from '@/components/SellerBottomNav';
import { Camera, Mic, Sparkles, IndianRupee, Check, ArrowRight, ArrowLeft } from 'lucide-react';

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialStep = Number(searchParams.get('step')) || 1;
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Wizard Data State
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
  const [studioResult, setStudioResult] = useState<any>({
    originalUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    enhancedUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    studioBackground: 'studio-neutral',
    transformations: [
      'Messy background removed & studio backdrop applied',
      'Lighting & color exposure corrected',
      'Product centered & sharp focus enhanced'
    ]
  });

  const [voiceText, setVoiceText] = useState('This is a handwoven cotton saree made by our village artisans. It takes around three days to make.');
  const [isListening, setIsListening] = useState(false);

  const [catalog, setCatalog] = useState({
    title: 'Handwoven Pure Cotton Traditional Saree',
    shortDescription: 'Authentic 100% pure cotton saree woven with traditional Ikat patterns by village artisans.',
    detailedDescription: 'Handcrafted using traditional pit looms with natural dyes. Features soft breathable pure cotton fabric with temple border.',
    craftType: 'Pochampally Ikat',
    material: '100% Pure Organic Cotton',
    origin: 'Pochampally, Telangana',
    dimensions: '6.3 Meters',
    weight: '550g',
    color: 'Terracotta & Indigo',
    careInstructions: 'Gentle hand wash in cold water.',
    keywords: 'saree, handloom, cotton, ikat, traditional',
    minOrderQty: 5
  });

  const [pricing, setPricing] = useState({
    rawMaterialCost: 800,
    laborCost: 500,
    productionHours: 24,
    packagingCost: 100,
    shippingCost: 150,
    desiredMargin: 400,
    suggestedExact: 1950,
    suggestedMin: 1850,
    suggestedMax: 2250
  });

  // Handle Voice Input
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported on this browser. You can type into the box below.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Run AI Image Enhancement
  const triggerImageEnhance = async (bg: string = 'studio-neutral') => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/image-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: photoUrl, backgroundStyle: bg })
      });
      const data = await res.json();
      if (data.result) setStudioResult(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run AI Voice Cataloger
  const triggerCatalogAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: voiceText })
      });
      const data = await res.json();
      if (data.catalog) {
        setCatalog(prev => ({
          ...prev,
          title: data.catalog.title,
          shortDescription: data.catalog.shortDescription,
          detailedDescription: data.catalog.detailedDescription,
          craftType: data.catalog.craftType,
          material: data.catalog.material,
          origin: data.catalog.origin,
          keywords: data.catalog.keywords.join(', ')
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run AI Price Calculator
  const triggerPriceAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawMaterialCost: pricing.rawMaterialCost,
          laborCost: pricing.laborCost,
          productionHours: pricing.productionHours,
          packagingCost: pricing.packagingCost,
          shippingCost: pricing.shippingCost,
          desiredMargin: pricing.desiredMargin,
          craftType: catalog.craftType
        })
      });
      const data = await res.json();
      if (data.result) {
        setPricing(prev => ({
          ...prev,
          suggestedExact: data.result.suggestedExact,
          suggestedMin: data.result.suggestedMin,
          suggestedMax: data.result.suggestedMax
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Publish Product
  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: catalog.title,
          shortDescription: catalog.shortDescription,
          detailedDescription: catalog.detailedDescription,
          craftType: catalog.craftType,
          material: catalog.material,
          origin: catalog.origin,
          dimensions: catalog.dimensions,
          weight: catalog.weight,
          color: catalog.color,
          careInstructions: catalog.careInstructions,
          price: pricing.suggestedExact,
          minOrderQty: catalog.minOrderQty,
          images: [studioResult.enhancedUrl, photoUrl]
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to publish');

      setStep(7);
    } catch (err: any) {
      setError(err.message || 'Publish failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* PROGRESS STEPPER */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-[#EAE3D2] shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#243B53] mb-2">
          <span>Product Creation Wizard</span>
          <span className="text-[#C65D3B] bg-[#F4EBDD] px-2.5 py-0.5 rounded-full">Step {step} of 7</span>
        </div>
        <div className="w-full bg-[#F4EBDD] h-2.5 rounded-full overflow-hidden">
          <div className="bg-[#C65D3B] h-full transition-all duration-300" style={{ width: `${(step / 7) * 100}%` }} />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* SCREEN 1: TAKE A PHOTO */}
      {step === 1 && (
        <div className="soft-card p-6 bg-white space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 1</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">Take or Upload Product Photo</h1>
            <p className="text-xs text-gray-500 mt-1">Snap a quick photo using your phone camera or select from gallery.</p>
          </div>

          <div className="border-2 border-dashed border-[#C65D3B]/40 rounded-2xl p-6 text-center bg-[#FAF8F3] hover:border-[#C65D3B] transition-colors">
            <img src={photoUrl} alt="Product Sample" className="w-full h-64 object-cover rounded-xl shadow-md mb-4" />
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="btn-touch btn-terracotta text-sm cursor-pointer shadow-md flex items-center gap-2">
                <Camera className="w-5 h-5" /> <span>Open Camera / Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setPhotoUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => { triggerImageEnhance(); setStep(2); }}
            className="w-full btn-touch btn-indigo text-lg flex items-center justify-center gap-2 shadow-md"
          >
            Continue to AI Product Studio <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* SCREEN 2: AI PRODUCT STUDIO */}
      {step === 2 && (
        <div className="soft-card p-6 bg-white space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 2</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">✨ AI Product Studio</h1>
            <p className="text-xs text-gray-500 mt-1">Background noise removed & studio backdrop applied preserving authentic product colors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#EAE3D2] rounded-xl p-3 bg-gray-50 text-center">
              <span className="text-xs font-bold text-gray-500 block mb-2">BEFORE (Raw Photo)</span>
              <img src={photoUrl} alt="Original" className="w-full h-52 object-cover rounded-lg" />
            </div>

            <div className="border-2 border-[#C65D3B] rounded-xl p-3 bg-white text-center shadow-lg relative">
              <span className="text-xs font-bold text-white bg-[#C65D3B] px-2 py-0.5 rounded absolute top-5 right-5 z-10">
                AFTER (AI Studio Enhanced)
              </span>
              <img src={studioResult.enhancedUrl} alt="Enhanced" className="w-full h-52 object-cover rounded-lg" />
            </div>
          </div>

          <div className="bg-[#F4EBDD]/60 p-4 rounded-xl border border-[#E2D7C3] space-y-2">
            <h4 className="text-xs font-bold text-[#243B53] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#C65D3B]" /> AI Studio Enhancements Applied:
            </h4>
            <ul className="text-xs text-[#243B53]/80 space-y-1 pl-5 list-disc">
              {studioResult.transformations.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] mb-2">Change Studio Backdrop Theme:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'studio-neutral', label: 'Studio Neutral' },
                { id: 'handloom-loom', label: 'Handloom Studio' },
                { id: 'wood-workshop', label: 'Craft Workshop' },
                { id: 'soft-linen', label: 'Soft Linen' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => triggerImageEnhance(b.id)}
                  className="p-2 border text-xs font-bold rounded-lg text-[#243B53] hover:border-[#C65D3B]"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm">
              <ArrowLeft className="w-4 h-4 inline" /> Back
            </button>
            <button onClick={() => setStep(3)} className="w-2/3 btn-touch btn-terracotta text-lg">
              ✓ Use This Image <ArrowRight className="w-5 h-5 inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: TALK ABOUT YOUR PRODUCT */}
      {step === 3 && (
        <div className="soft-card p-6 bg-white space-y-6 text-center">
          <div>
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 3</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">🎙️ Talk About Your Product</h1>
            <p className="text-xs text-gray-500 mt-1">Tap the microphone and speak in Telugu, Hindi, or English.</p>
          </div>

          <div className="py-8 flex flex-col items-center justify-center">
            <button
              onClick={startRecording}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all cursor-pointer ${
                isListening ? 'bg-red-500 voice-pulse scale-110' : 'bg-[#C65D3B] hover:scale-105'
              }`}
            >
              <Mic className="w-14 h-14" />
              <span className="text-xs font-bold mt-1">{isListening ? 'Listening...' : 'Tap & Speak'}</span>
            </button>
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-[#243B53] mb-1">Voice Transcript / Story Input:</label>
            <textarea
              value={voiceText}
              onChange={e => setVoiceText(e.target.value)}
              rows={4}
              className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl p-3 text-sm text-[#243B53] font-medium"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(2)} className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm">
              <ArrowLeft className="w-4 h-4 inline" /> Back
            </button>
            <button
              onClick={() => { triggerCatalogAI(); setStep(4); }}
              className="w-2/3 btn-touch btn-terracotta text-lg"
            >
              ✨ Generate AI Catalog <ArrowRight className="w-5 h-5 inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: AI AUTO-CATALOG OUTPUT */}
      {step === 4 && (
        <div className="soft-card p-6 bg-white space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 4</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">AI Generated Catalog Listing</h1>
            <p className="text-xs text-gray-500 mt-1">Review the AI generated titles, descriptions, and specifications.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] mb-1">Product Title</label>
            <input
              type="text"
              value={catalog.title}
              onChange={e => setCatalog({ ...catalog, title: e.target.value })}
              className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2.5 text-sm font-bold text-[#243B53]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] mb-1">Short Description (2-3 lines)</label>
            <textarea
              value={catalog.shortDescription}
              onChange={e => setCatalog({ ...catalog, shortDescription: e.target.value })}
              rows={2}
              className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl p-3 text-xs text-[#243B53]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] mb-1">Detailed Description</label>
            <textarea
              value={catalog.detailedDescription}
              onChange={e => setCatalog({ ...catalog, detailedDescription: e.target.value })}
              rows={4}
              className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl p-3 text-xs text-[#243B53]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Craft Specialization</label>
              <input
                type="text"
                value={catalog.craftType}
                onChange={e => setCatalog({ ...catalog, craftType: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-xs text-[#243B53]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Material</label>
              <input
                type="text"
                value={catalog.material}
                onChange={e => setCatalog({ ...catalog, material: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-xs text-[#243B53]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(3)} className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm">
              <ArrowLeft className="w-4 h-4 inline" /> Back
            </button>
            <button onClick={() => { triggerPriceAI(); setStep(5); }} className="w-2/3 btn-touch btn-terracotta text-lg">
              💰 Check Price Advisor <ArrowRight className="w-5 h-5 inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: AI PRICE ADVISOR */}
      {step === 5 && (
        <div className="soft-card p-6 bg-white space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 5</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">💰 AI Price Advisor</h1>
            <p className="text-xs text-gray-500 mt-1">Enter production costs to receive a transparent selling price recommendation.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Raw Material Cost (₹)</label>
              <input
                type="number"
                value={pricing.rawMaterialCost}
                onChange={e => setPricing({ ...pricing, rawMaterialCost: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-sm font-bold text-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Labor Cost (₹)</label>
              <input
                type="number"
                value={pricing.laborCost}
                onChange={e => setPricing({ ...pricing, laborCost: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-sm font-bold text-[#243B53]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Packaging (₹)</label>
              <input
                type="number"
                value={pricing.packagingCost}
                onChange={e => setPricing({ ...pricing, packagingCost: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-xs text-[#243B53]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Shipping (₹)</label>
              <input
                type="number"
                value={pricing.shippingCost}
                onChange={e => setPricing({ ...pricing, shippingCost: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-xs text-[#243B53]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#243B53] mb-1">Desired Profit (₹)</label>
              <input
                type="number"
                value={pricing.desiredMargin}
                onChange={e => setPricing({ ...pricing, desiredMargin: Number(e.target.value) })}
                className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-3 py-2 text-xs text-[#243B53]"
              />
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-2xl border-2 border-[#3E6650] text-center space-y-3 shadow-md">
            <span className="text-xs font-bold text-[#3E6650] bg-emerald-50 px-3 py-1 rounded-full border border-[#3E6650]">
              Suggested Price Range: ₹{pricing.suggestedMin.toLocaleString()} – ₹{pricing.suggestedMax.toLocaleString()}
            </span>

            <p className="text-3xl font-black text-[#243B53] mt-2">
              Recommended Selling Price: ₹{pricing.suggestedExact.toLocaleString()}
            </p>

            <div className="text-xs text-gray-600 border-t border-[#EAE3D2] pt-3 text-left space-y-1">
              <p>• Raw materials: ₹{pricing.rawMaterialCost}</p>
              <p>• Artisan Labor: ₹{pricing.laborCost}</p>
              <p>• Packaging & Logistics: ₹{pricing.packagingCost + pricing.shippingCost}</p>
              <p className="font-bold text-[#3E6650]">• Estimated Artisan Profit Margin: ₹{pricing.desiredMargin}</p>
            </div>

            <p className="text-[11px] text-gray-400 italic">"AI-generated estimate based on available historical benchmark data."</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(4)} className="w-1/3 btn-touch bg-gray-100 text-[#243B53] text-sm">
              <ArrowLeft className="w-4 h-4 inline" /> Back
            </button>
            <button onClick={() => setStep(6)} className="w-2/3 btn-touch btn-terracotta text-lg">
              Review & Confirm <ArrowRight className="w-5 h-5 inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 6: SELLER REVIEW EVERYTHING */}
      {step === 6 && (
        <div className="soft-card p-6 bg-white space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-[#C65D3B] bg-[#F4EBDD] px-3 py-1 rounded-full uppercase">Screen 6</span>
            <h1 className="text-2xl font-black text-[#243B53] mt-2">Review Product Listing</h1>
            <p className="text-xs text-gray-500 mt-1">Review your product photo, AI catalog details, and selling price before publishing.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border border-[#EAE3D2] p-4 rounded-xl bg-[#FAF8F3]">
            <img src={studioResult.enhancedUrl} alt="Final" className="w-full sm:w-36 h-36 object-cover rounded-lg" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#C65D3B]">{catalog.craftType}</span>
              <h3 className="text-base font-bold text-[#243B53]">{catalog.title}</h3>
              <p className="text-gray-600">{catalog.shortDescription}</p>
              <p className="font-black text-lg text-[#243B53] pt-1">Price: ₹{pricing.suggestedExact.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full btn-touch btn-terracotta text-xl shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing Listing...' : '🚀 Publish Product Now'}
          </button>
        </div>
      )}

      {/* SCREEN 7: PUBLISH CONFIRMATION */}
      {step === 7 && (
        <div className="soft-card p-8 bg-white text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-[#3E6650] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <h1 className="text-3xl font-black text-[#243B53]">Product Published Successfully!</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Your product <span className="font-bold text-[#243B53]">"{catalog.title}"</span> is now live on the HASTRA B2B Marketplace and visible to wholesale buyers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/seller/dashboard')}
              className="btn-touch btn-indigo text-base w-full sm:w-auto"
            >
              Go to Seller Dashboard
            </button>
            <button
              onClick={() => { setStep(1); setVoiceText(''); }}
              className="btn-touch btn-terracotta text-base w-full sm:w-auto"
            >
              + Add Another Product
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function NewProductWizardPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24 font-sans text-[#243B53]">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center font-bold text-[#243B53]">Loading Wizard...</div>}>
        <WizardContent />
      </Suspense>
      <SellerBottomNav />
    </div>
  );
}
