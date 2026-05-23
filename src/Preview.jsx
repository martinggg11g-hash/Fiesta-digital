import React, { useState, useEffect, useRef } from "react";
import { Camera, Download, MapPin, Music, Play, X, Calendar, Clock, Video, LayoutGrid, Smartphone, Gift, Link as LinkIcon } from "lucide-react";

import { RsvpWidget, MapEmbed, SpotifyEmbed, DraggableItem, ParticleCanvas } from "./PreviewEffects";
import { generateTicket, LottiePlayer, LOTTIE_MAP } from "./Lotties";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "904f81caf05efe58a799abdb1fedc2ce";

const InstagramIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const FacebookIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const TiktokIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>);

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
  const [showCam, setShowCam] = useState(false);
  
  const config = cfg || {};
  const theme = config.theme || 'dark';
  const honoree = config.honoreeName || "Homenajeado";
  const elements = internalData?.elements || [];
  
  const bgClass = theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#0f0c1b] text-white';
  const cardBg = theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10';

  const getCardStyle = () => ({
    boxShadow: config.cardGlow ? `0 0 ${config.cardGlow}px ${config.primary || config.borderColor || '#8b5cf6'}` : 'none',
    borderColor: config.cardGlow && theme === 'dark' ? (config.primary || '#8b5cf6') : undefined
  });

  useEffect(() => {
    const fonts = [
       config.fontBody,
       config.fontTitle,
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
  }, [config.fontBody, config.fontTitle, config.honoreeFont, config.eventTypeFont, config.badgeFont]);

  const [cameraStatus, setCameraStatus] = useState("pending");

  useEffect(() => {
    if (previewMode) { setCameraStatus("active"); return; }
    const eventDateStr = config?.date;
    if (!eventDateStr) return;
    
    const parts = eventDateStr.split('-');
    if(parts.length < 3) return;

    const [year, month, day] = parts.map(Number);
    const evDate = new Date(year, month - 1, day);
    const now = new Date();
    
    const nextDay6AM = new Date(evDate);
    nextDay6AM.setDate(nextDay6AM.getDate() + 1);
    nextDay6AM.setHours(6, 0, 0, 0);

    if (now < evDate) {
      setCameraStatus("pending"); 
    } else if (now > nextDay6AM) {
      setCameraStatus("closed"); 
    } else {
      setCameraStatus("active"); 
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
    
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
         const newPhoto = { url: data.data.url, date: new Date().toISOString() };
         const updatedPhotos = [newPhoto, ...livePhotos];
         setLivePhotos(updatedPhotos);
         if (onUploadLivePhoto) {
           onUploadLivePhoto(newPhoto);
         }
      }
    } catch (err) { alert("Error al subir foto."); }
  };

  const AddToCalendarButton = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || /Macintosh(.*?) FxiOS/.test(navigator.userAgent);
    
    const generateCalLink = () => {
       if (!config.date) return "#";
       const d = new Date(config.date);
       if (isNaN(d.getTime())) return "#";

       const start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
       const end = new Date(d.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
       
       if (isIOS) {
          return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:${window.location.href}%0ADTSTART:${start}%0ADTEND:${end}%0ASUMMARY:${honoree}%0ADESCRIPTION:Invitación digital%0ALOCATION:${config.locationName || ""}%0AEND:VEVENT%0AEND:VCALENDAR`;
       } else {
          return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(honoree)}&dates=${start}/${end}&details=${encodeURIComponent("Invitación a evento")}&location=${encodeURIComponent(config.locationName || "")}`;
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

      {config.particleEffect && config.particleEffect !== 'none' && ParticleCanvas && (
         <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticleCanvas key={config.particleEffect} type={config.particleEffect} isDark={theme === 'dark'} />
         </div>
      )}

      <div className={`relative min-h-[450px] h-[55vh] overflow-hidden shrink-0 ${!config.coverPhoto && 'bg-violet-900'}`}>
        {config.coverPhoto && <img src={config.coverPhoto} className="absolute inset-0 w-full h-full object-cover" alt="" />}
        
        {config.showCoverBorders && config.selectedBorder && (
           <>
              {(config.borderPosition === 'both' || config.borderPosition === 'top') && (
                 <div className="absolute top-0 left-0 w-full pointer-events-none z-10" 
                      style={{ 
                        height: `${config.ornamentSize || 150}px`,
                        backgroundColor: config.borderColor || config.primary || '#ffffff',
                        maskImage: `url(${config.selectedBorder})`,
                        WebkitMaskImage: `url(${config.selectedBorder})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskPosition: 'center top',
                        WebkitMaskPosition: 'center top',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        transform: `rotate(${config.borderRotationTop || 0}deg)`
                      }} 
                 />
              )}
              {(config.borderPosition === 'both' || config.borderPosition === 'bottom') && (
                 <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10" 
                      style={{ 
                        height: `${config.ornamentSize || 150}px`,
                        backgroundColor: config.borderColor || config.primary || '#ffffff',
                        maskImage: `url(${config.selectedBorder})`,
                        WebkitMaskImage: `url(${config.selectedBorder})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskPosition: 'center bottom',
                        WebkitMaskPosition: 'center bottom',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        transform: `rotate(${config.borderRotationBottom || 0}deg)`
                      }} 
                 />
              )}
           </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-20 px-6 text-center">
           
           <span 
             className="uppercase tracking-widest mb-4 flex items-center justify-center gap-2 drop-shadow-md"
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
           
           <h1 
             className="font-black leading-none tracking-tight"
             style={{
               fontFamily: config.honoreeFont || config.fontTitle || 'inherit',
               color: config.honoreeColor || '#ffffff',
               fontSize: `${config.honoreeSize || 48}px`,
               textShadow: config.honoreeShadowSize ? `0px 0px ${config.honoreeShadowSize}px ${config.honoreeShadowColor || '#000'}` : 'none'
             }}
           >
             {honoree}
           </h1>

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
            <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
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

         {(config.showDate || config.showTime) && (
            <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
               <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4"><Calendar size={24}/></div>
               <h3 className="font-bold mb-4">¿Cuándo?</h3>
               {config.showDate && <p className="font-black mb-1" style={{fontSize: `${config.dateSize || 18}px`}}>{config.date}</p>}
               {config.showTime && <p className="text-sm opacity-80">{config.time}</p>}
            </div>
         )}

         {config.showLocation && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
              <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4"><MapPin size={24}/></div>
              <h3 className="font-bold mb-1">{config.locationName || "Ubicación"}</h3>
              {config.locationAddress && <p className="text-xs opacity-80 mb-4">{config.locationAddress}</p>}
              
              {config.showParking && (
                 <div className="mb-6 inline-block bg-black/10 px-4 py-2 rounded-xl">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estacionamiento</p>
                   <p className="text-xs font-bold mt-1">{config.parkingType === 'otro' ? config.customParking : config.parkingType}</p>
                 </div>
              )}

              <a href={config.locationUrl || `https://maps.google.com/?q=${encodeURIComponent(config.locationAddress || config.locationName || "")}`} target="_blank" rel="noreferrer" className="w-full py-4 bg-violet-600 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center shadow-lg">CÓMO LLEGAR</a>
              
              {config.locationEmbed && (
                <div className="mt-6 rounded-xl overflow-hidden h-40">
                  <MapEmbed url={config.locationEmbed} />
                </div>
              )}
           </div>
         )}

         {config.showItinerary && config.itinerary && config.itinerary.length > 0 && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
             <h3 className="font-bold mb-6">{config.itinerarySectionTitle || "¿Qué vamos a hacer?"}</h3>
             <div className="space-y-6 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-violet-500/30"></div>
                {config.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start relative z-10 text-left">
                    <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 border-4 border-white shadow-sm text-xl">{item.emoji}</div>
                    <div className="pt-2">
                      <span className="text-[10px] font-black text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full mb-1 inline-block">{item.time}</span>
                      <h4 className="font-bold text-sm leading-tight">{item.title}</h4>
                      {item.sub && <p className="text-xs opacity-70 mt-1">{item.sub}</p>}
                    </div>
                  </div>
                ))}
             </div>
           </div>
         )}

         {config.showMenu && config.menuItems && config.menuItems.length > 0 && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
              <h3 className="font-bold mb-6">{config.menuSectionTitle || "¿Qué vamos a comer?"}</h3>
              <div className="grid grid-cols-2 gap-3">
                {config.menuItems.map((m, i) => (
                  <div key={i} className="p-3 bg-black/5 rounded-xl flex flex-col items-center">
                    <span className="text-2xl mb-2">{m.emoji}</span>
                    <span className="text-xs font-bold leading-tight text-center">{m.label}</span>
                  </div>
                ))}
              </div>
           </div>
         )}

         {(config.showDressCode || config.showGifts) && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
             <h3 className="font-bold mb-6">{config.notesSectionTitle || "A tener en cuenta"}</h3>
             <div className="space-y-8">
               {config.showDressCode && (
                 <div className="flex flex-col items-center">
                   <div className="text-3xl mb-2">{config.dressCodeIcon || "👔"}</div>
                   <h4 className="font-bold text-sm">Código de Vestimenta</h4>
                   <p className="text-xs opacity-70 mt-1">{config.dressCodeText}</p>
                 </div>
               )}
               {config.showDressCode && config.showGifts && <div className="w-16 h-[1px] bg-white/10 mx-auto"></div>}
               {config.showGifts && (
                 <div className="flex flex-col items-center">
                   <div className="text-3xl mb-2">{config.giftIcon || "🎁"}</div>
                   <h4 className="font-bold text-sm">{config.giftLabel || "Regalos"}</h4>
                   <p className="text-xs opacity-70 mt-1">{config.giftText}</p>
                   
                   {config.showGiftNote && config.giftNoteText && (
                     <p className="mt-4 p-3 bg-black/5 rounded-xl w-full" style={{
                       color: config.giftNoteColor || config.primary || '#8b5cf6',
                       fontSize: `${config.giftNoteSize || 11}px`,
                       whiteSpace: 'pre-wrap'
                     }}>
                       {config.giftNoteText}
                     </p>
                   )}

                   {config.giftLinks && config.giftLinks.length > 0 && (
                     <div className="w-full mt-4 space-y-2">
                       {config.giftLinks.map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noreferrer" className="w-full py-3 bg-violet-600/10 text-violet-400 rounded-xl font-black text-xs uppercase flex items-center justify-center border border-violet-500/20">
                            {link.label || "Link de Regalo"}
                          </a>
                       ))}
                     </div>
                   )}
                 </div>
               )}
             </div>
           </div>
         )}

         {config.showGallery && config.galleryPhotos && config.galleryPhotos.length > 0 && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
             <h3 className="font-bold mb-6">{config.galleryTitle || "Galería"}</h3>
             <div className={config.galleryLayout === 'grid' ? "grid grid-cols-2 gap-2" : "flex gap-2 overflow-x-auto pb-4 snap-x"}>
               {config.galleryPhotos.map((p, i) => (
                 <div key={i} className={config.galleryLayout === 'grid' ? "aspect-square rounded-xl overflow-hidden" : "w-48 h-64 shrink-0 snap-center rounded-xl overflow-hidden"}>
                    <img src={p} className="w-full h-full object-cover" alt="" />
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

         {config.showMusic && config.spotifyUrl && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4"><Music size={24}/></div>
              <h3 className="font-bold mb-1">Playlist de la Fiesta</h3>
              <p className="text-xs opacity-60 mb-6">¡Andá escuchando estos temazos!</p>
              <SpotifyEmbed url={config.spotifyUrl} />
           </div>
         )}

         {config.showVideo && config.videoUrl && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
             <h3 className="font-bold mb-4">{config.videoTitle || "Video Especial"}</h3>
             <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe className="w-full h-full" src={config.videoUrl.replace("watch?v=", "embed/")} frameBorder="0" allowFullScreen></iframe>
             </div>
           </div>
         )}

         {config.showLiveCamera && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
              <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4"><Camera size={24}/></div>
              <h3 className="font-bold mb-1">{config.liveCameraTitle || "Cámara en Vivo"}</h3>
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
                          <a href={p.url} download className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Download size={14}/></a>
                        </div>
                      ))}
                   </div>
                   {livePhotos.length > 4 && <button className="w-full py-3 mt-4 text-xs font-bold opacity-70 border rounded-xl">VER TODAS ({livePhotos.length})</button>}
                 </div>
              )}
           </div>
         )}

         {config.showVenueLogo && (
           <div className={`w-full p-6 rounded-[2rem] border text-center ${cardBg}`} style={getCardStyle()}>
             {config.venueLogoUrl && <img src={config.venueLogoUrl} className="w-20 h-20 mx-auto rounded-full object-cover mb-4 shadow-md bg-white p-1" alt="Venue" />}
             <h3 className="font-bold">{config.venueName || "Nuestro Salón"}</h3>
             {config.venueLink && (
               <a href={config.venueLink} target="_blank" rel="noreferrer" className="w-full py-3 mt-4 bg-violet-600 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2">
                 {config.venueLinkType === 'whatsapp' ? 'Contactar por WhatsApp' : 'Visitar Web'}
               </a>
             )}
           </div>
         )}

      </div>

      {(config.showInstagram || config.showFacebook || config.showTiktok) && (
        <div className="flex justify-center gap-4 py-8 relative z-20">
           {config.showInstagram && <a href={config.instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"><InstagramIcon size={20}/></a>}
           {config.showFacebook && <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"><FacebookIcon size={20}/></a>}
           {config.showTiktok && <a href={config.tiktokUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"><TiktokIcon size={20}/></a>}
        </div>
      )}

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
