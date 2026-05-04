import React, { useState } from "react";
import {
  Palette, Star, Image as ImageIcon, Layout, List, Trash2, Video, 
  Link as LinkIcon, LayoutGrid, Smartphone, Calendar, Clock, CheckCircle2,
  MessageCircle, Plus
} from "lucide-react";

// Importamos las herramientas que creamos en el Paso 1
import { 
  GiphySearch, Inp, MiniInp, SelectInp, TypoControl, 
  FileUpload, Toggle, EmojiPicker, Acc 
} from "./EditorUI";

// Importamos la configuración
import { 
  ANIMATION_CATEGORIES, THEMES, FONTS, TRANSITION_OPTS, 
  FOOD_EMOJIS, CLOTHES_EMOJIS 
} from "./config";

export default function EditorSidebar({ inv, setInv, cfg, update, setPreviewAnim, mobileView }) {
  const [animCat, setAnimCategory] = useState("infantil");

  return (
    <aside className={`w-[100vw] md:w-[420px] h-full shrink-0 bg-[#f8f7ff] overflow-y-auto p-6 pb-24 md:pb-6 border-r border-gray-100 z-10 fd-sb ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
        
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-left">Flujo de Edición</h3>

      {/* 0. DISEÑO GLOBAL Y ANIMACIÓN */}
      <Acc title="🎨 Diseño Base y Animación" icon={Palette} iconColor="#6366f1">
         <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
           <span className="text-xs font-bold text-slate-600 ml-2">¿Animación de Entrada?</span>
           <Toggle checked={cfg.openingAnimation !== 'none'} onChange={v => update("openingAnimation", v ? "envelope" : "none")} />
         </div>
         {cfg.openingAnimation !== 'none' && (
           <div className="mb-6 border-b border-gray-100 pb-4">
             <div className="flex gap-2 overflow-x-auto fd-sb pb-2 mb-4">
               {Object.keys(ANIMATION_CATEGORIES).map(c => (
                 <button key={c} onClick={() => setAnimCategory(c)} type="button" className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 transition-colors cursor-pointer ${animCat === c ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{c === 'quince' ? '15 Años' : c}</button>
               ))}
             </div>
             <div className="grid grid-cols-2 gap-2 mb-4">
               {ANIMATION_CATEGORIES[animCat].map(anim => (
                 <button key={anim.id} onClick={() => { update('openingAnimation', anim.id); setPreviewAnim(true); }} type="button" className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${cfg.openingAnimation === anim.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}><span className="text-2xl mb-1">{anim.emoji}</span><span className="text-center text-[10px] leading-tight">{anim.name}</span></button>
               ))}
             </div>
             <SelectInp label="Efecto de Salida" value={cfg.animationTransition || 'fade'} options={TRANSITION_OPTS} onChange={v => update("animationTransition", v)} />
             <button type="button" onClick={() => setPreviewAnim(true)} className="w-full mt-2 py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 border border-amber-200 cursor-pointer">▶ PROBAR ANIMACIÓN</button>
           </div>
         )}

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

        <SelectInp label="Tipografía Global (Párrafos)" value={cfg.fontBody} options={FONTS} onChange={v => update("fontBody", v)} />
        <div className="flex gap-2 mt-2 mb-6">
           <div className="flex flex-col gap-1 flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Color Texto Ppal</label><input type="color" value={cfg.text} onChange={e => update('text', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
           <div className="flex flex-col gap-1 flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Color Secundario</label><input type="color" value={cfg.muted} onChange={e => update('muted', e.target.value)} className="w-full h-9 rounded-xl cursor-pointer border-none shadow-sm" /></div>
        </div>

        <TypoControl label="Tamaño Títulos (Menú, Regalos...)" sizeVal={cfg.titlesSize ?? 10} onSize={v => update("titlesSize", v)} minSize={8} maxSize={20} />

        <div className="mb-2 border-t border-gray-100 pt-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Partículas Flotantes</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', icon: '🚫', name: 'Ninguno' },
              { id: 'confetti', icon: '🎉', name: 'Explosión Confeti' },
              { id: 'glitter', icon: '✨', name: 'Brillos (Glitter)' },
              { id: 'hearts', icon: '❤️', name: 'Corazones' },
              { id: 'bubbles', icon: '🫧', name: 'Burbujas' },
              { id: 'snow', icon: '❄️', name: 'Nieve' }
            ].map(eff => (
              <button key={eff.id} type="button" onClick={() => update("particleEffect", eff.id)} className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${cfg.particleEffect === eff.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600 hover:border-violet-200'}`}><span className="text-base">{eff.icon}</span> {eff.name}</button>
            ))}
          </div>
        </div>
      </Acc>

      {/* 1. PORTADA */}
      <Acc title="1️⃣ Portada Principal" icon={ImageIcon} defaultOpen iconColor="#ec4899">
        <div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Fondo GIF Animado?</span>
            <Toggle checked={cfg.useGiphyCover || false} onChange={v => update("useGiphyCover", v)} />
          </div>
          {cfg.useGiphyCover ? (
            <GiphySearch onSelect={url => update("coverPhoto", url)} placeholder="Ej: brillos, spiderman..." />
          ) : (
            <FileUpload value={cfg.coverPhoto} onChange={v => update("coverPhoto", v)} />
          )}
          
          <div className="flex items-center justify-between mt-3 mb-1 pt-3 border-t border-gray-200">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sombreado Base Oscuro</span>
            <Toggle checked={cfg.showCoverGradient !== false} onChange={v => update("showCoverGradient", v)} />
          </div>
          {cfg.showCoverGradient !== false && (
            <input type="range" min={0} max={100} step={5} value={cfg.coverGradientIntensity ?? 50} onChange={e => update("coverGradientIntensity", Number(e.target.value))} className="w-full accent-violet-600 cursor-pointer mt-2" />
          )}
        </div>

        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 shadow-sm mb-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400" />
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-2">Sombreado para Legibilidad de Textos</label>
          <div className="flex gap-3 pl-2">
            <div className="flex flex-col gap-1 shrink-0">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Color</label>
              <input type="color" value={cfg.coverTextShadowColor || "#000000"} onChange={e => update('coverTextShadowColor', e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer border-none shadow-sm" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                <span>Intensidad</span><span className="text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{cfg.coverTextShadowSize ?? 10}px</span>
              </label>
              <input type="range" min={0} max={30} value={cfg.coverTextShadowSize ?? 10} onChange={e => update("coverTextShadowSize", Number(e.target.value))} className="w-full accent-slate-500 cursor-pointer mt-1" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <EmojiPicker value={cfg.eventTypeEmoji || "✨"} onSelect={v => update("eventTypeEmoji", v)} />
          <div className="flex-1"><Inp label="Frase Superior" value={cfg.eventType} onChange={v => update("eventType", v)} placeholder="Estás invitado a..." /></div>
        </div>
        <TypoControl label="Diseño Frase Superior" fontVal={cfg.eventTypeFont || cfg.fontBody} onFont={v => update("eventTypeFont", v)} colorVal={cfg.eventTypeColor || cfg.primary} onColor={v => update('eventTypeColor', v)} sizeVal={cfg.eventTypeSize ?? 11} onSize={v => update("eventTypeSize", v)} minSize={8} maxSize={24} />

        <Inp label="Nombre Principal" value={cfg.honoreeName} onChange={v => update("honoreeName", v)} />
        <TypoControl label="Diseño del Nombre" fontVal={cfg.honoreeFont || cfg.fontTitle} onFont={v => update("honoreeFont", v)} colorVal={cfg.honoreeColor || cfg.text} onColor={v => update('honoreeColor', v)} sizeVal={cfg.honoreeSize ?? 48} onSize={v => update("honoreeSize", v)} minSize={30} maxSize={80} />

        <div className="flex gap-2">
          <EmojiPicker value={cfg.badgeEmoji} onSelect={v => update("badgeEmoji", v)} />
          <div className="flex-1"><Inp label="Medalla Flotante" value={cfg.badgeText} onChange={v => update("badgeText", v)} placeholder="Ej: 5 añitos" /></div>
        </div>
        <TypoControl label="Tamaño Medalla" sizeVal={cfg.badgeSize ?? 14} onSize={v => update("badgeSize", v)} minSize={10} max={30} />
      </Acc>

      {/* 2. CUENTA REGRESIVA */}
      <Acc title="2️⃣ Cuenta Regresiva" icon={Clock} iconColor="#f59e0b">
        <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Reloj</span><Toggle checked={cfg.showCountdown || false} onChange={v => update("showCountdown", v)} /></div>
        {cfg.showCountdown && (
          <Inp label="Fecha y Hora exacta de la fiesta" type="datetime-local" value={cfg.countdownDate || ""} onChange={v => update("countdownDate", v)} />
        )}
      </Acc>

      {/* 3. BANNER PROMOCIONAL */}
      <Acc title="3️⃣ Banner Central" icon={Star} iconColor="#d97706">
        <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Banner</span><Toggle checked={cfg.showBanner} onChange={v => update("showBanner", v)} /></div>
        {cfg.showBanner && (
          <>
            <Inp label="Título del Banner" value={cfg.bannerTitle} onChange={v => update("bannerTitle", v)} />
            <div className="flex items-center justify-between mt-4 mb-2 bg-gray-50 p-2 rounded-xl">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Usar GIF Animado?</span>
              <Toggle checked={cfg.useGiphyBanner || false} onChange={v => update("useGiphyBanner", v)} />
            </div>
            {cfg.useGiphyBanner ? (
              <GiphySearch onSelect={url => update("bannerPhoto", url)} placeholder="Buscar GIF..." />
            ) : (
              <FileUpload value={cfg.bannerPhoto} onChange={v => update("bannerPhoto", v)} />
            )}
          </>
        )}
      </Acc>

      {/* 4. FECHA Y HORA */}
      <Acc title="4️⃣ Cuándo y Dónde" icon={Calendar} iconColor="#e11d48">
        <TypoControl label="Tamaño Textos Fecha y Lugar" sizeVal={cfg.dateSize ?? 18} onSize={v => update("dateSize", v)} minSize={12} maxSize={30} />
        
        <div className="flex items-center justify-between mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Día de la fiesta</span><Toggle checked={cfg.showDate} onChange={v => update("showDate", v)} /></div>
        {cfg.showDate && <Inp type="date" value={cfg.dateText} onChange={v => update("dateText", v)} />}

        <div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Horario de la fiesta</span><Toggle checked={cfg.showTime} onChange={v => update("showTime", v)} /></div>
        {cfg.showTime && <Inp placeholder="16:00 a 20:00 hs" value={cfg.timeText} onChange={v => update("timeText", v)} />}

        <div className="flex items-center justify-between mt-4 mb-2 border-t border-gray-100 pt-4"><span className="text-xs font-bold text-slate-500">Bloque de Ubicación</span><Toggle checked={cfg.showLocation} onChange={v => update("showLocation", v)} /></div>
        {cfg.showLocation && (
          <>
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 mb-4 opacity-80">
              <p className="text-[10px] font-black text-violet-800 uppercase tracking-widest mb-1">📍 Dirección (Fijada por Master)</p>
              <p className="text-xs font-bold text-violet-900">{cfg.locationName || "Nombre del Salón"}</p>
              <p className="text-xs text-violet-700">{cfg.locationAddress || "Dirección configurada desde tu panel"}</p>
            </div>
            <div className="flex items-center justify-between mt-2 mb-2"><span className="text-xs font-bold text-slate-500">Aclarar Estacionamiento</span><Toggle checked={cfg.showParking} onChange={v => update("showParking", v)} /></div>
            {cfg.showParking && <SelectInp label="Tipo" value={cfg.parkingType} options={[{label:"Público en la calle", value:"Estacionamiento público"}, {label:"Cubierto / Privado", value:"Estacionamiento privado cubierto"}, {label:"Personalizado...", value:"otro"}]} onChange={v => update("parkingType", v)} />}
            {cfg.showParking && cfg.parkingType === 'otro' && <Inp placeholder="Escribe aquí..." value={cfg.customParking || ""} onChange={v => update("customParking", v)} />}
          </>
        )}
      </Acc>

      {/* 5. SALON */}
      <Acc title="5️⃣ Tarjeta del Salón" icon={LinkIcon} iconColor="#6366f1">
        <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Mostrar Tarjeta</span><Toggle checked={cfg.showVenueLogo || false} onChange={v => update("showVenueLogo", v)} /></div>
        {cfg.showVenueLogo && (
          <>
            <Inp label="Nombre del lugar" value={cfg.venueName || ""} onChange={v => update("venueName", v)} />
            <FileUpload label="Logo (imagen cuadradita)" value={cfg.venueLogoUrl || ""} onChange={v => update("venueLogoUrl", v)} />
            <SelectInp label="Tipo de botón" value={cfg.venueLinkType || "web"} options={[{ label: "🌐 Ir al Sitio Web", value: "web" }, { label: "📱 Chatear por WhatsApp", value: "whatsapp" }]} onChange={v => update("venueLinkType", v)} />
            <Inp label="Link o Número (con código país)" value={cfg.venueLink || ""} onChange={v => update("venueLink", v)} />
          </>
        )}
      </Acc>

      {/* 6. MULTIMEDIA */}
      <Acc title="6️⃣ Multimedia (Video y Música)" icon={Video} iconColor="#8b5cf6">
        <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Video de Invitación</span><Toggle checked={cfg.showVideo || false} onChange={v => update("showVideo", v)} /></div>
        {cfg.showVideo && (
          <div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <Inp label="Título del video" value={cfg.videoTitle || ""} onChange={v => update("videoTitle", v)} />
            <Inp label="Enlace de YouTube" value={cfg.videoUrl || ""} onChange={v => update("videoUrl", v)} />
          </div>
        )}
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100"><span className="text-xs font-bold text-slate-500">Música de Spotify</span><Toggle checked={cfg.showMusic || false} onChange={v => update("showMusic", v)} /></div>
        {cfg.showMusic && (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <Inp label="Enlace de Spotify (Canción o Playlist)" value={cfg.spotifyUrl || ""} onChange={v => update("spotifyUrl", v)} placeholder="https://open.spotify.com/track/..." />
          </div>
        )}
      </Acc>

      {/* 7. CRONOGRAMA */}
      <Acc title="7️⃣ Programa (Itinerario)" icon={List} iconColor="#0ea5e9">
         <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Cronograma</span><Toggle checked={cfg.showItinerary} onChange={v => update("showItinerary", v)} /></div>
         {cfg.showItinerary && (
           <>
             <div className="space-y-4 mb-6">
                {cfg.itinerary?.map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative">
                    <button onClick={() => update("itinerary", cfg.itinerary.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"><Trash2 size={14}/></button>
                    <div className="flex gap-2 pr-6">
                      <MiniInp className="w-16 p-2 text-xs font-bold border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.time} onChange={v => { const n = [...cfg.itinerary]; n[i].time = v; update("itinerary", n); }} />
                      <MiniInp className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.title} onChange={v => { const n = [...cfg.itinerary]; n[i].title = v; update("itinerary", n); }} />
                    </div>
                    <MiniInp className="w-full p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={item.sub} placeholder="Aclaración opcional" onChange={v => { const n = [...cfg.itinerary]; n[i].sub = v; update("itinerary", n); }} />
                  </div>
                ))}
             </div>
             <button onClick={() => update("itinerary", [...(cfg.itinerary || []), { time: "16:00", title: "Nuevo Evento", sub: "" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer"><Plus size={14} className="inline-block mr-2" /> AÑADIR EVENTO AL PROGRAMA</button>
           </>
         )}
      </Acc>

      {/* 8. MENU DE COMIDA */}
      <Acc title="8️⃣ Menú de Comida" icon={LayoutGrid} iconColor="#10b981">
         <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Menú</span><Toggle checked={cfg.showMenu} onChange={v => update("showMenu", v)} /></div>
         {cfg.showMenu && (
           <>
             <div className="space-y-3 mb-6">
                {cfg.menuItems?.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <EmojiPicker list={FOOD_EMOJIS} value={m.emoji} onSelect={e => { const n = [...cfg.menuItems]; n[i].emoji = e; update("menuItems", n); }} />
                    <MiniInp className="flex-1 p-2 text-xs border bg-gray-50 rounded-lg outline-none focus:border-violet-300" value={m.label} onChange={v => { const n = [...cfg.menuItems]; n[i].label = v; update("menuItems", n); }} />
                    <button onClick={() => update("menuItems", cfg.menuItems.filter((_, idx) => idx !== i))} type="button" className="text-red-400 p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
             <button onClick={() => update("menuItems", [...(cfg.menuItems || []), { emoji: "🍕", label: "Nueva Opción" }])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer"><Plus size={14} className="inline-block mr-2"/> AÑADIR COMIDA</button>
           </>
         )}
      </Acc>

      {/* 9. VESTIMENTA Y REGALOS */}
      <Acc title="9️⃣ Vestimenta y Regalos" icon={Layout} iconColor="#f43f5e">
         <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Vestimenta</span><Toggle checked={cfg.showDressCode} onChange={v => update("showDressCode", v)} /></div>
         {cfg.showDressCode && (
           <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-xl border border-gray-200">
             <EmojiPicker list={CLOTHES_EMOJIS} value={cfg.dressCodeIcon} onSelect={e => update("dressCodeIcon", e)} />
             <div className="flex-1"><Inp value={cfg.dressCodeText} onChange={v => update("dressCodeText", v)} placeholder="Ej: Elegante Sport" className="!mb-0"/></div>
           </div>
         )}

         <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100"><span className="text-xs font-bold text-slate-500">Activar Regalos</span><Toggle checked={cfg.showGifts} onChange={v => update("showGifts", v)} /></div>
         {cfg.showGifts && (
           <>
             <div className="flex gap-2 mb-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <EmojiPicker value={cfg.giftIcon} onSelect={e => update("giftIcon", e)} />
               <div className="w-24"><Inp value={cfg.giftLabel} onChange={v => update("giftLabel", v)} placeholder="Título" className="!mb-0"/></div>
               <div className="flex-1"><Inp value={cfg.giftText} onChange={v => update("giftText", v)} placeholder="Lluvia de sobres..." className="!mb-0"/></div>
             </div>
             
             <div className="flex items-center justify-between mt-4 mb-2"><span className="text-[10px] font-bold text-slate-500 uppercase">Aclaración Extra de Regalos</span><Toggle checked={cfg.showGiftNote} onChange={v => update("showGiftNote", v)} /></div>
             {cfg.showGiftNote && (
               <div className="mt-2">
                 <Inp value={cfg.giftNoteText} onChange={v => update("giftNoteText", v)} placeholder="Ej: No traer cajas grandes.\nDejo CBU acá..." multiline className="!mb-2" />
                 <TypoControl label="Diseño Aclaración" colorVal={cfg.giftNoteColor || cfg.primary} onColor={v => update('giftNoteColor', v)} sizeVal={cfg.giftNoteSize || 11} onSize={v => update('giftNoteSize', v)} minSize={8} maxSize={24} />
               </div>
             )}
           </>
         )}
      </Acc>

      {/* 10. GALERÍA DE FOTOS */}
      <Acc title="🔟 Galería de Fotos" icon={ImageIcon} iconColor="#ec4899">
         <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-500">Activar Galería</span><Toggle checked={cfg.showGallery} onChange={v => update("showGallery", v)} /></div>
         {cfg.showGallery && (
           <>
             <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button onClick={() => update("galleryLayout", 'carousel')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${cfg.galleryLayout === 'carousel' || !cfg.galleryLayout ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'} cursor-pointer`}><Smartphone size={14}/> Carrusel</button>
                <button onClick={() => update("galleryLayout", 'grid')} type="button" className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${cfg.galleryLayout === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'} cursor-pointer`}><LayoutGrid size={14}/> Cuadrícula</button>
             </div>
             <Inp label="Título de la Sección" value={cfg.galleryTitle} onChange={v => update("galleryTitle", v)} />
             <div className="space-y-4 mb-4 mt-2">
               {cfg.galleryPhotos?.map((p, i) => (
                 <div key={i} className="bg-white border border-gray-200 rounded-xl p-2 relative">
                   <FileUpload onChange={v => { const n = [...cfg.galleryPhotos]; n[i] = v; update("galleryPhotos", n); }} value={p} />
                   <button onClick={() => update("galleryPhotos", cfg.galleryPhotos.filter((_, idx) => idx !== i))} type="button" className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer"><Trash2 size={14}/></button>
                 </div>
               ))}
             </div>
             <button onClick={() => update("galleryPhotos", [...(cfg.galleryPhotos || []), ""])} type="button" className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all cursor-pointer"><Plus size={14} className="inline-block mr-2" /> AÑADIR FOTO</button>
           </>
         )}
      </Acc>

      {/* 11. CONFIRMACIÓN WHATSAPP Y QR */}
      <Acc title="1️⃣1️⃣ Confirmación y Accesos (QR)" icon={CheckCircle2} iconColor="#22c55e">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Control de Accesos QR</h4>
           <MiniInp type="number" label="Límite Máximo de Acompañantes por Pase" value={cfg.maxGuestsPerFamily || 5} onChange={v => update("maxGuestsPerFamily", Number(v))} placeholder="Ej: 5" className="w-full px-4 py-3 rounded-xl text-slate-800 bg-white border border-gray-200 text-sm focus:border-violet-400 outline-none transition-all" />
           <p className="text-[9px] text-slate-500 mt-2 font-bold">El invitado no podrá generar un QR para más de esta cantidad de personas.</p>
        </div>

        <Inp label="Número Celular (con código país, sin +)" value={cfg.whatsappNumber} onChange={v => update("whatsappNumber", v)} placeholder="5491123456789" icon={MessageCircle} />
        <div className="bg-green-50 p-3 rounded-xl border border-green-100 mt-2">
          <p className="text-[9px] text-green-700 font-bold mb-2">💡 Tip: Escribí {"{nombre}"} en el mensaje para que se reemplace por el nombre del cumpleañero automáticamente.</p>
          <Inp label="Mensaje opcional de WhatsApp" value={cfg.whatsappMessage} onChange={v => update("whatsappMessage", v)} multiline className="!mb-0" />
        </div>
      </Acc>

    </aside>
  );
}
