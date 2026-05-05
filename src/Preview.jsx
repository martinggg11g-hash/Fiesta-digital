import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation } from "./Lotties"; 
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronLeft, ChevronRight, Download, MessageCircle, Users, ExternalLink } from "lucide-react";
import { DEF_CONFIG, THEMES, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY } from "./config";
import { IconRenderer } from "./EditorUI";

// ÍCONOS SOCIALES A PRUEBA DE FALLOS
const InstagramIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TiktokIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const CornerOrnament = ({ url, color, size, className, style }) => (
  <div className={className} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, WebkitMaskImage: `url("${url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: `url("${url}")`, maskSize: 'contain', maskRepeat: 'no-repeat', ...style }} />
);

const RenderSymbol = ({ value, size = 32, color = "currentColor", className = "" }) => {
  if (typeof value === 'string' && value.startsWith('icon-')) return <IconRenderer name={value} size={size} color={color} className={className} />;
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`flex items-center justify-center ${className}`}>{value}</span>;
}

// RESTO DE COMPONENTES (Countdown, Gallery, etc.) IGUAL...
const Countdown = ({ targetDate, primary, text }) => {
  const [timeLeft, setTimeLeft] = useState({ d:0, h:0, m:0, s:0 });
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if(!targetDate) return;
    const calc = () => {
      const target = new Date(targetDate).getTime();
      if (isNaN(target)) return;
      const dist = target - Date.now();
      if(dist <= 0) { setExpired(true); return; }
      setTimeLeft({ d: Math.floor(dist / 86400000), h: Math.floor((dist % 86400000) / 3600000), m: Math.floor((dist % 3600000) / 60000), s: Math.floor((dist % 60000) / 1000) });
    };
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id);
  }, [targetDate]);
  if(!targetDate || isNaN(new Date(targetDate).getTime())) return null;
  const labels = { d:"días", h:"horas", m:"min", s:"seg" };
  return (<div className="py-4">{text && <p className="text-center text-xs font-bold mb-3 opacity-70" style={{ color: primary }}>{text}</p>}{expired ? (<p className="text-center font-black text-lg" style={{ color: primary }}>🎉 ¡El día llegó!</p>) : (<div className="flex justify-center gap-3">{Object.entries(timeLeft).map(([unit, val]) => (<div key={unit} className="flex flex-col items-center gap-1"><div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style={{ background: primary }}>{(val || 0).toString().padStart(2, '0')}</div><span className="text-[10px] font-bold opacity-60" style={{ color: primary }}>{labels[unit]}</span></div>))}</div>)}</div>);
};

export const InvitePreview = ({ cfg, status, onConfirmRSVP }) => {
  if (!cfg) return null;
  const primary = cfg.primary || "#8b5cf6";
  const bg = `linear-gradient(180deg, ${cfg.bg1 || "#f8f7ff"} 0%, ${cfg.bg2 || "#e0dcfc"} 100%)`;
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-12 relative overflow-x-hidden">
      
      {/* ORNAMENTOS GLOBALES (Página Entera) */}
      {cfg.showCoverBorders && cfg.selectedBorder && (
        <>
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'top') && (
            <>
              <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} className="fixed top-0 left-0 z-[100] pointer-events-none" />
              <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} className="fixed top-0 right-0 z-[100] pointer-events-none" style={{ transform: 'scaleX(-1)' }} />
            </>
          )}
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'bottom') && (
            <>
               <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} className="fixed bottom-0 left-0 z-[100] pointer-events-none" style={{ transform: 'scaleY(-1)' }} />
               <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} className="fixed bottom-0 right-0 z-[100] pointer-events-none" style={{ transform: 'scaleX(-1) scaleY(-1)' }} />
            </>
          )}
        </>
      )}

      {/* CONTENIDO... */}
      <div className="relative h-[420px] overflow-hidden">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,0.5) 60%, transparent 100%)` }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-30">
          <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px` }}>
            <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />
            {cfg.eventType}
          </p>
          <h1 style={{ fontFamily: cfg.honoreeFont, color: cfg.honoreeColor, fontSize: `${cfg.honoreeSize}px` }}>{cfg.honoreeName}</h1>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4">
        {cfg.showCountdown && <div className="p-5 rounded-3xl" style={{ background: cardC }}><Countdown targetDate={cfg.countdownDate} primary={primary} /></div>}
        
        {cfg.showMenu && cfg.menuItems?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-center font-black uppercase tracking-widest mb-6" style={{ color: mutedC }}>{cfg.menuSectionTitle || "¿Qué vamos a comer?"}</h4>
            <div className="grid grid-cols-2 gap-3">{cfg.menuItems.map((m, i) => (<div key={i} className="p-4 rounded-2xl text-center" style={{ background: cardC }}><span className="mb-2 flex justify-center items-center h-10"><RenderSymbol value={cfg.usePremiumIcons ? 'icon-utensils' : m.emoji} size={32} color={primary} /></span><span className="text-xs font-bold" style={{ color: textC }}>{m.label}</span></div>))}</div>
          </div>
        )}
        {/* WIDGET RSV... */}
        <div className="pt-8"><RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} onConfirmRSVP={onConfirmRSVP} /></div>
      </div>
    </div>
  );
};
