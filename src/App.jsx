import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import {
  MapPin, Clock, Calendar, Palette, CheckCircle2, PartyPopper,
  ChevronDown, Plus, Upload, Type, LogOut, Edit2,
  Copy, ExternalLink, ArrowLeft, Save, Mail, Lock, Key, X,
  Sparkles, Star, Image as ImageIcon, Layout, List, Trash2, UserPlus, Users, Settings, BarChart3
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ESTILOS GLOBALES
═══════════════════════════════════════════════════════════ */
(() => {
  if (document.getElementById("fd-global")) return;
  const s = document.createElement("style");
  s.id = "fd-global";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    body { margin: 0; padding: 0; background: #f8f7ff; }
    .fd{font-family:'DM Sans',sans-serif}
    .fd-sb::-webkit-scrollbar{width:4px;height:4px}
    .fd-sb::-webkit-scrollbar-track{background:transparent}
    .fd-sb::-webkit-scrollbar-thumb{background:#d8d4ff;border-radius:99px}
    @keyframes fdUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
    @keyframes fdPop{from{opacity:0;transform:scale(.93) translateY(8px)}to{opacity:1;transform:none}}
    .anim-up{animation:fdUp .5s cubic-bezier(.22,1,.36,1) both}
    .anim-pop{animation:fdPop .38s cubic-bezier(.22,1,.36,1) both}
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
    .guest-view-wrapper { width: 100%; min-height: 100vh; background: #000; display: flex; justify-content: center; }
    .guest-mobile-container { width: 100%; max-width: 480px; min-height: 100vh; background: white; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .shimmer-text { background: linear-gradient(90deg, #fff, #a78bfa, #fff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
    @keyframes shimmer { to { background-position: 200% center; } }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & DEFAULTS
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

const slugify = (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

/* ═══════════════════════════════════════════════════════════
   MICRO COMPONENTES
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
   VISTA DE INVITACIÓN (PREVIEW)
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
        <button onClick={() => window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage.replace('{nombre}', cfg.honoreeName))}`, '_blank')} 
          style={{ width:"100%", marginTop:18, padding:16, background:`linear-gradient(135deg,${primary},${primary}cc)`, color:"white", border:"none", borderRadius:20, fontFamily:cfg.fontBody, fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <CheckCircle2 size={19} /> Confirmar Asistencia
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PANTALLAS (VISTAS)
═══════════════════════════════════════════════════════════ */

// --- LOGIN ---
const LoginScreen = ({ onLogin, users }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const found = users.find(u => u.email === email && u.pass === pass);
    if (found) {
      onLogin(found);
      navigate("/dashboard");
    } else { alert("Credenciales incorrectas."); }
  };

  return (
    <div className="fd" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#08060f" }}>
      <div style={{ width:"100%", maxWidth:400, padding:20 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
           <div style={{ width:80, height:80, borderRadius:24, background:"linear-gradient(135deg,#6d28d9,#8b5cf6)", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center" }}><PartyPopper size={40} color="white" /></div>
           <h1 style={{ color:"white", fontFamily:"Syne", fontWeight:800, fontSize:32 }}>Fiesta<span style={{ color:"#a78bfa" }}>Digital</span></h1>
        </div>
        <div className="glass" style={{ padding:32, borderRadius:28 }}>
          <form onSubmit={handleSubmit}>
            <Inp label="Email" value={email} onChange={setEmail} placeholder="admin@ejemplo.com" />
            <Inp label="Contraseña" type="password" value={pass} onChange={setPass} placeholder="••••••" />
            <button type="submit" className="fd-btn" style={{ width:"100%", marginTop:10, padding:15, background:"#7c3aed", color:"white", border:"none", borderRadius:16, fontWeight:700, fontSize:16 }}>Ingresar</button>
          </form>
          <div style={{ marginTop:20, textAlign:"center", color:"#9b8ec4", fontSize:12 }}>
            <p>Demo Admin: <b>admin@admin.com</b> / <b>admin</b></p>
            <p>Owner Panel: <b>owner@fiestadigital.com</b> / <b>owner123</b></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD (SALÓN O DUEÑO) ---
const DashboardScreen = ({ user, users, invitations, onCreateNew, onRegister, onLogout }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSalon, setNewSalon] = useState({ name:"", email:"", pass:"" });

  if (!user) return <Navigate to="/" />;

  const isOwner = user.role === "owner";
  const myInvitations = isOwner ? invitations : invitations.filter(inv => inv.salonId === user.email);
  const salonUsers = users.filter(u => u.role === "salon");

  const handleCreateSalon = (e) => {
    e.preventDefault();
    onRegister({ ...newSalon, role:"salon" });
    setShowModal(false);
    setNewSalon({ name:"", email:"", pass:"" });
    setToast("Salón creado con éxito");
    setTimeout(() => setToast(""), 2000);
  };

  const copy = id => {
    const url = `${window.location.origin}/i/${slugify(user.name)}/${id}`;
    const el = document.createElement('textarea'); el.value = url; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    setToast("Link copiado!"); setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="fd" style={{ minHeight:"100vh", background:"#f5f3ff" }}>
      <nav style={{ background:"white", borderBottom:"1px solid #ede9ff", padding:"0 20px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <span style={{ fontFamily:"Syne", fontWeight:800, fontSize:20 }}>Fiesta<span style={{ color:"#7c3aed" }}>Digital</span></span>
        <div style={{ display:"flex", alignItems:"center", gap:15 }}>
          <span style={{ fontWeight:700, fontSize:13 }}>{user.name} {isOwner && "👑"}</span>
          <button onClick={() => { onLogout(); navigate("/"); }} style={{ background:"#fee2e2", border:"none", padding:8, borderRadius:10, color:"#ef4444", cursor:"pointer" }}><LogOut size={18}/></button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px" }}>
        
        {isOwner ? (
          /* VISTA DEL DUEÑO (OSWALDO) */
          <div className="anim-up">
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:30 }}>
              <h1 style={{ margin:0, fontFamily:"Syne", fontWeight:800 }}>Panel Maestro</h1>
              <button onClick={() => setShowModal(true)} style={{ background:"#7c3aed", color:"white", border:"none", padding:"10px 20px", borderRadius:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}><UserPlus size={18}/> Crear Nuevo Salón</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:20, marginBottom:40 }}>
               <div style={{ background:"white", padding:20, borderRadius:24, border:"1px solid #ede9ff" }}>
                  <div style={{ color:"#7c3aed", marginBottom:10 }}><Users size={24}/></div>
                  <div style={{ fontSize:24, fontWeight:800 }}>{salonUsers.length}</div>
                  <div style={{ fontSize:13, color:"#9b8ec4", fontWeight:600 }}>Salones registrados</div>
               </div>
               <div style={{ background:"white", padding:20, borderRadius:24, border:"1px solid #ede9ff" }}>
                  <div style={{ color:"#0d9488", marginBottom:10 }}><PartyPopper size={24}/></div>
                  <div style={{ fontSize:24, fontWeight:800 }}>{invitations.length}</div>
                  <div style={{ fontSize:13, color:"#9b8ec4", fontWeight:600 }}>Invitaciones totales</div>
               </div>
            </div>

            <h2 style={{ fontSize:18, marginBottom:15 }}>Salones Activos</h2>
            <div style={{ background:"white", borderRadius:24, border:"1px solid #ede9ff", overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
                <thead style={{ background:"#faf8ff", borderBottom:"1px solid #ede9ff" }}>
                  <tr>
                    <th style={{ textAlign:"left", padding:15 }}>Nombre</th>
                    <th style={{ textAlign:"left", padding:15 }}>Email</th>
                    <th style={{ textAlign:"left", padding:15 }}>Eventos</th>
                    <th style={{ textAlign:"right", padding:15 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {salonUsers.map(s => (
                    <tr key={s.email} style={{ borderBottom:"1px solid #f0eeff" }}>
                      <td style={{ padding:15, fontWeight:700 }}>{s.name}</td>
                      <td style={{ padding:15, color:"#9b8ec4" }}>{s.email}</td>
                      <td style={{ padding:15 }}>{invitations.filter(i => i.salonId === s.email).length}</td>
                      <td style={{ padding:15, textAlign:"right" }}>
                         <button style={{ background:"#f5f3ff", border:"none", padding:6, borderRadius:8, color:"#7c3aed", cursor:"pointer" }} title="Configurar"><Settings size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* VISTA DEL SALÓN (CLIENTE) */
          <div className="anim-up">
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:30 }}>
              <h1 style={{ margin:0, fontFamily:"Syne", fontWeight:800 }}>Mis Invitaciones</h1>
              <button onClick={() => navigate(`/editor/${onCreateNew(user.email)}`)} style={{ background:"#7c3aed", color:"white", border:"none", padding:"10px 20px", borderRadius:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}><Plus size={18}/> Nueva Invitación</button>
            </div>
            
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {myInvitations.map(inv => (
                <div key={inv.id} className="fd-hover" style={{ background:"white", borderRadius:24, border:"1px solid #ede9ff", overflow:"hidden" }}>
                   <div style={{ height:140 }}><img src={inv.config.coverPhoto} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
                   <div style={{ padding:15 }}>
                      <h3 style={{ margin:"0 0 10px", fontSize:16 }}>{inv.title}</h3>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => navigate(`/editor/${inv.id}`)} style={{ flex:1, background:"#1e1b40", color:"white", border:"none", padding:10, borderRadius:12, fontWeight:700, cursor:"pointer" }}>Editar</button>
                        <button onClick={() => copy(inv.id)} style={{ width:40, border:"1px solid #ede9ff", borderRadius:12, cursor:"pointer" }}><Copy size={16}/></button>
                        <button onClick={() => window.open(`/i/${slugify(user.name)}/${inv.id}`)} style={{ width:40, border:"1.5px solid #ede9ff", borderRadius:12, cursor:"pointer" }}><ExternalLink size={16}/></button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL PARA CREAR SALÓN (Sólo para el Owner) */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
           <div className="anim-pop" style={{ background:"white", width:"90%", maxWidth:400, borderRadius:28, padding:30 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                 <h2 style={{ margin:0, fontSize:20 }}>Nuevo Salón</h2>
                 <button onClick={() => setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X/></button>
              </div>
              <form onSubmit={handleCreateSalon}>
                 <Inp label="Nombre del Salón" value={newSalon.name} onChange={v => setNewSalon({...newSalon, name:v})} placeholder="Ej: Salón Las Palmeras" />
                 <Inp label="Email de Acceso" value={newSalon.email} onChange={v => setNewSalon({...newSalon, email:v})} placeholder="salon@mail.com" />
                 <Inp label="Contraseña Temporal" value={newSalon.pass} onChange={v => setNewSalon({...newSalon, pass:v})} placeholder="123456" />
                 <button type="submit" style={{ width:"100%", marginTop:10, padding:15, background:"#7c3aed", color:"white", border:"none", borderRadius:16, fontWeight:700 }}>Confirmar y Crear</button>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};

// --- EDITOR & PUBLICO ---
const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams(); const navigate = useNavigate();
  const inv = invitations.find(i => i.id === id);
  if (!inv) return <Navigate to="/dashboard" />;
  const [title, setTitle] = useState(inv.title);
  const [cfg, setCfg] = useState(inv.config);
  return (
    <div className="fd" style={{ height:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ height:58, background:"#0e0b1a", color:"white", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", padding:"6px 12px", borderRadius:8, cursor:"pointer" }}><ArrowLeft size={14}/></button>
        <input value={title} onChange={e => setTitle(e.target.value)} style={{ background:"none", border:"none", color:"white", fontWeight:700, textAlign:"center", outline:"none" }} />
        <button onClick={() => { onSave({...inv, title, config:cfg}); navigate("/dashboard"); }} style={{ background:"#7c3aed", border:"none", color:"white", padding:"8px 16px", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Guardar</button>
      </div>
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div className="fd-sb" style={{ width:350, overflowY:"auto", padding:20, background:"white", borderRight:"1px solid #ede9ff" }}>
          <Acc title="Datos Generales" icon={Type} defaultOpen>
            <Inp label="Nombre" value={cfg.honoreeName} onChange={v => setCfg({...cfg, honoreeName:v})} />
            <Inp label="Fecha" value={cfg.dateText} onChange={v => setCfg({...cfg, dateText:v})} />
          </Acc>
          <Acc title="Colores" icon={Palette}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setCfg({...cfg, theme:th.id, ...th})} style={{ padding:10, borderRadius:12, border: cfg.theme === th.id ? "2px solid #7c3aed" : "1px solid #ede9ff", background:"white", cursor:"pointer" }}>{th.emoji} {th.name}</button>
              ))}
            </div>
          </Acc>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#1a1635" }}>
           <div className="invite-phone"><div className="invite-scroll"><InvitePreview cfg={cfg} /></div></div>
        </div>
      </div>
    </div>
  );
};

const PublicInviteScreen = ({ invitations }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  if (!inv) return <div style={{ textAlign:"center", padding:50 }}>Invitación no encontrada</div>;
  return (<div className="guest-view-wrapper"><div className="guest-mobile-container"><InvitePreview cfg={inv.config} /></div></div>);
};

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    { name:"Oswaldo (Dueño)", email:"owner@fiestadigital.com", pass:"owner123", role:"owner" },
    { name:"Aventura Kids", email:"admin@admin.com", pass:"admin", role:"salon" }
  ]);
  const [invitations, setInvitations] = useState([
    { id:"demo-1", salonId:"admin@admin.com", title:"Cumple de Valentina", config:{ ...DEF } }
  ]);

  const handleRegister = (newUser) => setUsers(prev => [...prev, newUser]);
  const handleSave = (updated) => setInvitations(prev => prev.map(i => i.id === updated.id ? updated : i));
  const handleCreate = (salonId) => {
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    setInvitations(prev => [...prev, { id: newId, salonId, title: "Nuevo Evento", config: { ...DEF } }]);
    return newId;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen onLogin={setUser} users={users} />} />
        <Route path="/dashboard" element={<DashboardScreen user={user} users={users} invitations={invitations} onCreateNew={handleCreate} onRegister={handleRegister} onLogout={() => setUser(null)} />} />
        <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSave} />} />
        <Route path="/i/:salonSlug/:invId" element={<PublicInviteScreen invitations={invitations} />} />
      </Routes>
    </Router>
  );
}
