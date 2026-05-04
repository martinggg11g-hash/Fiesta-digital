import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation } from "./Lotties"; 
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

import { DEF_CONFIG, THEMES, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY } from "./config";

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
      setTimeLeft({
        d: Math.floor(dist / 86400000),
        h: Math.floor((dist % 86400000) / 3600000),
        m: Math.floor((dist % 3600000) / 60000),
        s: Math.floor((dist % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if(!targetDate || isNaN(new Date(targetDate).getTime())) return null;
  const labels = { d:"días", h:"horas", m:"min", s:"seg" };

  return (
    <div className="py-4">
      {text && <p className="text-center text-xs font-bold mb-3 opacity-70" style={{ color: primary }}>{text}</p>}
      {expired ? (
        <p className="text-center font-black text-lg" style={{ color: primary }}>🎉 ¡El día llegó!</p>
      ) : (
        <div className="flex justify-center gap-3">
          {Object.entries(timeLeft).map(([unit, val]) => (
            <div key={unit} className="flex flex-col items-center gap-1">
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style={{ background: primary }}>
                {(val || 0).toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] font-bold opacity-60" style={{ color: primary }}>{labels[unit]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// CARRUSEL INTERACTIVO Y AUTOMÁTICO
const GalleryCarousel = ({ photos }) => {
  const [idx, setIdx] = useState(0);
  const valid = photos.filter(p => p);
  
  // EFECTO DE AUTO-PLAY (Cambia cada 3 segundos)
  useEffect(() => {
    if (valid.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev === valid.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [valid.length]);

  if(valid.length === 0) return null;
  if(valid.length === 1) return <img src={valid[0]} className="w-full h-64 rounded-2xl object-cover shadow-lg border border-white/5" alt="Galeria" />;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-white/5 group">
       <img src={valid[idx]} className="w-full h-full object-cover transition-opacity duration-500" alt={`Foto ${idx+1}`} />
       
       <button onClick={() => setIdx(idx === 0 ? valid.length - 1 : idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100">
         <ChevronLeft size={24} />
       </button>
       <button onClick={() => setIdx(idx === valid.length - 1 ? 0 : idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100">
         <ChevronRight size={24} />
       </button>
       
       <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
         {valid.map((_, i) => (
           <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
         ))}
       </div>
    </div>
  );
};

// MOTOR DE EFECTOS REPROGRAMADO (FUEGOS ARTIFICIALES / GLITTER)
const ParticleCanvas = ({ effect, primary }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (effect === "none" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    let observer;
    try {
      const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
      resize(); observer = new ResizeObserver(resize); observer.observe(canvas);
    } catch(e) { console.warn("ResizeObserver not supported"); }

    const EMOJI_MIX = ["🎉","🎊","🎈","✨","🌟","💖","🎂"];
    const PETALS = ["🌸","🌺","🌹","🌷"];

    const spawnParticle = () => {
      const isBubble = effect === "bubbles";
      
      const base = { 
        x: Math.random() * canvas.width, 
        y: isBubble ? canvas.height + 20 : -20, 
        vx: (Math.random() - 0.5) * 2, 
        vy: Math.random() * 2 + 1, 
        alpha: 1, rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 4, 
        size: Math.random() * 10 + 8, life: 1, decay: Math.random() * 0.003 + 0.002 
      };

      // CONFETI EXPLOSIVO (Física de cañón)
      if (effect === "confetti") {
        const colors = [primary, "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#facc15", "#ffffff"];
        return { 
          ...base, 
          x: canvas.width / 2 + (Math.random() - 0.5) * 250, // Sale desde el medio abajo
          y: canvas.height + 20, 
          vx: (Math.random() - 0.5) * 12, // Se abren como abanico
          vy: -(Math.random() * 15 + 12), // Salen disparados para arriba
          type: "rect", 
          color: colors[Math.floor(Math.random() * colors.length)], 
          w: Math.random()*12+6, h: Math.random()*6+3,
          rotV: (Math.random() - 0.5) * 25, // Rotan a toda velocidad
          life: 2 // Duran más para que lleguen a caer
        };
      }
      // GLITTER (Brillitos mágicos)
      if (effect === "glitter") {
        return { 
          ...base, 
          x: Math.random() * canvas.width, 
          y: Math.random() * canvas.height, 
          vx: (Math.random() - 0.5) * 0.4, // Se mueven apenas
          vy: (Math.random() - 0.5) * 0.4, 
          alpha: Math.random(), 
          alphaDir: Math.random() > 0.5 ? 1 : -1, // Suben o bajan de brillo
          type: "star", 
          color: ["#ffffff", "#fef08a", primary][Math.floor(Math.random()*3)], 
          size: Math.random() * 3 + 1.5 
        };
      }
      
      if (effect === "hearts")  return { ...base, type: "text", emoji: "❤️", size: Math.random()*18+10 };
      if (effect === "stars")   return { ...base, type: "text", emoji: "⭐", size: Math.random()*16+8 };
      if (effect === "bubbles") return { ...base, type: "circle", color: primary, filled: false, r: Math.random()*12+4, vx: (Math.random()-0.5)*1.5, vy: -(Math.random()*2+0.5) };
      if (effect === "snow")    return { ...base, type: "circle", color: "#ffffff", filled: true, r: Math.random()*3+1, vy: Math.random()*1.5+0.5, vx: (Math.random()-0.5)*0.8 };
      if (effect === "petals")  return { ...base, type: "text", emoji: PETALS[Math.floor(Math.random()*PETALS.length)], size: Math.random()*20+12 };
      if (effect === "emojis")  return { ...base, type: "text", emoji: EMOJI_MIX[Math.floor(Math.random()*EMOJI_MIX.length)], size: Math.random()*20+12 };
      return null;
    };

    let frame = 0;
    const loop = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      
      // Control de cantidad
      const maxParticles = effect === "glitter" ? 100 : (effect === "confetti" ? 80 : 50);
      const spawnFreq = effect === "confetti" ? 3 : 6; // Confeti sale más rápido
      const spawnCount = effect === "confetti" ? 2 : 1; // Confeti tira de a dos por frame (Fuente)

      if (frame % spawnFreq === 0 && particlesRef.current.length < maxParticles) {
        for(let i=0; i<spawnCount; i++){
          const p = spawnParticle(); if (p) particlesRef.current.push(p);
        }
      }
      
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + (p.rotV || 0); 
        
        // Físicas según efecto
        if (effect === "confetti") {
           p.vy += 0.45; // GRAVEDAD
           p.life -= 0.008; 
           p.alpha = Math.min(1, p.life);
        } else if (effect === "glitter") {
           // TINTINEO
           p.alpha += p.alphaDir * 0.02;
           if (p.alpha >= 1) p.alphaDir = -1;
           if (p.alpha <= 0.1) p.alphaDir = 1;
        } else {
           p.life -= p.decay; p.alpha = p.life;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        
        if (p.type === "rect") {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot || 0) * Math.PI/180);
          ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
        } else if (p.type === "circle") {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); 
          if (p.filled) { ctx.fillStyle = p.color; ctx.fill(); } 
          else { ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.stroke(); }
        } else if (p.type === "star") {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.fillStyle = p.color; ctx.shadowBlur = 8; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        } else if (p.type === "text") {
          ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot||0)*Math.PI/180); ctx.fillText(p.emoji, 0, 0); ctx.restore();
        }
        ctx.globalAlpha = 1;

        if (effect === "glitter") return true; 
        return p.life > 0 && p.y < canvas.height + 40; 
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { 
      if(animRef.current) cancelAnimationFrame(animRef.current); 
      if(observer && canvasRef.current) observer.unobserve(canvasRef.current); 
      particlesRef.current = []; 
    };
  }, [effect, primary]);

  if (effect === "none") return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ opacity: 0.85 }} />;
};

const MapEmbed = ({ name, address, primary }) => {
  const query = (address && address.trim() !== "") ? address : name;
  if (!query) return <div className="w-full h-32 bg-[#1a1a2e] rounded-xl flex items-center justify-center text-white/50 text-xs font-bold border border-white/10 text-center px-4">📍 Falta cargar la dirección en el Panel Maestro</div>;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=15&output=embed&iwloc=near`;
  
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: "#1a1a2e" }}>
      <iframe title="map" width="100%" height="200" style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={embedUrl} />
      <a href={`https://maps.google.com/?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 text-xs font-black uppercase tracking-wider transition-colors" style={{ background: `${primary}22`, color: primary }}>
        <MapPin size={14} /> Abrir en Google Maps
      </a>
    </div>
  );
};

const VenueCard = ({ cfg, primary, text, muted, card }) => {
  if (!cfg.showVenueLogo) return null;
  const href = cfg.venueLinkType === "whatsapp" ? `https://wa.me/${cfg.venueLink}` : cfg.venueLink;
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 no-underline transition-opacity hover:opacity-80" style={{ background: card }}>
      {cfg.venueLogoUrl ? (
        <img src={cfg.venueLogoUrl} alt="logo" className="w-14 h-14 rounded-xl object-contain border border-white/10 bg-white/5" />
      ) : (
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${primary}22` }}>🏠</div>
      )}
      <div className="text-left flex-1">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: muted }}>Lugar del evento</p>
        <p className="font-bold text-sm" style={{ color: text }}>{cfg.venueName || "Ver lugar"}</p>
        <p className="text-[10px] mt-0.5 font-bold" style={{ color: primary }}>
          {cfg.venueLinkType === "whatsapp" ? "📱 Consultar por WhatsApp" : "🌐 Ver sitio web"}
        </p>
      </div>
    </a>
  );
};

const VideoSection = ({ cfg, muted, card }) => {
  if (!cfg.showVideo || !cfg.videoUrl) return null;
  const ytId = getYouTubeId(cfg.videoUrl);
  
  return (
    <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: card }}>
      {cfg.videoTitle && (
        <p className="text-center text-[10px] font-black uppercase tracking-widest pt-4 pb-2" style={{ color: muted }}>{cfg.videoTitle}</p>
      )}
      {ytId ? (
        <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="block w-full"></iframe>
      ) : (
        <video src={cfg.videoUrl} controls playsInline className="w-full block" style={{ maxHeight: 300 }} />
      )}
    </div>
  );
};

export const InvitePreview = ({ cfg, status }) => {
  if (!cfg) return null;
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary;
  const bg = `linear-gradient(180deg, ${cfg.bg1 || th.bg1} 0%, ${cfg.bg2 || th.bg2} 100%)`;
  const textC = cfg.text || th.text;
  const mutedC = cfg.muted || th.muted;
  const cardC  = cfg.card  || th.card;
  
  const isCanceled = status === 'Cancelado'; 
  
  const gradOpacity = cfg.showCoverGradient === false ? 0 : ((cfg.coverGradientIntensity ?? 50) / 100).toFixed(2);
  
  const coverShadow = (cfg.coverTextShadowSize > 0) 
    ? `0px 4px ${cfg.coverTextShadowSize}px ${cfg.coverTextShadowColor || '#000000'}` 
    : 'none';

  const SectionTitle = ({ children }) => (
    <h4 className="font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC, fontSize: `${cfg.titlesSize ?? 10}px` }}>{children}</h4>
  );

  const InfoCard = ({ icon: Icon, label, value, sub, fontSize }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5" style={{ background: cardC }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}>
        <Icon size={20} color="white" />
      </div>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>{label}</p>
        <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${fontSize}px` }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{sub}</p>}
      </div>
    </div>
  );

  const waMsg = (cfg.whatsappMessage || "").replace('{nombre}', cfg.honoreeName || "");

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-12 relative overflow-x-hidden">
      
      {isCanceled && (
        <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md pb-32">
          <div className="border-4 border-red-600 bg-black/70 px-10 py-6 rounded-[2rem] transform -rotate-12 shadow-2xl shadow-red-600/30">
            <h2 className="text-4xl font-black text-red-500 tracking-widest uppercase m-0">CANCELADO</h2>
          </div>
          <p className="text-white mt-8 font-bold tracking-wide text-sm opacity-80 uppercase">El evento ha sido suspendido</p>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" style={{ height: "100%" }}>
        <ParticleCanvas effect={cfg.particleEffect || "none"} primary={primary} />
      </div>

      <div className="relative h-[420px] overflow-hidden">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1 || th.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-30">
          <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px`, fontFamily: cfg.eventTypeFont || cfg.fontBody, textShadow: coverShadow }}>
            {cfg.eventTypeEmoji} {cfg.eventType}
          </p>
          <h1 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle, color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px`, textShadow: coverShadow }} className="leading-tight mb-4">
            {cfg.honoreeName}
          </h1>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md bg-black/30 font-black" style={{ color: textC, fontSize: `${cfg.badgeSize ?? 14}px` }}>
            {cfg.badgeEmoji} {cfg.badgeText}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4">
        
        {cfg.showCountdown && cfg.countdownDate && (
          <div className="p-5 rounded-3xl border border-white/5" style={{ background: cardC, color: textC }}>
            <h3 className="text-center text-[11px] font-black uppercase tracking-widest opacity-80 mb-1" style={{ color: mutedC }}>Falta para el gran día</h3>
            <Countdown targetDate={cfg.countdownDate} primary={primary} />
          </div>
        )}

        {cfg.showBanner && (
          <div className="relative h-48 rounded-3xl overflow-hidden border-2" style={{ borderColor: `${primary}44` }}>
            <img src={cfg.bannerPhoto || DEF_CONFIG.bannerPhoto} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-white">{cfg.bannerTitle}</div>
          </div>
        )}

        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={formatToDDMMYYYY(cfg.dateText)} fontSize={cfg.dateSize ?? 18} />}
        
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} fontSize={cfg.dateSize ?? 18} />}
        {cfg.showTheme && <InfoCard icon={Star} label={cfg.themeLabel} value={`${cfg.themeIcon} ${cfg.themeText}`} fontSize={cfg.dateSize ?? 18} />}

        {cfg.showLocation && (
          <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: cardC }}>
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}>
                <MapPin size={20} color="white" />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>¿Dónde?</p>
                <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${cfg.locationSize ?? 18}px` }}>{cfg.locationName}</p>
                <p className="text-[11px] opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{cfg.locationAddress}</p>
              </div>
            </div>
            <div className="px-4 pb-2">
              <MapEmbed name={cfg.locationName} address={cfg.locationAddress} primary={primary} />
            </div>
            {cfg.showParking && (
              <div className="p-4 text-center border-t border-white/5">
                <span className="text-xs font-bold py-2 px-4 rounded-full inline-block" style={{ background: `${primary}22`, color: primary, fontFamily: cfg.fontBody }}>
                  🚗 {cfg.parkingType === 'otro' ? cfg.customParking : cfg.parkingType}
                </span>
              </div>
            )}
          </div>
        )}

        <VenueCard cfg={cfg} primary={primary} text={textC} muted={mutedC} card={cardC} />
        
        <VideoSection cfg={cfg} muted={mutedC} card={cardC} />

        {cfg.showMusic && cfg.spotifyUrl && (
          <div className="pt-4">
            <SectionTitle>Música para entrar en clima</SectionTitle>
            <iframe style={{ borderRadius: '12px' }} src={getSpotifyEmbed(cfg.spotifyUrl)} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        )}

        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <div className="pt-4">
            <SectionTitle>Programa del evento</SectionTitle>
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': `${primary}33` }}>
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: primary, opacity: 0.2 }} />
              {cfg.itinerary.map((item, i) => (
                <div key={i} className="relative text-left">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full" style={{ background: primary, boxShadow: `0 0 10px ${primary}` }} />
                  <p className="text-[10px] font-black mb-1" style={{ color: primary }}>{item.time}</p>
                  <p className="font-bold text-sm" style={{ color: textC, fontFamily: cfg.fontBody }}>{item.title}</p>
                  <p className="text-xs opacity-60" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {cfg.showMenu && cfg.menuItems?.length > 0 && (
          <div className="pt-4">
            <SectionTitle>¿Qué vamos a comer?</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.menuItems.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl text-center border border-white/5" style={{ background: cardC }}>
                  <span className="text-3xl block mb-2">{m.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: textC, fontFamily: cfg.fontBody }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(cfg.showDressCode || cfg.showGifts) && (
          <div className="pt-6">
            <SectionTitle>A tener en cuenta</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.showDressCode && (
                <div className="p-5 rounded-2xl text-center border border-white/5 shadow-sm" style={{ background: cardC }}>
                  <span className="text-3xl block mb-2">{cfg.dressCodeIcon}</span>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>Vestimenta</p>
                  <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.dressCodeText}</p>
                </div>
              )}
              {cfg.showGifts && (
                <div className="p-5 rounded-2xl text-center border border-white/5 shadow-sm" style={{ background: cardC }}>
                  <span className="text-3xl block mb-2">{cfg.giftIcon}</span>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>{cfg.giftLabel}</p>
                  <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.giftText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {cfg.showGifts && cfg.showGiftNote && cfg.giftNoteText && (
          <div className="text-center pt-2">
            <span className="inline-block py-3 px-6 rounded-3xl font-bold border whitespace-pre-wrap leading-relaxed shadow-sm" 
                  style={{ background: `${cfg.card}ee`, borderColor: `${primary}33`, color: cfg.giftNoteColor || primary, fontSize: `${cfg.giftNoteSize || 11}px`, fontFamily: cfg.fontBody }}>
              {cfg.giftNoteText}
            </span>
          </div>
        )}

        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-4">
            <SectionTitle>{cfg.galleryTitle}</SectionTitle>
            
            {cfg.galleryLayout === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {cfg.galleryPhotos.map((p, i) => p && (
                  <img key={i} src={p} className="w-full h-48 rounded-xl object-cover shadow-md border border-white/5" alt={`Galeria ${i}`} />
                ))}
              </div>
            ) : (
              <GalleryCarousel photos={cfg.galleryPhotos} />
            )}
          </div>
        )}

        <button 
          onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(waMsg)}`)}
          className="w-full py-5 mt-4 rounded-[1.5rem] font-black text-sm tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-transform active:scale-95 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)`, color: 'white', boxShadow: `0 15px 35px ${primary}44` }}
        >
          <CheckCircle2 size={20} /> CONFIRMAR ASISTENCIA
        </button>
        
        <p className="text-center text-[10px] font-bold opacity-50 mt-8 pb-4" style={{ color: mutedC }}>
          Invitación creada con <strong className="tracking-wide">defiesta.lat</strong>
        </p>
      </div>
    </div>
  );
};
