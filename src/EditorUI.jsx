import React, { useState, useEffect, useRef } from "react";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { ChevronDown, Loader2, Trash2, Image as ImageIcon, Search, HelpCircle, CheckCircle2 } from "lucide-react";
import { 
  FONTS, 
  FONT_CATEGORIES, 
  ICON_CATEGORIES, 
  EMOJI_CATEGORIES,
  BORDERS 
} from "./config";

const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

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
        <div className="absolute z-[99999] bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-[10px] font-medium leading-tight rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-center pointer-events-none normal-case tracking-normal">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

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
    default: return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
};

export const FontSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("Modernas");
  const ref = useRef(null);

  useEffect(() => { 
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; 
    document.addEventListener("mousedown", fn); 
    return () => document.removeEventListener("mousedown", fn); 
  }, []);

  return (
    <div className="relative w-full z-[9999]" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-white border border-gray-200 text-base flex justify-between items-center shadow-sm cursor-pointer" style={{ fontFamily: value }}>
        <span className="truncate">{value || "Seleccionar fuente..." }</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 z-[99999] origin-top anim-pop">
          <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-gray-100 fd-sb">
            {Object.keys(FONT_CATEGORIES).map(c => (
              <button key={c} type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCat(c); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shrink-0 transition-colors cursor-pointer ${cat === c ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c}</button>
            ))}
          </div>
          <div className="max-h-60 overflow-y-auto fd-sb">
            {FONT_CATEGORIES[cat].map(f => (
              <button key={f} type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(f); setOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-violet-50 text-lg rounded-xl border-b border-gray-50 last:border-0 cursor-pointer ${value === f ? 'bg-violet-100 text-violet-700 font-bold' : 'text-slate-700'}`} style={{ fontFamily: f }}>{f}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const EmojiPicker = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [mainTab, setMainTab] = useState('emoji'); 
  const [activeCat, setActiveCat] = useState("Magia");
  const ref = useRef(null);

  useEffect(() => { 
    if (mainTab === 'emoji') setActiveCat(Object.keys(EMOJI_CATEGORIES)[0]); 
    else setActiveCat(Object.keys(ICON_CATEGORIES)[0]); 
  }, [mainTab]);

  useEffect(() => { 
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; 
    document.addEventListener("mousedown", fn); 
    return () => document.removeEventListener("mousedown", fn); 
  }, []);

  const isIcon = (val) => typeof val === 'string' && val.startsWith('icon-');

  return (
    <div ref={ref} className="relative z-[20]">
      <button type="button" onClick={() => setOpen(!open)} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl hover:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none transition-all shadow-sm cursor-pointer">
        {isIcon(value) ? <IconRenderer name={value} size={24} color="#64748b" /> : (value || "✨")}
      </button>

      {open && (
        <div className="absolute top-14 left-0 bg-white border border-gray-200 rounded-2xl p-3 w-72 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[99999]" style={{ isolation: 'isolate' }}>
          <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
            <button type="button" onClick={() => setMainTab('emoji')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${mainTab === 'emoji' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>😀 Emojis</button>
            <button type="button" onClick={() => setMainTab('icon')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${mainTab === 'icon' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>✨ Íconos</button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-slate-100 fd-sb">
            {Object.keys(mainTab === 'emoji' ? EMOJI_CATEGORIES : ICON_CATEGORIES).map(c => (
              <button key={c} onClick={() => setActiveCat(c)} type="button" className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight shrink-0 transition-all ${activeCat === c ? 'bg-violet-100 text-violet-700' : 'bg-slate-50 text-slate-400'}`}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto fd-sb p-1 relative z-[99999]">
            {mainTab === 'emoji' ? (
              EMOJI_CATEGORIES[activeCat]?.map((e, i) => (
                <button key={i} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-violet-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center">{e}</button>
              ))
            ) : (
              ICON_CATEGORIES[activeCat]?.map((ic, i) => (
                <button key={i} type="button" onClick={() => { onSelect(ic); setOpen(false); }} className="p-2 hover:bg-violet-50 text-slate-500 hover:text-violet-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center">
                  <IconRenderer name={ic} size={22} />
                </button>
              ))
            )}
          </div>
          
          {mainTab === 'emoji' && (
            <div className="mt-2 pt-2 border-t border-slate-50">
               <input type="text" placeholder="O pega un emoji aquí..." maxLength={2} className="w-full p-2 text-center bg-slate-50 rounded-lg text-sm border border-slate-100 outline-none focus:border-violet-300" onChange={e => { if(e.target.value) { onSelect(e.target.value); setOpen(false); } }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const BordersGallery = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {BORDERS.map(b => (
      <button key={b.id} type="button" onClick={() => onChange(b.url)} className={`p-2 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${value === b.url ? 'border-violet-500 bg-violet-100 shadow-md' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
        <div style={{ width: '40px', height: '40px', backgroundColor: value === b.url ? '#7c3aed' : '#94a3b8', WebkitMaskImage: `url("${b.url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: `url("${b.url}")`, maskSize: 'contain', maskRepeat: 'no-repeat' }} />
        <span className={`text-[9px] font-bold ${value === b.url ? 'text-violet-700' : 'text-slate-500'}`}>{b.name}</span>
      </button>
    ))}
  </div>
);

// 👉 ACÁ ESTÁ EL AGREGADO DEL PREVIEW DEL GIF ABAJO
export const GiphySearch = ({ onSelect, value, placeholder = "Buscar GIF..." }) => {
  const [term, setTerm] = useState("fiesta");
  const [debouncedTerm, setDebouncedTerm] = useState("fiesta");
  useEffect(() => { const t = setTimeout(() => setDebouncedTerm(term), 600); return () => clearTimeout(t); }, [term]);
  const fetchGifs = (offset) => gf.search(debouncedTerm || "party", { offset, limit: 10, lang: 'es' });
  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-2 mb-4">
      <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder={placeholder} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:border-violet-400 outline-none shadow-sm" /></div>
      <div className="h-48 overflow-y-auto rounded-xl bg-white border border-slate-100 relative z-50 fd-sb"><Grid width={300} columns={2} fetchGifs={fetchGifs} key={debouncedTerm} onGifClick={(gif, e) => { e.preventDefault(); onSelect(gif.images.original.url); }} /></div>
      {/* Vista Previa */}
      {value && (
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">GIF Seleccionado</span>
          <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-violet-400 shadow-sm bg-white">
            <img src={value} alt="GIF Seleccionado" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md flex items-center justify-center">
              <CheckCircle2 size={12} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null, tooltip = null }) => {
  const [localVal, setLocalVal] = useState(value || "");
  useEffect(() => { setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 300); return () => clearTimeout(timeout); }, [localVal, onChange, value]);
  return (
    <div className={`mb-2 text-left ${className}`}>
      {label && (
        <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      <div className="relative flex items-center">{Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}{multiline ? (<textarea value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all ${Icon ? 'pl-11 pr-4' : 'px-4'}`} />) : (<input type={type} value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all ${Icon ? 'pl-11 pr-4' : 'px-4'}`} />)}</div>
    </div>
  );
};

export const MiniInp = ({ value, onChange, placeholder, className, type="text" }) => {
  const [localVal, setLocalVal] = useState(value || "");
  useEffect(() => { setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 300); return () => clearTimeout(timeout); }, [localVal, onChange, value]);
  return <input type={type} className={className} value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} />;
};

export const SelectInp = ({ label, value, onChange, options, className="", tooltip = null }) => (
  <div className={`mb-2 text-left ${className}`}>
    {label && (
      <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
    )}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all cursor-pointer">
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize=10, maxSize=80, tooltip = null }) => (
  <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 shadow-sm mb-5 relative overflow-visible z-[10] hover:z-[9999] focus-within:z-[9999]">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-200 rounded-l-xl" />
    <label className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-2">
      <span className="flex items-center">{label} {tooltip && <Tooltip text={tooltip} />}</span>
      {sizeVal && <span className="text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full">{sizeVal}px</span>}
    </label>
    <div className="flex gap-2 pl-2 items-start">{onFont && <div className="flex-1"><FontSelector value={fontVal} onChange={onFont} /></div>}{onColor && <div className="shrink-0"><input type="color" value={colorVal} onChange={e => onColor(e.target.value)} className="w-10 h-11 rounded-lg cursor-pointer border border-gray-200 p-0 shadow-sm bg-white" /></div>}</div>
    {onSize && (<div className="mt-4 pl-2"><input type="range" min={minSize} max={maxSize} value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" /></div>)}
  </div>
);

export const FileUpload = ({ label, onChange, value, tooltip = null }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true); const formData = new FormData(); formData.append("image", file);
    try { const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData }); const data = await res.json(); if (data.success) onChange(data.data.url); } catch (err) { } 
    finally { setUploading(false); }
  };
  return (
    <div className="mb-4 text-left relative">
      {label && (
        <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      <div className="relative"><label className={`flex items-center justify-center w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${uploading ? 'bg-violet-100 border-violet-200 text-violet-400 cursor-not-allowed' : 'bg-white border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 shadow-sm'}`}><span className="flex items-center gap-2">{uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir PNG/JPG</>}</span><input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" /></label></div>
      {value && !uploading && (<div className="relative mt-3 group w-fit"><img src={value} alt="preview" className="h-20 w-auto object-cover rounded-xl border border-gray-200 shadow-sm" /><button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"><Trash2 size={12} /></button></div>)}
    </div>
  );
};

export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block"><input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div></label>
);

export const Acc = ({ title, icon: Icon, children, defaultOpen = false, iconColor = "#7c3aed" }) => {
  const [open, setOpen] = useState(defaultOpen); 
  const [fullyOpen, setFullyOpen] = useState(defaultOpen);
  
  useEffect(() => { 
    let t; 
    if (open) {
      t = setTimeout(() => setFullyOpen(true), 300); 
    } else {
      setFullyOpen(false); 
    }
    return () => clearTimeout(t); 
  }, [open]);

  return (
    <div className={`mb-3 rounded-2xl border border-gray-100 bg-white shadow-sm relative transition-all ${open ? 'z-40' : 'z-10'} hover:z-50 focus-within:z-50`}>
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${fullyOpen ? 'overflow-visible' : 'overflow-hidden'}`} 
        style={{ 
          maxHeight: open ? '5000px' : '0', 
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none'
        }}
      >
        <div className="p-4 pt-0 border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};
