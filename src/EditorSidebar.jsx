import React, { useState } from "react";
import {
  Palette, Star, Image as ImageIcon, Layout, List, Trash2, Video, 
  Link as LinkIcon, LayoutGrid, Smartphone, Calendar, Clock, CheckCircle2,
  MessageCircle, Plus, Edit2, RefreshCcw, Users
} from "lucide-react";

import { 
  GiphySearch, Inp, MiniInp, SelectInp, TypoControl, FontSelector,
  FileUpload, Toggle, EmojiPicker, Acc, BordersGallery
} from "./EditorUI";

import { 
  ANIMATION_CATEGORIES, THEMES, FONTS, TRANSITION_OPTS, 
  FOOD_EMOJIS, CLOTHES_EMOJIS 
} from "./config";

export default function EditorSidebar({ inv, setInv, cfg, update, setPreviewAnim, mobileView, onUpdateInternal }) {
  const [animCat, setAnimCategory] = useState("infantil");

  const resetPositions = () => {
    const keys = ['topLeftBorderPos', 'topRightBorderPos', 'bottomLeftBorderPos', 'bottomRightBorderPos', 'eventTypePos', 'honoreePos', 'badgePos'];
    keys.forEach(k => update(k, { x: 0, y: 0 }));
    alert("Posiciones centradas correctamente.");
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').slice(1); 
      const newGuests = lines.map(line => {
        const parts = line.split(',');
        if(!parts[0]) return null;
        return {
          id: `CSV-${Math.random().toString(36).substr(2,6).toUpperCase()}`,
          name: parts[0]?.trim(), lastname: parts[1]?.trim() || '', guests: Number(parts[2]) || 1, 
          table: parts[3]?.trim() || 'N/A', status: 'Pendiente', timestamp: new Date().toISOString()
        };
      }).filter(g => g);
      const current = inv.internal_data?.guests || [];
      onUpdateInternal(inv.id, 'guests', [...current, ...newGuests]);
      alert(`¡Importados ${newGuests.length} invitados!`);
    };
    reader.readAsText(file);
  };

  return (
    <aside className={`w-[100vw] md:w-[420px] h-full shrink-0 bg-[#f8f7ff] overflow-y-auto p-6 pb-24 md:pb-6 border-r border-gray-100 z-10 fd-sb ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
        
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Flujo de Edición</h3>

      <Acc title="🎨 Diseño Base" icon={Palette} iconColor="#6366f1">
         <div className="mb-6 p-4 rounded-xl border border-pink-100 bg-pink-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Bordes Ornamentales</span>
            <button onClick={resetPositions} className="p-2 bg-white border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-100 cursor-pointer"><RefreshCcw size={14} /></button>
          </div>
          <Toggle checked={cfg.showCoverBorders || false} onChange={v => update("showCoverBorders", v)} />
          {cfg.showCoverBorders && (
            <div className="mt-4 pt-4 border-t border-pink-100">
              <BordersGallery value={cfg.selectedBorder} onChange={v => update("selectedBorder", v)} />
              <Inp label="Link directo a tu propio PNG" className="mt-4" value={cfg.selectedBorder} onChange={v => update("selectedBorder", v)} placeholder="https://..." />
              <SelectInp label="Posición" value={cfg.borderPosition || 'both'} options={[{label:'Arriba y Abajo', value:'both'}, {label:'Solo Arriba', value:'top'}, {label:'Solo Abajo', value:'bottom'}]} onChange={v => update('borderPosition', v)} />
              <div className="flex flex-col gap-1 mt-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Color del Borde</label>
                <input type="color" value={cfg.borderColor || cfg.primary} onChange={e => update('borderColor', e.target.value)} className="w-full h-9 rounded-xl border-none shadow-sm cursor-pointer" />
              </div>
              <div className="mt-4">
                <label className="flex justify-between items-center text-[9px] font-black text-pink-600 uppercase mb-2"><span>Tamaño</span><span className="bg-pink-200 px-2 py-0.5 rounded-full">{cfg.ornamentSize || 150}px</span></label>
                <input type="range" min={50} max={400} value={cfg.ornamentSize || 150} onChange={e => update("ornamentSize", Number(e.target.value))} className="w-full accent-pink-600 cursor-pointer" />
              </div>
            </div>
          )}
        </div>
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Temas Sugeridos</label>
        <div className="flex flex-wrap gap-2.5 mb-6">
          {THEMES.map(th => <button key={th.id} title={th.name} onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})} className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${cfg.theme === th.id ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent'}`} style={{ background: th.primary }} />)}
        </div>
        <TypoControl label="Tamaño Títulos (Secciones)" sizeVal={cfg.titlesSize ?? 10} onSize={v => update("titlesSize", v)} minSize={8} maxSize={20} />
      </Acc>

      <Acc title="1️⃣ Portada" icon={ImageIcon} iconColor="#ec4899" defaultOpen>
        <FileUpload label="Foto de Portada" value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
        <div className="flex gap-2 z-[90] relative mt-2 border-t border-gray-100 pt-4">
          <EmojiPicker value={cfg.eventTypeEmoji} onSelect={v => update("eventTypeEmoji", v)} />
          <div className="flex-1"><Inp label="Frase Superior" value={cfg.eventType} onChange={v => update("eventType", v)} /></div>
        </div>
        <TypoControl label="Diseño Frase Superior" fontVal={cfg.eventTypeFont} onFont={v => update("eventTypeFont", v)} colorVal={cfg.eventTypeColor || cfg.primary} onColor={v => update('eventTypeColor', v)} sizeVal={cfg.eventTypeSize ?? 11} onSize={v => update("eventTypeSize", v)} />
        <Inp label="Nombre Agasajado" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
        <TypoControl label="Diseño del Nombre" fontVal={cfg.honoreeFont} onFont={v => update("honoreeFont", v)} colorVal={cfg.honoreeColor || cfg.text} onColor={v => update('honoreeColor', v)} sizeVal={cfg.honoreeSize ?? 48} onSize={v => update("honoreeSize", v)} minSize={30} maxSize={80} />
        <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
          <label className="block text-[10px] font-black text-violet-600 uppercase mb-2">Fondo de la Medalla</label>
          <input type="color" value={cfg.badgeBgColor || "#000000"} onChange={e => update('badgeBgColor', e.target.value)} className="w-full h-10 rounded-xl border-none cursor-pointer"/>
        </div>
      </Acc>

      <Acc title="👥 Gestión de Invitados" icon={Users} iconColor="#0ea5e9">
         <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
           <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Importar desde CSV</label>
           <input type="file" accept=".csv" onChange={handleImportCSV} className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
           <p className="text-[9px] text-slate-400 mt-2">Formato: Nombre,Apellido,Pax,Mesa</p>
         </div>
         <button onClick={() => update("guests", [...(inv.internal_data?.guests || []), { id: Date.now(), name: 'Nuevo', lastname: '', guests: 1, table: '1', status: 'Pendiente' }])} className="w-full py-3 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-violet-200 cursor-pointer">Agregar Manualmente</button>
      </Acc>

      <Acc title="8️⃣ Menú" icon={LayoutGrid} iconColor="#10b981">
        <Inp label="Título Sección" value={cfg.menuSectionTitle || "¿Qué vamos a comer?"} onChange={v => update("menuSectionTitle", v)} icon={Edit2} />
        <div className="space-y-3 relative">{cfg.menuItems?.map((m, i) => (<div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm relative" style={{ zIndex: 50 - i }}><EmojiPicker list={FOOD_EMOJIS} value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} /><MiniInp className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={m.label} onChange={v => { const n = [...cfg.menuItems]; n[i].label = v; update("menuItems", n); }} /><button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button></div>))}</div>
        <button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Nueva Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer"><Plus size={14} className="inline-block mr-2"/> AÑADIR COMIDA</button>
      </Acc>
    </aside>
  );
}
