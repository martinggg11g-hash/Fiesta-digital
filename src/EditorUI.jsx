import React, { useState, useEffect, useRef } from "react";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { ChevronDown, Loader2, Trash2, Image as ImageIcon } from "lucide-react";

import { FONTS, GENERAL_EMOJIS } from "./config";

const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

// ==========================================
// ÍCONOS PREMIUM (SVG PURO SUPER VITAMINADO)
// ==========================================
export const IconRenderer = ({ name, size = 24, color = "currentColor", className = "" }) => {
  if (!name) return null;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case 'icon-utensils': return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
    case 'icon-wine': return <svg {...p}><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>;
    case 'icon-glass': return <svg {...p}><path d="M17 10c-2.5-3-2.5-6-2.5-6s-1.5 2-3.5 2-3.5-2-3.5-2-0 3-2.5 6"/><path d="M5 10c.5 1.5 1.5 3 3 4s3.5 2 3.5 2 2-1 3.5-2 2.5-2.5 3-4"/><path d="M11 16v5"/><path d="M8 21h6"/></svg>;
    case 'icon-cake': return <svg {...p}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>;
    case 'icon-gift': return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>;
    case 'icon-shirt': return <svg {...p}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
    case 'icon-heart': return <svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
    case 'icon-music': return <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'icon-star': return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'icon-camera': return <svg {...p}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
    case 'icon-car': return <svg {...p}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-4-3-4H8c-1.7 0-3 4-3 4s-2.7.6-4.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    case 'icon-sparkles': return <svg {...p}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>;
    case 'icon-crown': return <svg {...p}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
    case 'icon-ticket': return <svg {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
    // NUEVOS ÍCONOS AÑADIDOS ABAJO
    case 'icon-rings': return <svg {...p}><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>;
    case 'icon-church': return <svg {...p}><path d="M12 2v5"/><path d="M10 5h4"/><path d="M12 7l-6 5v10h12V12l-6-5Z"/><path d="M10 22v-4a2 2 0 0 1 4 0v4"/></svg>;
    case 'icon-baby': return <svg {...p}><circle cx="12" cy="10" r="4"/><path d="M12 14v6"/><path d="M9 17h6"/><path d="M12 2v4"/></svg>;
    case 'icon-graduation': return <svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case 'icon-diamond': return <svg {...p}><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/></svg>;
    case 'icon-flower': return <svg {...p}><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5M12 12v9"/></svg>;
    case 'icon-bell': return <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case 'icon-key': return <svg {...p}><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>;
    case 'icon-anchor': return <svg {...p}><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>;
    case 'icon-plane': return <svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-.5-.5-2.5 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1 2.6c-.2.5.1 1 .6 1.1L9 13l-4 4-2.5-.8c-.5-.2-1 0-1.2.4l-.8 1.8c-.2.5 0 1 .4 1.2L5 20l.8 4.1c.1.5.7.7 1.2.4l1.8-.8c.4-.2.6-.7.4-1.2L8.4 20l4-4 2.4 5.7c.1.5.6.8 1.1.6l2.6-1c.5-.2.8-.6.7-1.1Z"/></svg>;
    case 'icon-map': return <svg {...p}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
};
// Agregados a la lista general para que aparezcan en la pestaña
const ICONS_LIST = [
  'icon-utensils', 'icon-wine', 'icon-glass', 'icon-cake', 'icon-gift', 'icon-shirt', 
  'icon-heart', 'icon-music', 'icon-star', 'icon-camera', 'icon-car', 'icon-sparkles', 
  'icon-crown', 'icon-ticket', 'icon-rings', 'icon-church', 'icon-baby', 'icon-graduation',
  'icon-diamond', 'icon-flower', 'icon-bell', 'icon-key', 'icon-anchor', 'icon-plane', 'icon-map'
];

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
          <span className="flex items-center gap-2">{uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir imagen de tu galería</>}</span>
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
  
  useEffect(() => { 
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; 
    document.addEventListener("mousedown", fn); 
    return () => document.removeEventListener("mousedown", fn); 
  }, []);
  
  return (
    <div ref={ref} className="relative z-[999]">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl hover:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none transition-all shadow-sm cursor-pointer"
      >
        {typeof value === 'string' && value.startsWith('icon-') ? <IconRenderer name={value} size={24} color="#64748b" /> : (value || "✨")}
      </button>
      
      {open && (
        <div className="absolute top-14 left-0 z-[1000] bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
            <button type="button" onClick={() => setTab('emoji')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-colors ${tab === 'emoji' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>😀 Emojis</button>
            <button type="button" onClick={() => setTab('icon')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-colors ${tab === 'icon' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}>✨ Íconos</button>
          </div>
          
          {tab === 'emoji' && (
            <>
              <input 
                type="text" 
                placeholder="Pegá tu emoji a mano..." 
                onChange={e => { onSelect(e.target.value); if(e.target.value) setOpen(false); }} 
                className="w-full mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-400 text-center"
              />
              <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto fd-sb">
                {list.map((e, i) => (
                  <button key={i} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-violet-50 rounded-lg cursor-pointer flex justify-center items-center">{e}</button>
                ))}
              </div>
            </>
          )}
          
          {tab === 'icon' && (
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto fd-sb">
              {ICONS_LIST.map((ic, i) => (
                <button key={i} type="button" onClick={() => { onSelect(ic); setOpen(false); }} className="p-2 hover:bg-violet-50 text-slate-500 hover:text-violet-600 rounded-lg cursor-pointer flex justify-center items-center transition-colors">
                  <IconRenderer name={ic} size={22} />
                </button>
              ))}
            </div>
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}><Icon size={18} style={{ color: iconColor }} /></div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${fullyOpen ? 'overflow-visible' : 'overflow-hidden'}`} style={{ maxHeight: open ? '3000px' : '0', opacity: open ? 1 : 0 }}>
        <div className="p-4 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};
