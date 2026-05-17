import React, { useState, useEffect, useRef } from 'react';

// --- ICONOS Y COMPONENTES VISUALES ---
export const Tooltip = ({ text }) => (
  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold cursor-help" title={text}>?</span>
);

export const Acc = ({ title, icon: Icon, iconColor, defaultOpen, children }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className="mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} color={iconColor || "#64748b"} />}
          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{title}</span>
        </div>
        <span className="text-slate-400 font-bold">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4 border-t border-slate-100">{children}</div>}
    </div>
  );
};

export const BordersGallery = ({ value, onChange }) => {
  const borders = ["/borders/1-Photoroom.png", "/borders/2.png", "/borders/3.png"];
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

export const SelectInp = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all bg-white text-slate-700 cursor-pointer appearance-none">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
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

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize = 10, maxSize = 100 }) => (
  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 mb-4">
    <label className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><span>{label}</span><span className="bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">{sizeVal}px</span></label>
    <div className="flex gap-2 items-center mb-3">
      {onFont && <div className="flex-1"><FontSelector value={fontVal} onChange={onFont} /></div>}
      <input type="color" value={colorVal || "#000000"} onChange={e => onColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
    </div>
    <input type="range" min={minSize} max={maxSize} value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="w-full accent-violet-500" />
  </div>
);

// --- ARCHIVOS Y GIPHY ---
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

export const GiphySearch = ({ onSelect, value, placeholder = "Buscar GIF..." }) => {
  const [q, setQ] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const search = async () => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=gYn9E022kUa0Y0pS1lYq2h85d1H8M7Mh&q=${q}&limit=12&rating=g`);
      const data = await res.json();
      setGifs(data.data.map(g => g.images.original.url));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder={placeholder} className="flex-1 p-2 text-xs border rounded-lg" />
        <button type="button" onClick={search} className="px-3 bg-violet-500 text-white rounded-lg text-xs font-bold">Buscar</button>
      </div>
      {loading && <p className="text-[10px] text-gray-400 mt-2">Buscando...</p>}
      {gifs.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2 h-40 overflow-y-auto p-1 bg-white border rounded-lg">
          {gifs.map(g => (
            <div key={g} className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden border-2" onClick={() => onSelect(g)} style={{ borderColor: value === g ? '#8b5cf6' : 'transparent' }}>
               <img src={g} alt="gif" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
               {value === g && <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center"><span className="bg-white rounded-full p-1 shadow-md text-xs">✅</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
