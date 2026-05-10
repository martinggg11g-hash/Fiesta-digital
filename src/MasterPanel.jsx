import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Plus, MapPin, Edit2, KeyRound, Trash2, X, CalendarClock, AlertCircle } from "lucide-react";
import { Inp, Toggle, Toast } from "./DashboardUI";

const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

// 👉 ACÁ RECIBIMOS LAS PROPS DE LA ALERTA
export const MasterPanel = ({ mySalons, onLogout, onCreateSalon, onUpdateUser, onDeleteSalon, globalAlert, onUpdateAlert }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  // 👉 ESTADOS PARA LA CAJA DE ALERTA DEL MASTER
  const [masterAlertMsg, setMasterAlertMsg] = useState(globalAlert?.mensaje || "");
  const [masterAlertActive, setMasterAlertActive] = useState(globalAlert?.activo || false);

  // Sincronizar si la alerta viene desde la base de datos al cargar
  useEffect(() => {
    setMasterAlertMsg(globalAlert?.mensaje || "");
    setMasterAlertActive(globalAlert?.activo || false);
  }, [globalAlert]);

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
  const [fClabe, setFClabe] = useState(""); 

  const openCreateModal = () => { setModalMode("create"); setFName(""); setFEmail(""); setFPhone(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false); setFClabe(""); setShowModal(true); };
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.payment_date || ""); setFAlert(salon.payment_alert || false); setFClabe(salon.payment_clabe || ""); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Faltan datos");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, payment_date: fPayDate, payment_alert: fAlert, payment_clabe: fClabe });
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, payment_date: fPayDate, payment_alert: fAlert, payment_clabe: fClabe });
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
        
        {/* 👉 NUEVO PANEL DE CONTROL: ALERTA GLOBAL */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-violet-500"></div>
          
          <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-violet-100">
            <AlertCircle size={28}/>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Anuncio Global para Salones</label>
            <input 
              type="text" 
              placeholder="Ej: Mantenimiento programado hoy a las 03:00 AM..." 
              value={masterAlertMsg} 
              onChange={e => setMasterAlertMsg(e.target.value)} 
              className="w-full py-3.5 px-4 rounded-xl text-slate-800 bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all font-medium" 
            />
          </div>
          
          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-center gap-6 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-black uppercase mb-2 text-slate-400">Estado</span>
              <Toggle checked={masterAlertActive} onChange={setMasterAlertActive} />
            </div>
            <button 
              onClick={() => { onUpdateAlert(masterAlertMsg, masterAlertActive); notify("¡Alerta Actualizada!"); }} 
              className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-black transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 uppercase tracking-widest"
            >
              Publicar
            </button>
          </div>
        </div>

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
                      <td className="p-5 font-bold">{salon.payment_date ? formatDateSpanish(salon.payment_date) : '--/--/----'}</td>
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
                  <Inp label="CLABE de Pago Asignada" placeholder="Ej: 012345678901234567" value={fClabe} onChange={setFClabe} />
                  <div className="flex gap-4"><Inp label="Próximo Vencimiento" type="date" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1" /><div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div></div>
                </>
              )}
              {modalMode === 'password' && <Inp label="Escribí Nueva Contraseña" value={fPass} onChange={setFPass} type="password" />}
              <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg">GUARDAR CAMBIOS</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
};
