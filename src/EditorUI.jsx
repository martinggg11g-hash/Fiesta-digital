import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { ChevronDown, Loader2, Trash2, Image as ImageIcon, Search, HelpCircle, CheckCircle2, Plus, GripVertical, Check, Music } from "lucide-react";
import { 
  FONTS, 
  FONT_CATEGORIES, 
  ICON_CATEGORIES, 
  EMOJI_CATEGORIES,
  BORDERS 
} from "./config";

// CORRECCIÓN SEC-03: Variable de entorno para ocultar la API Key de ImgBB
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

export const Tooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => { 
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setShow(false); }; 
    document.addEventListener("mousedown", fn); 
    document.addEventListener("touchstart", fn);
    return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("touchstart", fn); }; 
  }, []);

  return (
    <div className="relative inline-flex items-center ml-1.5" ref={ref}>
      <button 
        type="button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShow(!show); }} 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-slate-300 hover:text-violet-500 cursor-pointer transition-colors"
      >
        <HelpCircle size={14} />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-[9999] pointer-events-none anim-pop text-center leading-tight">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// FIX BUG-CRITICO-01: ICONRENDERER RESTAURADO
// ---------------------------------------------------------
export const IconRenderer = ({ name, size = 24, color = "currentColor", className = "" }) => {
  if (!name) return null;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", className };
  
  switch (name) {
    case 'icon-beef': return <svg {...p}><path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/><circle cx="12.5" cy="8.5" r="2.5"/></svg>;
    case 'icon-fish': return <svg {...p}><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 1.11 0 2.51.37 3 1.5l-4 4-2-2-4 4 2 2 4-4c1.13.49 1.5 1.89 1.5 3 0 3.56-2.54 7.56-6 8.5-1.92.51-4.08-.29-5-2l4-4-2-2-4 4c-1.71-.92-2.51-3.08-2-5Z"/><circle cx="17.5" cy="10.5" r="1"/></svg>;
    case 'icon-ham': return <svg {...p}><path d="M14 6.5a4 4 0 0 0-6-3.5 4 4 0 0 0 0 7"/><path d="M15 14h-4"/><path d="M9 14h-1"/><path d="M22 13a4 4 0 0 0-4-4H5a4 4 0 0 0 0 8h13a4 4 0 0 0 4-4Z"/></svg>;
    case 'icon-sandwich': return <svg {...p}><path d="M3 11v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M12 4l-9 7h18l-9-7Z"/></svg>;
    case 'icon-taco': return <svg {...p}><path d="M2 15a10 10 0 1 1 20 0Z"/><path d="M22 15H2"/><path d="M7 15l1-4"/><path d="M12 15l1-4"/><path d="M17 15l1-4"/></svg>;
    case 'icon-cake-slice': return <svg {...p}><path d="m21 8-9-5-9 5"/><path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"/><path d="M12 3v5"/></svg>;
    case 'icon-ice-cream-bowl': return <svg {...p}><path d="M12 17v5"/><path d="M8 22h8"/><path d="M2 11a8 8 0 0 0 16 0"/><path d="M18 11H2"/></svg>;
    case 'icon-cup-soda': return <svg {...p}><path d="M6 8h12l-1.4 12H7.4Z"/><path d="M4 8h16"/><path d="M10 2l1 6"/><path d="M14 2l-1 6"/></svg>;
    case 'icon-chef-hat': return <svg {...p}><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" x2="18" y1="17" y2="17"/></svg>;
    case 'icon-heart': return <svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
    case 'icon-crown': return <svg {...p}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
    case 'icon-star': return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'icon-sparkles': return <svg {...p}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
    case 'icon-gift': return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8a4.8 8 0 0 1 9 0 2.5 2.5 0 0 1 0 5"/></svg>;
    case 'icon-camera': return <svg {...p}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
    case 'icon-church': return <svg {...p}><path d="M12 2v5"/><path d="M10 5h4"/><path d="M12 7l-6 5v10h12V12l-6-5Z"/><path d="M10 22v-4a2 2 0 0 1 4 0v4"/></svg>;
    case 'icon-rings': return <svg {...p}><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>;
    case 'icon-map-pin': return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'icon-calendar': return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case 'icon-clock': return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'icon-utensils': return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
    case 'icon-wine': return <svg {...p}><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>;
    case 'icon-cake': return <svg {...p}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg>;
    case 'icon-pizza': return <svg {...p}><path d="M15 11l-5 5"/><path d="M11 11l-4 4"/><path d="M12 12l2 2"/><path d="M20 11a8.1 8.1 0 0 0-15.5-2"/><path d="M4 8l8 14 8-14"/></svg>;
    case 'icon-burger': return <svg {...p}><path d="M2 18h20"/><path d="M21 14H3"/><path d="M12 2a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9Z"/><path d="M22 18a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3"/></svg>;
    case 'icon-coffee': return <svg {...p}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>;
    case 'icon-beer': return <svg {...p}><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M5 6h12v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"/><path d="M5 10h12"/><path d="M12 6V2"/></svg>;
    case 'icon-cocktail': return <svg {...p}><path d="m19 2-7 11-7-11h14Z"/><path d="M12 13v7"/><path d="M7 22h10"/></svg>;
    case 'icon-dress': return <svg {...p}><path d="M9.5 2 6 7l1.5 5H6l-3 10h18l-3-10h-1.5L18 7l-3.5-5h-5Z"/><path d="M6 12h12"/></svg>;
    case 'icon-suit': return <svg {...p}><path d="M4 2v20h16V2H4Zm4 0 4 4 4-4M12 6v16"/></svg>;
    case 'icon-tie': return <svg {...p}><path d="m10 2 2 2 2-2-2 10 3 4-3 6-3-6 3-4-2-10Z"/></svg>;
    case 'icon-hanger': return <svg {...p}><path d="M12 2a2 2 0 0 1 2 2c0 .5-.4 1-1 1.7L7 12h10l-6-6.3"/><path d="M2 12h20l-10 9Z"/></svg>;
    case 'icon-ticket': return <svg {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
    case 'icon-vip': return <svg {...p}><path d="M7 5 9 19"/><path d="M2 5 4 19"/><path d="M12 5h3"/><path d="M12 12h3"/><path d="M12 19h3"/><path d="M19 5v14h3V5Z"/></svg>;
    case 'icon-music': return <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'icon-disco': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M7 5.5s2.5 2 2.5 6.5-2.5 6.5-2.5 6.5M17 5.5s-2.5 2-2.5 6.5 2.5 6.5 2.5 6.5"/></svg>;
    case 'icon-speaker': return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6" r="1"/></svg>;
    case 'icon-mic': return <svg {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="18" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
    case 'icon-balloon': return <svg {...p}><path d="M12 2a7 7 0 0 0-7 7c0 4 7 11 7 11s7-7 7-11a7 7 0 0 0-7-7Z"/><path d="M12 20v3"/></svg>;
    case 'icon-confetti': return <svg {...p}><path d="M13 2 3 14"/><path d="M18 9 8 21"/><path d="M5 2 2 5"/><path d="M22 19 19 22"/></svg>;
    case 'icon-flower': return <svg {...p}><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5M12 12v9"/></svg>;
    default: 
      const LucideIcon = Icons[name];
      if (LucideIcon) return <LucideIcon {...p} />;
      return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
};
// ---------------------------------------------------------

export const FileUpload = ({ label, value, onChange, accept = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.includes('audio')) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
      else alert("Error al subir archivo");
    } catch (err) { alert("Error de red al subir archivo"); }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isAudio = accept.includes('audio');

  return (
    <div className="mb-6">
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-1">{label}</label>
      <input type="file" ref={inputRef} accept={accept} onChange={handleFileChange} className="hidden" />
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-violet-300 hover:shadow-md group">
        {value ? (
           <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border relative">
              {isAudio ? <Music size={24} className="text-violet-500" /> : <img src={value} alt="" className="w-full h-full object-cover" />}
              <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="absolute inset-0 bg-red-500/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
           </div>
        ) : (
           <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-dashed border-slate-300 text-slate-400 group-hover:text-violet-500 group-hover:border-violet-300 transition-colors">
              {isAudio ? <Music size={24}/> : <ImageIcon size={24}/>}
           </div>
        )}
        <div className="flex-1 px-2">
           <button disabled={uploading} onClick={() => inputRef.current?.click()} className="w-full py-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-colors bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50">
             {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {uploading ? "SUBIENDO..." : "SELECCIONAR ARCHIVO"}
           </button>
        </div>
      </div>
    </div>
  );
};

export const Inp = ({ label, value, onChange, placeholder, type = "text", multiline = false }) => {
  const [localVal, setLocalVal] = useState(value || "");
  const isFocused = useRef(false);

  useEffect(() => { if (!isFocused.current) setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 500); return () => clearTimeout(timeout); }, [localVal, onChange, value]);

  const handleBlur = () => { isFocused.current = false; if (localVal !== (value || "")) onChange(localVal); };

  return (
    <div className="mb-5">
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">{label}</label>}
      {multiline ? (
        <textarea value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className="w-full py-3.5 px-4 rounded-xl text-sm border focus:border-violet-500 outline-none transition-all resize-none min-h-[120px] bg-white text-slate-800 shadow-sm hover:border-slate-300" />
      ) : (
        <input type={type} value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className="w-full py-3.5 px-4 rounded-xl text-sm border focus:border-violet-500 outline-none transition-all bg-white text-slate-800 shadow-sm hover:border-slate-300" />
      )}
    </div>
  );
};

export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-12 h-7 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600 shadow-inner"></div>
  </label>
);

export const GiphySearch = ({ onSelect }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!term) return;
    setLoading(true);
    try {
      // CORRECCIÓN SEC-05: Variable de entorno para ocultar la API Key de Giphy
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_API_KEY || "32PbboqCveiWSlj9vROPmyjv8l8cuaj1"}&q=${term}&limit=20`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.data || []);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="mt-2 bg-white p-4 rounded-2xl border shadow-sm">
      <div className="flex gap-2 mb-4">
        <input value={term} onChange={e => setTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Buscar sticker..." className="flex-1 py-2 px-3 border rounded-xl text-sm outline-none focus:border-violet-500 bg-slate-50" />
        <button onClick={search} className="px-4 bg-violet-100 text-violet-700 font-bold rounded-xl text-xs uppercase cursor-pointer hover:bg-violet-200">{loading ? '...' : 'BUSCAR'}</button>
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {results.map(g => (
          <img key={g.id} src={g.images.fixed_height_small.url} alt="" onClick={() => onSelect(g.images.fixed_height.url)} className="w-full h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 border" />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// COMPONENTES FALTANTES AGREGADOS PARA RESOLVER BUG-01
// ---------------------------------------------------------

export const MiniInp = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="flex-1">
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 pl-1">{label}</label>}
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full py-2 px-3 rounded-lg text-sm border focus:border-violet-500 outline-none transition-all bg-white text-slate-800 shadow-sm" />
    </div>
  );
};

export const SelectInp = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 pl-1">{label}</label>}
      <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm border focus:border-violet-500 outline-none transition-all bg-white text-slate-800 shadow-sm cursor-pointer">
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize = 10, maxSize = 100 }) => {
  return (
    <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 pl-1">{label}</label>}
      <div className="space-y-3">
        {onFont && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 w-12 uppercase">Fuente</span>
            <select value={fontVal || ""} onChange={e => onFont(e.target.value)} className="flex-1 py-1.5 px-2 rounded-lg text-xs border focus:border-violet-500 outline-none bg-white text-slate-800 shadow-sm cursor-pointer" style={{ fontFamily: fontVal }}>
              {FONTS.map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
              ))}
            </select>
          </div>
        )}
        {onColor && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 w-12 uppercase">Color</span>
            <div className="flex-1 flex items-center gap-2">
              <input type="color" value={colorVal || "#ffffff"} onChange={e => onColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={colorVal || "#ffffff"} onChange={e => onColor(e.target.value)} className="flex-1 py-1.5 px-2 rounded-lg text-xs border focus:border-violet-500 outline-none bg-white text-slate-800 uppercase shadow-sm" />
            </div>
          </div>
        )}
        {onSize && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 w-12 uppercase">Tam.</span>
            <input type="range" min={minSize} max={maxSize} value={sizeVal || 16} onChange={e => onSize(Number(e.target.value))} className="flex-1 accent-violet-600" />
            <span className="text-xs font-bold text-slate-600 w-8 text-right">{sizeVal}px</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const FontSelector = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 pl-1">Fuente</label>
      <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm border focus:border-violet-500 outline-none transition-all bg-white text-slate-800 shadow-sm cursor-pointer" style={{ fontFamily: value }}>
        {FONTS.map(f => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
        ))}
      </select>
    </div>
  );
};

export const EmojiPicker = ({ value, onSelect }) => {
  const emojis = ["✨","👑","🎈","🎉","🎊","🥳","🎁","💝","❤️","💖"];
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {emojis.map(e => (
        <button 
          key={e} 
          onClick={() => onSelect(e)} 
          className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors text-lg ${e === value ? 'ring-2 ring-violet-500 bg-violet-100' : 'bg-slate-100 hover:bg-violet-100'}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
};

export const Acc = ({ title, icon: Icon, iconColor, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-3 border rounded-xl bg-white shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-left">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} color={iconColor || "#64748b"} />}
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && <div className="p-4 border-t bg-slate-50/50">{children}</div>}
    </div>
  );
};

export const BordersGallery = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {BORDERS.map(b => (
        <button 
          key={b.id} 
          onClick={() => onChange(b.url)} 
          className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors ${value === b.url ? 'border-violet-600' : 'border-slate-200'}`}
        >
          <img src={b.url} alt={b.name} className="w-full h-full object-cover bg-slate-800" />
        </button>
      ))}
    </div>
  );
};
