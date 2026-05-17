import React, { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ANIMATION_CATEGORIES } from "./config"; 

// URLS DE CADA ANIMACIÓN (Mapeo de fallbacks inteligentes para que nada viejo se rompa en producción)
export const LOTTIE_MAP = {
  envelope: "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie", // Jessica Rabbit
  cake: "https://lottie.host/4ca06831-d568-4cd6-9b2a-32ea586857f2/nec4jxiwSC.lottie", // Pastel
  chest: "https://lottie.host/da469562-9122-4062-a1c2-6fd71b51f250/TltkNEXlQE.lottie", // Regalo explosivo
  gift: "https://lottie.host/dd720199-18c7-434b-93a5-bc8da9f299a1/z4TZTEwNbS.lottie", // Ojos
  rings: "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie",
  dove: "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie",
  crown: "https://lottie.host/d8112081-66aa-4001-9a22-c4e1fc0b5551/JOr2rqdpCv.lottie",
  balloon: "https://lottie.host/8036e685-ae19-4783-870f-6a03f84113d4/C4CJJDF4zM.lottie",
  flower: "https://lottie.host/dd720199-18c7-434b-93a5-bc8da9f299a1/z4TZTEwNbS.lottie",
  butterfly: "https://lottie.host/dd720199-18c7-434b-93a5-bc8da9f299a1/z4TZTEwNbS.lottie",
  stars: "https://lottie.host/43af906f-7e7f-4f8c-b305-f86280e4f39a/oOwCUkBzz7.lottie",
  mickey: "https://lottie.host/da469562-9122-4062-a1c2-6fd71b51f250/TltkNEXlQE.lottie", // Regalo explosivo
  minnie: "https://lottie.host/28a64e1d-7e11-43f8-b339-54bd7fa7562f/Ad6KGTk3EL.lottie", // Asomando
  cars: "https://lottie.host/d27e41e2-ebc9-4c56-9baf-6be124d2618e/3d4UlzGIRS.lottie",
  cheers: "https://lottie.host/acee53c4-e205-4381-a8d6-6c81e546936e/FGryvHLT7G.lottie", 
  disco: "https://lottie.host/d8112081-66aa-4001-9a22-c4e1fc0b5551/JOr2rqdpCv.lottie"
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
