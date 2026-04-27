import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X, MessageCircle, ExternalLink, Eye, Search,
  ChevronDown, Phone, Users, Utensils, Music, CreditCard, Clock, Settings, UserCheck, Calculator, Receipt
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

// Función para parsear fechas argentinas (DD/MM/YYYY) o las viejas (YYYY-MM-DD)
const parseDateArg = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }
  return new Date(dateStr);
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  return dateStr; // Si ya está en DD/MM/YYYY lo deja igual
};

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10 anim-pop">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

// INPUT MODIFICADO: Acepta íconos y fuerza el formato texto para evitar el formato yanqui
const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null, prefix=null }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    <div className="relative flex items-center">
      {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
      {prefix && <span className="absolute left-4 text-slate-400 font-bold">{prefix}</span>}
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all resize-none ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
      ) : (
        <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
      )}
    </div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
  </label>
);

export const LoginScreen = ({ isMaster = false, onLogin, users }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isMaster && email === "owner@fiestadigital.com" && pass === "owner123") {
        onLogin({ name: "Master", role: "owner", email });
        navigate("/dashboard");
        return;
      }
      const found = users.find(u => u.email === email && u.pass === pass);
      if (found) { onLogin(found); navigate("/dashboard"); } 
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
            <button className="w-full py-4 mt-2 bg-violet-600 text-white rounded-2xl font-black text-sm transition-transform active:scale-95">INGRESAR</button>
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

  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const mySalons = users.filter(u => u.role === "salon");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const filteredInvs = myInvs.filter(inv => inv.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeInv = myInvs.find(i => i.id === activeCrmId);

  // ==============================
  // VISTA DEL DUEÑO DEL SALÓN (CLIENTE)
  // ==============================
  if (!isOwner) {
    const salonInfo = users.find(u => u.email === user.email);
    const isManualBlocked = salonInfo?.paymentAlert;
    const paymentDateStr = salonInfo?.paymentDate;
    
    let alertMsg = null;
    let alertType = null;

    if (isManualBlocked) {
      alertType = 'red';
      alertMsg = "Tu cuenta presenta un atraso en el pago. Por favor regularizá tu situación.";
    } else if (paymentDateStr) {
      const dueDate = parseDateArg(paymentDateStr);
      if (dueDate && !isNaN(dueDate)) {
        const today = new Date(); today.setHours(0,0,0,0);
        dueDate.setHours(0,0,0,0); dueDate.setDate(dueDate.getDate() + 1);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) { alertType = 'red'; alertMsg = `Abono vencido el ${dueDate.toLocaleDateString('es-AR')}. Regularizá el pago pronto.`; }
        else if (diffDays <= 5) { alertType = 'yellow'; alertMsg = `Recordatorio: Tu pago vence en ${diffDays} días (${dueDate.toLocaleDateString('es-AR')}).`; }
      }
    }

    const handleChangePassword = () => {
      if(!newPassword) return alert("Escribí una nueva contraseña");
      onUpdateUser(user.email, { pass: newPassword });
      setShowSettings(false);
      setNewPassword("");
      notify("¡Contraseña actualizada!");
    };

    return (
      <div className="min-h-screen bg-[#f1f3f9] pb-20">
        <nav className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200"><Building size={20}/></div>
             <div className="font-black text-xl tracking-tight text-slate-800">{user.name} <span className="text-violet-500 text-sm opacity-60 ml-2 hidden sm:inline-block">| Panel de Gestión</span></div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowSettings(true)} className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer" title="Configuración"><Settings size={18}/></button>
             <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all cursor-pointer" title="Cerrar Sesión"><LogOut size={18}/></button>
          </div>
        </nav>
        
        {alertMsg && (
          <div className={`${alertType === 'red' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'} p-3 text-center font-bold text-xs flex items-center justify-center gap-3 shadow-inner`}>
            <AlertTriangle size={16}/> {alertMsg}
          </div>
        )}

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Mis Eventos</h1>
              <p className="text-slate-500 mt-1 font-medium italic">Creá invitaciones y llevá el control total de tus fiestas.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <div className="relative group flex-1 md:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18}/>
                  <input 
                    className="w-full md:w-64 pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all" 
                    placeholder="Buscar evento..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button onClick={() => { const id = onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-violet-200 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
                 <Plus size={20}/> Nuevo Evento
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredInvs.map(inv => {
              const pStatus = inv.paymentStatus || 'Pendiente';
              const statusColors = { 'Pendiente': 'bg-red-100 text-red-700 border-red-200', 'Seña / Parcial': 'bg-amber-100 text-amber-700 border-amber-200', 'Pagado Total': 'bg-green-100 text-green-700 border-green-200' };

              return (
                <div key={inv.id} className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/10">
                  
                  <div className="h-44 relative overflow-hidden">
                    <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                       <div>
                          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{formatDate(inv.internalDate)} {inv.internalTime ? `• ${inv.internalTime} hs` : ''}</p>
                          <h3 className="font-black text-xl text-white truncate max-w-[200px]">{inv.internalHonoree || inv.config?.honoreeName || inv.title}</h3>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${statusColors[pStatus] || statusColors['Pendiente']}`}>{pStatus}</span>
                    </div>
                    <button onClick={() => { if(window.confirm("¿Seguro que querés eliminar esta invitación?")) onDeleteInv(inv.id); }} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg cursor-pointer"><Trash2 size={16}/></button>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md">
                        <Edit2 size={14}/> DISEÑAR INVITACIÓN
                      </button>
                      <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} title="Ver en vivo" className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center hover:bg-violet-100 transition-all cursor-pointer border border-violet-100 shadow-sm">
                        <Eye size={18}/>
                      </button>
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} title="Copiar Link" className="w-12 h-12 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer shadow-sm">
                        <Copy size={18}/>
                      </button>
                    </div>

                    <button onClick={() => setActiveCrmId(inv.id)} className="w-full py-3.5 rounded-2xl font-black text-xs flex justify-center items-center gap-2 transition-all border cursor-pointer bg-white text-violet-600 border-violet-200 hover:bg-violet-50 shadow-sm">
                       <Lock size={14}/> ABRIR FICHA DEL EVENTO (CRM)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredInvs.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6 opacity-50"><Search size={40}/></div>
                <p className="text-slate-500 font-bold">No se encontraron eventos.</p>
                <p className="text-slate-400 text-sm mt-1">Intentá con otro nombre o creá una nueva invitación.</p>
             </div>
          )}
        </main>
        
        {/* =========================================
            MODAL DE FICHA CRM (VENTANA NUEVA 100% ARG)
        ============================================= */}
        {activeCrmId && activeInv && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop relative">
              
              {/* HEADER MODAL */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="font-black text-xl text-slate-800 flex items-center gap-2"><Lock className="text-violet-500" size={20}/> Ficha de Gestión Interna</h2>
                    <p className="text-xs font-bold text-slate-400">ID del Evento: {activeInv.id}</p>
                 </div>
                 <button onClick={() => setActiveCrmId(null)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"><X size={20}/></button>
              </div>

              {/* CONTENIDO MODAL */}
              <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1 bg-white">
                
                {/* SECCIÓN 1: DATOS DEL EVENTO */}
                <div className="mb-8">
                   <h3 className="text-xs font-black text-violet-600 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><PartyPopper size={14}/> Datos Principales</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Inp label="Tipo de Evento" placeholder="Ej: Cumpleaños, Boda..." value={activeInv.eventType || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventType', v)} />
                      <Inp label="Nombre Agasajado" placeholder="Ej: Valentina" value={activeInv.internalHonoree || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalHonoree', v)} />
                      <Inp label="Edad / Motivo" placeholder="Ej: Cumple 5" value={activeInv.eventReason || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventReason', v)} />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CAMBIOS CLAVES ACÁ: TYPE TEXT PARA FORMATO ARGENTINO */}
                      <Inp label="Fecha (Día/Mes/Año)" type="text" placeholder="Ej: 24/10/2026" icon={CalendarClock} value={activeInv.internalDate || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalDate', v)} />
                      <Inp label="Horario (24hs)" type="text" placeholder="Ej: 14:00" icon={Clock} value={activeInv.internalTime || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalTime', v)} />
                   </div>
                </div>

                {/* SECCIÓN 2: CONTACTO */}
                <div className="mb-8">
                   <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><UserCheck size={14}/> Cliente y Contacto</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Inp label="Nombre del Cliente / Padre" placeholder="Ej: Juan Pérez" value={activeInv.clientName || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientName', v)} />
                      
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp Cliente (Sin +)</label>
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                               <input type="text" className="w-full pl-4 pr-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" placeholder="54911234567" value={activeInv.clientPhone || ''} onChange={e => onUpdateInternal(activeInv.id, 'clientPhone', e.target.value)} />
                            </div>
                            <button onClick={() => activeInv.clientPhone ? window.open(`https://wa.me/${activeInv.clientPhone}?text=Hola ${activeInv.clientName || ''}, te escribimos desde ${user.name} para...`) : alert("Ingresá el número de teléfono primero.")} className="px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-sm font-bold text-xs gap-2" title="Contactar por WhatsApp">
                               <MessageCircle size={16}/> Enviar Info
                            </button>
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Inp label="Cantidad Aprox. Invitados" type="number" placeholder="Ej: 50" value={activeInv.guestCount || ''} onChange={v => onUpdateInternal(activeInv.id, 'guestCount', v)} />
                      <Inp label="Menús Especiales (Dietas)" placeholder="Ej: 2 Celíacos, 1 Vegano" value={activeInv.dietaryNotes || ''} onChange={v => onUpdateInternal(activeInv.id, 'dietaryNotes', v)} />
                   </div>
                </div>

                {/* SECCIÓN 3: FINANZAS Y PAGOS */}
                <div className="mb-8">
                   <h3 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Receipt size={14}/> Finanzas</h3>
                   <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estado</label>
                           <select className="w-full py-3 px-4 rounded-xl text-slate-800 bg-white border border-gray-200 text-sm focus:border-green-400 outline-none cursor-pointer font-bold" value={activeInv.paymentStatus || 'Pendiente'} onChange={e => onUpdateInternal(activeInv.id, 'paymentStatus', e.target.value)}>
                              <option value="Pendiente">🔴 Pendiente</option>
                              <option value="Seña / Parcial">🟡 Seña / Parcial</option>
                              <option value="Pagado Total">🟢 Pagado Total</option>
                           </select>
                         </div>

                         <Inp label="Presupuesto Total" type="number" prefix="$" placeholder="0" value={activeInv.totalBudget || ''} onChange={v => onUpdateInternal(activeInv.id, 'totalBudget', v)} />
                         <Inp label="Abonado / Seña" type="number" prefix="$" placeholder="0" value={activeInv.paymentAmount || ''} onChange={v => onUpdateInternal(activeInv.id, 'paymentAmount', v)} />
                         
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Saldo Restante</label>
                            <div className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 text-sm font-black text-slate-700 flex items-center gap-1 shadow-inner">
                               <span className="text-slate-400">$</span> 
                               {(Number(activeInv.totalBudget || 0) - Number(activeInv.paymentAmount || 0)).toLocaleString('es-AR')}
                            </div>
                         </div>

                      </div>
                   </div>
                </div>

                {/* SECCIÓN 4: OBSERVACIONES */}
                <div>
                   <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Music size={14}/> Animación y Detalles</h3>
                   <Inp label="Indicaciones (Música seleccionada, temáticas, juegos, decoración...)" multiline placeholder="Escribí acá todas las notas necesarias para el día del evento..." value={activeInv.extraNotes || ''} onChange={v => onUpdateInternal(activeInv.id, 'extraNotes', v)} />
                </div>

              </div>
              
              {/* FOOTER MODAL */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-end">
                 <button onClick={() => setActiveCrmId(null)} className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm shadow-md transition-colors cursor-pointer">
                    CERRAR FICHA
                 </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURACIÓN (CAMBIAR CLAVE SALÓN) */}
        {showSettings && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative anim-pop text-center">
                <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={16}/></button>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600"><KeyRound size={28}/></div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Mi Seguridad</h2>
                <p className="text-xs text-slate-500 mb-6">Actualizá la contraseña de acceso a tu panel.</p>
                <Inp label="Nueva Contraseña" type="text" placeholder="Ingresá la nueva clave..." value={newPassword} onChange={setNewPassword} />
                <button onClick={handleChangePassword} className="w-full py-3 mt-2 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer">GUARDAR CLAVE</button>
             </div>
          </div>
        )}

        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // ==============================
  // VISTA MASTER (ADMIN)
  // ==============================
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
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.paymentDate || ""); setFAlert(salon.paymentAlert || false); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Completá nombre, email y contraseña");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, paymentDate: fPayDate, paymentAlert: fAlert, createdAt: new Date().toISOString() });
      notify("Salón creado");
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, paymentDate: fPayDate, paymentAlert: fAlert });
      notify("Datos actualizados");
    } else if (modalMode === "password") {
      if(!fPass) return alert("Nueva contraseña");
      onUpdateUser(editingEmail, { pass: fPass });
      notify("Clave reseteada");
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="h-16 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="font-extrabold text-xl flex items-center gap-3"><ShieldCheck className="text-violet-400"/> Panel Maestro</div>
        <button onClick={() => { onLogout(); navigate("/master"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><LogOut size={18}/></button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 sm:p-12 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1>
            <p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p>
          </div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer">
            <Plus size={20}/> Nuevo Salón
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-5">Salón / Contacto</th>
                  <th className="p-5">Ubicación</th>
                  <th className="p-5">Vencimiento</th>
                  <th className="p-5">Estado</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {mySalons.map(salon => {
                  const sInvs = invitations.filter(i => i.salonId === salon.email).length;
                  let statusUi = <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">Al día</span>;
                  if (salon.paymentAlert) statusUi = <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Bloqueado</span>;
                  else if (salon.paymentDate) {
                     const dueDate = parseDateArg(salon.paymentDate);
                     if (dueDate && !isNaN(dueDate)) {
                       const today = new Date(); today.setHours(0,0,0,0);
                       dueDate.setHours(0,0,0,0); dueDate.setDate(dueDate.getDate() + 1);
                       const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                       if (diff < 0) statusUi = <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Vencido</span>;
                       else if (diff <= 5) statusUi = <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">Vence pronto</span>;
                     }
                  }
                  return (
                    <tr key={salon.email} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-900">{salon.name}</p>
                        <p className="text-xs text-slate-500">{salon.email}</p>
                      </td>
                      <td className="p-5"><div className="flex items-start gap-2 max-w-[200px]"><MapPin size={16} className="text-slate-300"/><span className="text-xs truncate">{salon.address || 'N/A'}</span></div></td>
                      <td className="p-5 font-bold">{salon.paymentDate || '--/--/----'}</td>
                      <td className="p-5">{statusUi}</td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={() => salon.phone && window.open(`https://wa.me/${salon.phone}`)} className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-all cursor-pointer"><MessageCircle size={16}/></button>
                        <button onClick={() => openEditModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-violet-50 transition-all cursor-pointer"><Edit2 size={16}/></button>
                        <button onClick={() => openPassModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-blue-50 transition-all cursor-pointer"><KeyRound size={16}/></button>
                        <button onClick={() => window.confirm("Eliminar?") && onDeleteSalon(salon.email)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all cursor-pointer"><Trash2 size={16}/></button>
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
            {(modalMode === 'create' || modalMode === 'edit') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3"><Inp label="Nombre" value={fName} onChange={setFName} /><Inp label="WhatsApp" value={fPhone} onChange={setFPhone} /></div>
                <Inp label="Email" value={fEmail} onChange={setFEmail} className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                {modalMode === 'create' && <Inp label="Contraseña" value={fPass} onChange={setFPass} type="password" />}
                <Inp label="Dirección Google Maps" value={fAddress} onChange={setFAddress} />
                
                <div className="flex gap-4">
                   <Inp label="Próximo Vencimiento (Día/Mes/Año)" type="text" placeholder="Ej: 10/05/2026" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1" />
                   <div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div>
                </div>
              </div>
            )}
            {modalMode === 'password' && <Inp label="Nueva Contraseña" value={fPass} onChange={setFPass} />}
            <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer">GUARDAR CAMBIOS</button>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
};
