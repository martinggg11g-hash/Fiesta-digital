import React, { useState, useEffect, useRef } from "react";
import { 
  X, ClipboardList, Users, FileText, Printer, UserCheck, MessageCircle, 
  PartyPopper, CalendarClock, Clock, Receipt, Smartphone, 
  Copy, Plus, FileDown, Edit2, Trash2, FileSpreadsheet,
  MonitorPlay, Image as ImageIcon, AlertTriangle, Send
} from "lucide-react";
import { Inp, Toggle } from "./DashboardUI";
import { formatDateSpanish } from "./config";
import { supabase } from "./supabase";

const getTodaySpanish = () => {
  const today = new Date();
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;
};

const safeFormatDate = (ts) => {
  if (!ts) return 'Sin fecha';
  try {
    return new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(ts));
  } catch (e) { return ts; }
};

export const CrmModal = ({ activeInv, onClose, user, salonInfo, onUpdateInternal, onUpdateConfig, isDark }) => {
  const [activeTab, setActiveTab] = useState("resumen");
  const [showPrint, setShowPrint] = useState(false);
  const [useTables, setUseTables] = useState(activeInv?.internal_data?.useTables || false);
  
  const [livePhotos, setLivePhotos] = useState(activeInv?.internal_data?.live_photos?.map(p => typeof p === 'string' ? p : p.url) || []);
  
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(1);
  const [gStatus, setGStatus] = useState("Pendiente");
  const [gTable, setGTable] = useState("");
  const [dbStatus, setDbStatus] = useState("synced");

  const [vipGuests, setVipGuests] = useState([]);
  
  // Modales de confirmación para eliminar
  const [deleteGuestConfirm, setDeleteGuestConfirm] = useState(null);
  const [deletePhotoConfirm, setDeletePhotoConfirm] = useState(null);

  // Hook unificado para Suscripción Realtime 
  useEffect(() => {
    let isMounted = true;
    let channel;
    const targetId = activeInv?.id;

    if (targetId) {
      supabase.from('invitados').select('*').eq('evento_id', targetId).order('created_at', { ascending: false })
      .then(({data}) => { if (isMounted && data) setVipGuests(data); });

      channel = supabase.channel(`crm-modal-vips-${targetId}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'invitados', 
           filter: `evento_id=eq.${targetId}` 
        }, () => {
           supabase.from('invitados').select('*').eq('evento_id', targetId).order('created_at', { ascending: false })
             .then(({data}) => { if (isMounted && data) setVipGuests(data); });
        })
        .subscribe();
    }
    return () => { isMounted = false; if (channel) supabase.removeChannel(channel); };
  }, [activeInv?.id]);

  if (!activeInv) return null;

  const data = activeInv.internal_data || {};
  const cfg = activeInv.config || {};
  const manualGuests = data.guests || [];

  const allGuests = [
    ...manualGuests,
    ...vipGuests.map(vg => ({
       id: vg.id,
       name: vg.nombre,
       lastname: vg.apellidos || '',
       phone: vg.telefono || '',
       guests: 1, 
       status: vg.status,
       mesa: vg.mesa || '',
       isVip: true,
       created_at: vg.created_at
    }))
  ];

  const totalConf = allGuests.reduce((acc, g) => acc + (Number(g.guests) || 1), 0);
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";

  const toggleTables = (val) => {
    setUseTables(val);
    onUpdateInternal(activeInv.id, 'useTables', val);
  };

  const openGuestModal = (g = null) => {
    if (g) {
      setEditingGuest(g); setGName(g.name); setGLastname(g.lastname || "");
      setGPax(g.guests); setGStatus(g.status || "Pendiente"); setGTable(g.mesa || "");
    } else {
      setEditingGuest({ isNew: true }); setGName(""); setGLastname("");
      setGPax(1); setGStatus("Pendiente"); setGTable("");
    }
  };

  const handleSaveGuest = async () => {
    if (!gName.trim()) return alert("El nombre es obligatorio");
    setDbStatus("saving");
    const finalTable = useTables ? gTable : "";

    if (editingGuest.isNew) {
      const newG = { id: `m-${Date.now()}`, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: finalTable };
      await onUpdateInternal(activeInv.id, 'guests', [newG, ...manualGuests]);
    } else if (editingGuest.isVip) {
      await supabase.from('invitados').update({
         nombre: gName, apellidos: gLastname, status: gStatus, mesa: finalTable 
      }).eq('id', editingGuest.id);
      setVipGuests(vipGuests.map(v => v.id === editingGuest.id ? { ...v, nombre: gName, apellidos: gLastname, status: gStatus, mesa: finalTable } : v));
    } else {
      let newList = manualGuests.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: finalTable } : g);
      await onUpdateInternal(activeInv.id, 'guests', newList);
    }
    
    setEditingGuest(null);
    setDbStatus("synced");
  };

  const handleDeleteGuest = async () => {
    setDbStatus("saving");
    if (deleteGuestConfirm.isVip) {
      await supabase.from('invitados').delete().eq('id', deleteGuestConfirm.id);
      setVipGuests(vipGuests.filter(v => v.id !== deleteGuestConfirm.id));
    } else {
      const newList = manualGuests.filter(g => g.id !== deleteGuestConfirm.id);
      await onUpdateInternal(activeInv.id, 'guests', newList);
    }
    setDeleteGuestConfirm(null);
    setEditingGuest(null);
    setDbStatus("synced");
  };

  const handleDeletePhoto = async () => {
    const newList = livePhotos.filter(p => p !== deletePhotoConfirm);
    setLivePhotos(newList);
    const toSave = activeInv?.internal_data?.live_photos?.filter(p => (typeof p === 'string' ? p : p.url) !== deletePhotoConfirm) || [];
    await onUpdateInternal(activeInv.id, 'live_photos', toSave);
    setDeletePhotoConfirm(null);
  };

  const exportExcel = () => {
    const header = useTables ? "Nombre,Apellido,Acompañantes,Estado,Mesa\n" : "Nombre,Apellido,Acompañantes,Estado\n";
    const csv = allGuests.map(g => {
      const base = `"${g.name}","${g.lastname}","${g.guests}","${g.status}"`;
      return useTables ? `${base},"${g.mesa || ''}"` : base;
    }).join("\n");
    
    const blob = new Blob(["\uFEFF" + header + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Lista_${activeInv.title.replace(/ /g,'_')}.csv`;
    link.click();
  };

  // CORRECCIÓN: Link correcto hacia la vista LiveInviteScreen
  const getQRLink = (guestId) => {
    return `${window.location.origin}/invite/${activeInv.id}?guest=${guestId}`;
  };

  // NUEVA FUNCIÓN: Enviar pase directo por WhatsApp
  const handleShareWhatsApp = (g) => {
    const link = getQRLink(g.id);
    const text = encodeURIComponent(`¡Hola ${g.name}! Acá tenés tu pase VIP para mi evento. Mostrá el código QR en la puerta para ingresar:\n\n${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (showPrint) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto print:p-0 p-8 text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-4xl mx-auto">
           <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4 no-print">
             <div>
               <h1 className="text-3xl font-black">{activeInv.title}</h1>
               <p className="text-gray-600">{formatDateSpanish(cfg.date)} • {cfg.time}</p>
             </div>
             <div className="flex gap-4">
               <button onClick={() => window.print()} className="px-6 py-3 bg-black text-white font-bold rounded-xl flex items-center gap-2"><Printer size={18}/> IMPRIMIR AHORA</button>
               <button onClick={() => setShowPrint(false)} className="px-6 py-3 bg-gray-200 font-bold rounded-xl flex items-center gap-2"><X size={18}/> CERRAR</button>
             </div>
           </div>

           <div className="only-print text-center mb-8">
             <h1 className="text-2xl font-black uppercase mb-1">{activeInv.title}</h1>
             <p className="text-sm font-bold">{formatDateSpanish(cfg.date)} • {cfg.time}</p>
             <p className="text-xs uppercase mt-2">Lista Oficial de Invitados • {totalConf} Personas Confirmadas</p>
           </div>

           <table className="w-full text-left border-collapse">
             <thead>
               <tr style={{ borderBottom: '2px solid #000' }}>
                 <th style={{ padding: '12px 8px' }}># TKT</th>
                 <th style={{ padding: '12px 8px' }}>Invitado</th>
                 <th style={{ padding: '12px 8px', textAlign: 'center' }}>Pax</th>
                 {useTables && <th style={{ padding: '12px 8px', textAlign: 'center' }}>Mesa</th>}
                 <th style={{ padding: '12px 8px', textAlign: 'center' }}>Check-in (Firma)</th>
               </tr>
             </thead>
             <tbody>
               {allGuests.map((g) => (
                 <tr key={g.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
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
           <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
             Documento generado por <strong>defiesta.lat</strong> el {getTodaySpanish()}
           </div>
        </div>
      </div>
    );
  }

  return (
    // CORRECCIÓN: Modal centrado con fondo blur
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className={`w-full max-w-5xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col anim-pop overflow-hidden ${isDark ? 'bg-slate-900 text-white' : 'bg-[#f8f9fc] text-slate-800'}`}>
        
        <div className={`shrink-0 px-6 py-5 border-b flex items-center justify-between z-10 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center shadow-lg"><ClipboardList size={24}/></div>
             <div>
                <h2 className="text-xl font-black tracking-tight">{activeInv.title}</h2>
                <p className={`text-[11px] uppercase tracking-widest font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>Ficha de Evento CRM</p>
             </div>
          </div>
          <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}><X size={20}/></button>
        </div>

        <div className={`shrink-0 px-6 py-3 border-b flex gap-6 overflow-x-auto custom-scrollbar ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
           <button onClick={() => setActiveTab('resumen')} className={`py-2 px-1 text-sm font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${activeTab === 'resumen' ? 'border-violet-500 text-violet-500' : 'border-transparent opacity-50'}`}>Info. General</button>
           <button onClick={() => setActiveTab('invitados')} className={`py-2 px-1 text-sm font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'invitados' ? 'border-violet-500 text-violet-500' : 'border-transparent opacity-50'}`}>Invitados <span className="bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full text-[10px]">{allGuests.length}</span></button>
           <button onClick={() => setActiveTab('fotos')} className={`py-2 px-1 text-sm font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'fotos' ? 'border-violet-500 text-violet-500' : 'border-transparent opacity-50'}`}>Cámara / Fotos <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-[10px]">{livePhotos.length}</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
           
           {activeTab === 'resumen' && (
             <div className="space-y-6 max-w-3xl mx-auto pb-10">
                <div className={`p-6 rounded-[2rem] border grid grid-cols-2 md:grid-cols-4 gap-6 ${themeCard}`}>
                   <div className="col-span-2 md:col-span-4 border-b pb-4 mb-2">
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Cliente / Homenajeado</p>
                     <p className="text-xl font-black">{data.clientName || cfg.honoreeName || "Sin nombre"}</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 flex items-center gap-1"><CalendarClock size={12}/> Fecha</p>
                     <p className="font-bold text-sm">{formatDateSpanish(cfg.date)}</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 flex items-center gap-1"><Clock size={12}/> Horario</p>
                     <p className="font-bold text-sm">{cfg.time || "Sin horario"}</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 flex items-center gap-1"><Users size={12}/> Confirmados</p>
                     <p className="text-2xl font-black text-violet-500 leading-none">{totalConf}</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 flex items-center gap-1"><PartyPopper size={12}/> Tipo</p>
                     <p className="font-bold text-sm">{cfg.eventType || "Evento"}</p>
                   </div>
                </div>

                <div className={`p-6 rounded-[2rem] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${themeCard}`}>
                   <div>
                     <h3 className="font-black flex items-center gap-2 mb-1"><MonitorPlay size={18} className="text-violet-500"/> Proyector en Vivo</h3>
                     <p className="text-sm opacity-70">Enviá este link a la DJ o técnica para proyectar las fotos que suban los invitados.</p>
                   </div>
                   <button onClick={() => window.open(`${window.location.origin}/proyector/${activeInv.id}`)} className="px-6 py-3 rounded-xl bg-violet-600 text-white font-black text-xs uppercase tracking-widest hover:bg-violet-700 shadow-md transition-colors cursor-pointer">ABRIR PROYECTOR</button>
                </div>
             </div>
           )}

           {activeTab === 'fotos' && (
             <div className="max-w-5xl mx-auto pb-10">
                <div className={`p-6 rounded-[2rem] border mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${themeCard}`}>
                   <div>
                     <h3 className="text-lg font-black mb-1">Fotos en Vivo ({livePhotos.length})</h3>
                     <p className="text-sm opacity-70">Acá aparecen las fotos que los invitados suben desde su celular.</p>
                   </div>
                   <button onClick={() => window.open(`${window.location.origin}/proyector/${activeInv.id}`)} className="px-6 py-3 rounded-xl bg-violet-600 text-white font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-colors cursor-pointer"><MonitorPlay size={16}/> MODO PROYECTOR</button>
                </div>

                {livePhotos.length === 0 ? (
                   <div className="text-center py-20 opacity-50 border-2 border-dashed rounded-[2rem] border-slate-300 dark:border-slate-700">
                     <ImageIcon size={48} className="mx-auto mb-4" />
                     <p className="text-lg font-bold">Aún no hay fotos</p>
                     <p className="text-sm">Las fotos aparecerán acá automáticamente.</p>
                   </div>
                ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                   {livePhotos.map((url, i) => (
                      <div key={`photo-${i}`} className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                         <img src={url} alt="Foto del evento" className="w-full h-full object-cover" />
                         <button onClick={() => setDeletePhotoConfirm(url)} className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Trash2 size={14}/></button>
                         <a href={url} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FileDown size={14}/></a>
                      </div>
                   ))}
                </div>
                )}
             </div>
           )}

           {activeTab === 'invitados' && (
             <div className="max-w-4xl mx-auto pb-10">
                <div className={`p-6 rounded-[2rem] border mb-6 flex flex-col md:flex-row items-center justify-between gap-6 ${themeCard}`}>
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-violet-500/10 text-violet-600 rounded-xl"><UserCheck size={24}/></div>
                     <div>
                       <h3 className="font-black text-xl leading-none mb-1">Gestión de Accesos</h3>
                       <p className="text-sm font-bold opacity-70">Total confirmados: {totalConf} personas</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <button onClick={() => setShowPrint(true)} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`} title="Imprimir Planilla"><Printer size={20}/></button>
                     <button onClick={exportExcel} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`} title="Descargar Excel"><FileSpreadsheet size={20}/></button>
                     <button onClick={() => openGuestModal()} className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-2 cursor-pointer transition-colors"><Plus size={16}/> AGREGAR</button>
                   </div>
                </div>

                <div className={`p-4 rounded-[1.5rem] border mb-6 flex items-center justify-between ${themeCard}`}>
                   <div>
                     <p className="font-bold text-sm">Habilitar asignación de mesas</p>
                     <p className="text-xs opacity-60">Permite indicar número de mesa por familia/invitado.</p>
                   </div>
                   <Toggle checked={useTables} onChange={toggleTables} />
                </div>

                <div className="space-y-3">
                  {allGuests.map((g, idx) => (
                    <div key={`guest-${g.id}-${idx}`} className={`p-4 rounded-[1.5rem] border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md ${themeCard} ${g.status === 'Ingresó' ? 'border-l-4 border-l-green-500' : ''}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 border-2 ${g.isVip ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                             <span className="text-sm font-black">{g.guests}</span>
                             <span className="text-[8px] font-black uppercase leading-none">PAX</span>
                          </div>
                          <div>
                            <p className="font-black text-lg leading-tight flex items-center gap-2">
                               {g.name} {g.lastname} 
                               {g.isVip && <span className="bg-amber-500 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">VIP</span>}
                            </p>
                            <p className="text-xs font-bold opacity-60 mt-1">
                               {g.status} {g.phone && `• 📞 ${g.phone}`} {useTables && g.mesa && `• Mesa ${g.mesa}`}
                            </p>
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {g.isVip && (
                             <div className="flex gap-2">
                               <button onClick={() => { navigator.clipboard.writeText(getQRLink(g.id)); alert("Enlace copiado."); }} className="p-2 bg-slate-100 text-slate-600 font-bold rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer" title="Copiar Link"><Copy size={16}/></button>
                               <button onClick={() => handleShareWhatsApp(g)} className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-green-100 transition-colors cursor-pointer"><Send size={14}/> WHATSAPP</button>
                             </div>
                          )}
                          <button onClick={() => openGuestModal(g)} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}><Edit2 size={16}/></button>
                       </div>
                    </div>
                  ))}
                  {allGuests.length === 0 && (
                     <div className="text-center py-16 opacity-50 border-2 border-dashed rounded-[2rem] border-slate-300 dark:border-slate-700">
                        <Users size={40} className="mx-auto mb-3" />
                        <p className="font-bold">Aún no hay invitados confirmados</p>
                     </div>
                  )}
                </div>
             </div>
           )}
        </div>
      </div>

      {editingGuest && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
              <button onClick={() => setEditingGuest(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20}/></button>
              <h3 className="font-black text-xl mb-6">{editingGuest.isNew ? 'Nuevo Invitado' : 'Editar Invitado'}</h3>
              
              <Inp label="Nombre" value={gName} onChange={setGName} isDark={isDark} />
              <Inp label="Apellidos / Familia" value={gLastname} onChange={setGLastname} isDark={isDark} />
              
              <div className="grid grid-cols-2 gap-4">
                <Inp label="Cant. Personas" type="number" value={gPax} onChange={setGPax} isDark={isDark} />
                {useTables && <Inp label="Número de Mesa" type="text" value={gTable} onChange={setGTable} isDark={isDark} placeholder="Ej: 5" />}
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado de Acceso</label>
                <select value={gStatus} onChange={e => setGStatus(e.target.value)} className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold border outline-none cursor-pointer ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
                   <option value="Pendiente">⏳ Pendiente de ingreso</option>
                   <option value="Ingresó">✅ Ingresó a la fiesta</option>
                   <option value="Cancelado">❌ Canceló asistencia</option>
                </select>
              </div>

              <button onClick={handleSaveGuest} className="w-full py-4 bg-violet-600 text-white font-black rounded-xl shadow-lg hover:bg-violet-700 transition-colors cursor-pointer">GUARDAR FICHA</button>
              
              {!editingGuest.isNew && (
                 <button onClick={() => setDeleteGuestConfirm(editingGuest)} className="w-full py-4 mt-2 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer">ELIMINAR INVITADO</button>
              )}
           </div>
        </div>
      )}

      {deleteGuestConfirm && (
        <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative text-center anim-pop border-4 border-red-500 ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500 text-white">
                <Trash2 size={32}/>
             </div>
             <h2 className="text-xl font-black mb-2 uppercase tracking-widest">¿Borrar Invitado?</h2>
             <p className="text-sm opacity-80 mb-6">Si eliminas a <b>{deleteGuestConfirm.name}</b>, su pase dejará de funcionar permanentemente.</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteGuestConfirm(null)} className="flex-1 py-3.5 rounded-xl font-black bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer">CANCELAR</button>
               <button onClick={handleDeleteGuest} className="flex-1 py-3.5 bg-red-500 text-white hover:bg-red-600 rounded-xl font-black shadow-lg transition-colors cursor-pointer">SÍ, BORRAR</button>
             </div>
           </div>
        </div>
      )}

      {deletePhotoConfirm && (
        <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative text-center anim-pop border-4 border-red-500 ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500 text-white">
                <ImageIcon size={32}/>
             </div>
             <h2 className="text-xl font-black mb-2 uppercase tracking-widest">¿Eliminar Foto?</h2>
             <p className="text-sm opacity-80 mb-6">La foto desaparecerá de la galería en vivo y del proyector instantáneamente.</p>
             <div className="flex gap-3">
               <button onClick={() => setDeletePhotoConfirm(null)} className="flex-1 py-3.5 rounded-xl font-black bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer">CANCELAR</button>
               <button onClick={handleDeletePhoto} className="flex-1 py-3.5 bg-red-500 text-white hover:bg-red-600 rounded-xl font-black shadow-lg transition-colors cursor-pointer">SÍ, BORRAR</button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};
