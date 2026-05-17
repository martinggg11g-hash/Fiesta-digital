import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { Search, CheckCircle2 } from "lucide-react";

// --- ICONOS CUSTOM Y LUCIDE ---
export const IconRenderer = ({ name, icon, size = 24, color = "currentColor", className = "" }) => {
  const iconName = name || icon;
  if (!iconName) return null;

  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", className };

  if (typeof iconName === 'string') {
    switch (iconName) {
      case 'icon-beef': return <svg {...p}><path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/><circle cx="12.5" cy="8.5" r="2.5"/></svg>;
      case 'icon-fish': return <svg {...p}><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 1.11 0 2.51.37 3 1.5l-4 4-2-2-4 4 2 2 4-4c1.13.49 1.5 1.89 1.5 3 0 3.56-2.54 7.56-6 8.5-1.92.51-4.08-.29-5-2l4-4-2-2-4 4c-1.71-.92-2.51-3.08-2-5Z"/><circle cx="17.5" cy="10.5" r="1"/></svg>;
      case 'icon-ham': return <svg {...p}><path d="M14 6.5a4 4 0 0 0-6-3.5 4 4 0 0 0 0 7"/><path d="M15 14h-4"/><path d="M9 14h-1"/><path d="M22 13a4 4 0 0 0-4-4H5a4 4 0 0 0 0 8h13a4 4 0 0 0 4-4Z"/></svg>;
      case 'icon-ice-cream-bowl': return <svg {...p}><path d="M12 17v5"/><path d="M8 22h8"/><path d="M2 11a8 8 0 0 0 16 0"/><path d="M18 11H2"/></svg>;
      case 'icon-cup-soda': return <svg {...p}><path d="M6 8h12l-1.4 12H7.4Z"/><path d="M4 8h16"/><path d="M10 2l1 6"/><path d="M14 2l-1 6"/></svg>;
      case 'icon-chef-hat': return <svg {...p}><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" x2="18" y1="17" y2="17"/></svg>;
      case 'icon-heart': return <svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
      case 'icon-crown': return <svg {...p}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
      case 'icon-star': return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
      default: break;
    }
  }

  const IconCmp = typeof iconName === 'string' ? Icons[iconName] : iconName;
  return IconCmp ? <IconCmp size={size} color={color} className={className} /> : null;
};

// --- COMPONENTES VISUALES ---
export const Tooltip = ({ text }) => (
  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold cursor-help" title={text}>?</span>
);

export const Acc = ({ title, icon: Icon, children, defaultOpen = false, iconColor = "#7c3aed" }) => {
  const [open, setOpen] = useState(defaultOpen); 
  const [fullyOpen, setFullyOpen] = useState(defaultOpen);

  useEffect(() => {
    let t;
    if (open) { setFullyOpen(true); } 
    else { t = setTimeout(() => setFullyOpen(false), 300); }
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="mb-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative z-20">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} color={iconColor} />}
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</span>
        </div>
        <span className={`text-slate-400 font-bold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>+</span>
      </button>
      
      <div 
        className="transition-all duration-300 ease-in-out relative z-10"
        style={{ 
          maxHeight: open ? '5000px' : '0', 
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none'
        }}
      >
        <div className="p-4 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};

export const BordersGallery = ({ value, onChange }) => {
  const borders = ["/borders/1-Photoroom.png", "/borders/2.png", "/borders/3.png", "/borders/4.png", "/borders/5.png", "/borders/6.png"];
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
       {borders.map(b => (
         <button key={b} type="button" onClick={() => onChange(b)} className={`w-12 h-12 shrink-0 border-2 rounded-xl bg-slate-50 overflow-hidden cursor-pointer ${value === b ? 'border-pink-500 shadow-md' : 'border-transparent'}`}>
            <img src={b} alt="borde" className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
         </button>
       ))}
    </div>
  );
};

// --- GIPHY SEARCH (NATIVO FETCH) ---
export const GiphySearch = ({ onSelect, value, placeholder = "Buscar GIF..." }) => {
  const [term, setTerm] = useState("fiesta");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchGifs = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=gYn9E022kUa0Y0pS1lYq2h85d1H8M7Mh&q=${query}&limit=20&rating=g`);
      const data = await res.json();
      setGifs(data.data.map(g => g.images.original.url));
    } catch (e) {
      console.error("Error fetching Giphy:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => searchGifs(term), 600);
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-2 mb-4">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input 
          value={term} 
          onChange={(e) => setTerm(e.target.value)} 
          placeholder={placeholder} 
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:border-violet-400 outline-none shadow-sm" 
        />
      </div>

      <div className="h-48 overflow-y-auto rounded-xl bg-white border border-slate-100 relative z-50 p-2">
        {loading && gifs.length === 0 ? (
          <div className="flex justify-center items-center h-full">
             <span className="text-[10px] font-bold text-slate-400 animate-pulse">Cargando GIFs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map(g => (
              <div 
                key={g} 
                className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden border-2" 
                onClick={(e) => { e.preventDefault(); onSelect(g); }} 
                style={{ borderColor: value === g ? '#8b5cf6' : 'transparent' }}
              >
                 <img src={g} alt="gif" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                 {value === g && (
                   <div className="absolute inset-0 bg-violet-500/30 flex items-center justify-center backdrop-blur-[1px]">
                      <CheckCircle2 className="text-white drop-shadow-md" size={24} />
                   </div>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- INPUTS BÁSICOS ---
export const Inp = ({ label, value, onChange, placeholder, type = "text", multiline = false, className = "", icon: Icon }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{Icon && <Icon size={12}/>}{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all min-h-[80px] bg-white text-slate-700" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all bg-white text-slate-700" />
    )}
  </div>
);

export const MiniInp = ({ value, onChange, placeholder, className = "", type = "text", maxLength }) => (
  <input type={type} maxLength={maxLength} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`outline-none bg-transparent ${className}`} />
);

export const SelectInp = ({ label, value, onChange, options, className="", tooltip }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label} {tooltip && <Tooltip text={tooltip}/>}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all bg-white text-slate-700 cursor-pointer appearance-none">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

// --- TIPOGRAFÍAS ---
const FONTS = ["Montserrat", "Playfair Display", "Dancing Script", "Pacifico", "Great Vibes", "Cinzel", "Outfit", "Space Grotesk", "Cormorant Garamond", "Amatic SC", "Sacramento", "Alice", "Satisfy", "Courgette", "Caveat", "Indie Flower", "Shadows Into Light", "Kalam", "Gloria Hallelujah", "Permanent Marker", "Bebas Neue", "Oswald", "Anton", "Teko", "Fjalla One", "Lobster", "Abril Fatface", "Alfa Slab One", "Righteous", "Fredoka One", "Concert One", "Bangers", "Creepster", "Press Start 2P", "VT323", "Pixelify Sans", "DotGothic16", "Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Nunito", "Raleway", "Ubuntu", "Quicksand", "Work Sans", "Rubik", "Mukta", "Karla", "Josefin Sans", "Anton", "Bitter", "Cabin", "Dosis", "Exo 2", "Fira Sans", "Hind", "Inconsolata", "Jost", "Kanit", "Libre Baskerville", "Lora", "Manrope", "Merriweather", "Noto Sans", "Nunito Sans", "Oxygen", "PT Sans", "Play", "Prompt", "PT Serif", "Rubik", "Signika", "Slabo 27px", "Source Sans Pro", "Space Mono", "Tajawal", "Teko", "Titillium Web", "Ubuntu Condensed", "Varela Round", "Work Sans", "Yanone Kaffeesatz", "Zilla Slab", "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS", "Trebuchet MS", "Arial Black", "Impact"];

export const FontSelector = ({ value, onChange }) => {
  useEffect(() => {
    if (value) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${value.replace(/ /g, "+")}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, [value]);
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded-lg text-xs" style={{ fontFamily: value }}>
      {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
    </select>
  );
};

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize=10, maxSize=80, tooltip = null }) => (
  <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 shadow-sm mb-5 relative overflow-visible z-[10] hover:z-[9999] focus-within:z-[9999]">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-200 rounded-l-xl" />
    <label className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-2">
      <span>{label} {tooltip && <Tooltip text={tooltip}/>}</span>
      <span className="bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">{sizeVal}px</span>
    </label>
    <div className="flex gap-2 items-center mb-3 pl-2">
      {onFont && <div className="flex-1"><FontSelector value={fontVal} onChange={onFont} /></div>}
      <input type="color" value={colorVal || "#000000"} onChange={e => onColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
    </div>
    <div className="pl-2">
      <input type="range" min={minSize} max={maxSize} value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="w-full accent-violet-500" />
    </div>
  </div>
);

// --- ARCHIVOS ---
export const FileUpload = ({ label, value, onChange }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>}
    <input type="file" accept="image/*" onChange={e => {
       const file = e.target.files[0];
       if (file) {
         const reader = new FileReader();
         reader.onload = ev => onChange(ev.target.result);
         reader.readAsDataURL(file);
       }
    }} className="w-full text-xs" />
    {value && <img src={value} alt="Preview" className="mt-2 h-16 rounded object-cover border" />}
  </div>
);

export const EmojiPicker = ({ value, onSelect }) => {
  const emojis = ["✨","👑","🎈","🎉","🎂","💖","🌟","🌸","🎀","🦋","🕷️","🦸‍♂️","🦖","⚽","🎮","🚗","🍕","🍻","🥂","💍","🕊️","🍼","🎓"];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className="w-12 h-12 flex items-center justify-center text-xl bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">{value || "✨"}</button>
      {open && (
        <div className="absolute top-14 left-0 w-64 bg-white border border-slate-200 p-3 rounded-xl shadow-xl z-[9999] grid grid-cols-6 gap-2">
          {emojis.map(e => <button key={e} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="text-xl hover:scale-125 transition-transform">{e}</button>)}
        </div>
      )}
    </div>
  );
};
