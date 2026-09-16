'use client';

import React, { useState } from 'react';
import { Bot, Mic, Send, X, Sparkles, HelpCircle } from 'lucide-react';

export default function AIBusinessAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Namaste! I am your HASTRA AI Business Assistant. You can ask me about pricing, pending orders, inventory, or how to grow your business!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const quickQuestions = [
    "What should I charge for this saree?",
    "How many products do I have?",
    "Which orders are pending?",
    "How can I sell more?"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assistant', query: q })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I am here to help you calculate costs, check orders, and write catalog descriptions.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I couldn’t process that request right now. You can try again or check your dashboard.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported on this browser. Please type your query.');
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
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-[#243B53] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-bold hover:bg-[#1a2c3f] hover:scale-105 transition-all border-2 border-[#F4EBDD]"
      >
        <div className="w-8 h-8 rounded-full bg-[#C65D3B] flex items-center justify-center text-white">
          <Bot className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline text-sm">Ask My Business Assistant</span>
        <span className="sm:hidden text-xs">AI Assistant</span>
      </button>

      {/* Assistant Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF8F3] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#EAE3D2] flex flex-col h-[85vh] sm:h-[600px] overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#243B53] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C65D3B] flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">HASTRA Business Assistant</h3>
                  <p className="text-xs text-[#F4EBDD]/80">Voice & Regional AI Manager</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F3]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#C65D3B] text-white rounded-br-none'
                        : 'bg-white text-[#243B53] border border-[#EAE3D2] rounded-bl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#EAE3D2] px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#243B53] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C65D3B] animate-spin" /> AI Assistant is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions Pills */}
            <div className="px-4 py-2 bg-[#F4EBDD]/60 border-t border-[#EAE3D2] flex gap-2 overflow-x-auto no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap text-xs font-semibold bg-white text-[#243B53] border border-[#EAE3D2] px-3 py-1.5 rounded-full hover:bg-[#C65D3B] hover:text-white transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-[#C65D3B]" /> {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#EAE3D2] flex items-center gap-2">
              <button
                onClick={startVoiceInput}
                className={`p-3 rounded-xl transition-all ${
                  isListening ? 'bg-red-500 text-white voice-pulse' : 'bg-[#F4EBDD] text-[#C65D3B] hover:bg-[#C65D3B] hover:text-white'
                }`}
                title="Tap to speak"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask in English or Telugu..."
                className="flex-1 bg-[#FAF8F3] border border-[#EAE3D2] rounded-xl px-4 py-2.5 text-sm text-[#243B53] focus:outline-none focus:border-[#C65D3B]"
              />
              <button
                onClick={() => handleSend()}
                className="bg-[#243B53] text-white p-3 rounded-xl hover:bg-[#1a2c3f] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
