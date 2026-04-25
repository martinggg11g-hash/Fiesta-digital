import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2,
  LogOut, UserPlus, Plus, Users, Trash2, Edit2, Copy, X, CheckCircle2, Key, Info, BellRing, Lock
} from "lucide-react";

// Función auxiliar
const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

/* ============================================================================
   MICRO COMPONENTES UI (Se usan en el panel)
============================================================================ */
export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

export const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm resize-none focus:bg-white focus:border-violet-400 outline-none transition-all" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
    )}
  </div>
);

/* ============================================================================
   1. LOGIN SCREEN
============================================================================ */
export const LoginScreen = ({ isMaster = false, onLogin, users }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      if (isMaster && email === "owner@fiestadigital.com" && pass === "owner123") {
        onLogin({ name: "Oswaldo Master", role: "owner", email });
        navigate("/dashboard");
        return;
      }

      const found = users.find(u => u.email === email && u.pass === pass);
      if (found) {
        onLogin(found);
        navigate("/dashboard");
      } else if (!isMaster) {
        setError("Credenciales no válidas.");
      } else {
        setError("Acceso maestro denegado.");
      }
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
          <h1 className="text-white text-3xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Fiesta<span className="text-violet-400">Digital</span></h1>
          <p className="text-slate-500 mt-2 text-sm">{isMaster ? "Administración Central" : "Acceso para Salones"}</p>
        </div>
        <div className="p-10 rounded-[2.5rem]" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <form onSubmit={handleAuth} className="space-y-2">
            {error && (
              <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <Inp label={isMaster ? "Email Maestro" : "Email de Salón"} value={email} onChange={setEmail} placeholder={isMaster ? "owner@..." : "admin@admin.com"} />
            <Inp label="Clave" type="password" value={pass} onChange={setPass} placeholder="••••••" />
            <button disabled={loading} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" /> : "Ingresar al Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. DASHBOARD SCREEN
============================================================================ */
export const DashboardScreen = ({ user, onLogout, users, onUpdateUser, onCreateSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal }) => {
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(null); 
  const [showPassModal, setShowPassModal] = useState(false); 
  const [toast, setToast] = useState("");
  const [invToDelete, setInvToDelete] = useState(null);
  
  const [newSalon, setNewSalon] = useState({ name: "", email: "", pass: "", paymentMethod: "", phone: "" });
  const [newPass, setNewPass] = useState("");

  const navigate = useNavigate();

  // Seguridad
  if (!user) {
    setTimeout(() => navigate("/"), 0);
    return null;
  }

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const salonUsers = users.filter(u => u.role === "salon");

  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  // ---- MASTER ACTIONS ----
  const handleCreateSalon = (e) => {
    e.preventDefault();
    if (!newSalon.name || !newSalon.email || !newSalon.pass) return notify("Completá campos obligatorios.");
    onCreateSalon({ 
      ...newSalon, 
      role: "salon", 
      createdAt: new Date().toLocaleDateString(), 
      paymentAlert: false 
    });
    setShowSalonModal(false); 
    setNewSalon({ name:"", email:"", pass:"", paymentMethod:"", phone:"" });
    notify("Salón creado con éxito.");
  };

  const toggleAlert = (u) => {
    onUpdateUser(u.email, { paymentAlert: !u.paymentAlert });
    notify(u.paymentAlert ? "Alerta quitada" : "Alerta de pago enviada");
  };

  const resetPass = (u) => {
    if(window.confirm(`¿Restablecer contraseña de ${u.name} a 'admin'?`)) {
      onUpdateUser(u.email, { pass: "admin" });
      notify("Contraseña restablecida");
    }
  };

  const saveSalonInfo = (e) => {
    e.preventDefault();
    onUpdateUser(showInfoModal.email, { paymentMethod: showInfoModal.paymentMethod, phone: showInfoModal.phone });
    setShowInfoModal(null);
    notify("Información guardada");
  };

  // ---- SALON ACTIONS ----
  const handlePassChange = (e) => {
    e.preventDefault();
    if(!newPass) return;
    onUpdateUser(user.email, { pass: newPass });
    setShowPassModal(false); 
    setNewPass("");
    notify("Contraseña actualizada");
  };

  const handleCreateInv = () => {
    const newId = onCreateInv(user.email, user.name);
    navigate(`/editor/${newId}`);
  };

  const copy = id => {
    const url = `${window.location.origin}/i/${slugify(user.name)}/${id}`;
    const el = document.createElement('textarea'); 
    el.value = url; 
    document.body.appendChild(el); 
    el.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(el);
    notify("¡Link copiado!");
  };

  const amIAlerted = !isOwner && users.find(u => u.email === user.email)?.paymentAlert;

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {amIAlerted && (
        <div className="bg-red-500 text-white p-3 text-center font-bold text-sm flex justify-center items-center gap-2">
          <AlertCircle size={18}/> ATENCIÓN: Registramos un pago pendiente en tu cuenta. Por favor regulariza tu suscripción.
        </div>
      )}

      <nav className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-extrabold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>Fiesta<span className="text-violet-600">Digital</span></div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-800">{user.name}</p>
            <p className="text-[9px] text-violet-500 font-black uppercase tracking-widest">{isOwner ? "Dueño" : "Socio"}</p>
          </div>
          {!isOwner && <button onClick={() => setShowPassModal(true)} className="p-2 text-slate-400 hover:text-violet-600 cursor-pointer"><Key size={18}/></button>}
          <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"><LogOut size={18}/></button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{isOwner ? "Panel Maestro" : "Mis Eventos"}</h1>
            <p className="text-slate-400 mt-2">{isOwner ? `Gestionando ${salonUsers.length} socios activos` : `Tenés ${myInvs.length} invitaciones creadas`}</p>
          </div>
          <button onClick={isOwner ? () => setShowSalonModal(true) : handleCreateInv} className="px-8 py-4 bg-violet-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-violet-200 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer">
            {isOwner ? <UserPlus size={20}/> : <Plus size={20}/>} {isOwner ? "Nuevo Salón" : "Crear Invitación"}
          </button>
        </div>

        {isOwner ? (
          /* ================= VISTA DUEÑO ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salonUsers.map(s => (
              <div key={s.email} className={`bg-white p-8 rounded-[2.5rem] border ${s.paymentAlert ? 'border-red-200 shadow-red-100' : 'border-gray-100'} shadow-sm hover:shadow-xl transition-all group text-left`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors"><Users size={28}/></div>
                  {s.paymentAlert ? <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><AlertCircle size={10}/> Falta Pago</span> : <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Al Día</span>}
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-1">{s.name}</h3>
                <p className="text-xs text-slate-400 mb-1">{s.email}</p>
                <p className="text-xs text-slate-400 mb-6">Alta: {s.createdAt || 'N/A'}</p>
                
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                  <button onClick={() => setShowInfoModal(s)} className="px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-100 flex-1 cursor-pointer"><Info size={14} className="mx-auto mb-1"/> Info</button>
                  <button onClick={() => toggleAlert(s)} className={`px-3 py-2 rounded-lg text-[10px] font-bold flex-1 cursor-pointer ${s.paymentAlert ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-orange-50 text-orange-500 hover:bg-orange-100'}`}><BellRing size={14} className="mx-auto mb-1"/> Alerta</button>
                  <button onClick={() => resetPass(s)} className="px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-100 flex-1 cursor-pointer"><Key size={14} className="mx-auto mb-1"/> Reset</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= VISTA SALÓN ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myInvs.map(inv => (
              <div key={inv.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group text-left relative flex flex-col">
                <button onClick={() => setInvToDelete(inv.id)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500/90 backdrop-blur text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 shadow-lg"><Trash2 size={16}/></button>
                <div className="h-44 relative overflow-hidden shrink-0">
                  <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-7 flex-1">
                  <h3 className="font-black text-xl text-slate-900 mb-6 truncate">{inv.title}</h3>
                  <div className="flex gap-3 mb-6">
                    <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-violet-600 transition-colors cursor-pointer"><Edit2 size={14}/> Editar</button>
                    <button onClick={() => copy(inv.id)} className="w-14 h-14 border border-gray-100 rounded-2xl flex items-center justify-center text-violet-600 hover:bg-violet-50 transition-all cursor-pointer"><Copy size={20}/></button>
                  </div>
                </div>
                
                {/* Control Interno Exclusivo del Salón */}
                <div className="bg-slate-50 p-5 border-t border-gray-100 mt-auto">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Lock size={12}/> Control Interno</p>
                   <div className="flex gap-2 mb-2">
                     <div className="flex-1"><Inp label="Fecha/Hora Real" type="datetime-local" value={inv.internalDate} onChange={v => onUpdateInternal(inv.id, 'internalDate', v)} className="!mb-0"/></div>
                     <div className="w-24"><Inp label="Invitados" type="number" value={inv.internalGuests} onChange={v => onUpdateInternal(inv.id, 'internalGuests', v)} className="!mb-0"/></div>
                   </div>
                   <Inp label="Aclaraciones del cliente" multiline value={inv.internalNotes} onChange={v => onUpdateInternal(inv.id, 'internalNotes', v)} className="!mb-0"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODALES ================= */}
      {showSalonModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>Nuevo Socio</h2>
              <button onClick={() => setShowSalonModal(false)} className="text-slate-300 hover:text-slate-600 cursor-pointer"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreateSalon}>
              <Inp label="Nombre del Salón" value={newSalon.name} onChange={v => setNewSalon({...newSalon, name:v})} placeholder="Ej: Aventura Kids" />
              <Inp label="Email de Acceso" value={newSalon.email} onChange={v => setNewSalon({...newSalon, email:v})} placeholder="salon@mail.com" />
              <Inp label="Clave Temporal" value={newSalon.pass} onChange={v => setNewSalon({...newSalon, pass:v})} placeholder="123456" />
              <div className="grid grid-cols-2 gap-2">
                 <Inp label="Teléfono" value={newSalon.phone} onChange={v => setNewSalon({...newSalon, phone:v})} placeholder="112233..." />
                 <Inp label="Método de Pago" value={newSalon.paymentMethod} onChange={v => setNewSalon({...newSalon, paymentMethod:v})} placeholder="Transf." />
              </div>
              <button className="w-full py-5 mt-2 bg-violet-600 hover:bg-violet-500 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-violet-200 cursor-pointer transition-colors">CREAR CUENTA</button>
            </form>
          </div>
        </div>
      )}

      {showInfoModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Info: {showInfoModal.name}</h2>
              <button onClick={() => setShowInfoModal(null)} className="cursor-pointer"><X size={20}/></button>
            </div>
            <form onSubmit={saveSalonInfo}>
               <Inp label="Email" value={showInfoModal.email} onChange={()=>{}} className="opacity-50 pointer-events-none" />
               <Inp label="Teléfono Contacto" value={showInfoModal.phone} onChange={v => setShowInfoModal({...showInfoModal, phone:v})} />
               <Inp label="Método de Pago (Manual)" value={showInfoModal.paymentMethod} onChange={v => setShowInfoModal({...showInfoModal, paymentMethod:v})} />
               <button className="w-full py-4 mt-2 bg-violet-600 text-white rounded-2xl font-bold cursor-pointer">Guardar Datos</button>
            </form>
          </div>
        </div>
      )}

      {showPassModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center">
            <h2 className="text-xl font-black text-slate-900 mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handlePassChange}>
               <Inp label="Nueva Contraseña" type="password" value={newPass} onChange={setNewPass} placeholder="••••••" />
               <div className="flex gap-3 mt-4">
                 <button onClick={() => setShowPassModal(false)} type="button" className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold cursor-pointer hover:bg-gray-200">Cancelar</button>
                 <button type="submit" className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-bold cursor-pointer shadow-lg shadow-violet-200">Actualizar</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {invToDelete && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={24}/></div>
            <h2 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>¿Eliminar invitación?</h2>
            <p className="text-sm text-slate-500 mb-8">Esta acción no se puede deshacer y el link dejará de funcionar.</p>
            <div className="flex gap-3">
              <button onClick={() => setInvToDelete(null)} type="button" className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold cursor-pointer hover:bg-gray-200">Cancelar</button>
              <button onClick={() => { onDeleteInv(invToDelete); setInvToDelete(null); }} type="button" className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold cursor-pointer hover:bg-red-600 shadow-lg shadow-red-500/30">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};
