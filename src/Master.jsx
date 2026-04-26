import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper, ShieldCheck, AlertCircle, Loader2, LogOut, UserPlus, Plus, Users, Trash2, Edit2, Copy, X, CheckCircle2, Key, Info, BellRing, Lock, DollarSign
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="" }) => (
  <div className={`mb-4 text-left ${className}`}>
    {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {multiline ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white outline-none transition-all" />
    ) : (
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-slate-800 bg-gray-50 border border-gray-200 text-sm focus:bg-white outline-none transition-all" />
    )}
  </div>
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
        onLogin({ name: "Oswaldo Master", role: "owner", email });
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
            <button className="w-full py-4 mt-2 bg-violet-600 text-white rounded-2xl font-black text-sm">INGRESAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const DashboardScreen = ({ user, onLogout, users, onUpdateUser, onCreateSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal }) => {
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <nav className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="font-extrabold text-xl">Fiesta<span className="text-violet-600">Digital</span></div>
        <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><LogOut size={18}/></button>
      </nav>

      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{isOwner ? "Panel Maestro" : "Mis Eventos"}</h1>
            <p className="text-slate-400 mt-2">Gestionando {myInvs.length} invitaciones</p>
          </div>
          <button onClick={() => { const id = onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-4 bg-violet-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl flex items-center gap-3">
            <Plus size={20}/> Crear Invitación
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myInvs.map(inv => (
            <div key={inv.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group text-left relative flex flex-col">
              <button onClick={() => onDeleteInv(inv.id)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
              <div className="h-44 relative overflow-hidden">
                <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              <div className="p-7 flex-1">
                <h3 className="font-black text-xl text-slate-900 mb-6 truncate">{inv.title}</h3>
                <div className="flex gap-3 mb-6">
                  <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2">EDITAR</button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("Link Copiado!"); }} className="w-14 h-14 border border-gray-100 rounded-2xl flex items-center justify-center text-violet-600 hover:bg-violet-50 transition-all"><Copy size={20}/></button>
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
};
