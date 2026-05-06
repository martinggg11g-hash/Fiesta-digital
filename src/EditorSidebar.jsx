import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation } from "./Lotties"; 
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronLeft, ChevronRight, Download, MessageCircle, Users, ExternalLink } from "lucide-react";
import { DEF_CONFIG, THEMES, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY } from "./config";
import { IconRenderer } from "./EditorUI";

const InstagramIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TiktokIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

// RENDERIZADOR DE BORDES CON MASK-IMAGE
const CornerOrnament = ({ url, color, size, className, style }) => (
  <div
    className={`${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      WebkitMaskImage: `url("${url}")`,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskImage: `url("${url}")`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      ...style
    }}
  />
);

// MOTOR DE ARRASTRE
const DraggableItem = ({ id, cfg, update, children, className }) => {
  const pos = cfg[`${id}Pos`] || { x: 0, y: 0 };
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(pos);
  const dragRef = useRef(null);

  useEffect(() => { setLocalPos(cfg[`${id}Pos`] || { x: 0, y: 0 }); }, [cfg[`${id}Pos`]]);

  const onPointerDown = (e) => {
    if (!update) return; 
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, origX: localPos.x, origY: localPos.y };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = dragRef.current.origX + (clientX - dragRef.current.startX);
    const y = dragRef.current.origY + (clientY - dragRef.current.startY);
    setLocalPos({ x, y });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (update) update(`${id}Pos`, localPos);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("touchmove", onPointerMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
    }
    return () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, [isDragging, localPos]);

  return (
    <div 
      className={`group ${className || ''}`} 
      style={{ 
        transform: `translate(${localPos.x}px, ${localPos.y}px)`, 
        cursor: update ? (isDragging ? "grabbing" : "grab") : "default", 
        zIndex: isDragging ? 999 : 50, 
        touchAction: update ? 'none' : 'auto',
        position: 'absolute'
      }}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      {children}
      {update && (
        <div className={`absolute -inset-1 border-2 border-dashed border-violet-500 rounded-lg pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
      )}
    </div>
  );
};

const RenderSymbol = ({ value, size = 32, color = "currentColor", className = "" }) => {
  if (typeof value === 'string' && value.startsWith('icon-')) return <IconRenderer name={value} size={size} color={color} className={className} />;
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`flex items-center justify-center ${className}`}>{value}</span>;
}

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

const RsvpWidget = ({ cfg, primary, textC, cardC, onConfirmRSVP }) => {
  const [step, setStep] = useState('button');
  const [formData, setFormData] = useState({ name: '', lastname: '', guests: 1 });
  return (
    <button onClick={() => setStep('form')} className="w-full py-5 rounded-[1.5rem] font-black text-sm tracking-wider flex items-center justify-center gap-3 shadow-2xl" style={{ background: primary, color: 'white' }}>
      <Star size={20} /> OBTENER PASE VIP
    </button>
  );
};

export const InvitePreview = ({ cfg, status, update }) => {
  if (!cfg) return null;
  const primary = cfg.primary || "#8b5cf6";
  const bg = `linear-gradient(180deg, ${cfg.bg1 || "#f8f7ff"} 0%, ${cfg.bg2 || "#e0dcfc"} 100%)`;
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody, minHeight: '100%' }} className="pb-12 relative overflow-x-hidden flex flex-col">
      
      {/* BORDES ARRASTRABLES (AHORA SIEMPRE VISIBLES ARRIBA/ABAJO) */}
      {cfg.showCoverBorders && cfg.selectedBorder && (
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'top') && (
            <>
              <DraggableItem id="topLeftBorder" cfg={cfg} update={update} className="top-0 left-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} />
              </DraggableItem>
              <DraggableItem id="topRightBorder" cfg={cfg} update={update} className="top-0 right-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleX(-1)' }} />
              </DraggableItem>
            </>
          )}
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'bottom') && (
            <>
               <DraggableItem id="bottomLeftBorder" cfg={cfg} update={update} className="bottom-0 left-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleY(-1)' }} />
               </DraggableItem>
               <DraggableItem id="bottomRightBorder" cfg={cfg} update={update} className="bottom-0 right-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleX(-1) scaleY(-1)' }} />
               </DraggableItem>
            </>
          )}
        </div>
      )}

      {/* PORTADA */}
      <div className="relative h-[420px] overflow-hidden shrink-0">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,0.4) 60%, transparent 100%)` }} />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-30">
          <DraggableItem id="eventType" cfg={cfg} update={update} className="relative !static flex justify-center">
            <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px` }}>
              <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />
              {cfg.eventType}
            </p>
          </DraggableItem>
          
          <DraggableItem id="honoree" cfg={cfg} update={update} className="relative !static flex justify-center">
            <h1 style={{ fontFamily: cfg.honoreeFont, color: cfg.honoreeColor, fontSize: `${cfg.honoreeSize}px`, textAlign: 'center' }}>{cfg.honoreeName}</h1>
          </DraggableItem>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4 flex-1">
        {cfg.showCountdown && <div className="p-5 rounded-3xl" style={{ background: cardC }}><Countdown targetDate={cfg.countdownDate} primary={primary} /></div>}
        
        <div className="p-6 rounded-3xl" style={{ background: cardC }}>
          <h4 className="text-center font-black uppercase tracking-widest text-[10px] mb-4" style={{ color: mutedC }}>{cfg.menuSectionTitle || "¿Qué vamos a comer?"}</h4>
          <div className="grid grid-cols-2 gap-3">
             {cfg.menuItems?.map((m, i) => (
               <div key={i} className="text-center p-3 border border-slate-100 rounded-2xl">
                 <RenderSymbol value={cfg.usePremiumIcons ? 'icon-utensils' : m.emoji} size={28} color={primary} />
                 <p className="text-[10px] font-bold mt-2" style={{ color: textC }}>{m.label}</p>
               </div>
             ))}
          </div>
        </div>

        <RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} />
      </div>

      <p className="text-center text-[9px] font-bold opacity-40 mt-12 mb-6" style={{ color: mutedC }}>
        defiesta.lat
      </p>
    </div>
  );
};
