import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";
import { 
  Users, Search, Plus, Edit2, Trash2, CheckCircle2, 
  Clock, X, PartyPopper, UserCheck, Smartphone 
} from "lucide-react";

export const GuestListClient = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  
  // Estados de invitados
  const [manualGuests, setManualGuests] = useState([]);
  const [vipGuests, setVipGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(1);
  const [gStatus, setGStatus] = useState("Pendiente");
  const [gTable, setGTable] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Buscar el evento por ID o slug
      let { data: eventData } = await supabase.from('invitaciones').select('*').eq('id', id).single();
      if (!eventData) {
        const { data: altData } = await supabase.from('invitaciones').select('*').eq('slug', id).single();
        eventData = altData;
      }

      if (eventData) {
        setEvent(eventData);
        setManualGuests(eventData.internal_data?.guests || []);

        // 2. Buscar invitados VIP de la app
        const { data: vipData } = await supabase.from('invitados').select('*').eq('evento_id', eventData.id).order('created_at', { ascending: false });
        if (vipData) setVipGuests(vipData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setLoading(false);
  };

  // Combinar y unificar listas
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

  // Filtrar por buscador
  const filteredGuests = allGuests.filter(g => 
    `${g.name} ${g.lastname} ${g.mesa}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const totalGuests = allGuests.reduce((acc, g) => acc + Number(g.guests || 0), 0);
  const confirmedGuests = allGuests.filter(g => g.status === 'Confirmado' || g.status === 'Ingresó').reduce((acc, g) => acc + Number(g.guests || 0), 0);
  const pendingGuests = allGuests.filter(g => g.status === 'Pendiente').reduce((acc, g) => acc + Number(g.guests || 0), 0);

  // Acciones de actualización a Supabase
  const updateInternalGuests = async (newList) => {
    const newData = { ...event.internal_data, guests: newList };
    await supabase.from('invitaciones').update({ internal_data: newData }).eq('id', event.id);
    setManualGuests(newList);
    setEvent({ ...event, internal_data: newData });
  };

  const openNewGuest = () => {
    setEditingGuest(null);
    setGName(""); setGLastname(""); setGPax(1); setGStatus("Pendiente"); setGTable("");
    setShowModal(true);
  };
  
  const openEditGuest = (g) => {
    setEditingGuest(g);
    setGName(g.name); setGLastname(g.lastname); setGPax(g.guests); setGStatus(g.status); setGTable(g.mesa || "");
    setShowModal(true);
  };

  const saveGuest = async () => {
    if(!gName && !editingGuest?.isVip) return alert("Por favor ingresá un nombre.");
    
    let finalTable = gTable.trim();
    if (finalTable && !finalTable.toLowerCase().startsWith('mesa')) {
        finalTable = `Mesa ${finalTable}`;
    }
    
    if (editingGuest?.isVip) {
      // Actualiza en base de datos tabla 'invitados'
      await supabase.from('invitados').update({ mesa: finalTable }).eq('id', editingGuest.id);
      setVipGuests(vipGuests.map(v => v.id === editingGuest.id ? { ...v, mesa: finalTable } : v));
    } else {
      // Actualiza manuales en JSON
      let newList = [...manualGuests];
      if (editingGuest) {
        newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: finalTable } : g);
      } else {
        const fakeId = `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), mesa: finalTable, status: gStatus, timestamp: new Date().toISOString() });
      }
      await updateInternalGuests(newList);
    }
    setShowModal(false);
  };

  const deleteGuest = async (g) => {
    if(!window.confirm("¿Seguro que querés eliminar a este invitado?")) return;
    
    if (g.isVip) {
      await supabase.from('invitados').delete().eq('id', g.id);
      setVipGuests(vipGuests.filter(v => v.id !== g.id));
    } else {
      const newList = manualGuests.filter(mg => mg.id !== g.id);
      await updateInternalGuests(newList);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-violet-600 font-bold">Cargando tu lista...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">No se encontró el evento.</div>;

  const honoree = event.config?.honoreeName || event.title;
  const useTables = event.internal_data?.useTables || false;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-violet-700 text-white pt-8 pb-16 px-4 md:px-8 rounded-b-[2rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 backdrop-blur-sm">
            <PartyPopper size={14}/> PANEL DEL AGASAJADO
          </div>
          <h1 className="text-3xl font-black mb-2 leading-tight">Lista de Invitados</h1>
          <p className="text-violet-200 font-medium text-lg">{honoree}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
            <Users size={20} className="text-violet-500 mb-2"/>
            <span className="text-2xl md:text-3xl font-black text-slate-800">{totalGuests}</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Totales</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
            <CheckCircle2 size={20} className="text-green-500 mb-2"/>
            <span className="text-2xl md:text-3xl font-black text-slate-800">{confirmedGuests}</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Confirmados</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
            <Clock size={20} className="text-amber-500 mb-2"/>
            <span className="text-2xl md:text-3xl font-black text-slate-800">{pendingGuests}</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pendientes</span>
          </div>
        </div>

        {/* Buscador y Botón Agregar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Buscar por nombre o mesa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          <button 
            onClick={openNewGuest}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl py-4 px-6 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-transform active:scale-95"
          >
            <Plus size={18}/> AGREGAR MANUAL
          </button>
        </div>

        {/* Lista de Invitados (Versión Mobile-Friendly) */}
        {filteredGuests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <UserCheck className="mx-auto text-slate-300 mb-3" size={40}/>
            <p className="text-slate-500 font-bold">No se encontraron invitados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuests.map((g, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-800 text-lg truncate">{g.name} {g.lastname}</h3>
                    {g.isVip && <Smartphone size={14} className="text-violet-400 shrink-0" title="Se registró por la app"/>}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                      {g.guests} {g.guests === 1 ? 'PERS' : 'PERS'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${g.status === 'Confirmado' || g.status === 'Ingresó' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {g.status}
                    </span>
                    {useTables && g.mesa && (
                       <span className="bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                         {g.mesa}
                       </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEditGuest(g)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-colors"><Edit2 size={16}/></button>
                  <button onClick={() => deleteGuest(g)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="w-full sm:max-w-md bg-white sm:rounded-[2rem] rounded-t-[2rem] p-6 shadow-2xl relative text-center anim-pop">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={16}/></button>
              <h3 className="font-black text-xl mb-6 text-slate-800">{editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}</h3>
              
              <div className="space-y-4 text-left">
                 {!editingGuest?.isVip ? (
                   <>
                     <div>
                       <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Nombre</label>
                       <input type="text" value={gName} onChange={e => setGName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Apellido (Opcional)</label>
                       <input type="text" value={gLastname} onChange={e => setGLastname(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Cantidad</label>
                         <input type="number" min="1" value={gPax} onChange={e => setGPax(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Estado</label>
                         <select value={gStatus} onChange={e => setGStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white appearance-none">
                           <option value="Pendiente">Pendiente</option>
                           <option value="Confirmado">Confirmado</option>
                         </select>
                       </div>
                     </div>
                   </>
                 ) : (
                   <div className="p-4 bg-violet-50 text-violet-800 rounded-xl text-xs font-bold border border-violet-200 mb-4 text-center">
                     Este invitado se registró mediante la App o Escáner. Solo podés asignarle la mesa.
                   </div>
                 )}
                 
                 {useTables && (
                   <div>
                     <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Asignar Mesa (Opcional)</label>
                     <input type="text" placeholder="Ej: Mesa 12" value={gTable} onChange={e => setGTable(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" />
                   </div>
                 )}
                 
                 <button onClick={saveGuest} className="w-full py-4 mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 shadow-lg shadow-violet-600/30">
                   GUARDAR INVITADO
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
