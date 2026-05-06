import React, { useState, useEffect, useRef } from "react";
import { OpeningAnimation } from "./Lotties"; 
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronLeft, ChevronRight, Download, MessageCircle, Users, ExternalLink } from "lucide-react";
import { DEF_CONFIG, THEMES, getSpotifyEmbed, getYouTubeId, formatToDDMMYYYY } from "./config";
import { IconRenderer } from "./EditorUI";

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TiktokIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const CornerOrnament = ({ url, color, size, className, style }) => (
  <div className={className} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, WebkitMaskImage: `url("${url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: `url("${url}")`, maskSize: 'contain', maskRepeat: 'no-repeat', ...style }} />
);

const DraggableItem = ({ id, cfg, update, children, className }) => {
  const pos = cfg[`${id}Pos`] || { x: 0, y: 0 };
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(pos);
  const dragRef = useRef(null);

  useEffect(() => { setLocalPos(cfg[`${id}Pos`] || { x: 0, y: 0 }); }, [cfg[`${id}Pos`]]);

  const onPointerDown = (e) => {
    if (!update) return; 
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, origX: localPos.x, origY: localPos.y };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = dragRef.current.origX + (clientX - dragRef.current.startX);
    const y = dragRef.current.origY + (clientY - dragRef.current.startY);
    setLocalPos({ x, y });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (update) update(`${id}Pos`, localPos);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("touchmove", onPointerMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
    }
    return () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, [isDragging, localPos]);

  return (
    <div className={`group ${className || ''}`} style={{ transform: `translate(${localPos.x}px, ${localPos.y}px)`, cursor: update ? (isDragging ? "grabbing" : "grab") : "default", zIndex: isDragging ? 999 : 50, touchAction: update ? 'none' : 'auto', position: 'absolute' }} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
      {children}
      {update && (<div className={`absolute -inset-1 border-2 border-dashed border-violet-500 rounded-lg pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />)}
    </div>
  );
};

const RenderSymbol = ({ value, size = 32, color = "currentColor", className = "" }) => {
  if (typeof value === 'string' && value.startsWith('icon-')) return <IconRenderer name={value} size={size} color={color} className={className} />;
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={`flex items-center justify-center ${className}`}>{value}</span>;
}

// ==== COMPONENTE VIP REPARADO Y MEJORADO ====
const RsvpWidget = ({ cfg, primary, textC, cardC, onConfirmRSVP }) => {
  const [step, setStep] = useState('button');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', lastname: '', guests: 1 });
  const [ticketImage, setTicketImage] = useState('');

  // Tope máximo fijado desde el panel maestro (por defecto 5)
  const maxLimit = cfg.maxGuestsPerFamily || 5;

  const generateTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    const ticketId = `VIP-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
    const qrUrl = `https://quickchart.io/qr?text=${ticketId}&size=300`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 900;
      const ctx = canvas.getContext('2d');
      
      const grd = ctx.createLinearGradient(0,0,0,900);
      grd.addColorStop(0, primary); grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd; ctx.fillRect(0,0,600,900);
      
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = 'bold 30px sans-serif'; ctx.fillText("PASE VIP", 300, 80);
      ctx.font = 'bold 60px serif'; ctx.fillText(cfg.honoreeName || "Fiesta", 300, 180);
      
      ctx.fillStyle = '#fff'; ctx.fillRect(150, 250, 300, 300);
      ctx.drawImage(img, 160, 260, 280, 280);
      
      ctx.font = 'bold 40px sans-serif'; ctx.fillText(`${formData.name} ${formData.lastname}`.toUpperCase(), 300, 650);
      
      // Inyección de la cantidad de acompañantes en el QR final
      ctx.font = '30px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`Válido para: ${formData.guests} ${formData.guests === 1 ? 'persona' : 'personas'}`, 300, 710);
      
      setTicketImage(canvas.toDataURL('image/jpeg'));
      if(onConfirmRSVP) onConfirmRSVP({...formData, id: ticketId});
      setLoading(false); setStep('qr');
    };
    img.src = qrUrl;
  };

  if(step === 'button') {
    return <button onClick={()=>setStep('form')} className="w-full py-5 rounded-2xl font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer" style={{ background: primary }}>OBTENER PASE VIP</button>;
  }

  if(step === 'form') {
    return (
      <form onSubmit={generateTicket} className="p-6 rounded-3xl border space-y-4 shadow-sm" style={{ background: cardC, borderColor: `${primary}33` }}>
        <input type="text" placeholder="Tu Nombre" className="w-full p-4 rounded-xl outline-none" style={{ background: `${textC}0d`, color: textC }} onChange={e=>setFormData({...formData, name: e.target.value})} required />
        <input type="text" placeholder="Tu Apellido" className="w-full p-4 rounded-xl outline-none" style={{ background: `${textC}0d`, color: textC }} onChange={e=>setFormData({...formData, lastname: e.target.value})} required />
        
        {/* Selector de acompañantes con tope */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: `${textC}0d` }}>
          <span className="text-xs font-bold flex items-center gap-2" style={{ color: textC }}><Users size={16}/> Acompañantes</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold cursor-pointer transition-colors" style={{ background: `${textC}1a`, color: textC }}>-</button>
            <span className="font-black w-4 text-center" style={{ color: textC }}>{formData.guests}</span>
            <button type="button" onClick={() => setFormData({...formData, guests: Math.min(maxLimit, formData.guests + 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold cursor-pointer transition-colors" style={{ background: `${textC}1a`, color: textC }}>+</button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 font-black rounded-xl cursor-pointer" style={{ background: primary, color: '#fff' }}>{loading ? 'Procesando...' : 'GENERAR PASE'}</button>
      </form>
    );
  }

  return (
    <div className="text-center p-6 rounded-3xl border shadow-sm" style={{ background: cardC, borderColor: `${primary}33` }}>
      <img src={ticketImage} className="w-full max-w-[240px] mx-auto rounded-xl shadow-2xl mb-4" alt="Pase VIP" />
      <a href={ticketImage} download="Pase_VIP.jpg" className="block w-full py-3 bg-green-500 text-white font-black rounded-xl mb-3 cursor-pointer">DESCARGAR IMAGEN</a>
      <button onClick={()=>setStep('button')} className="text-xs cursor-pointer font-bold" style={{ color: textC }}>Cerrar</button>
    </div>
  );
};

export const InvitePreview = ({ cfg, status, update, onConfirmRSVP }) => {
  if (!cfg) return null;
  const primary = cfg.primary || "#8b5cf6";
  const bg = `linear-gradient(180deg, ${cfg.bg1 || "#f8f7ff"} 0%, ${cfg.bg2 || "#e0dcfc"} 100%)`;
  const textC = cfg.text || "#1e1b4b";
  const mutedC = cfg.muted || "#6b7280";
  const cardC  = cfg.card  || "#ffffff";

  return (
    <div style={{ background: bg, fontFamily: cfg.fontBody, minHeight: '100%' }} className="pb-12 relative overflow-x-hidden flex flex-col">
      {cfg.showCoverBorders && cfg.selectedBorder && (
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'top') && (
            <>
              <DraggableItem id="topLeftBorder" cfg={cfg} update={update} className="top-0 left-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} />
              </DraggableItem>
              <DraggableItem id="topRightBorder" cfg={cfg} update={update} className="top-0 right-0 pointer-events-auto">
                <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleX(-1)' }} />
              </DraggableItem>
            </>
          )}
          {(cfg.borderPosition === 'both' || cfg.borderPosition === 'bottom') && (
            <>
               <DraggableItem id="bottomLeftBorder" cfg={cfg} update={update} className="bottom-0 left-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleY(-1)' }} />
               </DraggableItem>
               <DraggableItem id="bottomRightBorder" cfg={cfg} update={update} className="bottom-0 right-0 pointer-events-auto">
                 <CornerOrnament url={cfg.selectedBorder} color={cfg.borderColor || primary} size={cfg.ornamentSize || 150} style={{ transform: 'scaleX(-1) scaleY(-1)' }} />
               </DraggableItem>
            </>
          )}
        </div>
      )}

      <div className="relative h-[420px] overflow-hidden shrink-0">
        <img src={cfg.coverPhoto || DEF_CONFIG.coverPhoto} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cfg.bg1} 5%, rgba(0,0,0,0.4) 60%, transparent 100%)` }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-30">
          <DraggableItem id="eventType" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <p className="font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2" style={{ color: cfg.eventTypeColor || primary, fontSize: `${cfg.eventTypeSize ?? 11}px`, fontFamily: cfg.eventTypeFont }}>
              <RenderSymbol value={cfg.eventTypeEmoji} size={cfg.eventTypeSize ?? 11} color={cfg.eventTypeColor || primary} />
              {cfg.eventType}
            </p>
          </DraggableItem>
          <DraggableItem id="honoree" cfg={cfg} update={update} className="relative !static flex justify-center w-full">
            <h1 style={{ fontFamily: cfg.honoreeFont, color: cfg.honoreeColor, fontSize: `${cfg.honoreeSize}px`, textAlign: 'center' }}>{cfg.honoreeName}</h1>
          </DraggableItem>
          {cfg.showBadge && (
            <DraggableItem id="badge" cfg={cfg} update={update} className="relative !static flex justify-center mt-2 w-full">
               <div className="px-4 py-2 rounded-full shadow-lg" style={{ background: cfg.badgeBgColor || 'rgba(0,0,0,0.5)' }}>
                  <span style={{ color: '#fff', fontSize: `${cfg.badgeSize || 14}px` }}>{cfg.badgeEmoji} {cfg.badgeText}</span>
               </div>
            </DraggableItem>
          )}
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-30 space-y-4 flex-1">
        <div className="p-6 rounded-3xl" style={{ background: cardC }}>
          <h4 className="text-center font-black uppercase tracking-widest text-[10px] mb-4" style={{ color: mutedC }}>{cfg.menuSectionTitle || "¿Qué vamos a comer?"}</h4>
          <div className="grid grid-cols-2 gap-3">
             {cfg.menuItems?.map((m, i) => (
               <div key={i} className="text-center p-3 border border-slate-100 rounded-2xl">
                 <RenderSymbol value={cfg.usePremiumIcons ? 'icon-utensils' : m.emoji} size={28} color={primary} />
                 <p className="text-[10px] font-bold mt-2" style={{ color: textC }}>{m.label}</p>
               </div>
             ))}
          </div>
        </div>
        
        {/* Le pasamos textC y cardC para que se adapte al tema claro/oscuro */}
        <RsvpWidget cfg={cfg} primary={primary} textC={textC} cardC={cardC} onConfirmRSVP={onConfirmRSVP} />
      </div>
    </div>
  );
};
