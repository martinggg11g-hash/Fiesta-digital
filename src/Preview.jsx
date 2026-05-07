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

const CornerOrnament = ({ url, color, size, className, style }) => (
  <div className={className} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, WebkitMaskImage: `url("${url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: `url("${url}")`, maskSize: 'contain', maskRepeat: 'no-repeat', ...style }} />
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

const GalleryCarousel = ({ photos }) => {
  const [idx, setIdx] = useState(0);
  const valid = photos.filter(p => p);
  useEffect(() => {
    if (valid.length <= 1) return;
    const timer = setInterval(() => setIdx(p => (p === valid.length - 1 ? 0 : p + 1)), 3000);
    return () => clearInterval(timer);
  }, [valid.length]);

  if(valid.length === 0) return null;
  if(valid.length === 1) return <img src={valid[0]} className="w-full h-64 rounded-2xl object-cover shadow-lg border border-white/5" alt="Galeria" />;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-white/5 group">
       <img src={valid[idx]} className="w-full h-full object-cover transition-opacity duration-500" alt={`Foto ${idx+1}`} />
       <button onClick={() => setIdx(idx === 0 ? valid.length - 1 : idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronLeft size={24} /></button>
       <button onClick={() => setIdx(idx === valid.length - 1 ? 0 : idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronRight size={24} /></button>
       <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
         {valid.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />)}
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
// RSVP WIDGET CORREGIDO (LISTA NOMINAL Y BOTÓN WHATSAPP)
// ==========================================
const RsvpWidget = ({ cfg, primary, textC, cardC, mutedC, onConfirmRSVP }) => {
  const [step, setStep] = useState('button');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', lastname: '', guests: 1 });
  const [ticketImage, setTicketImage] = useState('');

  const maxLimit = cfg.maxGuestsPerFamily || 5;
  const isPrivate = cfg.isPrivateList || false;

  // Lógica para Lista Nominal (Botón WhatsApp)
  if (isPrivate) {
    const cleanPhone = cfg.whatsappNumber ? cfg.whatsappNumber.replace(/\D/g, '') : '';
    const waText = (cfg.whatsappMessage || "¡Hola! Confirmo mi asistencia.").replace('{nombre}', cfg.honoreeName || '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}` : '#';

    return (
      <div className="pt-8 text-center">
        {cfg.showRsvpDeadline && cfg.rsvpDeadline && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-4" style={{ color: mutedC }}>
            Confirmar asistencia antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}
          </p>
        )}
        
        <div className="p-6 rounded-3xl border shadow-sm mb-4 relative overflow-hidden" style={{ background: cardC, borderColor: `${primary}33` }}>
           <div className="absolute top-0 left-0 right-0 py-1.5" style={{ background: primary }}>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Tu Pase Nominal</p>
           </div>
           {/* Simulamos un QR único para la vista previa */}
           <img src={`https://quickchart.io/qr?text=VIP-MOCK-1234&size=300`} className="w-full max-w-[180px] mx-auto rounded-xl shadow-md mt-6 mb-3" alt="QR VIP" />
           <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textC }}>Nombre del Invitado</p>
           <p className="text-[10px] font-bold opacity-50" style={{ color: textC }}>Pase Intransferible</p>
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest" style={{ background: primary }}>
          <MessageCircle size={20} /> CONFIRMAR ASISTENCIA
        </a>
      </div>
    );
  }

  // Lógica para Lista Abierta (Link General)
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
      
      const guestName = `${formData.name} ${formData.lastname}`.toUpperCase();
      ctx.font = 'bold 40px sans-serif'; ctx.fillText(guestName, 300, 650);
      
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
            Confirmar asistencia antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}
          </p>
        )}
        <button onClick={() => setStep('form')} className="w-full py-5 rounded-2xl font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest" style={{ background: primary }}>
          OBTENER PASE VIP
        </button>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="pt-8">
        <form onSubmit={generateTicket} className="p-6 rounded-3xl border space-y-4 shadow-sm text-left" style={{ background: cardC, borderColor: `${primary}33` }}>
          
          <input type="text" placeholder="Tu Nombre" className="w-full p-4 rounded-xl outline-none" style={{ background: `${textC}0d`, color: textC }} onChange={e=>setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="Tu Apellido" className="w-full p-4 rounded-xl outline-none" style={{ background: `${textC}0d`, color: textC }} onChange={e=>setFormData({...formData, lastname: e.target.value})} required />
          
          <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: `${textC}0d` }}>
            <span className="text-xs font-bold flex items-center gap-2" style={{ color: textC }}><Users size={16}/> Acompañantes extras</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold cursor-pointer transition-colors" style={{ background: `${textC}1a`, color: textC }}>-</button>
              <span className="font-black w-4 text-center" style={{ color: textC }}>{formData.guests}</span>
              <button type="button" onClick={() => setFormData({...formData, guests: Math.min(maxLimit, formData.guests + 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold cursor-pointer transition-colors" style={{ background: `${textC}1a`, color: textC }}>+</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 font-black rounded-xl cursor-pointer uppercase tracking-widest mt-2" style={{ background: primary, color: '#fff' }}>
            {loading ? 'Procesando...' : 'GENERAR PASE'}
          </button>
          
          <button type="button" onClick={() => setStep('button')} className="w-full mt-2 text-xs font-bold uppercase tracking-widest cursor-pointer opacity-60 hover:opacity-100 transition-opacity" style={{ color: textC }}>Cancelar</button>
        </form>
      </div>
    );
  }

  // Si está en el paso 'qr' (Solo ocurre en Lista Abierta)
  return (
    <div className="pt-8">
      <div className="text-center p-6 rounded-3xl border shadow-sm" style={{ background: cardC, borderColor: `${primary}33` }}>
        <img src={ticketImage} className="w-full max-w-[240px] mx-auto rounded-xl shadow-2xl mb-4" alt="Pase VIP" />
        <a href={ticketImage} download="Pase_VIP.jpg" className="block w-full py-3 bg-green-500 text-white font-black rounded-xl mb-3 cursor-pointer">DESCARGAR IMAGEN</a>
        <button type="button" onClick={()=>setStep('button')} className="text-xs cursor-pointer font-bold" style={{ color: textC }}>Cerrar</button>
      </div>
    </div>
  );
};

const SectionTitle = ({ children, mutedC, size }) => (
  <h4 className="font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC, fontSize: `${size ?? 10}px` }}>{children}</h4>
);

const InfoCard = ({ icon: Icon, label, value, sub, fontSize, primary, textC, mutedC, cardC, cfg }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5" style={{ background: cardC }}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><Icon size={20} color="white" /></div>
    <div className="text-left">
      <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>{label}</p>
      <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${fontSize}px` }}>{value}</p>
      {sub && <p className="text-[11px] mt-0.5 opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{sub}</p>}
    </div>
  </div>
);

export const InvitePreview = ({ cfg, status, update, onConfirmRSVP }) => {
  if (!cfg) return null;
  const primary = cfg.primary || "#8b5cf6";
  const bg1 = cfg.bg1 || "#f8f7ff";
  const bg2 = cfg.bg2 || "#e0dcfc";
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";
  const gradOpacity = cfg.showCoverGradient === false ? 0 : ((cfg.coverGradientIntensity ?? 50) / 100).toFixed(2);
  const coverShadow = (cfg.coverTextShadowSize > 0) ? `0px 4px ${cfg.coverTextShadowSize}px ${cfg.coverTextShadowColor || '#000000'}` : 'none';

  return (
    <div style={{ backgroundColor: bg1, backgroundImage: bg2.includes('gradient') ? bg2 : `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`, fontFamily: cfg.fontBody, minHeight: '100%' }} className="pb-12 relative overflow-x-hidden flex flex-col">
      
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

      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" style={{ height: "100%" }}>
        <ParticleCanvas effect={cfg.particleEffect || "none"} primary={primary} />
      </div>

      <div className="relative h-[420px] overflow-hidden shrink-0">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-30">
          <DraggableItem id="eventType" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px`, fontFamily: cfg.eventTypeFont || cfg.fontBody, textShadow: coverShadow }}>
              <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />
              {cfg.eventType}
            </p>
          </DraggableItem>
          
          <DraggableItem id="honoree" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <h1 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle, color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px`, textShadow: coverShadow, textAlign: 'center' }}>{cfg.honoreeName}</h1>
          </DraggableItem>

          {(cfg.showBadge ?? true) && (
            <DraggableItem id="badge" cfg={cfg} update={update} className="relative !static flex justify-center mt-2 w-full">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md font-black" style={{ background: cfg.badgeBgColor || 'rgba(0,0,0,0.5)', color: textC, fontSize: `${cfg.badgeSize ?? 14}px`, fontFamily: cfg.badgeFont || cfg.fontBody }}>
                <RenderSymbol value={cfg.badgeEmoji || "👑"} size={cfg.badgeSize ?? 14} color={textC} />
                {cfg.badgeText}
              </span>
            </DraggableItem>
          )}
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4 flex-1">
        
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

        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={formatToDDMMYYYY(cfg.dateText)} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} />}
        
        {cfg.showLocation && (
          <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: cardC }}>
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><MapPin size={20} color="white" /></div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>¿Dónde?</p>
                <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${cfg.locationSize ?? 18}px` }}>{cfg.locationName}</p>
                <p className="text-[11px] opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{cfg.locationAddress}</p>
              </div>
            </div>
            <div className="px-4 pb-2"><MapEmbed name={cfg.locationName} address={cfg.locationAddress} primary={primary} /></div>
            {cfg.showParking && (
              <div className="p-4 text-center border-t border-white/5">
                <span className="text-xs font-bold py-2 px-4 rounded-full inline-block" style={{ background: `${primary}22`, color: primary, fontFamily: cfg.fontBody }}>🚗 {cfg.parkingType === 'otro' ? cfg.customParking : cfg.parkingType}</span>
              </div>
            )}
          </div>
        )}

        {cfg.showVenueLogo && (
          <div className="pt-4">
            <div className="p-5 rounded-3xl text-center border border-white/5 shadow-sm" style={{ background: cardC }}>
              {cfg.venueLogoUrl && <img src={cfg.venueLogoUrl} className="w-16 h-16 rounded-xl object-contain mx-auto mb-3" alt="Lugar" />}
              <p className="text-[10px] uppercase font-black tracking-widest mb-1" style={{ color: mutedC }}>Celebrado en</p>
              <h3 className="font-black text-lg mb-4" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.venueName}</h3>
              {cfg.venueLink && (
                <a href={cfg.venueLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs shadow-sm transition-transform active:scale-95" style={{ background: `${primary}22`, color: primary }}>
                  {cfg.venueLinkType === 'whatsapp' ? 'Hablar por WhatsApp' : 'Visitar Sitio Web'}
                </a>
              )}
            </div>
          </div>
        )}
        
        {cfg.showVideo && cfg.videoUrl && (
          <div className="pt-4">
            {cfg.videoTitle && <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>{cfg.videoTitle}</SectionTitle>}
            <div className="rounded-2xl overflow-hidden border border-white/5 shadow-lg relative" style={{ paddingTop: '56.25%' }}>
              <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(cfg.videoUrl)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        )}

        {cfg.showMusic && cfg.spotifyUrl && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>Música para entrar en clima</SectionTitle>
            <iframe style={{ borderRadius: '12px' }} src={getSpotifyEmbed(cfg.spotifyUrl)} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        )}

        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>{cfg.itinerarySectionTitle || "Programa del evento"}</SectionTitle>
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
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>{cfg.menuSectionTitle || "¿Qué vamos a comer?"}</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.menuItems.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl text-center border border-white/5" style={{ background: cardC }}>
                  <span className="mb-2 flex justify-center items-center h-10">
                     <RenderSymbol value={m.emoji} size={32} color={primary} />
                  </span>
                  <span className="text-xs font-bold" style={{ color: textC, fontFamily: cfg.fontBody }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(cfg.showDressCode || cfg.showGifts) && (
          <div className="pt-6">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>{cfg.notesSectionTitle || "A tener en cuenta"}</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {cfg.showDressCode && (
                <div className="p-5 rounded-2xl text-center border border-white/5 shadow-sm" style={{ background: cardC }}>
                  <span className="mb-2 flex justify-center items-center h-10">
                    <RenderSymbol value={cfg.dressCodeIcon || "👔"} size={32} color={primary} />
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>Vestimenta</p>
                  <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.dressCodeText}</p>
                </div>
              )}
              {cfg.showGifts && (
                <div className="p-5 rounded-2xl text-center border border-white/5 shadow-sm" style={{ background: cardC }}>
                  <span className="mb-2 flex justify-center items-center h-10">
                    <RenderSymbol value={cfg.giftIcon || "🎁"} size={32} color={primary} />
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>{cfg.giftLabel}</p>
                  <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.giftText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {cfg.showGifts && (
          <div className="pt-2">
            {cfg.showGiftNote && cfg.giftNoteText && (
              <div className="text-center mb-4">
                <span className="inline-block py-3 px-6 rounded-3xl font-bold border whitespace-pre-wrap leading-relaxed shadow-sm w-full" style={{ background: `${cfg.card}ee`, borderColor: `${primary}33`, color: cfg.giftNoteColor || primary, fontSize: `${cfg.giftNoteSize || 11}px`, fontFamily: cfg.fontBody }}>
                  {cfg.giftNoteText}
                </span>
              </div>
            )}
            {cfg.giftLinks && cfg.giftLinks.length > 0 && (
              <div className="flex flex-col gap-3">
                {cfg.giftLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="py-4 px-5 rounded-2xl border border-white/5 flex justify-between items-center transition-transform active:scale-95 shadow-sm" style={{ background: cardC }}>
                    <span className="font-black text-sm" style={{ color: textC }}>{link.label}</span>
                    <ExternalLink size={18} style={{ color: primary }} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-4">
            <SectionTitle mutedC={mutedC} size={cfg.titlesSize}>{cfg.galleryTitle}</SectionTitle>
            {cfg.galleryLayout === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {cfg.galleryPhotos.map((p, i) => p && <img key={i} src={p} className="w-full h-48 rounded-xl object-cover shadow-md border border-white/5" alt={`Galeria ${i}`} />)}
              </div>
            ) : (
              <GalleryCarousel photos={cfg.galleryPhotos} />
            )}
          </div>
        )}

        <RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} mutedC={mutedC} onConfirmRSVP={onConfirmRSVP} />
           
        {(cfg.showInstagram || cfg.showFacebook || cfg.showTiktok) && (
          <div className="flex justify-center gap-4 mt-8 relative z-[50]">
            {cfg.showInstagram && cfg.instagramUrl && (
              <a href={cfg.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-white/10" style={{ background: cardC, color: primary }}>
                <InstagramIcon size={20} />
              </a>
            )}
            {cfg.showFacebook && cfg.facebookUrl && (
              <a href={cfg.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-white/10" style={{ background: cardC, color: primary }}>
                <FacebookIcon size={20} />
              </a>
            )}
            {cfg.showTiktok && cfg.tiktokUrl && (
              <a href={cfg.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-white/10" style={{ background: cardC, color: primary }}>
                <TiktokIcon size={20} />
              </a>
            )}
          </div>
        )}
        
        <p className="text-center text-[10px] font-bold opacity-50 mt-8 pb-12 relative z-[50]" style={{ color: mutedC }}>
          Invitación creada con <strong className="tracking-wide">defiesta.lat</strong>
        </p>
      </div>
    </div>
  );
};
