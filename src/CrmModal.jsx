import React, { useState, useEffect, useRef } from "react";
import { 
  X, ClipboardList, Users, FileText, Printer, UserCheck, MessageCircle, 
  PartyPopper, CalendarClock, Clock, AlertTriangle, Receipt, Smartphone, 
  Copy, CheckCircle2, Plus, FileDown, Edit2, Trash2, FileSpreadsheet,
  MonitorPlay
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

export const CrmModal = ({ activeInv, onClose, user, salonInfo, onUpdateInternal, onUpdateConfig, isDark }) => {
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
      const { data: eventData } = await supabase.from('invitaciones').select('id').eq('slug', activeInv.id).single();
      if (eventData) {
        const { data: guestsData } = await supabase.from('invitados').select('*').eq('evento_id', eventData.id).order('created_at', { ascending: false });
        if (guestsData) setVipGuests(guestsData);
      } else {
        const { data: guestsDataAlt } = await supabase.from('invitados').select('*').eq('evento_id', activeInv.id).order('created_at', { ascending: false });
        if (guestsDataAlt) setVipGuests(guestsDataAlt);
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
    let finalTable = gTable.trim();
    if (finalTable && !finalTable.toLowerCase().startsWith('mesa')) {
        finalTable = `Mesa ${finalTable}`;
    }
    if (editingGuest?.isVip) {
      await supabase.from('invitados').update({ mesa: finalTable }).eq('id', editingGuest.id);
      setVipGuests(vipGuests.map(v => v.id === editingGuest.id ? { ...v, mesa: finalTable } : v));
    } else {
      let newList = [...manualGuests];
      if (editingGuest) {
        newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: finalTable } : g);
      } else {
        const fakeId = `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), mesa: finalTable, status: gStatus, timestamp: new Date().toISOString() });
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
        alert("No se encontraron invitados en el archivo.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 crm-modal-wrapper">
      <style>{`
        .only-print { display: none !important; }
        @media print {
          @page { margin: 0.5cm; }
          body { background: white !important; }
          .crm-modal-wrapper { position: absolute !important; left: 0 !important; top: 0 !important; background: white !important; }
          .no-print { display: none !important; }
          .only-print, .only-print * { visibility: visible; display: block !important; }
        }
      `}</style>
      
      <div className={`w-full max-w-5xl max-h-[95vh] h-full sm:h-auto rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop no-print ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
           <div className="flex gap-4 border border-slate-300 rounded-xl p-1 bg-slate-100 flex-wrap">
             <button onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'info' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><ClipboardList size={14} className="inline-block mr-1"/> Ficha Interna</button>
             <button onClick={() => setActiveTab('guests')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'guests' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><Users size={14} className="inline-block mr-1"/> Invitados</button>
             <button onClick={() => setActiveTab('projector')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'projector' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><MonitorPlay size={14} className="inline-block mr-1"/> Proyector</button>
           </div>
           <button onClick={onClose} className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-2"><X size={20}/></button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1 relative">
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
                       <Inp label="WhatsApp del Cliente" placeholder="Ej: 52 1 55 1234 5678" className="flex-1 !mb-0" value={activeInv.internal_data.clientPhone || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientPhone', v)} isDark={isDark} />
                       <button onClick={() => window.open(`https://wa.me/${activeInv.internal_data.clientPhone?.replace(/\D/g, '')}`)} className="h-[46px] px-4 bg-green-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md"><MessageCircle size={18}/></button>
                    </div>
                    <Inp label="Cantidad de Invitados (Aprox)" type="number" placeholder="Ej: 80" value={activeInv.internal_data.guestCount || ''} onChange={v => onUpdateInternal(activeInv.id, 'guestCount', v)} isDark={isDark} />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><PartyPopper size={14}/> Detalles del Evento</h3>
                    <Inp label="Nombre del Agasajado/s" value={activeInv.config?.honoreeName || ''} onChange={v => onUpdateConfig(activeInv.id, 'honoreeName', v)} isDark={isDark} />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tipo de Evento</label>
                        <select className={`w-full py-3 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer border ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`} value={activeInv.internal_data.eventType || ''} onChange={e => onUpdateInternal(activeInv.id, 'eventType', e.target.value)}>
                           <option value="">Seleccionar...</option>
                           <option value="15 Años">15 Años</option>
                           <option value="Boda">Boda / Casamiento</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Inp label="Fecha" type="date" icon={CalendarClock} value={activeInv.internal_data.internalDate || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalDate', v)} isDark={isDark} />
                       <Inp label="Horario" type="text" placeholder="Ej: 14:00 a 20:00" icon={Clock} value={activeInv.internal_data.internalTime || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalTime', v)} isDark={isDark} />
                    </div>
                 </div>
              </div>
              {/* Aquí seguiría el resto de tu UI (Finanzas, Notas, etc.) */}
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="animate-in fade-in duration-300">
               {/* ... (Tabla de invitados y acciones) */}
            </div>
          )}

          {/* ... resto de componentes ... */}
        </div>
      </div>
    </div>
  );
};
