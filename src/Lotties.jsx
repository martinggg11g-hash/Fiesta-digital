import React, { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ANIMATION_CATEGORIES } from "./config"; 

// URLS DE CADA ANIMACIÓN (Fallback para los viejos clientes + un par actualizados al nuevo estilo)
export const LOTTIE_MAP = {
  envelope: "https://lottie.host/79010496-e08b-4a5e-8557-0a4176378e90/4x9xLpSUnp.json", 
  chest: "https://lottie.host/2672eef6-88bc-4912-ab48-eb80aa0c1288/SPCECwdwgK.lottie", 
  soccer: "https://lottie.host/85002f23-389f-431a-8588-348128330f81/T6tU811z3I.lottie", 
  musicbox: "https://lottie.host/62e08e61-9c6a-4933-911b-85e68379207e/t5vR0ZtI7V.json", 
  gift: "https://lottie.host/93278564-96d5-45a7-96a8-f8648348630c/183xLpSUnp.json",
  amongus: "https://lottie.host/4d6d5ca1-2c8b-443a-a3e8-add97bfa7007/KxUqcK88DH.lottie", 
  tiger: "https://lottie.host/19d90dc5-4d0a-4693-af95-96f949c67386/iW4Roe7QD1.lottie",
  rings: "https://lottie.host/79010496-e08b-4a5e-8557-0a4176378e90/4x9xLpSUnp.json", 
  cheers: "https://lottie.host/acee53c4-e205-4381-a8d6-6c81e546936e/FGryvHLT7G.lottie", // 👉 Apuntado al nuevo brindis
  disco: "https://lottie.host/62e08e61-9c6a-4933-911b-85e68379207e/t5vR0ZtI7V.json" 
};

const TRANSITIONS = {
  fade: "opacity-0",
  slideUp: "opacity-0 -translate-y-full",
  zoomOut: "opacity-0 scale-150 blur-xl",
  zoomIn: "opacity-0 scale-50 blur-md"
};

export const OpeningAnimation = ({ cfg, onOpen, isPreview = false }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [animKey, setAnimKey] = useState(Date.now());
  
  const type = cfg?.openingAnimation || "envelope";
  
  useEffect(() => {
    if (type === "none") {
      if (onOpen) onOpen();
      return;
    }

    setIsExiting(false);
    setAnimKey(Date.now());

    // El sonidito mágico se queda igual
    const audio = new Audio("https://actions.google.com/sounds/v1/magic/magic_chimes.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});

    const durationMs = (cfg?.animationDuration || 2) * 1000;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onOpen) onOpen(); 
      }, 800); 
    }, durationMs);

    return () => clearTimeout(exitTimer);
  }, [type, cfg?.animationDuration, onOpen]);

  if (type === "none") return null;

  // Búsqueda del Lottie: Primero revisa si es uno nuevo de las categorías, si no, usa el fallback viejo.
  let finalUrl = LOTTIE_MAP[type] || LOTTIE_MAP.envelope; 
  for (const cat of Object.keys(ANIMATION_CATEGORIES)) {
    const found = ANIMATION_CATEGORIES[cat].find(a => a.id === type);
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
          <DotLottieReact key={finalUrl} src={finalUrl} loop={true} autoplay />
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
