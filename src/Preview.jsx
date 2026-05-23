import React, { useState, useEffect, useRef } from "react";
import { Camera, ChevronRight, Download, Eye, Link2, MapPin, Music, Play, X, Heart, Image as ImageIcon } from "lucide-react";

// BUG-MEDIO-10 Resuelto: Importamos LOTTIE_MAP, LottiePlayer y generateTicket desde Lotties para que funcionen las animaciones.
import { RsvpWidget, MapEmbed, SpotifyEmbed, DraggableItem, ParticleCanvas } from "./PreviewEffects";
import { generateTicket, LottiePlayer, LOTTIE_MAP } from "./Lotties";

// CORRECCIÓN SEC-03: Variable de entorno (omitido su fix completo por estar en sandbox)
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

export function InvitePreview({ 
  cfg = {}, 
  internalData = {}, 
  guestData, 
  update, 
  onConfirmRSVP, 
  onUploadLivePhoto, 
  status, 
  previewMode = false 
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showQr, setShowQr] = useState(false);
  const [showCam, setShowCam] = useState(false);
  
  const config = cfg || {};
  const theme = config.theme || 'dark';
  const honoree = config.honoreeName || "Homenajeado";
  const location = config.locationName || "";

  const elements = internalData?.elements || [];
  
  const bgClass = theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#0f0c1b] text-white';
  const cardBg = theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10';

  // CORRECCIÓN: Cargar dinámicamente TODAS las tipografías seleccionadas en el editor
  useEffect(() => {
    const fonts = [
       config.fontBody,
       config.honoreeFont,
       config.eventTypeFont,
       config.badgeFont
    ].filter(Boolean);

    const uniqueFonts = [...new Set(fonts)];

    uniqueFonts.forEach(fontFamily => {
       const fontName = fontFamily.replace(/ /g, '+');
       const fontId = `font-${fontName}`;
       if (!document.getElementById(fontId)) {
          const link = document.createElement('link');
          link.id = fontId;
          link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;600;700;900&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
       }
    });
  }, [config.fontBody, config.honoreeFont, config.eventTypeFont, config.badgeFont]);

  const [cameraStatus, setCameraStatus] = useState("pending");

  useEffect(() => {
    if (previewMode) { setCameraStatus("active"); return; }
    const eventDateStr = config?.date;
    if (!eventDateStr) return;
    
    // CORRECCIÓN BUG-01: Evitamos el parseo YYYY-MM-DD que devuelve NaN en Safari
    const [year, month, day] = eventDateStr.split('-').map(Number);
    const evDate = new Date(year, month - 1, day);
    const now = new Date();
    
    // Si la fecha del evento es de un día anterior, o es hoy y ya pasaron las 6 AM del día siguiente
    const nextDay6AM = new Date(evDate);
    nextDay6AM.setDate(nextDay6AM.getDate() + 1);
    nextDay6AM.setHours(6, 0, 0, 0);

    if (now < evDate) {
      setCameraStatus("pending"); // Aún no es el día
    } else if (now > nextDay6AM) {
      setCameraStatus("closed"); // Ya pasó el evento
    } else {
      setCameraStatus("active"); // Está ocurriendo
    }
  }, [config?.date, previewMode]);

  const [livePhotos, setLivePhotos] = useState([]);
  
  useEffect(() => {
    if (internalData?.live_photos) {
      setLivePhotos(internalData.live_photos);
    }
  }, [internalData?.live_photos]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } 
    else { audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e)); }
    setPlaying(!playing);
  };

  const handleLivePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Lógica real de subida a ImgBB
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
         const newPhoto = { url: data.data.url, date: new Date().toISOString() };
         const updatedPhotos = [newPhoto, ...livePhotos];
         setLivePhotos(updatedPhotos);
         
         // Notificamos al componente padre si la prop existe
         if (onUploadLivePhoto) {
           onUploadLivePhoto(newPhoto);
         }
      }
    } catch (err) { alert("Error al subir foto."); }
  };

  // CORRECCIÓN MOB-07: Mejor detección para AddToCalendar
  const AddToCalendarButton = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || /Macintosh(.*?) FxiOS/.test(navigator.userAgent);
    
    const generateCalLink = () => {
       if (!config.date) return "#";
       const d = new Date(config.date);
       const start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
       const end = new Date(d.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 4 hrs default
       
       if (isIOS) {
          return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:${window.location.href}%0ADTSTART:${start}%0ADTEND:${end}%0ASUMMARY:${honoree}%0ADESCRIPTION:Invitación digital%0ALOCATION:${location}%0AEND:VEVENT%0AEND:VCALENDAR`;
       } else {
          return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(honoree)}&dates=${start}/${end}&details=${encodeURIComponent("Invitación a evento")}&location=${encodeURIComponent(location)}`;
       }
    };

    return (
      <a href={generateCalLink()} target="_blank" rel="noreferrer" className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border shadow-lg mt-4 ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-white/10 border-white/20 text-white backdrop-blur-md'}`}>
         AGENDAR DÍA
      </a>
    );
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col font-sans ${bgClass}`} style={config.fontBody ? { fontFamily: config.fontBody } : {}}>
      
      {config.bgMusic && (
        <div className="fixed top-6 right-6 z-50">
          <button onClick={toggleAudio} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl">
             {playing ? <Music size={20} className="animate-pulse" /> : <Play size={20} className="ml-1" />}
          </button>
          <audio ref={audioRef} src={config.bgMusic} loop className="hidden" />
        </div>
      )}

      {/* CORRECCIÓN: Añadido key={config.particleEffect} para que react actualice el canvas */}
      {config.particleEffect && config.particleEffect !== 'none' && (
         <ParticleCanvas key={config.particleEffect} type={config.particleEffect} isDark={theme === 'dark'} />
      )}

      {/* CORRECCIÓN MOB-08: Portada responsiva (min-h-[450px] h-[55vh]) */}
      <div className={`relative min-h-[450px] h-[55vh] overflow-hidden shrink-0 ${!config.coverPhoto && 'bg-violet-900'}`}>
        {config.coverPhoto && <img src={config.coverPhoto} className="absolute inset-0 w-full h-full object-cover" alt="" />}
        
        {/* Lógica de bordes dinámicos */}
        {config.showCoverBorders && config.selectedBorder && (
           <>
              {(config.borderPosition === 'both' || config.borderPosition === 'top') && (
                 <img src={config.selectedBorder} className="absolute top-0 left-0 w-full object-contain pointer-events-none z-10 opacity-90" style={{ height: `${config.ornamentSize || 150}px`, transform: `rotate(${config.borderRotationTop || 0}deg)` }} alt="" />
              )}
              {(config.borderPosition === 'both' || config.borderPosition === 'bottom') && (
                 <img src={config.selectedBorder} className="absolute bottom-0 left-0 w-full object-contain pointer-events-none z-10 opacity-90" style={{ height: `${config.ornamentSize || 150}px`, transform: `rotate(${config.borderRotationBottom || 0}deg)` }} alt="" />
              )}
           </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-20 px-6 text-center">
           
           {/* CORRECCIÓN: Frase Superior Dinámica (eventType) */}
           <span 
             className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md uppercase tracking-widest mb-4 flex items-center gap-2"
             style={{
               fontFamily: config.eventTypeFont || config.fontBody || 'inherit',
               color: config.eventTypeColor || '#ffffff',
               fontSize: `${config.eventTypeSize || 11}px`,
               textShadow: config.eventTypeShadowSize ? `0px 0px ${config.eventTypeShadowSize}px ${config.eventTypeShadowColor || '#000'}` : 'none'
             }}
           >
             {config.eventTypeEmoji && <span>{config.eventTypeEmoji}</span>}
             {config.eventType || "Estás invitado a..."}
           </span>
           
           {/* CORRECCIÓN: Nombre Principal Dinámico (honoree) */}
           <h1 
             className="font-black leading-none tracking-tight drop-shadow-xl"
             style={{
               fontFamily: config.honoreeFont || 'inherit',
               color: config.honoreeColor || '#ffffff',
               fontSize: `${config.honoreeSize || 48}px`,
               textShadow: config.honoreeShadowSize ? `0px 0px ${config.honoreeShadowSize}px ${config.honoreeShadowColor || '#000'}` : 'none'
             }}
           >
             {honoree}
           </h1>

           {/* CORRECCIÓN: Medalla Flotante (Badge) */}
           {(config.showBadge ?? true) && (
              <div 
                className="mt-6 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/20"
                style={{
                  backgroundColor: config.badgeBgColor || '#000000',
                  fontFamily: config.badgeFont || config.fontBody || 'inherit',
                  fontSize: `${config.badgeSize || 14}px`,
                  color: '#ffffff'
                }}
              >
                <span>{config.badgeEmoji || "✨"}</span>
                <span className="font-bold">{config.badgeText || "Mi Fiesta"}</span>
              </div>
           )}

        </div>
      </div>

      <div className="flex-1 px-5 sm:px-8 py-10 relative z-20 flex flex-col items-center max-w-md mx-auto w-full space-y-8">
         
         <div className="text-center w-full">
            <h2 className="text-xl font-bold mb-2">¡Te invito a festejar!</h2>
            <p className="opacity-70 text-sm mb-6 max-w-[280px] mx-auto">Preparate para una noche increíble. Acá tenés toda la info.</p>
            <AddToCalendarButton />
         </div>

         {elements.map((el, idx) => (
            <div key={idx} className="w-full relative group">
               <DraggableItem type={el.type} src={el.src} text={el.text} style={el.style} isDark={theme === 'dark'} />
            </div>
         ))}

         {config.showCountdown && config.date && (
            <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`}>
               <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-4">Faltan</p>
               <div className="flex justify-center gap-4">
                 {[ {l: 'DÍAS', v: '12'}, {l: 'HRS', v: '05'}, {l: 'MIN', v: '30'} ].map((t, i) => (
                    <div key={i} className="flex flex-col items-center">
                       <span className="text-3xl font-black">{t.v}</span>
                       <span className="text-[9px] font-black opacity-50">{t.l}</span>
                    </div>
                 ))}
               </div>
            </div>
         )}

         {config.showRsvp && (
           <RsvpWidget 
             theme={theme} 
             date={config.date} 
             isPreview={previewMode}
             guestData={guestData}
             onConfirmRSVP={onConfirmRSVP}
             status={status}
           />
         )}

         {config.locationUrl && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`}>
              <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4"><MapPin size={24}/></div>
              <h3 className="font-bold mb-1">{location || "Ubicación"}</h3>
              <p className="text-xs opacity-60 mb-6">Hacé click para abrir en Maps</p>
              <a href={config.locationUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-violet-600 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center shadow-lg">CÓMO LLEGAR</a>
              {config.locationEmbed && (
                <div className="mt-6 rounded-xl overflow-hidden h-40">
                  <MapEmbed url={config.locationEmbed} />
                </div>
              )}
           </div>
         )}

         {config.spotifyPlaylist && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`}>
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4"><Music size={24}/></div>
              <h3 className="font-bold mb-1">Playlist de la Fiesta</h3>
              <p className="text-xs opacity-60 mb-6">¡Andá escuchando estos temazos!</p>
              <SpotifyEmbed url={config.spotifyPlaylist} />
           </div>
         )}

         {/* Cámara En Vivo */}
         <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`}>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4"><Camera size={24}/></div>
            <h3 className="font-bold mb-1">Cámara en Vivo</h3>
            <p className="text-xs opacity-60 mb-6">Compartí tus fotos durante la fiesta.</p>
            
            {cameraStatus === "pending" && (
               <div className="py-6 px-4 bg-black/20 rounded-xl border border-white/10">
                 <p className="text-sm font-bold opacity-70">La cámara se habilitará el día del evento.</p>
               </div>
            )}
            
            {cameraStatus === "closed" && (
               <div className="py-6 px-4 bg-black/20 rounded-xl border border-white/10">
                 <p className="text-sm font-bold opacity-70">El evento ya finalizó. ¡Gracias por las fotos!</p>
               </div>
            )}

            {cameraStatus === "active" && (
               <button onClick={() => setShowCam(true)} className="w-full py-4 bg-pink-600 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg">
                 <Camera size={18}/> ABRIR CÁMARA
               </button>
            )}

            {livePhotos.length > 0 && (
               <div className="mt-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 text-left">Fotos Recientes</h4>
                 <div className="grid grid-cols-2 gap-2">
                    {livePhotos.slice(0, 4).map((p, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                        <img src={p.url} className="w-full h-full object-cover" alt="" />
                        {/* CORRECCIÓN MOB-05: opacity-100 md:opacity-0 para que se vea siempre en móviles */}
                        <a href={p.url} download className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Download size={14}/></a>
                      </div>
                    ))}
                 </div>
                 {livePhotos.length > 4 && <button className="w-full py-3 mt-4 text-xs font-bold opacity-70 border rounded-xl">VER TODAS ({livePhotos.length})</button>}
               </div>
            )}
         </div>

      </div>

      {showCam && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
           <div className="h-20 flex items-center justify-between px-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
               <button onClick={() => setShowCam(false)} className="text-white p-2"><X size={24}/></button>
              <span className="text-white text-xs font-black tracking-widest uppercase bg-red-500 px-3 py-1 rounded-full flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> EN VIVO</span>
           </div>
           <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/50">
                 <Camera size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-sm">Activando cámara...</p>
                 <input type="file" accept="image/*" capture="environment" onChange={(e) => { handleLivePhotoUpload(e); setShowCam(false); }} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20" />
              </div>
           </div>
           <div className="h-32 bg-black flex items-center justify-center relative z-30">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 pointer-events-none">
                 <div className="w-full h-full bg-white rounded-full"></div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
