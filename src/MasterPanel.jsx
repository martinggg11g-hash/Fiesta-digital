import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Plus, MapPin, Edit2, KeyRound, Trash2, X, CalendarClock, AlertCircle, Info, MessageCircle, Send } from "lucide-react";
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

export const MasterPanel = ({ mySalons, onLogout, onCreateSalon, onUpdateUser, onDeleteSalon, globalAlert, onUpdateAlert }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const [masterAlertMsg, setMasterAlertMsg] = useState("");
  const [masterAlertActive, setMasterAlertActive] = useState(false);
  
  // 👉 EL ESCUDO ANTI-RADAR: Solo cargamos la alerta la primera vez que entra
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && globalAlert) {
      setMasterAlertMsg(globalAlert.mensaje || "");
      setMasterAlertActive(globalAlert.activo || false);
      setIsInitialLoad(false); // Apagamos el escudo, ya no se sobreescribe más
    }
  }, [globalAlert, isInitialLoad]);

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
  const [fIsFree, setFIsFree] = useState(false);
  const [fIsDemo, setFIsDemo] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const chatEndRef = useRef(null);

  const activeSalonChat = mySalons.find(s => s.email === editingEmail);

  useEffect(() => {
    if (modalMode === 'support' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [modalMode, activeSalonChat?.support_chat]);

  const openCreateModal = () => { setModalMode("create"); setFName(""); setFEmail(""); setFPhone(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false); setFClabe(""); setFIsFree(false); setFIsDemo(false); setShowModal(true); };
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.payment_date || ""); setFAlert(salon.payment_alert || false); setFClabe(salon.payment_clabe || ""); setFIsFree(salon.is_free || false); setFIsDemo(salon.is_demo || false); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };
  
  const openSupportModal = (salon) => { setModalMode("support"); setEditingEmail(salon.email); setFName(salon.name); setChatInput(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Faltan datos");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, payment_date: fPayDate, payment_alert: fAlert, payment_clabe: fClabe, is_free: fIsFree, is_demo: fIsDemo });
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, payment_date: fPayDate, payment_alert: fAlert, payment_clabe: fClabe, is_free: fIsFree, is_demo: fIsDemo });
    } else if (modalMode === "password") {
      if(!fPass) return alert("Escribe una contraseña");
      onUpdateUser(editingEmail, { pass: fPass });
    }
    setShowModal(false);
    notify(modalMode === 'create' ? "¡Salón creado!" : "¡Cambios guardados!");
  };

  const handleSendMasterReply = () => {
    if (!chatInput.trim() || !activeSalonChat) return;
    const newMsg = { sender: 'master', text: chatInput, date: new Date().toISOString() };
    const newChat = [...(activeSalonChat.support_chat || []), newMsg];
    onUpdateUser(editingEmail, { support_chat: newChat });
    setChatInput("");
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
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-violet-500"></div>
          <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-violet-100">
            <AlertCircle size={28}/>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Anuncio Global para Salones</label>
            <input type="text" placeholder="Ej: Mantenimiento programado hoy a las 03:00 AM..." value={masterAlertMsg} onChange={e => setMasterAlertMsg(e.target.value)} className="w-full py-3.5 px-4 rounded-xl text-slate-800 bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-violet-400 outline-none transition-all font-medium" />
          </div>
          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-center gap-6 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-black uppercase mb-2 text-slate-400">Estado</span>
              <Toggle checked={masterAlertActive} onChange={setMasterAlertActive} />
            </div>
            <button onClick={() => { onUpdateAlert(masterAlertMsg, masterAlertActive); notify("¡Alerta Actualizada!"); }} className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-black transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 uppercase tracking-widest">
              Publicar
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div><h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1><p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p></div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"><Plus size={20}/> Nuevo Salón</button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-5">Salón</th><th className="p-5">Tipo/Ubicación</th><th className="p-5">Vencimiento</th><th className="p-5">Estado</th><th className="p-5 text-right">Acciones</th></tr></thead>
              <tbody className="text-sm">
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
                        <div className="flex flex-col gap-2">
                          {salon.is_free ? (
                             <div className="flex gap-2 items-center text-violet-600 bg-violet-50 px-2 py-1 rounded-md w-fit border border-violet-100"><Info size={12}/> <span className="text-[10px] font-bold uppercase tracking-wider">Libre</span></div>
                          ) : (
                             <div className="flex gap-2 items-center max-w-[150px]"><MapPin size={14} className="text-slate-300 shrink-0"/><span className="text-xs text-slate-600 truncate">{salon.address || 'Sin dirección'}</span></div>
                          )}
                          {salon.is_demo && <div className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md w-fit">Modo Demo</div>}
                        </div>
                      </td>
                      <td className="p-5 font-black text-slate-700">{salon.payment_date ? formatDateSpanish(salon.payment_date) : '--/--/----'}</td>
                      <td className="p-5">{status}</td>
                      <td className="p-5 flex justify-end gap-2">
                        {/* BOTÓN CHAT DE SOPORTE */}
                        <button onClick={() => openSupportModal(salon)} title="Chat de Soporte" className="relative w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 cursor-pointer transition-all shadow-sm">
                           <MessageCircle size={16}/>
                           {salon.support_chat?.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
                        </button>
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
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative anim-pop max-h-[90vh] overflow-y-auto fd-sb">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-8">{modalMode === 'create' ? 'Nuevo Salón' : modalMode === 'edit' ? 'Editar Salón' : modalMode === 'password' ? 'Nueva Clave' : `Chat con ${fName}`}</h2>
            
            <div className="space-y-4">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <>
                  <div className="grid grid-cols-2 gap-3"><Inp label="Nombre" value={fName} onChange={setFName} /><Inp label="WhatsApp" value={fPhone} onChange={setFPhone} /></div>
                  <Inp label="Email" value={fEmail} onChange={setFEmail} className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                  {modalMode === 'create' && <Inp label="Contraseña" value={fPass} onChange={setFPass} type="password" />}
                  
                  <div className="grid grid-cols-2 gap-3 mt-4 mb-2">
                     <div className="p-3 bg-violet-50 border border-violet-100 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase text-violet-700 mb-2">¿Salón Libre?</span>
                        <Toggle checked={fIsFree} onChange={setFIsFree} />
                     </div>
                     <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase text-amber-700 mb-2">¿Modo DEMO?</span>
                        <Toggle checked={fIsDemo} onChange={setFIsDemo} />
                     </div>
                  </div>
                  
                  {!fIsFree && <Inp label="Ubicación Global (Google Maps)" value={fAddress} onChange={setFAddress} className="!mb-0" />}

                  <Inp label="CLABE de Pago Asignada" placeholder="Ej: 012345678901234567" value={fClabe} onChange={setFClabe} />
                  <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-2">
                    <Inp label="Vencimiento Cuota" type="date" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1 !mb-0" />
                    <div className="flex flex-col items-center justify-center shrink-0 border-l border-slate-200 pl-4">
                      <span className="text-[10px] font-black uppercase mb-2 text-red-500 tracking-widest">Bloqueo Manual</span>
                      <Toggle checked={fAlert} onChange={setFAlert} />
                    </div>
                  </div>
                  <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg active:scale-95 transition-transform uppercase tracking-widest">GUARDAR CAMBIOS</button>
                </>
              )}
              
              {modalMode === 'password' && (
                <>
                  <Inp label="Escribí Nueva Contraseña" value={fPass} onChange={setFPass} type="password" />
                  <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg active:scale-95 transition-transform uppercase tracking-widest">GUARDAR CAMBIOS</button>
                </>
              )}

              {modalMode === 'support' && (
                <div className="flex flex-col h-[50vh]">
                   <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3 fd-sb">
                      {!(activeSalonChat?.support_chat?.length) && <p className="text-center text-slate-400 text-xs mt-10 font-bold">No hay mensajes en este chat.</p>}
                      {(activeSalonChat?.support_chat || []).map((msg, i) => (
                          <div key={i} className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.sender === 'master' ? 'bg-violet-600 text-white self-end ml-auto rounded-tr-sm' : 'bg-white border text-slate-800 rounded-tl-sm'}`}>
                             <p className="whitespace-pre-wrap">{msg.text}</p>
                             <span className={`text-[9px] block mt-1.5 opacity-70 ${msg.sender==='master'?'text-right':''}`}>{new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <div className="flex gap-2 shrink-0">
                      <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') handleSendMasterReply();}} placeholder="Responder a tu cliente..." className="flex-1 p-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-500" />
                      <button onClick={handleSendMasterReply} disabled={!chatInput.trim()} className="w-14 h-14 bg-violet-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"><Send size={20}/></button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
};
