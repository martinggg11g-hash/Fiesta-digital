import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation, LottieOverlay } from "./Lotties"; 
import { Calendar, Clock, MapPin, Loader2, Camera, Lock, CheckCircle2, Download, ExternalLink } from "lucide-react";
import { DEF_CONFIG, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY, PARTICLE_CATEGORIES } from "./config";
import { CornerOrnament, DraggableItem, ParticleCanvas } from "./PreviewEffects";
import { InstagramIcon, FacebookIcon, TiktokIcon, RenderSymbol, Countdown, GalleryCarousel, MapEmbed, InfoCard, SectionTitle, RsvpWidget } from "./PreviewWidgets";

const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

// 👉 COMPONENTE MÁGICO DE TRANSICIÓN (Aparecen al scrollear)
const ScrollReveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Una vez que aparece, dejamos de observarlo para ahorrar memoria
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } // Se dispara un poquito antes de llegar
    );
    
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

const AddToCalendarButton = ({ cfg, primary, cardC }) => {
  const titulo = `Fiesta de ${cfg?.honoreeName || 'DeFiesta'}`;
  const direccion = `${cfg?.locationName || ''} - ${cfg?.locationAddress || ''}`.trim() || 'Dirección del salón';
  const detalles = `¡Te espero para festejar juntos! Mirá la invitación completa acá: ${window.location.href}`;
  
  const fechaClean = cfg?.dateText ? cfg.dateText.replace(/-/g, '') : '20260516';
  const horaClean = cfg?.timeText ? cfg.timeText.replace(/:/g, '') + '00' : '210000';
  
  const startDateTime = `${fechaClean}T${horaClean}`;
  const endDateTime = `${fechaClean}T235900`;

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(detalles)}&location=${encodeURIComponent(direccion)}`;

  const icsContent = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`DTSTART:${startDateTime}`,`DTEND:${endDateTime}`,`SUMMARY:${titulo}`,`DESCRIPTION:${detalles}`,`LOCATION:${direccion}`,'END:VEVENT','END:VCALENDAR'].join('\n');
  const appleCalendarUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  const handleCalendarRedirect = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
      const link = document.createElement('a'); link.href = appleCalendarUrl; link.download = 'evento.ics';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } else {
      window.open(googleCalendarUrl, '_blank');
    }
  };

  return (
    <button type="button" onClick={handleCalendarRedirect} className="w-full py-4 mt-1 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer relative overflow-hidden" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff' }}>
      <Calendar size={18} /> Agendar Evento
    </button>
  );
};

const DraggableBanner = ({ cfg, primary, update }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const posRef = useRef({ startX: 0, startY: 0, initialX: 50, initialY: 50 });

  const handleStart = (e) => {
    if (!update) return; 
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    posRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: cfg.bannerOffsetX ?? 50,
      initialY: cfg.bannerOffsetY ?? 50
    };
  };

  const handleMove = (e) => {
    if (!isDragging || !update || !containerRef.current) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - posRef.current.startX;
    const dy = clientY - posRef.current.startY;

    const rect = containerRef.current.getBoundingClientRect();
    
    const moveX = -(dx / rect.width) * 100 * 1.5;
    const moveY = -(dy / rect.height) * 100 * 1.5;

    let newX = posRef.current.initialX + moveX;
    let newY = posRef.current.initialY + moveY;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    update('bannerOffsetX', newX);
    update('bannerOffsetY', newY);
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className={`relative h-48 rounded-[2rem] overflow-hidden border shadow-lg ${update ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      style={{ borderColor: cfg.border || `${primary}44`, touchAction: update ? 'none' : 'auto' }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <img 
         src={cfg.bannerPhoto || DEF_CONFIG.bannerPhoto} 
         className="w-full h-full object-cover pointer-events-none" 
         style={{ objectPosition: `${cfg.bannerOffsetX ?? 50}% ${cfg.bannerOffsetY ?? 50}%` }} 
         alt="Banner" 
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md pointer-events-none">
         {cfg.bannerTitle}
      </div>
      
      {update && (
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest pointer-events-none border border-white/20 shadow-lg">
           🖐 Arrastrá la foto
        </div>
      )}
    </div>
  );
};

export const InvitePreview = ({ cfg, status, update, onConfirmRSVP, guestData, internalData, onUploadLivePhoto }) => {
  if (!cfg) return null;

  useEffect(() => {
    const fontsToLoad = [
      cfg.fontBody, cfg.fontTitle, cfg.eventTypeFont, 
      cfg.honoreeFont, cfg.badgeFont
    ].filter(Boolean);
    
    const uniqueFonts = [...new Set(fontsToLoad)];
    
    uniqueFonts.forEach(font => {
      const fontId = `gfont-${font.replace(/\s+/g, '-')}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [cfg.fontBody, cfg.fontTitle, cfg.eventTypeFont, cfg.honoreeFont, cfg.badgeFont]);

  const safeFont = (f) => f ? `"${f}", sans-serif` : "inherit";

  const primary = cfg.primary || "#8b5cf6";
  const bg1 = cfg.bg1 || "#f8f7ff";
  const bg2 = cfg.bg2 || "#e0dcfc";
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";
  const gradOpacity = cfg.showCoverGradient === false ? 0 : ((cfg.coverGradientIntensity ?? 50) / 100).toFixed(2);
  
  const eventTypeShadow = (cfg.eventTypeShadowSize > 0) 
    ? `0px 4px ${cfg.eventTypeShadowSize}px ${cfg.eventTypeShadowColor || '#000000'}` 
    : `0 2px 10px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.4)`;

  const honoreeShadow = (cfg.honoreeShadowSize > 0) 
    ? `0px 4px ${cfg.honoreeShadowSize}px ${cfg.honoreeShadowColor || '#000000'}` 
    : `0 2px 10px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.4)`;

  const glowValue = cfg.cardGlow !== undefined ? cfg.cardGlow : 0;
  const hexAlpha = Math.floor((glowValue / 100) * 255).toString(16).padStart(2, '0');
  const dynamicShadow = glowValue === 0 ? 'none' : `${cfg.shadow || '0 8px 30px rgba(0,0,0,0.05)'}, 0 0 ${glowValue}px ${primary}${hexAlpha}`;

  const glassContainerStyle = {
    background: cardC,
    boxShadow: dynamicShadow,
    border: cfg.border ? `1px solid ${cfg.border}` : `1px solid ${primary}22`,
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none'
  };
  
  const shineOverlay = cfg.shine && glowValue !== 0 ? <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: cfg.shine }}></div> : null;

  let isLottieEffect = false;
  let lottieUrl = null;
  
  if (cfg.particleEffect && cfg.particleEffect !== "none") {
    for (const category of Object.values(PARTICLE_CATEGORIES)) {
      const effect = category.find(e => e.id === cfg.particleEffect);
      if (effect && effect.isLottie) {
        isLottieEffect = true;
        lottieUrl = effect.url;
        break;
      }
    }
  }

  const ParticleLayer = () => (
    <div 
      className={`${cfg.particlesFullscreen ? 'fixed' : 'absolute'} inset-0 pointer-events-none ${cfg.particlesFullscreen ? 'z-10' : 'z-20'} overflow-hidden flex items-start justify-center transition-opacity duration-200`} 
      style={{ opacity: (cfg.effectOpacity ?? 100) / 100 }}
    >
       {isLottieEffect ? <LottieOverlay url={lottieUrl} /> : <ParticleCanvas effect={cfg.particleEffect || "none"} primary={primary} />}
    </div>
  );

  let cameraStatus = 'active'; 
  const eventDateStr = cfg.countdownDate || (cfg.dateText ? `${cfg.dateText}T00:00:00` : null);
  
  if (eventDateStr) {
    const evDate = new Date(eventDateStr);
    const now = new Date();
    const msDiff = now.getTime() - evDate.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);

    if (hoursDiff < -12) {
      cameraStatus = 'locked'; 
    } else if (hoursDiff > 24) {
      cameraStatus = 'expired'; 
    } else {
      cameraStatus = 'active'; 
    }
  }

  const [uploadingLive, setUploadingLive] = useState(false);
  const livePhotos = internalData?.live_photos || [];

  const handleLivePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLive(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && onUploadLivePhoto) {
        await onUploadLivePhoto(data.data.url);
      } else if (!onUploadLivePhoto) {
        alert("En el panel de edición, la foto no se guarda. Subí la web para probarlo.");
      }
    } catch (err) { alert("Error al subir foto"); }
    setUploadingLive(false);
  };

  return (
    <div style={{ backgroundColor: bg1, backgroundImage: bg2.includes('gradient') ? bg2 : `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`, fontFamily: safeFont(cfg.fontBody), minHeight: '100%' }} className="pb-12 relative overflow-x-hidden flex flex-col">
      
      {cfg.showCoverBorders && cfg.selectedBorder && (
        <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'top') && (
            <>
              <DraggableItem id="topLeftBorder" cfg={cfg} update={update} className="top-0 left-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `rotate(${cfg.borderRotationTop || 0}deg)` }} />
              </DraggableItem>
              <DraggableItem id="topRightBorder" cfg={cfg} update={update} className="top-0 right-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleX(-1) rotate(${cfg.borderRotationTop || 0}deg)` }} />
              </DraggableItem>
            </>
          )}
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'bottom') && (
            <>
               <DraggableItem id="bottomLeftBorder" cfg={cfg} update={update} className="bottom-0 left-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleY(-1) rotate(${cfg.borderRotationBottom || 0}deg)` }} />
               </DraggableItem>
               <DraggableItem id="bottomRightBorder" cfg={cfg} update={update} className="bottom-0 right-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: `scaleX(-1) scaleY(-1) rotate(${cfg.borderRotationBottom || 0}deg)` }} />
               </DraggableItem>
            </>
          )}
        </div>
      )}

      {/* La foto de portada entra normal, sin scroll reveal porque ya está arriba */}
      <div className="relative h-[450px] overflow-hidden shrink-0 rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,${gradOpacity}) 60%, transparent 100%)` }} />
        {!cfg.particlesFullscreen && <ParticleLayer />}

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col items-center z-30">
          
          <DraggableItem id="eventType" cfg={cfg} update={update} className="relative !static flex justify-center w-full px-4">
            <div 
              className="font-black uppercase tracking-[0.3em] mb-4 text-center anim-pop" 
              style={{ 
                color: cfg.eventTypeColor || primary, 
                fontSize: `${cfg.eventTypeSize ?? 11}px`, 
                fontFamily: safeFont(cfg.eventTypeFont || cfg.fontBody), 
                textShadow: eventTypeShadow, 
                lineHeight: 1.4,
                animationDelay: "0.2s"
              }}
            >
              {cfg.eventTypeEmoji && (
                 <span className="inline-block align-middle mr-2 -mt-1">
                    <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />
                 </span>
              )}
              <span className="align-middle">{cfg.eventType}</span>
            </div>
          </DraggableItem>
          
          <DraggableItem id="honoree" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <h1 className="anim-pop" style={{ fontFamily: safeFont(cfg.honoreeFont || cfg.fontTitle), color: cfg.honoreeColor || textC, fontSize: `${cfg.honoreeSize ?? 48}px`, textShadow: honoreeShadow, textAlign: 'center', lineHeight: 1.1, animationDelay: "0.4s" }}>{cfg.honoreeName}</h1>
          </DraggableItem>

          {(cfg.showBadge ?? true) && (
            <DraggableItem id="badge" cfg={cfg} update={update} className="relative !static flex justify-center mt-4 w-full">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-md font-black shadow-lg anim-pop" style={{ background: cfg.badgeBgColor || 'rgba(0,0,0,0.5)', color: textC, fontSize: `${cfg.badgeSize ?? 12}px`, fontFamily: safeFont(cfg.badgeFont || cfg.fontBody), textTransform: 'uppercase', tracking: 'widest', animationDelay: "0.6s" }}>
                <RenderSymbol value={cfg.badgeEmoji || "👑"} size={cfg.badgeSize ?? 14} color={textC} />
                {cfg.badgeText}
              </span>
            </DraggableItem>
          )}
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-5 flex-1">
        
        {cfg.showCountdown && cfg.countdownDate && (
          <ScrollReveal>
            <div className="rounded-[2rem] relative overflow-hidden" style={glassContainerStyle}>
              {shineOverlay}
              <Countdown targetDate={cfg.countdownDate} primary={primary} text="Falta para el gran día" cfg={cfg} cardC={cardC} />
            </div>
          </ScrollReveal>
        )}

        {cfg.showBanner && (
          <ScrollReveal>
            <DraggableBanner cfg={cfg} primary={primary} update={update} />
          </ScrollReveal>
        )}

        {cfg.showDate && (
          <ScrollReveal>
             <InfoCard icon={Calendar} label="¿Cuándo?" value={formatToDDMMYYYY(cfg.dateText)} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />
          </ScrollReveal>
        )}
        
        {cfg.showTime && (
          <ScrollReveal>
             <InfoCard icon={Clock} label="Horario" value={cfg.timeText} fontSize={cfg.dateSize ?? 18} primary={primary} textC={textC} mutedC={mutedC} cardC={cardC} cfg={cfg} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />
          </ScrollReveal>
        )}
        
        {(cfg.showDate || cfg.showTime) && (
           <ScrollReveal>
             <AddToCalendarButton cfg={cfg} primary={primary} cardC={cardC} />
           </ScrollReveal>
        )}

        {cfg.showLocation && (
          <ScrollReveal>
            <div className="rounded-[2rem] overflow-hidden relative" style={glassContainerStyle}>
              {shineOverlay}
              <div className="p-4 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-white/20 shadow-sm" style={{ background: cfg.accent || primary }}><MapPin size={24} color={cardC === '#000000' ? '#000' : '#fff'} /></div>
                <div className="text-left">
                  <p className="text-[9px] uppercase font-black tracking-widest mb-0.5 opacity-80" style={{ color: mutedC }}>¿Dónde?</p>
                  <p className="font-bold" style={{ color: textC, fontFamily: safeFont(cfg.fontBody), fontSize: `${cfg.locationSize ?? 18}px` }}>{cfg.locationName}</p>
                  <p className="text-[11px] font-medium opacity-70 mt-0.5" style={{ color: mutedC, fontFamily: safeFont(cfg.fontBody) }}>{cfg.locationAddress}</p>
                </div>
              </div>
              <div className="px-4 pb-2 relative z-10"><MapEmbed name={cfg.locationName} address={cfg.locationAddress} primary={primary} /></div>
              {cfg.showParking && (
                <div className="p-4 text-center border-t relative z-10" style={{ borderColor: `${primary}22` }}>
                  <span className="text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full inline-block border shadow-sm" style={{ background: `${primary}15`, color: primary, borderColor: `${primary}33`, fontFamily: safeFont(cfg.fontBody) }}>🚗 {cfg.parkingType === 'otro' ? cfg.customParking : cfg.parkingType}</span>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {cfg.showVenueLogo && (
          <ScrollReveal>
            <div className="pt-4">
              <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                {shineOverlay}
                {cfg.venueLogoUrl && <img src={cfg.venueLogoUrl} className="h-16 w-auto object-contain mb-4 relative z-10 drop-shadow-md" alt="Lugar" />}
                <p className="text-[9px] uppercase font-black tracking-widest mb-1 opacity-80 relative z-10" style={{ color: mutedC }}>Celebrado en</p>
                <h3 className="font-black text-xl mb-5 relative z-10" style={{ color: textC, fontFamily: safeFont(cfg.fontBody) }}>{cfg.venueName}</h3>
                {cfg.venueLink && (
                  <a href={cfg.venueLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-[1rem] font-black text-xs shadow-md transition-transform active:scale-95 uppercase tracking-widest relative z-10 border border-white/20" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff' }}>
                    {cfg.venueLinkType === 'whatsapp' ? 'Hablar por WhatsApp' : 'Visitar Sitio Web'}
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}
        
        {cfg.showVideo && cfg.videoUrl && (
          <ScrollReveal>
            <div className="pt-4">
              {cfg.videoTitle && <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.videoTitle}</SectionTitle>}
              <div className="rounded-[2rem] overflow-hidden border shadow-lg relative p-2" style={glassContainerStyle}>
                {shineOverlay}
                <div className="rounded-[1.5rem] overflow-hidden relative z-10" style={{ paddingTop: '56.25%' }}>
                  <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(cfg.videoUrl)}`} title="YouTube" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {cfg.showMusic && cfg.spotifyUrl && (
          <ScrollReveal>
            <div className="pt-4">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>Música para entrar en clima</SectionTitle>
              <div className="rounded-[2rem] p-2 relative overflow-hidden shadow-lg" style={glassContainerStyle}>
                {shineOverlay}
                <iframe className="relative z-10 rounded-[1.5rem]" src={getSpotifyEmbed(cfg.spotifyUrl)} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </div>
            </div>
          </ScrollReveal>
        )}

        {cfg.showItinerary && cfg.itinerary?.length > 0 && (
          <ScrollReveal>
            <div className="pt-4">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.itinerarySectionTitle ?? "Programa del evento"}</SectionTitle>
              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': `${primary}33` }}>
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: primary, opacity: 0.3 }} />
                {cfg.itinerary.map((item, i) => (
                  <div key={i} className="relative text-left p-4 rounded-3xl" style={glassContainerStyle}>
                    {shineOverlay}
                    <div className="absolute -left-[35px] top-[18px] w-8 h-8 rounded-full border-4 border-white z-20 flex items-center justify-center shadow-md bg-white">
                       <RenderSymbol value={item.emoji || "✨"} size={16} color={primary} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black mb-1 uppercase tracking-widest" style={{ color: primary }}>{item.time}</p>
                      <p className="font-bold text-sm" style={{ color: textC, fontFamily: safeFont(cfg.fontBody) }}>{item.title}</p>
                      {item.sub && <p className="text-xs font-medium opacity-70 mt-1" style={{ color: mutedC, fontFamily: safeFont(cfg.fontBody) }}>{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {cfg.showMenu && cfg.menuItems?.length > 0 && (
          <ScrollReveal>
            <div className="pt-4">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.menuSectionTitle ?? "¿Qué vamos a comer?"}</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {cfg.menuItems.map((m, i) => (
                  <div key={i} className="p-5 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                    {shineOverlay}
                    <span className="mb-3 flex justify-center items-center h-12 w-12 rounded-2xl relative z-10 border shadow-sm" style={{ background: `${primary}15`, borderColor: `${primary}22` }}>
                       <RenderSymbol value={m.emoji} size={24} color={primary} />
                    </span>
                    <span className="text-xs font-bold relative z-10" style={{ color: textC, fontFamily: safeFont(cfg.fontBody) }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {cfg.showLiveCamera && (
          <ScrollReveal>
            <div className="pt-6">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.liveCameraTitle ?? "Álbum Colaborativo"}</SectionTitle>
              <div className="relative overflow-hidden rounded-[2rem] text-center p-6 border shadow-lg" style={glassContainerStyle}>
                {shineOverlay}
                <div className="relative z-10 flex flex-col items-center">
                   {cameraStatus === 'locked' && (
                     <div className="py-6 flex flex-col items-center opacity-70">
                       <Lock size={40} className="mb-4" style={{ color: primary }} />
                       <p className="text-xs font-black uppercase tracking-widest" style={{ color: textC }}>Álbum Bloqueado</p>
                       <p className="text-[10px] mt-2 font-bold max-w-[200px]" style={{ color: mutedC }}>La cámara se habilitará el día del evento para que compartas tus fotos.</p>
                     </div>
                   )}
                   {cameraStatus === 'expired' && (
                     <div className="py-6 flex flex-col items-center opacity-70">
                       <CheckCircle2 size={40} className="mb-4 text-slate-400" />
                       <p className="text-xs font-black uppercase tracking-widest" style={{ color: textC }}>Álbum Cerrado</p>
                       <p className="text-[10px] mt-2 font-bold max-w-[200px]" style={{ color: mutedC }}>El evento finalizó y las fotos se han eliminado por privacidad.</p>
                     </div>
                   )}
                   {cameraStatus === 'active' && (
                     <div className="w-full">
                       <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80" style={{ color: mutedC }}>Capturá el momento</p>
                       <label className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-2 font-black shadow-lg text-white uppercase tracking-widest transition-transform ${uploadingLive ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 cursor-pointer hover:brightness-110'}`} style={{ background: cfg.accent || primary }}>
                          {uploadingLive ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                          {uploadingLive ? "SUBIENDO..." : "SUBIR FOTO"}
                          <input type="file" accept="image/*" capture="environment" onChange={handleLivePhotoUpload} disabled={uploadingLive} className="hidden" />
                       </label>
                       <p className="text-[9px] font-bold mt-3 opacity-60" style={{ color: textC }}>Las fotos se borrarán 24hs después del evento.</p>
                       
                       {livePhotos.length > 0 && (
                         <div className="grid grid-cols-2 gap-2 mt-6">
                           {livePhotos.map((url, i) => (
                             <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-white/10 relative group">
                               <img src={url} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                               <a href={url} download target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Download size={14} />
                               </a>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {(cfg.showDressCode || cfg.showGifts) && (
          <ScrollReveal>
            <div className="pt-6">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.notesSectionTitle ?? "A tener en cuenta"}</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {cfg.showDressCode && (
                  <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                    {shineOverlay}
                    <span className="mb-3 flex justify-center items-center h-14 w-14 rounded-[1.2rem] relative z-10 border shadow-sm" style={{ background: cfg.accent || primary, borderColor: 'rgba(255,255,255,0.2)' }}>
                      <RenderSymbol value={cfg.dressCodeIcon || "👔"} size={26} color={cardC === '#000000' ? '#000' : '#fff'} />
                    </span>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-80 relative z-10" style={{ color: mutedC }}>Vestimenta</p>
                    <p className="font-bold text-xs relative z-10" style={{ color: textC, fontFamily: safeFont(cfg.fontBody) }}>{cfg.dressCodeText}</p>
                  </div>
                )}
                {cfg.showGifts && (
                  <div className="p-6 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center" style={glassContainerStyle}>
                    {shineOverlay}
                    <span className="mb-3 flex justify-center items-center h-14 w-14 rounded-[1.2rem] relative z-10 border shadow-sm" style={{ background: cfg.accent || primary, borderColor: 'rgba(255,255,255,0.2)' }}>
                      <RenderSymbol value={cfg.giftIcon || "🎁"} size={26} color={cardC === '#000000' ? '#000' : '#fff'} />
                    </span>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-80 relative z-10" style={{ color: mutedC }}>{cfg.giftLabel}</p>
                    <p className="font-bold text-xs relative z-10" style={{ color: textC, fontFamily: safeFont(cfg.fontBody) }}>{cfg.giftText}</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {cfg.showGifts && (
          <ScrollReveal>
            <div className="pt-2">
              {cfg.showGiftNote && cfg.giftNoteText && (
                <div className="text-center mb-5 relative overflow-hidden rounded-[2rem]" style={glassContainerStyle}>
                  {shineOverlay}
                  <div className="p-6 relative z-10">
                    <span className="block font-bold whitespace-pre-wrap leading-relaxed" style={{ color: cfg.giftNoteColor || primary, fontSize: `${cfg.giftNoteSize || 12}px`, fontFamily: safeFont(cfg.fontBody) }}>
                      {cfg.giftNoteText}
                    </span>
                  </div>
                </div>
              )}
              {cfg.giftLinks && cfg.giftLinks.length > 0 && (
                <div className="flex flex-col gap-3">
                  {cfg.giftLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="py-4 px-6 rounded-[1.5rem] flex justify-between items-center transition-transform active:scale-95 relative overflow-hidden group" style={glassContainerStyle}>
                      {shineOverlay}
                      <span className="font-black text-sm relative z-10" style={{ color: textC }}>{link.label}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-110" style={{ background: `${primary}15` }}>
                        <ExternalLink size={14} style={{ color: primary }} />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {cfg.showGallery && cfg.galleryPhotos?.length > 0 && (
          <ScrollReveal>
            <div className="pt-4">
              <SectionTitle mutedC={mutedC} size={cfg.titlesSize} font={safeFont(cfg.fontBody)}>{cfg.galleryTitle}</SectionTitle>
              {cfg.galleryLayout === 'grid' ? (
                <div className="grid grid-cols-2 gap-3">
                  {cfg.galleryPhotos.map((p, i) => p && <div key={i} className="rounded-3xl p-1 relative overflow-hidden" style={glassContainerStyle}>{shineOverlay}<img src={p} className="w-full h-48 rounded-[1.2rem] object-cover relative z-10" alt={`Galeria ${i}`} /></div>)}
                </div>
              ) : (
                <GalleryCarousel photos={cfg.galleryPhotos} />
              )}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
           <RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} mutedC={mutedC} onConfirmRSVP={onConfirmRSVP} guestData={guestData} glassStyle={glassContainerStyle} shineOverlay={shineOverlay} />
        </ScrollReveal>
            
        {(cfg.showInstagram || cfg.showFacebook || cfg.showTiktok) && (
          <ScrollReveal>
            <div className="flex justify-center gap-5 mt-10 relative z-[50]">
              {cfg.showInstagram && cfg.instagramUrl && (
                <a href={cfg.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                  {shineOverlay}
                  <InstagramIcon size={22} color={primary} className="relative z-10 group-hover:text-pink-500 transition-colors" />
                </a>
              )}
              {cfg.showFacebook && cfg.facebookUrl && (
                <a href={cfg.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                  {shineOverlay}
                  <FacebookIcon size={22} color={primary} className="relative z-10 group-hover:text-blue-600 transition-colors" />
                </a>
              )}
              {cfg.showTiktok && cfg.tiktokUrl && (
                <a href={cfg.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden group" style={glassContainerStyle}>
                  {shineOverlay}
                  <TiktokIcon size={22} color={primary} className="relative z-10 group-hover:text-black transition-colors" />
                </a>
              )}
            </div>
          </ScrollReveal>
        )}
        
        <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-50 mt-10 pb-12 relative z-[50]" style={{ color: mutedC }}>
          Invitación creada con <strong className="text-violet-500">defiesta.lat</strong>
        </p>
      </div>

      {cfg.particlesFullscreen && <ParticleLayer />}
    </div>
  );
};
