import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation, LottieOverlay } from "./Lotties"; 
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronLeft, ChevronRight, Download, MessageCircle, Users, ExternalLink, Loader2, Camera, Lock, ImageIcon } from "lucide-react";
import { DEF_CONFIG, THEMES, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY, PARTICLE_CATEGORIES } from "./config";
import { IconRenderer } from "./EditorUI";

const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

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
  <div className={className} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, WebkitMaskImage: `url("${url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url("${url}")`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', ...style }} />
);

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
    let x = dragRef.current.origX + (clientX - dragRef.current.startX);
    let y = dragRef.current.origY + (clientY - dragRef.current.startY);
    
    // 👉 ACÁ ESTÁ EL LÍMITE: No dejamos que se mueva más de 120px para que no salga de la pantalla
    x = Math.max(-120, Math.min(x, 120));
    y = Math.max(-120, Math.min(y, 120));
    
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
    <div className={`group ${className || ''}`} style={{ transform: `translate(${localPos.x}px, ${localPos.y}px)`, cursor: update ? (isDragging ? "grabbing" : "grab") : "default", zIndex: isDragging ? 999 : 50, touchAction: update ? 'none' : 'auto', position: 'absolute' }} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
      {children}
      {update && (<div className={`absolute -inset-1 border-2 border-dashed border-violet-500 rounded-lg pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />)}
    </div>
  );
};

const RenderSymbol = ({ value, size = 32, color = "currentColor", className = "" }) => {
  const isIcon = typeof value === 'string' && value.startsWith('icon-');
  return (
    <span style={{ fontSize: `${size}px`, color: color, lineHeight: 1 }} className={`shrink-0 inline-flex items-center justify-center ${className}`}>
      {isIcon ? <IconRenderer name={value} size="1em" color={color} /> : value}
    </span>
  );
};

const Countdown = ({ targetDate, primary, text, cfg, cardC }) => {
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
  
  return (
    <div className="py-4 relative z-10">
      {text && <p className="text-center text-xs font-black uppercase tracking-widest mb-4 opacity-80" style={{ color: primary }}>{text}</p>}
      {expired ? (
        <p className="text-center font-black text-lg" style={{ color: primary }}>🎉 ¡El día llegó!</p>
      ) : (
        <div className="flex justify-center gap-3">
          {Object.entries(timeLeft).map(([unit, val]) => (
            <div key={unit} className="flex flex-col items-center gap-1">
              <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center text-xl font-black shadow-lg relative overflow-hidden border" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                {cfg.shine && <div className="absolute inset-0 pointer-events-none" style={{ background: cfg.shine }}></div>}
                <span className="relative z-10">{(val || 0).toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest" style={{ color: primary }}>{labels[unit]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GalleryCarousel = ({ photos }) => {
  const [idx, setIdx] = useState(0);
  const valid = photos.filter(p => p);
  useEffect(() => {
    if (valid.length <= 1) return;
    const timer = setInterval(() => setIdx(p => (p === valid.length - 1 ? 0 : p + 1)), 3000);
    return () => clearInterval(timer);
  }, [valid.length]);

  if(valid.length === 0) return null;
  if(valid.length === 1) return <img src={valid[0]} className="w-full h-64 rounded-2xl object-cover shadow-lg border border-white/10" alt="Galeria" />;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-white/10 group">
       <img src={valid[idx]} className="w-full h-full object-cover transition-opacity duration-500" alt={`Foto ${idx+1}`} />
       <button onClick={() => setIdx(idx === 0 ? valid.length - 1 : idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronLeft size={24} /></button>
       <button onClick={() => setIdx(idx === valid.length - 1 ? 0 : idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronRight size={24} /></button>
       <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
         {valid.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/40'}`} />)}
       </div>
    </div>
  );
};

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
    } catch(e) { }

    const spawnParticle = () => {
      const base = { 
        x: Math.random() * canvas.width, 
        y: -20, 
        vx: (Math.random() - 0.5) * 2, 
        vy: Math.random() * 2 + 1, 
        alpha: 1, 
        rot: Math.random() * 360, 
        rotV: (Math.random() - 0.5) * 4, 
        size: Math.random() * 10 + 8, 
        life: 1, 
        decay: Math.random() * 0.005 + 0.002 
      };

      if (effect.startsWith("confetti")) {
        let colors = [primary, "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#ffffff"];
        if (effect === "confetti-gold") colors = ["#fbbf24", "#f59e0b", "#d97706", "#fef3c7"];
        if (effect === "confetti-silver") colors = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#f8fafc"];
        return { ...base, y: -50, vy: Math.random() * 3 + 2, type: "rect", color: colors[Math.floor(Math.random() * colors.length)], w: Math.random()*12+6, h: Math.random()*6+3, rotV: (Math.random() - 0.5) * 15, life: 2 };
      }

      if (effect === "balloons") return { ...base, y: canvas.height + 50, vy: -(Math.random() * 2 + 1), type: "text", emoji: "🎈", size: Math.random()*30+20 };

      if (effect.startsWith("stars") || effect === "meteor-shower" || effect === "fairy-dust" || effect === "galaxy-dust") {
        let c = "#ffffff";
        if (effect === "stars-gold" || effect === "fairy-dust") c = "#fbbf24";
        if (effect === "galaxy-dust") c = "#a855f7";
        if (effect === "meteor-shower") return { ...base, x: Math.random() * canvas.width * 1.5, y: -50, vx: -5, vy: 5, type: "star", color: c, size: Math.random() * 3 + 1, alphaDir: 0 }; 
        return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2, type: "star", color: c, size: Math.random() * 3 + 1, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1 };
      }

      if (effect === "glowing-orbs" || effect === "bokeh") {
        return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5, type: "circle", color: effect === "bokeh" ? ["#f472b6", "#fbbf24", "#60a5fa"][Math.floor(Math.random()*3)] : primary, filled: true, r: Math.random()*20+5, alpha: Math.random()*0.5, alphaDir: Math.random() > 0.5 ? 1 : -1 };
      }

      if (effect.startsWith("hearts") || effect === "floating-kisses") {
        let e = "❤️";
        if (effect === "hearts-pink") e = "💖";
        if (effect === "hearts-white") e = "🤍";
        if (effect === "floating-kisses") e = "💋";
        return { ...base, type: "text", emoji: e, size: Math.random()*18+10, vy: -(Math.random()*2+1), y: canvas.height+20 };
      }

      if (effect.startsWith("snow")) return { ...base, type: "circle", color: "#ffffff", filled: true, r: Math.random()*3+1, vy: effect==="snow-blizzard" ? Math.random()*4+2 : Math.random()*1.5+0.5, vx: effect==="snow-blizzard" ? Math.random()*3+1 : (Math.random()-0.5)*0.8 };
      if (effect === "sakura" || effect === "rose-petals") return { ...base, type: "text", emoji: effect==="sakura"?"🌸":"🌹", size: Math.random()*15+10, vy: Math.random()*2+1, rotV: Math.random()*5 };
      if (effect === "autumn-leaves") return { ...base, type: "text", emoji: "🍂", size: Math.random()*15+10, vy: Math.random()*2+1, rotV: Math.random()*5 };
      if (effect === "fireflies") return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, type: "circle", color: "#bef264", filled: true, r: Math.random()*2+1, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1, vy: (Math.random()-0.5)*1.5, vx: (Math.random()-0.5)*1.5 };
      if (effect === "butterflies") return { ...base, type: "text", emoji: "🦋", size: Math.random()*15+10, vy: -(Math.random()*2+1), vx: (Math.random()-0.5)*3, y: canvas.height+20 };
      if (effect === "rain") return { ...base, type: "rect", color: "#60a5fa", w: 1, h: Math.random()*15+10, vy: Math.random()*8+5, vx: 0 };

      if (effect.startsWith("glitter")) {
        return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1, type: "star", color: effect==="glitter-gold" ? "#fbbf24" : ["#ffffff", "#fef08a", primary][Math.floor(Math.random()*3)], size: Math.random() * 3 + 1.5 };
      }

      if (effect.startsWith("bubbles")) return { ...base, type: "circle", color: effect==="bubbles-color" ? ["#f472b6", "#60a5fa", "#fbbf24"][Math.floor(Math.random()*3)] : primary, filled: false, r: Math.random()*12+4, vx: (Math.random()-0.5)*1.5, vy: -(Math.random()*2+0.5), y: canvas.height+20 };
      if (effect === "floating-diamonds") return { ...base, type: "text", emoji: "💎", size: Math.random()*15+10, vy: -(Math.random()*2+1), y: canvas.height+20 };

      if (effect.startsWith("emojis") || effect === "streamers") {
        let list = ["🎉","🎊","🎈","✨","🌟","💖","🎂"];
        if (effect === "emojis-love") list = ["😍","🥰","😘","❤️","💕"];
        if (effect === "emojis-music") list = ["🎵","🎶","🎤","🎧","🎸"];
        if (effect === "streamers") list = ["🎊"];
        return { ...base, type: "text", emoji: list[Math.floor(Math.random()*list.length)], size: Math.random()*20+12 };
      }

      return null;
    };

    let frame = 0;
    const loop = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      
      const maxParticles = effect.includes("blizzard") || effect.includes("rain") ? 150 : (effect.includes("glitter") || effect.includes("stars") || effect.includes("dust") ? 80 : 40);
      
      if (frame % (effect.includes("confetti") ? 3 : 6) === 0 && particlesRef.current.length < maxParticles) {
        const p = spawnParticle(); if (p) particlesRef.current.push(p);
      }
      
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + (p.rotV || 0); 
        
        if (p.alphaDir) {
          p.alpha += p.alphaDir * 0.02;
          if (p.alpha >= 1) { p.alpha = 1; p.alphaDir = -1; }
          if (p.alpha <= 0) { p.alpha = 0; p.alphaDir = 1; p.x = Math.random()*canvas.width; p.y = Math.random()*canvas.height; }
        } else {
          if (effect.startsWith("confetti")) p.life -= 0.005; else p.life -= p.decay;
          p.alpha = Math.max(0, Math.min(1, p.life));
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        
        if (p.type === "rect") { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot || 0) * Math.PI/180); ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore(); } 
        else if (p.type === "circle") { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); if (p.filled) { ctx.fillStyle = p.color; ctx.fill(); } else { ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.stroke(); } } 
        else if (p.type === "star") { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color; ctx.shadowBlur = 8; ctx.shadowColor = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore(); } 
        else if (p.type === "text") { ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot||0)*Math.PI/180); ctx.fillText(p.emoji, 0, 0); ctx.restore(); }
        
        ctx.globalAlpha = 1;
        
        if (p.alphaDir) return true; 
        if (p.vy < 0) return p.y > -50; 
        return p.y < canvas.height + 50 && p.x > -50 && p.x < canvas.width + 50; 
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); if(observer && canvasRef.current) observer.unobserve(canvasRef.current); particlesRef.current = []; };
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

// ==========================================
// RSVP WIDGET
// ==========================================
const RsvpWidget = ({ cfg, primary, textC, cardC, mutedC, onConfirmRSVP, guestData, glassStyle, shineOverlay }) => {
  const [step, setStep] = useState('button');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', lastname: '', guests: 1 });
  const [ticketImage, setTicketImage] = useState('');
  const [localConfirmed, setLocalConfirmed] = useState(false);
  const [companions, setCompanions] = useState(0);

  const isPrivate = cfg.isPrivateList || false;
  const isConfirmed = localConfirmed || guestData?.asistencia_confirmada;
  const guestName = guestData?.nombre_completo || "Nombre del Invitado";
  const ticketId = guestData?.id || "VIP-MOCK-1234";
  const maxLimit = guestData ? guestData.max_acompanantes : (cfg.maxGuestsPerFamily || 5);

  if (isPrivate) {
    return (
      <div className="pt-8 text-center">
        {cfg.showRsvpDeadline && cfg.rsvpDeadline && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-4" style={{ color: mutedC }}>
            Confirmar antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}
          </p>
        )}
        
        <div className="p-6 rounded-[2rem] mb-4 relative overflow-hidden text-center flex flex-col items-center" style={glassStyle}>
           {shineOverlay}
           <div className="absolute top-0 left-0 right-0 py-1.5 z-10" style={{ background: cfg.accent || primary }}>
             <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: cardC === '#000000' ? '#000' : '#fff' }}>Tu Pase Nominal</p>
           </div>
           <div className="relative z-10 w-full flex flex-col items-center mt-6">
             <img src={`https://quickchart.io/qr?text=${ticketId}&size=300`} className="w-full max-w-[160px] rounded-xl shadow-lg mb-3 border border-white/20" alt="QR VIP" />
             <p className="text-sm font-black uppercase tracking-widest mt-2" style={{ color: textC }}>{guestName}</p>
             {guestData?.apodo && <p className="text-[10px] font-bold opacity-60 mt-1" style={{ color: textC }}>"{guestData.apodo}"</p>}
             <p className="text-[10px] font-bold opacity-40 mt-3" style={{ color: textC }}>Pase Intransferible</p>
           </div>
        </div>

        {isConfirmed ? (
          <div className="w-full py-5 rounded-[2rem] font-black shadow-lg text-white uppercase tracking-widest flex items-center justify-center gap-2 border border-green-400" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
            <CheckCircle2 size={20} /> ASISTENCIA CONFIRMADA
          </div>
        ) : (
          <>
            {maxLimit > 0 && (
              <div className="flex items-center justify-between px-5 py-4 rounded-[1.5rem] mb-4 border relative overflow-hidden" style={{ background: `${textC}0d`, borderColor: `${textC}1a` }}>
                {shineOverlay}
                <span className="text-xs font-bold flex items-center gap-2 relative z-10" style={{ color: textC }}><Users size={16}/> Acompañantes extras</span>
                <div className="flex items-center gap-3 relative z-10">
                  <button type="button" onClick={() => setCompanions(Math.max(0, companions - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>-</button>
                  <span className="font-black w-4 text-center" style={{ color: textC }}>{companions}</span>
                  <button type="button" onClick={() => setCompanions(Math.min(maxLimit, companions + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>+</button>
                </div>
              </div>
            )}
            <button 
              onClick={async () => {
                setLoading(true);
                if (onConfirmRSVP) await onConfirmRSVP({ guests: companions });
                setLocalConfirmed(true);
                setLoading(false);
              }} 
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-5 rounded-[2rem] font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest relative overflow-hidden" 
              style={{ background: cfg.accent || primary, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            >
              {shineOverlay}
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />} 
                {loading ? "CONFIRMANDO..." : "CONFIRMAR ASISTENCIA"}
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  // Lista Abierta
  const generateTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    const ticketId = `VIP-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
    const qrUrl = `https://quickchart.io/qr?text=${ticketId}&size=300`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 900;
      const ctx = canvas.getContext('2d');
      const grd = ctx.createLinearGradient(0,0,0,900);
      grd.addColorStop(0, primary); grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd; ctx.fillRect(0,0,600,900);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = 'bold 30px sans-serif'; ctx.fillText("PASE VIP", 300, 80);
      ctx.font = 'bold 60px serif'; ctx.fillText(cfg.honoreeName || "Fiesta", 300, 180);
      ctx.fillStyle = '#fff'; ctx.fillRect(150, 250, 300, 300);
      ctx.drawImage(img, 160, 260, 280, 280);
      const guestNameOpen = `${formData.name} ${formData.lastname}`.toUpperCase();
      ctx.font = 'bold 40px sans-serif'; ctx.fillText(guestNameOpen, 300, 650);
      ctx.font = '30px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`Válido para: ${formData.guests} ${formData.guests === 1 ? 'persona' : 'personas'}`, 300, 710);
      setTicketImage(canvas.toDataURL('image/jpeg'));
      if(onConfirmRSVP) onConfirmRSVP({...formData, isPrivate, id: ticketId});
      setLoading(false); setStep('qr');
    };
    img.src = qrUrl;
  };

  if (step === 'button') {
    return (
      <div className="pt-8 text-center">
        {cfg.showRsvpDeadline && cfg.rsvpDeadline && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-4" style={{ color: mutedC }}>
            Confirmar antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}
          </p>
        )}
        <button onClick={() => setStep('form')} className="w-full py-5 rounded-[2rem] font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest relative overflow-hidden" style={{ background: cfg.accent || primary }}>
          {shineOverlay}
          <span className="relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>OBTENER PASE VIP</span>
        </button>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="pt-8">
        <form onSubmit={generateTicket} className="p-6 rounded-[2rem] space-y-4 text-left relative overflow-hidden" style={glassStyle}>
          {shineOverlay}
          <div className="relative z-10 space-y-4">
            <input type="text" placeholder="Tu Nombre" className="w-full p-4 rounded-xl outline-none font-bold placeholder-opacity-50" style={{ background: `${textC}0d`, color: textC, border: `1px solid ${textC}1a` }} onChange={e=>setFormData({...formData, name: e.target.value})} required />
            <input type="text" placeholder="Tu Apellido" className="w-full p-4 rounded-xl outline-none font-bold placeholder-opacity-50" style={{ background: `${textC}0d`, color: textC, border: `1px solid ${textC}1a` }} onChange={e=>setFormData({...formData, lastname: e.target.value})} required />
            
            <div className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ background: `${textC}0d`, borderColor: `${textC}1a` }}>
              <span className="text-xs font-bold flex items-center gap-2" style={{ color: textC }}><Users size={16}/> Extras</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>-</button>
                <span className="font-black w-4 text-center" style={{ color: textC }}>{formData.guests}</span>
                <button type="button" onClick={() => setFormData({...formData, guests: Math.min(cfg.maxGuestsPerFamily || 5, formData.guests + 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>+</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 font-black rounded-[1.5rem] uppercase tracking-widest mt-2 shadow-lg transition-transform active:scale-95 border border-white/20" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff' }}>
              {loading ? 'Procesando...' : 'GENERAR PASE'}
            </button>
            <button type="button" onClick={() => setStep('button')} className="w-full mt-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity" style={{ color: textC }}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="text-center p-6 rounded-[2rem] relative overflow-hidden" style={glassStyle}>
        {shineOverlay}
        <div className="relative z-10 flex flex-col items-center">
          <img src={ticketImage} className="w-full max-w-[200px] rounded-2xl shadow-2xl mb-5 border-2 border-white/20" alt="Pase VIP" />
          <a href={ticketImage} download="Pase_VIP.jpg" className="block w-full py-4 text-white font-black rounded-xl mb-3 shadow-lg uppercase tracking-widest border border-green-400" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>DESCARGAR IMAGEN</a>
          <button type="button" onClick={()=>setStep('button')} className="text-xs font-bold uppercase tracking-widest" style={{ color: textC }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, sub, fontSize, primary, textC, mutedC, cardC, cfg, glassStyle, shineOverlay }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[2rem] relative overflow-hidden" style={glassStyle}>
      {shineOverlay}
      <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 relative z-10 shadow-sm border border-white/20" style={{ background: cfg.accent || primary }}><Icon size={24} color={cardC === '#000000' ? '#000' : '#fff'} /></div>
      <div className="text-left relative z-10">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5 opacity-80" style={{ color: mutedC }}>{label}</p>
        <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${fontSize}px` }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 font-medium opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{sub}</p>}
      </div>
    </div>
  );
};

const SectionTitle = ({ children, mutedC, size, font }) => (
  <h4 className="font-black uppercase tracking-[0.3em] text-center mb-6 opacity-80" style={{ color: mutedC, fontSize: `${size ?? 10}px`, fontFamily: font }}>{children}</h4>
);

export const InvitePreview = ({ cfg, status, update, onConfirmRSVP, guestData, internalData, onUploadLivePhoto }) => {
  if (!cfg) return null;
  const primary = cfg.primary || "#8b5cf6";
  const bg1 = cfg.bg1 || "#f8f7ff";
  const bg2 = cfg.bg2 || "#e0dcfc";
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";
  const gradOpacity = cfg.showCoverGradient === false ? 0 : ((cfg.coverGradientIntensity ?? 50) / 100).toFixed(2);
  const coverShadow = (cfg.coverTextShadowSize > 0) ? `0px 4px ${cfg.coverTextShadowSize}px ${cfg.coverTextShadowColor || '#000000'}` : 'none';

  const glowValue = cfg.cardGlow !== undefined ? cfg.cardGlow : 0;
  const hexAlpha = Math.floor((glowValue / 100) * 255).toString(16).padStart(2, '0');
  const dynamicShadow = glowValue === 0 ? 'none' : `${cfg.shadow || '0 8px 30px rgba(0,0,0,0.05)'}, 0 0 ${glowValue}px ${primary}${hexAlpha}`;

  const glassContainerStyle = {
    background: cardC,
    boxShadow: dynamicShadow,
    border: cfg.border ? `1px solid ${cfg.border}` : `1px solid ${primary}22`,
    backdropFilter: glowValue === 0 ? 'none' : 'blur(16px)',
    WebkitBackdropFilter: glowValue === 0 ? 'none' : 'blur(16px)'
  };
  const shineOverlay = cfg.shine && glowValue !== 0 ? <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: cfg.shine }}></div> : null;

  let isLottieEffect = false;
  let lottieUrl = null;
  
  if (cfg.particleEffect && cfg.particleEffect !== "none") {
    for (const category of Object.values(PARTICLE_CATEGORIES)) {
      const effect = category.find(e => e.id === cfg.particleEffect);
      if (effect && effect.isLottie) {
        isLottieEffect = true;
        lottieUrl = effect.url;
        break;
      }
    }
  }

  const ParticleLayer = () => (
    <div className={`${cfg.particlesFullscreen ? 'fixed' : 'absolute'} inset-0 pointer-events-none ${cfg.particlesFullscreen ? 'z-[100]' : 'z-20'} overflow-hidden flex items-start justify-center transition-opacity duration-200`} style={{ opacity: (cfg.effectOpacity ?? 100) / 100 }}>
       {isLottieEffect ? <LottieOverlay url={lottieUrl} /> : <ParticleCanvas effect={cfg.particleEffect || "none"} primary={primary} />}
    </div>
  );

  // 👉 LÓGICA DE TIEMPO PARA LA CÁMARA EN VIVO
  let cameraStatus = 'active'; // 'locked', 'active', 'expired'
  const eventDateStr = cfg.countdownDate || (cfg.dateText ? `${cfg.dateText}T00:00:00` : null);
  
  if (eventDateStr) {
    const evDate = new Date(eventDateStr);
    const now = new Date();
    // Restamos la fecha actual con la del evento en milisegundos
    const msDiff = now.getTime() - evDate.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);

    if (hoursDiff < -12) {
      cameraStatus = 'locked'; // Falta mucho (más de 12 horas antes)
    } else if (hoursDiff > 24) {
      cameraStatus = 'expired'; // Pasaron más de 24 horas del inicio
    } else {
      cameraStatus = 'active'; // Día del evento
    }
  }

  const [uploadingLive, setUploadingLive] = useState(false);
  const livePhotos = internalData?.live_photos || [];

  const handleLivePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLive(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && onUploadLivePhoto) {
        await onUploadLivePhoto(data.data.url);
      } else if (!onUploadLivePhoto) {
        alert("En el panel de edición, la foto no se guarda. Subí la web para probarlo.");
      }
    } catch (err) { alert("Error al subir foto"); }
    setUploadingLive(false);
  };

  return (
    <div style={{ backgroundColor: bg1, backgroundImage: bg2.includes('gradient') ? bg2 : `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`, fontFamily: cfg.fontBody, minHeight: '100%' }} className="pb-12 relative overflow-x-hidden flex flex-col">
      
      {/* 👉 ACÁ SUBIMOS EL Z-INDEX DE LOS BORDES A 60 PARA QUE SIEMPRE ESTÉN POR ENCIMA DEL TEXTO (z-30) */}
      {cfg.showCoverBorders && cfg.selectedBorder && (
        <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'top') && (
            <>
              <DraggableItem id="topLeftBorder" cfg={cfg} update={update} className="top-0 left-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `rotate(${cfg.borderRotationTop || 0}deg)` }} />
              </DraggableItem>
              <DraggableItem id="topRightBorder" cfg={cfg} update={update} className="top-0 right-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleX(-1) rotate(${cfg.borderRotationTop || 0}deg)` }} />
              </DraggableItem>
            </>
          )}
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'bottom') && (
            <>
               <DraggableItem id="bottomLeftBorder" cfg={cfg} update={update} className="bottom-0 left-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleY(-1) rotate(${cfg.borderRotationBottom || 0}deg)` }} />
               </DraggableItem>
               <DraggableItem id="bottomRightBorder" cfg={cfg} update={update} className="bottom-0 right-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleX(-1) scaleY(-1) rotate(${cfg.borderRotationBottom || 0}deg)` }} />
               </DraggableItem>
            </>
          )}
        </div>
      )}

      <div className="relative h-[450px] overflow-hidden shrink-0 rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        {!cfg.particlesFullscreen && <ParticleLayer />}

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col items-center z-30">
          <DraggableItem id="eventType" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <p className="font-black uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2 text-center" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px`, fontFamily: cfg.eventTypeFont || cfg.fontBody, textShadow: coverShadow }}>
              {cfg.eventTypeEmoji && <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />}
              {cfg.eventType}
            </p>
          </DraggableItem>
          
          <DraggableItem id="honoree" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <h1 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle, color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px`, textShadow: coverShadow, textAlign: 'center', lineHeight: 1.1 }}>{cfg.honoreeName}</h1>
          </DraggableItem>

          {(cfg.showBadge ?? true) && (
            <DraggableItem id="badge" cfg={cfg} update={update} className="relative !static flex justify-center mt-4 w-full">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-md font-black shadow-lg" style={{ background: cfg.badgeBgColor || 'rgba(0,0,0,0.5)', color: textC, fontSize: `${cfg.badgeSize ?? 12}px`, fontFamily: cfg.badgeFont || cfg.fontBody, textTransform: 'uppercase', tracking: 'widest' }}>
                <RenderSymbol value={cfg.badgeEmoji || "👑"} size={cfg.badgeSize ?? 14} color={textC} />
                {cfg.badgeText}
              </span>
            </DraggableItem>
          )}
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-5 flex-1">
        
        {cfg.showCountdown && cfg.countdownDate && (
          <div className="rounded-[2rem] relative overflow-hidden" style={glassContainerStyle}>
            {shineOverlay}
            <Countdown targetDate={cfg.countdownDate} primary={primary} text="Falta para el gran día" cfg={cfg} cardC={cardC} />
          </div>
        )}

        {cfg.showBanner && (
          <div className="relative h-48 rounded-[2rem] overflow-hidden border shadow-lg" style={{ borderColor: cfg.border || `${primary}44` }}>
            <img src={cfg.bannerPhoto || DEF_CONFIG.bannerPhoto} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md">{cfg.bannerTitle}</div>
          </div>
        )}

        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={formatToDDMMYYYY(cfg.dateText)} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />}
        
        {cfg.showLocation && (
          <div className="rounded-[2rem] overflow-hidden relative" style={glassContainerStyle}>
            {shineOverlay}
            <div className="p-4 flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-white/20 shadow-sm" style={{ background: cfg.accent || primary }}><MapPin size={24} color={cardC === '#000000' ? '#000' : '#fff'} /></div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-black tracking-widest mb-0.5 opacity-80" style={{ color: mutedC }}>¿Dónde?</p>
                <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${cfg.locationSize ?? 18}px` }}>{cfg.locationName}</p>
                <p className="text-[11px] font-medium opacity-70 mt-0.5" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{cfg.locationAddress}</p>
              </div>
            </div>
            <div className="px-4 pb-2 relative z-10"><MapEmbed name={cfg.locationName} address={cfg.locationAddress} primary={primary} /></div>
            {cfg.showParking && (
              <div className="p-4 text-center border-t relative z-10" style={{ borderColor: `${primary}22` }}>
                <span className="text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full inline-block border shadow-sm" style={{ background: `${primary}15`, color: primary, borderColor: `${primary}33`, fontFamily: cfg.fontBody }}>🚗 {cfg.parkingType === 'otro' ? cfg.customParking : cfg.parkingType}</span>
              </div>
            )}
          </div>
        )}

        {cfg.showVenueLogo && (
          <div className="pt-4">
            <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
              {shineOverlay}
              {cfg.venueLogoUrl && <img src={cfg.venueLogoUrl} className="h-16 w-auto object-contain mb-4 relative z-10 drop-shadow-md" alt="Lugar" />}
              <p className="text-[9px] uppercase font-black tracking-widest mb-1 opacity-80 relative z-10" style={{ color: mutedC }}>Celebrado en</p>
              <h3 className="font-black text-xl mb-5 relative z-10" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.venueName}</h3>
              {cfg.venueLink && (
                <a href={cfg.venueLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-[1rem] font-black text-xs shadow-md transition-transform active:scale-95 uppercase tracking-widest relative z-10 border border-white/20" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff' }}>
                  {cfg.venueLinkType === 'whatsapp' ? 'Hablar por WhatsApp' : 'Visitar Sitio Web'}
                </a>
              )}
            </div>
          </div>
        )}
        
        {cfg.showVideo && cfg.videoUrl && (
          <div className="pt-4">
            {cfg.videoTitle && <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.videoTitle}</SectionTitle>}
            <div className="rounded-[2rem] overflow-hidden border shadow-lg relative p-2" style={glassContainerStyle}>
              {shineOverlay}
              <div className="rounded-[1.5rem] overflow-hidden relative z-10" style={{ paddingTop: '56.25%' }}>
                <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(cfg.videoUrl)}`} title="YouTube" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        )}

        {cfg.showMusic && cfg.spotifyUrl && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>Música para entrar en clima</SectionTitle>
            <div className="rounded-[2rem] p-2 relative overflow-hidden shadow-lg" style={glassContainerStyle}>
              {shineOverlay}
              <iframe className="relative z-10 rounded-[1.5rem]" src={getSpotifyEmbed(cfg.spotifyUrl)} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        )}

        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.itinerarySectionTitle || "Programa del evento"}</SectionTitle>
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': `${primary}33` }}>
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: primary, opacity: 0.3 }} />
              {cfg.itinerary.map((item, i) => (
                <div key={i} className="relative text-left p-4 rounded-3xl" style={glassContainerStyle}>
                  {shineOverlay}
                  <div className="absolute -left-[35px] top-[18px] w-4 h-4 rounded-full border-4 border-white z-20" style={{ background: cfg.accent || primary, boxShadow: `0 0 15px ${primary}` }} />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black mb-1 uppercase tracking-widest" style={{ color: primary }}>{item.time}</p>
                    <p className="font-bold text-sm" style={{ color: textC, fontFamily: cfg.fontBody }}>{item.title}</p>
                    {item.sub && <p className="text-xs font-medium opacity-70 mt-1" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cfg.showMenu && cfg.menuItems?.length > 0 && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.menuSectionTitle || "¿Qué vamos a comer?"}</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.menuItems.map((m, i) => (
                <div key={i} className="p-5 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                  {shineOverlay}
                  <span className="mb-3 flex justify-center items-center h-12 w-12 rounded-2xl relative z-10 border shadow-sm" style={{ background: `${primary}15`, borderColor: `${primary}22` }}>
                     <RenderSymbol value={m.emoji} size={24} color={primary} />
                  </span>
                  <span className="text-xs font-bold relative z-10" style={{ color: textC, fontFamily: cfg.fontBody }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 👉 ÁLBUM EN VIVO (CÁMARA DESECHABLE) */}
        {cfg.showLiveCamera && (
          <div className="pt-6">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.liveCameraTitle || "Álbum Colaborativo"}</SectionTitle>
            <div className="relative overflow-hidden rounded-[2rem] text-center p-6 border shadow-lg" style={glassContainerStyle}>
              {shineOverlay}
              <div className="relative z-10 flex flex-col items-center">
                 {cameraStatus === 'locked' && (
                   <div className="py-6 flex flex-col items-center opacity-70">
                     <Lock size={40} className="mb-4" style={{ color: primary }} />
                     <p className="text-xs font-black uppercase tracking-widest" style={{ color: textC }}>Álbum Bloqueado</p>
                     <p className="text-[10px] mt-2 font-bold max-w-[200px]" style={{ color: mutedC }}>La cámara se habilitará el día del evento para que compartas tus fotos.</p>
                   </div>
                 )}
                 {cameraStatus === 'expired' && (
                   <div className="py-6 flex flex-col items-center opacity-70">
                     <CheckCircle2 size={40} className="mb-4 text-slate-400" />
                     <p className="text-xs font-black uppercase tracking-widest" style={{ color: textC }}>Álbum Cerrado</p>
                     <p className="text-[10px] mt-2 font-bold max-w-[200px]" style={{ color: mutedC }}>El evento finalizó y las fotos se han eliminado por privacidad.</p>
                   </div>
                 )}
                 {cameraStatus === 'active' && (
                   <div className="w-full">
                     <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80" style={{ color: mutedC }}>Capturá el momento</p>
                     <label className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-2 font-black shadow-lg text-white uppercase tracking-widest transition-transform ${uploadingLive ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 cursor-pointer hover:brightness-110'}`} style={{ background: cfg.accent || primary }}>
                        {uploadingLive ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                        {uploadingLive ? "SUBIENDO..." : "SUBIR FOTO"}
                        <input type="file" accept="image/*" capture="environment" onChange={handleLivePhotoUpload} disabled={uploadingLive} className="hidden" />
                     </label>
                     <p className="text-[9px] font-bold mt-3 opacity-60" style={{ color: textC }}>Las fotos se borrarán 24hs después del evento.</p>
                     
                     {/* Grilla de fotos */}
                     {livePhotos.length > 0 && (
                       <div className="grid grid-cols-2 gap-2 mt-6">
                         {livePhotos.map((url, i) => (
                           <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-white/10 relative group">
                             <img src={url} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                             <a href={url} download target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                               <Download size={14} />
                             </a>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {(cfg.showDressCode || cfg.showGifts) && (
          <div className="pt-6">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.notesSectionTitle || "A tener en cuenta"}</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.showDressCode && (
                <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                  {shineOverlay}
                  <span className="mb-3 flex justify-center items-center h-14 w-14 rounded-[1.2rem] relative z-10 border shadow-sm" style={{ background: cfg.accent || primary, borderColor: 'rgba(255,255,255,0.2)' }}>
                    <RenderSymbol value={cfg.dressCodeIcon || "👔"} size={26} color={cardC === '#000000' ? '#000' : '#fff'} />
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-80 relative z-10" style={{ color: mutedC }}>Vestimenta</p>
                  <p className="font-bold text-xs relative z-10" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.dressCodeText}</p>
                </div>
              )}
              {cfg.showGifts && (
                <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                  {shineOverlay}
                  <span className="mb-3 flex justify-center items-center h-14 w-14 rounded-[1.2rem] relative z-10 border shadow-sm" style={{ background: cfg.accent || primary, borderColor: 'rgba(255,255,255,0.2)' }}>
                    <RenderSymbol value={cfg.giftIcon || "🎁"} size={26} color={cardC === '#000000' ? '#000' : '#fff'} />
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-80 relative z-10" style={{ color: mutedC }}>{cfg.giftLabel}</p>
                  <p className="font-bold text-xs relative z-10" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.giftText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {cfg.showGifts && (
          <div className="pt-2">
            {cfg.showGiftNote && cfg.giftNoteText && (
              <div className="text-center mb-5 relative overflow-hidden rounded-[2rem]" style={glassContainerStyle}>
                {shineOverlay}
                <div className="p-6 relative z-10">
                  <span className="block font-bold whitespace-pre-wrap leading-relaxed" style={{ color: cfg.giftNoteColor || primary, fontSize: `${cfg.giftNoteSize || 12}px`, fontFamily: cfg.fontBody }}>
                    {cfg.giftNoteText}
                  </span>
                </div>
              </div>
            )}
            {cfg.giftLinks && cfg.giftLinks.length > 0 && (
              <div className="flex flex-col gap-3">
                {cfg.giftLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="py-4 px-6 rounded-[1.5rem] flex justify-between items-center transition-transform active:scale-95 relative overflow-hidden group" style={glassContainerStyle}>
                    {shineOverlay}
                    <span className="font-black text-sm relative z-10" style={{ color: textC }}>{link.label}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-110" style={{ background: `${primary}15` }}>
                      <ExternalLink size={14} style={{ color: primary }} />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={cfg.fontBody}>{cfg.galleryTitle}</SectionTitle>
            {cfg.galleryLayout === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {cfg.galleryPhotos.map((p, i) => p && <div key={i} className="rounded-3xl p-1 relative overflow-hidden" style={glassContainerStyle}>{shineOverlay}<img src={p} className="w-full h-48 rounded-[1.2rem] object-cover relative z-10" alt={`Galeria ${i}`} /></div>)}
              </div>
            ) : (
              <GalleryCarousel photos={cfg.galleryPhotos} />
            )}
          </div>
        )}

        <RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} mutedC={mutedC} onConfirmRSVP={onConfirmRSVP} guestData={guestData} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />
            
        {(cfg.showInstagram || cfg.showFacebook || cfg.showTiktok) && (
          <div className="flex justify-center gap-5 mt-10 relative z-[50]">
            {cfg.showInstagram && cfg.instagramUrl && (
              <a href={cfg.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                {shineOverlay}
                <InstagramIcon size={22} color={primary} className="relative z-10 group-hover:text-pink-500 transition-colors" />
              </a>
            )}
            {cfg.showFacebook && cfg.facebookUrl && (
              <a href={cfg.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                {shineOverlay}
                <FacebookIcon size={22} color={primary} className="relative z-10 group-hover:text-blue-600 transition-colors" />
              </a>
            )}
            {cfg.showTiktok && cfg.tiktokUrl && (
              <a href={cfg.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                {shineOverlay}
                <TiktokIcon size={22} color={primary} className="relative z-10 group-hover:text-black transition-colors" />
              </a>
            )}
          </div>
        )}
        
        <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-50 mt-10 pb-12 relative z-[50]" style={{ color: mutedC }}>
          Invitación creada con <strong className="text-violet-500">defiesta.lat</strong>
        </p>
      </div>

      {cfg.particlesFullscreen && <ParticleLayer />}
    </div>
  );
};
