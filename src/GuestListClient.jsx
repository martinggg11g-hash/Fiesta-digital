import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom"; // <-- IMPORTANTE
import { supabase } from "./supabase";
import { 
  Users, Search, Plus, Edit2, Trash2, CheckCircle2, 
  Clock, X, PartyPopper, UserCheck, Smartphone, Lock 
} from "lucide-react";

export const GuestListClient = () => {
  const { id } = useParams();
  
  // 🛡️ MAGIA NUCLEAR: Controlamos la sesión por la URL
  const [searchParams, setSearchParams] = useSearchParams();
  const hasUrlAccess = searchParams.get("acceso") === "permitido";
  
  const [localAccess, setLocalAccess] = useState(() => localStorage.getItem(`pin_${id}`) === 'true');
  
  // Si tiene el token en la URL o en el disco, está desbloqueado
  const isUnlocked = hasUrlAccess || localAccess;

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  
  const [manualGuests, setManualGuests] = useState([]);
  const [vipGuests, setVipGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(0);
  const [gStatus, setGStatus] = useState("Pendiente");
  const [gTable, setGTable] = useState("");
  
  const [formError, setFormError] = useState("");
  const realEventIdRef = useRef(null); 

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const fetchData = async () => {
    try {
      let { data: eventData } = await supabase.from('invitaciones').select('*').eq('id', id).single();
      if (!eventData) {
        const { data: altData } = await supabase.from('invitaciones').select('*').eq('slug', id).single();
        eventData = altData;
      }

      if (eventData) {
        realEventIdRef.current = eventData.id; 
        setEvent(eventData);
        setManualGuests(eventData.internal_data?.guests || []);

        const { data: vipData } = await supabase.from('invitados').select('*').eq('evento_id', eventData.id).order('created_at', { ascending: false });
        if (vipData) setVipGuests(vipData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase.channel(`client-room-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitaciones' }, (payload) => {
        const isMyEvent = payload.new && (
          payload.new.id === id ||
          payload.new.slug === id ||
          (realEventIdRef.current && payload.new.id === realEventIdRef.current)
        );
        
        if (isMyEvent) {
          realEventIdRef.current = payload.new.id;
          setEvent(payload.new);
          setManualGuests(payload.new.internal_data?.guests || []);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitados' }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]); 

  const handlePinSubmit = () => {
    const requiresPin = event?.config?.clientPin || event?.internal_data?.pin || '';

    if (!requiresPin || String(pinInput).trim() === String(requiresPin).trim()) {
      // 1. Guardamos en disco por si acaso
      localStorage.setItem(`pin_${id}`, 'true');
      if (event?.id) localStorage.setItem(`pin_${event.id}`, 'true');
      setLocalAccess(true);

      // 2. 🚀 INYECCIÓN EN URL: Atamos la sesión al navegador directamente.
      setSearchParams((prev) => {
        prev.set("acceso", "permitido");
        return prev;
      }, { replace: true });
      
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Intentá nuevamente.');
    }
  };

  const allGuests = [
    ...manualGuests.map(mg => ({ ...mg, isVip: false })),
    ...vipGuests.map(vg => ({
      id: vg.id,
      name: vg.nombre_completo,
      lastname: vg.apodo ? `(${vg.apodo})` : '',
      guests: vg.acompanantes_confirmados > 0 ? vg.acompanantes_confirmados : (vg.max_acompanantes || 0),
      status: vg.asistencia_confirmada ? 'Confirmado' : 'Pendiente',
      mesa: vg.mesa || '',
      timestamp: vg.created_at,
      isVip: true 
    }))
  ];

  const filteredGuests = allGuests.filter(g => 
    `${g.name} ${g.lastname} ${g.mesa}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGuests = allGuests.reduce((acc, g) => acc + 1 + Number(g.guests || 0), 0);
  const confirmedGuests = allGuests.filter(g => g.status === 'Confirmado' || g.status === 'Ingresó').reduce((acc, g) => acc + 1 + Number(g.guests || 0), 0);
  const pendingGuests = allGuests.filter(g => g.status === 'Pendiente').reduce((acc, g) => acc + 1 + Number(g.guests || 0), 0);

  const updateInternalGuests = async (newList) => {
    const eventId = realEventIdRef.current || event?.id;
    if (!eventId) return;
    
    setEvent(prev => ({
      ...prev,
      internal_data: { ...prev.internal_data, guests: newList }
    }));
    
    try {
      const { data: latest } = await supabase
        .from('invitaciones')
        .select('internal_data')
        .eq('id', eventId)
        .single();
      
      const merged = {
        ...(latest?.internal_data || {}),
        guests: newList
      };
      
      await supabase
        .from('invitaciones')
        .update({ internal_data: merged })
        .eq('id', eventId);
    } catch (err) {
      console.error('Error actualizando invitados:', err);
    }
  };

  const openNewGuest = () => {
    setEditingGuest(null);
    setGName(""); setGLastname(""); setGPax(0); setGStatus("Pendiente"); setGTable("");
    setFormError(""); 
    setShowModal(true);
  };
  
  const openEditGuest = (g) => {
    setEditingGuest(g);
    setGName(g.name); setGLastname(g.lastname); setGPax(Number(g.guests) || 0); setGStatus(g.status); setGTable(g.mesa || "");
    setFormError(""); 
    setShowModal(true);
  };

  const saveGuest = async () => {
    if(!gName && !editingGuest?.isVip) {
      setFormError("Por favor ingresá un nombre.");
      return;
    }
    
    let finalTable = gTable.trim();
    if (finalTable && !finalTable.toLowerCase().startsWith('mesa')) {
        finalTable = `Mesa ${finalTable}`;
    }
    
    if (editingGuest?.isVip) {
      setVipGuests(prev => prev.map(v => v.id === editingGuest.id ? { ...v, mesa: finalTable } : v));
      await supabase.from('invitados').update({ mesa: finalTable }).eq('id', editingGuest.id);
    } else {
      let newList = [...manualGuests];
      if (editingGuest) {
        newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, mesa: finalTable } : g);
      } else {
        const fakeId = `MANUAL-${crypto.randomUUID()}`;
        newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), mesa: finalTable, status: gStatus, timestamp: new Date().toISOString() });
      }
      
      setManualGuests(newList);
      await updateInternalGuests(newList);
    }
    setShowModal(false);
  };

  const deleteGuest = async (g) => {
    if(!window.confirm("¿Seguro que querés eliminar a este invitado?")) return;
    if (g.isVip) {
      setVipGuests(prev => prev.filter(v => v.id !== g.id));
      await supabase.from('invitados').delete().eq('id', g.id);
    } else {
      const newList = manualGuests.filter(mg => mg.id !== g.id);
      setManualGuests(newList);
      await updateInternalGuests(newList);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
        <p className="text-violet-600 font-black text-xs tracking-widest uppercase animate-pulse mt-2">
          Cargando Lista...
        </p>
      </div>
    );
  }

  if (!event) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">No se encontró el evento.</div>;

  const requiresPin = event?.config?.clientPin || event?.internal_data?.pin || '';
  
  // Condición de bloqueo. La URL manda.
  if (requiresPin && !isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center max-w-sm w-full anim-pop">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Acceso Protegido</h2>
          <p className="text-sm text-slate-500 mb-6 font-medium">Ingresá el PIN del evento para acceder a la lista nominal.</p>
          <input 
            type="password" 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-xl tracking-[0.5em] font-black outline-none focus:border-violet-500 mb-4"
            placeholder="****"
          />
          {pinError && <p className="text-red-500 text-xs font-bold mb-4">{pinError}</p>}
          <button onClick={handlePinSubmit} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 font-black transition-transform active:scale-95 shadow-lg shadow-violet-600/30">
            INGRESAR
          </button>
        </div>
      </div>
    );
  }

  const honoree = event.config?.honoreeName || event.title;
  const useTables = event.internal_data?.useTables || false;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
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
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-2">
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

        <p className="text-center text-xs text-slate-500 mb-6 font-medium">
          <span className="font-bold text-violet-600">Nota:</span> El cálculo asume 1 persona (titular) + la cantidad de acompañantes adicionales.
        </p>

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

        {filteredGuests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <UserCheck className="mx-auto text-slate-300 mb-3" size={40}/>
            <p className="text-slate-500 font-bold">No se encontraron invitados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuests.map((g) => (
              <div key={g.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-800 text-lg truncate">{g.name} {g.lastname}</h3>
                    {g.isVip && <Smartphone size={14} className="text-violet-400 shrink-0" title="Se registró por la app"/>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                      {g.guests > 0 ? `+${g.guests} ADIC` : 'SOLO TITULAR'}
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
           <div className="w-full sm:max-w-md bg-white sm:rounded-[2rem] rounded-t-[2rem] p-6 shadow-2xl relative text-center anim-pop mt-auto sm:mt-0 mb-0">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={16}/></button>
              <h3 className="font-black text-xl mb-6 text-slate-800">{editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}</h3>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-200 text-left">
                  {formError}
                </div>
              )}

              <div className="space-y-4 text-left">
                 {!editingGuest?.isVip ? (
                   <>
                     <div>
                       <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Nombre del Titular</label>
                       <input type="text" value={gName} onChange={e => setGName(e.target.value)} className={`w-full bg-slate-50 border ${formError && !gName ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white`} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500">Apellido (Opcional)</label>
                       <input type="text" value={gLastname} onChange={e => setGLastname(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-[10px] font-black uppercase mb-1.5 text-slate-500" title="No contar al titular">Acompañantes Adic.</label>
                         <input 
                            type="number" 
                            min="0" 
                            value={gPax === 0 ? '' : gPax} 
                            onChange={e => {
                                const val = parseInt(e.target.value, 10);
                                setGPax(isNaN(val) ? 0 : val);
                            }} 
                            placeholder="0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white" 
                         />
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
