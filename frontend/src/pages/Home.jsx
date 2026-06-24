import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Shield, CloudSun, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-tight"
          >
            Travel Brighter with <br />
            <span className="text-gradient">Multi-Agent AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            Experience the next generation of travel planning. Our intelligent agents collaborate to build, validate, and optimize your perfect journey.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <Link to="/create" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105">
              Plan Your Adventure <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Intelligence at Every Step</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Map, title: "Deep Research", text: "Research agents pull local attractions, restaurants, and hidden gems." },
              { icon: CloudSun, title: "Weather Aware", text: "Plans automatically adapt to real-time weather forecasts." },
              { icon: CreditCard, title: "Budget Optimized", text: "Intelligent breakdowns ensure your wallet stays happy." },
              { icon: Shield, title: "Safety Validated", text: "Evaluator agents check compatibility and safety scores." }
            ].map((f, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-sky-500/50 transition-all group">
                <f.icon className="text-sky-400 mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
