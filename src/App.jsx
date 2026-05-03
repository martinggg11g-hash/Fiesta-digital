import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { EditorScreen, InvitePreview, DEF_CONFIG } from "./Editor";
import { OpeningAnimation } from "./Lotties";
import { supabase } from "./supabase"; 
import {
  PartyPopper, ShieldCheck, AlertCircle, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X, MessageCircle, ExternalLink, Eye, Search,
  ChevronDown, Phone, Users, Utensils, Music, CreditCard, Clock, Settings, UserCheck, Calculator, Receipt,
  Moon, Sun, Printer, ClipboardList, ImageIcon, FileText
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

const formatDate = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  return dateStr;
};

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10 anim-pop">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null, prefix=null, isDark=false }) => {
  const [localVal, setLocalVal] = useState(value || "");
  const isFocused = useRef(false);

  useEffect(() => { if (!isFocused.current) setLocalVal(value || ""); }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localVal !== (value || "")) onChange(localVal);
    }, 400);
    return () => clearTimeout(timeout);
  }, [localVal, onChange, value]);

  const handleBlur = () => {
    isFocused.current = false;
    if (localVal !== (value || "")) onChange(localVal);
  };

  const bgClass = isDark ? "bg-slate-700 border-slate-600 text-white focus:bg-slate-600" : "bg-gray-50 border-gray-200 text-slate-800 focus:bg-white";
  const labelClass = isDark ? "text-slate-400" : "text-slate-500";
  
  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${labelClass}`}>{label}</label>}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
        {prefix && <span className="absolute left-4 text-slate-400 font-bold">{prefix}</span>}
        {multiline ? (
          <textarea value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all resize-none ${bgClass} ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
        ) : (
          <input type={type} value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all ${bgClass} ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
        )}
      </div>
    </div>
  );
};

const FileUpload = ({ label, onChange, value, isDark=false }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
      else alert("Error al subir imagen.");
    } catch (err) { alert("Error de conexión."); } 
    finally { setUploading(false); }
  };
  
  const bgClass = isDark ? "bg-slate-700 border-slate-600 text-violet-400 hover:bg-slate-600" : "bg-white border-violet-200 text-violet-600 hover:bg-violet-50";

  return (
    <div className="mb-4 text-left relative">
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>}
      <div className="relative">
        <label className={`flex items-center justify-center w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : bgClass}`}>
          <span className="flex items-center gap-2">
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir logo del Salón</>}
          </span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      </div>
      {value && !uploading && (
        <div className="relative mt-3 group w-fit">
          <img src={value} alt="preview" className="h-16 w-auto object-contain rounded-xl border border-gray-200 shadow-sm bg-white p-2" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"><Trash2 size={12} /></button>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
  </label>
);

export const LoginScreen = ({ isMaster = false, onLogin, users }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isMaster && email === "owner@fiestadigital.com" && pass === "owner123") {
        onLogin({ name: "Master", role: "owner", email }, rememberMe);
        navigate("/dashboard");
        return;
      }
      const found = users.find(u => u.email === email && u.pass === pass);
      if (found) { 
        onLogin(found, rememberMe);
        navigate("/dashboard"); 
      } 
      else setError("Credenciales no válidas.");
      setLoading(false);
    }, 500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isMaster ? 'bg-slate-950' : 'bg-[#08060f]'}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-2xl ${isMaster ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600'}`}>
            {isMaster ? <ShieldCheck size={40} color="white"/> : <PartyPopper size={40} color="white"/>}
          </div>
          <h1 className="text-white text-3xl font-black">Fiesta<span className="text-violet-400">Digital</span></h1>
        </div>
        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-2">
            {error && <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3"><AlertCircle size={16} /> {error}</div>}
            
            <Inp label="Email" value={email} onChange={setEmail} />
            <Inp label="Clave" type="password" value={pass} onChange={setPass} />
            
            <label className="flex items-center gap-2 mb-4 mt-4 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500" />
              <span className="text-sm text-slate-300 font-bold">Mantener sesión iniciada</span>
            </label>

            <button className="w-full py-4 mt-2 bg-violet-600 text-white rounded-2xl font-black text-sm transition-transform active:scale-95 flex justify-center items-center cursor-pointer">
              {loading ? <Loader2 size={18} className="animate-spin"/> : "INGRESAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const DashboardScreen = ({ user, onLogout, users, onUpdateUser, onCreateSalon, onDeleteSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal }) => {
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCrmId, setActiveCrmId] = useState(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [newPhone, setNewPhone] = useState(""); 
  
  const [printMode, setPrintMode] = useState("ficha"); 

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => { localStorage.setItem("fiesta_darkmode", JSON.stringify(isDark)); }, [isDark]);

  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const mySalons = users.filter(u => u.role === "salon");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const filteredInvs = myInvs.filter(inv => (inv.title || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const activeInv = myInvs.find(i => i.id === activeCrmId);

  const themeBg = isDark ? "bg-slate-900" : "bg-[#f1f3f9]";
  const themeNav = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const themeText = isDark ? "text-white" : "text-slate-800";
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/60";

  // VISTA CRM DEL SALÓN
  if (!isOwner) {
    const salonInfo = users.find(u => u.email === user.email);
    const isManualBlocked = salonInfo?.payment_alert;
    
    const openSettings = () => {
      setNewLogo(salonInfo?.logo || "");
      setNewPhone(salonInfo?.phone || "");
      setNewPassword("");
      setShowSettings(true);
    };

    const handleSaveSettings = () => {
      let dataToUpdate = { logo: newLogo, phone: newPhone };
      if (newPassword) dataToUpdate.pass = newPassword;
      
      onUpdateUser(user.email, dataToUpdate);
      setShowSettings(false);
      notify("¡Ajustes guardados correctamente!");
    };

    const handlePrint = (mode) => {
      setPrintMode(mode);
      setTimeout(() => window.print(), 200); 
    };

    return (
      <div className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}>
        
        <style>{`
          @media print {
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .only-print { display: block !important; }
          }
        `}</style>

        <div className="no-print">
          <nav className={`h-20 border-b px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300 ${themeNav}`}>
            <div className="flex items-center gap-4">
               {salonInfo?.logo ? (
                 <img src={salonInfo.logo} alt="Logo" className="h-10 object-contain drop-shadow-sm" />
               ) : (
                 <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200/20"><Building size={20}/></div>
               )}
               <div className={`font-black text-xl tracking-tight ${themeText}`}>{user.name} <span className="text-violet-500 text-sm opacity-60 ml-2 hidden sm:inline-block">| Panel de Gestión</span></div>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                 {isDark ? <Sun size={18}/> : <Moon size={18}/>}
               </button>
               <button onClick={openSettings} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Settings size={18}/></button>
               <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"><LogOut size={18}/></button>
            </div>
          </nav>
          
          {isManualBlocked && (
            <div className="bg-red-500 text-white p-3 text-center font-bold text-xs flex items-center justify-center gap-3">
              <AlertTriangle size={16}/> Tu cuenta presenta un atraso en el pago. Por favor regularizá tu situación.
            </div>
          )}

          <main className="max-w-7xl mx-auto p-6 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <h1 className={`text-4xl font-black tracking-tight ${themeText}`}>Mis Eventos</h1>
                <p className="text-slate-500 mt-1 font-medium italic">Gestioná tus invitaciones y la logística en tiempo real.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="relative group flex-1 md:flex-none">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18}/>
                    <input className={`w-full md:w-64 pl-11 pr-4 py-3.5 border rounded-2xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-violet-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} placeholder="Buscar evento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                 </div>
                 <button onClick={async () => { const id = await onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95 cursor-pointer">
                   <Plus size={20}/> Nuevo Evento
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredInvs.map(inv => {
                const data = inv.internal_data || {};
                const pStatus = data.paymentStatus || 'Pendiente';
                const eStatus = data.eventStatus || 'Nuevo';
                const statusColors = { 'Pendiente': 'bg-red-100 text-red-700', 'Seña / Parcial': 'bg-amber-100 text-amber-700', 'Pagado Total': 'bg-green-100 text-green-700' };
                const evColors = { 'Nuevo': 'bg-blue-100 text-blue-700', 'Confirmado': 'bg-violet-100 text-violet-700', 'Finalizado': 'bg-slate-200 text-slate-700', 'Cancelado': 'bg-red-200 text-red-800' };

                return (
                  <div key={inv.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/30 ${themeCard}`}>
                    <div className="h-44 relative overflow-hidden">
                      <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Event" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${evColors[eStatus] || evColors['Nuevo']}`}>{eStatus}</span>
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                         <div>
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{data.internalDate ? formatDate(data.internalDate) : 'Sin fecha'} {data.internalTime ? `• ${data.internalTime} hs` : ''}</p>
                            <h3 className="font-black text-xl text-white truncate max-w-[200px]">{data.internalHonoree || inv.config?.honoreeName || inv.title}</h3>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-sm ${statusColors[pStatus] || statusColors['Pendiente']}`}>{pStatus}</span>
                      </div>
                      <button onClick={() => { if(window.confirm("¿Borrar definitivamente este evento?")) onDeleteInv(inv.id); }} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg cursor-pointer"><Trash2 size={16}/></button>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-4">
                        <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"><Edit2 size={14}/> DISEÑAR</button>
                        <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Eye size={18}/></button>
                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Copy size={18}/></button>
                      </div>
                      <button onClick={() => setActiveCrmId(inv.id)} className={`w-full py-3.5 rounded-2xl font-black text-xs flex justify-center items-center gap-2 border shadow-sm cursor-pointer transition-colors ${isDark ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Lock size={14}/> ABRIR FICHA (CRM)</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* MODAL CRM EN PANTALLA */}
          {activeCrmId && activeInv && (
            <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
              <div className={`w-full max-w-4xl max-h-[95vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                
                <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                   <h2 className={`font-black text-xl flex items-center gap-2 ${themeText}`}><ClipboardList className="text-violet-500" size={20}/> Logística y Presupuesto</h2>
                   <div className="flex gap-2">
                     <button onClick={() => handlePrint('presupuesto')} className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"><FileText size={14}/> Presupuesto</button>
                     <button onClick={() => handlePrint('ficha')} className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"><Printer size={14}/> Ficha Interna</button>
                     <button onClick={() => setActiveCrmId(null)} className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-2"><X size={20}/></button>
                   </div>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div>
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><UserCheck size={14}/> Datos del Cliente</h3>
                        <Inp label="Nombre Completo" value={activeInv.internal_data.clientName || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientName', v)} isDark={isDark} />
                        <div className="flex gap-2 items-end mb-4">
                           <Inp label="WhatsApp del Cliente" placeholder="54911..." className="flex-1 !mb-0" value={activeInv.internal_data.clientPhone || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientPhone', v)} isDark={isDark} />
                           <button onClick={() => window.open(`https://wa.me/${activeInv.internal_data.clientPhone}`)} className="h-[46px] px-4 bg-green-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md"><MessageCircle size={18}/></button>
                        </div>
                        <Inp label="Cantidad de Invitados (Aprox)" type="number" placeholder="Ej: 80" value={activeInv.internal_data.guestCount || ''} onChange={v => onUpdateInternal(activeInv.id, 'guestCount', v)} isDark={isDark} />
                     </div>
                     <div>
                        <h3 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><PartyPopper size={14}/> Detalles del Evento</h3>
                        <Inp label="Nombre del Agasajado/s" value={activeInv.internal_data.internalHonoree || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalHonoree', v)} isDark={isDark} />
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <Inp label="Tipo de Evento" placeholder="Ej: Boda" value={activeInv.internal_data.eventType || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventType', v)} isDark={isDark} />
                          <div>
                            <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</label>
                            <select className={`w-full py-3 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer border ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`} value={activeInv.internal_data.eventStatus || 'Nuevo'} onChange={e => onUpdateInternal(activeInv.id, 'eventStatus', e.target.value)}>
                               <option value="Nuevo">🔵 Nuevo / Borrador</option>
                               <option value="Confirmado">🟣 Confirmado</option>
                               <option value="Finalizado">⚪ Finalizado</option>
                               <option value="Cancelado">🔴 Cancelado</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <Inp label="Fecha" type="date" icon={CalendarClock} value={activeInv.internal_data.internalDate || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalDate', v)} isDark={isDark} />
                           <Inp label="Horario" type="text" placeholder="Ej: 14:00 a 20:00" icon={Clock} value={activeInv.internal_data.internalTime || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalTime', v)} isDark={isDark} />
                        </div>
                     </div>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><ClipboardList size={14}/> Logística y Servicios</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Inp label="Servicios Solicitados (Para Presupuesto)" placeholder="Ej: DJ, Fotógrafo, Show de Magia..." multiline value={activeInv.internal_data.requestedServices || ''} onChange={v => onUpdateInternal(activeInv.id, 'requestedServices', v)} isDark={isDark} />
                        <Inp label="Menús Especiales / Alergias" placeholder="Ej: 2 Celíacos, 1 Vegano..." multiline value={activeInv.internal_data.specialMenus || ''} onChange={v => onUpdateInternal(activeInv.id, 'specialMenus', v)} isDark={isDark} />
                     </div>
                     <Inp label="Notas Internas (Privadas, no se imprimen al cliente)" placeholder="Anotaciones para la cocina o administración..." multiline className="mt-2" value={activeInv.internal_data.internalNotes || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalNotes', v)} isDark={isDark} />
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xs font-black text-green-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><Receipt size={14}/> Finanzas</h3>
                     <div className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-4 ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                        <div>
                          <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-green-400' : 'text-slate-500'}`}>Estado de Pago</label>
                          <select className={`w-full py-3 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer border ${isDark ? 'bg-slate-800 text-white border-green-900' : 'bg-white text-slate-800 border-green-200'}`} value={activeInv.internal_data.paymentStatus || 'Pendiente'} onChange={e => onUpdateInternal(activeInv.id, 'paymentStatus', e.target.value)}>
                             <option value="Pendiente">🔴 Pendiente</option>
                             <option value="Seña / Parcial">🟡 Seña Adelantada</option>
                             <option value="Pagado Total">🟢 Pagado Total</option>
                          </select>
                        </div>
                        <Inp label="Presupuesto Total" type="number" prefix="$" value={activeInv.internal_data.totalBudget || ''} onChange={v => onUpdateInternal(activeInv.id, 'totalBudget', v)} isDark={isDark} />
                        <Inp label="Abonado / Seña" type="number" prefix="$" value={activeInv.internal_data.paymentAmount || ''} onChange={v => onUpdateInternal(activeInv.id, 'paymentAmount', v)} isDark={isDark} />
                        <div>
                           <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-green-400' : 'text-slate-500'}`}>Saldo Restante</label>
                           <div className={`w-full py-3 px-4 rounded-xl text-sm font-black flex items-center gap-1 border ${isDark ? 'bg-slate-800 border-green-900 text-white' : 'bg-white border-green-200 text-slate-800'}`}>
                              <span className="text-slate-400 opacity-50">$</span> {(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}
                           </div>
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* MODAL AJUSTES */}
          {showSettings && (
            <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative anim-pop text-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
                  <button onClick={() => setShowSettings(false)} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}><X size={16}/></button>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700 text-violet-400' : 'bg-violet-100 text-violet-600'}`}><Settings size={28}/></div>
                  <h2 className="text-xl font-black mb-6">Ajustes del Salón</h2>
                  
                  <FileUpload label="Logo de tu Salón (Aparecerá en el PDF)" value={newLogo} onChange={setNewLogo} isDark={isDark} />
                  
                  <div className="mt-6 pt-6 border-t border-slate-200/20">
                    <Inp label="Cambiar Contraseña" type="password" placeholder="Nueva clave..." value={newPassword} onChange={setNewPassword} isDark={isDark} />
                  </div>

                  <button onClick={handleSaveSettings} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-md">GUARDAR AJUSTES</button>
               </div>
            </div>
          )}
        </div>

        {/* ---------------- LA HOJA A4 PARA IMPRIMIR (DOBLE PLANTILLA) ---------------- */}
        {activeCrmId && activeInv && (
          <div className="hidden only-print w-full bg-white text-black p-8 font-sans max-w-4xl mx-auto">
             
             {/* CABECERA */}
             <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-6">
                  {salonInfo?.logo ? (
                    <img src={salonInfo.logo} className="max-h-24 max-w-[200px] object-contain" alt="Logo" />
                  ) : (
                    <div className="text-3xl font-black tracking-tighter text-slate-900">{user.name}</div>
                  )}
                  <div>
                    {salonInfo?.logo && <h1 className="text-xl font-black text-slate-900 m-0 leading-none mb-1">{user.name}</h1>}
                    <p className="text-slate-600 text-sm">{salonInfo?.address || 'Sin dirección registrada'}</p>
                    <p className="text-slate-600 text-sm">{salonInfo?.phone || 'Sin teléfono'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase mb-1">
                    {printMode === 'presupuesto' ? 'PRESUPUESTO' : 'FICHA DE EVENTO'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-lg border border-slate-200">Ref: {activeInv.id.split('-')[1].toUpperCase()}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">1. Detalles del Evento</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Agasajado:</span> <span className="font-black text-lg">{activeInv.internal_data.internalHonoree || '---'}</span></p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Tipo:</span> {activeInv.internal_data.eventType || '---'}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Fecha:</span> {formatDate(activeInv.internal_data.internalDate)}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Horario:</span> {activeInv.internal_data.internalTime || '---'} hs</p>
                    {printMode === 'ficha' && (
                      <p><span className="font-bold text-slate-700 w-24 inline-block">Estado (Int):</span> <span className="uppercase font-bold border border-slate-300 px-2 py-0.5 rounded text-[10px] bg-slate-100">{activeInv.internal_data.eventStatus || 'Nuevo'}</span></p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">2. Datos del Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Nombre:</span> <span className="font-bold">{activeInv.internal_data.clientName || '---'}</span></p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Teléfono:</span> {activeInv.internal_data.clientPhone || '---'}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Invitados:</span> {activeInv.internal_data.guestCount || '---'} aprox.</p>
                  </div>
                </div>
             </div>

             <div className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">3. Servicios Incluidos</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="font-black text-slate-700 mb-1">Servicios Solicitados:</p>
                    <p className="whitespace-pre-wrap">{activeInv.internal_data.requestedServices || 'Ninguno especificado.'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="font-black text-slate-700 mb-1">Menús Especiales / Alergias:</p>
                    <p className="whitespace-pre-wrap">{activeInv.internal_data.specialMenus || 'Ninguno especificado.'}</p>
                  </div>
                </div>
                
                {printMode === 'ficha' && (
                  <div className="mt-4 p-4 border border-slate-300 rounded-xl bg-yellow-50">
                    <p className="font-black text-slate-700 mb-1 flex items-center gap-2"><AlertTriangle size={14}/> Notas Internas del Salón:</p>
                    <p className="whitespace-pre-wrap italic text-slate-600">{activeInv.internal_data.internalNotes || 'Sin observaciones.'}</p>
                  </div>
                )}
             </div>

             <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">
                  {printMode === 'presupuesto' ? '4. Detalle de Valores' : '4. Estado Financiero Interno'}
                </h3>
                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-500">Valor Total</p>
                    <p className="text-2xl font-bold text-slate-800">${Number(activeInv.internal_data.totalBudget || 0).toLocaleString('es-AR')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-500">Abonado / Seña</p>
                    <p className="text-2xl font-bold text-green-700">${Number(activeInv.internal_data.paymentAmount || 0).toLocaleString('es-AR')}</p>
                  </div>
                  <div className="text-center bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg">
                    <p className="text-[10px] font-black uppercase text-slate-300 opacity-80">Saldo Pendiente</p>
                    <p className="text-3xl font-black">${(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}</p>
                  </div>
                </div>
             </div>
             
             <div className="mt-16 text-center text-xs text-slate-400 font-bold border-t border-slate-200 pt-4">
                {printMode === 'presupuesto' ? (
                  <p>Documento emitido el {new Date().toLocaleDateString('es-AR')} • Los valores expresados pueden estar sujetos a modificaciones.</p>
                ) : (
                  <p>Hoja de ruta interna generada el {new Date().toLocaleDateString('es-AR')}</p>
                )}
             </div>
          </div>
        )}
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 
  const [editingEmail, setEditingEmail] = useState("");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState(""); 
  const [fPass, setFPass] = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fPayDate, setFPayDate] = useState("");
  const [fAlert, setFAlert] = useState(false);

  const openCreateModal = () => { setModalMode("create"); setFName(""); setFEmail(""); setFPhone(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false); setShowModal(true); };
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.payment_date || ""); setFAlert(salon.payment_alert || false); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Faltan datos");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "password") {
      onUpdateUser(editingEmail, { pass: fPass });
    }
    setShowModal(false);
    notify("¡Hecho!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <nav className="h-16 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="font-extrabold text-xl flex items-center gap-3"><ShieldCheck className="text-violet-400"/> Panel Maestro</div>
        <button onClick={() => { onLogout(); navigate("/master"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><LogOut size={18}/></button>
      </nav>
      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div><h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1><p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p></div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center gap-3 transition-transform active:scale-95 cursor-pointer"><Plus size={20}/> Nuevo Salón</button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-5">Salón</th><th className="p-5">Ubicación</th><th className="p-5">Vencimiento</th><th className="p-5">Estado</th><th className="p-5 text-right">Acciones</th></tr></thead>
              <tbody className="text-sm">
                {mySalons.map(salon => {
                  let status = <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">Al día</span>;
                  if (salon.payment_alert) status = <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Bloqueado</span>;
                  return (
                    <tr key={salon.email} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold">{salon.name}<br/><span className="text-xs text-slate-400 font-normal">{salon.email}</span></td>
                      <td className="p-5"><div className="flex gap-2 max-w-[180px]"><MapPin size={16} className="text-slate-300"/><span className="text-xs truncate">{salon.address || 'N/A'}</span></div></td>
                      <td className="p-5 font-bold">{salon.payment_date || '--/--/----'}</td>
                      <td className="p-5">{status}</td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={() => openEditModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-violet-50 cursor-pointer transition-all"><Edit2 size={16}/></button>
                        <button onClick={() => openPassModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-all"><KeyRound size={16}/></button>
                        <button onClick={() => window.confirm("Eliminar?") && onDeleteSalon(salon.email)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 cursor-pointer transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative anim-pop">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-8">{modalMode === 'create' ? 'Nuevo Salón' : modalMode === 'edit' ? 'Editar Salón' : 'Nueva Clave'}</h2>
            <div className="space-y-4">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <>
                  <div className="grid grid-cols-2 gap-3"><Inp label="Nombre" value={fName} onChange={setFName} /><Inp label="WhatsApp" value={fPhone} onChange={setFPhone} /></div>
                  <Inp label="Email" value={fEmail} onChange={setFEmail} className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                  {modalMode === 'create' && <Inp label="Contraseña" value={fPass} onChange={setFPass} type="password" />}
                  <Inp label="Ubicación Google Maps" value={fAddress} onChange={setFAddress} />
                  <div className="flex gap-4"><Inp label="Próximo Vencimiento" type="date" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1" /><div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div></div>
                </>
              )}
              {modalMode === 'password' && <Inp label="Escribí Nueva Contraseña" value={fPass} onChange={setFPass} />}
              <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg">GUARDAR CAMBIOS</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
};

const GlobalStyles = () => {
  useEffect(() => {
    if (!document.getElementById("tw-cdn")) {
      const tw = document.createElement("script");
      tw.id = "tw-cdn"; tw.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tw);
    }
    if (!document.getElementById("fd-global")) {
      const s = document.createElement("style");
      s.id = "fd-global";
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .fd-sb::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
        .fd-sb::-webkit-scrollbar-thumb { background: #b4aee8 !important; border-radius: 10px !important; }
        .fd-sb::-webkit-scrollbar-thumb:hover { background: #8b5cf6 !important; }
        .fd-sb::-webkit-scrollbar-track { background: #f1f0f5 !important; border-radius: 10px !important; }
        @keyframes fdPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: fdPop 0.4s cubic-bezier(0.2, 1, 0.3, 1) both; }
        .invite-phone { width: 100%; max-width: 390px; border-radius: 50px; overflow: hidden; box-shadow: 0 0 0 12px #1a1a2e, 0 0 0 14px #0d0d1a, 0 32px 64px rgba(0,0,0,.65); position: relative; height: 780px; background: #000; }
      `;
      document.head.appendChild(s);
    }
  }, []);
  return null;
};

const PublicInviteScreen = ({ invitations }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);
  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 size={30} className="animate-spin text-white"/></div>;
  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} isPreview={false} />}
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const local = localStorage.getItem("fiesta_user");
      const session = sessionStorage.getItem("fiesta_user");
      if (local) return JSON.parse(local);
      if (session) return JSON.parse(session);
      return null;
    } catch (e) {
      localStorage.removeItem("fiesta_user");
      sessionStorage.removeItem("fiesta_user");
      return null;
    }
  });

  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (userData, rememberMe) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem("fiesta_user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("fiesta_user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fiesta_user");
    sessionStorage.removeItem("fiesta_user");
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: salones } = await supabase.from('salones').select('*');
      const { data: invs } = await supabase.from('invitaciones').select('*');
      if (salones) setUsers(salones);
      if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {} })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateSalon = async (newUser) => {
    const { error } = await supabase.from('salones').insert([newUser]);
    if (!error) setUsers(prev => [...prev, newUser]);
  };
  
  const handleUpdateUser = async (email, updateData) => {
    const { error: salonError } = await supabase.from('salones').update(updateData).eq('email', email);
    
    if (salonError) {
      alert("Error en la Base de Datos: " + salonError.message);
      return; 
    }

    if (updateData.address) {
      const { data: currentInvs } = await supabase.from('invitaciones').select('*').eq('salon_id', email);
      if (currentInvs) {
        for (let inv of currentInvs) {
          const updatedConfig = { ...inv.config, locationAddress: updateData.address };
          await supabase.from('invitaciones').update({ config: updatedConfig }).eq('id', inv.id);
        }
      }
    }
    setUsers(prev => prev.map(u => u.email === email ? {...u, ...updateData} : u));
    
    if (user && user.email === email) {
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem("fiesta_user", JSON.stringify(updatedUser));
    }

    const { data: freshInvs } = await supabase.from('invitaciones').select('*');
    if (freshInvs) {
      setInvitations(freshInvs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {} })));
    }
  };
  
  const handleDeleteSalon = async (email) => {
    await supabase.from('invitaciones').delete().eq('salon_id', email);
    await supabase.from('salones').delete().eq('email', email);
    setUsers(prev => prev.filter(u => u.email !== email));
    setInvitations(prev => prev.filter(inv => inv.salonId !== email));
  };

  const handleCreateInv = async (salonEmail, salonName) => {
    const salonInfo = users.find(u => u.email === salonEmail);
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    const customConfig = { ...DEF_CONFIG, locationName: salonName, locationAddress: salonInfo?.address || "" };
    const newInv = { id: newId, salon_id: salonEmail, title: "Nuevo Evento", config: customConfig, internal_data: {} };
    
    const { error } = await supabase.from('invitaciones').insert([newInv]);
    if (!error) {
      setInvitations(prev => [...prev, { ...newInv, salonId: salonEmail }]);
      return newId;
    }
  };
  
  const handleSaveInv = async (updatedInv) => {
    const { error } = await supabase.from('invitaciones').update({ 
      title: updatedInv.title, 
      config: updatedInv.config,
      internal_data: updatedInv.internal_data 
    }).eq('id', updatedInv.id);
    if (!error) setInvitations(prev => prev.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
  };

  const handleDeleteInv = async (id) => {
    await supabase.from('invitaciones').delete().eq('id', id);
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleUpdateInternal = async (id, field, val) => {
    setInvitations(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, internal_data: { ...i.internal_data, [field]: val } };
      }
      return i;
    }));

    const inv = invitations.find(i => i.id === id);
    if(inv) {
      const updatedData = { ...inv.internal_data, [field]: val };
      await supabase.from('invitaciones').update({ internal_data: updatedData }).eq('id', id);
    }
  };

  if (loading) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4"><Loader2 className="animate-spin" size={40}/><p className="font-bold animate-pulse">Conectando con la base de datos...</p></div>;

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={handleLogin} users={users} />} />
          <Route path="/master" element={user ? <Navigate to="/dashboard" /> : <LoginScreen isMaster={true} onLogin={handleLogin} users={users} />} />
          <Route path="/dashboard" element={user ? <DashboardScreen user={user} users={users} invitations={invitations} onCreateSalon={handleCreateSalon} onDeleteSalon={handleDeleteSalon} onCreateInv={handleCreateInv} onDeleteInv={handleDeleteInv} onUpdateUser={handleUpdateUser} onUpdateInternal={handleUpdateInternal} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} />} />
        </Routes>
      </Router>
    </>
  );
}
