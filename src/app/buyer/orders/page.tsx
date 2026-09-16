'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, Banknote, MapPin, Store, ArrowRight } from 'lucide-react';

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-4 h-4" /> },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle2 className="w-4 h-4" /> },
  PROCESSING: { label: 'In Production', color: 'bg-purple-100 text-purple-700', icon: <Package className="w-4 h-4" /> },
  SHIPPED: { label: 'Shipped', color: 'bg-[#F4EBDD] text-[#C65D3B]', icon: <Truck className="w-4 h-4" /> },
  DELIVERED: { label: 'Delivered ✓', color: 'bg-emerald-100 text-[#3E6650]', icon: <CheckCircle2 className="w-4 h-4" /> },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <Package className="w-4 h-4" /> }
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Payment Pending', color: 'text-amber-600' },
  PAID: { label: 'Paid', color: 'text-[#3E6650]' },
  REFUNDED: { label: 'Refunded', color: 'text-blue-600' }
};

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/buyer/orders')
      .then(res => res.json())
      .then(d => {
        if (d.orders) setOrders(d.orders);
        else if (d.error === 'Unauthorized. Buyer login required.') {
          // Fallback to buyer dashboard for orders
          return fetch('/api/buyer/dashboard')
            .then(r => r.json())
            .then(data => { if (data.recentOrders) setOrders(data.recentOrders); });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#243B53]">B2B Order Tracking &amp; History</h1>
            <p className="text-xs text-gray-500 mt-1">View active orders, production status, shipping updates, and payment details.</p>
          </div>
          <Link href="/buyer/rfqs" className="btn-touch btn-terracotta text-sm flex items-center gap-2 shrink-0">
            <ShoppingBag className="w-4 h-4" /> Create New RFQ
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                filter === status
                  ? 'bg-[#243B53] text-white border-[#243B53]'
                  : 'bg-white text-[#243B53] border-[#EAE3D2] hover:border-[#C65D3B]'
              }`}
            >
              {status === 'ALL' ? `All Orders (${orders.length})` : ORDER_STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="soft-card p-12 text-center bg-white space-y-4">
            <Package className="w-16 h-16 text-gray-200 mx-auto" />
            <h3 className="text-xl font-bold text-[#243B53]">
              {filter === 'ALL' ? 'No Orders Placed Yet' : `No ${filter} Orders`}
            </h3>
            <p className="text-sm text-gray-500">
              {filter === 'ALL'
                ? 'When you accept artisan RFQ quotes, your orders will appear here.'
                : 'Try changing the filter to see other orders.'}
            </p>
            {filter === 'ALL' && (
              <Link href="/buyer/rfqs" className="inline-block btn-touch btn-indigo text-sm">
                Browse RFQs &amp; Quotes <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord: any) => {
              const statusConfig = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG.PENDING;
              const paymentConfig = PAYMENT_CONFIG[ord.paymentStatus] || PAYMENT_CONFIG.PENDING;
              return (
                <div key={ord.id} className="soft-card p-6 bg-white space-y-4">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EAE3D2] pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#C65D3B] bg-[#F4EBDD] px-2.5 py-0.5 rounded">
                        {ord.orderNumber || `#${ord.id.substring(0, 8).toUpperCase()}`}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Placed {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusConfig.color}`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold block">Total Amount</span>
                      <span className="text-xl font-black text-[#243B53] flex items-center">
                        <Banknote className="w-4 h-4 mr-1 text-[#3E6650]" />
                        ₹{ord.totalAmount?.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold ${paymentConfig.color}`}>{paymentConfig.label}</span>
                    </div>

                    {ord.sellerProfile && (
                      <div>
                        <span className="text-gray-400 font-semibold block mb-0.5">Artisan Seller</span>
                        <span className="flex items-center gap-1 font-bold text-[#243B53]">
                          <Store className="w-3.5 h-3.5 text-[#C65D3B]" />
                          {ord.sellerProfile.shopName}
                        </span>
                        <span className="text-gray-500 block">{ord.sellerProfile.craftType}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-400 font-semibold block mb-0.5">Shipping To</span>
                      <span className="flex items-center gap-1 font-bold text-[#243B53]">
                        <MapPin className="w-3.5 h-3.5 text-[#C65D3B]" />
                        {ord.shippingAddress}
                      </span>
                    </div>

                    {/* Production/Shipping Timeline */}
                    <div>
                      <span className="text-gray-400 font-semibold block mb-2">Order Progress</span>
                      <div className="space-y-1">
                        {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(s => {
                          const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                          const currentIdx = statuses.indexOf(ord.status);
                          const sIdx = statuses.indexOf(s);
                          const isComplete = sIdx <= currentIdx;
                          return (
                            <div key={s} className={`flex items-center gap-1.5 text-[10px] font-bold ${isComplete ? 'text-[#3E6650]' : 'text-gray-300'}`}>
                              <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-[#3E6650]' : 'bg-gray-200'}`} />
                              {ORDER_STATUS_CONFIG[s]?.label || s}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {ord.items && ord.items.length > 0 && (
                    <div className="border-t border-[#EAE3D2] pt-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {ord.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 bg-[#FAF8F3] rounded-xl border border-[#EAE3D2]">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0].enhancedUrl || item.product.images[0].originalUrl}
                                alt={item.product.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-bold text-[#243B53] line-clamp-1">{item.product?.title || 'Product'}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString()}</p>
                            </div>
                            <p className="font-black text-[#243B53]">₹{(item.quantity * item.unitPrice)?.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
