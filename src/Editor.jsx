import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OpeningAnimation } from "./Lotties";

// INTEGRACIÓN OFICIAL DE GIPHY
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

import {
  MapPin, Clock, Calendar, Palette, CheckCircle2,
  ChevronDown, Type, Edit2, ArrowLeft, Save, X,
  Star, Image as ImageIcon, Layout, List, Trash2, Loader2, Check,
  Video, Link as LinkIcon, Sparkles, Mail, Goal, Gift, Music, Key, Ghost, Cat, Zap
} from "lucide-react";

/* ============================================================================
   CONFIGURACIÓN DE GIPHY (API KEY CONECTADA)
============================================================================ */
const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');

/* ============================================================================
   CONFIGURACIONES Y CONSTANTES
============================================================================ */
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
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
  { id: "none", name: "Sin Animación", icon: <X size={14}/> },
  { id: "envelope", name: "Sobre Elegante", icon: <Mail size={14}/> },
  { id: "chest", name: "Baúl del Tesoro", icon: <Key size={14}/> },
  { id: "soccer", name: "Cancha de Fútbol", icon: <Goal size={14}/> },
  { id: "musicbox", name: "Caja Musical", icon: <Music size={14}/> },
  { id: "gift", name: "Regalo Sorpresa", icon: <Gift size={14}/> },
  { id: "amongus", name: "Among Us", icon: <Ghost size={14}/> },
  { id: "tiger", name: "Tigre Animado", icon: <Cat size={14}/> },
];

export const TRANSITION_OPTS = [
  { label: "Desvanecer (Fade)", value: "fade" },
  { label: "Deslizar arriba", value: "slideUp" },
  { label: "Zoom Salida", value: "zoomOut" },
  { label: "Zoom Entrada", value: "zoomIn" }
];

export const DEF_CONFIG = {
  theme:"violet", fontTitle:"'Pacifico', cursive", fontBody:"'DM Sans', sans-serif",
  honoreeSize: 48, honoreeFont: "'Pacifico', cursive", honoreeColor: "#f0ecff",
  eventTypeSize: 11, eventTypeFont: "'DM Sans', sans-serif", eventTypeColor: "#7c3aed",
  bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4",
  coverGradientIntensity: 70, particleEffect: "none", 
  openingAnimation: "envelope", animationDuration: 2, animationTransition: "fade",
  eventTypeEmoji:"✨", eventType:"Estás invitado al cumple de", honoreeName:"Valentina", badgeEmoji:"🎂", badgeText:"5 añitos",
  coverPhoto:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  showBanner:true, bannerTitle:"La festejada", bannerPhoto:"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&w=400&q=80",
  useGiphyBanner: false,
  showDate:true, dateText:"Sábado 24 de Octubre", showTime:true, timeText:"16:00 a 20:00 hs",
  showLocation:true, locationName:"Aventura Kids", locationAddress:"Av. San Martín 1234",
  showParking:true, parkingType:"Estacionamiento público",
  showItinerary:true, itinerary:[{ time:"16:00", title:"Bienvenida", sub:"Recepción" }],
  showMenu:true, menuItems:[{ emoji:"🍕", label:"Pizza Party" }],
  showDressCode:true, dressCodeIcon:"👗", dressCodeText:"Elegante Sport",
  showGifts:true, giftIcon:"🎁", giftLabel:"Regalos", giftText:"Lluvia de sobres",
  showGallery:false, galleryPhotos:[],
  showVideo:false, videoUrl:"", videoTitle:"",
  showVenueLogo:false, venueLogoUrl:"", venueName:"", venueLink:"", venueLinkType:"web",
  whatsappNumber:"5491123456789", whatsappMessage:"¡Hola! Confirmo mi asistencia 🎉",
};

/* ============================================================================
   COMPONENTES DE INTERFAZ
============================================================================ */

const GiphySearch = ({ onSelect }) => {
  const [term, setTerm] = useState("cumpleaños");
  const [debouncedTerm, setDebouncedTerm] = useState("cumpleaños");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(term), 600);
    return () => clearTimeout(t);
  }, [term]);

  const fetchGifs = (offset) => gf.search(debouncedTerm || "party", { offset, limit: 10, lang: 'es' });

  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-2 mb-4">
      <input 
        value={term} 
        onChange={(e) => setTerm(e.target.value)} 
        placeholder="Buscar GIF (ej: azul, globos...)" 
        className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:border-violet-400 outline-none mb-3 shadow-sm" 
      />
      <div className="h-48 overflow-y-auto fd-sb rounded-xl bg-white border border-slate-100">
        <Grid 
          width={300} 
          columns={2} 
          fetchGifs={fetchGifs} 
          key={debouncedTerm} 
          onGifClick={(gif, e) => { e.preventDefault(); onSelect(gif.images.original.url); }} 
        />
      </div>
    </div>
  );
};

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
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

const FileUpload = ({ label, onChange, value }) => {
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
      <input type="file" accept="image/*" onChange={handleFile} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
      {value && <img src={value} alt="preview" className="mt-3 h-20 w-full object-cover rounded-xl border border-gray-200" />}
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
      <button onClick={() => setOpen(!open)} type="button" className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 text-2xl flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">{value}</button>
      {open && (
        <div className="absolute top-14 left-0 z-50 bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto fd-sb">
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
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
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
   VISTA PREVIA CELULAR
============================================================================ */
export const InvitePreview = ({ cfg }) => {
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary;
  const bg = `linear-gradient(180deg, ${cfg.bg1 || th.bg1} 0%, ${cfg.bg2 || th.bg2} 100%)`;
  const textC = cfg.text || th.text;
  const mutedC = cfg.muted || th.muted;
  const cardC  = cfg.card  || th.card;
  const gradOpacity = ((cfg.coverGradientIntensity ?? 70) / 100).toFixed(2);

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-12 relative overflow-x-hidden">
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
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md bg-black/30 font-black text-sm text-white">
            {cfg.badgeEmoji} {cfg.badgeText}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4 text-center">
        {cfg.showBanner && (
           <div className="relative h-44 rounded-[2rem] overflow-hidden border border-white/10">
              <img src={cfg.bannerPhoto || DEF_CONFIG.bannerPhoto} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-0 right-0 px-4 text-white font-bold text-sm drop-shadow-md">{cfg.bannerTitle}</div>
           </div>
        )}
        <div className="p-6 rounded-[2rem] border border-white/10" style={{ background: cardC }}>
           <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-2" style={{ color: mutedC }}>¿Cuándo?</p>
           <p className="text-lg font-bold" style={{ color: textC }}>{cfg.dateText}</p>
        </div>
        <div className="p-6 rounded-[2rem] border border-white/10" style={{ background: cardC }}>
           <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-2" style={{ color: mutedC }}>¿Dónde?</p>
           <p className="text-lg font-bold" style={{ color: textC }}>{cfg.locationName}</p>
        </div>
        <button className="w-full py-5 rounded-[1.5rem] font-black text-sm tracking-widest text-white shadow-2xl transition-transform active:scale-95" style={{ background: primary }}>
           CONFIRMAR ASISTENCIA
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   PANTALLA EDITOR PRINCIPAL
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

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"><ArrowLeft size={20}/></button>
          <input className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5" value={inv.title} onChange={e => setInv({...inv, title: e.target.value})} />
        </div>
        <button onClick={() => { onSave(inv); navigate("/dashboard"); }} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl transition-all shadow-violet-900/40">
          <Save size={16}/> GUARDAR CAMBIOS
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* PANEL LATERAL DE HERRAMIENTAS */}
        <aside className="w-[380px] bg-[#f8f7ff] overflow-y-auto p-6 border-r border-gray-100 z-10 relative fd-sb">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Personalización</h3>

          <Acc title="Estilo y Colores" icon={Palette} defaultOpen iconColor="#7c3aed">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Temas Sugeridos</label>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})} className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${cfg.theme === th.id ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent'}`} style={{ background: th.primary }} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Primario</label><input type="color" value={cfg.primary} onChange={e => update('primary', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo</label><input type="color" value={cfg.bg1} onChange={e => update('bg1', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
            </div>
            <SelectInp label="Tipografía Global" value={cfg.fontBody} options={FONTS} onChange={v => update("fontBody", v)} />
          </Acc>

          <Acc title="Animación de Entrada" icon={Sparkles} iconColor="#f59e0b">
             <SelectInp label="Tipo de Animación" value={cfg.openingAnimation} options={OPENING_ANIMATIONS.map(a => ({label: a.name, value: a.id}))} onChange={v => { update("openingAnimation", v); setPreviewAnim(true); }} />
             
             {cfg.openingAnimation !== 'none' && (
               <>
                 <SelectInp label="Efecto de Salida" value={cfg.animationTransition || 'fade'} options={TRANSITION_OPTS} onChange={v => update("animationTransition", v)} />
                 <div className="mb-4 text-left">
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1.5"><span>Duración</span><span>{cfg.animationDuration || 2} seg</span></div>
                    <input type="range" min={1} max={3} step={0.5} value={cfg.animationDuration || 2} onChange={e => update("animationDuration", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                 </div>
                 <button onClick={() => setPreviewAnim(true)} className="w-full py-3 bg-violet-50 text-violet-700 rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-violet-100 transition-colors border border-violet-100 shadow-sm">
                   ▶ REPRODUCIR VISTA PREVIA
                 </button>
               </>
             )}
          </Acc>

          <Acc title="Textos de Portada" icon={Type} iconColor="#0d9488">
            <Inp label="Nombre Agasajado" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
            <div className="grid grid-cols-2 gap-2 mb-4">
               <SelectInp label="Fuente" value={cfg.honoreeFont} options={FONTS} onChange={v => update("honoreeFont", v)} className="!mb-0" />
               <Inp label="Tamaño (px)" type="number" value={cfg.honoreeSize} onChange={v => update("honoreeSize", v)} className="!mb-0" />
            </div>
            <Inp label="Frase de Invitación" value={cfg.eventType} onChange={v => update("eventType", v)} />
            <FileUpload label="Foto Principal de Portada" value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
          </Acc>

          <Acc title="Banner Promocional" icon={ImageIcon} iconColor="#d97706">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Banner Central</span>
              <Toggle checked={cfg.showBanner} onChange={v => update("showBanner", v)} />
            </div>
            {cfg.showBanner && (
              <>
                <Inp label="Título del Banner" value={cfg.bannerTitle} onChange={v => update("bannerTitle", v)} />
                <div className="flex items-center justify-between mt-4 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Usar GIF de Giphy?</span>
                  <Toggle checked={cfg.useGiphyBanner || false} onChange={v => update("useGiphyBanner", v)} />
                </div>
                {cfg.useGiphyBanner ? (
                  <GiphySearch onSelect={url => update("bannerPhoto", url)} />
                ) : (
                  <FileUpload label="Imagen de Banner" value={cfg.bannerPhoto} onChange={v => update("bannerPhoto", v)} />
                )}
              </>
            )}
          </Acc>

          <Acc title="Fecha, Hora y Lugar" icon={Calendar} iconColor="#e11d48">
            <Inp label="Texto de Fecha" value={cfg.dateText} onChange={v => update("dateText", v)} placeholder="Ej: Sábado 15 de Mayo" />
            <Inp label="Texto de Horario" value={cfg.timeText} onChange={v => update("timeText", v)} placeholder="Ej: de 17:00 a 21:00 hs" />
            <Inp label="Nombre del Salón" value={cfg.locationName} onChange={v => update("locationName", v)} />
            <Inp label="Dirección Exacta" value={cfg.locationAddress} onChange={v => update("locationAddress", v)} />
          </Acc>

          <Acc title="Itinerario y Menú" icon={List} iconColor="#ca8a04">
             <div className="space-y-4 mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Cronograma</p>
                {cfg.itinerary?.map((item, i) => (
                  <div key={i} className="flex gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <input className="w-16 p-2 text-xs border rounded-lg" value={item.time} onChange={e => { const n = [...cfg.itinerary]; n[i].time = e.target.value; update("itinerary", n); }} />
                    <input className="flex-1 p-2 text-xs border rounded-lg" value={item.title} onChange={e => { const n = [...cfg.itinerary]; n[i].title = e.target.value; update("itinerary", n); }} />
                  </div>
                ))}
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Menú Sugerido</p>
                {cfg.menuItems?.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <EmojiPicker list={FOOD_EMOJIS} value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} />
                    <input className="flex-1 p-2 text-xs border rounded-lg" value={m.label} onChange={e => { const n = [...cfg.menuItems]; n[i].label = e.target.value; update("menuItems", n); }} />
                  </div>
                ))}
             </div>
          </Acc>

          <Acc title="WhatsApp de Confirmación" icon={CheckCircle2} iconColor="#22c55e">
            <Inp label="Número de WhatsApp (con código de país)" value={cfg.whatsappNumber} onChange={v => update("whatsappNumber", v)} placeholder="5491122334455" />
            <Inp label="Mensaje Predefinido" value={cfg.whatsappMessage} onChange={v => update("whatsappMessage", v)} multiline />
          </Acc>
        </aside>

        {/* VISTA PREVIA CENTRAL */}
        <main className="flex-1 bg-slate-900 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl relative z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center"><div className="w-10 h-1 bg-slate-800 rounded-full" /></div>
            
            {previewAnim && <OpeningAnimation cfg={cfg} onOpen={() => setPreviewAnim(false)} isPreview={true} />}
            
            <div className="h-full w-full overflow-y-auto bg-black pb-10 fd-sb" style={{ scrollBehavior: 'smooth' }}>
              <InvitePreview cfg={cfg} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
