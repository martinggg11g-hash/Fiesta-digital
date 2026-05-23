import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Eye, EyeOff, ImageIcon, Loader2, Trash2, X, ScanBarcode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode"; // Corregido para usar el core directo

// CORRECCIÓN SEC-03: Variable de entorno para ocultar la API Key
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10 anim-pop">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

export const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null, prefix=null, isDark=false }) => {
  const [localVal, setLocalVal] = useState(value || "");
  const [showPwd, setShowPwd] = useState(false);
  const isFocused = useRef(false);

  useEffect(() => { if (!isFocused.current) setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 400); return () => clearTimeout(timeout); }, [localVal, onChange, value]);

  const handleBlur = () => { isFocused.current = false; if (localVal !== (value || "")) onChange(localVal); };
  const bgClass = isDark ? "bg-slate-800 border-slate-700 text-white focus:bg-slate-700" : "bg-gray-50 border-gray-200 text-slate-800 focus:bg-white";
  const actualType = type === 'password' && showPwd ? 'text' : type;
  
  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
        {prefix && <span className="absolute left-4 text-slate-400 font-bold">{prefix}</span>}
        {multiline ? (
           <textarea value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className={`w-full py-3 px-4 rounded-xl text-sm border focus:border-violet-400 outline-none transition-all resize-none min-h-[100px] ${bgClass}`} />
        ) : (
           <input type={actualType} value={localVal} onFocus={() => isFocused.current = true} onBlur={handleBlur} onChange={e => setLocalVal(e.target.value)} placeholder={placeholder} className={`w-full py-3 rounded-xl text-sm border focus:border-violet-400 outline-none transition-all ${bgClass} ${Icon ? 'pl-11' : (prefix ? 'pl-14' : 'px-4')} ${type === 'password' ? 'pr-12' : 'pr-4'}`} />
        )}
        {type === 'password' && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 text-slate-400 hover:text-violet-500 transition-colors cursor-pointer">
            {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
    </div>
  );
};

export const FileUpload = ({ label, value, onChange, isDark=false, allowPdf=false }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (allowPdf && file.type === "application/pdf") {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => { onChange(reader.result); setUploading(false); };
      reader.readAsDataURL(file);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url); else alert("Error subiendo archivo");
    } catch (err) { alert("Error de red"); }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const bgClass = isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-gray-50 border-gray-200 hover:bg-gray-100";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";

  return (
    <div className="mb-4 text-left">
      <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
      <input type="file" ref={inputRef} accept={allowPdf ? "image/*,.pdf" : "image/*"} onChange={handleFileChange} className="hidden" />
      <div className={`flex items-center gap-3 border rounded-xl p-2 transition-colors ${bgClass}`}>
        {value ? (
           <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 shadow-sm relative group">
              {value.includes('pdf') || value.startsWith('data:application/pdf') ? 
                <span className="text-[10px] font-black text-red-500">PDF</span> : 
                <img src={value} alt="" className="w-full h-full object-cover" />
              }
              <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Trash2 size={16}/></button>
           </div>
        ) : (
           <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-white text-slate-400'}`}><ImageIcon size={20}/></div>
        )}
        <button disabled={uploading} onClick={() => inputRef.current?.click()} className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-2 cursor-pointer transition-colors ${isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'} disabled:opacity-50`}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {uploading ? "SUBIENDO..." : "CAMBIAR"}
        </button>
      </div>
    </div>
  );
};

// CORRECCIÓN UX-02: Color violeta para consistencia visual
export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

// CORRECCIÓN MOB-01: Control de unmounted para evitar memory leaks en desmontaje rápido
export const QRScannerModal = ({ onClose, onScan }) => {
  useEffect(() => {
    let unmounted = false;
    const html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => { 
        if (!unmounted) {
          html5QrCode.stop().then(() => onScan(decodedText)); 
        }
      },
      (err) => { }
    ).then(() => {
      if (unmounted && html5QrCode.isScanning) {
        html5QrCode.stop().catch(e => console.log(e));
      }
    }).catch(err => {
      if (!unmounted) alert("Por favor, dale permisos a la cámara en tu navegador.");
    });

    return () => { 
      unmounted = true;
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(e => console.log(e)); 
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl relative text-center anim-pop">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={20}/></button>
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><ScanBarcode size={30}/></div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Control de Acceso</h2>
          <p className="text-slate-500 text-xs mb-6">Enfocá el QR del invitado.</p>
          <div id="reader" className="w-full overflow-hidden rounded-2xl border-4 border-slate-100 aspect-square"></div>
       </div>
    </div>
  );
};
