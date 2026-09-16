'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Send, CheckCircle, Clock, FileText, ChevronRight, Store } from 'lucide-react';

export default function BuyerRfqsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rfqs')
      .then(res => res.json())
      .then(data => {
        if (data.rfqs) setRfqs(data.rfqs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAcceptQuote = (quoteId: string) => {
    alert(`Quote #${quoteId} accepted! Order confirmation sent to artisan seller.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[#243B53]">B2B Request For Quote (RFQ) Engine</h1>
          <p className="text-xs text-gray-500 mt-1">Track your bulk purchase enquiries and artisan quotes.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {rfqs.map((rfq, idx) => (
              <div key={idx} className="soft-card p-6 bg-white space-y-4">
                
                {/* RFQ Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EAE3D2] pb-3">
                  <div>
                    <span className="text-[10px] font-bold bg-[#F4EBDD] text-[#C65D3B] px-2.5 py-0.5 rounded">
                      RFQ #{rfq.id.substring(0, 8)}
                    </span>
                    <h3 className="text-lg font-bold text-[#243B53] mt-1">{rfq.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    rfq.status === 'QUOTED' ? 'bg-[#3E6650] text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {rfq.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#FAF8F3] p-3.5 rounded-xl border border-[#EAE3D2]">
                  <div>
                    <span className="text-gray-400 font-semibold block">Quantity Required</span>
                    <strong className="text-sm font-bold text-[#243B53]">{rfq.quantityRequired} pcs</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block">Destination</span>
                    <strong className="text-sm font-bold text-[#243B53]">{rfq.deliveryLocation}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block">Target Budget</span>
                    <strong className="text-sm font-bold text-[#243B53]">{rfq.targetBudget ? `₹${rfq.targetBudget.toLocaleString()}` : 'Flexible'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block">Customizations</span>
                    <strong className="text-xs text-gray-700 truncate block">{rfq.customizationDetails || 'None'}</strong>
                  </div>
                </div>

                {/* Artisan Quotes Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#243B53] uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#C65D3B]" /> Received Artisan Quotes ({rfq.quotes?.length || 0}):
                  </h4>

                  {rfq.quotes?.length > 0 ? (
                    rfq.quotes.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="p-4 bg-[#F4EBDD]/60 rounded-xl border border-[#E2D7C3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#C65D3B]">{q.sellerProfile?.shopName || 'Lakshmi Handlooms'}</span>
                          <p className="text-xl font-black text-[#243B53]">₹{q.offeredPrice?.toLocaleString()} / unit</p>
                          <p className="text-xs text-gray-600">Production Lead Time: {q.productionDays} Days • Shipping: ₹{q.shippingEstimate || 500}</p>
                          <p className="text-xs text-gray-500 italic">Terms: "{q.terms || '50% advance upon confirmation'}"</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptQuote(q.id)}
                            className="btn-touch btn-terracotta text-xs px-4 py-2"
                          >
                            Accept Quote & Place Order
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No quotes received yet. Artisan notification dispatched.</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
