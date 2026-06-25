import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare, Trash2, Globe } from 'lucide-react';
import { assistantSuggestedPrompts, assistantAnswers } from '../services/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your AI Travel Assistant. Ask me anything about attractions, restaurants, packing checklists, or itineraries for Kochi, Munnar, Alleppey, Wayanad, Goa, and Jaipur!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    
    // Simulate AI typing response
    setIsTyping(true);
    
    setTimeout(() => {
      const normalizedQuery = text.toLowerCase().trim().replace(/[?.]/g, '').trim();
      let aiText = `I'd love to help you plan that! Could you tell me a bit more about your preferred destination (Kochi, Munnar, Alleppey, Wayanad, Goa, or Jaipur), budget, and duration? I can outline sightseeing spots and local dining.`;

      // Check for matching mock response keys
      for (const key of Object.keys(assistantAnswers)) {
        const normalizedKey = key.toLowerCase().trim().replace(/[?.]/g, '').trim();
        if (normalizedQuery.includes(normalizedKey) || normalizedKey.includes(normalizedQuery)) {
          aiText = assistantAnswers[key];
          break;
        }
      }

      // Special fallback matching
      if (normalizedQuery.includes('budget') && normalizedQuery.includes('munnar')) {
        aiText = assistantAnswers["create a budget itinerary for munnar."];
      } else if (normalizedQuery.includes('kochi') && (normalizedQuery.includes('days') || normalizedQuery.includes('2'))) {
        aiText = assistantAnswers["what can i visit in kochi in 2 days?"];
      } else if (normalizedQuery.includes('food') || normalizedQuery.includes('eat') || normalizedQuery.includes('restaurant')) {
        if (normalizedQuery.includes('kochi')) {
          aiText = assistantAnswers["best food places near fort kochi?"];
        }
      } else if (normalizedQuery.includes('event') || normalizedQuery.includes('festival')) {
        if (normalizedQuery.includes('goa')) {
          aiText = assistantAnswers["which events are happening in goa?"];
        }
      } else if (normalizedQuery.includes('time') || normalizedQuery.includes('visit') || normalizedQuery.includes('weather')) {
        if (normalizedQuery.includes('wayanad')) {
          aiText = assistantAnswers["best time of year to visit wayanad?"];
        }
      }

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Chat cleared. What travel destinations can I assist you with today?",
          timestamp: new Date()
        }
      ]);
    }
  };

  // Convert markdown-like syntax to HTML strings safely
  const renderMessageContent = (text) => {
    // Escape standard elements to render lists and headings simply
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-base font-extrabold mt-3 mb-1 text-slate-800 dark:text-white">{line.slice(4)}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h5 key={idx} className="font-bold text-sm mt-2 text-slate-700 dark:text-slate-200">{line.replace(/\*\*/g, '')}</h5>;
      }
      if (line.startsWith('* **')) {
        // Bullet list item
        const parts = line.split('**:');
        if (parts.length > 1) {
          return (
            <div key={idx} className="flex items-start gap-1.5 ml-2 my-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="mt-1.5 w-1 h-1 bg-sky-500 rounded-full flex-shrink-0" />
              <p>
                <strong className="text-slate-800 dark:text-slate-200">{parts[0].replace(/\*\s\*\*/g, '')}</strong>: 
                {parts[1]}
              </p>
            </div>
          );
        }
      }
      if (line.startsWith('1.  **') || line.startsWith('2.  **') || line.startsWith('3.  **')) {
        const parts = line.split('**');
        return (
          <div key={idx} className="ml-2 my-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-800 dark:text-slate-200">{line.slice(0, 4)}{parts[1]}</span>
            <span>{parts.slice(2).join('')}</span>
          </div>
        );
      }
      if (line.trim().startsWith('*')) {
        return (
          <div key={idx} className="flex items-center gap-1.5 ml-4 my-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-1 h-1 bg-sky-500 rounded-full" />
            <span>{line.replace(/\*\s/g, '')}</span>
          </div>
        );
      }
      return <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* Sidebar - suggested prompts */}
      <div className="w-full md:w-80 flex flex-col justify-between gap-4 md:border-r border-slate-200 dark:border-slate-800 md:pr-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Bot size={20} className="text-sky-500" /> Travel Assistant
            </h2>
            <button 
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Get instant local recommendations on cuisine, transit, weather and travel times using natural conversational commands.
          </p>

          <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Quick Prompts List */}
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Suggested Queries</p>
            {assistantSuggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="w-full text-left p-3 text-xs bg-slate-50 hover:bg-sky-500/10 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 rounded-2xl transition-all font-medium text-slate-700 dark:text-slate-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <Globe size={12} className="text-sky-500" />
          <span>Local guides database active</span>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-grow flex flex-col justify-between glass rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full">
        {/* Messages Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Specialist Online</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Model: Gemini Travel-Agent</span>
        </div>

        {/* Messages Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 h-fit ${
                    isAi 
                      ? 'bg-sky-500/10 text-sky-500 border border-sky-500/15' 
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15'
                  }`}>
                    {isAi ? <Bot size={18} /> : <User size={18} />}
                  </div>

                  <div className={`p-4 rounded-2xl ${
                    isAi 
                      ? 'bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/80 rounded-tl-none' 
                      : 'bg-gradient-accent text-white rounded-tr-none shadow-md shadow-sky-500/10'
                  }`}>
                    {isAi ? (
                      <div className="space-y-1">
                        {renderMessageContent(msg.text)}
                      </div>
                    ) : (
                      <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 max-w-[80%] mr-auto"
              >
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/15 h-fit">
                  <Bot size={18} />
                </div>
                <div className="p-4 bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 flex gap-3">
          <input
            type="text"
            placeholder="Ask about Kochi attractions, Munnar weather or Goan food..."
            className="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-3 bg-gradient-accent text-white rounded-2xl shadow-lg shadow-sky-500/15 hover:scale-105 transition-all flex items-center justify-center"
            aria-label="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
