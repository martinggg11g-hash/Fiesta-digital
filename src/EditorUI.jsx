import React, { useState, useEffect, useRef } from "react";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { ChevronDown, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { FONTS, GENERAL_EMOJIS } from "./config";

const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

// ICONOS DE FIESTA LIMPIOS
export const IconRenderer = ({ name, size = 24, color = "currentColor", className = "" }) => {
  if (!name) return null;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case 'icon-utensils': return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
    case 'icon-wine': return <svg {...p}><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>;
    case 'icon-cake': return <svg {...p}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg>;
    case 'icon-gift': return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>;
    case 'icon-dress': return <svg {...p}><path d="M9.5 2 6 7l1.5 5H6l-3 10h18l-3-10h-1.5L18 7l-3.5-5h-5Z"/><path d="M6 12h12"/></svg>;
    case 'icon-rings': return <svg {...p}><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>;
    case 'icon-heart': return <svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
    case 'icon-crown': return <svg {...p}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
};

const ICONS_LIST = ['icon-utensils', 'icon-wine', 'icon-cake', 'icon-gift', 'icon-dress', 'icon-rings', 'icon-heart', 'icon-crown'];

// BORDES PRE-CARGADOS EN BASE64 (PARA QUE NO DEN 404 NUNCA)
const getB = (n) => {
  const svg = [
    `<path d="M0,0v100c5,-25 25,-45 55,-45c20,0 45,-15 45,-55v-0z" />`,
    `<path d="M0,0v100h4v-96h96v-4z"/><circle cx="20" cy="20" r="4"/>`,
    `<path d="M0,0c0,50 50,100 100,100v-5c-45,0-95-45-95-95z"/><path d="M0,0c0,30 30,60 60,60v-3c-25,0-57-25-57-57z"/>`,
    `<path d="M0,0v100l20,-20v-60h60l20,-20z"/><rect x="30" y="30" width="10" height="10"/>`,
    `<path d="M0,100Q0,0 100,0L95,0Q95,95 0,95z"/><circle cx="15" cy="15" r="5"/>`,
    `<path d="M0,0v100c20,-20 80,-20 100,-100z" />`
  ];
  return "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="black">${svg[n-1]}</svg>`);
};

export const PRELOADED_BORDERS = [
  { id: 'b1', name: 'Vintage', url: getB(1) },
  { id: 'b2', name: 'Minimal', url: getB(2) },
  { id: 'b3', name: 'Curvas', url: getB(3) },
  { id: 'b4', name: 'Tribal', url: getB(4) },
  { id: 'b5', name: 'Floral', url: getB(5) },
  { id: 'b6', name: 'Abstracto', url: getB(6) },
  
  // ... los que ya tenías ...
  { id: 'b7', name: 'Mi Borde Nuevo', url: 'data:image/webp;base64,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' }

];

export const BordersGallery = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {PRELOADED_BORDERS.map(b => (
      <button key={b.id} type="button" onClick={() => onChange(b.url)} className={`p-2 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${value === b.url ? 'border-violet-500 bg-violet-100 shadow-md' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
        <div style={{ width: '40px', height: '40px', backgroundColor: value === b.url ? '#7c3aed' : '#94a3b8', WebkitMaskImage: `url("${b.url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: `url("${b.url}")`, maskSize: 'contain', maskRepeat: 'no-repeat' }} />
        <span className={`text-[9px] font-bold ${value === b.url ? 'text-violet-700' : 'text-slate-500'}`}>{b.name}</span>
      </button>
    ))}
  </div>
);

// EL RESTO DE COMPONENTES IGUAL (Inp, Toggle, Acc, etc.)
export const GiphySearch = ({ onSelect, placeholder = "Buscar GIF..." }) => {
  const [term, setTerm] = useState("fiesta");
  const [debouncedTerm, setDebouncedTerm] = useState("fiesta");
  useEffect(() => { const t = setTimeout(() => setDebouncedTerm(term), 600); return () => clearTimeout(t); }, [term]);
  const fetchGifs = (offset) => gf.search(debouncedTerm || "party", { offset, limit: 10, lang: 'es' });
  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-2 mb-4">
      <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:border-violet-400 outline-none mb-3 shadow-sm" />
      <div className="h-48 overflow-y-auto fd-sb rounded-xl bg-white border border-slate-100 relative z-50">
        <Grid width={300} columns={2} fetchGifs={fetchGifs} key={debouncedTerm} onGifClick={(gif, e) => { e.preventDefault(); onSelect(gif.images.original.url); }} />
      </div>
    </div>
  );
};

export const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null }) => {
  const [localVal, setLocalVal] = useState(value || "");
  useEffect(() => { setLocalVal(value || ""); }, [value]);
  useEffect(() => {
    const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 300);
    return () => clearTimeout(timeout);
  }, [localVal, onChange, value]);
  return (
    <div className={`mb-2 text-left ${className}`}>
      {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
        {multiline ? (
          <textarea value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all ${Icon ? 'pl-11 pr-4' : 'px-4'}`} />
        ) : (
          <input type={type} value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all ${Icon ? 'pl-11 pr-4' : 'px-4'}`} />
        )}
      </div>
    </div>
  );
};

export const MiniInp = ({ value, onChange, placeholder, className, type="text" }) => {
  const [localVal, setLocalVal] = useState(value || "");
  useEffect(() => { setLocalVal(value || ""); }, [value]);
  useEffect(() => {
    const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 300);
    return () => clearTimeout(timeout);
  }, [localVal, onChange, value]);
  return <input type={type} className={className} value={localVal} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} />;
};

export const SelectInp = ({ label, value, onChange, options, className="" }) => (
  <div className={`mb-2 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all cursor-pointer">
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export const FontSelector = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const selectedLabel = options.find(o => o.value === value)?.label || "Seleccionar...";
  
  return (
    <div className="relative w-full" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-white border border-gray-200 text-base focus:border-violet-400 outline-none transition-all flex justify-between items-center shadow-sm cursor-pointer" style={{ fontFamily: value }}>
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto fd-sb">
          {options.map((opt, i) => (
            <button key={i} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors text-xl border-b border-gray-50 last:border-0 cursor-pointer ${value === opt.value ? 'bg-violet-100 text-violet-700 font-bold' : 'text-slate-700'}`} style={{ fontFamily: opt.value }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize=10, maxSize=80 }) => (
  <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 shadow-sm mb-5 relative overflow-visible">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-200 rounded-l-xl" />
    <label className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-2">
      <span>{label}</span>
      {sizeVal && <span className="text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full">{sizeVal}px</span>}
    </label>
    <div className="flex gap-2 pl-2 items-start">
      {onFont && <div className="flex-1"><FontSelector value={fontVal} options={FONTS} onChange={onFont} /></div>}
      {onColor && <div className="shrink-0"><input type="color" value={colorVal} onChange={e => onColor(e.target.value)} className="w-10 h-11 rounded-lg cursor-pointer border border-gray-200 p-0 shadow-sm bg-white" /></div>}
    </div>
    {onSize && (
      <div className="mt-4 pl-2">
        <input type="range" min={minSize} max={maxSize} value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
      </div>
    )}
  </div>
);

export const FileUpload = ({ label, onChange, value }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
    } catch (err) { } 
    finally { setUploading(false); }
  };
  return (
    <div className="mb-4 text-left relative">
      {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
      <div className="relative">
        <label className={`flex items-center justify-center w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${uploading ? 'bg-violet-100 border-violet-200 text-violet-400 cursor-not-allowed' : 'bg-white border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 shadow-sm'}`}>
          <span className="flex items-center gap-2">{uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir PNG/JPG</>}</span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      </div>
      {value && !uploading && (
        <div className="relative mt-3 group w-fit">
          <img src={value} alt="preview" className="h-20 w-auto object-cover rounded-xl border border-gray-200 shadow-sm" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"><Trash2 size={12} /></button>
        </div>
      )}
    </div>
  );
};

export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

export const EmojiPicker = ({ value, onSelect, list = GENERAL_EMOJIS }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('emoji'); 
  const ref = useRef(null);
  useEffect(() => { const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  return (
    <div ref={ref} className="relative z-[999]">
      <button type="button" onClick={() => setOpen(!open)} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl hover:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none transition-all shadow-sm cursor-pointer">
        {typeof value === 'string' && value.startsWith('icon-') ? <IconRenderer name={value} size={24} color="#64748b" /> : (value || "✨")}
      </button>
      {open && (
        <div className="absolute top-14 left-0 z-[1000] bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
            <button type="button" onClick={() => setTab('emoji')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-colors ${tab === 'emoji' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>😀 Emojis</button>
            <button type="button" onClick={() => setTab('icon')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-colors ${tab === 'icon' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>✨ Íconos</button>
          </div>
          {tab === 'emoji' ? (
            <>
              <input type="text" placeholder="Emoji a mano..." onChange={e => { onSelect(e.target.value); if(e.target.value) setOpen(false); }} className="w-full mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-400 text-center" />
              <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto fd-sb">{list.map((e, i) => (<button key={i} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-violet-50 rounded-lg cursor-pointer flex justify-center items-center">{e}</button>))}</div>
            </>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto fd-sb">{ICONS_LIST.map((ic, i) => (<button key={i} type="button" onClick={() => { onSelect(ic); setOpen(false); }} className="p-2 hover:bg-violet-50 text-slate-500 hover:text-violet-600 rounded-lg cursor-pointer flex justify-center items-center transition-colors"><IconRenderer name={ic} size={22} /></button>))}</div>
          )}
        </div>
      )}
    </div>
  );
};

export const Acc = ({ title, icon: Icon, children, defaultOpen = false, iconColor = "#7c3aed" }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [fullyOpen, setFullyOpen] = useState(defaultOpen);
  useEffect(() => { let t; if (open) t = setTimeout(() => setFullyOpen(true), 300); else setFullyOpen(false); return () => clearTimeout(t); }, [open]);
  return (
    <div className={`mb-3 rounded-2xl border border-gray-100 bg-white shadow-sm relative transition-all ${open ? 'z-40' : 'z-10'}`}>
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}><Icon size={18} style={{ color: iconColor }} /></div><span className="font-bold text-slate-800 text-sm">{title}</span></div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${fullyOpen ? 'overflow-visible' : 'overflow-hidden'}`} style={{ maxHeight: open ? '3000px' : '0', opacity: open ? 1 : 0 }}><div className="p-4 pt-0 border-t border-gray-50">{children}</div></div>
    </div>
  );
};
