'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, CheckCircle, Clock, FileText, Plus, Store, X, IndianRupee, Calendar, MapPin, Package, AlertCircle } from 'lucide-react';

interface Quote {
  id: string;
  offeredPrice: number;
  quantityAvailable: number;
  productionDays: number;
  shippingEstimate: number;
  terms: string;
  status: string;
  sellerProfile: { shopName: string; craftType: string; location: string; isVerified: boolean };
}

interface RFQ {
  id: string;
  title: string;
  quantityRequired: number;
  deliveryLocation: string;
  requiredByDate: string | null;
  targetBudget: number | null;
  customizationDetails: string | null;
  status: string;
  createdAt: string;
  quotes: Quote[];
}

export default function BuyerRfqsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newRfq, setNewRfq] = useState({
    title: '',
    quantityRequired: '',
    deliveryLocation: '',
    requiredByDate: '',
    targetBudget: '',
    customizationDetails: ''
  });

  const fetchRfqs = () => {
    setLoading(true);
    fetch('/api/rfqs')
      .then(res => res.json())
      .then(data => {
        if (data.rfqs) setRfqs(data.rfqs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRfq.title || !newRfq.quantityRequired || !newRfq.deliveryLocation) {
      setActionMsg('⚠️ Title, quantity, and delivery location are required.');
      return;
    }
    setSubmitting(true);
    setActionMsg('');
    try {
      const res = await fetch('/api/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newRfq.title,
          quantityRequired: Number(newRfq.quantityRequired),
          deliveryLocation: newRfq.deliveryLocation,
          requiredByDate: newRfq.requiredByDate || null,
          targetBudget: newRfq.targetBudget ? Number(newRfq.targetBudget) : null,
          customizationDetails: newRfq.customizationDetails || null
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to create RFQ');
      setActionMsg('✅ RFQ submitted successfully! Artisan sellers will respond with quotes.');
      setShowCreateForm(false);
      setNewRfq({ title: '', quantityRequired: '', deliveryLocation: '', requiredByDate: '', targetBudget: '', customizationDetails: '' });
      fetchRfqs();
    } catch (err: any) {
      setActionMsg(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuoteAction = async (quoteId: string, action: 'ACCEPT' | 'REJECT') => {
    const confirmMsg = action === 'ACCEPT'
      ? 'Accept this quote and place an order with the artisan?'
      : 'Reject this quote?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/quotes/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, action })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      setActionMsg(action === 'ACCEPT'
        ? `✅ Quote accepted! ${data.message}. Order: ${data.orderNumber}`
        : '✅ Quote rejected.');
      fetchRfqs();
    } catch (err: any) {
      setActionMsg(`❌ ${err.message}`);
    }
  };

  const statusColors: Record<string, string> = {
    OPEN: 'bg-amber-100 text-amber-800',
    QUOTED: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-emerald-100 text-[#3E6650]',
    CLOSED: 'bg-gray-100 text-gray-600',
    REJECTED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#243B53]">B2B Request For Quote (RFQ) Engine</h1>
            <p className="text-xs text-gray-500 mt-1">Submit bulk purchase requirements and compare artisan quotes.</p>
          </div>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setActionMsg(''); }}
            className="btn-touch btn-terracotta flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? 'Cancel' : 'Create New RFQ'}
          </button>
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
            actionMsg.startsWith('✅') ? 'bg-green-50 border-green-200 text-green-700' :
            actionMsg.startsWith('⚠️') ? 'bg-amber-50 border-amber-200 text-amber-700' :
            'bg-red-50 border-red-200 text-red-700'
          }`}>
            {actionMsg}
          </div>
        )}

        {/* Create RFQ Form */}
        {showCreateForm && (
          <div className="soft-card p-6 bg-white border-2 border-[#C65D3B]/30 space-y-5">
            <h2 className="text-xl font-bold text-[#243B53] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C65D3B]" /> New Bulk Purchase Request
            </h2>
            <p className="text-xs text-gray-500 bg-[#F4EBDD]/60 border border-[#E2D7C3] p-3 rounded-xl">
              💡 Your RFQ will be visible to verified artisan sellers. They will respond with competitive quotes within 24-48 hours.
            </p>

            <form onSubmit={handleCreateRfq} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Product / Requirement Title *</label>
                <input
                  type="text"
                  value={newRfq.title}
                  onChange={e => setNewRfq({ ...newRfq, title: e.target.value })}
                  placeholder="e.g. 50 pcs Handwoven Pochampally Cotton Sarees"
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#243B53] mb-1">
                    <Package className="w-4 h-4 inline mr-1" />Quantity Required *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRfq.quantityRequired}
                    onChange={e => setNewRfq({ ...newRfq, quantityRequired: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243B53] mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />Delivery Location *
                  </label>
                  <input
                    type="text"
                    value={newRfq.deliveryLocation}
                    onChange={e => setNewRfq({ ...newRfq, deliveryLocation: e.target.value })}
                    placeholder="e.g. New Delhi, 110001"
                    className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243B53] mb-1">
                    <IndianRupee className="w-4 h-4 inline mr-1" />Target Budget (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newRfq.targetBudget}
                    onChange={e => setNewRfq({ ...newRfq, targetBudget: e.target.value })}
                    placeholder="e.g. 75000"
                    className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243B53] mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />Required By (Optional)
                  </label>
                  <input
                    type="date"
                    value={newRfq.requiredByDate}
                    onChange={e => setNewRfq({ ...newRfq, requiredByDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#243B53] mb-1">Customization / Special Requirements (Optional)</label>
                <textarea
                  rows={3}
                  value={newRfq.customizationDetails}
                  onChange={e => setNewRfq({ ...newRfq, customizationDetails: e.target.value })}
                  placeholder="e.g. Specific color combinations, embroidery, branding labels, packaging requirements..."
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-3 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-touch btn-terracotta text-lg flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Submitting to Artisan Network...' : 'Submit RFQ to Artisan Sellers'}
              </button>
            </form>
          </div>
        )}

        {/* RFQs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-44 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : rfqs.length === 0 ? (
          <div className="soft-card p-12 bg-white text-center space-y-4">
            <FileText className="w-16 h-16 text-gray-200 mx-auto" />
            <h3 className="text-xl font-bold text-[#243B53]">No RFQs Yet</h3>
            <p className="text-sm text-gray-500">Create your first bulk purchase request to connect with verified artisan sellers.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-touch btn-terracotta text-sm flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" /> Create Your First RFQ
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="soft-card p-6 bg-white space-y-4">

                {/* RFQ Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EAE3D2] pb-3">
                  <div>
                    <span className="text-[10px] font-bold bg-[#F4EBDD] text-[#C65D3B] px-2.5 py-0.5 rounded">
                      RFQ #{rfq.id.substring(0, 8).toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-[#243B53] mt-1">{rfq.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {new Date(rfq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[rfq.status] || 'bg-gray-100 text-gray-600'}`}>
                    {rfq.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF8F3] p-3.5 rounded-xl border border-[#EAE3D2]">
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Quantity</span>
                    <strong className="text-sm font-bold text-[#243B53]">{rfq.quantityRequired} pcs</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Destination</span>
                    <strong className="text-sm font-bold text-[#243B53] line-clamp-1">{rfq.deliveryLocation}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Budget</span>
                    <strong className="text-sm font-bold text-[#243B53]">{rfq.targetBudget ? `₹${rfq.targetBudget.toLocaleString()}` : 'Flexible'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Deadline</span>
                    <strong className="text-sm font-bold text-[#243B53]">
                      {rfq.requiredByDate ? new Date(rfq.requiredByDate).toLocaleDateString('en-IN') : 'Flexible'}
                    </strong>
                  </div>
                </div>

                {rfq.customizationDetails && (
                  <div className="text-xs text-gray-600 bg-[#FAF8F3] p-3 rounded-xl border border-[#EAE3D2]">
                    <span className="font-bold text-[#243B53]">Customization: </span>
                    {rfq.customizationDetails}
                  </div>
                )}

                {/* Artisan Quotes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#243B53] uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#C65D3B]" />
                    Received Artisan Quotes ({rfq.quotes?.length || 0})
                  </h4>

                  {rfq.quotes?.length > 0 ? (
                    rfq.quotes.map((q) => (
                      <div key={q.id} className="p-4 bg-[#F4EBDD]/60 rounded-xl border border-[#E2D7C3]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#C65D3B]">{q.sellerProfile?.shopName || 'Artisan Shop'}</span>
                              {q.sellerProfile?.isVerified && (
                                <span className="text-[10px] font-bold bg-[#3E6650] text-white px-1.5 py-0.5 rounded">✓ Verified</span>
                              )}
                              {q.status !== 'PENDING' && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  q.status === 'ACCEPTED' ? 'bg-emerald-100 text-green-700' : 'bg-red-100 text-red-600'
                                }`}>
                                  {q.status}
                                </span>
                              )}
                            </div>
                            <p className="text-2xl font-black text-[#243B53]">₹{q.offeredPrice?.toLocaleString()} <span className="text-sm font-medium text-gray-500">/ unit</span></p>
                            <p className="text-xs text-gray-600">
                              Lead Time: <strong>{q.productionDays} days</strong> •
                              Shipping: <strong>₹{q.shippingEstimate || 500}</strong> •
                              {q.sellerProfile?.location && <span> Location: <strong>{q.sellerProfile.location}</strong></span>}
                            </p>
                            {q.terms && <p className="text-xs text-gray-500 italic">&ldquo;{q.terms}&rdquo;</p>}
                          </div>

                          {q.status === 'PENDING' && rfq.status !== 'ACCEPTED' && (
                            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleQuoteAction(q.id, 'ACCEPT')}
                                className="btn-touch btn-terracotta text-xs px-4 py-2 flex items-center gap-1.5"
                              >
                                <CheckCircle className="w-4 h-4" /> Accept & Place Order
                              </button>
                              <button
                                onClick={() => handleQuoteAction(q.id, 'REJECT')}
                                className="btn-touch bg-gray-100 text-gray-600 text-xs px-3 py-2 hover:bg-red-50 hover:text-red-600 flex items-center gap-1.5"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#EAE3D2] flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#243B53]">Waiting for Artisan Quotes</p>
                        <p className="text-xs text-gray-500">Sellers have been notified. Quotes typically arrive within 24-48 hours.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
