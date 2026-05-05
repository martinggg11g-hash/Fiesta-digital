import React, { useState } from "react";
import { Palette, Star, Image as ImageIcon, Layout, List, Trash2, Video, Link as LinkIcon, LayoutGrid, Smartphone, Calendar, Clock, CheckCircle2, MessageCircle, Plus, Edit2 } from "lucide-react";
import { GiphySearch, Inp, MiniInp, SelectInp, TypoControl, FontSelector, FileUpload, Toggle, EmojiPicker, Acc, BordersGallery } from "./EditorUI";
import { ANIMATION_CATEGORIES, THEMES, FONTS, TRANSITION_OPTS, FOOD_EMOJIS, CLOTHES_EMOJIS } from "./config";

export default function EditorSidebar({ inv, setInv, cfg, update, setPreviewAnim, mobileView }) {
  const [animCat, setAnimCategory] = useState("infantil");
  return (
    <aside className={`w-[100vw] md:w-[420px] h-full shrink-0 bg-[#f8f7ff] overflow-y-auto p-6 pb-24 md:pb-6 border-r border-gray-100 z-10 fd-sb ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Flujo de Edición</h3>
      <Acc title="🎨 Diseño Base y Animación" icon={Palette} iconColor="#6366f1">
         <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
           <span className="text-xs font-bold text-slate-600 ml-2">¿Animación de Entrada?</span>
           <Toggle checked={cfg.openingAnimation !== 'none'} onChange={v => update("openingAnimation", v ? "envelope" : "none")} />
         </div>
         {cfg.openingAnimation !== 'none' && (
           <div className="mb-6 border-b border-gray-100 pb-4">
             <div className="flex gap-2 overflow-x-auto fd-sb pb-2 mb-4">
               {Object.keys(ANIMATION_CATEGORIES).map(c => (<button key={c} onClick={() => setAnimCategory(c)} type="button" className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 transition-colors cursor-pointer ${animCat === c ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{c === 'quince' ? '15 Años' : c}</button>))}
             </div>
             <div className="grid grid-cols-2 gap-2 mb-4">
               {ANIMATION_CATEGORIES[animCat].map(anim => (<button key={anim.id} onClick={() => { update('openingAnimation', anim.id); setPreviewAnim(true); }} type="button" className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${cfg.openingAnimation === anim.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}><span className="text-2xl mb-1">{anim.emoji}</span><span className="text-center text-[10px] leading-tight">{anim.name}</span></button>))}
             </div>
             <SelectInp label="Efecto de Salida" value={cfg.animationTransition || 'fade'} options={TRANSITION_OPTS} onChange={v => update("animationTransition", v)} />
             <button type="button" onClick={() => setPreviewAnim(true)} className="w-full mt-2 py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 border border-amber-200 cursor-pointer">▶ PROBAR ANIMACIÓN</button>
           </div>
         )}
         {/* SELECTOR ÍCONOS PREMIUM */}
        <div className="mb-6 p-4 rounded-xl border-2 border-violet-100 bg-violet-50/50">
          <label className="block text-[10px] font-black text-violet-600 uppercase tracking-widest mb-3 text-center">Estilo de los Símbolos</label>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-violet-100">
             <button onClick={() => update("usePremiumIcons", false)} type="button" className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${!cfg.usePremiumIcons ? 'bg-violet-100 text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🎉 Emojis</button>
             <button onClick={() => update("usePremiumIcons", true)} type="button" className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${cfg.usePremiumIcons ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>✨ Íconos</button>
          </div>
        </div>
        {/* BORDES PNG */}
        <div className="mb-6 p-4 rounded-xl border border-pink-100 bg-pink-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Bordes Ornamentales Globales</span>
            <Toggle checked={cfg.showCoverBorders || false} onChange={v => update("showCoverBorders", v)} />
          </div>
          {cfg.showCoverBorders && (
            <>
              <BordersGallery value={cfg.selectedBorder} onChange={v => update("selectedBorder", v)} />
              <div className="mt-4 pt-4 border-t border-pink-100">
                 <Inp label="Link directo a tu propio PNG" value={cfg.selectedBorder} onChange={v => update("selectedBorder", v)} placeholder="https://..." />
                 <SelectInp label="Posición" value={cfg.borderPosition || 'both'} options={[{label:'Arriba y Abajo', value:'both'}, {label:'Solo Arriba', value:'top'}, {label:'Solo Abajo', value:'bottom'}]} onChange={v => update('borderPosition', v)} />
                 <div className="flex flex-col gap-1 mt-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Color del Borde</label>
                  <input type="color" value={cfg.borderColor || cfg.primary} onChange={e => update('borderColor', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" />
                 </div>
                 <div className="mt-4">
                  <label className="flex justify-between items-center text-[9px] font-black text-pink-600 uppercase tracking-widest mb-2"><span>Tamaño</span><span className="bg-pink-200 px-2 py-0.5 rounded-full">{cfg.ornamentSize || 150}px</span></label>
                  <input type="range" min={50} max={400} value={cfg.ornamentSize || 150} onChange={e => update("ornamentSize", Number(e.target.value))} className="w-full accent-pink-600 cursor-pointer" />
                </div>
              </div>
            </>
          )}
        </div>
        {/* RESTO DE SIDEBAR... */}
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Temas Sugeridos</label>
        <div className="flex flex-wrap gap-2.5 mb-6">
          {THEMES.map(th => <button key={th.id} title={th.name} onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})} className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${cfg.theme === th.id ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent'}`} style={{ background: th.primary }} />)}
        </div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Colores Base Manuales</label>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Primario</label><input type="color" value={cfg.primary} onChange={e => update('primary', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Tarjetas</label><input type="color" value={cfg.card} onChange={e => update('card', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Arriba</label><input type="color" value={cfg.bg1} onChange={e => update('bg1', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Abajo</label><input type="color" value={cfg.bg2} onChange={e => update('bg2', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
        </div>
        <div className="mb-2 text-left z-50 relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tipografía Párrafos</label>
          <FontSelector value={cfg.fontBody || "Montserrat"} options={FONTS} onChange={v => update("fontBody", v)} />
        </div>
        <TypoControl label="Tamaño Títulos (Secciones)" sizeVal={cfg.titlesSize ?? 10} onSize={v => update("titlesSize", v)} minSize={8} maxSize={20} />
      </Acc>
      {/* SECCIONES... */}
      <Acc title="1️⃣ Portada" icon={ImageIcon} iconColor="#ec4899">
        <FileUpload label="Foto de Portada" value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
        <Inp label="Nombre Agasajado" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
        <TypoControl label="Diseño del Nombre" fontVal={cfg.honoreeFont || cfg.fontTitle} onFont={v => update("honoreeFont", v)} colorVal={cfg.honoreeColor || cfg.text} onColor={v => update('honoreeColor', v)} sizeVal={cfg.honoreeSize ?? 48} onSize={v => update("honoreeSize", v)} minSize={30} maxSize={80} />
      </Acc>
      <Acc title="8️⃣ Menú" icon={LayoutGrid} iconColor="#10b981">
        <Inp label="Título Sección" value={cfg.menuSectionTitle || "¿Qué vamos a comer?"} onChange={v => update("menuSectionTitle", v)} icon={Edit2} />
        <div className="space-y-3 relative">{cfg.menuItems?.map((m, i) => (<div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm relative" style={{ zIndex: 50 - i }}><EmojiPicker list={FOOD_EMOJIS} value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} /><MiniInp className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={m.label} onChange={v => { const n = [...cfg.menuItems]; n[i].label = v; update("menuItems", n); }} /><button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button></div>))}</div>
        <button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Nueva Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer"><Plus size={14} className="inline-block mr-2"/> AÑADIR COMIDA</button>
      </Acc>
    </aside>
  );
}
