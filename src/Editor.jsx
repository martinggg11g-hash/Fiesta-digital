import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OpeningAnimation } from "./Lotties"; 
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import {
  MapPin, Clock, Calendar, Palette, CheckCircle2, ChevronDown, Type, Edit2, ArrowLeft, Save, X,
  Star, Image as ImageIcon, Layout, List, Trash2, Loader2, Check, Video, Link as LinkIcon, 
  Sparkles, MoveVertical, Music, LayoutGrid, Smartphone
} from "lucide-react";

const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');

/* ============================================================================
   UTILIDADES (Compresión y Helpers)
============================================================================ */
const compressImage = (base64, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Comprimido al 70% calidad
    };
  });
};

const getSpotifyEmbed = (url) => {
  if (!url) return null;
  const id = url.split("track/")[1]?.split("?")[0] || url.split("playlist/")[1]?.split("?")[0];
  const type = url.includes("playlist") ? "playlist" : "track";
  return id ? `https://open.spotify.com/embed/${type}/${id}` : null;
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2] && match[2].length === 11) ? match[2] : null;
};

/* ============================================================================
   CONSTANTES DE DISEÑO
============================================================================ */
export const ANIMATION_CATEGORIES = {
  infantil: [ { id: "amongus", name: "Among Us", emoji: "👾" }, { id: "tiger", name: "Tigre Animado", emoji: "🐯" }, { id: "chest", name: "Cofre Pirata", emoji: "🏴‍☠️" }, { id: "soccer", name: "Cancha Fútbol", emoji: "⚽" } ],
  quince: [ { id: "musicbox", name: "Caja Musical", emoji: "🎵" }, { id: "gift", name: "Regalo", emoji: "🎁" } ],
  bodas: [ { id: "envelope", name: "Sobre Elegante", emoji: "✉️" }, { id: "rings", name: "Anillos", emoji: "💍" } ],
  adultos: [ { id: "cheers", name: "Brindis", emoji: "🥂" }, { id: "disco", name: "Fiesta Disco", emoji: "🪩" } ]
};

export const THEMES = [
  { id:"violet", name:"Violeta",   bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4" },
  { id:"rose",   name:"Rosa",      bg1:"#150510", bg2:"#200a16", primary:"#e11d48", card:"#2a0e1a", text:"#fff1f3", muted:"#fda4af" },
  { id:"teal",   name:"Teal",      bg1:"#020f10", bg2:"#031a1c", primary:"#0d9488", card:"#062020", text:"#f0fdfb", muted:"#5eead4" },
  { id:"amber",  name:"Ámbar",     bg1:"#0f0800", bg2:"#1c1200", primary:"#d97706", card:"#1a1000", text:"#fffbeb", muted:"#fcd34d" },
];

export const FONTS = [
  { label: "DM Sans (Moderna)", value: "'DM Sans', sans-serif" }, { label: "Montserrat (Limpia)", value: "'Montserrat', sans-serif" },
  { label: "Syne (Elegante)", value: "'Syne', sans-serif" }, { label: "Pacifico (Divertida)", value: "'Pacifico', cursive" },
  { label: "Caveat (Manuscrita)", value: "'Caveat', cursive" }, { label: "Playfair (Clásica)", value: "'Playfair Display', serif" },
];

export const EFFECTS = [
  { id: "none", name: "Sin efecto", icon: "✖️" }, { id: "confetti", name: "Confeti", icon: "🎊" },
  { id: "hearts", name: "Corazones", icon: "❤️" }, { id: "stars", name: "Estrellas", icon: "⭐" },
  { id: "bubbles", name: "Burbujas", icon: "🫧" }, { id: "snow", name: "Nieve", icon: "❄️" },
  { id: "petals", name: "Pétalos", icon: "🌸" }, { id: "emojis", name: "Emojis mix", icon: "🎉" },
];

export const TRANSITION_OPTS = [
  { label: "Desvanecer (Fade)", value: "fade" }, { label: "Deslizar arriba", value: "slideUp" },
  { label: "Zoom Salida", value: "zoomOut" }, { label: "Zoom Entrada", value: "zoomIn" }
];

export const DEF_CONFIG = {
  theme:"violet", fontTitle:"'Pacifico', cursive", fontBody:"'DM Sans', sans-serif",
  honoreeSize: 48, honoreeFont: "'Pacifico', cursive", honoreeColor: "#f0ecff",
  eventTypeSize: 11, eventTypeFont: "'DM Sans', sans-serif", eventTypeColor: "#7c3aed",
  dateSize: 18, locationSize: 18, titlesSize: 10, badgeSize: 14,
  bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4",
  coverGradientIntensity: 70, showCoverGradient: true, particleEffect: "none", 
  openingAnimation: "envelope", animationDuration: 2, animationTransition: "fade",
  eventTypeEmoji:"✨", eventType:"Estás invitado al cumple de", honoreeName:"Valentina", badgeEmoji:"🎂", badgeText:"5 añitos",
  coverPhoto:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  useGiphyCover: false, showBanner:true, bannerTitle:"La festejada", bannerPhoto:"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&w=400&q=80",
  useGiphyBanner: false, showTheme:true, themeIcon:"🦕", themeLabel:"Temática", themeText:"Dinosaurios",
  showDate:true, dateText:"Sábado 24 de Octubre", showTime:true, timeText:"16:00 a 20:00 hs", showCountdown: false, countdownDate:"",
  showLocation:true, locationName:"Aventura Kids", locationAddress:"Av. San Martín 1234", showParking:true, parkingType:"Estacionamiento público", customParking:"",
  showItinerary:true, itinerary:[{ time:"16:00", title:"Bienvenida", sub:"Recepción de invitados" }],
  showMenu:true, menuItems:[{ emoji:"🍕", label:"Pizza Party" }, { emoji:"🥤", label:"Gaseosas" }],
  showDressCode:true, dressCodeIcon:"👗", dressCodeText:"Elegante Sport",
  showGifts:true, giftIcon:"🎁", giftLabel:"Regalos", giftText:"Lluvia de sobres", showGiftNote:false, giftNoteText:"", giftNoteColor: "#7c3aed", giftNoteSize: 11,
  showGallery:false, galleryTitle:"Fotos", galleryPhotos:[], galleryLayout: 'carousel',
  showMusic: false, spotifyUrl: "",
  showVideo:false, videoUrl:"", videoTitle:"Mirá el video",
  showVenueLogo:false, venueLogoUrl:"", venueName:"", venueLink:"", venueLinkType:"web",
  whatsappNumber:"5491123456789", whatsappMessage:"¡Hola! Confirmo mi asistencia para el evento 🎉",
};

/* ============================================================================
   COMPONENTES UI
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

const FileUpload = ({ label, onChange, value }) => {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const compressed = await compressImage(ev.target.result);
        onChange(compressed);
      };
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
    <div ref={ref} className="relative z-50">
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
    <div className={`mb-3 rounded-2xl border border-gray-100 bg-white shadow-sm relative transition-all ${open ? 'z-40' : 'z-10'}`}>
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden`} style={{ maxHeight: open ? '2000px' : '0', opacity: open ? 1 : 0 }}>
        <div className="p-4 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};

/* ============================================================================
   VISTA PREVIA CELULAR
============================================================================ */
export const InvitePreview = ({ cfg }) => {
  if (!cfg) return null;
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary;
  const bg = `linear-gradient(180deg, ${cfg.bg1 || th.bg1} 0%, ${cfg.bg2 || th.bg2} 100%)`;
  const textC = cfg.text || th.text;
  const mutedC = cfg.muted || th.muted;
  const cardC  = cfg.card  || th.card;
  const gradOpacity = cfg.showCoverGradient === false ? 0 : ((cfg.coverGradientIntensity ?? 70) / 100).toFixed(2);

  const SectionTitle = ({ children }) => <h4 className="font-black uppercase tracking-[0.3em] text-center mb-6" style={{ color: mutedC, fontSize: `${cfg.titlesSize ?? 10}px` }}>{children}</h4>;
  
  const InfoCard = ({ icon: Icon, label, value, sub, fontSize }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5" style={{ background: cardC }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><Icon size={20} color="white" /></div>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>{label}</p>
        <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${fontSize}px` }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 opacity-70" style={{ color: mutedC }}>{sub}</p>}
      </div>
    </div>
  );

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody }} className="min-h-full pb-20 relative overflow-x-hidden">
      <div className="relative h-[420px] overflow-hidden">
        <img src={cfg.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1 || th.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-30">
          <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px` }}>{cfg.eventTypeEmoji} {cfg.eventType}</p>
          <h1 style={{ fontFamily: cfg.honoreeFont || cfg.fontTitle, color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px` }} className="leading-tight mb-4">{cfg.honoreeName}</h1>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md bg-black/30 font-black" style={{ color: textC, fontSize: `${cfg.badgeSize ?? 14}px` }}>{cfg.badgeEmoji} {cfg.badgeText}</span>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4">
        {/* FECHA Y HORA */}
        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={cfg.dateText} fontSize={cfg.dateSize ?? 18} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} fontSize={cfg.dateSize ?? 18} />}

        {/* UBICACIÓN */}
        {cfg.showLocation && (
          <div className="rounded-3xl overflow-hidden border border-white/5" style={{ background: cardC }}>
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: primary }}><MapPin size={20} color="white" /></div>
              <div className="text-left"><p className="text-[9px] uppercase font-black tracking-widest mb-0.5" style={{ color: mutedC }}>¿Dónde?</p><p className="font-bold" style={{ color: textC, fontSize: `${cfg.locationSize ?? 18}px` }}>{cfg.locationName}</p></div>
            </div>
            <div className="px-4 pb-4">
               <iframe title="map" width="100%" height="180" style={{ border: 0, borderRadius: '1rem', filter: "invert(90%) hue-rotate(180deg)" }} loading="lazy" src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_KEY&q=${encodeURIComponent(cfg.locationAddress)}`} />
            </div>
          </div>
        )}

        {/* SPOTIFY */}
        {cfg.showMusic && cfg.spotifyUrl && (
          <div className="pt-4">
            <SectionTitle>Música para entrar en clima</SectionTitle>
            <iframe style={{ borderRadius: '12px' }} src={getSpotifyEmbed(cfg.spotifyUrl)} width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        )}

        {/* GALERIA */}
        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <div className="pt-6">
            <SectionTitle>{cfg.galleryTitle}</SectionTitle>
            {cfg.galleryLayout === 'carousel' ? (
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scroll-smooth no-scrollbar">
                {cfg.galleryPhotos.map((p, i) => <img key={i} src={p} className="w-48 h-64 rounded-2xl object-cover shrink-0 shadow-lg" alt="Gallery" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {cfg.galleryPhotos.map((p, i) => <img key={i} src={p} className="w-full h-48 rounded-xl object-cover shadow-md" alt="Gallery" />)}
              </div>
            )}
          </div>
        )}

        <button onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent((cfg.whatsappMessage || "").replace('{nombre}', cfg.honoreeName))}`)} className="w-full py-5 mt-6 rounded-2xl font-black text-white shadow-xl transition-transform active:scale-95" style={{ background: primary }}>
          <CheckCircle2 className="inline-block mr-2" size={20} /> CONFIRMAR ASISTENCIA
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   EDITOR SCREEN
============================================================================ */
export const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [mobileView, setMobileView] = useState("editor");

  useEffect(() => {
    const found = invitations.find(i => i.id === id);
    if (found) setInv({ ...found });
    else navigate("/dashboard");
  }, [id, invitations, navigate]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const handleSave = () => { onSave(inv); navigate("/dashboard"); };
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10"><ArrowLeft size={20}/></button>
          <span className="text-white font-bold text-sm truncate max-w-[150px]">{inv.title}</span>
        </div>
        <button onClick={handleSave} className="px-6 py-2 bg-violet-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-violet-500"><Save size={16} className="inline mr-2"/> GUARDAR</button>
      </header>

      <div className="flex-1 flex relative">
        {/* BOTONES MÓVILES */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/10 p-1.5">
          <button onClick={() => setMobileView("editor")} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${mobileView === "editor" ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>✏️ Editar</button>
          <button onClick={() => setMobileView("preview")} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${mobileView === "preview" ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>👀 Previa</button>
        </div>

        {/* LADO IZQUIERDO: CONTROLES */}
        <aside className={`${mobileView === 'editor' ? 'flex' : 'hidden md:flex'} w-full md:w-[380px] bg-[#f8f7ff] h-full flex-col p-6 overflow-y-auto pb-32 md:pb-6`}>
          <Acc title="Estilo y Colores" icon={Palette} defaultOpen>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {THEMES.map(th => <button key={th.id} onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})} className={`h-10 rounded-xl border-2 ${cfg.theme === th.id ? 'border-violet-600' : 'border-transparent'}`} style={{ background: th.primary }} />)}
            </div>
            <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-black text-slate-400 uppercase">Sombreado Portada</span>
                <Toggle checked={cfg.showCoverGradient} onChange={v => update("showCoverGradient", v)} />
            </div>
            {cfg.showCoverGradient && <input type="range" className="w-full mt-2 accent-violet-600" value={cfg.coverGradientIntensity} onChange={e => update("coverGradientIntensity", e.target.value)} />}
          </Acc>

          <Acc title="Música (Spotify)" icon={Music}>
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Música</span><Toggle checked={cfg.showMusic} onChange={v => update("showMusic", v)} /></div>
            {cfg.showMusic && <Inp label="Link de Canción o Playlist" placeholder="https://open.spotify.com/track/..." value={cfg.spotifyUrl} onChange={v => update("spotifyUrl", v)} />}
          </Acc>

          <Acc title="Galería de Fotos" icon={ImageIcon}>
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Galería</span><Toggle checked={cfg.showGallery} onChange={v => update("showGallery", v)} /></div>
             {cfg.showGallery && (
               <>
                 <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                    <button onClick={() => update("galleryLayout", 'carousel')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 ${cfg.galleryLayout === 'carousel' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500'}`}><Smartphone size={14}/> Carrusel</button>
                    <button onClick={() => update("galleryLayout", 'grid')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 ${cfg.galleryLayout === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500'}`}><LayoutGrid size={14}/> Cuadrícula</button>
                 </div>
                 <div className="space-y-4">
                   {cfg.galleryPhotos?.map((p, i) => (
                     <div key={i} className="bg-white border rounded-xl p-2 relative">
                       <FileUpload onChange={v => { const n = [...cfg.galleryPhotos]; n[i] = v; update("galleryPhotos", n); }} value={p} />
                       <button onClick={() => update("galleryPhotos", cfg.galleryPhotos.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 text-red-500"><Trash2 size={14}/></button>
                     </div>
                   ))}
                   <button onClick={() => update("galleryPhotos", [...(cfg.galleryPhotos || []), ""])} className="w-full py-3 border-2 border-dashed rounded-xl text-xs font-bold text-slate-400">+ AÑADIR FOTO</button>
                 </div>
               </>
             )}
          </Acc>
        </aside>

        {/* LADO DERECHO: PREVIA */}
        <main className={`${mobileView === 'preview' ? 'flex' : 'hidden md:flex'} flex-1 bg-slate-900 items-center justify-center p-4 overflow-hidden`}>
           <div className="w-full max-w-[375px] h-[80vh] border-[8px] border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-50"></div>
              <div className="h-full overflow-y-auto bg-black no-scrollbar"><InvitePreview cfg={cfg} /></div>
           </div>
        </main>
      </div>
    </div>
  );
};
