'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Send, User, Clock, CheckCheck, Search, Store, ArrowLeft } from 'lucide-react';

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: { id: string; name: string; role: string };
  receiver: { id: string; name: string; role: string };
}

export default function BuyerEnquiriesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [myUserId, setMyUserId] = useState('');
  const [search, setSearch] = useState('');

  // Fetch my user ID
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(d => {
        if (d.authenticated) setMyUserId(d.user.id);
      })
      .catch(() => {});
  }, []);

  const fetchConversations = () => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(d => {
        if (d.conversations) setConversations(d.conversations);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchThread = (partnerId: string) => {
    setSelectedConv(partnerId);
    fetch(`/api/messages?with=${partnerId}`)
      .then(res => res.json())
      .then(d => {
        if (d.messages) setMessages(d.messages);
        // Refresh inbox to update unread count
        fetchConversations();
      })
      .catch(() => {});
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedConv, content: newMessage.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage('');
        fetchThread(selectedConv);
      }
    } catch (e) {}
    finally { setSending(false); }
  };

  const selectedPartner = conversations.find(c => c.partnerId === selectedConv);
  const filteredConvs = conversations.filter(c =>
    c.partnerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#243B53] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#243B53]">Seller Enquiries &amp; Messages</h1>
          <p className="text-xs text-gray-500 mt-1">Chat directly with artisan sellers about products, customizations, and bulk orders.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          
          {/* Conversations Sidebar */}
          <div className={`lg:col-span-1 soft-card bg-white flex flex-col overflow-hidden ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-[#EAE3D2]">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto" />
                  <p className="text-sm font-bold text-[#243B53]">No conversations yet</p>
                  <p className="text-xs text-gray-400">
                    When you enquire about a product from the marketplace, the seller conversation will appear here.
                  </p>
                </div>
              ) : (
                filteredConvs.map(conv => (
                  <button
                    key={conv.partnerId}
                    onClick={() => fetchThread(conv.partnerId)}
                    className={`w-full text-left p-4 border-b border-[#EAE3D2] hover:bg-[#F4EBDD]/50 transition-colors ${
                      selectedConv === conv.partnerId ? 'bg-[#F4EBDD]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#243B53] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {conv.partnerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#243B53] truncate">{conv.partnerName}</span>
                          {conv.unreadCount > 0 && (
                            <span className="bg-[#C65D3B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#C65D3B] bg-[#F4EBDD] px-1.5 py-0.5 rounded">
                          {conv.partnerRole}
                        </span>
                        <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className={`lg:col-span-2 soft-card bg-white flex flex-col overflow-hidden ${!selectedConv ? 'hidden lg:flex' : 'flex'}`}>
            {selectedConv && selectedPartner ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-[#EAE3D2] flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="lg:hidden p-1.5 text-[#243B53] hover:text-[#C65D3B]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-[#243B53] text-white flex items-center justify-center font-bold">
                    {selectedPartner.partnerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#243B53]">{selectedPartner.partnerName}</h3>
                    <span className="text-xs font-bold text-[#C65D3B]">{selectedPartner.partnerRole} • Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <MessageSquare className="w-10 h-10 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-400">Send the first message to start your conversation.</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.senderId === myUserId;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm space-y-1 ${
                            isMe
                              ? 'bg-[#C65D3B] text-white rounded-tr-sm'
                              : 'bg-[#F4EBDD] text-[#243B53] rounded-tl-sm'
                          }`}>
                            <p>{msg.content}</p>
                            <div className={`flex items-center gap-1 text-[10px] opacity-70 justify-end`}>
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              {isMe && <CheckCheck className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-[#EAE3D2] flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message to the seller..."
                    className="flex-1 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2.5 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 bg-[#C65D3B] text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-[#b04e2f] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-[#F4EBDD] flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-[#C65D3B]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#243B53]">Select a Conversation</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a seller conversation from the left panel to view and reply to messages.
                  </p>
                </div>
                <div className="bg-[#F4EBDD]/60 border border-[#E2D7C3] rounded-xl p-4 max-w-xs text-xs text-[#243B53]/80 text-left space-y-2">
                  <p className="font-bold">💡 How to start an enquiry:</p>
                  <p>Visit the B2B Marketplace, find a product, and click <strong>"Contact Seller"</strong> to start a conversation directly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
