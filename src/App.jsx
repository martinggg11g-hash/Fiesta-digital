import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  MapPin, Clock, Calendar, Palette, CheckCircle2, PartyPopper,
  ChevronDown, Plus, Upload, Type, LogOut, Edit2,
  Copy, ExternalLink, ArrowLeft, Save, Mail, Lock, Key, X,
  Sparkles, Star, Image as ImageIcon, Layout, List, Trash2, UserPlus, Users, Settings, ShieldCheck, Loader2, AlertCircle
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONFIGURACIÓN DE FIREBASE (ROBUSTA)
═══════════════════════════════════════════════════════════ */
const fallbackConfig = { apiKey: "demo", authDomain: "demo", projectId: "demo", storageBucket: "demo", messagingSenderId: "demo", appId: "1:0:web:0" };
let firebaseConfig = fallbackConfig;
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    firebaseConfig = JSON.parse(__firebase_config);
  }
} catch (e) {
  console.error("Configuración de Firebase inválida", e);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'fiesta-digital-v1';

/* ═══════════════════════════════════════════════════════════
   ESTILOS Y CONSTANTES GLOBALES
═══════════════════════════════════════════════════════════ */
(() => {
  if (document.getElementById("fd-global")) return;
  const s = document.createElement("style");
  s.id = "fd-global";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
    body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .fd-sb::-webkit-scrollbar { width: 4px; height: 4px; }
    .fd-sb::-webkit-scrollbar-thumb { background: #d8d4ff; border-radius: 99px; }
    @keyframes fdPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .anim-pop { animation: fdPop 0.4s cubic-bezier(0.2, 1, 0.3, 1) both; }
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .shimmer-text { background: linear-gradient(90deg, #fff, #a78bfa, #fff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
    @keyframes shimmer { to { background-position: 200% center; } }
    .invite-phone { width: 100%; max-width: 390px; border-radius: 50px; overflow: hidden; box-shadow: 0 0 0 12px #1a1a2e, 0 0 0 14px #0d0d1a, 0 32px 64px rgba(0,0,0,.65); position: relative; height: 780px; background: #000; }
    .invite-scroll { height: 100%; overflow-y: auto; scrollbar-width: none; }
    .invite-scroll::-webkit-scrollbar { display: none; }
    .fd-input { transition: all 0.2s; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); outline: none; }
    .fd-input:focus { border-color: #7c3aed; background: rgba(255,255,255,0.08); }
    .acc-body { overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.2s; }
    .fd-toggle { position: relative; width: 44px; height: 26px; flex-shrink: 0; }
    .fd-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .fd-toggle-track { position: absolute; inset: 0; border-radius: 99px; cursor: pointer; transition: .3s; background: #e2e0ef; }
    .fd-toggle-track::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: .3s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
    .fd-toggle input:checked ~ .fd-toggle-track { background: linear-gradient(135deg,#6d28d9,#8b5cf6); }
    .fd-toggle input:checked ~ .fd-toggle-track::before { transform: translateX(18px); }
  `;
  document.head.appendChild(s);
})();

const EMOJIS = ['🎂','🎈','🎉','🥳','🎁','🎊','👶','💍','🎓','✨','🌟','❤️','💖','🦖','🦄','⚽','🎮','👑','🌸','🍕','🍰','🥂','🍻','🎭','🎶','📸','🚗','💒','🏖️','🌈','🔥','💎','🎪','🎠','🎡','🦋','🌺','🎵','🏆'];

const THEMES = [
  { id:"violet", name:"Violeta", emoji:"💜", bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4" },
  { id:"rose",   name:"Rosa",    emoji:"🌸", bg1:"#150510", bg2:"#200a16", primary:"#e11d48", card:"#2a0e1a", text:"#fff1f3", muted:"#fda4af" },
  { id:"teal",   name:"Teal",    emoji:"🌊", bg1:"#020f10", bg2:"#031a1c", primary:"#0d9488", card:"#062020", text:"#f0fdfb", muted:"#5eead4" },
  { id:"amber",  name:"Ámbar",   emoji:"🔥", bg1:"#0f0800", bg2:"#1c1200", primary:"#d97706", card:"#1a1000", text:"#fffbeb", muted:"#fcd34d" },
];

const DEF_CONFIG = {
  theme:"violet", fontTitle:"'Pacifico', cursive", fontBody:"'DM Sans', sans-serif",
  bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4",
  eventType:"✨ Estás invitado al cumple de", honoreeName:"Valentina", badgeEmoji:"🎂", badgeText:"5 añitos",
  coverPhoto:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  showBanner:true, bannerTitle:"La festejada", bannerPhoto:"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&w=400&q=80",
  showDate:true, dateText:"Sábado 24 de Octubre", showTime:true, timeText:"16:00 a 20:00 hs",
  showTheme:true, themeIcon:"🦕", themeLabel:"Temática", themeText:"Dinosaurios",
  showLocation:true, locationName:"Aventura Kids", locationAddress:"Av. San Martín 1234", showParking:true, parkingType:"🚘 Estacionamiento interno",
  showItinerary:true, itinerary:[{ time:"16:00", title:"Bienvenida", sub:"Recepción de invitados" }],
  showMenu:true, menuItems:[{ emoji:"🍕", label:"Pizza Party" }, { emoji:"🥤", label:"Gaseosas" }],
  showDressCode:true, dressCodeIcon:"👗", dressCodeText:"Elegante Sport",
  showGifts:true, giftIcon:"🎁", giftLabel:"Regalos", giftText:"Lluvia de sobres", showGiftNote:false, giftNoteText:"",
  showGallery:false, galleryTitle:"Fotos", galleryPhotos:[],
  whatsappNumber:"5491123456789", whatsappMessage:"¡Hola! Confirmo mi asistencia para el evento 🎉",
};

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

/* ═══════════════════════════════════════════════════════════
   MICRO COMPONENTES UI
═══════════════════════════════════════════════════════════ */
const Toast = ({ msg }) => (
  <div className="anim-pop fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 fd-input rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 fd-input rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
    )}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <label className="fd-toggle">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className="fd-toggle-track" />
  </label>
);

const EmojiPicker = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} type="button" className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 text-2xl flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none">{value}</button>
      {open && (
        <div className="absolute top-14 left-0 z-50 bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto fd-sb">
            {EMOJIS.map(e => <button key={e} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-gray-100 rounded-lg">{e}</button>)}
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
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="acc-body" style={{ maxHeight: open ? '3000px' : '0', opacity: open ? 1 : 0 }}>
        <div className="p-4 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PREVIEW DE INVITACIÓN (VISTA FINAL Y EDITOR)
═══════════════════════════════════════════════════════════ */
const InvitePreview = ({ cfg }) => {
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary;
  const bg = `linear-gradient(180deg, ${cfg.bg1 || th.bg1} 0%, ${cfg.bg2 || th.bg2} 100%)`;

  const InfoCard = ({ icon: Icon, label, value, sub }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5" style={{ background: cfg.card || th.card }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}>
        <Icon size={20} color="white" />
      </div>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: cfg.muted || th.muted }}>{label}</p>
        <p className="font-bold text-sm" style={{ color: cfg.text || th.text }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 opacity-70" style={{ color: cfg.muted || th.muted }}>{sub}</p>}
      </div>
    </div>
  );

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-12">
      {/* Portada */}
      <div className="relative h-[420px] overflow-hidden">
        <img src={cfg.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${cfg.bg1 || th.bg1} 10%, transparent 80%)` }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: primary }}>{cfg.eventType}</p>
          <h1 style={{ fontFamily: cfg.fontTitle, color: cfg.text || th.text }} className="text-5xl leading-tight mb-4">{cfg.honoreeName}</h1>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md bg-black/30 font-black text-sm" style={{ color: cfg.text || th.text }}>
            {cfg.badgeEmoji} {cfg.badgeText}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-10 space-y-4">
        {/* Banner Secundario */}
        {cfg.showBanner && (
          <div className="relative h-48 rounded-3xl overflow-hidden border-2" style={{ borderColor: `${primary}44` }}>
            <img src={cfg.bannerPhoto} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-white">{cfg.bannerTitle}</div>
            <div className="absolute bottom-4 left-4 text-left">
              <h2 style={{ fontFamily: cfg.fontTitle }} className="text-2xl text-white">{cfg.honoreeName}</h2>
            </div>
          </div>
        )}

        {/* Datos Básicos */}
        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={cfg.dateText} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} />}
        {cfg.showTheme && <InfoCard icon={Star} label={cfg.themeLabel} value={`${cfg.themeIcon} ${cfg.themeText}`} />}

        {/* Ubicación y Mapa */}
        {cfg.showLocation && (
          <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: cfg.card || th.card }}>
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}>
                <MapPin size={20} color="white" />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: cfg.muted || th.muted }}>¿Dónde?</p>
                <p className="font-bold text-sm" style={{ color: cfg.text || th.text }}>{cfg.locationName}</p>
                <p className="text-[11px] opacity-70" style={{ color: cfg.muted || th.muted }}>{cfg.locationAddress}</p>
              </div>
            </div>
            {cfg.locationName && (
               <iframe className="w-full h-40 border-none opacity-80" src={`https://www.google.com/maps?q=${encodeURIComponent(cfg.locationName + " " + cfg.locationAddress)}&output=embed`} title="map" />
            )}
            {cfg.showParking && (
               <div className="p-3 text-center border-t border-white/5">
                 <span className="text-[10px] font-bold py-1 px-3 rounded-full" style={{ background: `${primary}22`, color: primary }}>{cfg.parkingType}</span>
               </div>
            )}
          </div>
        )}

        {/* Itinerario */}
        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: cfg.muted || th.muted }}>Programa del evento</h4>
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': `${primary}33` }}>
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: primary, opacity: 0.2 }} />
              {cfg.itinerary.map((item, i) => (
                <div key={i} className="relative text-left">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full" style={{ background: primary, boxShadow: `0 0 10px ${primary}` }} />
                  <p className="text-[10px] font-black mb-1" style={{ color: primary }}>{item.time}</p>
                  <p className="font-bold text-sm" style={{ color: cfg.text || th.text }}>{item.title}</p>
                  <p className="text-xs opacity-60" style={{ color: cfg.muted || th.muted }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menú */}
        {cfg.showMenu && cfg.menuItems?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: cfg.muted || th.muted }}>¿Qué vamos a comer?</h4>
            <div className="grid grid-cols-2 gap-3">
              {cfg.menuItems.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl text-center border border-white/5" style={{ background: cfg.card || th.card }}>
                  <span className="text-3xl block mb-2">{m.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: cfg.text || th.text }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dress Code y Regalos */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {cfg.showDressCode && (
            <div className="p-5 rounded-2xl text-center border border-white/5" style={{ background: cfg.card || th.card }}>
              <span className="text-3xl block mb-2">{cfg.dressCodeIcon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: cfg.muted || th.muted }}>Vestimenta</p>
              <p className="font-bold text-xs" style={{ color: cfg.text || th.text }}>{cfg.dressCodeText}</p>
            </div>
          )}
          {cfg.showGifts && (
            <div className="p-5 rounded-2xl text-center border border-white/5" style={{ background: cfg.card || th.card }}>
              <span className="text-3xl block mb-2">{cfg.giftIcon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: cfg.muted || th.muted }}>{cfg.giftLabel}</p>
              <p className="font-bold text-xs" style={{ color: cfg.text || th.text }}>{cfg.giftText}</p>
            </div>
          )}
        </div>

        {cfg.showGifts && cfg.showGiftNote && cfg.giftNoteText && (
          <div className="text-center pt-2">
            <span className="inline-flex py-2 px-4 rounded-full text-[10px] font-bold border" style={{ background: `${primary}15`, borderColor: `${primary}33`, color: primary }}>{cfg.giftNoteText}</span>
          </div>
        )}

        {/* Galería de Fotos */}
        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: cfg.muted || th.muted }}>{cfg.galleryTitle}</h4>
            <div className="flex gap-3 overflow-x-auto pb-4 fd-sb -mx-5 px-5">
              {cfg.galleryPhotos.map((p, i) => (
                <img key={i} src={p} className="w-32 h-32 rounded-2xl object-cover shrink-0 border border-white/5" alt={`Galeria ${i}`} />
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage.replace('{nombre}', cfg.honoreeName))}`)}
          className="w-full py-5 mt-4 rounded-[1.5rem] font-black text-sm tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-transform active:scale-95 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)`, color: 'white', boxShadow: `0 15px 35px ${primary}44` }}
        >
          <CheckCircle2 size={20} /> CONFIRMAR ASISTENCIA
        </button>
        <p className="text-center text-[9px] font-bold opacity-30 mt-8" style={{ color: cfg.muted || th.muted }}>FiestaDigital © 2024</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PANTALLAS DE AUTENTICACIÓN
═══════════════════════════════════════════════════════════ */
const LoginScreen = ({ isMaster = false, onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (isMaster && email === "owner@fiestadigital.com" && pass === "owner123") {
      onLogin({ name: "Oswaldo Master", role: "owner", email });
      navigate("/dashboard");
      return;
    }

    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'salones'));
    onSnapshot(q, (snap) => {
      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const found = users.find(u => u.email === email && u.pass === pass);
      if (found) {
        onLogin(found);
        navigate("/dashboard");
      } else if (!isMaster) {
        setError("Credenciales no válidas.");
      } else {
        setError("Acceso maestro denegado.");
      }
      setLoading(false);
    }, (err) => { 
      console.error(err); 
      setLoading(false); 
      setError("Error conectando a la base de datos.");
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isMaster ? 'bg-slate-950' : 'bg-[#08060f]'}`}>
      <div className="w-full max-w-md anim-pop">
        <div className="text-center mb-10">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-2xl ${isMaster ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600'}`}>
            {isMaster ? <ShieldCheck size={40} color="white"/> : <PartyPopper size={40} color="white"/>}
          </div>
          <h1 className="text-white text-3xl font-black font-['Syne']">Fiesta<span className="shimmer-text">Digital</span></h1>
          <p className="text-slate-500 mt-2 text-sm">{isMaster ? "Administración Central" : "Acceso para Salones"}</p>
        </div>
        <div className="glass p-10 rounded-[2.5rem]">
          <form onSubmit={handleAuth} className="space-y-2">
            {error && (
              <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <Inp label={isMaster ? "Email Maestro" : "Email de Salón"} value={email} onChange={setEmail} placeholder={isMaster ? "owner@..." : "admin@fiesta.com"} />
            <Inp label="Clave" type="password" value={pass} onChange={setPass} placeholder="••••••" />
            <button disabled={loading} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" /> : "Ingresar al Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PANTALLA DASHBOARD (MASTER Y SALÓN)
═══════════════════════════════════════════════════════════ */
const DashboardScreen = ({ user, onLogout }) => {
  const [salones, setSalones] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [invToDelete, setInvToDelete] = useState(null);
  const [newSalon, setNewSalon] = useState({ name: "", email: "", pass: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.role) return;
    const unsubS = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'salones'), (s) => setSalones(s.docs.map(d => ({id:d.id, ...d.data()}))), e => console.error(e));
    const unsubI = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'invitations'), (s) => {
      setInvitations(s.docs.map(d => {
        const data = d.data();
        return { id: d.id, ...data, config: data.config || DEF_CONFIG };
      }));
      setLoading(false);
    }, e => console.error(e));
    return () => { unsubS(); unsubI(); };
  }, [user]);

  if (!user || !user.role) return <Navigate to="/" />;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);

  const handleCreateSalon = async (e) => {
    e.preventDefault();
    if (!newSalon.name || !newSalon.email || !newSalon.pass) {
      setToast("Completá todos los campos.");
      setTimeout(() => setToast(""), 2000);
      return;
    }
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'salones'), { ...newSalon, role: "salon", createdAt: new Date().toISOString() });
    setShowModal(false);
    setNewSalon({ name:"", email:"", pass:"" });
    setToast("Salón creado con éxito.");
    setTimeout(() => setToast(""), 2000);
  };

  const handleCreateInv = async () => {
    const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'invitations'), {
      salonId: user.email,
      salonName: user.name,
      title: "Nuevo Cumpleaños",
      config: DEF_CONFIG,
      createdAt: new Date().toISOString()
    });
    navigate(`/editor/${docRef.id}`);
  };

  const copy = id => {
    const url = `${window.location.origin}/i/${slugify(user.name)}/${id}`;
    const el = document.createElement('textarea'); el.value = url; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    setToast("¡Link copiado para enviar!"); setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <nav className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-['Syne'] font-extrabold text-xl">Fiesta<span className="text-violet-600">Digital</span></div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-800">{user.name}</p>
            <p className="text-[9px] text-violet-500 font-black uppercase tracking-widest">{isOwner ? "Dueño" : "Socio"}</p>
          </div>
          <button onClick={() => { signOut(auth); onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"><LogOut size={18}/></button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black text-slate-900 font-['Syne'] tracking-tight">{isOwner ? "Panel Maestro" : "Mis Eventos"}</h1>
            <p className="text-slate-400 mt-2">{isOwner ? `Gestionando ${salones.length} socios activos` : `Tenés ${myInvs.length} invitaciones creadas`}</p>
          </div>
          <button onClick={isOwner ? () => setShowModal(true) : handleCreateInv} className="px-8 py-4 bg-violet-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-violet-200 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer">
            {isOwner ? <UserPlus size={20}/> : <Plus size={20}/>} {isOwner ? "Nuevo Salón" : "Crear Invitación"}
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-violet-600" size={40}/></div>
        ) : isOwner ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salones.map(s => (
              <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group text-left">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors"><Users size={28}/></div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Activo</span>
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-1">{s.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{s.email}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="text-xs font-bold text-slate-500">{invitations.filter(i => i.salonId === s.email).length} Invitaciones</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myInvs.map(inv => (
              <div key={inv.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group text-left relative">
                <button onClick={() => setInvToDelete(inv.id)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500/90 backdrop-blur text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 shadow-lg"><Trash2 size={16}/></button>
                <div className="h-44 relative overflow-hidden">
                  <img src={inv.config?.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-7">
                  <h3 className="font-black text-xl text-slate-900 mb-6 truncate">{inv.title}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-violet-600 transition-colors cursor-pointer"><Edit2 size={14}/> Editar</button>
                    <button onClick={() => copy(inv.id)} className="w-14 h-14 border border-gray-100 rounded-2xl flex items-center justify-center text-violet-600 hover:bg-violet-50 transition-all cursor-pointer"><Copy size={20}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Salón */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 anim-pop">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 font-['Syne']">Nuevo Socio</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-600 cursor-pointer"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreateSalon}>
              <Inp label="Nombre del Salón" value={newSalon.name} onChange={v => setNewSalon({...newSalon, name:v})} placeholder="Ej: Aventura Kids" />
              <Inp label="Email de Usuario" value={newSalon.email} onChange={v => setNewSalon({...newSalon, email:v})} placeholder="salon@mail.com" />
              <Inp label="Clave Temporal" value={newSalon.pass} onChange={v => setNewSalon({...newSalon, pass:v})} placeholder="123456" />
              <button className="w-full py-5 mt-4 bg-violet-600 hover:bg-violet-500 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-violet-200 cursor-pointer transition-colors">ACTIVAR CUENTA</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Invitación */}
      {invToDelete && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center anim-pop">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={24}/></div>
            <h2 className="text-xl font-black text-slate-900 font-['Syne'] mb-2">¿Eliminar invitación?</h2>
            <p className="text-sm text-slate-500 mb-8">Esta acción no se puede deshacer y el link dejará de funcionar.</p>
            <div className="flex gap-3">
              <button onClick={() => setInvToDelete(null)} type="button" className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold cursor-pointer hover:bg-gray-200">Cancelar</button>
              <button onClick={async () => { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invitations', invToDelete)); setInvToDelete(null); }} type="button" className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold cursor-pointer hover:bg-red-600 shadow-lg shadow-red-500/30">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PANTALLA EDITOR COMPLETO
═══════════════════════════════════════════════════════════ */
const EditorScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'invitations', id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setInv({ id: snap.id, ...data, config: data.config || DEF_CONFIG });
      }
    });
  }, [id]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando editor...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));

  const handleSave = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invitations', id), {
      title: inv.title,
      config: inv.config
    });
    setSaving(false);
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"><ArrowLeft size={20}/></button>
          <input className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5 focus:bg-white/10 transition-colors" value={inv.title} onChange={e => setInv({...inv, title: e.target.value})} />
        </div>
        <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl shadow-violet-900/40 cursor-pointer transition-colors">
          {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} GUARDAR CAMBIOS
        </button>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL LATERAL DE EDICIÓN - 100% COMPLETO */}
        <aside className="w-[380px] bg-[#f8f7ff] overflow-y-auto p-6 fd-sb border-r border-gray-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Personalización</h3>
          
          <Acc title="Estilo y Colores" icon={Palette} defaultOpen iconColor="#7c3aed">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setInv({...inv, config: {...inv.config, theme: th.id, ...th}})} className={`h-12 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${inv.config.theme === th.id ? 'bg-violet-600 text-white ring-4 ring-violet-100' : 'bg-gray-100 text-slate-400 hover:bg-gray-200'}`}>{th.emoji}</button>
              ))}
            </div>
            <Inp label="Tipografía de Título" value={inv.config.fontTitle || ""} onChange={v => update("fontTitle", v)} />
          </Acc>

          <Acc title="Textos de Portada" icon={Type} iconColor="#0d9488">
            <Inp label="Nombre Agasajado" value={inv.config.honoreeName || ""} onChange={v => update("honoreeName", v)} />
            <Inp label="Subtítulo del evento" value={inv.config.eventType || ""} onChange={v => update("eventType", v)} />
            <div className="flex gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-left">Emoji</label>
                <EmojiPicker value={inv.config.badgeEmoji || "🎂"} onSelect={v => update("badgeEmoji", v)} />
              </div>
              <div className="flex-1"><Inp label="Texto Medalla (Ej: 5 añitos)" value={inv.config.badgeText || ""} onChange={v => update("badgeText", v)} /></div>
            </div>
            <Inp label="URL Foto Portada (Opcional)" value={inv.config.coverPhoto || ""} onChange={v => update("coverPhoto", v)} />
          </Acc>

          <Acc title="Banner Promocional" icon={ImageIcon} iconColor="#d97706">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Banner</span>
              <Toggle checked={inv.config.showBanner || false} onChange={v => update("showBanner", v)} />
            </div>
            {inv.config.showBanner && (
              <>
                <Inp label="Título Banner" value={inv.config.bannerTitle || ""} onChange={v => update("bannerTitle", v)} />
                <Inp label="URL Foto Banner" value={inv.config.bannerPhoto || ""} onChange={v => update("bannerPhoto", v)} />
              </>
            )}
          </Acc>

          <Acc title="Fecha y Lugar" icon={Calendar} iconColor="#e11d48">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Fecha</span>
              <Toggle checked={inv.config.showDate || false} onChange={v => update("showDate", v)} />
            </div>
            {inv.config.showDate && <Inp label="Fecha Texto" value={inv.config.dateText || ""} onChange={v => update("dateText", v)} />}
            
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Horario</span>
              <Toggle checked={inv.config.showTime || false} onChange={v => update("showTime", v)} />
            </div>
            {inv.config.showTime && <Inp label="Horario Texto" value={inv.config.timeText || ""} onChange={v => update("timeText", v)} />}
            
            <div className="flex items-center justify-between mt-2 mb-4 border-t border-gray-100 pt-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Ubicación</span>
              <Toggle checked={inv.config.showLocation || false} onChange={v => update("showLocation", v)} />
            </div>
            {inv.config.showLocation && (
              <>
                <Inp label="Lugar Nombre" value={inv.config.locationName || ""} onChange={v => update("locationName", v)} />
                <Inp label="Dirección GPS" value={inv.config.locationAddress || ""} onChange={v => update("locationAddress", v)} />
                <div className="flex items-center justify-between mt-2 mb-2">
                  <span className="text-xs font-bold text-slate-500">Mostrar Estacionamiento</span>
                  <Toggle checked={inv.config.showParking || false} onChange={v => update("showParking", v)} />
                </div>
                {inv.config.showParking && (
                  <Inp label="Tipo Estacionamiento" value={inv.config.parkingType || ""} onChange={v => update("parkingType", v)} />
                )}
              </>
            )}
          </Acc>

          <Acc title="Programa (Itinerario)" icon={Clock} iconColor="#ca8a04">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Itinerario</span>
              <Toggle checked={inv.config.showItinerary || false} onChange={v => update("showItinerary", v)} />
            </div>
            {inv.config.showItinerary && (
              <>
                <div className="space-y-3 mb-4">
                  {inv.config.itinerary?.map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-gray-200 relative">
                      <div className="flex gap-2 mb-2">
                        <input className="w-16 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.time || ""} onChange={e => {
                          const n = [...inv.config.itinerary]; n[i].time = e.target.value; update("itinerary", n);
                        }} />
                        <input className="flex-1 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.title || ""} onChange={e => {
                          const n = [...inv.config.itinerary]; n[i].title = e.target.value; update("itinerary", n);
                        }} />
                        <button onClick={() => update("itinerary", inv.config.itinerary.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                      </div>
                      <input className="w-full p-2 bg-gray-50 rounded-lg text-xs border border-gray-100 outline-none focus:border-violet-300" value={item.sub || ""} placeholder="Descripción (opcional)" onChange={e => {
                        const n = [...inv.config.itinerary]; n[i].sub = e.target.value; update("itinerary", n);
                      }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => update("itinerary", [...(inv.config.itinerary || []), { time: "16:00", title: "Evento", sub: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AGREGAR EVENTO</button>
              </>
            )}
          </Acc>

          <Acc title="¿Qué vamos a comer?" icon={List} iconColor="#10b981">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Menú</span>
              <Toggle checked={inv.config.showMenu || false} onChange={v => update("showMenu", v)} />
            </div>
            {inv.config.showMenu && (
              <>
                <div className="space-y-3 mb-4">
                  {inv.config.menuItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200">
                      <EmojiPicker value={item.emoji || "🍕"} onSelect={e => { const n = [...inv.config.menuItems]; n[i].emoji = e; update("menuItems", n); }} />
                      <input className="flex-1 p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100 outline-none focus:border-violet-300" value={item.label || ""} placeholder="Nombre comida" onChange={e => {
                        const n = [...inv.config.menuItems]; n[i].label = e.target.value; update("menuItems", n);
                      }} />
                      <button onClick={() => update("menuItems", inv.config.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-3 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => update("menuItems", [...(inv.config.menuItems || []), { emoji: "🍕", label: "Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AGREGAR COMIDA</button>
              </>
            )}
          </Acc>

          <Acc title="Dress Code y Regalos" icon={Layout} iconColor="#f43f5e">
             <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Vestimenta</span>
              <Toggle checked={inv.config.showDressCode || false} onChange={v => update("showDressCode", v)} />
             </div>
             {inv.config.showDressCode && (
               <div className="flex gap-2 mb-6">
                 <EmojiPicker value={inv.config.dressCodeIcon || "👗"} onSelect={e => update("dressCodeIcon", e)} />
                 <div className="flex-1"><Inp value={inv.config.dressCodeText || ""} onChange={v => update("dressCodeText", v)} placeholder="Ej: Elegante Sport" className="!mb-0"/></div>
               </div>
             )}

             <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-bold text-slate-500">Activar Regalos</span>
              <Toggle checked={inv.config.showGifts || false} onChange={v => update("showGifts", v)} />
             </div>
             {inv.config.showGifts && (
               <>
                 <div className="flex gap-2 mb-2">
                   <EmojiPicker value={inv.config.giftIcon || "🎁"} onSelect={e => update("giftIcon", e)} />
                   <div className="w-24"><Inp value={inv.config.giftLabel || ""} onChange={v => update("giftLabel", v)} placeholder="Título" className="!mb-0"/></div>
                   <div className="flex-1"><Inp value={inv.config.giftText || ""} onChange={v => update("giftText", v)} placeholder="Lluvia de sobres..." className="!mb-0"/></div>
                 </div>
                 <div className="flex items-center justify-between mt-4 mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Nota Adicional</span>
                  <Toggle checked={inv.config.showGiftNote || false} onChange={v => update("showGiftNote", v)} />
                 </div>
                 {inv.config.showGiftNote && (
                   <Inp value={inv.config.giftNoteText || ""} onChange={v => update("giftNoteText", v)} placeholder="Ej: No traer regalos grandes" multiline />
                 )}
               </>
             )}
          </Acc>

          <Acc title="Galería de Fotos" icon={ImageIcon} iconColor="#ec4899">
             <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Galería</span>
              <Toggle checked={inv.config.showGallery || false} onChange={v => update("showGallery", v)} />
             </div>
             {inv.config.showGallery && (
               <>
                 <Inp label="Título de la Sección" value={inv.config.galleryTitle || ""} onChange={v => update("galleryTitle", v)} />
                 <div className="space-y-2 mb-4">
                   {inv.config.galleryPhotos?.map((p, i) => (
                     <div key={i} className="flex items-center gap-2">
                       <input className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-violet-400" value={p || ""} onChange={e => {
                         const n = [...inv.config.galleryPhotos]; n[i] = e.target.value; update("galleryPhotos", n);
                       }} placeholder="URL de la imagen" />
                       <button onClick={() => update("galleryPhotos", inv.config.galleryPhotos.filter((_, idx) => idx !== i))} type="button" className="p-3 text-red-400 bg-white border border-gray-200 rounded-xl hover:bg-red-50 cursor-pointer"><Trash2 size={16}/></button>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => update("galleryPhotos", [...(inv.config.galleryPhotos || []), ""])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AÑADIR IMAGEN (URL)</button>
               </>
             )}
          </Acc>

          <Acc title="WhatsApp y Config" icon={CheckCircle2} iconColor="#22c55e">
            <Inp label="Número de WhatsApp (Sin +)" value={inv.config.whatsappNumber || ""} onChange={v => update("whatsappNumber", v)} placeholder="5491123456789" />
            <Inp label="Mensaje de Confirmación" value={inv.config.whatsappMessage || ""} onChange={v => update("whatsappMessage", v)} multiline />
          </Acc>

        </aside>

        {/* CONTENEDOR VISTA PREVIA (CELULAR) */}
        <main className="flex-1 bg-slate-900 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
            </div>
            <div className="invite-scroll bg-black">
              <InvitePreview cfg={inv.config} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   VISTA PÚBLICA (EL INVITADO ENTRA ACÁ)
═══════════════════════════════════════════════════════════ */
const PublicInviteScreen = () => {
  const { invId } = useParams();
  const [inv, setInv] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'invitations', invId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setInv({ id: snap.id, ...data, config: data.config || DEF_CONFIG });
      }
    });
  }, [invId]);

  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 size={30} className="animate-spin text-white"/></div>;

  return (
    <div className="bg-black min-h-screen flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-white shadow-2xl relative overflow-x-hidden">
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RAÍZ DE LA APLICACIÓN
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Error de autenticación", e);
      }
      setAuthReady(true);
    };
    init();
    
    // Solo actualizamos si el usuario actual NO tiene un rol asignado por nuestro login (para no pisar el state del dashboard)
    const unsub = onAuthStateChanged(auth, (u) => { 
      setUser(prev => (prev && prev.role) ? prev : u); 
    });
    return () => unsub();
  }, []);

  if (!authReady) return <div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-violet-600"/></div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen onLogin={setUser} />} />
        <Route path="/master" element={<LoginScreen isMaster={true} onLogin={setUser} />} />
        <Route path="/dashboard" element={<DashboardScreen user={user} onLogout={() => setUser(null)} />} />
        <Route path="/editor/:id" element={<EditorScreen />} />
        <Route path="/i/:salon/:invId" element={<PublicInviteScreen />} />
      </Routes>
    </Router>
  );
}
