import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ANIMATION_CATEGORIES } from "./config"; 

// URLS DE CADA ANIMACIÓN CON ENLACES ÚNICOS (Mapeo corregido)
export const LOTTIE_MAP = {
  envelope: "https://lottie.host/76b80717-c64a-474b-b5dc-9853881dac0b/B0nOPSiMVc.lottie", // Jessica Rabbit
  cake: "https://lottie.host/4ca06831-d568-4cd6-9b2a-32ea586857f2/nec4jxiwSC.lottie", // Pastel
  chest: "https://lottie.host/da469562-9122-4062-a1c2-6fd71b51f250/TltkNEXlQE.lottie", // Regalo explosivo
  gift: "https://lottie.host/dd720199-18c7-434b-93a5-bc8da9f299a1/z4TZTEwNbS.lottie", // Ojos
  rings: "https://lottie.host/80e309cc-3b32-475c-af7a-c80c05cd9c76/N3kKx5w2j7.lottie", // Anillos
  dove: "https://lottie.host/a61c4de4-7a31-4ec4-9b21-81f1cd1217e6/QYpIqWbJ3P.lottie", // Paloma
  crown: "https://lottie.host/d8112081-66aa-4001-9a22-c4e1fc0b5551/JOr2rqdpCv.lottie", // Corona
  balloon: "https://lottie.host/8036e685-ae19-4783-870f-6a03f84113d4/C4CJJDF4zM.lottie", // Globo
  flower: "https://lottie.host/3e8c9735-e106-4b68-8098-b807b1a03f47/6N2jQo9sXk.lottie", // Flor
  butterfly: "https://lottie.host/e2c347f8-cf90-4c3e-b83c-623e1f57e0b5/8kNjXpT3R2.lottie", // Mariposa
  stars: "https://lottie.host/43af906f-7e7f-4f8c-b305-f86280e4f39a/oOwCUkBzz7.lottie", // Estrellas
  mickey: "https://lottie.host/91e2b5d7-1354-41d3-a55e-04983f4f6e3c/W5j1kR3P2t.lottie", // Mickey
  minnie: "https://lottie.host/28a64e1d-7e11-43f8-b339-54bd7fa7562f/Ad6KGTk3EL.lottie", // Minnie Asomando
  cars: "https://lottie.host/d27e41e2-ebc9-4c56-9baf-6be124d2618e/3d4UlzGIRS.lottie", // Cars
  cheers: "https://lottie.host/acee53c4-e205-4381-a8d6-6c81e546936e/FGryvHLT7G.lottie", // Brindis
  disco: "https://lottie.host/57a7d4d8-795a-493e-af4c-4e894676bebb/EIf4Lw3T5C.lottie" // Bola de Disco
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
  
  // 👉 BARRERA CONTRA LOOPS INFINITOS DE REACT
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);
  
  const type = cfg?.openingAnimation || "envelope";
  
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

  let finalUrl = LOTTIE_MAP[type] || LOTTIE_MAP.envelope; 
  if (ANIMATION_CATEGORIES) {
    for (const cat of Object.keys(ANIMATION_CATEGORIES)) {
      const found = ANIMATION_CATEGORIES[cat]?.find(a => a.id === type);
      if (found && found.url) {
        finalUrl = found.url;
        break;
      }
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
