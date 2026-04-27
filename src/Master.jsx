import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X, MessageCircle, ExternalLink, Eye, Search
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10 anim-pop">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all resize-none" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all" />
    )}
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
  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const mySalons = users.filter(u => u.role === "salon");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  // Filtrado de invitaciones para el buscador
  const filteredInvs = myInvs.filter(inv => inv.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // ==============================
  // VISTA DEL DUEÑO DEL SALÓN (CLIENTE) REDISEÑADA
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
      const today = new Date(); today.setHours(0,0,0,0);
      const dueDate = new Date(paymentDateStr); dueDate.setHours(0,0,0,0); dueDate.setDate(dueDate.getDate() + 1);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) { alertType = 'red'; alertMsg = `Abono vencido el ${dueDate.toLocaleDateString('es-ES')}. Regularizá el pago pronto.`; }
      else if (diffDays <= 5) { alertType = 'yellow'; alertMsg = `Recordatorio: Tu pago vence en ${diffDays} días (${dueDate.toLocaleDateString('es-ES')}).`; }
    }

    return (
      <div className="min-h-screen bg-[#f1f3f9]">
        {/* NAV PREMIUM */}
        <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200"><PartyPopper size={22}/></div>
             <div className="font-black text-xl tracking-tight text-slate-800">Fiesta<span className="text-violet-600">Digital</span></div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sesión Iniciada</p>
                <p className="text-sm font-bold text-slate-700 leading-none">{user.name}</p>
             </div>
             <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><LogOut size={18}/></button>
          </div>
        </nav>
        
        {alertMsg && (
          <div className={`${alertType === 'red' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'} p-3 text-center font-bold text-xs flex items-center justify-center gap-3 shadow-inner`}>
            <AlertTriangle size={16}/> {alertMsg}
          </div>
        )}

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          {/* HEADER DASHBOARD */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Mis Eventos</h1>
              <p className="text-slate-500 mt-1 font-medium italic">Creá y gestioná las invitaciones de tus clientes.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18}/>
                  <input 
                    className="pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none w-64 transition-all" 
                    placeholder="Buscar evento..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button onClick={() => { const id = onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-violet-200 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
                 <Plus size={20}/> Crear Invitación
               </button>
            </div>
          </div>

          {/* GRID DE EVENTOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInvs.map(inv => (
              <div key={inv.id} className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/10">
                
                {/* PREVIEW IMAGE */}
                <div className="h-48 relative overflow-hidden">
                  <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Event" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6">
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest">ID: {inv.id}</span>
                  </div>
                  <button onClick={() => onDeleteInv(inv.id)} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg cursor-pointer"><Trash2 size={16}/></button>
                </div>

                {/* CONTENT */}
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-black text-xl text-slate-800 mb-2 truncate">{inv.title}</h3>
                  <div className="flex items-center gap-2 mb-8">
                     <CalendarClock size={14} className="text-slate-400"/>
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Creado el {new Date().toLocaleDateString('es-AR')}</span>
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                      <Edit2 size={14}/> EDITAR
                    </button>
                    <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} title="Ver en vivo" className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center hover:bg-violet-100 transition-all cursor-pointer border border-violet-100">
                      <Eye size={20}/>
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} title="Copiar Link" className="w-14 h-14 bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer">
                      <Copy size={20}/>
                    </button>
                  </div>

                  {/* CONTROL INTERNO REDISEÑADO */}
                  <div className="mt-auto pt-6 border-t border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic"><Lock size={12}/> Info de Gestión</p>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                           <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Fecha de Fiesta</label>
                           <input 
                              type="date" 
                              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none focus:text-violet-600 transition-colors" 
                              value={inv.internalDate} 
                              onChange={v => onUpdateInternal(inv.id, 'internalDate', v.target.value)}
                           />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                           <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Abonado ($)</label>
                           <input 
                              type="number" 
                              placeholder="0"
                              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none focus:text-green-600 transition-colors" 
                              value={inv.paymentAmount} 
                              onChange={v => onUpdateInternal(inv.id, 'paymentAmount', v.target.value)}
                           />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInvs.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6 opacity-50"><Search size={40}/></div>
                <p className="text-slate-500 font-bold">No se encontraron invitaciones.</p>
                <p className="text-slate-400 text-sm mt-1">Intentá con otro nombre o creá una nueva.</p>
             </div>
          )}
        </main>
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // ==============================
  // VISTA MASTER (ADMIN) - SE MANTIENE IGUAL
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
                     const today = new Date(); today.setHours(0,0,0,0);
                     const due = new Date(salon.paymentDate); due.setHours(0,0,0,0); due.setDate(due.getDate() + 1);
                     const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                     if (diff < 0) statusUi = <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Vencido</span>;
                     else if (diff <= 5) statusUi = <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">Vence pronto</span>;
                  }
                  return (
                    <tr key={salon.email} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-900">{salon.name}</p>
                        <p className="text-xs text-slate-500">{salon.email}</p>
                      </td>
                      <td className="p-5"><div className="flex items-start gap-2 max-w-[200px]"><MapPin size={16} className="text-slate-300"/><span className="text-xs truncate">{salon.address || 'N/A'}</span></div></td>
                      <td className="p-5 font-bold">{salon.paymentDate ? new Date(salon.paymentDate).toLocaleDateString('es-AR') : '--'}</td>
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
                <div className="flex gap-4"><Inp label="Próximo Vencimiento" type="date" value={fPayDate} onChange={setFPayDate} className="flex-1" /><div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div></div>
              </div>
            )}
            {modalMode === 'password' && <Inp label="Nueva Contraseña" value={fPass} onChange={setFPass} />}
            <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm">GUARDAR CAMBIOS</button>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
};
