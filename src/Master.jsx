import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X
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
  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const mySalons = users.filter(u => u.role === "salon");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  // ==============================
  // VISTA DEL DUEÑO DEL SALÓN (CLIENTE)
  // ==============================
  if (!isOwner) {
    const salonAlert = users.find(u => u.email === user.email)?.paymentAlert;
    return (
      <div className="min-h-screen bg-[#f8f7ff]">
        <nav className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="font-extrabold text-xl">Fiesta<span className="text-violet-600">Digital</span></div>
          <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><LogOut size={18}/></button>
        </nav>
        
        {salonAlert && (
          <div className="bg-red-500 text-white p-4 text-center font-bold text-sm flex items-center justify-center gap-3">
            <AlertTriangle size={18}/> Tu cuenta presenta un atraso en el pago. Por favor regularizá tu situación.
          </div>
        )}

        <div className="max-w-6xl mx-auto p-6 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mis Eventos</h1>
              <p className="text-slate-400 mt-2">Gestionando {myInvs.length} invitaciones</p>
            </div>
            <button onClick={() => { const id = onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer">
              <Plus size={20}/> Crear Invitación
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myInvs.map(inv => (
              <div key={inv.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group text-left relative flex flex-col">
                <button onClick={() => onDeleteInv(inv.id)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Trash2 size={16}/></button>
                <div className="h-44 relative overflow-hidden">
                  <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-7 flex-1">
                  <h3 className="font-black text-xl text-slate-900 mb-6 truncate">{inv.title}</h3>
                  <div className="flex gap-3 mb-6">
                    <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer">EDITAR</button>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} className="w-14 h-14 border border-gray-100 rounded-2xl flex items-center justify-center text-violet-600 hover:bg-violet-50 transition-all cursor-pointer"><Copy size={20}/></button>
                  </div>
                </div>
                <div className="bg-slate-50 p-5 border-t border-gray-100 mt-auto">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Lock size={12}/> Control Interno</p>
                   <div className="flex gap-2">
                     <div className="flex-1"><Inp label="Fecha" type="date" value={inv.internalDate} onChange={v => onUpdateInternal(inv.id, 'internalDate', v)} className="!mb-0"/></div>
                     <div className="w-24"><Inp label="Pago" type="number" value={inv.paymentAmount} onChange={v => onUpdateInternal(inv.id, 'paymentAmount', v)} className="!mb-0"/></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // ==============================
  // VISTA MASTER (ADMIN)
  // ==============================
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'password'
  const [editingEmail, setEditingEmail] = useState("");
  
  // Estados del Formulario de Salón
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPass, setFPass] = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fPayDate, setFPayDate] = useState("");
  const [fAlert, setFAlert] = useState(false);

  const openCreateModal = () => {
    setModalMode("create");
    setFName(""); setFEmail(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false);
    setShowModal(true);
  };

  const openEditModal = (salon) => {
    setModalMode("edit");
    setEditingEmail(salon.email);
    setFName(salon.name); setFEmail(salon.email); setFAddress(salon.address || ""); setFPayDate(salon.paymentDate || ""); setFAlert(salon.paymentAlert || false);
    setShowModal(true);
  };

  const openPassModal = (salon) => {
    setModalMode("password");
    setEditingEmail(salon.email);
    setFPass("");
    setShowModal(true);
  };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Completá nombre, email y contraseña");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, paymentDate: fPayDate, paymentAlert: fAlert, createdAt: new Date().toISOString() });
      notify("Salón creado con éxito");
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, address: fAddress, paymentDate: fPayDate, paymentAlert: fAlert });
      notify("Datos del salón actualizados");
    } else if (modalMode === "password") {
      if(!fPass) return alert("Ingresá una nueva contraseña");
      onUpdateUser(editingEmail, { pass: fPass });
      notify("Contraseña actualizada con éxito");
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="h-16 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="font-extrabold text-xl flex items-center gap-3"><ShieldCheck className="text-violet-400"/> Panel Maestro</div>
        <button onClick={() => { onLogout(); navigate("/master"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><LogOut size={18}/></button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1>
            <p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p>
          </div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer">
            <Plus size={20}/> Nuevo Salón
          </button>
        </div>

        {/* LISTA DE SALONES (SaaS Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-5">Salón / Email</th>
                  <th className="p-5">Ubicación Google Maps</th>
                  <th className="p-5">Vencimiento</th>
                  <th className="p-5">Estado</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {mySalons.map(salon => {
                  const sInvs = invitations.filter(i => i.salonId === salon.email).length;
                  return (
                    <tr key={salon.email} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <p className="font-bold text-slate-900 text-base mb-1">{salon.name}</p>
                        <p className="text-xs text-slate-500">{salon.email}</p>
                        <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mt-2">{sInvs} invitaciones creadas</p>
                      </td>
                      <td className="p-5">
                        <div className="flex items-start gap-2 max-w-[250px]">
                          <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-xs font-medium leading-relaxed">{salon.address || <span className="text-gray-300 italic">No configurada</span>}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <CalendarClock size={16} className="text-slate-400" />
                          <span className="font-bold">{salon.paymentDate ? new Date(salon.paymentDate).toLocaleDateString('es-ES') : '--/--/----'}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        {salon.paymentAlert ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs"><AlertTriangle size={14}/> Moroso</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs"><CheckCircle2 size={14}/> Al día</span>
                        )}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(salon)} title="Editar Datos" className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-slate-600 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all cursor-pointer"><Edit2 size={16}/></button>
                          <button onClick={() => openPassModal(salon)} title="Resetear Contraseña" className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"><KeyRound size={16}/></button>
                          <button onClick={() => { if(window.confirm(`¿Seguro que querés eliminar el salón ${salon.name} y todas sus invitaciones? Esta acción no se puede deshacer.`)) onDeleteSalon(salon.email); }} title="Eliminar Salón" className="w-10 h-10 rounded-xl bg-white border border-red-100 text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {mySalons.length === 0 && (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-medium">Aún no hay salones creados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL MULTIUSO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative anim-pop">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={20}/></button>
            
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              {modalMode === 'create' && <><Building className="text-violet-500"/> Registrar Nuevo Salón</>}
              {modalMode === 'edit' && <><Edit2 className="text-violet-500"/> Editar Salón</>}
              {modalMode === 'password' && <><KeyRound className="text-violet-500"/> Nueva Contraseña</>}
            </h2>

            <div className="space-y-2">
              {/* MODO CREAR O EDITAR */}
              {(modalMode === 'create' || modalMode === 'edit') && (
                <>
                  <Inp label="Nombre del Salón" value={fName} onChange={setFName} placeholder="Ej: Aventura Kids" />
                  <Inp label="Correo de Acceso (No se puede cambiar)" value={fEmail} onChange={modalMode === 'create' ? setFEmail : undefined} placeholder="salon@email.com" className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                  {modalMode === 'create' && <Inp label="Contraseña Inicial" value={fPass} onChange={setFPass} type="password" />}
                  
                  <div className="h-px bg-gray-100 my-6" />
                  <h4 className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-4">Configuración Fija</h4>
                  
                  <Inp label="Dirección para Google Maps (Se fijará en todas sus invitaciones)" value={fAddress} onChange={setFAddress} placeholder="Ej: Av. San Martín 1234, Buenos Aires" />
                  
                  <div className="flex gap-4">
                    <div className="flex-1"><Inp label="Próximo Vencimiento" type="date" value={fPayDate} onChange={setFPayDate} /></div>
                    <div className="flex flex-col items-center justify-center pt-2">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Bloquear Salón</span>
                      <Toggle checked={fAlert} onChange={setFAlert} />
                    </div>
                  </div>
                  {fAlert && <p className="text-[10px] text-red-500 font-bold mt-1 bg-red-50 p-2 rounded-lg text-center">⚠️ El cliente verá un aviso de falta de pago en su panel.</p>}
                </>
              )}

              {/* MODO RESETEAR CONTRASEÑA */}
              {modalMode === 'password' && (
                <>
                  <p className="text-sm text-slate-500 mb-6">Estás cambiando la contraseña de acceso para <b>{editingEmail}</b>. Sus invitaciones no se borrarán.</p>
                  <Inp label="Escribir Nueva Contraseña" value={fPass} onChange={setFPass} type="text" placeholder="Nueva clave alfanumérica..." />
                </>
              )}
            </div>

            <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm transition-transform active:scale-95 cursor-pointer">
              GUARDAR CAMBIOS
            </button>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};
