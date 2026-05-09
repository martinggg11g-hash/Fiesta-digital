import React, { useState, useEffect, useRef } from "react";
import { 
  X, ClipboardList, Users, FileText, Printer, UserCheck, MessageCircle, 
  PartyPopper, CalendarClock, Clock, AlertTriangle, Receipt, Smartphone, 
  Copy, CheckCircle2, Plus, FileDown, Edit2, Trash2, FileSpreadsheet
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
  
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(1);
  const [gStatus, setGStatus] = useState("Pendiente");
  const [gTable, setGTable] = useState("");

  const [copiedStates, setCopiedStates] = useState({});
  const [vipGuests, setVipGuests] = useState([]);
  
  const manualGuests = activeInv?.internal_data?.guests || [];
  const useTables = activeInv?.internal_data?.useTables || false;
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchVipGuests = async () => {
      const { data: eventData } = await supabase.from('eventos').select('id').eq('slug', activeInv.id).single();
      if (eventData) {
        const { data: guestsData } = await supabase.from('invitados').select('*').eq('evento_id', eventData.id).order('created_at', { ascending: false });
        if (guestsData) setVipGuests(guestsData);
      }
    };
    if (activeTab === 'guests') fetchVipGuests();
  }, [activeInv.id, activeTab]);

  const allGuests = [
    ...manualGuests,
    ...vipGuests.map(vg => ({
      id: vg.id,
      name: vg.nombre_completo,
      lastname: vg.apodo ? `(${vg.apodo})` : '',
      guests: vg.acompanantes_confirmados > 0 ? vg.acompanantes_confirmados : vg.max_acompanantes,
      status: vg.asistencia_confirmada ? 'Confirmado' : 'Pendiente',
      mesa: vg.mesa || '',
      timestamp: vg.created_at,
      isVip: true 
    }))
  ];

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => { setCopiedStates(prev => ({ ...prev, [id]: false })); }, 2000);
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 300); 
  };

  const openNewGuest = () => {
    setEditingGuest(null);
    setGName(""); setGLastname(""); setGPax(1); setGStatus("Pendiente"); setGTable("");
    setShowGuestModal(true);
  };
  
  const openEditGuest = (g) => {
    setEditingGuest(g);
    setGName(g.name); setGLastname(g.lastname); setGPax(g.guests); setGStatus(g.status); setGTable(g.mesa || "");
    setShowGuestModal(true);
  };

  const saveGuest = async () => {
    if(!gName && !editingGuest?.isVip) return alert("Falta nombre");
    
    if (editingGuest?.isVip) {
      await supabase.from('invitados').update({ mesa: gTable }).eq('id', editingGuest.id);
      setVipGuests(vipGuests.map(v => v.id === editingGuest.id ? { ...v, mesa: gTable } : v));
    } else {
      let newList = [...manualGuests];
      if (editingGuest) {
        newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: gTable } : g);
      } else {
        const fakeId = `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), mesa: gTable, status: gStatus, timestamp: new Date().toISOString() });
      }
      onUpdateInternal(activeInv.id, 'guests', newList);
    }
    setShowGuestModal(false);
  };

  const deleteGuest = async (g) => {
    if(!window.confirm("¿Seguro que querés borrar a este invitado? El QR dejará de funcionar.")) return;
    if (g.isVip) {
      await supabase.from('invitados').delete().eq('id', g.id);
      setVipGuests(vipGuests.filter(v => v.id !== g.id));
    } else {
      const newList = manualGuests.filter(mg => mg.id !== g.id);
      onUpdateInternal(activeInv.id, 'guests', newList);
    }
  };

  const handleExportCSV = () => {
    if(allGuests.length === 0) return alert("No hay invitados aún.");
    let csv = "ID Pase,Nombre Completo,Acompañantes,Mesa,Estado,Fecha de Registro\n";
    allGuests.forEach(g => {
      csv += `${g.id},${g.name} ${g.lastname},${g.guests},${g.mesa || '-'},${g.status},${new Date(g.timestamp).toLocaleDateString('es-AR')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Invitados_${activeInv.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n');
      const newGuests = [];
      let start = 0;
      if (lines[0].toLowerCase().includes('nombre') || lines[0].toLowerCase().includes('name')) start = 1;

      lines.slice(start).forEach(line => {
        if(!line.trim()) return;
        const cols = line.split(',');
        const name = cols[0]?.replace(/['"]/g, '').trim() || "";
        const lastname = cols[1]?.replace(/['"]/g, '').trim() || "";
        const pax = cols[2]?.replace(/['"]/g, '').trim() || "1";
        const table = cols[3]?.replace(/['"]/g, '').trim() || "";
        
        if(name) {
          newGuests.push({
            id: `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            name, lastname, guests: parseInt(pax) || 1, mesa: table, status: 'Pendiente', timestamp: new Date().toISOString()
          });
        }
      });
      if (newGuests.length > 0) {
        onUpdateInternal(activeInv.id, 'guests', [...manualGuests, ...newGuests]);
        alert(`¡Importación exitosa! Se cargaron ${newGuests.length} invitados.`);
      } else {
        alert("No se encontraron invitados en el archivo. Asegurate de que sea un archivo CSV separado por comas.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 crm-modal-wrapper">
      <style>{`
        @media print {
          /* Eliminamos márgenes de la página y forzamos fondo blanco */
          @page { margin: 0.5cm; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          
          /* Ocultamos TODO el body por defecto */
          body * { visibility: hidden; }
          
          /* Le sacamos el fondo negro, la posición fija y el blur al wrapper oscuro */
          .crm-modal-wrapper {
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             background: white !important;
             backdrop-filter: none !important;
             padding: 0 !important;
          }

          /* Hacemos desaparecer completamente el modal que se ve en pantalla */
          .no-print { display: none !important; }

          /* Forzamos a que el contenido a imprimir se vuelva visible y ocupe el 100% de la hoja */
          .only-print, .only-print * { visibility: visible; }
          .only-print { 
             position: absolute !important; 
             left: 0 !important; 
             top: 0 !important; 
             width: 100% !important; 
             margin: 0 !important; 
             padding: 20px !important; 
             background: white !important; 
          }
        }
      `}</style>
      
      <div className={`w-full max-w-5xl max-h-[95vh] h-full sm:h-auto rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop no-print ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
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

          {/* PESTAÑA LISTA DE INVITADOS */}
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
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-slate-500 text-sm">Asistentes: <strong className="text-violet-600">{allGuests.reduce((acc, g) => acc + Number(g.guests || 0), 0)}</strong></p>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-500">Asignar Mesas</span>
                      <Toggle checked={useTables} onChange={val => onUpdateInternal(activeInv.id, 'useTables', val)} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                   <button onClick={openNewGuest} className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"><Plus size={16}/> MANUAL</button>
                   <button onClick={() => fileInputRef.current.click()} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer" title="Cargar archivo CSV separado por comas"><FileSpreadsheet size={16}/> IMPORTAR CSV/EXCEL</button>
                   <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
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
                    <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-4 border-b">Invitado</th><th className="p-4 border-b text-center">Pase VIP ID</th><th className="p-4 border-b text-center">Personas</th>{useTables && <th className="p-4 border-b text-center text-violet-500">Mesa</th>}<th className="p-4 border-b text-center">Estado</th><th className="p-4 border-b text-right">Acciones</th></tr></thead>
                    <tbody className="text-sm">
                      {allGuests.map((g, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">
                            {g.name} {g.lastname} {g.isVip && <span className="ml-2 text-[8px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase tracking-widest">VIP App</span>}
                            <br/><span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">{new Date(g.timestamp).toLocaleDateString('es-AR')}</span>
                          </td>
                          <td className="p-4 text-center"><code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 font-mono">{g.id.split('-').pop()}</code></td>
                          <td className="p-4 text-center font-black text-slate-600">{g.guests}</td>
                          {useTables && <td className="p-4 text-center font-black text-violet-600 text-lg">{g.mesa || '-'}</td>}
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${g.status === 'Confirmado' || g.status === 'Ingresó' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-2">
                             <button onClick={() => openEditGuest(g)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 cursor-pointer" title="Editar"><Edit2 size={14}/></button>
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
                     {!editingGuest?.isVip ? (
                       <>
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
                       </>
                     ) : (
                       <div className="p-4 bg-violet-50 text-violet-800 rounded-xl mb-4 text-xs font-bold border border-violet-200">
                         Estás editando un pase VIP generado por el cliente. Solo podés asignarle la mesa.
                       </div>
                     )}
                     {useTables && <Inp label="Asignar Mesa (Opcional)" placeholder="Ej: Mesa 12" value={gTable} onChange={setGTable} isDark={isDark} />}
                     <button onClick={saveGuest} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-md">GUARDAR</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- LA HOJA A4 PARA IMPRIMIR (DOBLE PLANTILLA) ---------------- */}
      <div className="only-print">
         {printMode !== 'invitados' ? (
           <>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  {salonInfo?.logo ? <img src={salonInfo.logo} style={{ maxHeight: '96px', maxWidth: '200px', objectFit: 'contain' }} alt="Logo" /> : <div style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a' }}>{user.name}</div>}
                  <div>
                    {salonInfo?.logo && <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>{user.name}</h1>}
                    <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{salonInfo?.address || 'Sin dirección registrada'}</p>
                    <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{salonInfo?.phone || 'Sin teléfono'}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', letterSpacing: '2px', margin: '0 0 4px 0' }}>{printMode === 'presupuesto' ? 'PRESUPUESTO' : 'FICHA DE EVENTO'}</h2>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', background: '#f1f5f9', display: 'inline-block', padding: '4px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0 }}>Ref: {activeInv.id.split('-')[1]?.toUpperCase()}</p>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>1. Detalles del Evento</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Agasajado:</span> <span style={{ fontWeight: '900', fontSize: '18px' }}>{activeInv.internal_data.internalHonoree || activeInv.config?.honoreeName || activeInv.title}</span></p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Tipo:</span> {activeInv.internal_data.eventType || '---'}</p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Fecha:</span> {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Horario:</span> {activeInv.internal_data.internalTime || '---'} hs</p>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>2. Datos del Cliente</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Nombre:</span> <span style={{ fontWeight: 'bold' }}>{activeInv.internal_data.clientName || '---'}</span></p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Teléfono:</span> {activeInv.internal_data.clientPhone || '---'}</p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', color: '#334155', display: 'inline-block', width: '96px' }}>Invitados:</span> {activeInv.internal_data.guestCount || '---'} personas</p>
                  </div>
                </div>
             </div>

             <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>3. Servicios Incluidos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', fontSize: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><p style={{ fontWeight: '900', color: '#334155', margin: '0 0 4px 0' }}>Servicios Solicitados:</p><p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{activeInv.internal_data.requestedServices || 'Ninguno especificado.'}</p></div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><p style={{ fontWeight: '900', color: '#334155', margin: '0 0 4px 0' }}>Menús Especiales / Alergias:</p><p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{activeInv.internal_data.specialMenus || 'Ninguno especificado.'}</p></div>
                </div>
                {printMode === 'ficha' && <div style={{ marginTop: '16px', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fefce8' }}><p style={{ fontWeight: '900', color: '#334155', margin: '0 0 4px 0' }}>Notas Internas del Salón:</p><p style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: '#475569', margin: 0 }}>{activeInv.internal_data.internalNotes || 'Sin observaciones.'}</p></div>}
             </div>

             <div>
                <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>{printMode === 'presupuesto' ? '4. Detalle de Valores' : '4. Estado Financiero Interno'}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', margin: '0 0 4px 0' }}>Valor Total</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>${Number(activeInv.internal_data.totalBudget || 0).toLocaleString('es-AR')}</p></div>
                  <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', margin: '0 0 4px 0' }}>Abonado / Seña</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', margin: 0 }}>${Number(activeInv.internal_data.paymentAmount || 0).toLocaleString('es-AR')}</p></div>
                  <div style={{ textAlign: 'center', background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '12px' }}><p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#cbd5e1', margin: '0 0 4px 0' }}>Saldo Pendiente</p><p style={{ fontSize: '30px', fontWeight: '900', margin: 0 }}>${(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}</p></div>
                </div>
             </div>
             
             <div style={{ marginTop: '64px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>{printMode === 'presupuesto' ? <p style={{ margin: 0 }}>Documento emitido el {getTodaySpanish()} • Los valores expresados pueden estar sujetos a modificaciones.</p> : <p style={{ margin: 0 }}>Hoja de ruta interna generada el {getTodaySpanish()}</p>}</div>
           </>
         ) : (
           <>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '24px', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', letterSpacing: '2px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>LISTA DE ACCESOS</h2>
                  {/* Acá cambiamos el título dinámico */}
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#475569', margin: '0 0 4px 0' }}>
                    Evento: {activeInv.internal_data.internalHonoree || activeInv.config?.honoreeName || activeInv.title}
                  </p>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Fecha: {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '30px', fontWeight: '900', color: '#7c3aed', margin: '0 0 4px 0' }}>{allGuests.reduce((acc, g) => acc + Number(g.guests || 0), 0)}</p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', margin: 0 }}>Personas Totales</p>
                </div>
             </div>

             <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ background: '#f1f5f9', fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', borderTop: '2px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>
                   <th style={{ padding: '12px 8px' }}>ID Pase</th>
                   <th style={{ padding: '12px 8px' }}>Nombre del Invitado</th>
                   <th style={{ padding: '12px 8px', textAlign: 'center' }}>Personas</th>
                   {useTables && <th style={{ padding: '12px 8px', textAlign: 'center' }}>Mesa</th>}
                   <th style={{ padding: '12px 8px', textAlign: 'center' }}>Check-in (Firma)</th>
                 </tr>
               </thead>
               <tbody>
                 {allGuests.map((g, i) => (
                   <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                     <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#64748b' }}>{g.id.split('-').pop()}</td>
                     <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#1e293b' }}>{g.name} {g.lastname}</td>
                     <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '900' }}>{g.guests}</td>
                     {useTables && <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '900', color: '#7c3aed' }}>{g.mesa || '-'}</td>}
                     <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                       <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: '2px solid #cbd5e1', margin: '0 auto' }}></div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Documento generado el {getTodaySpanish()} • {user.name}</div>
           </>
         )}
      </div>
    </div>
  );
};
