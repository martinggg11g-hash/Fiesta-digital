import React, { useState, useEffect } from "react";
import { 
  X, ClipboardList, Users, FileText, Printer, UserCheck, MessageCircle, 
  PartyPopper, CalendarClock, Clock, AlertTriangle, Receipt, Smartphone, 
  Copy, CheckCircle2, Plus, FileDown, Edit2, Trash2 
} from "lucide-react";
import { Inp, Toggle } from "./DashboardUI";
import { supabase } from "./supabase";

const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

const getTodaySpanish = () => {
  const today = new Date();
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;
};

export const CrmModal = ({ activeInv, onClose, user, salonInfo, onUpdateInternal, isDark }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [printMode, setPrintMode] = useState("ficha");
  
  // Estados para la gestión de invitados manuales
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(1);
  const [gStatus, setGStatus] = useState("Pendiente");

  // Botones de copiado
  const [copiedStates, setCopiedStates] = useState({});

  // 🚀 NUEVO: Estado para los invitados VIP reales de Supabase
  const [vipGuests, setVipGuests] = useState([]);
  
  // Invitados cargados a mano (los viejos)
  const manualGuests = activeInv?.internal_data?.guests || [];

  // Buscar el evento en la tabla nueva y traer sus invitados VIP
  useEffect(() => {
    const fetchVipGuests = async () => {
      // 1. Buscamos el ID interno del evento usando el slug (que es el ID del dashboard)
      const { data: eventData } = await supabase
        .from('eventos')
        .select('id')
        .eq('slug', activeInv.id)
        .single();

      if (eventData) {
        // 2. Traemos todos los invitados de ese evento
        const { data: guestsData } = await supabase
          .from('invitados')
          .select('*')
          .eq('evento_id', eventData.id)
          .order('created_at', { ascending: false });
          
        if (guestsData) setVipGuests(guestsData);
      }
    };
    
    if (activeTab === 'guests') {
      fetchVipGuests();
    }
  }, [activeInv.id, activeTab]);

  // UNIFICAMOS AMBAS LISTAS PARA MOSTRARLAS JUNTAS
  const allGuests = [
    ...manualGuests,
    ...vipGuests.map(vg => ({
      id: vg.id,
      name: vg.nombre_completo,
      lastname: vg.apodo ? `(${vg.apodo})` : '',
      guests: vg.acompanantes_confirmados > 0 ? vg.acompanantes_confirmados : vg.max_acompanantes,
      status: vg.asistencia_confirmada ? 'Confirmado' : 'Pendiente',
      timestamp: vg.created_at,
      isVip: true // Marca para saber que viene de la base de datos nueva
    }))
  ];

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 200); 
  };

  const openNewGuest = () => {
    setEditingGuest(null);
    setGName(""); setGLastname(""); setGPax(1); setGStatus("Pendiente");
    setShowGuestModal(true);
  };
  
  const openEditGuest = (g) => {
    if (g.isVip) return alert("Los invitados VIP los gestiona el cliente desde su panel.");
    setEditingGuest(g);
    setGName(g.name); setGLastname(g.lastname); setGPax(g.guests); setGStatus(g.status);
    setShowGuestModal(true);
  };

  const saveGuest = () => {
    if(!gName) return alert("Falta nombre");
    let newList = [...manualGuests];
    if (editingGuest) {
      newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus } : g);
    } else {
      const fakeId = `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, timestamp: new Date().toISOString() });
    }
    onUpdateInternal(activeInv.id, 'guests', newList);
    setShowGuestModal(false);
  };

  const deleteGuest = async (g) => {
    if(!window.confirm("¿Seguro que querés borrar a este invitado? El QR dejará de funcionar.")) return;
    
    if (g.isVip) {
      // Borrar de Supabase
      await supabase.from('invitados').delete().eq('id', g.id);
      setVipGuests(vipGuests.filter(v => v.id !== g.id));
    } else {
      // Borrar de Manuales
      const newList = manualGuests.filter(mg => mg.id !== g.id);
      onUpdateInternal(activeInv.id, 'guests', newList);
    }
  };

  const handleExportCSV = () => {
    if(allGuests.length === 0) return alert("No hay invitados aún.");
    let csv = "ID Pase,Nombre Completo,Acompañantes,Estado,Fecha de Registro\n";
    allGuests.forEach(g => {
      csv += `${g.id},${g.name} ${g.lastname},${g.guests},${g.status},${new Date(g.timestamp).toLocaleDateString('es-AR')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Invitados_${activeInv.title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className={`w-full max-w-5xl max-h-[95vh] h-full sm:h-auto rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
           <div className="flex gap-4 border border-slate-300 rounded-xl p-1 bg-slate-100">
             <button onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'info' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><ClipboardList size={14} className="inline-block mr-1"/> Ficha Interna</button>
             <button onClick={() => setActiveTab('guests')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'guests' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><Users size={14} className="inline-block mr-1"/> Invitados</button>
           </div>
           <button onClick={onClose} className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-2"><X size={20}/></button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1 relative">
          
          {/* PESTAÑA FICHA INTERNA */}
          {activeTab === 'info' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-end gap-2 mb-6">
                <button onClick={() => handlePrint('presupuesto')} className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"><FileText size={14}/> Imprimir Presupuesto</button>
                <button onClick={() => handlePrint('ficha')} className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"><Printer size={14}/> Imprimir Ficha</button>
              </div>
              
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
                    <Inp label="Servicios Solicitados" placeholder="Ej: DJ, Fotógrafo, Show de Magia..." multiline value={activeInv.internal_data.requestedServices || ''} onChange={v => onUpdateInternal(activeInv.id, 'requestedServices', v)} isDark={isDark} />
                    <Inp label="Menús Especiales / Alergias" placeholder="Ej: 2 Celíacos, 1 Vegano..." multiline value={activeInv.internal_data.specialMenus || ''} onChange={v => onUpdateInternal(activeInv.id, 'specialMenus', v)} isDark={isDark} />
                 </div>
                 <Inp label="Notas Internas (Privadas)" placeholder="Anotaciones para la cocina o administración..." multiline className="mt-2" value={activeInv.internal_data.internalNotes || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalNotes', v)} isDark={isDark} />
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
          )}

          {/* PESTAÑA LISTA DE INVITADOS CON CRUD Y APP RECEPCIONISTA */}
          {activeTab === 'guests' && (
            <div className="animate-in fade-in duration-300">
              
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-blue-800 font-black text-base mb-1 flex items-center gap-2"><Smartphone size={18}/> App de Recepción (Puerta)</h4>
                  <p className="text-blue-600 text-xs font-medium max-w-lg">Enviale este acceso a tu empleado. Desde ahí solo podrá usar el escáner de QR y ver la lista de ingreso.</p>
                </div>
                <button onClick={() => handleCopyLink(`puerta-${activeInv.id}`, `${window.location.origin}/puerta/${activeInv.id}`)} className={`px-6 py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 ${copiedStates[`puerta-${activeInv.id}`] ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}`}>
                  {copiedStates[`puerta-${activeInv.id}`] ? "¡COPIADO! ✅" : <><Copy size={16}/> COPIAR LINK</>}
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-t border-slate-200/50 pt-6">
                <div>
                  <h3 className={`font-black text-xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}><Users className="text-violet-500" size={24}/> Control de Accesos</h3>
                  <p className="text-slate-500 text-sm mt-1">Total de asistentes registrados: <strong className="text-violet-600">{allGuests.reduce((acc, g) => acc + Number(g.guests || 0), 0)}</strong></p>
                </div>
                <div className="flex flex-wrap gap-2">
                   <button onClick={openNewGuest} className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"><Plus size={16}/> AGREGAR A MANO</button>
                   <button onClick={() => handlePrint('invitados')} className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"><Printer size={16}/> IMPRIMIR</button>
                   <button onClick={handleExportCSV} className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"><FileDown size={16}/> EXCEL</button>
                </div>
              </div>

              {allGuests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">Todavía no hay invitados registrados.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-3xl overflow-x-auto shadow-sm">
                  <table className="w-full text-left bg-white min-w-[600px]">
                    <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-4 border-b">Invitado</th><th className="p-4 border-b text-center">Pase VIP ID</th><th className="p-4 border-b text-center">Personas</th><th className="p-4 border-b text-center">Estado</th><th className="p-4 border-b text-right">Acciones</th></tr></thead>
                    <tbody className="text-sm">
                      {allGuests.map((g, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">
                            {g.name} {g.lastname} {g.isVip && <span className="ml-2 text-[8px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase tracking-widest">VIP App</span>}
                            <br/><span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">{new Date(g.timestamp).toLocaleDateString('es-AR')}</span>
                          </td>
                          <td className="p-4 text-center"><code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 font-mono">{g.id.split('-').pop()}</code></td>
                          <td className="p-4 text-center font-black text-slate-600">{g.guests}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${g.status === 'Confirmado' || g.status === 'Ingresó' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-2">
                             <button onClick={() => openEditGuest(g)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${g.isVip ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 cursor-pointer'}`} title={g.isVip ? "Se edita desde la App del Cliente" : "Editar"}><Edit2 size={14}/></button>
                             <button onClick={() => deleteGuest(g)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors"><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MODAL CREAR/EDITAR INVITADO MANUAL */}
          {showGuestModal && (
            <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className={`w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative text-center anim-pop ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <button onClick={() => setShowGuestModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={16}/></button>
                  <h3 className={`font-black text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{editingGuest ? 'Editar Invitado' : 'Agregar Invitado Manual'}</h3>
                  <div className="space-y-2">
                     <Inp label="Nombre" value={gName} onChange={setGName} isDark={isDark} />
                     <Inp label="Apellido" value={gLastname} onChange={setGLastname} isDark={isDark} />
                     <div className="flex gap-2">
                       <div className="flex-1"><Inp label="Cantidad" type="number" value={gPax} onChange={v => setGPax(v)} isDark={isDark} /></div>
                       <div className="flex-1">
                         <label className={`block text-[10px] font-black uppercase mb-1.5 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</label>
                         <select className={`w-full py-3 px-4 rounded-xl text-sm outline-none cursor-pointer border ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-slate-800 border-gray-200'}`} value={gStatus} onChange={e => setGStatus(e.target.value)}>
                           <option value="Pendiente">Pendiente</option>
                           <option value="Confirmado">Confirmado</option>
                           <option value="Ingresó">Ingresó</option>
                         </select>
                       </div>
                     </div>
                     <button onClick={saveGuest} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-md">GUARDAR</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- LA HOJA A4 PARA IMPRIMIR (DOBLE PLANTILLA) ---------------- */}
      <div className="hidden only-print w-full bg-white text-black font-sans max-w-4xl mx-auto">
         {printMode !== 'invitados' ? (
           <>
             <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-6">
                  {salonInfo?.logo ? <img src={salonInfo.logo} className="max-h-24 max-w-[200px] object-contain" alt="Logo" /> : <div className="text-3xl font-black tracking-tighter text-slate-900">{user.name}</div>}
                  <div>
                    {salonInfo?.logo && <h1 className="text-xl font-black text-slate-900 m-0 leading-none mb-1">{user.name}</h1>}
                    <p className="text-slate-600 text-sm">{salonInfo?.address || 'Sin dirección registrada'}</p>
                    <p className="text-slate-600 text-sm">{salonInfo?.phone || 'Sin teléfono'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase mb-1">{printMode === 'presupuesto' ? 'PRESUPUESTO' : 'FICHA DE EVENTO'}</h2>
                  <p className="text-sm font-bold text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-lg border border-slate-200">Ref: {activeInv.id.split('-')[1]?.toUpperCase()}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">1. Detalles del Evento</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Agasajado:</span> <span className="font-black text-lg">{activeInv.internal_data.internalHonoree || '---'}</span></p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Tipo:</span> {activeInv.internal_data.eventType || '---'}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Fecha:</span> {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Horario:</span> {activeInv.internal_data.internalTime || '---'} hs</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">2. Datos del Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Nombre:</span> <span className="font-bold">{activeInv.internal_data.clientName || '---'}</span></p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Teléfono:</span> {activeInv.internal_data.clientPhone || '---'}</p>
                    <p><span className="font-bold text-slate-700 w-24 inline-block">Invitados Aprox:</span> {activeInv.internal_data.guestCount || '---'} personas</p>
                  </div>
                </div>
             </div>

             <div className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">3. Servicios Incluidos</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><p className="font-black text-slate-700 mb-1">Servicios Solicitados:</p><p className="whitespace-pre-wrap">{activeInv.internal_data.requestedServices || 'Ninguno especificado.'}</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><p className="font-black text-slate-700 mb-1">Menús Especiales / Alergias:</p><p className="whitespace-pre-wrap">{activeInv.internal_data.specialMenus || 'Ninguno especificado.'}</p></div>
                </div>
                {printMode === 'ficha' && <div className="mt-4 p-4 border border-slate-300 rounded-xl bg-yellow-50"><p className="font-black text-slate-700 mb-1 flex items-center gap-2"><AlertTriangle size={14}/> Notas Internas del Salón:</p><p className="whitespace-pre-wrap italic text-slate-600">{activeInv.internal_data.internalNotes || 'Sin observaciones.'}</p></div>}
             </div>

             <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">{printMode === 'presupuesto' ? '4. Detalle de Valores' : '4. Estado Financiero Interno'}</h3>
                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-500">Valor Total</p><p className="text-2xl font-bold text-slate-800">${Number(activeInv.internal_data.totalBudget || 0).toLocaleString('es-AR')}</p></div>
                  <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-500">Abonado / Seña</p><p className="text-2xl font-bold text-green-700">${Number(activeInv.internal_data.paymentAmount || 0).toLocaleString('es-AR')}</p></div>
                  <div className="text-center bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg"><p className="text-[10px] font-black uppercase text-slate-300 opacity-80">Saldo Pendiente</p><p className="text-3xl font-black">${(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}</p></div>
                </div>
             </div>
             
             <div className="mt-16 text-center text-xs text-slate-400 font-bold border-t border-slate-200 pt-4">{printMode === 'presupuesto' ? <p>Documento emitido el {getTodaySpanish()} • Los valores expresados pueden estar sujetos a modificaciones.</p> : <p>Hoja de ruta interna generada el {getTodaySpanish()}</p>}</div>
           </>
         ) : (
           <>
             <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase mb-1">LISTA DE ACCESOS</h2>
                  <p className="text-lg font-bold text-slate-600">Evento: {activeInv.title}</p>
                  <p className="text-sm text-slate-500">Fecha: {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-violet-600">{allGuests.reduce((acc, g) => acc + Number(g.guests || 0), 0)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Personas Totales</p>
                </div>
             </div>

             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-y-2 border-slate-300">
                   <th className="py-3 px-2">ID Pase</th>
                   <th className="py-3 px-2">Nombre del Invitado</th>
                   <th className="py-3 px-2 text-center">Personas</th>
                   <th className="py-3 px-2 text-center">Check-in (Firma)</th>
                 </tr>
               </thead>
               <tbody>
                 {allGuests.map((g, i) => (
                   <tr key={i} className="border-b border-slate-200 text-sm">
                     <td className="py-3 px-2 font-mono text-slate-500">{g.id.split('-').pop()}</td>
                     <td className="py-3 px-2 font-bold text-slate-800">{g.name} {g.lastname}</td>
                     <td className="py-3 px-2 text-center font-black">{g.guests}</td>
                     <td className="py-3 px-2 text-center">
                       <div className="w-6 h-6 rounded border-2 border-slate-300 mx-auto"></div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <div className="mt-12 text-center text-xs text-slate-400 font-bold">Documento generado el {getTodaySpanish()} • {user.name}</div>
           </>
         )}
      </div>

    </div>
  );
};
