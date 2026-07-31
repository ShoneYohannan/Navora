import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Copy, CheckCircle2, User, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assistantAnswers } from '../services/mockData';

// Dynamic destination tourist image gallery (No spa image, starts with iconic tourist places)
const destinationGallery = [
  {
    title: 'KERALA SUNSET HOUSEBOAT',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'Tell me about Alleppey sunset houseboat cruises and backwater dining.'
  },
  {
    title: 'FORT KOCHI CHINESE NETS',
    url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    prompt: 'What are the top heritage spots and seafood stalls near Chinese Fishing Nets?'
  },
  {
    title: 'MUNNAR TEA GARDENS MIST',
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    prompt: 'Create a budget itinerary for Munnar tea plantations and viewpoint treks.'
  },
  {
    title: 'JAIPUR HAWA MAHAL PALACE',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    prompt: 'Which regal forts, palaces, and handicrafts should I visit in Jaipur?'
  },
  {
    title: 'PALOLEM BEACH GOA SUNSET',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'Which events and beaches are happening in Goa?'
  },
  {
    title: 'GATEWAY OF INDIA MUMBAI',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    prompt: 'Tell me about historic coastal gateways and harbor boat tours.'
  },
  {
    title: 'WAYANAD BAMBOO FORESTS',
    url: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
    prompt: 'What is the best time of year to visit Wayanad wildlife and waterfalls?'
  }
];

// Local Explorer Channels
const explorerChannels = [
  {
    id: 'kochi-2days',
    title: 'Kochi in 2 days',
    icon: '🛕',
    prompt: 'What can I visit in Kochi in 2 days?'
  },
  {
    id: 'fort-kochi-food',
    title: 'Fort Kochi food',
    icon: '🍲',
    prompt: 'Best food places near Fort Kochi?'
  },
  {
    id: 'kochi-spa',
    title: 'Kochi Spa & Ayurveda',
    icon: '💆',
    prompt: 'I want to go for a spa only in Kochi'
  },
  {
    id: 'fresh-market',
    title: 'Fresh market',
    icon: '🏛️',
    prompt: 'Tell me about local fresh markets and spice bazaars in Kochi and Goa.'
  },
  {
    id: 'spice-market',
    title: 'Spice market',
    icon: '🏺',
    prompt: 'What are the historic spice trading routes and spice markets in Kerala?'
  },
  {
    id: 'goa',
    title: 'Goa',
    icon: '🌴',
    prompt: 'Which events and beaches are happening in Goa?'
  }
];

const Assistant = () => {
  // Starts with tourist place (index 0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: "Hello! I'm your AI Travel Assistant. Ask me anything about Ayurvedic spas in Kochi, sightseeing, local food, packing checklists, or itineraries for Kochi, Munnar, Alleppey, Wayanad, Goa, and Jaipur!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Automatic timer rotation every 4 minutes (240,000 ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % destinationGallery.length);
    }, 4 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Intelligent Travel AI Intent Generator
  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. SPA / AYURVEDA / WELLNESS INTENT
    if (q.includes('spa') || q.includes('ayurveda') || q.includes('massage') || q.includes('wellness') || q.includes('relaxation')) {
      if (q.includes('kochi') || q.includes('fort kochi') || (!q.includes('munnar') && !q.includes('goa') && !q.includes('jaipur') && !q.includes('wayanad'))) {
        return assistantAnswers["spa in kochi"];
      } else if (q.includes('munnar')) {
        return assistantAnswers["spa and wellness in munnar"];
      } else if (q.includes('goa')) {
        return assistantAnswers["spa and wellness in goa"];
      } else {
        return assistantAnswers["spa in kochi"];
      }
    }

    // 2. KOCHI ITINERARY / 2 DAYS INTENT
    if (q.includes('kochi') && (q.includes('days') || q.includes('2') || q.includes('itinerary') || q.includes('visit') || q.includes('attractions'))) {
      return assistantAnswers["what can i visit in kochi in 2 days?"];
    }

    // 3. FOOD / RESTAURANTS / DINING INTENT
    if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('seafood') || q.includes('cafe')) {
      if (q.includes('kochi') || q.includes('fort kochi') || !q.includes('goa')) {
        return assistantAnswers["best food places near fort kochi?"];
      }
    }

    // 4. GOA EVENTS / BEACHES INTENT
    if (q.includes('goa')) {
      return assistantAnswers["which events are happening in goa?"];
    }

    // 5. MUNNAR ITINERARY INTENT
    if (q.includes('munnar')) {
      return assistantAnswers["create a budget itinerary for munnar."];
    }

    // 6. WAYANAD TIMING INTENT
    if (q.includes('wayanad')) {
      return assistantAnswers["best time of year to visit wayanad?"];
    }

    // 7. EXACT MATCH CHECK AGAINST MOCK DATA
    for (const key of Object.keys(assistantAnswers)) {
      const normKey = key.toLowerCase().trim().replace(/[?.]/g, '');
      const normQ = q.replace(/[?.]/g, '');
      if (normQ.includes(normKey) || normKey.includes(normQ)) {
        return assistantAnswers[key];
      }
    }

    // 8. DYNAMIC INTELLIGENT TRAVEL RESPONSE FOR ANY CUSTOM DESTINATION / ACTIVITY
    let detectedCity = "Kochi";
    if (q.includes("munnar")) detectedCity = "Munnar";
    else if (q.includes("alleppey")) detectedCity = "Alleppey";
    else if (q.includes("wayanad")) detectedCity = "Wayanad";
    else if (q.includes("goa")) detectedCity = "Goa";
    else if (q.includes("jaipur")) detectedCity = "Jaipur";

    return `### 🌟 Curated Recommendations for ${detectedCity}

Regarding your request: **"${userQuery}"**

1. **Top Recommendation**: We recommend starting your exploration around the main heritage center of ${detectedCity}.
2. **Local Tip**: Speak with licensed local guides and arrange transport (auto-rickshaws or private cabs) in advance.
3. **Best Hours**: Morning sessions (8:00 AM – 11:30 AM) offer peaceful atmospheres and pleasant temperatures.

> 💡 *Need specific details on pricing, hotel stays, or transport options for ${detectedCity}? Let me know!*`;
  };

  // Handle send message
  const handleSendMessage = (customText) => {
    const text = customText || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      const aiText = generateAIResponse(text);

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleChannelClick = (channel) => {
    handleSendMessage(channel.prompt);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePhoto = destinationGallery[currentImageIndex];

  return (
    <div className="min-h-screen bg-[#070e1b] py-6 px-3 sm:px-6 lg:px-8 font-sans text-slate-100 flex items-center justify-center">
      {/* Main Outer Retro Container Box */}
      <div className="w-full max-w-6xl rounded-3xl border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a1222] grid grid-cols-1 lg:grid-cols-12">
        
        {/* ========================================================
            LEFT 'EXPLORER' PANEL (Dark Blue Glassmorphic)
           ======================================================== */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#162238] via-[#101b2f] to-[#0d1627] p-6 flex flex-col justify-between border-r border-slate-700/50 space-y-6">
          <div className="space-y-6">
            
            {/* Left Header */}
            <div className="space-y-3 border-b border-slate-700/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/20 border border-[#E07A5F]/40 flex items-center justify-center text-[#E07A5F]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-100 uppercase leading-none">
                    TRAVEL
                  </h1>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-100 uppercase leading-none">
                    ASSISTANT
                  </h1>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Get instant local recommendations on cuisine, transit, weather and travel times using natural conversational commands.
              </p>
            </div>

            {/* LOCAL EXPLORER CHANNELS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase font-sans">
                  LOCAL EXPLORER CHANNELS
                </h2>
              </div>

              {/* Grid of 6 interactive pill buttons */}
              <div className="grid grid-cols-2 gap-2">
                {explorerChannels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelClick(chan)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-800 text-xs font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-slate-200/80 truncate text-left"
                  >
                    <span className="text-sm flex-shrink-0">{chan.icon}</span>
                    <span className="truncate">{chan.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Dynamic Destination Image Preview Card (No user manual click interaction) */}
            <div className="space-y-2 select-none">
              <div className="relative rounded-2xl overflow-hidden border border-slate-600/50 shadow-lg h-44 bg-slate-900">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover transition-opacity duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Image Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                    FEATURED DESTINATION
                  </p>
                  <p className="text-xs font-bold truncate">{activePhoto.title}</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center font-mono select-none">
                (Preview: {activePhoto.title})
              </p>
            </div>

            {/* Status & Integrity Box */}
            <div className="rounded-xl bg-[#0c1424]/80 border border-slate-700/60 p-3 flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-serif text-xs font-bold text-slate-100">Status & Integrity</h4>
                <p className="text-[11px] text-slate-400">Local guides database active</p>
              </div>
            </div>

          </div>

          {/* Left Panel Footer */}
          <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>PASTANO AI ENGINE</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT 'TRAVEL JOURNAL' PANEL (Ivory Vellum Paper)
           ======================================================== */}
        <div className="lg:col-span-8 bg-[#F7F2E6] text-slate-900 p-6 flex flex-col justify-between relative min-h-[720px] overflow-hidden">
          
          {/* Subtle Pencil Landmark Sketches Overlay in Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 select-none overflow-hidden">
            {/* Top Left Houseboat & Temple Sketch */}
            <svg className="absolute top-10 left-10 w-48 h-36" viewBox="0 0 200 150" stroke="#4A3E3D" fill="none" strokeWidth="1">
              <path d="M20 100 Q 60 70 120 100 L 180 100 M 40 100 L 40 60 L 80 40 L 120 60 L 120 100 M 50 60 L 110 60 M 70 40 L 70 20" />
              <path d="M10 120 Q 100 110 190 120" strokeDasharray="3 3" />
            </svg>

            {/* Middle Mountain Contour Lines Sketch */}
            <svg className="absolute top-1/3 left-1/3 w-64 h-40" viewBox="0 0 300 200" stroke="#4A3E3D" fill="none" strokeWidth="1">
              <path d="M10 150 Q 80 60 150 130 T 290 140 M 50 160 Q 120 90 200 170" />
              <path d="M100 130 Q 140 100 180 140" strokeDasharray="2 2" />
            </svg>

            {/* Top Right Kettuvallam Houseboat Sketch */}
            <svg className="absolute top-12 right-12 w-52 h-36" viewBox="0 0 220 140" stroke="#4A3E3D" fill="none" strokeWidth="1">
              <path d="M10 90 Q 100 40 210 90 L 190 110 Q 100 125 30 110 Z" />
              <path d="M40 90 Q 100 60 160 90 M 50 70 Q 100 45 150 70" />
            </svg>

            {/* Bottom Left Houseboat Sketch */}
            <svg className="absolute bottom-24 left-8 w-56 h-40" viewBox="0 0 240 150" stroke="#4A3E3D" fill="none" strokeWidth="1">
              <path d="M20 100 Q 120 50 220 100 L 200 120 Q 120 135 40 120 Z" />
              <path d="M50 100 C 70 70, 170 70, 190 100" />
            </svg>

            {/* Bottom Right Gateway of India Arch Sketch */}
            <svg className="absolute bottom-20 right-10 w-60 h-48" viewBox="0 0 260 200" stroke="#4A3E3D" fill="none" strokeWidth="1.2">
              <path d="M30 180 L 30 60 L 70 40 L 190 40 L 230 60 L 230 180 M 30 90 L 230 90 M 90 180 L 90 110 Q 130 90 170 110 L 170 180 M 110 40 L 110 20 L 150 20 L 150 40" />
              <circle cx="130" cy="65" r="15" />
            </svg>
          </div>

          {/* Top Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-stone-300/80 pb-3 mb-4 text-stone-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide">AI Specialist Online</span>
            </div>
            <span className="text-xs font-mono text-stone-500">Model: Gemini Travel-Agent</span>
          </div>

          {/* Chat Messages Stream Area */}
          <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-4 max-h-[460px] scrollbar-thin">
            <AnimatePresence>
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                  >
                    {/* Cute Robot Line Icon Avatar for AI */}
                    {isAi && (
                      <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border-2 border-[#E07A5F] flex items-center justify-center text-[#E07A5F] flex-shrink-0 shadow-sm">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                        isAi
                          ? 'bg-[#FAF6EE]/90 backdrop-blur-md text-stone-800 border border-[#E07A5F]/40 rounded-tl-none font-serif text-sm shadow-[0_4px_20px_rgba(224,122,95,0.1)]'
                          : 'bg-[#E07A5F] text-white rounded-tr-none font-sans shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200/40 text-[10px] text-stone-400">
                        <span>
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isAi && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-stone-700 transition-colors ml-2"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {!isAi && (
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-amber-200 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing status indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border-2 border-[#E07A5F] flex items-center justify-center text-[#E07A5F]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#FAF6EE] px-4 py-2.5 rounded-2xl rounded-tl-none border border-[#E07A5F]/30 text-xs text-stone-600 font-serif italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E07A5F] animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Travel Journal Bottom Input Bar */}
          <div className="relative z-10 mt-4 pt-3 border-t border-stone-300/60 space-y-2">
            {/* Section Tab Header */}
            <div className="flex items-center justify-between px-1">
              <span className="font-serif font-bold text-sm text-stone-800">Travel Journal</span>
              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => handleSendMessage("i want to go for a spa only in kochi")}
                  className="px-2 py-0.5 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/30 text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white transition-all font-serif"
                >
                  💆 Spa in Kochi
                </button>
              </div>
            </div>

            {/* Input Pill Box with Paper Airplane Send Button */}
            <div className="relative flex items-center rounded-full bg-[#FAF6EE] border border-stone-300 shadow-inner px-4 py-1.5 focus-within:border-[#E07A5F] focus-within:ring-2 focus-within:ring-[#E07A5F]/20 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Kochi attractions, Spa in Kochi, Munnar weather or Goan food..."
                className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 font-sans outline-none py-1.5"
              />

              {/* Coral Circle Send Action Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md flex-shrink-0 ${
                  inputText.trim()
                    ? 'bg-[#E07A5F] hover:bg-[#c96349] text-white scale-105'
                    : 'bg-[#E07A5F] text-white/90 hover:opacity-90'
                }`}
                title="Send query"
              >
                <Send className="w-4 h-4 transform rotate-45 -translate-y-0.5 translate-x-0.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Assistant;
