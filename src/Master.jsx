import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X, MessageCircle, ExternalLink, Eye, Search,
  ChevronDown, Phone, Users, Utensils, Music, CreditCard, Clock, Settings, UserCheck, Calculator, Receipt
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

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

  if (!isOwner) {
    const salonInfo = users.find(u => u.email === user.email);
    const isManualBlocked = salonInfo?.payment_alert;
    const paymentDateStr = salonInfo?.payment_date;
    
    let alertMsg = null;
    let alertType = null;

    if (isManualBlocked) {
      alertType = 'red';
      alertMsg = "Tu cuenta presenta un atraso en el pago. Por favor regularizá tu situación.";
    }

    const handleChangePassword = () => {
      if(!newPassword) return alert("Escribí una nueva contraseña");
      onUpdateUser(user.email, { pass: newPassword });
      setShowSettings(false);
      setNewPassword("");
      notify("¡Contraseña actualizada!");
    };

    return (
      <div className="min-h-screen bg-[#f1f3f9] pb-20 text-left">
        <nav className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200"><Building size={20}/></div>
             <div className="font-black text-xl tracking-tight text-slate-800">{user.name} <span className="text-violet-500 text-sm opacity-60 ml-2 hidden sm:inline-block">| Panel de Gestión</span></div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowSettings(true)} className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"><Settings size={18}/></button>
             <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all cursor-pointer"><LogOut size={18}/></button>
          </div>
        </nav>
        
        {alertMsg && (
          <div className="bg-red-500 text-white p-3 text-center font-bold text-xs flex items-center justify-center gap-3">
            <AlertTriangle size={16}/> {alertMsg}
          </div>
        )}

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mis Eventos</h1>
              <p className="text-slate-500 mt-1 font-medium italic">Gestioná tus invitaciones y clientes en tiempo real.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
               <div className="relative group flex-1 md:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18}/>
                  <input className="w-full md:w-64 pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-violet-200" placeholder="Buscar evento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
              const statusColors = { 'Pendiente': 'bg-red-100 text-red-700', 'Seña / Parcial': 'bg-amber-100 text-amber-700', 'Pagado Total': 'bg-green-100 text-green-700' };

              return (
                <div key={inv.id} className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/10">
                  <div className="h-44 relative overflow-hidden">
                    <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                       <div>
                          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{formatDate(data.internalDate)} {data.internalTime ? `• ${data.internalTime} hs` : ''}</p>
                          <h3 className="font-black text-xl text-white truncate max-w-[200px]">{data.internalHonoree || inv.config?.honoreeName || inv.title}</h3>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${statusColors[pStatus] || statusColors['Pendiente']}`}>{pStatus}</span>
                    </div>
                    <button onClick={() => { if(window.confirm("¿Seguro?")) onDeleteInv(inv.id); }} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg cursor-pointer"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"><Edit2 size={14}/> DISEÑAR</button>
                      <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center hover:bg-violet-100 transition-all border border-violet-100 shadow-sm cursor-pointer"><Eye size={18}/></button>
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} className="w-12 h-12 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm cursor-pointer"><Copy size={18}/></button>
                    </div>
                    <button onClick={() => setActiveCrmId(inv.id)} className="w-full py-3.5 rounded-2xl font-black text-xs flex justify-center items-center gap-2 border bg-white text-violet-600 border-violet-200 hover:bg-violet-50 shadow-sm cursor-pointer"><Lock size={14}/> ABRIR FICHA (CRM)</button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        
        {activeCrmId && activeInv && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop">
              <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center shrink-0">
                 <h2 className="font-black text-xl text-slate-800 flex items-center gap-2"><Lock className="text-violet-500" size={20}/> Gestión Interna</h2>
                 <button onClick={() => setActiveCrmId(null)} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer shadow-sm"><X size={20}/></button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1 bg-white">
                <div className="mb-8">
                   <h3 className="text-xs font-black text-violet-600 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><PartyPopper size={14}/> Datos Principales</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Inp label="Tipo de Evento" value={activeInv.internal_data.eventType || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventType', v)} />
                      <Inp label="Nombre Agasajado" value={activeInv.internal_data.internalHonoree || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalHonoree', v)} />
                      <Inp label="Motivo" value={activeInv.internal_data.eventReason || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventReason', v)} />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Inp label="Fecha (Día/Mes/Año)" type="text" placeholder="Ej: 24/10/2026" icon={CalendarClock} value={activeInv.internal_data.internalDate || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalDate', v)} />
                      <Inp label="Horario (24hs)" type="text" placeholder="Ej: 14:00" icon={Clock} value={activeInv.internal_data.internalTime || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalTime', v)} />
                   </div>
                </div>
                <div className="mb-8">
                   <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><UserCheck size={14}/> Cliente</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Inp label="Nombre Cliente" value={activeInv.internal_data.clientName || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientName', v)} />
                      <div className="flex gap-2 items-end">
                         <Inp label="WhatsApp Cliente" className="flex-1 !mb-0" value={activeInv.internal_data.clientPhone || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientPhone', v)} />
                         <button onClick={() => window.open(`https://wa.me/${activeInv.internal_data.clientPhone}`)} className="h-11 px-4 bg-green-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md"><MessageCircle size={18}/></button>
                      </div>
                   </div>
                </div>
                <div className="mb-8">
                   <h3 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Receipt size={14}/> Finanzas</h3>
                   <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Estado</label>
                        <select className="w-full py-3 px-4 rounded-xl text-slate-800 bg-white border border-gray-200 text-sm focus:border-green-400 outline-none cursor-pointer font-bold" value={activeInv.internal_data.paymentStatus || 'Pendiente'} onChange={e => onUpdateInternal(activeInv.id, 'paymentStatus', e.target.value)}>
                           <option value="Pendiente">🔴 Pendiente</option>
                           <option value="Seña / Parcial">🟡 Seña / Parcial</option>
                           <option value="Pagado Total">🟢 Pagado Total</option>
                        </select>
                      </div>
                      <Inp label="Presupuesto Total" type="number" prefix="$" value={activeInv.internal_data.totalBudget || ''} onChange={v => onUpdateInternal(activeInv.id, 'totalBudget', v)} />
                      <Inp label="Abonado / Seña" type="number" prefix="$" value={activeInv.internal_data.paymentAmount || ''} onChange={v => onUpdateInternal(activeInv.id, 'paymentAmount', v)} />
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saldo Restante</label>
                         <div className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 text-sm font-black text-slate-700 flex items-center gap-1">
                            <span className="text-slate-400">$</span> {(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
                 <button onClick={() => setActiveCrmId(null)} className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm shadow-md cursor-pointer">CERRAR FICHA</button>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative anim-pop text-center">
                <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={16}/></button>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600"><KeyRound size={28}/></div>
                <h2 className="text-xl font-black mb-2">Mi Seguridad</h2>
                <Inp label="Nueva Contraseña" type="text" placeholder="..." value={newPassword} onChange={setNewPassword} />
                <button onClick={handleChangePassword} className="w-full py-3 mt-2 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer">GUARDAR CLAVE</button>
             </div>
          </div>
        )}
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // VISTA MASTER (ADMIN)
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
        <button onClick={() => { onLogout(); navigate("/master"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><LogOut size={18}/></button>
      </nav>
      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div><h1 className="text-4xl font-black text-slate-900 tracking-tight tracking-tight">Gestión de Salones</h1><p className="text-slate-500 mt-2 font-medium font-medium">Administrando {mySalons.length} clientes activos</p></div>
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
                  <div className="flex gap-4"><Inp label="Próximo Vencimiento" type="text" placeholder="Ej: 10/05/2026" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1" /><div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div></div>
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
