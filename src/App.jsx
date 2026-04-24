import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import {
  MapPin, Clock, Calendar, Palette, CheckCircle2, PartyPopper,
  ChevronDown, Plus, Upload, Type, LogOut, Edit2,
  Copy, ExternalLink, ArrowLeft, Save, Mail, Lock, Key, X,
  Sparkles, Star, Image as ImageIcon, Layout, List, Trash2
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
(() => {
  if (document.getElementById("fd-global")) return;
  const s = document.createElement("style");
  s.id = "fd-global";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    body { margin: 0; padding: 0; background: #f5f3ff; }
    .fd{font-family:'DM Sans',sans-serif}
    .fd-sb::-webkit-scrollbar{width:4px;height:4px}
    .fd-sb::-webkit-scrollbar-track{background:transparent}
    .fd-sb::-webkit-scrollbar-thumb{background:#d8d4ff;border-radius:99px}
    @keyframes fdUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
    @keyframes fdPop{from{opacity:0;transform:scale(.93) translateY(8px)}to{opacity:1;transform:none}}
    @keyframes fdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes fdSpin{to{transform:rotate(360deg)}}
    .anim-up{animation:fdUp .5s cubic-bezier(.22,1,.36,1) both}
    .anim-up-1{animation:fdUp .5s .08s cubic-bezier(.22,1,.36,1) both}
    .anim-up-2{animation:fdUp .5s .16s cubic-bezier(.22,1,.36,1) both}
    .anim-pop{animation:fdPop .38s cubic-bezier(.22,1,.36,1) both}
    .anim-float{animation:fdFloat 3.6s ease-in-out infinite}
    .anim-spin{animation:fdSpin 1s linear infinite}
    .fd-input{transition:all .2s;border:1.5px solid #e5e3f5;outline:none;font-family:inherit}
    .fd-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1);background:white}
    .fd-toggle{position:relative;width:44px;height:26px;flex-shrink:0}
    .fd-toggle input{opacity:0;width:0;height:0;position:absolute}
    .fd-toggle-track{position:absolute;inset:0;border-radius:99px;cursor:pointer;transition:.3s;background:#e2e0ef}
    .fd-toggle-track::before{content:'';position:absolute;width:20px;height:20px;left:3px;top:3px;background:white;border-radius:50%;transition:.3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 4px rgba(0,0,0,.2)}
    .fd-toggle input:checked~.fd-toggle-track{background:linear-gradient(135deg,#6d28d9,#8b5cf6)}
    .fd-toggle input:checked~.fd-toggle-track::before{transform:translateX(18px)}
    .fd-hover{transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease}
    .fd-hover:hover{transform:translateY(-4px);box-shadow:0 24px 48px rgba(109,40,217,.12)!important}
    .fd-btn{position:relative;overflow:hidden;transition:all .2s ease; cursor:pointer;}
    .fd-btn:active{transform:scale(.97)}
    .invite-phone{width:100%;max-width:390px;border-radius:50px;overflow:hidden;box-shadow:0 0 0 12px #1a1a2e,0 0 0 14px #0d0d1a,0 32px 64px rgba(0,0,0,.65);position:relative;display:flex;flex-direction:column;height:812px;max-height:calc(100vh - 100px);}
    .invite-scroll{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}
    .invite-scroll::-webkit-scrollbar{display:none}
    .acc-body{overflow:hidden;transition:max-height .35s cubic-bezier(.4,0,.2,1),opacity .25s ease}
    /* Estilos para la vista publica (Guest) */
    .guest-view-wrapper { width: 100%; min-height: 100vh; background: #000; display: flex; justify-content: center; }
    .guest-mobile-container { width: 100%; max-width: 480px; min-height: 100vh; background: white; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & MOCK DATA (En el futuro esto va en Supabase)
═══════════════════════════════════════════════════════════ */
const EMOJIS = ['🎂','🎈','🎉','🥳','🎁','🎊','👶','💍','🎓','✨','🌟','❤️','💖','🦖','🦄','⚽','🎮','👑','🌸','🍕','🍰','🥂','🍻','🎭','🎶','📸','🚗','💒','🏖️','🌈','🔥','💎','🎪','🎠','🎡','🦋','🌺','🎵','🏆'];

const THEMES = [
  { id:"violet", name:"Violeta", emoji:"💜", bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4" },
  { id:"rose",   name:"Rosa",    emoji:"🌸", bg1:"#150510", bg2:"#200a16", primary:"#e11d48", card:"#2a0e1a", text:"#fff1f3", muted:"#fda4af" },
  { id:"teal",   name:"Teal",    emoji:"🌊", bg1:"#020f10", bg2:"#031a1c", primary:"#0d9488", card:"#062020", text:"#f0fdfb", muted:"#5eead4" },
  { id:"amber",  name:"Ámbar",   emoji:"🔥", bg1:"#0f0800", bg2:"#1c1200", primary:"#d97706", card:"#1a1000", text:"#fffbeb", muted:"#fcd34d" },
];

const FONT_TITLES = [
  { value:"'Pacifico', cursive",       label:"Pacifico" },
  { value:"'Caveat', cursive",         label:"Caveat" },
  { value:"'Playfair Display', serif", label:"Playfair" },
];

const DEF = {
  theme:"violet", fontTitle:"'Pacifico', cursive", fontBody:"'DM Sans', sans-serif",
  bg1:"#08060f", bg2:"#120d24", primary:"#7c3aed", card:"#1a1035", text:"#f0ecff", muted:"#9b8ec4",
  eventType:"✨ Estás invitado al cumple de", honoreeName:"Valentina", badgeEmoji:"🎂", badgeText:"5 añitos",
  coverPhoto:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  showBanner:true, bannerTitle:"La festejada", bannerPhoto:"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&w=400&q=80",
  showDate:true, dateText:"Sábado 24 de Octubre", showTime:true, timeText:"16:00 a 20:00 hs",
  showTheme:true, themeIcon:"🦕", themeLabel:"Temática", themeText:"Dinosaurios",
  showLocation:true, locationName:"Aventura Kids", locationAddress:"Av. San Martín 1234", showParking:true, parkingType:"🚘 Con estacionamiento",
  showItinerary:true, itinerary:[{ time:"16:00", title:"Bienvenida", sub:"Recepción" }],
  showMenu:true, menuItems:[{ emoji:"🍕", label:"Pizza" }],
  showDressCode:true, dressCodeIcon:"👗", dressCodeText:"Elegante sport",
  showGifts:true, giftIcon:"🎁", giftLabel:"Regalos", giftText:"Mesa de regalos", showGiftNote:true, giftNoteText:"Aportá a la mesa dulce",
  showGallery:false, galleryTitle:"Fotos", galleryPhotos:[],
  whatsappNumber:"5491123456789", whatsappMessage:"¡Hola! Confirmo mi asistencia 🎉",
};

// Función para limpiar nombres para la URL (Ej: "Aventura Kids" -> "aventura-kids")
const slugify = (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

/* ═══════════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════════ */
const Toast = ({ msg }) => (
  <div className="anim-pop" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", zIndex:999, background:"linear-gradient(135deg,#1e1040,#2d1760)", color:"white", padding:"12px 24px", borderRadius:99, fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 32px rgba(109,40,217,.4)" }}>
    <CheckCircle2 size={17} color="#86efac" />{msg}
  </div>
);
const Toggle = ({ checked, onChange }) => ( <label className="fd-toggle"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span className="fd-toggle-track" /></label> );
const Inp = ({ label, value, onChange, placeholder, type="text", multiline, rows=3 }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9b8ec4", marginBottom:6 }}>{label}</label>}
    {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="fd-input" style={{ width:"100%", padding:"10px 14px", borderRadius:14, background:"#faf8ff", resize:"vertical", fontSize:14 }} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="fd-input" style={{ width:"100%", padding:"10px 14px", borderRadius:14, background:"#faf8ff", fontSize:14 }} />}
  </div>
);

const EmojiPicker = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => { const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width:44, height:44, border:"1.5px solid #e5e3f5", borderRadius:12, background:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{value || "😀"}</button>
      {open && (<div className="anim-pop fd-sb" style={{ position:"absolute", top:50, left:0, zIndex:100, background:"white", border:"1.5px solid #e5e3f5", borderRadius:20, padding:12, width:260, maxHeight:200, overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.15)" }}><div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:4 }}>{EMOJIS.map((e,i) => (<button key={i} type="button" onClick={() => { onSelect(e); setOpen(false); }} style={{ width:28, height:28, fontSize:17, border:"none", background:"none", cursor:"pointer", borderRadius:8 }}>{e}</button>))}</div></div>)}
    </div>
  );
};
const Acc = ({ title, icon: Icon, iconColor="#7c3aed", children, defaultOpen=false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderRadius:20, marginBottom:10, overflow:"hidden", border:"1.5px solid #f0eeff", background:"white" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width:"100%", padding:"13px 16px", background: open ? "#faf8ff" : "white", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:32, height:32, borderRadius:10, background:`${iconColor}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={15} color={iconColor} /></div><span style={{ fontWeight:700, fontSize:14, color:"#1e1b40" }}>{title}</span></div>
        <ChevronDown size={17} style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform .3s", color:"#9b8ec4" }} />
      </button>
      <div className="acc-body" style={{ maxHeight: open ? 2000 : 0, opacity: open ? 1 : 0 }}><div style={{ padding:"4px 16px 16px" }}>{children}</div></div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   INVITE PREVIEW COMPONENT (Se usa en Editor y en Público)
═══════════════════════════════════════════════════════════ */
const InvitePreview = ({ cfg }) => {
  const th = THEMES.find(t => t.id === cfg.theme) || THEMES[0];
  const primary = cfg.primary || th.primary; const card = cfg.card || th.card; const text = cfg.text || th.text; const muted = cfg.muted || th.muted;
  const bg = `linear-gradient(180deg,${cfg.bg1||th.bg1} 0%,${cfg.bg2||th.bg2} 100%)`;

  const InfoCard = ({ icon:Icon, label, value, sub }) => (
    <div style={{ display:"flex", alignItems:"center", gap:14, background:card, border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"13px 15px", marginBottom:9 }}>
      <div style={{ width:46, height:46, borderRadius:15, background:primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon size={19} color="white" /></div>
      <div><div style={{ fontSize:9, letterSpacing:".15em", textTransform:"uppercase", fontWeight:700, color:muted, marginBottom:3 }}>{label}</div><div style={{ fontSize:15, fontWeight:700, color:text }}>{value}</div>{sub && <div style={{ fontSize:11, color:muted, marginTop:2 }}>{sub}</div>}</div>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <div style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", fontWeight:800, color:muted, margin:"24px 0 12px", display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }} />
      {children}
      <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }} />
    </div>
  );

  return (
    <div style={{ background:bg, minHeight:"100%", fontFamily:cfg.fontBody, color:text }}>
      <div style={{ position:"relative", height:270, overflow:"hidden" }}>
        <img src={cfg.coverPhoto} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top,${cfg.bg1||th.bg1} 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 22px", textAlign:"center" }}>
          <p style={{ fontSize:10, letterSpacing:".2em", textTransform:"uppercase", fontWeight:800, color:primary, marginBottom:8 }}>{cfg.eventType}</p>
          <h1 style={{ fontFamily:cfg.fontTitle, fontSize:42, lineHeight:1.05, margin:"0 0 12px" }}>{cfg.honoreeName}</h1>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.35)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,.15)", borderRadius:99, padding:"7px 18px", fontSize:13, fontWeight:800 }}>{cfg.badgeEmoji} {cfg.badgeText}</span>
        </div>
      </div>

      <div style={{ background:bg, borderRadius:"32px 32px 0 0", marginTop:-32, position:"relative", zIndex:2, padding:"22px 18px 40px", minHeight:500 }}>
        {cfg.showBanner && (
          <div style={{ position:"relative", borderRadius:22, overflow:"hidden", marginBottom:18, height:180, border:`2px solid ${primary}55` }}>
            <img src={cfg.bannerPhoto} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.8),transparent)" }} />
            <div style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,.55)", backdropFilter:"blur(6px)", borderRadius:99, padding:"3px 11px", fontSize:10, fontWeight:800, color:"white", textTransform:"uppercase" }}>{cfg.bannerTitle}</div>
            <div style={{ position:"absolute", bottom:0, padding:14 }}><p style={{ fontFamily:cfg.fontTitle, fontSize:26, color:"white", margin:0 }}>{cfg.honoreeName}</p></div>
          </div>
        )}
        {cfg.showDate && <InfoCard icon={Calendar} label="¿Cuándo?" value={cfg.dateText} />}
        {cfg.showTime && <InfoCard icon={Clock} label="Horario" value={cfg.timeText} />}
        {cfg.showTheme && <InfoCard icon={Star} label={cfg.themeLabel} value={`${cfg.themeIcon} ${cfg.themeText}`} />}
        
        {cfg.showLocation && (
          <div style={{ background:card, border:"1px solid rgba(255,255,255,.07)", borderRadius:20, overflow:"hidden", marginBottom:9 }}>
            <InfoCard icon={MapPin} label="¿Dónde?" value={cfg.locationName} sub={cfg.locationAddress} />
            <iframe style={{ width:"100%", height:145, display:"block", borderTop:`1px solid rgba(255,255,255,.06)`, border:"none" }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(cfg.locationName+" "+cfg.locationAddress)}&output=embed`} />
          </div>
        )}

        {/* ESTACIONAMIENTO */}
        {cfg.showLocation && cfg.showParking && (
          <div style={{ marginTop:12, marginBottom:16 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${primary}15`, border:`1px solid ${primary}35`, borderRadius:99, padding:"6px 14px", fontSize:11, fontWeight:700, color:primary }}>
              {cfg.parkingType}
            </span>
          </div>
        )}

        {/* ITINERARIO */}
        {cfg.showItinerary && cfg.itinerary.length > 0 && (
          <>
            <SectionTitle>Programa del día</SectionTitle>
            <div style={{ position:"relative", paddingLeft:22, marginBottom:16 }}>
              <div style={{ position:"absolute", left:6, top:6, bottom:6, width:2, background:primary, opacity:0.5, borderRadius:2 }} />
              {cfg.itinerary.map((item, i) => (
                <div key={i} style={{ position:"relative", marginBottom:16, display:"flex", gap:12 }}>
                  <div style={{ position:"absolute", left:-19, top:4, width:10, height:10, borderRadius:"50%", background:primary, boxShadow:`0 0 8px ${primary}` }} />
                  <span style={{ fontSize:11, fontWeight:800, color:primary, minWidth:44, marginTop:2 }}>{item.time}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:text }}>{item.title}</div>
                    {item.sub && <div style={{ fontSize:12, color:muted, marginTop:2 }}>{item.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MENÚ */}
        {cfg.showMenu && cfg.menuItems.length > 0 && (
          <>
            <SectionTitle>¿Qué vamos a comer?</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
              {cfg.menuItems.map((m, i) => (
                <div key={i} style={{ background:card, border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
                  <span style={{ fontSize:28, display:"block", marginBottom:4 }}>{m.emoji}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:text }}>{m.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DRESS CODE Y REGALOS */}
        {(cfg.showDressCode || cfg.showGifts) && (
          <>
            <SectionTitle>Información</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns: (cfg.showDressCode && cfg.showGifts) ? "1fr 1fr" : "1fr", gap:10, marginBottom:8 }}>
              {cfg.showDressCode && (
                <div style={{ background:card, border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"14px", textAlign:"center" }}>
                  <span style={{ fontSize:28, display:"block", marginBottom:4 }}>{cfg.dressCodeIcon}</span>
                  <div style={{ fontSize:9, fontWeight:700, color:muted, textTransform:"uppercase", letterSpacing:".1em" }}>Vestimenta</div>
                  <div style={{ fontSize:12, fontWeight:800, color:text, marginTop:4 }}>{cfg.dressCodeText}</div>
                </div>
              )}
              {cfg.showGifts && (
                <div style={{ background:card, border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"14px", textAlign:"center" }}>
                  <span style={{ fontSize:28, display:"block", marginBottom:4 }}>{cfg.giftIcon}</span>
                  <div style={{ fontSize:9, fontWeight:700, color:muted, textTransform:"uppercase", letterSpacing:".1em" }}>{cfg.giftLabel}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:text, marginTop:4 }}>{cfg.giftText}</div>
                </div>
              )}
            </div>
            {cfg.showGifts && cfg.showGiftNote && (
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <span style={{ display:"inline-flex", background:`${primary}15`, borderRadius:99, padding:"6px 14px", fontSize:11, fontWeight:700, color:primary }}>
                  {cfg.giftNoteText}
                </span>
              </div>
            )}
          </>
        )}

        {/* GALERÍA DE FOTOS */}
        {cfg.showGallery && cfg.galleryPhotos.length > 0 && (
          <>
            <SectionTitle>{cfg.galleryTitle}</SectionTitle>
            <div className="fd-sb" style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:12, margin:"0 -18px", padding:"0 18px 12px" }}>
              {cfg.galleryPhotos.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width:110, height:110, borderRadius:16, objectFit:"cover", flexShrink:0, border:"1px solid rgba(255,255,255,.07)" }} />
              ))}
            </div>
          </>
        )}

        <button onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage.replace('{nombre}', cfg.honoreeName))}`, '_blank')} 
          style={{ width:"100%", marginTop:18, padding:16, background:`linear-gradient(135deg,${primary},${primary}cc)`, color:"white", border:"none", borderRadius:20, fontFamily:cfg.fontBody||"'DM Sans',sans-serif", fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 8px 24px ${primary}50` }}>
          <CheckCircle2 size={19} /> Confirmar Asistencia (WhatsApp)
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   EDITOR SCREEN
═══════════════════════════════════════════════════════════ */
const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invData = invitations.find(i => i.id === id);

  if (!invData) return <Navigate to="/dashboard" />;

  const [title, setTitle] = useState(invData.title);
  const [cfg, setCfg] = useState(invData.config);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k,v) => setCfg(p => ({ ...p, [k]:v }));

  const handleImg = (e,key) => { const f = e.target.files[0]; if (f) set(key, URL.createObjectURL(f)); };

  const applyTh = th => setCfg(p => ({ ...p, theme:th.id, bg1:th.bg1, bg2:th.bg2, primary:th.primary, card:th.card, text:th.text, muted:th.muted }));

  const save = () => {
    setSaving(true);
    setTimeout(() => { onSave({ ...invData, title, config:cfg }); setSaving(false); setSaved(true); setTimeout(() => { setSaved(false); navigate("/dashboard"); }, 1000); }, 700);
  };

  const ImgUpload = ({ label, configKey }) => (
    <div style={{ marginBottom:12 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#9b8ec4", marginBottom:6 }}>{label}</label>}
      <label style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", border:"2px dashed #e5e3f5", borderRadius:14, cursor:"pointer", transition:"all .2s", background:"#faf8ff" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="#7c3aed"; e.currentTarget.style.background="#f8f4ff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e3f5"; e.currentTarget.style.background="#faf8ff"; }}>
        <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#ede9ff,#ddd6fe)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Upload size={14} color="#7c3aed" />
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:"#1e1b40" }}>Subir imagen</div>
          <div style={{ fontSize:11, color:"#9b8ec4" }}>JPG, PNG · máx 5MB</div>
        </div>
        <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleImg(e,configKey)} />
      </label>
    </div>
  );

  const FieldRow = ({ label, checked, onToggle, children }) => (
    <div style={{ paddingBottom:14, marginBottom:14, borderBottom:"1.5px solid #f0eeff" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: checked ? 10 : 0 }}>
        <span style={{ fontWeight:700, fontSize:14, color:"#1e1b40" }}>{label}</span>
        <Toggle checked={checked} onChange={onToggle} />
      </div>
      {checked && children}
    </div>
  );

  return (
    <div className="fd" style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      {/* TOP BAR */}
      <div style={{ height:58, background:"#0e0b1a", borderBottom:"1px solid rgba(167,139,250,.15)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px", flexShrink:0, boxShadow:"0 2px 20px rgba(0,0,0,.35)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => navigate("/dashboard")} className="fd-btn" style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 13px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:11, color:"#c4b5fd", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.1)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.06)"}
          ><ArrowLeft size={15} /> Volver</button>
          <div style={{ width:1, height:30, background:"rgba(255,255,255,.08)" }} />
          <div>
            <div style={{ fontSize:9, fontWeight:700, color:"#7c3aed", letterSpacing:".15em", textTransform:"uppercase", marginBottom:2 }}>Editando</div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              style={{ background:"none", border:"none", outline:"none", color:"white", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, width:200, padding:0 }} placeholder="Nombre del evento…" />
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", borderRadius:99, padding:"4px 11px" }}>
            <div className="anim-pulse" style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
            <span style={{ fontSize:10, color:"#22c55e", fontWeight:700 }}>LIVE</span>
          </div>
          <button onClick={save} disabled={saving} className="fd-btn" style={{
            padding:"8px 18px",
            background: saving ? "rgba(109,40,217,.4)" : saved ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#6d28d9,#8b5cf6)",
            color:"white", border:"none", borderRadius:13, fontFamily:"'DM Sans',sans-serif",
            fontWeight:700, fontSize:13, cursor: saving ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", gap:7, boxShadow: saving?"none":"0 4px 14px rgba(109,40,217,.4)", transition:"background .3s"
          }}>
            {saving ? <><span className="anim-spin" style={{ width:13, height:13, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"white", borderRadius:"50%", display:"inline-block" }} /> Guardando…</>
              : saved ? <><CheckCircle2 size={14} /> Guardado!</>
              : <><Save size={14} /> Guardar</>}
          </button>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* PANEL */}
        <div className="fd-sb" style={{ width:370, flexShrink:0, overflowY:"auto", background:"#faf8ff", borderRight:"1.5px solid #ede9ff", padding:14 }}>

          <Acc title="Paleta de Colores" icon={Palette} defaultOpen iconColor="#7c3aed">
            <div style={{ fontSize:11, fontWeight:700, color:"#9b8ec4", textTransform:"uppercase", letterSpacing:".08em", marginBottom:9 }}>Temas predefinidos</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:16 }}>
              {THEMES.map(th => (
                <button key={th.id} onClick={() => applyTh(th)} type="button" style={{
                  padding:"9px 5px", background: cfg.theme===th.id ? `${th.primary}20` : th.bg1,
                  border: cfg.theme===th.id ? `2px solid ${th.primary}` : "2px solid transparent",
                  borderRadius:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700, fontSize:11, color: cfg.theme===th.id ? th.primary : "white",
                  transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:4
                }}><span style={{ fontSize:17 }}>{th.emoji}</span>{th.name}</button>
              ))}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9b8ec4", textTransform:"uppercase", letterSpacing:".08em", marginBottom:9 }}>Colores personalizados</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:14 }}>
              {[["bg1","Fondo Superior"],["bg2","Fondo Inferior"],["primary","Acento"],["text","Textos"]].map(([k,l]) => (
                <div key={k}>
                  <div style={{ fontSize:11, color:"#9b8ec4", fontWeight:600, marginBottom:5 }}>{l}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0eeff", borderRadius:10, padding:"4px 9px" }}>
                    <input type="color" value={cfg[k]||"#000000"} onChange={e => set(k,e.target.value)}
                      style={{ width:26, height:26, border:"none", background:"none", cursor:"pointer", borderRadius:6, padding:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, color:"#6b5fa0", fontFamily:"monospace" }}>{(cfg[k]||"#000000").toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9b8ec4", textTransform:"uppercase", letterSpacing:".08em", marginBottom:9 }}>Fuente de títulos</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
              {FONT_TITLES.map(f => (
                <button key={f.value} onClick={() => set("fontTitle",f.value)} type="button" style={{
                  padding:"10px 10px", background: cfg.fontTitle===f.value ? "#f3f0ff" : "white",
                  border: cfg.fontTitle===f.value ? "2px solid #7c3aed" : "2px solid #e5e3f5",
                  borderRadius:12, cursor:"pointer", fontFamily:f.value, fontSize:14,
                  color: cfg.fontTitle===f.value ? "#7c3aed" : "#1e1b40",
                  fontWeight:600, transition:"all .2s", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                }}>{f.label}</button>
              ))}
            </div>
          </Acc>

          <Acc title="Textos de Portada" icon={Type} iconColor="#0d9488">
            <Inp label="Subtítulo del evento" value={cfg.eventType} onChange={v => set("eventType",v)} placeholder="✨ Estás invitado al cumple de" />
            <Inp label="Nombre del agasajado" value={cfg.honoreeName} onChange={v => set("honoreeName",v)} />
            <div style={{ display:"flex", gap:9, marginBottom:4 }}>
              <div><label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#9b8ec4", marginBottom:6 }}>Emoji</label>
                <EmojiPicker value={cfg.badgeEmoji} onSelect={v => set("badgeEmoji",v)} /></div>
              <div style={{ flex:1 }}><Inp label="Texto emblema" value={cfg.badgeText} onChange={v => set("badgeText",v)} placeholder="5 añitos" /></div>
            </div>
            <ImgUpload label="Foto de portada" configKey="coverPhoto" />
          </Acc>

          <Acc title="Banner Secundario" icon={ImageIcon} iconColor="#d97706">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: cfg.showBanner ? 12 : 0, padding:"7px 11px", background:"#faf8ff", borderRadius:11 }}>
              <span style={{ fontWeight:700, fontSize:14, color:"#1e1b40" }}>Mostrar Banner</span>
              <Toggle checked={cfg.showBanner} onChange={v => set("showBanner",v)} />
            </div>
            {cfg.showBanner && (<>
              <Inp label="Título" value={cfg.bannerTitle} onChange={v => set("bannerTitle",v)} />
              <ImgUpload label="Foto del banner" configKey="bannerPhoto" />
            </>)}
          </Acc>

          <Acc title="Datos del Evento" icon={Calendar} iconColor="#e11d48">
            <FieldRow label="📅 Fecha" checked={cfg.showDate} onToggle={v => set("showDate",v)}>
              <Inp value={cfg.dateText} onChange={v => set("dateText",v)} placeholder="Sábado 24 de Octubre" />
            </FieldRow>
            <FieldRow label="⏰ Horario" checked={cfg.showTime} onToggle={v => set("showTime",v)}>
              <Inp value={cfg.timeText} onChange={v => set("timeText",v)} placeholder="16:00 a 20:00 hs" />
            </FieldRow>
            <FieldRow label="✨ Temática" checked={cfg.showTheme} onToggle={v => set("showTheme",v)}>
              <div style={{ display:"flex", gap:8 }}>
                <EmojiPicker value={cfg.themeIcon} onSelect={v => set("themeIcon",v)} />
                <div style={{ flex:1 }}><Inp value={cfg.themeLabel} onChange={v => set("themeLabel",v)} placeholder="Temática" /></div>
              </div>
              <Inp value={cfg.themeText} onChange={v => set("themeText",v)} placeholder="Dinosaurios" />
            </FieldRow>
          </Acc>

          <Acc title="Ubicación y Mapa" icon={MapPin} iconColor="#0284c7">
            <FieldRow label="📍 Mostrar Ubicación" checked={cfg.showLocation} onToggle={v => set("showLocation",v)}>
              <Inp label="Nombre del lugar" value={cfg.locationName} onChange={v => set("locationName",v)} placeholder="Aventura Kids" />
              <Inp label="Dirección GPS" value={cfg.locationAddress} onChange={v => set("locationAddress",v)} placeholder="Av. San Martín 1234" />
            </FieldRow>
            <FieldRow label="🚘 Estacionamiento" checked={cfg.showParking} onToggle={v => set("showParking",v)}>
              <select value={cfg.parkingType} onChange={e => set("parkingType",e.target.value)} className="fd-input" style={{ width:"100%", padding:"10px 14px", borderRadius:14, background:"#faf8ff", fontSize:14, fontFamily:"'DM Sans',sans-serif", border:"1.5px solid #e5e3f5", outline:"none" }}>
                <option value="🚘 Con estacionamiento interno gratuito">Con estacionamiento interno gratuito</option>
                <option value="🅿️ Estacionamiento medido en la zona">Estacionamiento medido en la zona</option>
                <option value="🚶‍♂️ Sin estacionamiento (venir con tiempo)">Sin estacionamiento (venir con tiempo)</option>
                <option value="Valet Parking disponible">Valet Parking disponible</option>
              </select>
            </FieldRow>
          </Acc>

          <Acc title="Programa del Día" icon={Clock} iconColor="#ca8a04">
            <FieldRow label="Activar Itinerario" checked={cfg.showItinerary} onToggle={v => set("showItinerary",v)}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cfg.itinerary.map((item, idx) => (
                  <div key={idx} style={{ display:"flex", gap:8, background:"#faf8ff", padding:10, borderRadius:14, border:"1px solid #f0eeff" }}>
                    <input type="text" value={item.time} onChange={e => { const newArr=[...cfg.itinerary]; newArr[idx].time=e.target.value; set("itinerary",newArr); }} className="fd-input" style={{ width:66, padding:"8px", borderRadius:10, textAlign:"center", fontSize:13 }} placeholder="16:00" />
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                      <input type="text" value={item.title} onChange={e => { const newArr=[...cfg.itinerary]; newArr[idx].title=e.target.value; set("itinerary",newArr); }} className="fd-input" style={{ width:"100%", padding:"8px", borderRadius:10, fontSize:13, fontWeight:600 }} placeholder="Título" />
                      <input type="text" value={item.sub} onChange={e => { const newArr=[...cfg.itinerary]; newArr[idx].sub=e.target.value; set("itinerary",newArr); }} className="fd-input" style={{ width:"100%", padding:"8px", borderRadius:10, fontSize:12 }} placeholder="Descripción (opcional)" />
                    </div>
                    <button onClick={() => set("itinerary", cfg.itinerary.filter((_,i)=>i!==idx))} style={{ background:"#fee2e2", color:"#ef4444", border:"none", borderRadius:10, padding:"0 10px", cursor:"pointer" }}><Trash2 size={14}/></button>
                  </div>
                ))}
                <button onClick={() => set("itinerary", [...cfg.itinerary, { time:"00:00", title:"Nuevo evento", sub:"" }])} style={{ background:"white", border:"1.5px dashed #c4b5fd", color:"#7c3aed", borderRadius:14, padding:"10px", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Plus size={14}/> Agregar evento</button>
              </div>
            </FieldRow>
          </Acc>

          <Acc title="¿Qué vamos a comer?" icon={List} iconColor="#10b981">
            <FieldRow label="Activar Menú" checked={cfg.showMenu} onToggle={v => set("showMenu",v)}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cfg.menuItems.map((item, idx) => (
                  <div key={idx} style={{ display:"flex", alignItems:"center", gap:8, background:"#faf8ff", padding:10, borderRadius:14, border:"1px solid #f0eeff" }}>
                    <EmojiPicker value={item.emoji} onSelect={e => { const newArr=[...cfg.menuItems]; newArr[idx].emoji=e; set("menuItems",newArr); }} />
                    <input type="text" value={item.label} onChange={e => { const newArr=[...cfg.menuItems]; newArr[idx].label=e.target.value; set("menuItems",newArr); }} className="fd-input" style={{ flex:1, padding:"10px 14px", borderRadius:12, fontSize:13 }} placeholder="Nombre comida" />
                    <button onClick={() => set("menuItems", cfg.menuItems.filter((_,i)=>i!==idx))} style={{ background:"#fee2e2", color:"#ef4444", border:"none", borderRadius:10, padding:"10px", cursor:"pointer" }}><Trash2 size={16}/></button>
                  </div>
                ))}
                <button onClick={() => set("menuItems", [...cfg.menuItems, { emoji:"🍕", label:"Opción" }])} style={{ background:"white", border:"1.5px dashed #c4b5fd", color:"#7c3aed", borderRadius:14, padding:"10px", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Plus size={14}/> Agregar opción</button>
              </div>
            </FieldRow>
          </Acc>

          <Acc title="Dress Code y Regalos" icon={Layout} iconColor="#f43f5e">
            <FieldRow label="👗 Vestimenta" checked={cfg.showDressCode} onToggle={v => set("showDressCode",v)}>
              <div style={{ display:"flex", gap:8 }}>
                <EmojiPicker value={cfg.dressCodeIcon} onSelect={e => set("dressCodeIcon",e)} />
                <div style={{ flex:1 }}><Inp value={cfg.dressCodeText} onChange={v => set("dressCodeText",v)} placeholder="Ej: Elegante sport" /></div>
              </div>
            </FieldRow>
            <FieldRow label="🎁 Regalos" checked={cfg.showGifts} onToggle={v => set("showGifts",v)}>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <EmojiPicker value={cfg.giftIcon} onSelect={e => set("giftIcon",e)} />
                <div style={{ width:90 }}><Inp value={cfg.giftLabel} onChange={v => set("giftLabel",v)} placeholder="Título" /></div>
                <div style={{ flex:1 }}>
                  <select value={cfg.giftText} onChange={e => set("giftText",e.target.value)} className="fd-input" style={{ width:"100%", padding:"10px 8px", borderRadius:14, background:"#faf8ff", fontSize:13, fontFamily:"'DM Sans',sans-serif", height:44 }}>
                    <option value="Mesa de regalos">Mesa de regalos</option>
                    <option value="Sobres o Buzón">Sobres o Buzón</option>
                    <option value="Transferencia bancaria">Transferencia bancaria</option>
                    <option value="Solo tu presencia">Solo tu presencia</option>
                    <option value="Aportá a la mesa dulce">Aportá a la mesa dulce</option>
                  </select>
                </div>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, fontWeight:700, color:"#1e1b40", marginBottom:8, cursor:"pointer" }}>
                <input type="checkbox" checked={cfg.showGiftNote} onChange={e => set("showGiftNote", e.target.checked)} /> Mostrar nota aclaratoria
              </label>
              {cfg.showGiftNote && <Inp value={cfg.giftNoteText} onChange={v => set("giftNoteText",v)} placeholder="Ej: No traer regalos grandes" multiline rows={2} />}
            </FieldRow>
          </Acc>

          <Acc title="Galería de Fotos" icon={ImageIcon} iconColor="#ec4899">
            <FieldRow label="📸 Mostrar Galería" checked={cfg.showGallery} onToggle={v => set("showGallery",v)}>
              <Inp label="Título de sección" value={cfg.galleryTitle} onChange={v => set("galleryTitle",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {cfg.galleryPhotos.map((p,i) => (
                  <div key={i} style={{ position:"relative", borderRadius:12, overflow:"hidden", height:80 }}>
                    <img src={p} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <button onClick={() => set("galleryPhotos", cfg.galleryPhotos.filter((_,idx)=>idx!==i))} style={{ position:"absolute", top:4, right:4, background:"#ef4444", color:"white", border:"none", borderRadius:6, padding:4, cursor:"pointer" }}><Trash2 size={12}/></button>
                  </div>
                ))}
                <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:80, border:"2px dashed #e5e3f5", borderRadius:12, cursor:"pointer", background:"#faf8ff", color:"#9b8ec4", transition:"border .2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor="#7c3aed"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e5e3f5"}>
                  <Upload size={18} style={{ marginBottom:4 }} />
                  <span style={{ fontSize:11, fontWeight:700 }}>Añadir foto</span>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if(f) set("galleryPhotos", [...cfg.galleryPhotos, URL.createObjectURL(f)]); }} />
                </label>
              </div>
            </FieldRow>
          </Acc>

          <Acc title="WhatsApp RSVP" icon={CheckCircle2} iconColor="#22c55e">
            <Inp label="Número (sin +)" value={cfg.whatsappNumber} onChange={v => set("whatsappNumber",v)} />
            <Inp label="Mensaje" value={cfg.whatsappMessage} onChange={v => set("whatsappMessage",v)} multiline rows={3} />
          </Acc>
        </div>

        {/* PREVIEW */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#1a1635", padding:30, overflow:"hidden", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, opacity:.07, backgroundImage:"radial-gradient(circle,rgba(167,139,250,.8) 1px,transparent 1px)", backgroundSize:"26px 26px" }} />
          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#6b5fa0", fontSize:12, fontWeight:700 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#a78bfa" }} />
              Vista previa del invitado
            </div>
            <div className="invite-phone">
              {/* notch */}
              <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:110, height:30, background:"#1a1a2e", zIndex:10, borderRadius:"0 0 18px 18px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#0d0d1a", border:"2px solid #2a2a4e" }} />
              </div>
              <div className="invite-scroll" style={{ paddingTop:30 }}>
                <InvitePreview cfg={cfg} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   SCREENS (Rutas)
═══════════════════════════════════════════════════════════ */

// --- RUTA PÚBLICA (Invitados) ---
const PublicInviteScreen = ({ invitations }) => {
  const { salonSlug, invId } = useParams(); // Obtenemos las variables de la URL
  
  // Buscamos la invitación en nuestra "base de datos"
  const inv = invitations.find(i => i.id === invId);

  if (!inv) {
    return <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#111", color:"white" }}><h2>Invitación no encontrada 😕</h2></div>;
  }

  // Si existe, mostramos la tarjeta a PANTALLA COMPLETA
  return (
    <div className="guest-view-wrapper">
      <div className="guest-mobile-container">
        {/* Usamos el mismo componente Preview pero nativo sin el celular falso */}
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};


// --- RUTA: LOGIN ---
const LoginScreen = ({ onLogin }) => {
  const [user, setUser] = useState(""); const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    if (user === "admin" && pass === "admin") {
      onLogin({ name:"Aventura Kids", role:"admin" });
      navigate("/dashboard"); // Redireccionamos con React Router
    } else { alert("Usuario/Clave incorrectos (admin/admin)"); }
  };

  return (
    <div className="fd noise-overlay" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#08060f" }}>
      <div style={{ width:"100%", maxWidth:420, padding:20 }}>
        <div className="anim-up" style={{ textAlign:"center", marginBottom:32 }}>
          <div className="anim-float anim-glow" style={{ width:88, height:88, borderRadius:28, margin:"0 auto 24px", background:"linear-gradient(135deg,#6d28d9,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}><PartyPopper size={42} color="white" /></div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:40, color:"white", margin:"0 0 6px" }}>Fiesta<span className="shimmer-text">Digital</span></h1>
        </div>
        <div className="anim-up-1 glass" style={{ borderRadius:28, padding:32 }}>
          <form onSubmit={submit}>
            <Inp label="Usuario" value={user} onChange={setUser} placeholder="admin" />
            <Inp label="Contraseña" type="password" value={pass} onChange={setPass} placeholder="admin" />
            <button type="submit" className="fd-btn" style={{ width:"100%", marginTop:16, padding:15, background:"linear-gradient(135deg,#6d28d9,#8b5cf6)", color:"white", border:"none", borderRadius:18, fontWeight:700, fontSize:16 }}><Sparkles size={17} style={{display:'inline', verticalAlign:'text-bottom'}}/> Ingresar al Panel</button>
          </form>
        </div>
      </div>
    </div>
  );
};


// --- RUTA: DASHBOARD ---
const DashboardScreen = ({ user, invitations, onCreateNew, onLogout }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  if (!user) return <Navigate to="/" />; // Protección de ruta

  const handleCreate = () => {
    const newId = onCreateNew();
    navigate(`/editor/${newId}`); // Redirige al editor nuevo
  };

  const copy = id => { 
    // Ahora armamos la URL real usando el slug del salón
    const url = `${window.location.origin}/i/${slugify(user.name)}/${id}`;
    navigator.clipboard.writeText(url); 
    setToast("¡Link copiado!"); 
    setTimeout(() => setToast(""), 2000); 
  };

  return (
    <div className="fd" style={{ minHeight:"100vh", background:"#f5f3ff" }}>
      <nav style={{ background:"white", borderBottom:"1.5px solid #ede9ff", padding:"0 28px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#1e1b40" }}>Fiesta<span style={{ color:"#7c3aed" }}>Digital</span></span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>{user.name}</span>
          <button onClick={() => { onLogout(); navigate("/"); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444" }}><LogOut size={18}/></button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:36 }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:34, color:"#1e1b40", margin:0 }}>Mis Invitaciones</h1>
          <button onClick={handleCreate} className="fd-btn" style={{ background:"linear-gradient(135deg,#6d28d9,#8b5cf6)", color:"white", border:"none", borderRadius:18, padding:"10px 20px", fontWeight:700 }}><Plus size={16} style={{display:'inline', verticalAlign:'text-bottom'}}/> Nueva Invitación</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:18 }}>
          {invitations.map(inv => (
            <div key={inv.id} className="fd-hover" style={{ background:"white", borderRadius:24, border:"1.5px solid #ede9ff", overflow:"hidden" }}>
              <div style={{ height:140, position:"relative" }}><img src={inv.config.coverPhoto} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
              <div style={{ padding:16 }}>
                <h3 style={{ margin:"0 0 10px" }}>{inv.title}</h3>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => navigate(`/editor/${inv.id}`)} className="fd-btn" style={{ flex:1, background:"#1e1b40", color:"white", border:"none", borderRadius:12, padding:10 }}><Edit2 size={14}/> Editar</button>
                  <button onClick={() => copy(inv.id)} style={{ width:40, border:"1.5px solid #ede9ff", background:"white", borderRadius:12, cursor:"pointer" }}><Copy size={16} color="#7c3aed" /></button>
                  <button onClick={() => window.open(`/i/${slugify(user.name)}/${inv.id}`, '_blank')} style={{ width:40, border:"1.5px solid #ede9ff", background:"white", borderRadius:12, cursor:"pointer" }}><ExternalLink size={16} color="#7c3aed"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   APP ROUTER WAPPER
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  
  // Estado "Global" de invitaciones (simulando Base de Datos)
  const [invitations, setInvitations] = useState([
    { id:"cumple-123", title:"Cumple de Valentina", config:{ ...DEF } }
  ]);

  const handleCreateNew = () => {
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    setInvitations(prev => [...prev, { id: newId, title: "Nuevo Evento", config: { ...DEF } }]);
    return newId;
  };

  const handleSave = (updatedData) => {
    setInvitations(prev => prev.map(inv => inv.id === updatedData.id ? updatedData : inv));
  };

  return (
    <Router>
      <Routes>
        {/* Rutas Privadas del SaaS (Administración) */}
        <Route path="/" element={<LoginScreen onLogin={setUser} />} />
        
        <Route path="/dashboard" element={
          <DashboardScreen user={user} invitations={invitations} onCreateNew={handleCreateNew} onLogout={() => setUser(null)} onUpdateUser={setUser} />
        } />
        
        <Route path="/editor/:id" element={
          <EditorScreen invitations={invitations} onSave={handleSave} />
        } />

        {/* 🌟 RUTA PÚBLICA (El invitado entra por acá) 🌟 */}
        <Route path="/i/:salonSlug/:invId" element={
          <PublicInviteScreen invitations={invitations} />
        } />
        
      </Routes>
    </Router>
  );
}