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
