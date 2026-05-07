import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Eye, EyeOff, ImageIcon, Loader2, Trash2, X, ScanBarcode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode"; // Corregido para usar el core directo

const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

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
          <textarea value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all resize-none ${bgClass} ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
        ) : (
          <input type={actualType} value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all ${bgClass} ${(Icon || prefix) ? 'pl-11' : 'px-4'} ${type === 'password' ? 'pr-12' : 'pr-4'}`} />
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

export const FileUpload = ({ label, onChange, value, isDark=false }) => {
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
    } catch (err) { } finally { setUploading(false); }
  };
  return (
    <div className="mb-4 text-left relative">
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>}
      <div className="relative">
        <label className={`flex items-center justify-center w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed bg-slate-700 text-white' : (isDark ? 'bg-slate-800 border-slate-700 text-violet-400 hover:bg-slate-700' : 'bg-white border-violet-200 text-violet-600 hover:bg-violet-50')}`}>
          <span className="flex items-center gap-2">{uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir logo</>}</span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      </div>
      {value && !uploading && (
        <div className="relative mt-3 group w-fit">
          <img src={value} alt="preview" className="h-16 w-auto object-contain rounded-xl border border-gray-200 shadow-sm bg-white p-2" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"><Trash2 size={12} /></button>
        </div>
      )}
    </div>
  );
};

export const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
  </label>
);

export const QRScannerModal = ({ onClose, onScan }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => { html5QrCode.stop().then(() => onScan(decodedText)); },
      (err) => { }
    ).catch(err => {
      alert("Por favor, dale permisos a la cámara en tu navegador.");
    });
    return () => { if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.log(e)); };
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
