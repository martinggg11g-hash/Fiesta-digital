import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { OpeningAnimation } from "./Lotties"; 
import {
  Palette, ChevronDown, Type, ArrowLeft, Save, Star, Image as ImageIcon, 
  Layout, List, Trash2, Loader2, Video, Link as LinkIcon, Sparkles, 
  MoveVertical, Music, LayoutGrid, Smartphone, Calendar, Clock, CheckCircle2
} from "lucide-react";

// 1. IMPORTAMOS LO QUE SEPARAMOS A LOS OTROS ARCHIVOS
import { 
  DEF_CONFIG, ANIMATION_CATEGORIES, THEMES, FONTS, EFFECTS, 
  TRANSITION_OPTS, GENERAL_EMOJIS, FOOD_EMOJIS, CLOTHES_EMOJIS 
} from "./config";
import { InvitePreview } from "./Preview";

// 2. RE-EXPORTAMOS PARA NO ROMPER APP.JSX
export { DEF_CONFIG } from "./config";
export { InvitePreview } from "./Preview";

// 3. CONFIGURACIÓN DE APIS (Giphy e ImgBB)
const gf = new GiphyFetch('32PbboqCveiWSlj9vROPmyjv8l8cuaj1');
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

/* ============================================================================
   MINI-COMPONENTES DE INTERFAZ (Inputs, Botones, Acordeones)
============================================================================ */

const GiphySearch = ({ onSelect, placeholder = "Buscar GIF..." }) => {
  const [term, setTerm] = useState("fiesta");
  const [debouncedTerm, setDebouncedTerm] = useState("fiesta");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(term), 600);
    return () => clearTimeout(t);
  }, [term]);

  const fetchGifs = (offset) => gf.search(debouncedTerm || "party", { offset, limit: 10, lang: 'es' });

  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-2 mb-4">
      <input 
        value={term} 
        onChange={(e) => setTerm(e.target.value)} 
        placeholder={placeholder} 
        className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:border-violet-400 outline-none mb-3 shadow-sm" 
      />
      <div className="h-48 overflow-y-auto fd-sb rounded-xl bg-white border border-slate-100 relative z-50">
        <Grid width={300} columns={2} fetchGifs={fetchGifs} key={debouncedTerm} onGifClick={(gif, e) => { e.preventDefault(); onSelect(gif.images.original.url); }} />
      </div>
    </div>
  );
};

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
    )}
  </div>
);

const SelectInp = ({ label, value, onChange, options, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all cursor-pointer">
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const FileUpload = ({ label, onChange, value }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.data.url);
      } else {
        alert("Error al subir la imagen a la nube. Intentalo de nuevo.");
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Hubo un problema de conexión al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4 text-left relative">
      {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
      <div className="relative">
        <input 
          type="file" accept="image/*" onChange={handleFile} disabled={uploading}
          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer disabled:opacity-50" 
        />
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 border border-violet-200">
            <span className="text-xs font-bold text-violet-600 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Subiendo a la nube...
            </span>
          </div>
        )}
      </div>
      {value && !uploading && (
        <div className="relative mt-3 group">
          <img src={value} alt="preview" className="h-20 w-full object-cover rounded-xl border border-gray-200 shadow-sm" />
          <button type="button" onClick={() => onChange("")} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer hover:bg-red-600">
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

const EmojiPicker = ({ value, onSelect, list = GENERAL_EMOJIS }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => { 
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; 
    document.addEventListener("mousedown", fn); 
    return () => document.removeEventListener("mousedown", fn); 
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button onClick={() => setOpen(!open)} type="button" className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 text-2xl flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
        {value}
      </button>
      {open && (
        <div className="absolute top-14 left-0 z-50 bg-white border border-gray-200 rounded-2xl p-3 w-64 shadow-2xl">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto fd-sb">
            {list.map(e => (
              <button key={e} type="button" onClick={() => { onSelect(e); setOpen(false); }} className="p-2 text-xl hover:bg-gray-100 rounded-lg cursor-pointer">{e}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Acc = ({ title, icon: Icon, children, defaultOpen = false, iconColor = "#7c3aed" }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [fullyOpen, setFullyOpen] = useState(defaultOpen);

  useEffect(() => {
    let t;
    if (open) { t = setTimeout(() => setFullyOpen(true), 300); } 
    else { setFullyOpen(false); }
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className={`mb-3 rounded-2xl border border-gray-100 bg-white shadow-sm relative transition-all ${open ? 'z-40' : 'z-10'}`}>
      <button onClick={() => setOpen(!open)} type="button" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${fullyOpen ? 'overflow-visible' : 'overflow-hidden'}`} style={{ maxHeight: open ? '3000px' : '0', opacity: open ? 1 : 0 }}>
        <div className="p-4 pt-0 border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   PANTALLA DEL EDITOR (EL PANEL QUE USA EL SALÓN)
============================================================================ */
export const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [previewAnim, setPreviewAnim] = useState(false);
  const [animCat, setAnimCategory] = useState("infantil");
  const [mobileView, setMobileView] = useState("editor");

  useEffect(() => {
    const found = invitations.find(i => i.id === id);
    if (found) setInv({ ...found });
    else navigate("/dashboard");
  }, [id, invitations, navigate]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando editor...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const handleSave = () => { onSave(inv); navigate("/dashboard"); };
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      
      <style>{`
        .fd-sb::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
        .fd-sb::-webkit-scrollbar-thumb { background: #b4aee8 !important; border-radius: 10px !important; }
        .fd-sb::-webkit-scrollbar-thumb:hover { background: #8b5cf6 !important; }
        .fd-sb::-webkit-scrollbar-track { background: #f1f0f5 !important; border-radius: 10px !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER SUPERIOR */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 cursor-pointer">
            <ArrowLeft size={20}/>
          </button>
          <input 
            className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5 focus:bg-white/10 transition-colors" 
            value={inv.title} 
            onChange={e => setInv({...inv, title: e.target.value})} 
          />
        </div>
        <button onClick={handleSave} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl shadow-violet-900/40 cursor-pointer transition-colors">
          <Save size={16}/> GUARDAR CAMBIOS
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex relative overflow-hidden bg-slate-950">
        
        {/* BOTTOM TABS FLOTANTES (Solo Mobile) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/95 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 p-1.5 anim-pop">
          <button onClick={() => setMobileView("editor")} className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${mobileView === "editor" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>✏️ Editar</button>
          <button onClick={() => setMobileView("preview")} className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${mobileView === "preview" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👀 Previa</button>
        </div>

        {/* PANEL LATERAL DE CONTROLES */}
        <aside className={`w-[100vw] md:w-[380px] h-full shrink-0 bg-[#f8f7ff] overflow-y-auto p-6 pb-24 md:pb-6 border-r border-gray-100 z-10 fd-sb ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
            
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Personalización Completa</h3>

          <Acc title="Estilo y Colores" icon={Palette} defaultOpen iconColor="#7c3aed">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Temas Sugeridos</label>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {THEMES.map(th => (
                <button
                  key={th.id} title={th.name}
                  onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${cfg.theme === th.id ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent'}`}
                  style={{ background: th.primary }}
                />
              ))}
            </div>

            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left mt-4 border-t border-gray-100 pt-4">Colores Manuales</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Primario</label><input type="color" value={cfg.primary} onChange={e => update('primary', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Arriba</label><input type="color" value={cfg.bg1} onChange={e => update('bg1', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Abajo</label><input type="color" value={cfg.bg2} onChange={e => update('bg2', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Tarjetas</label><input type="color" value={cfg.card} onChange={e => update('card', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Texto Ppal</label><input type="color" value={cfg.text} onChange={e => update('text', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
              <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Texto Secund</label><input type="color" value={cfg.muted} onChange={e => update('muted', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <SelectInp label="Tipografía Global" value={cfg.fontBody} options={FONTS} onChange={v => update("fontBody", v)} />
            </div>

            <div className="mb-4 mt-4 border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left flex items-center gap-2"><MoveVertical size={14}/> Tamaños de Letra (px)</label>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Nombre Principal</span><span>{cfg.honoreeSize ?? 48}px</span></div>
                  <input type="range" min={30} max={80} value={cfg.honoreeSize ?? 48} onChange={e => update("honoreeSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Frase (Estás invitado...)</span><span>{cfg.eventTypeSize ?? 11}px</span></div>
                  <input type="range" min={8} max={24} value={cfg.eventTypeSize ?? 11} onChange={e => update("eventTypeSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Texto Medalla</span><span>{cfg.badgeSize ?? 14}px</span></div>
                  <input type="range" min={10} max={30} value={cfg.badgeSize ?? 14} onChange={e => update("badgeSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Textos de Fecha/Lugar</span><span>{cfg.dateSize ?? 18}px</span></div>
                  <input type="range" min={12} max={30} value={cfg.dateSize ?? 18} onChange={e => update("dateSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1"><span>Títulos (Menú, Regalos...)</span><span>{cfg.titlesSize ?? 10}px</span></div>
                  <input type="range" min={8} max={20} value={cfg.titlesSize ?? 10} onChange={e => update("titlesSize", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mb-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sombreado de Portada</span>
                <Toggle checked={cfg.showCoverGradient !== false} onChange={v => update("showCoverGradient", v)} />
              </div>
              {cfg.showCoverGradient !== false && (
                <div className="mt-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left text-violet-500">
                    Intensidad: {cfg.coverGradientIntensity ?? 70}%
                  </label>
                  <input type="range" min={0} max={100} step={5} value={cfg.coverGradientIntensity ?? 70} onChange={e => update("coverGradientIntensity", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                </div>
              )}
            </div>

            <div className="mb-2 border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Partículas Flotantes</label>
              <div className="grid grid-cols-2 gap-2">
                {EFFECTS.map(eff => (
                  <button key={eff.id} type="button" onClick={() => update("particleEffect", eff.id)} className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${cfg.particleEffect === eff.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:border-violet-200'}`}>
                    <span className="text-base">{eff.icon}</span> {eff.name}
                  </button>
                ))}
              </div>
            </div>
          </Acc>

          <Acc title="Animación de Entrada" icon={Sparkles} iconColor="#f59e0b">
             <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <span className="text-xs font-bold text-slate-600 ml-2">¿Usar Animación?</span>
               <Toggle checked={cfg.openingAnimation !== 'none'} onChange={v => update("openingAnimation", v ? "envelope" : "none")} />
             </div>
             
             {cfg.openingAnimation !== 'none' && (
               <>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Categorías</label>
                 <div className="flex gap-2 overflow-x-auto fd-sb pb-2 mb-4">
                   {Object.keys(ANIMATION_CATEGORIES).map(c => (
                     <button key={c} onClick={() => setAnimCategory(c)} type="button" className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 transition-colors ${animCat === c ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                       {c === 'quince' ? '15 Años' : c}
                     </button>
                   ))}
                 </div>

                 <div className="grid grid-cols-2 gap-2 mb-4">
                   {ANIMATION_CATEGORIES[animCat].map(anim => (
                     <button key={anim.id} onClick={() => { update('openingAnimation', anim.id); setPreviewAnim(true); }} type="button" className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${cfg.openingAnimation === anim.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}>
                       <span className="text-2xl mb-1">{anim.emoji}</span>
                       <span className="text-center text-[10px] leading-tight">{anim.name}</span>
                     </button>
                   ))}
                 </div>

                 <div className="border-t border-gray-100 pt-4 mb-4">
                   <SelectInp label="Efecto de Salida" value={cfg.animationTransition || 'fade'} options={TRANSITION_OPTS} onChange={v => update("animationTransition", v)} />
                   <div className="mt-4">
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1.5"><span>Duración en pantalla</span><span>{cfg.animationDuration || 2} seg</span></div>
                      <input type="range" min={1} max={3} step={0.5} value={cfg.animationDuration || 2} onChange={e => update("animationDuration", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
                   </div>
                 </div>

                 <button type="button" onClick={() => setPreviewAnim(true)} className="w-full py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 border border-amber-200 shadow-sm">
                   ▶ PROBAR ANIMACIÓN ELEGIDA
                 </button>
               </>
             )}
          </Acc>

          <Acc title="Textos de Portada" icon={Type} iconColor="#0d9488">
            <Inp label="Nombre Agasajado" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <SelectInp className="flex-1 !mb-0" label="Fuente Especial" value={cfg.honoreeFont || cfg.fontTitle} options={FONTS} onChange={v => update("honoreeFont", v)} />
               <div className="w-10 flex flex-col justify-end"><input type="color" value={cfg.honoreeColor || cfg.text} onChange={e => update('honoreeColor', e.target.value)} className="w-full h-11 rounded-lg cursor-pointer" /></div>
            </div>

            <div className="flex gap-2 mt-4">
              <EmojiPicker value={cfg.eventTypeEmoji || "✨"} onSelect={v => update("eventTypeEmoji", v)} />
              <div className="flex-1"><Inp label="Frase (Ej: Estás invitado a...)" value={cfg.eventType} onChange={v => update("eventType", v)} /></div>
            </div>
            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <SelectInp className="flex-1 !mb-0" label="Fuente" value={cfg.eventTypeFont || cfg.fontBody} options={FONTS} onChange={v => update("eventTypeFont", v)} />
               <div className="w-10 flex flex-col justify-end"><input type="color" value={cfg.eventTypeColor || cfg.primary} onChange={e => update('eventTypeColor', e.target.value)} className="w-full h-11 rounded-lg cursor-pointer" /></div>
            </div>

            <div className="flex gap-2 mt-4">
              <EmojiPicker value={cfg.badgeEmoji} onSelect={v => update("badgeEmoji", v)} />
              <div className="flex-1"><Inp label="Texto Medalla (Ej: 5 añitos)" value={cfg.badgeText} onChange={v => update("badgeText", v)} /></div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Usar GIF Animado de Fondo?</span>
                <Toggle checked={cfg.useGiphyCover || false} onChange={v => update("useGiphyCover", v)} />
              </div>
              {cfg.useGiphyCover ? (
                <GiphySearch onSelect={url => update("coverPhoto", url)} placeholder="Buscar fondo (ej: spiderman, brillos...)" />
              ) : (
                <FileUpload label="Foto Principal de Portada" value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
              )}
            </div>
          </Acc>

          <Acc title="Temática de la Fiesta" icon={Star} iconColor="#eab308">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Temática</span>
              <Toggle checked={cfg.showTheme} onChange={v => update("showTheme", v)} />
            </div>
            {cfg.showTheme && (
              <>
                <Inp label="Etiqueta (Ej: Temática, Dress Code)" value={cfg.themeLabel} onChange={v => update("themeLabel", v)} />
                <div className="flex gap-2 mb-2">
                  <EmojiPicker value={cfg.themeIcon} onSelect={v => update("themeIcon", v)} />
                  <div className="flex-1"><Inp value={cfg.themeText} onChange={v => update("themeText", v)} placeholder="Ej: Dinosaurios, Sirenita..." className="!mb-0" /></div>
                </div>
              </>
            )}
          </Acc>

          <Acc title="Banner Promocional" icon={ImageIcon} iconColor="#d97706">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Banner Central</span>
              <Toggle checked={cfg.showBanner} onChange={v => update("showBanner", v)} />
            </div>
            {cfg.showBanner && (
              <>
                <Inp label="Título del Banner" value={cfg.bannerTitle} onChange={v => update("bannerTitle", v)} />
                <div className="flex items-center justify-between mt-4 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Usar GIF de Giphy?</span>
                  <Toggle checked={cfg.useGiphyBanner || false} onChange={v => update("useGiphyBanner", v)} />
                </div>
                {cfg.useGiphyBanner ? (
                  <GiphySearch onSelect={url => update("bannerPhoto", url)} placeholder="Buscar GIF (ej: infantil, azul, globos...)" />
                ) : (
                  <FileUpload label="Imagen de Banner" value={cfg.bannerPhoto} onChange={v => update("bannerPhoto", v)} />
                )}
              </>
            )}
          </Acc>

          <Acc title="Fecha, Hora y Lugar" icon={Calendar} iconColor="#e11d48">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Mostrar cuenta regresiva</span><Toggle checked={cfg.showCountdown || false} onChange={v => update("showCountdown", v)} /></div>
            {cfg.showCountdown && (
              <Inp label="Fecha exacta" type="datetime-local" value={cfg.countdownDate || ""} onChange={v => update("countdownDate", v)} />
            )}

            <div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Cuadro de Fecha</span><Toggle checked={cfg.showDate} onChange={v => update("showDate", v)} /></div>
            {cfg.showDate && <Inp label="Texto de Fecha" value={cfg.dateText} onChange={v => update("dateText", v)} />}

            <div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Cuadro de Horario</span><Toggle checked={cfg.showTime} onChange={v => update("showTime", v)} /></div>
            {cfg.showTime && <Inp label="Texto de Horario" value={cfg.timeText} onChange={v => update("timeText", v)} />}

            <div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Ubicación y Mapa</span><Toggle checked={cfg.showLocation} onChange={v => update("showLocation", v)} /></div>
            {cfg.showLocation && (
              <>
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 mb-4 opacity-80">
                  <p className="text-[10px] font-black text-violet-800 uppercase tracking-widest mb-1">📍 Dirección (Fijada por Master)</p>
                  <p className="text-xs font-bold text-violet-900">{cfg.locationName || "Nombre del Salón"}</p>
                  <p className="text-xs text-violet-700">{cfg.locationAddress || "Dirección configurada desde tu panel"}</p>
                </div>
                <div className="flex items-center justify-between mt-4 mb-2"><span className="text-xs font-bold text-slate-500">Aclarar Estacionamiento</span><Toggle checked={cfg.showParking} onChange={v => update("showParking", v)} /></div>
                {cfg.showParking && (
                  <SelectInp label="Tipo" value={cfg.parkingType} options={[{label:"Público en la calle", value:"Estacionamiento público"}, {label:"Cubierto / Privado", value:"Estacionamiento privado cubierto"}, {label:"Personalizado...", value:"otro"}]} onChange={v => update("parkingType", v)} />
                )}
                {cfg.showParking && cfg.parkingType === 'otro' && <Inp placeholder="Escribe aquí..." value={cfg.customParking || ""} onChange={v => update("customParking", v)} />}
              </>
            )}
          </Acc>

          <Acc title="Logo y Web del Salón" icon={LinkIcon} iconColor="#6366f1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Mostrar Logo</span>
              <Toggle checked={cfg.showVenueLogo || false} onChange={v => update("showVenueLogo", v)} />
            </div>
            {cfg.showVenueLogo && (
              <>
                <Inp label="Nombre del lugar" value={cfg.venueName || ""} onChange={v => update("venueName", v)} />
                <FileUpload label="Logo (imagen)" value={cfg.venueLogoUrl || ""} onChange={v => update("venueLogoUrl", v)} />
                <SelectInp label="Tipo de botón" value={cfg.venueLinkType || "web"} options={[{ label: "🌐 Ir al Sitio Web", value: "web" }, { label: "📱 Chatear por WhatsApp", value: "whatsapp" }]} onChange={v => update("venueLinkType", v)} />
                <Inp label="Link o Número" value={cfg.venueLink || ""} onChange={v => update("venueLink", v)} />
              </>
            )}
          </Acc>

          <Acc title="Música (Spotify)" icon={Music} iconColor="#10b981">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Activar Música</span>
              <Toggle checked={cfg.showMusic || false} onChange={v => update("showMusic", v)} />
            </div>
            {cfg.showMusic && (
              <>
                <Inp label="Link de Spotify (Canción o Playlist)" value={cfg.spotifyUrl || ""} onChange={v => update("spotifyUrl", v)} placeholder="https://open.spotify.com/track/..." />
              </>
            )}
          </Acc>

          <Acc title="Video de Invitación" icon={Video} iconColor="#8b5cf6">
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Agregar video</span><Toggle checked={cfg.showVideo || false} onChange={v => update("showVideo", v)} /></div>
            {cfg.showVideo && (
              <>
                <Inp label="Título del video" value={cfg.videoTitle || ""} onChange={v => update("videoTitle", v)} />
                <Inp label="Enlace de YouTube" value={cfg.videoUrl || ""} onChange={v => update("videoUrl", v)} />
              </>
            )}
          </Acc>

          <Acc title="Cronograma (Itinerario)" icon={Clock} iconColor="#ec4899">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Cronograma</span><Toggle checked={cfg.showItinerary} onChange={v => update("showItinerary", v)} /></div>
             {cfg.showItinerary && (
               <>
                 <div className="space-y-4 mb-6">
                    {cfg.itinerary?.map((item, i) => (
                      <div key={i} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative">
                        <button onClick={() => update("itinerary", cfg.itinerary.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                        <div className="flex gap-2 pr-6">
                          <input className="w-16 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.time} onChange={e => { const n = [...cfg.itinerary]; n[i].time = e.target.value; update("itinerary", n); }} />
                          <input className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.title} onChange={e => { const n = [...cfg.itinerary]; n[i].title = e.target.value; update("itinerary", n); }} />
                        </div>
                        <input className="w-full p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.sub} placeholder="Descripción (opcional)" onChange={e => { const n = [...cfg.itinerary]; n[i].sub = e.target.value; update("itinerary", n); }} />
                      </div>
                    ))}
                 </div>
                 <button onClick={() => update("itinerary", [...(cfg.itinerary || []), { time: "16:00", title: "Nuevo Evento", sub: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AÑADIR HORARIO</button>
               </>
             )}
          </Acc>

          <Acc title="Menú de Comida" icon={List} iconColor="#10b981">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Menú</span><Toggle checked={cfg.showMenu} onChange={v => update("showMenu", v)} /></div>
             {cfg.showMenu && (
               <>
                 <div className="space-y-3 mb-6">
                    {cfg.menuItems?.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                        <EmojiPicker list={FOOD_EMOJIS} value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} />
                        <input className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={m.label} onChange={e => { const n = [...cfg.menuItems]; n[i].label = e.target.value; update("menuItems", n); }} />
                        <button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
                 <button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Nueva Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AÑADIR COMIDA</button>
               </>
             )}
          </Acc>

          <Acc title="Dress Code y Regalos" icon={Layout} iconColor="#f43f5e">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Vestimenta</span><Toggle checked={cfg.showDressCode} onChange={v => update("showDressCode", v)} /></div>
             {cfg.showDressCode && (
               <div className="flex gap-2 mb-6">
                 <EmojiPicker list={CLOTHES_EMOJIS} value={cfg.dressCodeIcon} onSelect={e => update("dressCodeIcon", e)} />
                 <div className="flex-1"><Inp value={cfg.dressCodeText} onChange={v => update("dressCodeText", v)} placeholder="Ej: Elegante Sport" className="!mb-0"/></div>
               </div>
             )}

             <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100"><span className="text-xs font-bold text-slate-500">Activar Regalos</span><Toggle checked={cfg.showGifts} onChange={v => update("showGifts", v)} /></div>
             {cfg.showGifts && (
               <>
                 <div className="flex gap-2 mb-2">
                   <EmojiPicker value={cfg.giftIcon} onSelect={e => update("giftIcon", e)} />
                   <div className="w-24"><Inp value={cfg.giftLabel} onChange={v => update("giftLabel", v)} placeholder="Título" className="!mb-0"/></div>
                   <div className="flex-1"><Inp value={cfg.giftText} onChange={v => update("giftText", v)} placeholder="Lluvia de sobres..." className="!mb-0"/></div>
                 </div>
                 
                 <div className="flex items-center justify-between mt-4 mb-2"><span className="text-[10px] font-bold text-slate-500 uppercase">Aclaración Extra</span><Toggle checked={cfg.showGiftNote} onChange={v => update("showGiftNote", v)} /></div>
                 {cfg.showGiftNote && (
                   <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                     <Inp value={cfg.giftNoteText} onChange={v => update("giftNoteText", v)} placeholder="Ej: No traer cajas grandes.\nSolo transferencia." multiline className="!mb-2" />
                     <div className="flex gap-3 mt-3">
                       <div className="flex flex-col gap-1 flex-1">
                         <label className="text-[9px] font-bold text-slate-400 uppercase">Color Texto</label>
                         <input type="color" value={cfg.giftNoteColor || cfg.primary} onChange={e => update('giftNoteColor', e.target.value)} className="w-full h-8 rounded-lg cursor-pointer border-none shadow-sm" />
                       </div>
                       <div className="flex flex-col gap-1 flex-1">
                         <label className="text-[9px] font-bold text-slate-400 uppercase">Tamaño (px)</label>
                         <input type="number" min={8} max={24} value={cfg.giftNoteSize || 11} onChange={e => update('giftNoteSize', Number(e.target.value))} className="w-full h-8 px-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-violet-400" />
                       </div>
                     </div>
                   </div>
                 )}
               </>
             )}
          </Acc>

          <Acc title="Galería de Fotos" icon={ImageIcon} iconColor="#ec4899">
             <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Galería</span><Toggle checked={cfg.showGallery} onChange={v => update("showGallery", v)} /></div>
             {cfg.showGallery && (
               <>
                 <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                    <button onClick={() => update("galleryLayout", 'carousel')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${cfg.galleryLayout === 'carousel' || !cfg.galleryLayout ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      <Smartphone size={14}/> Carrusel
                    </button>
                    <button onClick={() => update("galleryLayout", 'grid')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${cfg.galleryLayout === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      <LayoutGrid size={14}/> Cuadrícula
                    </button>
                 </div>
                 <Inp label="Título de la Sección" value={cfg.galleryTitle} onChange={v => update("galleryTitle", v)} />
                 <div className="space-y-4 mb-4 mt-2">
                   {cfg.galleryPhotos?.map((p, i) => (
                     <div key={i} className="bg-white border border-gray-200 rounded-xl p-2 relative">
                       <FileUpload onChange={v => { const n = [...cfg.galleryPhotos]; n[i] = v; update("galleryPhotos", n); }} value={p} />
                       <button onClick={() => update("galleryPhotos", cfg.galleryPhotos.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={14}/></button>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => update("galleryPhotos", [...(cfg.galleryPhotos || []), ""])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer">+ AÑADIR FOTO</button>
               </>
             )}
          </Acc>

          <Acc title="WhatsApp de Confirmación" icon={CheckCircle2} iconColor="#22c55e">
            <Inp label="Número Celular (con código de país, sin +)" value={cfg.whatsappNumber} onChange={v => update("whatsappNumber", v)} placeholder="5491123456789" />
            <p className="text-[9px] text-gray-400 mb-2">Usa {"{nombre}"} para incluir el nombre del agasajado automáticamente en el mensaje.</p>
            <Inp label="Mensaje a enviar" value={cfg.whatsappMessage} onChange={v => update("whatsappMessage", v)} multiline />
          </Acc>

        </aside>

        {/* VISTA PREVIA CENTRAL */}
        <main className={`w-[100vw] md:flex-1 h-full shrink-0 snap-center bg-slate-900 flex items-center justify-center p-6 md:p-10 relative overflow-hidden pb-24 md:pb-6 ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl relative z-10 max-h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center"><div className="w-10 h-1 bg-slate-800 rounded-full" /></div>
            
            {previewAnim && <OpeningAnimation cfg={cfg} onOpen={() => setPreviewAnim(false)} isPreview={true} />}
            
            <div className="h-full w-full overflow-y-auto bg-black pb-10 fd-sb" style={{ scrollBehavior: 'smooth' }}>
              <InvitePreview cfg={cfg} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
