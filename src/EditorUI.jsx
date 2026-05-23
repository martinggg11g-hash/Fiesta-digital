import React, { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Loader2, ChevronDown, Info, Upload } from "lucide-react";

// API Keys
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

// 1. Componentes Base de Interfaz
export const Inp = ({ label, value, onChange, placeholder, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</label>}
    <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-500 bg-white" />
  </div>
);

export const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-300'}`}>
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

export const Acc = ({ title, icon: Icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100">
        <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-700">
          {Icon && <Icon size={16} />} {title}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-4 border-t border-slate-100">{children}</div>}
    </div>
  );
};

// 2. Componentes Especializados
export const FileUpload = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
    } catch (e) { alert("Error al subir imagen"); }
    setUploading(false);
  };
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{label}</label>
      <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-violet-500 transition-colors">
        <Upload size={16} className="text-slate-400" />
        <span className="text-xs text-slate-500">{uploading ? "Subiendo..." : "Click para cambiar"}</span>
        <input type="file" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
};

export const BordersGallery = ({ value, onChange }) => {
  const borders = Array.from({ length: 15 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2">
      {borders.map(n => {
        const url = `/borders/${n}.png`; // Asegúrate que tu carpeta de assets tenga estos archivos
        return (
          <div key={n} onClick={() => onChange(url)} className={`cursor-pointer border-2 rounded-lg p-1 ${value === url ? 'border-violet-500' : 'border-transparent'}`}>
            <img src={url} className="w-full h-auto" alt="Borde" />
          </div>
        );
      })}
    </div>
  );
};

export const FontSelector = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white">
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

export const TypoControl = ({ label, fontVal, onFont, colorVal, onColor, sizeVal, onSize, options }) => (
  <div className="p-3 bg-slate-50 rounded-xl border mb-4">
    <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">{label}</label>
    <FontSelector value={fontVal} onChange={onFont} options={options} />
    <div className="flex items-center gap-2 mt-2">
      <input type="color" value={colorVal} onChange={e => onColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
      <input type="range" min="10" max="80" value={sizeVal} onChange={e => onSize(Number(e.target.value))} className="flex-1" />
    </div>
  </div>
);

export const Tooltip = ({ text }) => (
  <div className="group relative inline-block">
    <Info size={14} className="text-slate-400 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded hidden group-hover:block z-50 text-center">
      {text}
    </div>
  </div>
);
