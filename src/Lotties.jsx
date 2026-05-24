import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ANIMATION_CATEGORIES } from "./config"; 

// Mapeo de transiciones a clases de Tailwind (coincide con TRANSITION_OPTS en config.js)
const TRANSITIONS = {
  "fade": "opacity-0",
  "slide-up": "opacity-0 -translate-y-full",
  "slide-left": "opacity-0 -translate-x-full",
  "slide-right": "opacity-0 translate-x-full",
  "zoom": "opacity-0 scale-50 blur-md",
  "flip": "opacity-0 rotate-y-90",
  "bounce": "opacity-0 translate-y-full"
};

export const OpeningAnimation = ({ cfg, onOpen, isPreview = false }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [animKey, setAnimKey] = useState(Date.now());
  
  // 👉 BARRERA CONTRA LOOPS INFINITOS DE REACT
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);
  
  const type = cfg?.openingAnimation || "none";
  
  useEffect(() => {
    if (type === "none") {
      if (onOpenRef.current) onOpenRef.current();
      return;
    }

    setIsExiting(false);
    setAnimKey(Date.now());

    const audio = new Audio("https://actions.google.com/sounds/v1/magic/magic_chimes.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});

    // 👉 LECTURA DEL SLIDER (Default 3 seg si no hay nada)
    const durationMs = (cfg?.animationDuration || 3) * 1000;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onOpenRef.current) onOpenRef.current(); 
      }, 800); 
    }, durationMs);

    return () => clearTimeout(exitTimer);
  }, [type, cfg?.animationDuration]);

  if (type === "none") return null;

  // 👉 LECTURA DINÁMICA DESDE CONFIG.JS
  // Fallback de seguridad en caso de que el ID guardado no se encuentre
  let finalUrl = "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie"; 
  
  for (const cat of Object.values(ANIMATION_CATEGORIES)) {
    const found = cat.find(a => a.id === type);
    if (found && found.url) {
      finalUrl = found.url;
      break;
    }
  }

  const transitionClass = TRANSITIONS[cfg?.animationTransition || 'fade'] || "opacity-0";

  return (
    <div 
      key={animKey}
      className={`
        ${isPreview ? 'absolute' : 'fixed'} inset-0 z-[100] 
        flex flex-col items-center justify-center 
        transition-all duration-700 ease-in-out 
        ${isExiting ? transitionClass : 'opacity-100 bg-slate-950'}
      `}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: cfg?.primary || '#7c3aed' }} />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className={`w-[320px] h-[320px] transition-transform duration-700 ${isExiting ? 'scale-110' : 'scale-100'}`}>
          <DotLottieReact key={finalUrl} src={finalUrl} loop={false} autoplay />
        </div>
      </div>
    </div>
  );
};

export const LottieOverlay = ({ url }) => {
  if (!url) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
      <DotLottieReact
        src={url}
        loop 
        autoplay
        className="w-full h-full opacity-80"
        style={{ objectFit: 'cover', objectPosition: 'top' }} 
      />
    </div>
  );
};
