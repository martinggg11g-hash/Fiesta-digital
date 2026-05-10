import React, { useState } from "react";
import { Palette, Star, Image as ImageIcon, Layout, List, Trash2, Video, Link as LinkIcon, LayoutGrid, Smartphone, Calendar, Clock, CheckCircle2, MessageCircle, Plus, Edit2, RefreshCcw, Copy, ExternalLink } from "lucide-react";
import { GiphySearch, Inp, MiniInp, SelectInp, TypoControl, FontSelector, FileUpload, Toggle, EmojiPicker, Acc, BordersGallery } from "./EditorUI";
import { ANIMATION_CATEGORIES, THEMES, TRANSITION_OPTS, PARTICLE_CATEGORIES, FONTS } from "./config";

const InstagramIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const FacebookIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const TiktokIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>);

export default function EditorSidebar({ inv, setInv, cfg, update, setPreviewAnim, mobileView }) {
  const [animCat, setAnimCategory] = useState("infantil");
  const [partCat, setPartCat] = useState("Clásicos");

  const eventId = window.location.pathname.split('/').pop();
  const hostManageLink = `${window.location.origin}/manage/${eventId}`;

  const [salonProfile] = useState(() => {
    try {
      const local = localStorage.getItem("fiesta_user");
      const session = sessionStorage.getItem("fiesta_user");
      const userStr = local || session;
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  });

  const copyToClipboard = (txt) => {
    navigator.clipboard.writeText(txt);
    alert("¡Link copiado! Envíaselo a tu cliente.");
  };

  const resetPositions = () => {
    const keys = ['topLeftBorderPos', 'topRightBorderPos', 'bottomLeftBorderPos', 'bottomRightBorderPos', 'eventTypePos', 'honoreePos', 'badgePos'];
    keys.forEach(k => update(k, { x: 0, y: 0 }));
    alert("Posiciones centradas correctamente.");
  };

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
             <div className="flex gap-2 overflow-x-auto fd-sb pb-2 mb-4">{Object.keys(ANIMATION_CATEGORIES).map(c => (<button key={c} onClick={() => setAnimCategory(c)} type="button" className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 transition-colors cursor-pointer ${animCat === c ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{c === 'quince' ? '15 Años' : c}</button>))}</div>
             <div className="grid grid-cols-2 gap-2 mb-4">{ANIMATION_CATEGORIES[animCat].map(anim => (<button key={anim.id} onClick={() => { update('openingAnimation', anim.id); setPreviewAnim(true); }} type="button" className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${cfg.openingAnimation === anim.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}><span className="text-2xl mb-1">{anim.emoji}</span><span className="text-center text-[10px] leading-tight">{anim.name}</span></button>))}</div>
             <SelectInp label="Efecto de Salida" value={cfg.animationTransition || 'fade'} options={TRANSITION_OPTS} onChange={v => update("animationTransition", v)} />
             <button type="button" onClick={() => setPreviewAnim(true)} className="w-full mt-2 py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 border border-amber-200 cursor-pointer">▶ PROBAR ANIMACIÓN</button>
           </div>
         )}

        {/* BORDES */}
        <div className="mb-6 p-4 rounded-xl border border-pink-100 bg-pink-50/50">
          <div className="flex items-center justify-between mb-4"><span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Bordes Ornamentales</span><button onClick={resetPositions} title="Resetear posiciones" className="p-2 bg-white border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-100 cursor-pointer"><RefreshCcw size={14} /></button></div>
          <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-pink-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Activar Bordes</span>
            <Toggle 
              checked={cfg.showCoverBorders || false} 
              onChange={v => {
                update("showCoverBorders", v);
                if (v && !cfg.selectedBorder) {
                  update("selectedBorder", "/borders/1-Photoroom.png");
                }
              }} 
            />
          </div>
          
          {cfg.showCoverBorders && (
            <div className="mt-4 pt-4 border-t border-pink-100">
              <BordersGallery value={cfg.selectedBorder} onChange={v => update("selectedBorder", v)} />
              <div className="mt-4">
                <SelectInp label="Posición" value={cfg.borderPosition || 'both'} options={[{label:'Arriba y Abajo', value:'both'}, {label:'Solo Arriba', value:'top'}, {label:'Solo Abajo', value:'bottom'}]} onChange={v => update('borderPosition', v)} />
              </div>
              <div className="flex flex-col gap-1 mt-3"><label className="text-[9px] font-bold text-slate-400 uppercase">Color del Borde</label><input type="color" value={cfg.borderColor || cfg.primary} onChange={e => update('borderColor', e.target.value)} className="w-full h-9 rounded-xl border-none shadow-sm cursor-pointer" /></div>
              <div className="mt-4"><label className="flex justify-between items-center text-[9px] font-black text-pink-600 uppercase mb-2"><span>Tamaño</span><span className="bg-pink-200 px-2 py-0.5 rounded-full">{cfg.ornamentSize || 150}px</span></label><input type="range" min={50} max={400} value={cfg.ornamentSize || 150} onChange={e => update("ornamentSize", Number(e.target.value))} className="w-full accent-pink-600 cursor-pointer" /></div>

              <div className="mt-4 flex gap-3">
                 <div className="flex-1">
                   <label className="flex justify-between items-center text-[9px] font-black text-pink-600 uppercase mb-2"><span>Girar Arriba</span><span className="bg-pink-200 px-2 py-0.5 rounded-full">{cfg.borderRotationTop || 0}°</span></label>
                   <input type="range" min={0} max={360} value={cfg.borderRotationTop || 0} onChange={e => update("borderRotationTop", Number(e.target.value))} className="w-full accent-pink-600 cursor-pointer" />
                 </div>
                 <div className="flex-1">
                   <label className="flex justify-between items-center text-[9px] font-black text-pink-600 uppercase mb-2"><span>Girar Abajo</span><span className="bg-pink-200 px-2 py-0.5 rounded-full">{cfg.borderRotationBottom || 0}°</span></label>
                   <input type="range" min={0} max={360} value={cfg.borderRotationBottom || 0} onChange={e => update("borderRotationBottom", Number(e.target.value))} className="w-full accent-pink-600 cursor-pointer" />
                 </div>
              </div>
            </div>
          )}
        </div>

        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Temas Sugeridos</label>
        <div className="flex flex-wrap gap-2.5 mb-6">{THEMES.map(th => <button key={th.id} title={th.name} onClick={() => setInv({...inv, config: {...cfg, theme: th.id, ...th}})} className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${cfg.theme === th.id ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent'}`} style={{ background: th.primary }} />)}</div>

        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Colores Base Manuales</label>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Primario</label><input type="color" value={cfg.primary} onChange={e => update('primary', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Tarjetas</label><input type="color" value={cfg.card} onChange={e => update('card', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Arriba</label><input type="color" value={cfg.bg1} onChange={e => update('bg1', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
          <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fondo Abajo</label><input type="color" value={cfg.bg2} onChange={e => update('bg2', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
        </div>

        {/* 👉 CONTROL DE RESPLANDOR (GLOW) CON TEXTO "SIN" */}
        <div className="mb-6 p-3 bg-violet-50 rounded-xl border border-violet-100 shadow-inner">
          <label className="flex justify-between items-center text-[9px] font-black text-violet-600 uppercase mb-2">
            <span>Intensidad Luz / Sombra</span>
            <span className={`px-2 py-0.5 rounded-full ${cfg.cardGlow === 0 || cfg.cardGlow === undefined ? 'bg-slate-200 text-slate-600' : 'bg-violet-200 text-violet-800'}`}>
              {(cfg.cardGlow === undefined || cfg.cardGlow === 0) ? "SIN" : `${cfg.cardGlow}%`}
            </span>
          </label>
          <input 
            type="range" 
            min={0} max={100} step={5} 
            value={cfg.cardGlow ?? 0} 
            onChange={e => update("cardGlow", Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer" 
          />
        </div>

        <div className="mb-2 text-left z-50 relative"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tipografía Párrafos</label><FontSelector value={cfg.fontBody || "Montserrat"} onChange={v => update("fontBody", v)} /></div>
        <div className="flex gap-2 mt-4 mb-6"><div className="flex flex-col gap-1 flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Color Texto Ppal</label><input type="color" value={cfg.text} onChange={e => update('text', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div><div className="flex flex-col gap-1 flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Color Secundario</label><input type="color" value={cfg.muted} onChange={e => update('muted', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div></div>
        <TypoControl label="Tamaño Títulos (Menú, Regalos...)" sizeVal={cfg.titlesSize ?? 10} onSize={v => update("titlesSize", v)} minSize={8} maxSize={20} />

        <div className="mb-2 border-t border-gray-100 pt-4 z-10 relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Efectos y Partículas</label>
          <div className="flex gap-1 overflow-x-auto pb-2 mb-2 fd-sb">{Object.keys(PARTICLE_CATEGORIES).map(c => (<button key={c} type="button" onClick={() => setPartCat(c)} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase shrink-0 transition-colors cursor-pointer ${partCat === c ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>{c}</button>))}</div>
          <div className="grid grid-cols-2 gap-2">{PARTICLE_CATEGORIES[partCat].map(eff => (<button key={eff.id} type="button" onClick={() => update("particleEffect", eff.id)} className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${cfg.particleEffect === eff.id ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm' : 'border-gray-200 bg-white text-slate-600 hover:border-violet-200'}`}><span className="text-xl">{eff.icon}</span><span className="truncate text-[10px] font-bold">{eff.name}</span></button>))}</div>
          
          {cfg.particleEffect && cfg.particleEffect !== 'none' && (
            <>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                <label className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase mb-2">
                  <span>Intensidad del Efecto</span>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{cfg.effectOpacity ?? 100}%</span>
                </label>
                <input type="range" min={10} max={100} step={5} value={cfg.effectOpacity ?? 100} onChange={e => update("effectOpacity", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer" />
              </div>
              
              <div className="flex items-center justify-between mt-4 bg-violet-50 p-3 rounded-xl border border-violet-100">
                 <div>
                   <span className="text-[10px] font-black text-violet-800 uppercase block mb-1">Efecto en toda la página</span>
                   <span className="text-[9px] text-violet-600 leading-tight block">El efecto caerá constantemente mientras scrolleas.</span>
                 </div>
                 <Toggle checked={cfg.particlesFullscreen || false} onChange={v => update("particlesFullscreen", v)} />
              </div>
            </>
          )}
        </div>
      </Acc>

      <Acc title="1️⃣ Portada Principal" icon={ImageIcon} defaultOpen iconColor="#ec4899">
        <div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200"><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Fondo GIF Animado?</span><Toggle checked={cfg.useGiphyCover || false} onChange={v => update("useGiphyCover", v)} /></div>{cfg.useGiphyCover ? (<GiphySearch onSelect={url => update("coverPhoto", url)} placeholder="Ej: brillos, spiderman..." />) : (<FileUpload value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />)}<div className="flex items-center justify-between mt-3 mb-1 pt-3 border-t border-gray-200"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sombreado Base Oscuro</span><Toggle checked={cfg.showCoverGradient !== false} onChange={v => update("showCoverGradient", v)} /></div>{cfg.showCoverGradient !== false && (<input type="range" min={0} max={100} step={5} value={cfg.coverGradientIntensity ?? 50} onChange={e => update("coverGradientIntensity", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer mt-2" />)}</div>
        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 shadow-sm mb-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400" /><label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-2">Sombreado para Legibilidad</label><div className="flex gap-3 pl-2"><div className="flex flex-col gap-1 shrink-0"><label className="text-[9px] font-bold text-slate-400 uppercase">Color</label><input type="color" value={cfg.coverTextShadowColor || "#000000"} onChange={e => update('coverTextShadowColor', e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer border-none shadow-sm" /></div><div className="flex flex-col gap-1 flex-1"><label className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase"><span>Intensidad</span><span className="text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{cfg.coverTextShadowSize ?? 10}px</span></label><input type="range" min={0} max={30} value={cfg.coverTextShadowSize ?? 10} onChange={e => update("coverTextShadowSize", Number(e.target.value))} className="w-full accent-slate-500 cursor-pointer mt-1" /></div></div></div>
        
        <div className="flex gap-2 z-[90] relative mt-2 border-t border-gray-100 pt-4"><EmojiPicker value={cfg.eventTypeEmoji || "✨"} onSelect={v => update("eventTypeEmoji", v)} /><div className="flex-1"><Inp label="Frase Superior" value={cfg.eventType} onChange={v => update("eventType", v)} placeholder="Estás invitado a..." /></div></div>
        <TypoControl label="Diseño Frase Superior" fontVal={cfg.eventTypeFont || cfg.fontBody} onFont={v => update("eventTypeFont", v)} colorVal={cfg.eventTypeColor || cfg.primary} onColor={v => update('eventTypeColor', v)} sizeVal={cfg.eventTypeSize ?? 11} onSize={v => update("eventTypeSize", v)} minSize={8} maxSize={24} />
        
        <div className="z-[80] relative"><Inp label="Nombre Principal" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} /></div>
        <TypoControl label="Diseño del Nombre" fontVal={cfg.honoreeFont || cfg.fontTitle} onFont={v => update("honoreeFont", v)} colorVal={cfg.honoreeColor || cfg.text} onColor={v => update('honoreeColor', v)} sizeVal={cfg.honoreeSize ?? 48} onSize={v => update("honoreeSize", v)} minSize={30} maxSize={80} />
        
        <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Mostrar Medalla Flotante</span><Toggle checked={cfg.showBadge ?? true} onChange={v => update("showBadge", v)} /></div>
        {(cfg.showBadge ?? true) && (<><div className="flex gap-2 z-[70] relative"><EmojiPicker value={cfg.badgeEmoji} onSelect={v => update("badgeEmoji", v)} /><div className="flex-1"><Inp label="Medalla Flotante" value={cfg.badgeText} onChange={v => update("badgeText", v)} placeholder="Ej: 5 añitos" /></div></div><TypoControl label="Diseño Medalla" fontVal={cfg.badgeFont || cfg.fontBody} onFont={v => update("badgeFont", v)} sizeVal={cfg.badgeSize ?? 14} onSize={v => update("badgeSize", v)} minSize={10} max={30} /><div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100"><label className="block text-[10px] font-black text-violet-600 uppercase mb-2">Fondo de la Medalla</label><input type="color" value={cfg.badgeBgColor || "#000000"} onChange={e => update('badgeBgColor', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none"/></div></>)}
      </Acc>

      <Acc title="2️⃣ Cuenta Regresiva" icon={Clock} iconColor="#f59e0b"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Reloj</span><Toggle checked={cfg.showCountdown || false} onChange={v => update("showCountdown", v)} /></div>{cfg.showCountdown && (<Inp label="Fecha y Hora exacta" type="datetime-local" value={cfg.countdownDate || ""} onChange={v => update("countdownDate", v)} />)}</Acc>
      <Acc title="3️⃣ Banner Central" icon={Star} iconColor="#d97706"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Banner</span><Toggle checked={cfg.showBanner} onChange={v => update("showBanner", v)} /></div>{cfg.showBanner && (<><Inp label="Título del Banner" value={cfg.bannerTitle} onChange={v => update("bannerTitle", v)} /><div className="flex items-center justify-between mt-4 mb-2 bg-gray-50 p-2 rounded-xl"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Usar GIF?</span><Toggle checked={cfg.useGiphyBanner || false} onChange={v => update("useGiphyBanner", v)} /></div>{cfg.useGiphyBanner ? (<GiphySearch onSelect={url => update("bannerPhoto", url)} />) : (<FileUpload value={cfg.bannerPhoto} onChange={v => update("bannerPhoto", v)} />)}</>)}</Acc>
      <Acc title="4️⃣ Cuándo y Dónde" icon={Calendar} iconColor="#e11d48"><TypoControl label="Tamaño Textos" sizeVal={cfg.dateSize ?? 18} onSize={v => update("dateSize", v)} minSize={12} maxSize={30} /><div className="flex items-center justify-between mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Día</span><Toggle checked={cfg.showDate} onChange={v => update("showDate", v)} /></div>{cfg.showDate && <Inp type="date" value={cfg.dateText} onChange={v => update("dateText", v)} />}<div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Horario</span><Toggle checked={cfg.showTime} onChange={v => update("showTime", v)} /></div>{cfg.showTime && <Inp placeholder="16:00 a 20:00 hs" value={cfg.timeText} onChange={v => update("timeText", v)} />}<div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Ubicación</span><Toggle checked={cfg.showLocation} onChange={v => update("showLocation", v)} /></div>{cfg.showLocation && (<><div className="p-3 bg-violet-50 rounded-xl border border-violet-100 mb-4 opacity-80"><p className="text-[10px] font-black text-violet-800 uppercase tracking-widest mb-1">📍 Dirección (Panel Maestro)</p><p className="text-xs font-bold text-violet-900">{cfg.locationName || "Nombre del Salón"}</p></div><div className="flex items-center justify-between mt-2 mb-2"><span className="text-xs font-bold text-slate-500">Aclarar Parking</span><Toggle checked={cfg.showParking} onChange={v => update("showParking", v)} /></div>{cfg.showParking && <SelectInp label="Tipo" value={cfg.parkingType} options={[{label:"Público", value:"Estacionamiento público"}, {label:"Privado", value:"Estacionamiento privado"}, {label:"Personalizado...", value:"otro"}]} onChange={v => update("parkingType", v)} />}{cfg.showParking && cfg.parkingType === 'otro' && <Inp placeholder="Escribe aquí..." value={cfg.customParking || ""} onChange={v => update("customParking", v)} />}</>)}</Acc>
      
      <Acc title="5️⃣ Tarjeta del Salón" icon={LinkIcon} iconColor="#6366f1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500">Mostrar Tarjeta</span>
          <Toggle 
            checked={cfg.showVenueLogo || false} 
            onChange={v => { 
              if (v && salonProfile) {
                setInv(prev => ({
                  ...prev,
                  config: {
                    ...prev.config,
                    showVenueLogo: true,
                    venueName: prev.config.venueName || salonProfile.name || "",
                    venueLogoUrl: prev.config.venueLogoUrl || salonProfile.logo || ""
                  }
                }));
              } else {
                update("showVenueLogo", v);
              }
            }} 
          />
        </div>
        {cfg.showVenueLogo && (
          <>
            <Inp label="Nombre" value={cfg.venueName || ""} onChange={v => update("venueName", v)} />
            <FileUpload label="Logo" value={cfg.venueLogoUrl || ""} onChange={v => update("venueLogoUrl", v)} />
            <SelectInp label="Botón" value={cfg.venueLinkType || "web"} options={[{ label: "🌐 Web", value: "web" }, { label: "📱 WhatsApp", value: "whatsapp" }]} onChange={v => update("venueLinkType", v)} />
            <Inp label="Link o Número" value={cfg.venueLink || ""} onChange={v => update("venueLink", v)} />
          </>
        )}
      </Acc>

      <Acc title="6️⃣ Multimedia" icon={Video} iconColor="#8b5cf6"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Video YouTube</span><Toggle checked={cfg.showVideo || false} onChange={v => update("showVideo", v)} /></div>{cfg.showVideo && (<div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200"><Inp label="Título" value={cfg.videoTitle || ""} onChange={v => update("videoTitle", v)} /><Inp label="Link" value={cfg.videoUrl || ""} onChange={v => update("videoUrl", v)} /></div>)}<div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100"><span className="text-xs font-bold text-slate-500">Música Spotify</span><Toggle checked={cfg.showMusic || false} onChange={v => update("showMusic", v)} /></div>{cfg.showMusic && (<div className="bg-gray-50 p-3 rounded-xl border border-gray-200"><Inp label="Link" value={cfg.spotifyUrl || ""} onChange={v => update("spotifyUrl", v)} /></div>)}</Acc>
      <Acc title="7️⃣ Programa" icon={List} iconColor="#0ea5e9"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Cronograma</span><Toggle checked={cfg.showItinerary} onChange={v => update("showItinerary", v)} /></div>{cfg.showItinerary && (<><div className="mb-4"><Inp label="Título" value={cfg.itinerarySectionTitle || "¿Qué vamos a hacer?"} onChange={v => update("itinerarySectionTitle", v)} icon={Edit2} /></div><div className="space-y-4 mb-6">{cfg.itinerary?.map((item, i) => (<div key={i} className="flex flex-col gap-2 bg-white p-3 rounded-xl border shadow-sm relative"><button onClick={() => update("itinerary", cfg.itinerary.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 text-red-400 cursor-pointer"><Trash2 size={14}/></button><div className="flex gap-2 pr-6"><MiniInp className="w-16 p-2 text-xs font-bold border rounded-lg" value={item.time} onChange={v => { const n = [...cfg.itinerary]; n[i].time = v; update("itinerary", n); }} /><MiniInp className="flex-1 p-2 text-xs border rounded-lg" value={item.title} onChange={v => { const n = [...cfg.itinerary]; n[i].title = v; update("itinerary", n); }} /></div><MiniInp className="w-full p-2 text-xs border rounded-lg" value={item.sub} placeholder="Aclaración" onChange={v => { const n = [...cfg.itinerary]; n[i].sub = v; update("itinerary", n); }} /></div>))}</div><button onClick={() => update("itinerary", [...(cfg.itinerary || []), { time: "16:00", title: "Nuevo Evento", sub: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed rounded-xl text-xs font-bold text-slate-400 cursor-pointer"><Plus size={14} className="inline-block mr-2" /> AÑADIR EVENTO</button></>)}</Acc>
      
      <Acc title="8️⃣ Menú" icon={LayoutGrid} iconColor="#10b981"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Menú</span><Toggle checked={cfg.showMenu} onChange={v => update("showMenu", v)} /></div>{cfg.showMenu && (<><div className="mb-4"><Inp label="Título" value={cfg.menuSectionTitle || "¿Qué vamos a comer?"} onChange={v => update("menuSectionTitle", v)} icon={Edit2} /></div><div className="space-y-3 mb-6 relative z-[70]">{cfg.menuItems?.map((m, i) => (<div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm relative" style={{ zIndex: 50 - i }}><EmojiPicker value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} /><MiniInp className="flex-1 p-2 text-xs border rounded-lg" value={m.label} onChange={v => { const n = [...cfg.menuItems]; n[i].label = v; update("menuItems", n); }} /><button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 cursor-pointer"><Trash2 size={14}/></button></div>))}</div><button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Nueva Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed rounded-xl text-xs font-bold text-slate-400 cursor-pointer"><Plus size={14} className="inline-block mr-2"/> AÑADIR COMIDA</button></>)}</Acc>
      
      <Acc title="9️⃣ Vestimenta y Regalos" icon={Layout} iconColor="#f43f5e">
         <div className="mb-6 pb-6 border-b"><Inp label="Título" value={cfg.notesSectionTitle || "A tener en cuenta"} onChange={v => update("notesSectionTitle", v)} icon={Edit2} /></div>
         <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Vestimenta</span><Toggle checked={cfg.showDressCode} onChange={v => update("showDressCode", v)} /></div>
         {cfg.showDressCode && (
           <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-xl border relative z-[40]">
             <EmojiPicker value={cfg.dressCodeIcon} onSelect={e => update("dressCodeIcon", e)} />
             <div className="flex-1"><Inp value={cfg.dressCodeText} onChange={v => update("dressCodeText", v)} placeholder="Ej: Elegante Sport" className="!mb-0"/></div>
           </div>
         )}
         <div className="flex items-center justify-between mb-4 pt-4 border-t"><span className="text-xs font-bold text-slate-500">Activar Regalos</span><Toggle checked={cfg.showGifts} onChange={v => update("showGifts", v)} /></div>
         {cfg.showGifts && (
           <>
             <div className="flex gap-2 mb-2 bg-gray-50 p-2 rounded-xl border relative z-[30]">
               <EmojiPicker value={cfg.giftIcon} onSelect={e => update("giftIcon", e)} />
               <div className="w-24"><Inp value={cfg.giftLabel} onChange={v => update("giftLabel", v)} placeholder="Título" className="!mb-0"/></div>
               <div className="flex-1"><Inp value={cfg.giftText} onChange={v => update("giftText", v)} placeholder="Lluvia de sobres..." className="!mb-0"/></div>
             </div>
             <div className="flex items-center justify-between mt-4 mb-2"><span className="text-[10px] font-bold text-slate-500 uppercase">Datos Transferencia</span><Toggle checked={cfg.showGiftNote} onChange={v => update("showGiftNote", v)} /></div>{cfg.showGiftNote && (<div className="mt-2 relative z-20"><Inp value={cfg.giftNoteText} onChange={v => update("giftNoteText", v)} multiline className="!mb-2" /><TypoControl label="Diseño Aclaración" colorVal={cfg.giftNoteColor || cfg.primary} onColor={v => update('giftNoteColor', v)} sizeVal={cfg.giftNoteSize || 11} onSize={v => update('giftNoteSize', v)} minSize={8} maxSize={24} /></div>)}<div className="flex items-center justify-between mt-6 mb-2 border-t pt-4"><span className="text-[10px] font-bold text-slate-500 uppercase">Links de Regalos</span></div><div className="space-y-3 mb-4">{cfg.giftLinks?.map((link, i) => (<div key={i} className="flex flex-col gap-2 bg-white p-3 rounded-xl border shadow-sm relative"><button onClick={() => update("giftLinks", cfg.giftLinks.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 text-red-400 cursor-pointer"><Trash2 size={14}/></button><div className="pr-6"><MiniInp className="w-full p-2 mb-2 text-xs font-bold border rounded-lg" value={link.label} placeholder="Ej: Mesa en Amazon" onChange={v => { const n = [...cfg.giftLinks]; n[i].label = v; update("giftLinks", n); }} /><MiniInp className="w-full p-2 text-xs border rounded-lg" value={link.url} placeholder="https://..." onChange={v => { const n = [...cfg.giftLinks]; n[i].url = v; update("giftLinks", n); }} /></div></div>))}</div><button onClick={() => update("giftLinks", [...(cfg.giftLinks || []), { label: "Link", url: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed rounded-xl text-xs font-bold text-slate-400 cursor-pointer"><Plus size={14} className="inline-block mr-2" /> AÑADIR LINK</button></>)}</Acc>
      <Acc title="1️⃣0️⃣ Galería" icon={ImageIcon} iconColor="#ec4899"><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Galería</span><Toggle checked={cfg.showGallery} onChange={v => update("showGallery", v)} /></div>{cfg.showGallery && (<><div className="flex bg-slate-100 p-1 rounded-xl mb-4"><button onClick={() => update("galleryLayout", 'carousel')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 ${cfg.galleryLayout === 'carousel' || !cfg.galleryLayout ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500'} cursor-pointer`}><Smartphone size={14}/> Carrusel</button><button onClick={() => update("galleryLayout", 'grid')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 ${cfg.galleryLayout === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500'} cursor-pointer`}><LayoutGrid size={14}/> Cuadrícula</button></div><Inp label="Título" value={cfg.galleryTitle} onChange={v => update("galleryTitle", v)} /><div className="space-y-4 mb-4 mt-2">{cfg.galleryPhotos?.map((p, i) => (<div key={i} className="bg-white border rounded-xl p-2 relative"><FileUpload onChange={v => { const n = [...cfg.galleryPhotos]; n[i] = v; update("galleryPhotos", n); }} value={p} /><button onClick={() => update("galleryPhotos", cfg.galleryPhotos.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg cursor-pointer"><Trash2 size={14}/></button></div>))}</div><button onClick={() => update("galleryPhotos", [...(cfg.galleryPhotos || []), ""])} type="button" className="w-full py-3 bg-white border-2 border-dashed rounded-xl text-xs font-bold text-slate-400 cursor-pointer"><Plus size={14} className="inline-block mr-2" /> AÑADIR FOTO</button></>)}</Acc>
      
      <Acc title="1️⃣1️⃣ Confirmación y Redes" icon={CheckCircle2} iconColor="#22c55e">
        <div className="bg-slate-50 p-4 rounded-xl border mb-6">
           <h4 className="text-xs font-black text-slate-800 uppercase mb-3">Control de Accesos y RSVP</h4>
           
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Modo Lista VIP (Nominal)</span>
              <Toggle checked={cfg.isPrivateList || false} onChange={v => update("isPrivateList", v)} />
           </div>
           <p className="text-[9px] text-slate-500 mb-4 font-medium leading-tight">
              {cfg.isPrivateList ? "Activado: Cada invitado recibe un link único. No llenan formulario." : "Desactivado: Link general. El invitado debe escribir su nombre para generar su QR."}
           </p>

           {cfg.isPrivateList && (
             <>
               <div className="mb-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
                 <label className="block text-[10px] font-black text-violet-800 uppercase tracking-widest mb-1.5">PIN de Acceso para el Agasajado</label>
                 <MiniInp type="text" maxLength="4" placeholder="Ej: 1234" value={cfg.clientPin || ""} onChange={v => update("clientPin", v)} className="w-full px-4 py-2 rounded-xl border border-violet-200 text-sm outline-none focus:border-violet-500 font-bold tracking-widest text-center" />
               </div>

               <div className="mb-4 p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                 <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Link para tu Cliente</label>
                 <div className="flex gap-2">
                   <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 truncate font-mono">{hostManageLink}</div>
                   <button onClick={() => copyToClipboard(hostManageLink)} className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"><Copy size={14}/></button>
                   <a href={hostManageLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><ExternalLink size={14}/></a>
                 </div>
                 <p className="text-[9px] text-slate-400 mt-2 leading-tight">Copiá este link y envíaselo al cliente junto con el PIN para que cargue sus invitados.</p>
               </div>
             </>
           )}

           <div className="flex items-center justify-between mb-2 border-t border-slate-200 pt-4">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Fecha Límite RSVP</span>
              <Toggle checked={cfg.showRsvpDeadline || false} onChange={v => update("showRsvpDeadline", v)} />
           </div>
           {cfg.showRsvpDeadline && (
              <div className="mb-4">
                 <MiniInp type="date" value={cfg.rsvpDeadline || ""} onChange={v => update("rsvpDeadline", v)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm mt-2 outline-none focus:border-violet-400" />
              </div>
           )}

           <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 border-t border-slate-200 pt-4">Límite Acompañantes</h4>
           <MiniInp type="number" value={cfg.maxGuestsPerFamily || 5} onChange={v => update("maxGuestsPerFamily", Number(v))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400" />
           <p className="text-[9px] text-slate-500 mt-2 font-bold">Pax máximo extra por cada pase de invitado.</p>
        </div>

        <Inp label="WhatsApp Celular (+52)" value={cfg.whatsappNumber} onChange={v => update("whatsappNumber", v)} icon={MessageCircle} />
        <div className="bg-green-50 p-3 rounded-xl border border-green-100 mt-2 mb-6">
          <p className="text-[9px] text-green-700 font-bold mb-2">💡 Tip: Escribí {"{nombre}"} para reemplace automático.</p>
          <Inp label="Mensaje" value={cfg.whatsappMessage} onChange={v => update("whatsappMessage", v)} multiline className="!mb-0" />
        </div>

        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 border-t pt-4">Redes</h4>
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold flex items-center gap-2"><InstagramIcon size={14}/> Instagram</span>
               <Toggle 
                 checked={cfg.showInstagram || false} 
                 onChange={v => { 
                   if (v && salonProfile?.instagram && !cfg.instagramUrl) {
                     setInv(prev => ({ ...prev, config: { ...prev.config, showInstagram: true, instagramUrl: salonProfile.instagram }}));
                   } else {
                     update("showInstagram", v);
                   }
                 }} 
               />
            </div>
            {cfg.showInstagram && <Inp placeholder={salonProfile?.instagram || "Link..."} value={cfg.instagramUrl || ""} onChange={v => update("instagramUrl", v)} className="!mb-0" />}
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold flex items-center gap-2"><FacebookIcon size={14}/> Facebook</span>
               <Toggle 
                 checked={cfg.showFacebook || false} 
                 onChange={v => { 
                   if (v && salonProfile?.facebook && !cfg.facebookUrl) {
                     setInv(prev => ({ ...prev, config: { ...prev.config, showFacebook: true, facebookUrl: salonProfile.facebook }}));
                   } else {
                     update("showFacebook", v);
                   }
                 }} 
               />
            </div>
            {cfg.showFacebook && <Inp placeholder={salonProfile?.facebook || "Link..."} value={cfg.facebookUrl || ""} onChange={v => update("facebookUrl", v)} className="!mb-0" />}
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold flex items-center gap-2"><TiktokIcon size={14}/> TikTok</span>
               <Toggle 
                 checked={cfg.showTiktok || false} 
                 onChange={v => { 
                   if (v && salonProfile?.tiktok && !cfg.tiktokUrl) {
                     setInv(prev => ({ ...prev, config: { ...prev.config, showTiktok: true, tiktokUrl: salonProfile.tiktok }}));
                   } else {
                     update("showTiktok", v);
                   }
                 }} 
               />
            </div>
            {cfg.showTiktok && <Inp placeholder={salonProfile?.tiktok || "Link..."} value={cfg.tiktokUrl || ""} onChange={v => update("tiktokUrl", v)} className="!mb-0" />}
          </div>
        </div>
      </Acc>
    </aside>
  );
}
