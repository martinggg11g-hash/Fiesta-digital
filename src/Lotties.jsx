import React, { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Diccionario de animaciones Premium actualizadas
const LOTTIE_MAP = {
  envelope: "https://lottie.host/79010496-e08b-4a5e-8557-0a4176378e90/4x9xLpSUnp.json", 
  chest: "https://lottie.host/2672eef6-88bc-4912-ab48-eb80aa0c1288/SPCECwdwgK.lottie", // Cofre actualizado
  soccer: "https://lottie.host/85002f23-389f-431a-8588-348128330f81/T6tU811z3I.lottie", 
  musicbox: "https://lottie.host/62e08e61-9c6a-4933-911b-85e68379207e/t5vR0ZtI7V.json", 
  gift: "https://lottie.host/93278564-96d5-45a7-96a8-f8648348630c/183xLpSUnp.json",
  amongus: "https://lottie.host/4d6d5ca1-2c8b-443a-a3e8-add97bfa7007/KxUqcK88DH.lottie", // Nuevo Among Us
  tiger: "https://lottie.host/19d90dc5-4d0a-4693-af95-96f949c67386/iW4Roe7QD1.lottie"    // Nuevo Tigre
};

export const OpeningAnimation = ({ cfg, onOpen, isPreview = false }) => {
  const [opening, setOpening] = useState(false);
  const type = cfg?.openingAnimation || "envelope";
  const url = LOTTIE_MAP[type] || LOTTIE_MAP.envelope;

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Sonido mágico universal
    const audio = new Audio("https://actions.google.com/sounds/v1/magic/magic_chimes.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});

    // Tiempo para que termine la animación antes de mostrar la invitación
    setTimeout(() => {
      onOpen();
    }, 2200); 
  };

  return (
    <div className={`
      ${isPreview ? 'absolute' : 'fixed'} inset-0 z-[100] 
      flex flex-col items-center justify-center 
      transition-all duration-1000 
      ${opening ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-slate-950'}
    `}>
      {/* Overlay de color suave basado en el tema */}
      <div className="absolute inset-0 opacity-30" style={{ background: cfg?.primary || '#7c3aed' }} />
      
      <div onClick={handleOpen} className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer group">
        <div className={`w-[320px] h-[320px] transition-all duration-700 ${opening ? 'scale-150 blur-xl' : 'group-hover:scale-110'}`}>
          <DotLottieReact
            src={url}
            loop={!opening}
            autoplay
          />
        </div>
        {!opening && (
          <p className="mt-8 text-white text-[10px] font-black tracking-[0.4em] uppercase opacity-50 animate-pulse">
            Tocar para abrir
          </p>
        )}
      </div>
    </div>
  );
};
