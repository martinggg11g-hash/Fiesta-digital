import React, { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Diccionario de animaciones Premium
const LOTTIE_MAP = {
  envelope: "https://lottie.host/79010496-e08b-4a5e-8557-0a4176378e90/4x9xLpSUnp.json", 
  chest: "https://lottie.host/2672eef6-88bc-4912-ab48-eb80aa0c1288/SPCECwdwgK.lottie", 
  soccer: "https://lottie.host/85002f23-389f-431a-8588-348128330f81/T6tU811z3I.lottie", 
  musicbox: "https://lottie.host/62e08e61-9c6a-4933-911b-85e68379207e/t5vR0ZtI7V.json", 
  gift: "https://lottie.host/93278564-96d5-45a7-96a8-f8648348630c/183xLpSUnp.json",
  amongus: "https://lottie.host/4d6d5ca1-2c8b-443a-a3e8-add97bfa7007/KxUqcK88DH.lottie", 
  tiger: "https://lottie.host/19d90dc5-4d0a-4693-af95-96f949c67386/iW4Roe7QD1.lottie"    
};

// Diccionario de transiciones de salida
const TRANSITIONS = {
  fade: "opacity-0",
  slideUp: "opacity-0 -translate-y-full",
  zoomOut: "opacity-0 scale-150 blur-xl",
  zoomIn: "opacity-0 scale-50 blur-md"
};

export const OpeningAnimation = ({ cfg, onOpen, isPreview = false }) => {
  const [opening, setOpening] = useState(false);
  const type = cfg?.openingAnimation || "envelope";
  
  // Si elige "Sin animación", ejecutamos la apertura directo y no renderizamos nada
  useEffect(() => {
    if (type === "none") {
      onOpen();
    }
  }, [type, onOpen]);

  if (type === "none") return null;

  const url = LOTTIE_MAP[type] || LOTTIE_MAP.envelope;
  const durationSecs = cfg?.animationDuration || 2; // Por defecto 2 segundos
  const transitionClass = TRANSITIONS[cfg?.animationTransition || 'fade'];

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Sonido mágico universal (puede fallar si el navegador lo bloquea, lo atrapamos)
    const audio = new Audio("https://actions.google.com/sounds/v1/magic/magic_chimes.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});

    // Usamos el tiempo elegido por el usuario para la transición
    setTimeout(() => {
      onOpen();
    }, durationSecs * 1000); 
  };

  return (
    <div 
      className={`
        ${isPreview ? 'absolute' : 'fixed'} inset-0 z-[100] 
        flex flex-col items-center justify-center 
        transition-all ease-in-out 
        ${opening ? transitionClass : 'opacity-100 bg-slate-950'}
      `}
      style={{ transitionDuration: `${durationSecs * 1000}ms` }}
    >
      {/* Overlay de color suave basado en el tema */}
      <div className="absolute inset-0 opacity-30" style={{ background: cfg?.primary || '#7c3aed' }} />
      
      {/* Al tocar en cualquier lado de la pantalla, se abre */}
      <div onClick={handleOpen} className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer group">
        <div className={`w-[320px] h-[320px] transition-all duration-700 ${opening ? 'scale-110' : 'group-hover:scale-105'}`}>
          <DotLottieReact
            src={url}
            loop={!opening}
            autoplay
            speed={2 / durationSecs} // Ajustamos un poco la velocidad del Lottie en base al tiempo
          />
        </div>
        {/* El texto "Tocar para abrir" fue removido a pedido tuyo para mayor elegancia */}
      </div>
    </div>
  );
};
