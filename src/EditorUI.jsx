import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Loader2, Music, ChevronDown, Info } from "lucide-react";
import { FONTS } from "./config";

// CORRECCIÓN SEC-03 y SEC-05: Eliminamos las keys hardcodeadas en texto plano
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

// 1. FileUpload
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

    if (!IMGBB_API_KEY) {
      alert("Error: La API Key de ImgBB no está configurada en el servidor (.env).");
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
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-1">{label}</label>}
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
           <button disabled={uploading} onClick={() => inputRef.current?.click()} className="w-full py-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-colors bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer">
             {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {uploading ? "SUBIENDO..." : "SELECCIONAR ARCHIVO"}
           </button>
        </div>
      </div>
    </div>
  );
};

// 2. Inp
export const Inp = ({ label, value, onChange, placeholder, type = "text", multiline = false, className = "", icon: Icon = null }) => {
  const [localVal, setLocalVal] = useState(value || "");
  const isFocused = useRef(false);

  useEffect(() => { if (!isFocused.current) setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 500); return () => clearTimeout(timeout); }, [localVal, onChange, value]);

  const handleBlur = () => { isFocused.current = false; if (localVal !== (value || "")) onChange(localVal); };

  return (
    <div className={`mb-5 ${className}`}>
      {label && <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">{Icon && <Icon size={12}/>} {label}</label>}
      {multiline ? (
        <textarea value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className="w-full py-3.5 px-4 rounded-xl text-sm border focus:border-violet-500 outline-none transition-all resize-none min-h-[120px] bg-white text-slate-800 shadow-sm hover:border-slate-300" />
      ) : (
        <input type={type} value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className="w-full py-3.5 px-4 rounded-xl text-sm border focus:border-violet-500 outline-none transition-all bg-white text-slate-800 shadow-sm hover:border-slate-300" />
      )}
    </div>
  );
};

// 3. Toggle
export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-12 h-7 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600 shadow-inner"></div>
  </label>
);

// 4. GiphySearch
export const GiphySearch = ({ onSelect, placeholder }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!term) return;
    if (!GIPHY_API_KEY) {
      alert("Error: La API Key de Giphy no está configurada en el servidor (.env).");
      return;
    }
    setLoading(true);
    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${term}&limit=20`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.data || []);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="mt-2 bg-white p-4 rounded-2xl border shadow-sm">
      <div className="flex gap-2 mb-4">
        <input value={term} onChange={e => setTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder={placeholder || "Buscar sticker..."} className="flex-1 py-2 px-3 border rounded-xl text-sm outline-none focus:border-violet-500 bg-slate-50" />
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

// ==========================================
// NUEVOS COMPONENTES (Solución a BUG-01)
// ==========================================

// 5. Tooltip
export const Tooltip = ({ text }) => (
  <span className="group relative ml-1 inline-flex items-center cursor-help text-slate-400 hover:text-violet-500">
    <Info size={14} />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg group-hover:block z-50 text-center font-normal shadow-lg pointer-events-none">
      {text}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
    </span>
  </span>
);

// 6. Accordion (Acc)
export const Acc = ({ title, icon: Icon, iconColor, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-slate-700">
          {Icon && <Icon size={18} color={iconColor} />} {title}
        </div>
        <ChevronDown size={18} className={`text-slate-400 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-4 border-t border-slate-100 bg-white">{children}</div>}
    </div>
  );
};

// 7. SelectInp
export const SelectInp = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm border bg-white focus:border-violet-500 outline-none text-slate-700 cursor-pointer shadow-sm">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// 8. FontSelector
export const FontSelector = ({ value, onChange }) => (
  <SelectInp value={value} onChange={onChange} options={FONTS} />
);

// 9. TypoControl
export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, minSize = 10, maxSize = 100 }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner mb-4">
     {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">{label}</label>}
     {onFont && <FontSelector value={fontVal} onChange={onFont} />}
     <div className="flex items-center gap-3 mt-3">
        {onColor && <input type="color" value={colorVal} onChange={e => onColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0 shrink-0 bg-white shadow-sm hover:scale-105 transition-transform" />}
        {onSize && <input type="range" min={minSize} max={maxSize} value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="flex-1 accent-violet-600 cursor-pointer" />}
        {onSize && <span className="text-[10px] font-bold text-slate-500 w-10 text-right bg-white py-1 px-2 rounded-md border shadow-sm">{sizeVal}px</span>}
     </div>
  </div>
);

// 10. MiniInp
export const MiniInp = ({ value, onChange, placeholder, type = "text", className = "", maxLength }) => (
  <input 
    type={type} 
    value={value} 
    onChange={e => onChange(e.target.value)} 
    placeholder={placeholder} 
    maxLength={maxLength} 
    className={`outline-none focus:border-violet-500 transition-colors ${className}`} 
  />
);

// 11. EmojiPicker
export const EmojiPicker = ({ value, onSelect }) => (
  <input 
    type="text" 
    value={value || "✨"} 
    onChange={e => {
      const val = e.target.value;
      const emoji = Array.from(val).pop() || "✨"; // Toma el último carácter real (soporte unicode para emojis)
      onSelect(emoji); 
    }} 
    className="w-12 h-12 text-2xl text-center rounded-xl border border-slate-200 bg-white cursor-pointer focus:border-violet-500 shrink-0 outline-none p-0 shadow-sm hover:bg-slate-50 transition-colors" 
    title="Escribe un emoji" 
  />
);

// 12. BordersGallery (Evitando Bug 11)
export const BordersGallery = ({ value, onChange }) => {
   // Generamos array del 1 al 16, saltando el 5 que está roto
   const borders = Array.from({length: 16}, (_, i) => i + 1).filter(n => n !== 5);
   
   return (
     <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner custom-scrollbar">
       {borders.map(n => {
         const url = `/borders/${n}-Photoroom.png`;
         const isSelected = value === url;
         return (
           <div 
             key={n} 
             onClick={() => onChange(url)} 
             className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${isSelected ? 'border-pink-500 bg-pink-100 shadow-md scale-105' : 'border-transparent bg-white hover:border-pink-300 shadow-sm hover:scale-105'}`}
           >
             <img src={url} alt={`Borde decorativo ${n}`} className="w-full h-auto object-contain aspect-square" />
           </div>
         );
       })}
     </div>
   );
};
