import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { travelApi } from '../services/api';
import { Search, Map, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Research Agent Active",
      description: `Gathering local context for ${formData?.destination || "your destination"} via Serper.dev (attractions, restaurants, events) and checking weather conditions...`,
      icon: Search,
      color: "text-sky-400 border-sky-500/30 bg-sky-500/10"
    },
    {
      id: 1,
      title: "Planner Agent Active",
      description: "Analyzing research data using Llama 3.3. Structuring daily routes, budget breakdown, weather-aware alternate plans, and movie suggestions...",
      icon: Map,
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    },
    {
      id: 2,
      title: "Evaluator Agent Active",
      description: "Reviewing itinerary quality, validating safety, auditing budget limits, checking for activity overlaps, and assigning final scores...",
      icon: Shield,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    },
    {
      id: 3,
      title: "Finalizing Dashboard",
      description: "Compiling multi-agent outputs, generating mapping coordinates, and preparing your intelligence dashboard...",
      icon: CheckCircle,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
    }
  ];

  useEffect(() => {
    if (!formData) {
      navigate('/create');
      return;
    }

    let progressTimer;
    // We simulate step transitions while the API call is in flight.
    // If the API finishes fast, it will skip to the end.
    const startStepSimulation = () => {
      progressTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < 2) return prev + 1;
          return prev;
        });
      }, 5000); // 5 seconds per major agent block
    };

    const triggerGeneration = async () => {
      try {
        startStepSimulation();
        
        // 1. Generate trip using LangGraph flow
        const response = await travelApi.generateTrip(formData);
        
        // Advance to step 3 once generation is done
        setCurrentStep(3);
        
        // 2. Auto-save the trip to MongoDB
        const saveResponse = await travelApi.saveTrip(response.data);
        
        // Wait a short moment to show step 4 completion, then navigate
        setTimeout(() => {
          navigate(`/dashboard/${saveResponse.data.id}`);
        }, 1500);

      } catch (error) {
        console.error("Multi-agent planning failed:", error);
        alert("Error executing multi-agent planning. Please check console or try again.");
        navigate('/create');
      }
    };

    triggerGeneration();

    return () => {
      clearInterval(progressTimer);
    };
  }, [formData, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="mb-12 relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
        <Loader2 className="animate-pulse text-sky-400" size={40} />
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-center">Navora Collaboration Engine</h1>
      <p className="text-slate-500 text-sm mb-12 text-center">Multiple specialized agents are planning your trip in real time</p>

      <div className="w-full space-y-6">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.4, y: 10 }}
              animate={{ 
                opacity: isActive ? 1 : isCompleted ? 0.7 : 0.3,
                scale: isActive ? 1.02 : 1,
                y: 0 
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-5 p-6 rounded-2xl border transition-all ${
                isActive ? 'glass border-white/20 shadow-xl' : 'bg-slate-900/10 border-white/5'
              }`}
            >
              <div className={`p-3 rounded-xl border flex-shrink-0 ${step.color}`}>
                <StepIcon size={22} className={isActive ? "animate-pulse" : ""} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-200">{step.title}</h3>
                  {isCompleted && (
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Completed</span>
                  )}
                  {isActive && (
                    <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider animate-pulse">Processing...</span>
                  )}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;
