import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Plus, MapPin, Edit2, KeyRound, Trash2, X, AlertCircle, CalendarClock } from "lucide-react";
import { Inp, Toggle, Toast } from "./DashboardUI";

export const MasterPanel = ({ mySalons, onLogout, onCreateSalon, onUpdateUser, onDeleteSalon, globalAlert, onUpdateAlert }) => {
  const navigate = useNavigate();
  
  // 👉 ESTADOS PARA LA CAJA DE ALERTA DEL MASTER
  const [masterAlertMsg, setMasterAlertMsg] = useState(globalAlert?.mensaje || "");
  const [masterAlertActive, setMasterAlertActive] = useState(globalAlert?.activo || false);

  // Sincronizar si la alerta viene desde la base de datos al cargar
  useEffect(() => {
    setMasterAlertMsg(globalAlert?.mensaje || "");
    setMasterAlertActive(globalAlert?.activo || false);
  }, [globalAlert]);

  // Estados del Modal (Crear, Editar, Clave)
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
  
  const [toast, setToast] = useState("");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const openCreateModal = () => { setModalMode("create"); setFName(""); setFEmail(""); setFPhone(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false); setShowModal(true); };
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.payment_date || ""); setFAlert(salon.payment_alert || false); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Faltan datos requeridos");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "password") {
      if(!fPass) return alert("Escribe una contraseña");
      onUpdateUser(editingEmail, { pass: fPass });
    }
    setShowModal(false);
    notify(modalMode === 'create' ? "¡Salón creado!" : "¡Cambios guardados!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-left pb-20">
      <nav className="h-20 bg-slate-950 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 text-white shadow-xl">
        <div className="font-black text-2xl flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center"><ShieldCheck className="text-violet-400" size={24}/></div>
          Panel Maestro
        </div>
        <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><LogOut size={18}/></button>
      </nav>
      
      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        
        {/* 👉 PANEL DE CONTROL: ALERTA GLOBAL */}
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1>
            <p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p>
          </div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"><Plus size={20}/> Nuevo Salón</button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salón</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimiento</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mySalons.length === 0 && (
                   <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-medium">No hay salones creados aún.</td></tr>
                )}
                {mySalons.map(salon => {
                  let status = <span className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-black text-[10px] uppercase tracking-widest">Al día</span>;
                  if (salon.payment_alert) status = <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest">Atrasado</span>;
                  
                  return (
                    <tr key={salon.email} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <p className="font-black text-slate-800 text-base">{salon.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{salon.email}</p>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2 items-center max-w-[200px]">
                          <MapPin size={16} className="text-slate-300 shrink-0"/>
                          <span className="text-sm text-slate-600 truncate">{salon.address || 'Sin dirección'}</span>
                        </div>
                      </td>
                      <td className="p-5 font-black text-slate-700">{salon.payment_date || '--/--/----'}</td>
                      <td className="p-5">{status}</td>
                      <td className="p-5 flex justify-end gap-2">
                        <button onClick={() => openEditModal(salon)} title="Editar Salón" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 cursor-pointer transition-all shadow-sm"><Edit2 size={16}/></button>
                        <button onClick={() => openPassModal(salon)} title="Cambiar Contraseña" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all shadow-sm"><KeyRound size={16}/></button>
                        <button onClick={() => window.confirm("¿Estás seguro de eliminar este salón y todas sus invitaciones? Esta acción no se puede deshacer.") && onDeleteSalon(salon.email)} title="Eliminar Salón" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:border-red-300 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-all shadow-sm"><Trash2 size={16}/></button>
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
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-8 tracking-tight">{modalMode === 'create' ? 'Nuevo Salón' : modalMode === 'edit' ? 'Editar Salón' : 'Actualizar Clave'}</h2>
            
            <div className="space-y-4">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Inp label="Nombre del Salón" value={fName} onChange={setFName} />
                    <Inp label="WhatsApp" placeholder="+54 9 11..." value={fPhone} onChange={setFPhone} />
                  </div>
                  <Inp label="Correo de Acceso" value={fEmail} onChange={setFEmail} className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                  {modalMode === 'create' && <Inp label="Contraseña Inicial" value={fPass} onChange={setFPass} type="password" />}
                  <Inp label="Ubicación (Google Maps o Texto)" placeholder="Calle Falsa 123..." value={fAddress} onChange={setFAddress} />
                  
                  <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-2">
                    <Inp label="Vencimiento Cuota" type="text" placeholder="Ej: 10/05/2026" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1 !mb-0" />
                    <div className="flex flex-col items-center justify-center shrink-0 border-l border-slate-200 pl-4">
                      <span className="text-[10px] font-black uppercase mb-2 text-red-500 tracking-widest">Bloqueo Manual</span>
                      <Toggle checked={fAlert} onChange={setFAlert} />
                    </div>
                  </div>
                </>
              )}
              
              {modalMode === 'password' && (
                <div className="py-4">
                   <p className="text-sm text-slate-500 mb-6">Estás cambiando la contraseña de acceso para el salón <strong className="text-slate-800">{fName}</strong> ({editingEmail}).</p>
                   <Inp label="Nueva Contraseña" value={fPass} onChange={setFPass} type="text" />
                </div>
              )}
              
              <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm cursor-pointer shadow-xl transition-transform active:scale-95 tracking-widest uppercase">
                {modalMode === 'create' ? 'Crear Salón' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {toast && <Toast msg={toast} />}
    </div>
  );
};
