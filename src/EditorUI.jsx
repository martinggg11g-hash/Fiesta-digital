import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Loader2, GripVertical, Check, Music } from "lucide-react";

// CORRECCIÓN SEC-03: Variable de entorno para ocultar la API Key de ImgBB
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

export const FileUpload = ({ label, value, onChange, accept = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Si es mp3, se lee como dataURL (queda local por ahora hasta subir a BD real)
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
