import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin, Clock, Calendar, Palette, CheckCircle2,
  ChevronDown, Type, Edit2, ArrowLeft, Save, X,
  Star, Image as ImageIcon, Layout, List, Trash2, Loader2, Check,
  Video, Link as LinkIcon
} from "lucide-react";

/* ============================================================================
   ESTILOS INYECTADOS LOCALMENTE (Para Confeti y Pop)
============================================================================ */
const injectLocalStyles = () => {
  if (!document.getElementById("cinematic-styles")) {
    const style = document.createElement("style");
    style.id = "cinematic-styles";
    style.textContent = `
      @keyframes elasticPop {
        0% { transform: scale(0.5); opacity: 0; }
        60% { transform: scale(1.2); }
        80% { transform: scale(0.95); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-elastic { animation: elasticPop 0.8s cubic-bezier(.34,1.56,.64,1); }

      @keyframes confettiFall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
      .confetti-piece {
        position: absolute;
        top: 0;
        width: 8px;
        height: 12px;
        animation: confettiFall 2.5s linear forwards;
        z-index: 50;
      }
    `;
    document.head.appendChild(style);
  }
};

/* ============================================================================
   FUNCIONES AUXILIARES Y CONSTANTES
============================================================================ */
const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  } catch (e) { return null; }
};

export const GENERAL_EMOJIS = ['🎂','🎈','🎉','🥳','🎁','🎊','👶','💍','🎓','✨','🌟','❤️','💖','🦖','🦄','⚽','🎮','👑','🌸','🔥','💎','🎪','🎠','🎡','🦋','🌺','🎵','🏆'];
export const FOOD_EMOJIS = ['🍕','🍔','🍟','🌭','🍿','🍳','🥞','🍞','🥐','🥨','🧀','🥗','🌮','🌯','🍖','🍗','🥟','🍣','🍤','🍩','🍪','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🥤','🧃','🧉','🍻','🥂','🍷','🍹','🍸','🍺','☕'];
export const CLOTHES_EMOJIS = ['👕','👖','👔','👗','👙','👘','🥻','👠','👡','👢','👞','👟','🥿','🧦','🧤','🧣','🎩','🧢','👒','🎓','👑','💍','👝','👛','👜','💼','🎒','🕶','👓'];

export const THEMES = [
  { id:"violet", name:"Violeta",   bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4" },
  { id:"rose",   name:"Rosa",      bg1:"#150510", bg2:"#200a16", primary:"#e11d48", card:"#2a0e1a", text:"#fff1f3", muted:"#fda4af" },
  { id:"teal",   name:"Teal",      bg1:"#020f10", bg2:"#031a1c", primary:"#0d9488", card:"#062020", text:"#f0fdfb", muted:"#5eead4" },
  { id:"amber",  name:"Ámbar",     bg1:"#0f0800", bg2:"#1c1200", primary:"#d97706", card:"#1a1000", text:"#fffbeb", muted:"#fcd34d" },
  { id:"p-pink", name:"P. Rosa",   bg1:"#fdf2f8", bg2:"#fce7f3", primary:"#ec4899", card:"#ffffff", text:"#831843", muted:"#f472b6" },
  { id:"p-blue", name:"P. Azul",   bg1:"#eff6ff", bg2:"#e0f2fe", primary:"#3b82f6", card:"#ffffff", text:"#1e3a8a", muted:"#60a5fa" },
  { id:"p-green",name:"P. Verde",  bg1:"#f0fdf4", bg2:"#dcfce7", primary:"#22c55e", card:"#ffffff", text:"#14532d", muted:"#4ade80" },
  { id:"p-yellow",name:"P. Amar.", bg1:"#fefce8", bg2:"#fef9c3", primary:"#eab308", card:"#ffffff", text:"#713f12", muted:"#facc15" },
];

export const FONTS = [
  { label: "DM Sans (Moderna)", value: "'DM Sans', sans-serif" },
  { label: "Montserrat (Limpia)", value: "'Montserrat', sans-serif" },
  { label: "Syne (Elegante)", value: "'Syne', sans-serif" },
  { label: "Pacifico (Divertida)", value: "'Pacifico', cursive" },
  { label: "Caveat (Manuscrita)", value: "'Caveat', cursive" },
  { label: "Playfair (Clásica)", value: "'Playfair Display', serif" },
];

export const EFFECTS = [
  { id: "none",     name: "Sin efecto",  icon: "✖️" },
  { id: "confetti", name: "Confeti",     icon: "🎊" },
  { id: "hearts",   name: "Corazones",   icon: "❤️" },
  { id: "stars",    name: "Estrellas",   icon: "⭐" },
  { id: "bubbles",  name: "Burbujas",    icon: "🫧" },
  { id: "snow",     name: "Nieve",       icon: "❄️" },
  { id: "petals",   name: "Pétalos",     icon: "🌸" },
  { id: "emojis",   name: "Emojis mix",  icon: "🎉" },
];

export const OPENING_ANIMATIONS = [
  { id: "envelope", name: "Sobre", icon: "💌" },
  { id: "chest", name: "Baúl", icon: "🗝️" },
  { id: "musicbox", name: "Caja Musical", icon: "🎵" },
  { id: "soccer", name: "Cancha", icon: "⚽" },
  { id: "gift", name: "Regalo", icon: "🎁" },
];

export const DEF_CONFIG = {
  theme:"violet", fontTitle:"'Pacifico', cursive", fontBody:"'DM Sans', sans-serif",
  honoreeSize: 48, eventTypeSize: 11,
  bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4",
  coverGradientIntensity: 70, particleEffect: "none", openingAnimation: "gift",
  eventTypeEmoji:"✨", eventType:"Estás invitado al cumple de", honoreeName:"Valentina", badgeEmoji:"🎂", badgeText:"5 añitos",
  coverPhoto:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  showBanner:true, bannerTitle:"La festejada", bannerPhoto:"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&w=400&q=80",
  showDate:true, dateText:"Sábado 24 de Octubre", showTime:true, timeText:"16:00 a 20:00 hs", showCountdown: false, countdownDate:"",
  showTheme:true, themeIcon:"🦕", themeLabel:"Temática", themeText:"Dinosaurios",
  showLocation:true, locationName:"Aventura Kids", locationAddress:"Av. San Martín 1234", showParking:true, parkingType:"Estacionamiento público", customParking:"",
  showItinerary:true, itinerary:[{ time:"16:00", title:"Bienvenida", sub:"Recepción de invitados" }],
  showMenu:true, menuItems:[{ emoji:"🍕", label:"Pizza Party" }, { emoji:"🥤", label:"Gaseosas" }],
  showDressCode:true, dressCodeIcon:"👗", dressCodeText:"Elegante Sport",
  showGifts:true, giftIcon:"🎁", giftLabel:"Regalos", giftText:"Lluvia de sobres", showGiftNote:false, giftNoteText:"",
  showGallery:false, galleryTitle:"Fotos", galleryPhotos:[],
  showVideo:false, videoUrl:"", videoTitle:"Mirá el video",
  showVenueLogo:false, venueLogoUrl:"", venueName:"", venueLink:"", venueLinkType:"web",
  whatsappNumber:"5491123456789", whatsappMessage:"¡Hola! Confirmo mi asistencia para el evento 🎉",
};

/* ============================================================================
   MICRO COMPONENTES DE UI
============================================================================ */
const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
    )}
  </div>
);

const SelectInp = ({ label, value, onChange, options, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all cursor-pointer">
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const FileUpload = ({ label, onChange, value, accept="image/*" }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mb-4 text-left">
      {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
      <input type="file" accept={accept} onChange={handleFile} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
      {value && <img src={value} alt="preview" className="mt-3 h-24 w-auto rounded-xl object-cover border border-gray-200 shadow-sm" />}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

const EmojiPicker = ({ value, onSelect, list = GENERAL_EMOJIS }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} type="button" className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 text-2xl flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer">{value}</button>
      {open && (
        <div className="absolute top-14 left-0 z-50 bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
            {list.map(e => <button key={e} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-gray-100 rounded-lg cursor-pointer">{e}</button>)}
          </div>
        </div>
      )}
    </div>
  );
};

const Acc = ({ title, icon: Icon, children, defaultOpen = false, iconColor = "#7c3aed" }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-3 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: open ? '3000px' : '0', opacity: open ? 1 : 0 }}>
        <div className="p-4 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};


/* ============================================================================
   EFECTOS ESPECIALES Y WIDGETS
============================================================================ */
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
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style={{ background: primary }}>{(val || 0).toString().padStart(2, '0')}</div>
              <span className="text-[10px] font-bold opacity-60" style={{ color: primary }}>{labels[unit]}</span>
            </div>
          ))}
        </div>
      )}
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
    } catch(e) { console.warn("ResizeObserver not supported"); }

    const EMOJI_MIX = ["🎉","🎊","🎈","✨","🌟","💖","🎂"];
    const PETALS = ["🌸","🌺","🌹","🌷"];

    const spawnParticle = () => {
      const x = Math.random() * canvas.width;
      const isBubble = effect === "bubbles";
      const base = { x, y: isBubble ? canvas.height + 20 : -20, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2 + 1, alpha: 1, rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 4, size: Math.random() * 10 + 8, life: 1, decay: Math.random() * 0.003 + 0.002 };

      if (effect === "confetti") { const colors = [primary, "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#facc15"]; return { ...base, type: "rect", color: colors[Math.floor(Math.random() * colors.length)], w: Math.random()*10+5, h: Math.random()*5+3 }; }
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
      if (frame % 8 === 0 && particlesRef.current.length < 60) {
        const p = spawnParticle(); if (p) particlesRef.current.push(p);
      }
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + (p.rotV || 0); p.life -= p.decay; p.alpha = p.life;
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.type === "rect") { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot || 0) * Math.PI/180); ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore(); } 
        else if (p.type === "circle") { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); if (p.filled) { ctx.fillStyle = p.color; ctx.fill(); } else { ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.stroke(); } } 
        else if (p.type === "text") { ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot||0)*Math.PI/180); ctx.fillText(p.emoji, 0, 0); ctx.restore(); }
        ctx.globalAlpha = 1;
        return p.life > 0 && p.y < canvas.height + 40 && p.y > -40;
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
  const query = `${name || ""} ${address || ""}`.trim();
  if (!query) return null;
  const gMapsUrl = `http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(query)}`;
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: "#1a1a2e" }}>
      <iframe title="map" width="100%" height="200" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=16&output=embed&iwloc=near`} />
      <a href={gMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 text-xs font-black uppercase tracking-wider transition-colors" style={{ background: `${primary}22`, color: primary }}><MapPin size={14} /> Abrir en Google Maps</a>
    </div>
  );
};

const VenueCard = ({ cfg, primary, text, muted, card }) => {
  if (!cfg.showVenueLogo) return null;
  const href = cfg.venueLinkType === "whatsapp" ? `https://wa.me/${cfg.venueLink}` : cfg.venueLink;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 no-underline transition-opacity hover:opacity-80" style={{ background: card }}>
      {cfg.venueLogoUrl ? <img src={cfg.venueLogoUrl} alt="logo" className="w-14 h-14 rounded-xl object-contain border border-white/10 bg-white/5" /> : <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${primary}22` }}>🏠</div>}
      <div className="text-left flex-1">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: muted }}>Lugar del evento</p>
        <p className="font-bold text-sm" style={{ color: text }}>{cfg.venueName || "Ver lugar"}</p>
        <p className="text-[10px] mt-0.5 font-bold" style={{ color: primary }}>{cfg.venueLinkType === "whatsapp" ? "📱 Consultar por WhatsApp" : "🌐 Ver sitio web"}</p>
      </div>
    </a>
  );
};

const VideoSection = ({ cfg, primary, text, muted, card }) => {
  if (!cfg.showVideo || !cfg.videoUrl) return null;
  const ytId = getYouTubeId(cfg.videoUrl);
  return (
    <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: card }}>
      {cfg.videoTitle && <p className="text-center text-[10px] font-black uppercase tracking-widest pt-4 pb-2" style={{ color: muted }}>{cfg.videoTitle}</p>}
      {ytId ? (
        <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="block w-full"></iframe>
      ) : (
        <video src={cfg.videoUrl} controls playsInline className="w-full block" style={{ maxHeight: 300 }} />
      )}
    </div>
  );
};

/* ============================================================================
   ANIMACIONES DE ENTRADA CINEMATOGRÁFICAS
============================================================================ */
const Confetti = ({ trigger }) => {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (trigger) {
      const newPieces = Array.from({ length: 40 }).map((_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 0.5, color: `hsl(${Math.random()*360},100%,60%)`
      }));
      setPieces(newPieces);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-[400px] h-[800px] -top-[100px] -left-[60px]">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, backgroundColor: p.color, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
};

export const OpeningAnimation = ({ cfg, onOpen }) => {
  const [opening, setOpening] = useState(false);
  const [phase, setPhase] = useState(0);
  
  injectLocalStyles();

  const type = cfg?.openingAnimation || "envelope";
  const th = THEMES.find(t => t.id === cfg?.theme) || THEMES[0];
  const primary = cfg?.primary || th.primary;

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    const sounds = {
      envelope: "https://actions.google.com/sounds/v1/water/air_woosh_underwater.ogg", 
      chest: "https://actions.google.com/sounds/v1/magic/magic_chimes.ogg",
      soccer: "https://actions.google.com/sounds/v1/sports/referee_whistle.ogg",
      musicbox: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
      gift: "https://actions.google.com/sounds/v1/fireworks/fireworks_burst.ogg"
    };

    if(sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.6;
      audio.play().catch(()=>{});
    }

    if (type === "gift" || type === "soccer") {
      setTimeout(() => setPhase(1), 200);   
      setTimeout(() => setPhase(2), 600);   
      setTimeout(() => onOpen(), 1600);
    } else {
      setTimeout(() => onOpen(), type === 'envelope' || type === 'chest' ? 1200 : 1500);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "envelope":
        return (
          <div className="relative z-10 cursor-pointer group flex flex-col items-center">
            <div className={`relative w-[280px] h-[180px] rounded-lg shadow-2xl transition-all duration-700 ease-in-out ${opening ? '-translate-y-20 opacity-0' : 'animate-float'}`} style={{ backgroundColor: cfg?.card || th.card }}>
              <div className={`absolute top-0 left-0 w-full h-full border-[0px] border-t-[90px] border-l-[140px] border-r-[140px] border-b-[90px] border-transparent opacity-30 ${opening ? 'animate-envelope-open' : ''}`} style={{ borderTopColor: primary }} />
              <div className="absolute bottom-0 left-0 w-full h-full border-[0px] border-b-[90px] border-l-[140px] border-r-[140px] border-t-[90px] border-transparent opacity-10" style={{ borderBottomColor: '#ffffff' }} />
              {!opening && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-2xl text-white transition-transform group-hover:scale-110" style={{ backgroundColor: primary, border: '2px solid rgba(255,255,255,0.2)' }}>
                  {cfg?.badgeEmoji || "💌"}
                </div>
              )}
            </div>
            <p className="mt-8 text-white text-xs font-black tracking-[0.3em] uppercase opacity-70 animate-pulse">Tocar para abrir</p>
          </div>
        );

      case "chest":
        return (
          <div className="relative z-10 cursor-pointer group flex flex-col items-center">
            <div className="relative w-[200px] h-[160px]">
               <div className="absolute bottom-0 w-full h-[100px] rounded-b-xl shadow-2xl" style={{ backgroundColor: '#854d0e', border: '4px solid #ca8a04' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center"><Key size={14} className="text-yellow-800"/></div>
               </div>
               <div className={`absolute top-0 w-full h-[60px] rounded-t-3xl ${opening ? 'animate-chest-open' : ''}`} style={{ backgroundColor: '#a16207', border: '4px solid #ca8a04' }} />
               {opening && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">✨✨✨</div>}
            </div>
            <p className="mt-8 text-white text-xs font-black tracking-[0.3em] uppercase opacity-70 animate-pulse">Tocar para abrir</p>
          </div>
        );

      case "musicbox":
        return (
          <div className="relative z-10 cursor-pointer group flex flex-col items-center">
            <div className="w-[150px] h-[150px] bg-white rounded-3xl flex items-center justify-center shadow-2xl" style={{ border: `8px solid ${primary}` }}>
               <div className={`text-6xl text-slate-800 ${opening ? 'animate-spin-away' : 'animate-float'}`}>🎵</div>
            </div>
            <p className="mt-8 text-white text-xs font-black tracking-[0.3em] uppercase opacity-70 animate-pulse">Tocar para escuchar</p>
          </div>
        );

      case "soccer":
        return (
          <div className="relative z-10 flex flex-col items-center w-full h-full justify-center overflow-visible cursor-pointer group" onClick={handleOpen}>
            {phase >= 2 && <Confetti trigger={true} />}
            <div className="absolute bottom-0 w-full h-[250px] bg-green-600 border-t-4 border-white opacity-40 pointer-events-none" />
            <div className="relative w-full max-w-[300px] h-[200px] border-4 border-white border-b-0 flex items-end justify-center pointer-events-none mb-10">
              <div className="w-full h-full opacity-20" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, white 20px, white 24px), repeating-linear-gradient(0deg, transparent, transparent 20px, white 20px, white 24px)' }}/>
            </div>
            <div className={`absolute bottom-32 text-7xl z-20 ${opening ? 'animate-shoot' : 'animate-bounce group-hover:scale-110 transition-transform'}`}>⚽</div>
            {phase >= 1 && <div className="text-6xl absolute top-[250px] animate-ping z-30">💥</div>}
            {!opening && <p className="absolute bottom-16 text-white text-xs font-black tracking-[0.3em] uppercase opacity-90 bg-black/50 px-4 py-2 rounded-full">Tocar para patear</p>}
          </div>
        );

      case "gift":
        return (
          <div className="relative z-10 cursor-pointer group flex flex-col items-center">
            {phase >= 2 && <Confetti trigger={true} />}
            <div className={`text-9xl transition-all duration-700 ${opening ? 'scale-0 rotate-[720deg] opacity-0' : 'animate-bounce'}`}>🎁</div>
            {phase >= 1 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-2xl opacity-70 animate-ping pointer-events-none" />}
            {!opening && <p className="mt-8 text-white text-xs font-black tracking-[0.3em] uppercase opacity-70 animate-pulse">Tocar para descubrir</p>}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${opening && (type==='envelope'||type==='chest'||type==='musicbox') ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-slate-900'} ${opening && (type==='gift'||type==='soccer') && phase>=2 ? 'opacity-0 bg-black pointer-events-none' : ''}`}>
      <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${cfg?.bg1 || th.bg1}, ${cfg?.bg2 || th.bg2})` }} />
      <div onClick={type !== 'soccer' ? handleOpen : undefined} className="w-full h-full flex items-center justify-center">
         {renderContent()}
      </div>
    </div>
  );
};


/* ============================================================================
   VISTA PREVIA DE LA INVITACIÓN
============================================================================ */
export const InvitePreview = ({ cfg }) => {
  if (!cfg) return null;
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary;
  const bg = `linear-gradient(180deg, ${cfg.bg1 || th.bg1} 0%, ${cfg.bg2 || th.bg2} 100%)`;
  const textC = cfg.text || th.text;
  const mutedC = cfg.muted || th.muted;
  const cardC  = cfg.card  || th.card;
  const gradOpacity = ((cfg.coverGradientIntensity ?? 70) / 100).toFixed(2);

  const InfoCard = ({ icon: Icon, label, value, sub }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5" style={{ background: cardC }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><Icon size={20} color="white" /></div>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>{label}</p>
        <p className="font-bold text-sm" style={{ color: textC, fontFamily: cfg.fontBody }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{sub}</p>}
      </div>
    </div>
  );

  const waMsg = (cfg.whatsappMessage || "").replace('{nombre}', cfg.honoreeName || "");

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-12 relative">
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" style={{ height: "100%" }}>
        <ParticleCanvas effect={cfg.particleEffect || "none"} primary={primary} />
      </div>

      <div className="relative h-[420px] overflow-hidden">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1 || th.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-30">
          <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px`, fontFamily: cfg.eventTypeFont || cfg.fontBody }}>
            {cfg.eventTypeEmoji} {cfg.eventType}
          </p>
          <h1 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle, color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px` }} className="leading-tight mb-4">
            {cfg.honoreeName}
          </h1>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md bg-black/30 font-black text-sm" style={{ color: textC }}>
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
            <div className="absolute bottom-4 left-4 text-left">
              <h2 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle }} className="text-2xl text-white">{cfg.honoreeName}</h2>
            </div>
          </div>
        )}

        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={cfg.dateText} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} />}
        {cfg.showTheme && <InfoCard icon={Star} label={cfg.themeLabel} value={`${cfg.themeIcon} ${cfg.themeText}`} />}

        {cfg.showLocation && (
          <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: cardC }}>
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><MapPin size={20} color="white" /></div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>¿Dónde?</p>
                <p className="font-bold text-sm" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.locationName}</p>
                <p className="text-[11px] opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{cfg.locationAddress}</p>
              </div>
            </div>
            <div className="px-4 pb-2"><MapEmbed name={cfg.locationName} address={cfg.locationAddress} primary={primary} /></div>
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
        <VideoSection cfg={cfg} primary={primary} text={textC} muted={mutedC} card={cardC} />

        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC }}>Programa del evento</h4>
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
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC }}>¿Qué vamos a comer?</h4>
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

        <div className="grid grid-cols-2 gap-3 pt-4">
          {cfg.showDressCode && (
            <div className="p-5 rounded-2xl text-center border border-white/5" style={{ background: cardC }}>
              <span className="text-3xl block mb-2">{cfg.dressCodeIcon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>Vestimenta</p>
              <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.dressCodeText}</p>
            </div>
          )}
          {cfg.showGifts && (
            <div className="p-5 rounded-2xl text-center border border-white/5" style={{ background: cardC }}>
              <span className="text-3xl block mb-2">{cfg.giftIcon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: mutedC }}>{cfg.giftLabel}</p>
              <p className="font-bold text-xs" style={{ color: textC, fontFamily: cfg.fontBody }}>{cfg.giftText}</p>
            </div>
          )}
        </div>

        {cfg.showGifts && cfg.showGiftNote && cfg.giftNoteText && (
          <div className="text-center pt-2">
            <span className="inline-flex py-2 px-4 rounded-full text-[10px] font-bold border" style={{ background: `${primary}15`, borderColor: `${primary}33`, color: primary, fontFamily: cfg.fontBody }}>{cfg.giftNoteText}</span>
          </div>
        )}

        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC }}>{cfg.galleryTitle}</h4>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5">
              {cfg.galleryPhotos.map((p, i) => p && (
                <img key={i} src={p} className="w-32 h-32 rounded-2xl object-cover shrink-0 border border-white/5" alt={`Galeria ${i}`} />
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(waMsg)}`)}
          className="w-full py-5 mt-4 rounded-[1.5rem] font-black text-sm tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-transform active:scale-95 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)`, color: 'white', boxShadow: `0 15px 35px ${primary}44` }}
        >
          <CheckCircle2 size={20} /> CONFIRMAR ASISTENCIA
        </button>
        <p className="text-center text-[9px] font-bold opacity-30 mt-8" style={{ color: mutedC }}>FiestaDigital © 2024</p>
      </div>
    </div>
  );
};

/* ============================================================================
   EDITOR PRINCIPAL (EL PANEL QUE USA EL SALÓN)
============================================================================ */
export const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [previewAnim, setPreviewAnim] = useState(false);

  useEffect(() => {
    const found = invitations.find(i => i.id === id);
    if (found) setInv({ ...found });
    else navigate("/dashboard");
  }, [id, invitations, navigate]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando editor...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const handleSave = () => { onSave(inv); navigate("/dashboard"); };
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"><ArrowLeft size={20}/></button>
          <input className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5 focus:bg-white/10 transition-colors" value={inv.title} onChange={e => setInv({...inv, title: e.target.value})} />
        </div>
        <button onClick={handleSave} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl shadow-violet-900/40 cursor-pointer transition-colors">
          <Save size={16}/> GUARDAR CAMBIOS
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* PANEL LATERAL */}
        <aside className="w-[380px] bg-[#f8f7ff] overflow-y-auto p-6 border-r border-gray-100 z-10 relative">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Personalización</h3>

          <Acc title="Estilo y Colores" icon={Palette} defaultOpen iconColor="#7c3aed">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Temas Predefinidos</label>
            <div className="flex flex-wrap gap-3 mb-6">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  title={th.name}
                  onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110 ${cfg.theme === th.id ? 'ring-4 ring-offset-2 ring-violet-400' : 'ring-1 ring-gray-200'}`}
                  style={{ background: th.primary }}
                >
                  {cfg.theme === th.id && <Check size={16} color="white"/>}
                </button>
              ))}
            </div>

            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left mt-4 border-t border-gray-100 pt-4">Ajuste Manual de Colores</label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Fondo Arriba <input type="color" value={cfg.bg1} onChange={e => update('bg1', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Fondo Abajo <input type="color" value={cfg.bg2} onChange={e => update('bg2', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Color Principal <input type="color" value={cfg.primary} onChange={e => update('primary', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Fondo Tarjetas <input type="color" value={cfg.card} onChange={e => update('card', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Texto Principal <input type="color" value={cfg.text} onChange={e => update('text', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
              <label className="text-xs flex items-center justify-between font-bold text-slate-600">Texto Secund. <input type="color" value={cfg.muted} onChange={e => update('muted', e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></label>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <SelectInp label="Tipografía General (Global)" value={cfg.fontBody} options={FONTS} onChange={v => update("fontBody", v)} />
            </div>

            <div className="mb-4 mt-4 border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Tamaño de Textos</label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Nombre principal</span><span>{cfg.honoreeSize ?? 48}px</span></div>
                  <input type="range" min={30} max={80} value={cfg.honoreeSize ?? 48} onChange={e => update("honoreeSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Frase (Estás invitado...)</span><span>{cfg.eventTypeSize ?? 11}px</span></div>
                  <input type="range" min={8} max={24} value={cfg.eventTypeSize ?? 11} onChange={e => update("eventTypeSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mb-4 border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">
                Sombreado de Portada — <span className="text-violet-500">{cfg.coverGradientIntensity ?? 70}%</span>
              </label>
              <input type="range" min={0} max={100} step={5} value={cfg.coverGradientIntensity ?? 70} onChange={e => update("coverGradientIntensity", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1"><span>Transparente</span><span>Muy oscuro</span></div>
            </div>

            <div className="mb-2 border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Efectos y Animaciones</label>
              
              <SelectInp label="Animación de Entrada (Al abrir el link)" value={cfg.openingAnimation || "envelope"} options={OPENING_ANIMATIONS.map(a => ({label: a.name, value: a.id}))} onChange={v => { update("openingAnimation", v); setPreviewAnim(true); }} className="!mb-2" />
              <button type="button" onClick={() => setPreviewAnim(true)} className="w-full py-2 bg-violet-100 text-violet-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-violet-200 transition-colors flex items-center justify-center gap-2 mb-4">
                 ▶ REPRODUCIR ANIMACIÓN
              </button>

              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Partículas de Fondo</label>
              <div className="grid grid-cols-2 gap-2">
                {EFFECTS.map(eff => (
                  <button key={eff.id} type="button" onClick={() => update("particleEffect", eff.id)} className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${cfg.particleEffect === eff.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:border-violet-200'}`}>
                    <span className="text-base">{eff.icon}</span> {eff.name}
                  </button>
                ))}
              </div>
            </div>
          </Acc>

          <Acc title="Textos de Portada" icon={Type} iconColor="#0d9488">
            <Inp label="Nombre Agasajado" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <SelectInp className="flex-1 !mb-0" label="Fuente" value={cfg.honoreeFont || cfg.fontTitle} options={FONTS} onChange={v => update("honoreeFont", v)} />
               <div className="w-10 flex flex-col justify-end"><input type="color" value={cfg.honoreeColor || cfg.text} onChange={e => update('honoreeColor', e.target.value)} className="w-full h-11 rounded-lg cursor-pointer" /></div>
            </div>

            <div className="flex gap-2 mt-4">
              <EmojiPicker value={cfg.eventTypeEmoji || "✨"} onSelect={v => update("eventTypeEmoji", v)} />
              <div className="flex-1"><Inp label="Frase (Ej: Estás invitado a...)" value={cfg.eventType} onChange={v => update("eventType", v)} /></div>
            </div>
            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <SelectInp className="flex-1 !mb-0" label="Fuente" value={cfg.eventTypeFont || cfg.fontBody} options={FONTS} onChange={v => update("eventTypeFont", v)} />
               <div className="w-10 flex flex-col justify-end"><input type="color" value={cfg.eventTypeColor || cfg.primary} onChange={e => update('eventTypeColor', e.target.value)} className="w-full h-11 rounded-lg cursor-pointer" /></div>
            </div>

            <div className="flex gap-2 mt-4">
              <EmojiPicker value={cfg.badgeEmoji} onSelect={v => update("badgeEmoji", v)} />
              <div className="flex-1"><Inp label="Texto Medalla (Ej: 5 añitos)" value={cfg.badgeText} onChange={v => update("badgeText", v)} /></div>
            </div>
            <FileUpload label="Foto de Portada (Subir imagen)" value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
          </Acc>

          <Acc title="Banner Promocional" icon={ImageIcon} iconColor="#d97706">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Banner central</span>
              <Toggle checked={cfg.showBanner} onChange={v => update("showBanner", v)} />
            </div>
            {cfg.showBanner && (
              <>
                <Inp label="Título Banner (Ej: La Festejada)" value={cfg.bannerTitle} onChange={v => update("bannerTitle", v)} />
                <FileUpload label="Foto del Banner (Subir imagen)" value={cfg.bannerPhoto} onChange={v => update("bannerPhoto", v)} />
              </>
            )}
          </Acc>

          <Acc title="Fecha y Lugar" icon={Calendar} iconColor="#e11d48">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Mostrar cuenta regresiva</span><Toggle checked={cfg.showCountdown || false} onChange={v => update("showCountdown", v)} /></div>
            {cfg.showCountdown && (
              <>
                <Inp label="Fecha y hora del evento" type="datetime-local" value={cfg.countdownDate || ""} onChange={v => update("countdownDate", v)} />
                <p className="text-[10px] bg-violet-50 text-violet-500 font-bold p-2 rounded-lg mb-4">✅ Se mostrará automáticamente en días, horas, minutos y segundos en español.</p>
              </>
            )}

            <div className="flex items-center justify-between mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Cuadro de Fecha</span><Toggle checked={cfg.showDate} onChange={v => update("showDate", v)} /></div>
            {cfg.showDate && <Inp label="Fecha Texto (Ej: Sáb 24 Oct)" value={cfg.dateText} onChange={v => update("dateText", v)} />}

            <div className="flex items-center justify-between mt-2 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Cuadro de Horario</span><Toggle checked={cfg.showTime} onChange={v => update("showTime", v)} /></div>
            {cfg.showTime && <Inp label="Horario Texto" value={cfg.timeText} onChange={v => update("timeText", v)} />}

            <div className="flex items-center justify-between mt-2 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Ubicación y Mapa</span><Toggle checked={cfg.showLocation} onChange={v => update("showLocation", v)} /></div>
            {cfg.showLocation && (
              <>
                <Inp label="Nombre del lugar" value={cfg.locationName} onChange={v => update("locationName", v)} />
                <Inp label="Dirección exacta" placeholder="Ej: Av. San Martín 1234, Buenos Aires" value={cfg.locationAddress} onChange={v => update("locationAddress", v)} />
                <p className="text-[10px] text-violet-500 font-bold mb-4 mt-1 bg-violet-50 p-2 rounded-lg">📍 El mapa se genera automáticamente con la dirección y marca el lugar exacto. Cuanto más completa la dirección, más preciso.</p>
                <div className="flex items-center justify-between mt-4 mb-2"><span className="text-xs font-bold text-slate-500">Aclarar Estacionamiento</span><Toggle checked={cfg.showParking} onChange={v => update("showParking", v)} /></div>
                {cfg.showParking && (
                  <SelectInp label="Tipo" value={cfg.parkingType} options={[{label:"Público en la calle", value:"Estacionamiento público"}, {label:"Cubierto / Privado", value:"Estacionamiento privado cubierto"}, {label:"Al aire libre", value:"Estacionamiento al aire libre"}, {label:"Personalizado...", value:"otro"}]} onChange={v => update("parkingType", v)} />
                )}
                {cfg.showParking && cfg.parkingType === 'otro' && <Inp placeholder="Escribe aquí..." value={cfg.customParking || ""} onChange={v => update("customParking", v)} />}
              </>
            )}
          </Acc>

          <Acc title="Logo del Lugar del Evento" icon={LinkIcon} iconColor="#6366f1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar logo del lugar</span>
              <Toggle checked={cfg.showVenueLogo || false} onChange={v => update("showVenueLogo", v)} />
            </div>
            {cfg.showVenueLogo && (
              <>
                <Inp label="Nombre del lugar" value={cfg.venueName || ""} onChange={v => update("venueName", v)} placeholder="Ej: Aventura Kids" />
                <FileUpload label="Logo del lugar (imagen)" value={cfg.venueLogoUrl || ""} onChange={v => update("venueLogoUrl", v)} />
                <SelectInp label="Tipo de link" value={cfg.venueLinkType || "web"} options={[{ label: "🌐 Página web", value: "web" }, { label: "📱 WhatsApp", value: "whatsapp" }]} onChange={v => update("venueLinkType", v)} />
                <Inp label={cfg.venueLinkType === "whatsapp" ? "Número de WhatsApp (sin +)" : "URL del sitio web"} value={cfg.venueLink || ""} onChange={v => update("venueLink", v)} placeholder={cfg.venueLinkType === "whatsapp" ? "5491123456789" : "https://aventurakids.com"} />
              </>
            )}
          </Acc>

          <Acc title="Video de la Fiesta" icon={Video} iconColor="#8b5cf6">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Agregar video</span><Toggle checked={cfg.showVideo || false} onChange={v => update("showVideo", v)} /></div>
            {cfg.showVideo && (
              <>
                <Inp label="Título del video" value={cfg.videoTitle || ""} onChange={v => update("videoTitle", v)} placeholder="Ej: Un mensaje especial 💖" />
                <Inp label="Enlace de YouTube" value={cfg.videoUrl || ""} onChange={v => update("videoUrl", v)} placeholder="Ej: https://youtu.be/..." />
                <p className="text-[10px] text-violet-500 font-bold mt-1 bg-violet-50 p-2 rounded-lg">🎬 Pegá cualquier link de YouTube. Se reproducirá directamente dentro de la invitación sin que el usuario tenga que salir de la página.</p>
              </>
            )}
          </Acc>

          <Acc title="Programa (Itinerario)" icon={Clock} iconColor="#ca8a04">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Itinerario</span><Toggle checked={cfg.showItinerary} onChange={v => update("showItinerary", v)} /></div>
            {cfg.showItinerary && (
              <>
                <div className="space-y-3 mb-4">
                  {cfg.itinerary?.map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-gray-200 relative">
                      <div className="flex gap-2 mb-2">
                        <input className="w-16 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.time} onChange={e => {
                          const n = [...cfg.itinerary]; n[i].time = e.target.value; update("itinerary", n);
                        }} />
                        <input className="flex-1 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.title} onChange={e => {
                          const n = [...cfg.itinerary]; n[i].title = e.target.value; update("itinerary", n);
                        }} />
                        <button onClick={() => update("itinerary", cfg.itinerary.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                      </div>
                      <input className="w-full p-2 bg-gray-50 rounded-lg text-xs border border-gray-100 outline-none focus:border-violet-300" value={item.sub} placeholder="Descripción (opcional)" onChange={e => {
                        const n = [...cfg.itinerary]; n[i].sub = e.target.value; update("itinerary", n);
                      }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => update("itinerary", [...(cfg.itinerary || []), { time: "16:00", title: "Evento", sub: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AGREGAR EVENTO</button>
              </>
            )}
          </Acc>

          <Acc title="¿Qué vamos a comer?" icon={List} iconColor="#10b981">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Menú</span><Toggle checked={cfg.showMenu} onChange={v => update("showMenu", v)} /></div>
            {cfg.showMenu && (
              <>
                <div className="space-y-3 mb-4">
                  {cfg.menuItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200">
                      <EmojiPicker list={FOOD_EMOJIS} value={item.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} />
                      <input className="flex-1 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.label} placeholder="Comida" onChange={e => {
                        const n = [...cfg.menuItems]; n[i].label = e.target.value; update("menuItems", n);
                      }} />
                      <button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-3 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AGREGAR COMIDA</button>
              </>
            )}
          </Acc>

          <Acc title="Dress Code y Regalos" icon={Layout} iconColor="#f43f5e">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Vestimenta</span><Toggle checked={cfg.showDressCode} onChange={v => update("showDressCode", v)} /></div>
             {cfg.showDressCode && (
               <div className="flex gap-2 mb-6">
                 <EmojiPicker list={CLOTHES_EMOJIS} value={cfg.dressCodeIcon} onSelect={e => update("dressCodeIcon", e)} />
                 <div className="flex-1"><Inp value={cfg.dressCodeText} onChange={v => update("dressCodeText", v)} placeholder="Ej: Elegante Sport" className="!mb-0"/></div>
               </div>
             )}

             <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100"><span className="text-xs font-bold text-slate-500">Activar Regalos</span><Toggle checked={cfg.showGifts} onChange={v => update("showGifts", v)} /></div>
             {cfg.showGifts && (
               <>
                 <div className="flex gap-2 mb-2">
                   <EmojiPicker value={cfg.giftIcon} onSelect={e => update("giftIcon", e)} />
                   <div className="w-24"><Inp value={cfg.giftLabel} onChange={v => update("giftLabel", v)} placeholder="Título" className="!mb-0"/></div>
                   <div className="flex-1"><Inp value={cfg.giftText} onChange={v => update("giftText", v)} placeholder="Lluvia de sobres..." className="!mb-0"/></div>
                 </div>
                 <div className="flex items-center justify-between mt-4 mb-2"><span className="text-[10px] font-bold text-slate-500 uppercase">Aclaración Extra</span><Toggle checked={cfg.showGiftNote} onChange={v => update("showGiftNote", v)} /></div>
                 {cfg.showGiftNote && <Inp value={cfg.giftNoteText} onChange={v => update("giftNoteText", v)} placeholder="Ej: No traer cosas grandes" multiline />}
               </>
             )}
          </Acc>

          <Acc title="Galería de Fotos" icon={ImageIcon} iconColor="#ec4899">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Galería</span><Toggle checked={cfg.showGallery} onChange={v => update("showGallery", v)} /></div>
             {cfg.showGallery && (
               <>
                 <Inp label="Título de la Sección" value={cfg.galleryTitle} onChange={v => update("galleryTitle", v)} />
                 <div className="space-y-4 mb-4 mt-2">
                   {cfg.galleryPhotos?.map((p, i) => (
                     <div key={i} className="bg-white border border-gray-200 rounded-xl p-2 relative">
                       <FileUpload onChange={v => { const n = [...cfg.galleryPhotos]; n[i] = v; update("galleryPhotos", n); }} value={p} />
                       <button onClick={() => update("galleryPhotos", cfg.galleryPhotos.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer"><Trash2 size={14}/></button>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => update("galleryPhotos", [...(cfg.galleryPhotos || []), ""])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AÑADIR FOTO</button>
               </>
             )}
          </Acc>

          <Acc title="WhatsApp (Confirmación)" icon={CheckCircle2} iconColor="#22c55e">
            <Inp label="Número de WhatsApp (Sin +)" value={cfg.whatsappNumber} onChange={v => update("whatsappNumber", v)} placeholder="5491123456789" />
            <p className="text-[9px] text-gray-400 mb-1">Usa {"{nombre}"} para incluir el nombre automáticamente.</p>
            <Inp value={cfg.whatsappMessage} onChange={v => update("whatsappMessage", v)} multiline />
          </Acc>

        </aside>

        {/* VISTA PREVIA CENTRAL */}
        <main className="flex-1 bg-slate-900 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl relative z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center"><div className="w-10 h-1 bg-slate-800 rounded-full" /></div>
            
            {previewAnim && <OpeningAnimation cfg={cfg} onOpen={() => setPreviewAnim(false)} />}
            
            <div className="h-full w-full overflow-y-auto bg-black pb-10" style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}>
              <InvitePreview cfg={cfg} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
