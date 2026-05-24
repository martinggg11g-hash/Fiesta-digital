import React, { useState, useEffect } from "react";
import { MapPin, CheckCircle2, ChevronLeft, ChevronRight, Users, Loader2, ExternalLink, Camera, Lock, Download } from "lucide-react";
import { formatToDDMMYYYY } from "./config";
import { IconRenderer } from "./EditorUI";

export const InstagramIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
export const FacebookIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
export const TiktokIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

export const RenderSymbol = ({ value, size = 32, color = "currentColor", className = "" }) => {
  const isIcon = typeof value === 'string' && value.startsWith('icon-');
  return (
    <span style={{ fontSize: `${size}px`, color: color, lineHeight: 1 }} className={`shrink-0 inline-flex items-center justify-center ${className}`}>
      {isIcon ? <IconRenderer name={value} size="1em" color={color} /> : value}
    </span>
  );
};

export const Countdown = ({ targetDate, primary, text, cfg, cardC }) => {
  const [timeLeft, setTimeLeft] = useState({ d:0, h:0, m:0, s:0 });
  const [expired, setExpired] = useState(false);
  
  useEffect(() => {
    // Parseo inteligente: Toma targetDate o cae de forma segura a cfg.date
    const baseDate = targetDate || cfg?.date;
    if (!baseDate) return;

    const calc = () => {
      let finalDateStr = baseDate;
      
      // Si el usuario configuró una hora en el editor (ej: "18:00 a 20:00"), extraemos la hora inicial para el reloj
      if (cfg?.time) {
        const timeMatch = cfg.time.match(/\d{2}:\d{2}/);
        if (timeMatch && !finalDateStr.includes('T')) {
          finalDateStr = `${finalDateStr}T${timeMatch[0]}:00`;
        } else if (!finalDateStr.includes('T')) {
          finalDateStr = `${finalDateStr}T00:00:00`;
        }
      } else if (!finalDateStr.includes('T')) {
        finalDateStr = `${finalDateStr}T00:00:00`;
      }

      const target = new Date(finalDateStr).getTime();
      if (isNaN(target)) return;

      const dist = target - Date.now();
      if(dist <= 0) { setExpired(true); return; }
      setTimeLeft({ 
        d: Math.floor(dist / 86400000), 
        h: Math.floor((dist % 86400000) / 3600000), 
        m: Math.floor((dist % 3600000) / 60000), 
        s: Math.floor((dist % 60000) / 1000) 
      });
    };
    calc(); 
    const id = setInterval(calc, 1000); 
    return () => clearInterval(id);
  }, [targetDate, cfg?.date, cfg?.time]);
  
  if(!(targetDate || cfg?.date)) return null;
  const labels = { d:"días", h:"horas", m:"min", s:"seg" };
  
  return (
    <div className="py-4 relative z-10">
      {text && <p className="text-center text-xs font-black uppercase tracking-widest mb-4 opacity-80" style={{ color: primary }}>{text}</p>}
      {expired ? (
        <p className="text-center font-black text-lg" style={{ color: primary }}>🎉 ¡El día llegó!</p>
      ) : (
        <div className="flex justify-center gap-3">
          {Object.entries(timeLeft).map(([unit, val]) => (
            <div key={unit} className="flex flex-col items-center gap-1">
              <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center text-xl font-black shadow-lg relative overflow-hidden border" style={{ background: cfg?.accent || primary, color: cardC === '#000000' ? '#000' : '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                {cfg?.shine && <div className="absolute inset-0 pointer-events-none" style={{ background: cfg.shine }}></div>}
                <span className="relative z-10">{(val || 0).toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest" style={{ color: primary }}>{labels[unit]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const GalleryCarousel = ({ photos }) => {
  const [idx, setIdx] = useState(0);
  const valid = photos.filter(p => p);
  useEffect(() => {
    if (valid.length <= 1) return;
    const timer = setInterval(() => setIdx(p => (p === valid.length - 1 ? 0 : p + 1)), 3000);
    return () => clearInterval(timer);
  }, [valid.length]);

  if(valid.length === 0) return null;
  if(valid.length === 1) return <img src={valid[0]} className="w-full h-64 rounded-2xl object-cover shadow-lg border border-white/10" alt="Galeria" />;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-white/10 group">
       <img src={valid[idx]} className="w-full h-full object-cover transition-opacity duration-500" alt={`Foto ${idx+1}`} />
       <button onClick={() => setIdx(idx === 0 ? valid.length - 1 : idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronLeft size={24} /></button>
       <button onClick={() => setIdx(idx === valid.length - 1 ? 0 : idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><ChevronRight size={24} /></button>
       <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
         {valid.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/40'}`} />)}
       </div>
    </div>
  );
};

export const MapEmbed = ({ name, address, primary }) => {
  const query = (address && address.trim() !== "") ? address : name;
  if (!query) return <div className="w-full h-32 bg-[#1a1a2e] rounded-xl flex items-center justify-center text-white/50 text-xs font-bold border border-white/10 text-center px-4">📍 Falta cargar la dirección en el Panel Maestro</div>;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=15&output=embed&iwloc=near`;
  
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: "#1a1a2e" }}>
      <iframe title="map" width="100%" height="200" style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={embedUrl} />
      <a href={`https://maps.google.com/maps?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 text-xs font-black uppercase tracking-wider transition-colors" style={{ background: `${primary}22`, color: primary }}>
        <MapPin size={14} /> Abrir en Google Maps
      </a>
    </div>
  );
};

export const InfoCard = ({ icon: Icon, label, value, sub, fontSize, primary, textC, mutedC, cardC, cfg, glassStyle, shineOverlay }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[2rem] relative overflow-hidden" style={glassStyle}>
      {shineOverlay}
      <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 relative z-10 shadow-sm border border-white/20" style={{ background: cfg.accent || primary }}><Icon size={24} color={cardC === '#000000' ? '#000' : '#fff'} /></div>
      <div className="text-left relative z-10">
        <p className="text-[9px] uppercase font-black tracking-widest mb-0.5 opacity-80" style={{ color: mutedC }}>{label}</p>
        <p className="font-bold" style={{ color: textC, fontFamily: cfg.fontBody, fontSize: `${fontSize}px` }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5 font-medium opacity-70" style={{ color: mutedC, fontFamily: cfg.fontBody }}>{sub}</p>}
      </div>
    </div>
  );
};

export const SectionTitle = ({ children, mutedC, size, font }) => (
  <h4 className="font-black uppercase tracking-[0.3em] text-center mb-6 opacity-80" style={{ color: mutedC, fontSize: `${size ?? 10}px`, fontFamily: font }}>{children}</h4>
);

export const RsvpWidget = ({ cfg, primary, textC, cardC, mutedC, onConfirmRSVP, guestData, glassStyle, shineOverlay }) => {
  const [step, setStep] = useState('button');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', lastname: '', guests: 1 });
  const [ticketImage, setTicketImage] = useState('');
  const [localConfirmed, setLocalConfirmed] = useState(false);
  const [companions, setCompanions] = useState(0);

  const isEditor = window.location.pathname.includes('/editor');

  if (cfg.isPrivateList && !guestData && !isEditor) {
    return (
      <div className="pt-8 text-center">
        <div className="p-8 rounded-[2rem] relative overflow-hidden flex flex-col items-center" style={glassStyle}>
          {shineOverlay}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 border" style={{ background: `${textC}10`, borderColor: `${textC}20` }}>
             <Lock size={28} style={{ color: textC }} className="opacity-70" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10" style={{ color: textC }}>Evento Privado</h3>
          <p className="text-[11px] font-medium opacity-70 relative z-10 max-w-[250px] mx-auto" style={{ color: textC }}>
            El acceso a esta invitación es únicamente por lista cerrada.<br/><br/>
            Por favor, utilizá el <b>link personalizado</b> que te envió el organizador por WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const isPrivate = cfg.isPrivateList || !!guestData; 
  const isConfirmed = localConfirmed || guestData?.asistencia_confirmada;
  const guestName = guestData?.nombre_completo || "Invitado de Prueba";
  const ticketId = guestData?.id || "VIP-MOCK-1234";
  const maxLimit = guestData ? guestData.max_acompanantes : (cfg.maxGuestsPerFamily || 5);

  if (isPrivate) {
    const qrText = `${ticketId}|${guestName}||${maxLimit}`;
    const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrText)}&size=300`;

    return (
      <div className="pt-8 text-center">
        {cfg.showRsvpDeadline && cfg.rsvpDeadline && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-4" style={{ color: mutedC }}>
            Confirmar antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}
          </p>
        )}
        <div className="p-6 rounded-[2rem] mb-4 relative overflow-hidden text-center flex flex-col items-center" style={glassStyle}>
           {shineOverlay}
           <div className="absolute top-0 left-0 right-0 py-1.5 z-10" style={{ background: cfg.accent || primary }}>
             <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: cardC === '#000000' ? '#000' : '#fff' }}>Tu Pase Nominal</p>
           </div>
           <div className="relative z-10 w-full flex flex-col items-center mt-6">
             <img src={qrCodeUrl} className="w-full max-w-[160px] rounded-xl shadow-lg mb-3 border border-white/20" alt="QR VIP" />
             <p className="text-sm font-black uppercase tracking-widest mt-2" style={{ color: textC }}>{guestName}</p>
             {guestData?.apodo && <p className="text-[10px] font-bold opacity-60 mt-1" style={{ color: textC }}>"{guestData.apodo}"</p>}
             <p className="text-[10px] font-bold opacity-40 mt-3" style={{ color: textC }}>Pase Intransferible</p>
           </div>
        </div>
        {isConfirmed ? (
          <div className="w-full py-5 rounded-[2rem] font-black shadow-lg text-white uppercase tracking-widest flex items-center justify-center gap-2 border border-green-400" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
            <CheckCircle2 size={20} /> ASISTENCIA CONFIRMADA
          </div>
        ) : (
          <>
            {maxLimit > 0 && (
              <div className="flex items-center justify-between px-5 py-4 rounded-[1.5rem] mb-4 border relative overflow-hidden" style={{ background: `${textC}0d`, borderColor: `${textC}1a` }}>
                {shineOverlay}
                <span className="text-xs font-bold flex items-center gap-2 relative z-10" style={{ color: textC }}><Users size={16}/> Acompañantes extras</span>
                <div className="flex items-center gap-3 relative z-10">
                  <button type="button" onClick={() => setCompanions(Math.max(0, companions - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>-</button>
                  <span className="font-black w-4 text-center" style={{ color: textC }}>{companions}</span>
                  <button type="button" onClick={() => setCompanions(Math.min(maxLimit, companions + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>+</button>
                </div>
              </div>
            )}
            <button onClick={async () => { setLoading(true); if (onConfirmRSVP) await onConfirmRSVP({ guests: companions }); setLocalConfirmed(true); setLoading(false); }} disabled={loading} className="flex items-center justify-center gap-2 w-full py-5 rounded-[2rem] font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest relative overflow-hidden" style={{ background: cfg.accent || primary, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {shineOverlay}
              <span className="relative z-10 flex items-center gap-2">{loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />} {loading ? "CONFIRMANDO..." : "CONFIRMAR ASISTENCIA"}</span>
            </button>
          </>
        )}
      </div>
    );
  }

  const generateTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    const newTicketId = `VIP-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
    
    const qrText = `${newTicketId}|${formData.name}|${formData.lastname}|${formData.guests}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrText)}&size=300`;
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 900; const ctx = canvas.getContext('2d');
      const grd = ctx.createLinearGradient(0,0,0,900); grd.addColorStop(0, primary); grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd; ctx.fillRect(0,0,600,900); ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = 'bold 30px sans-serif'; ctx.fillText("PASE VIP", 300, 80);
      ctx.font = 'bold 60px serif'; ctx.fillText(cfg.honoreeName || "Fiesta", 300, 180);
      ctx.fillStyle = '#fff'; ctx.fillRect(150, 250, 300, 300); ctx.drawImage(img, 160, 260, 280, 280);
      const guestNameOpen = `${formData.name} ${formData.lastname}`.toUpperCase();
      ctx.font = 'bold 40px sans-serif'; ctx.fillText(guestNameOpen, 300, 650);
      ctx.font = '30px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(`Válido para: ${formData.guests} ${formData.guests === 1 ? 'persona' : 'personas'}`, 300, 710);
      setTicketImage(canvas.toDataURL('image/jpeg'));
      if(onConfirmRSVP) onConfirmRSVP({...formData, isPrivate, id: newTicketId});
      setLoading(false); setStep('qr');
    };
    img.src = qrUrl;
  };

  if (step === 'button') {
    return (
      <div className="pt-8 text-center">
        {cfg.showRsvpDeadline && cfg.rsvpDeadline && (<p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-4" style={{ color: mutedC }}>Confirmar antes del {formatToDDMMYYYY(cfg.rsvpDeadline)}</p>)}
        <button onClick={() => setStep('form')} className="w-full py-5 rounded-[2rem] font-black shadow-xl text-white transition-all active:scale-95 cursor-pointer uppercase tracking-widest relative overflow-hidden" style={{ background: cfg.accent || primary }}>
          {shineOverlay}<span className="relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>OBTENER PASE VIP</span>
        </button>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="pt-8">
        <form onSubmit={generateTicket} className="p-6 rounded-[2rem] space-y-4 text-left relative overflow-hidden" style={glassStyle}>
          {shineOverlay}
          <div className="relative z-10 space-y-4">
            
            <p className="text-[11px] font-bold uppercase tracking-widest text-center px-2 mb-2" style={{ color: mutedC }}>
              Recuerda generar solo un pase por persona para asegurar tu ingreso rápido.
            </p>

            <input 
              type="text" 
              placeholder="Tu Nombre" 
              title="Ingresá tu nombre"
              onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresá tu nombre')}
              onInput={(e) => e.target.setCustomValidity('')}
              className="w-full p-4 rounded-xl outline-none font-bold placeholder-opacity-50" 
              style={{ background: `${textC}0d`, color: textC, border: `1px solid ${textC}1a` }} 
              onChange={e=>setFormData({...formData, name: e.target.value})} 
              required 
            />
            
            <input 
              type="text" 
              placeholder="Tu Apellido" 
              title="Ingresá tu apellido"
              onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresá tu apellido')}
              onInput={(e) => e.target.setCustomValidity('')}
              className="w-full p-4 rounded-xl outline-none font-bold placeholder-opacity-50" 
              style={{ background: `${textC}0d`, color: textC, border: `1px solid ${textC}1a` }} 
              onChange={e=>setFormData({...formData, lastname: e.target.value})} 
              required 
            />

            <div className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ background: `${textC}0d`, borderColor: `${textC}1a` }}>
              <span className="text-xs font-bold flex items-center gap-2" style={{ color: textC }}><Users size={16}/> Extras</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>-</button>
                <span className="font-black w-4 text-center" style={{ color: textC }}>{formData.guests}</span>
                <button type="button" onClick={() => setFormData({...formData, guests: Math.min(cfg.maxGuestsPerFamily || 5, formData.guests + 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-105" style={{ background: `${textC}1a`, color: textC }}>+</button>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-4 font-black rounded-[1.5rem] uppercase tracking-widest mt-2 shadow-lg transition-transform active:scale-95 border border-white/20" style={{ background: cfg.accent || primary, color: cardC === '#000000' ? '#000' : '#fff' }}>{loading ? 'Procesando...' : 'GENERAR PASE'}</button>
            <button type="button" onClick={() => setStep('button')} className="w-full mt-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity" style={{ color: textC }}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="text-center p-6 rounded-[2rem] relative overflow-hidden" style={glassStyle}>
        {shineOverlay}
        <div className="relative z-10 flex flex-col items-center">
          <img src={ticketImage} className="w-full max-w-[200px] rounded-2xl shadow-2xl mb-5 border-2 border-white/20" alt="Pase VIP" />
          <a href={ticketImage} download="Pase_VIP.jpg" className="block w-full py-4 text-white font-black rounded-xl mb-3 shadow-lg uppercase tracking-widest border border-green-400" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>DESCARGAR IMAGEN</a>
          <button type="button" onClick={()=>setStep('button')} className="text-xs font-bold uppercase tracking-widest" style={{ color: textC }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
