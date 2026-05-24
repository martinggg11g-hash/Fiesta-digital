import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ANIMATION_CATEGORIES } from "./config"; 

// URLS DE CADA ANIMACIÓN (Mapeo de fallbacks inteligentes para que nada viejo se rompa en producción)
export const LOTTIE_MAP = {
  envelope: "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie",
  cake: "https://lottie.host/4ca06831-d568-4cd6-9b2a-32ea586857f2/nec4jxiwSC.lottie",
  chest: "https://lottie.host/da469562-9122-4062-a1c2-6fd71b51f250/TltkNEXlQE.lottie",
  gift: "https://lottie.host/dd720199-18c7-434b-93a5-bc8da9f299a1/z4TZTEwNbS.lottie",
  rings: "https://lottie.host/80e309cc-3b32-475c-af7a-c80c05cd9c76/N3kKx5w2j7.lottie", // Anillos
  dove: "https://lottie.host/a61c4de4-7a31-4ec4-9b21-81f1cd1217e6/QYpIqWbJ3P.lottie", // Paloma
  flower: "https://lottie.host/3e8c9735-e106-4b68-8098-b807b1a03f47/6N2jQo9sXk.lottie", // Flor
  butterfly: "https://lottie.host/e2c347f8-cf90-4c3e-b83c-623e1f57e0b5/8kNjXpT3R2.lottie", // Mariposa
  mickey: "https://lottie.host/91e2b5d7-1354-41d3-a55e-04983f4f6e3c/W5j1kR3P2t.lottie" // Mickey
};

const TRANSITIONS = {
  "slide-up": "translate-y-full opacity-0",
  "slide-left": "translate-x-full opacity-0",
  "slide-right": "-translate-x-full opacity-0",
  "fade": "opacity-0",
  "zoom": "scale-50 opacity-0",
  "flip": "rotate-y-90 opacity-0",
  "bounce": "-translate-y-full opacity-0"
};

export const OpeningAnimation = ({ cfg, onOpen, isPreview = false, invName = "", isVip = false }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  // Si no hay configuración o la animación es 'none', abrir directo (skip)
  if (!cfg?.openingAnimation || cfg.openingAnimation === 'none') {
    onOpen();
    return null;
  }

  const handleOpen = () => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 700); // 700ms para que termine la transición CSS
  };

  // Buscar si la opción es personalizada por URL
  const isCustomUrl = cfg.openingAnimation.startsWith('http') || cfg.openingAnimation.startsWith('data:');
  const animKey = isCustomUrl ? cfg.openingAnimation : (LOTTIE_MAP[cfg.openingAnimation] || LOTTIE_MAP.envelope);

  let finalUrl = animKey;

  // Truco para preview: si nos pasan una URL custom y NO estamos en la animación predeterminada (envelope)
  // intentamos mapear si coincide con una de las categorías por ID.
  if (isPreview && !isCustomUrl && cfg.openingAnimation !== 'envelope') {
    const type = cfg.openingAnimation;
    const found = Object.values(ANIMATION_CATEGORIES).flat().find(a => a.id === type);
    if (found && found.url) {
      finalUrl = found.url;
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
          {/* 👉 ACÁ CORREGIMOS EL loop={false} PARA QUE SE ABRA UNA SOLA VEZ */}
          <DotLottieReact key={finalUrl} src={finalUrl} loop={false} autoplay />
        </div>
        
        {/* Agregamos el botón para abrir la invitación manualmente por si el usuario quiere saltear la animación */}
        <button 
          onClick={handleOpen}
          className={`
            mt-8 px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest
            bg-white text-slate-900 shadow-xl transition-all duration-300
            hover:scale-105 active:scale-95
            ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
          `}
        >
          Abrir Invitación
        </button>
      </div>
    </div>
  );
};

export const LottieOverlay = ({ url }) => {
  if (!url) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center z-0 overflow-hidden mix-blend-screen opacity-60">
       <DotLottieReact src={url} loop autoplay />
    </div>
  );
};
