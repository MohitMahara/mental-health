import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const phaseConfig = {
  inhale: { duration: 4, label: 'Inhale', color: 'bg-emerald-400' },
  hold1: { duration: 4, label: 'Hold', color: 'bg-emerald-500' },
  exhale: { duration: 6, label: 'Exhale', color: 'bg-emerald-600' },
  hold2: { duration: 2, label: 'Hold', color: 'bg-emerald-500' }
};

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  const phases = ['inhale', 'hold1', 'exhale', 'hold2'];

  const getNextPhase = useCallback((phase) => {
    const currentIndex = phases.indexOf(phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    return phases[nextIndex];
  }, [phases]);

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
  };

  useEffect(() => {
    let interval;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      const nextPhase = getNextPhase(currentPhase);
      setCurrentPhase(nextPhase);
      setTimeRemaining(phaseConfig[nextPhase].duration);
      
      if (currentPhase === 'hold2') {
        setCycleCount(prev => prev + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentPhase, getNextPhase]);

  const circleScale = {
    inhale: 1.2,
    hold1: 1.2,
    exhale: 0.8,
    hold2: 0.8
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe in slowly through your nose';
      case 'hold1':
        return 'Hold your breath gently';
      case 'exhale':
        return 'Exhale slowly through your mouth';
      case 'hold2':
        return 'Rest before the next breath';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 h-fit hover:shadow-emerald-500/10 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-white mb-2">
          Breathing Exercise
        </h2>
        <p className="text-slate-300 text-sm">
          Follow the circle and find your rhythm
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <motion.div
            className={`w-32 h-32 rounded-full ${phaseConfig[currentPhase].color} shadow-2xl shadow-emerald-500/30`}
            animate={isActive ? {  scale: circleScale[currentPhase]} : {scale:1}}
            transition={{ 
              duration: phaseConfig[currentPhase].duration,
              ease: currentPhase === 'inhale' || currentPhase === 'exhale' ? 'easeInOut' : 'linear'
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-light">
            <div className="text-2xl font-medium mb-1">
              {timeRemaining}
            </div>
            <div className="text-sm opacity-90">
              {phaseConfig[currentPhase].label}
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 opacity-50"></div>
        </div>

        <div className="text-center mb-6">
          <div className="text-lg text-white font-medium mb-2">
            {phaseConfig[currentPhase].label} ({phaseConfig[currentPhase].duration}s)
          </div>
          <div className="text-sm text-slate-300 max-w-xs">
            {getInstructions()}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={resetExercise}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-400 transition-all duration-200 group"
          >
            <RotateCcw className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
          </button>
          
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
          >
            {isActive ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
          
          <div className="text-sm text-slate-300 font-medium">
            Cycle {cycleCount}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4 w-full border border-emerald-500/20 backdrop-blur-sm">
          <h4 className="text-sm font-semibold text-white mb-3 text-center">
            4-4-6-2 Breathing Pattern
          </h4>
          <div className="grid grid-cols-4 gap-3 text-xs">
            {phases.map((phase, index) => (
              <div 
                key={phase}
                className={`text-center p-2 rounded-lg transition-all border backdrop-blur-sm ${
                  currentPhase === phase 
                    ? 'bg-emerald-500/20 border-emerald-400/40 transform scale-105 shadow-sm shadow-emerald-400/20' 
                    : 'bg-slate-600/30 border-slate-500/30'
                }`}
              >
                <div className={`font-medium ${
                  currentPhase === phase ? 'text-emerald-300' : 'text-slate-200'
                }`}>
                  {phaseConfig[phase].label}
                </div>
                <div className={`${
                  currentPhase === phase ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {phaseConfig[phase].duration}s
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;