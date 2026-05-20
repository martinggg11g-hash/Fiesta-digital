import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Loader2, Users, CheckCircle, Clock, Plus, Share2, Copy, Trash2, Lock, MonitorPlay, GripVertical, Image as ImageIcon } from 'lucide-react';

// ==========================================
// 📺 MODO PROYECTOR (Slideshow Automático)
// ==========================================
const ProjectorScreen = ({ eventSlug }) => {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      // BUSCAMOS POR ID CORTO ("evt-...") QUE ES EL SLUG EN ESTA TABLA
      const { data } = await supabase.from('invitaciones').select('internal_data').eq('id', eventSlug).single();
      if (data?.internal_data?.live_photos) {
        setPhotos(prev => {
          if (prev.length !== data.internal_data.live_photos.length) setIdx(0);
          return data.internal_data.live_photos;
        });
      }
    };
    
    fetchPhotos(); 
    const radar = setInterval(fetchPhotos, 3000); 
    return () => clearInterval(radar);
  }, [eventSlug]);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-black text-2xl uppercase tracking-widest text-center px-4">
        <ImageIcon size={64} className="mb-6 opacity-50 animate-bounce" />
        <span className="opacity-50">Esperando que los invitados<br/>suban las primeras fotos...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden">
       <img 
         key={photos[idx]} 
         src={photos[idx]} 
         className="max-w-full max-h-full object-contain animate-[fdPop_1s_ease-out_forwards]" 
         alt="En vivo" 
       />
    </div>
  );
};

// ==========================================
// 👔 PANEL DE GESTIÓN PRINCIPAL
// ==========================================
export const ManageScreen = () => {
  const eventSlug = window.location.pathname.split('/').pop();
  const isProjectorMode = new URLSearchParams(window.location.search).get('mode') === 'projector';

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [realDbId, setRealDbId] = useState(null); // 👉 ACÁ GUARDAMOS EL ID VERDADERO
  
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [activeTab, setActiveTab] = useState('lista');
  const [invitados, setInvitados] = useState([]);
  const [newGuest, setNewGuest] = useState({ nombre_completo: '', apodo: '', max_acompanantes: 0 });
  const [adding, setAdding] = useState(false);

  // 👉 ESTADO PARA EL LÍMITE DE MESAS
  const [maxPaxPorMesa, setMaxPaxPorMesa] = useState(10);

  useEffect(() => {
    const fetchEvent = async () => {
      // BUSCAMOS LA INVITACIÓN USANDO EL SLUG CORTO ("evt-...")
      const { data, error } = await supabase.from('invitaciones').select('*').eq('id', eventSlug).single();
      if (error) {
         console.error("Error buscando evento:", error);
         setLoading(false);
         return;
      }
      
      if (data) {
         setEventData(data);
         const verifiedRealId = data.evento_id || data.id; 
         setRealDbId(verifiedRealId);

         // 👉 CARGAMOS EL LÍMITE DESDE LA BASE DE DATOS (si existe)
         if (data.config?.max_por_mesa) {
             setMaxPaxPorMesa(data.config.max_por_mesa);
         }

         if (!data.config?.clientPin || isProjectorMode) setIsAuthenticated(true);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventSlug, isProjectorMode]);

  useEffect(() => {
    if (isAuthenticated && realDbId && !isProjectorMode) {
      fetchInvitados();
    }
  }, [isAuthenticated, realDbId, isProjectorMode]);

  const fetchInvitados = async () => {
    const { data, error } = await supabase.from('invitados').select('*').eq('evento_id', realDbId).order('created_at', { ascending: false });
    if (error) console.error("Error buscando invitados:", error);
    if (data) setInvitados(data);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === eventData?.config?.clientPin) {
      setIsAuthenticated(true);
    } else {
      alert('PIN incorrecto. Revisá el código e intentá de nuevo.');
      setPinInput('');
    }
  };

  const handleAddGuest = async (e) => {
     e.preventDefault();
     if (!newGuest.nombre_completo || !realDbId) return;
     setAdding(true);
     
     const { data, error } = await supabase.from('invitados').insert([{
        evento_id: realDbId,
        nombre_completo: newGuest.nombre_completo,
        apodo: newGuest.apodo,
        max_acompanantes: newGuest.max_acompanantes,
        mesa: 'Sin Asignar'
     }]).select();

     if (error) {
        console.error("SUPABASE ERROR:", error);
        alert(`Error al guardar: ${error.message}`);
     } else if (data) {
        setInvitados([data[0], ...invitados]);
        setNewGuest({ nombre_completo: '', apodo: '', max_acompanantes: 0 }); 
     }
     setAdding(false);
  };

  const handleDelete = async (id) => {
     if(!window.confirm("¿Seguro que querés borrar a este invitado? Su pase dejará de funcionar.")) return;
     const { error } = await supabase.from('invitados').delete().eq('id', id);
     if (error) {
       alert("Error al borrar: " + error.message);
       return;
     }
     setInvitados(invitados.filter(i => i.id !== id));
  };

  // 👉 ACTUALIZAR LÍMITE DE MESAS EN SUPABASE
  const handleUpdateMaxPax = async (nuevoMaximo) => {
    setMaxPaxPorMesa(nuevoMaximo);
    
    // Mantenemos el resto de la configuración intacta
    const updatedConfig = { 
      ...(eventData?.config || {}), 
      max_por_mesa: nuevoMaximo 
    };

    const { error } = await supabase
      .from('invitaciones')
      .update({ config: updatedConfig })
      .eq('id', eventSlug);

    if (error) {
      alert("Error al guardar el límite en la base de datos: " + error.message);
    } else {
      setEventData({ ...eventData, config: updatedConfig });
    }
  };

  // 👉 MOVER INVITADO DE MESA (CON VALIDACIÓN DE LÍMITE)
  const handleUpdateMesa = async (guestId, nuevaMesa) => {
    if (nuevaMesa !== 'Sin Asignar') {
      // Calculamos ocupantes actuales
      const ocupantesActuales = invitados
        .filter(i => i.asistencia_confirmada && i.mesa === nuevaMesa)
        .reduce((total, inv) => total + 1 + (inv.acompanantes_confirmados || 0), 0);

      // Calculamos cuánto espacio necesita este invitado
      const invitadoAMover = invitados.find(i => i.id === guestId);
      const lugaresNecesarios = 1 + (invitadoAMover.acompanantes_confirmados || 0);

      // Validamos límite
      if (ocupantesActuales + lugaresNecesarios > maxPaxPorMesa) {
        alert(`⚠️ Capacidad excedida: La ${nuevaMesa} tiene límite de ${maxPaxPorMesa} pax. (Hay ${ocupantesActuales} personas y querés sumar ${lugaresNecesarios}).`);
        return; // Frenamos la actualización
      }
    }

    const updated = invitados.map(i => i.id === guestId ? { ...i, mesa: nuevaMesa } : i);
    setInvitados(updated);
    const { error } = await supabase.from('invitados').update({ mesa: nuevaMesa }).eq('id', guestId);
    if (error) alert("Error guardando mesa: " + error.message);
  };

  const handleDragStart = (e, guestId) => {
    e.dataTransfer.setData('guestId', guestId);
  };

  const handleDrop = (e, mesaNombre) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) handleUpdateMesa(guestId, mesaNombre);
  };

  const copyLink = (id) => {
     navigator.clipboard.writeText(`${window.location.origin}/invite/${eventSlug}?guest=${id}`);
     alert("¡Link copiado al portapapeles!");
  };

  const sendWhatsApp = (invitado) => {
     const link = `${window.location.origin}/invite/${eventSlug}?guest=${invitado.id}`;
     const nombreAMostrar = invitado.apodo || invitado.nombre_completo;
     const text = `¡Hola ${nombreAMostrar}! Te comparto tu pase VIP para nuestro evento. Por favor confirmá tu asistencia acá: ${link}`;
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-violet-600" size={40} /></div>;
  if (!eventData) return <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-slate-500">Evento no encontrado.</div>;
  
  if (isProjectorMode) return <ProjectorScreen eventSlug={eventSlug} />;

  if (!isAuthenticated) {
     return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
           <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={32}/></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Acceso Privado</h2>
              <p className="text-sm text-slate-500 mb-6">Ingresá el PIN de 4 dígitos que te brindó el salón.</p>
              <input type="password" maxLength="4" className="w-full text-center text-3xl tracking-[0.5em] font-black p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} required />
              <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">Ingresar</button>
           </form>
        </div>
     );
  }

  const confirmados = invitados.filter(i => i.asistencia_confirmada).length;
  const acompañantesConfirmados = invitados.filter(i => i.asistencia_confirmada).reduce((acc, curr) => acc + (curr.acompanantes_confirmados || 0), 0);
  const totalGenteReal = confirmados + acompañantesConfirmados;
  const pendientes = invitados.length - confirmados;

  return (
     <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
        <div className="max-w-6xl mx-auto space-y-6">
           
           <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                 <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Panel de Control VIP</h1>
                 <p className="text-slate-500">Gestioná tus invitados y el armado de mesas.</p>
              </div>
              <button 
                 onClick={() => window.open(`${window.location.pathname}?mode=projector`, '_blank')} 
                 className="flex items-center gap-2 px-5 py-3 bg-black text-white font-black uppercase tracking-widest rounded-xl text-xs hover:bg-slate-800 transition-all shadow-lg shadow-black/20"
              >
                 <MonitorPlay size={16} /> Link Proyector DJ
              </button>
           </header>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Users size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pases</p><p className="text-xl md:text-3xl font-black">{invitados.length}</p></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirman</p><p className="text-xl md:text-3xl font-black">{confirmados}</p></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0"><Users size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pax. Total</p><p className="text-xl md:text-3xl font-black">{totalGenteReal}</p></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0"><Clock size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Faltan</p><p className="text-xl md:text-3xl font-black">{pendientes}</p></div>
              </div>
           </div>

           <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full max-w-sm mx-auto md:mx-0">
              <button onClick={() => setActiveTab('lista')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'lista' ? 'bg-violet-50 text-violet-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>👥 Invitados</button>
              <button onClick={() => setActiveTab('mesas')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'mesas' ? 'bg-violet-50 text-violet-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>🪑 Mesas</button>
           </div>

           {activeTab === 'lista' && (
             <>
               <form onSubmit={handleAddGuest} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nombre y Apellido *</label><input type="text" required value={newGuest.nombre_completo} onChange={e=>setNewGuest({...newGuest, nombre_completo: e.target.value})} placeholder="Ej: Familia Pérez" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium" /></div>
                  <div className="flex-1 w-full"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Apodo (Opcional)</label><input type="text" value={newGuest.apodo} onChange={e=>setNewGuest({...newGuest, apodo: e.target.value})} placeholder="Ej: Los Tíos" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium" /></div>
                  <div className="w-full md:w-32"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Pases Extra</label><input type="number" min="0" value={newGuest.max_acompanantes} onChange={e=>setNewGuest({...newGuest, max_acompanantes: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-center font-bold" /></div>
                  <button type="submit" disabled={adding} className="w-full md:w-auto p-4 px-8 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                    {adding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20}/>} <span className="md:hidden lg:inline">{adding ? 'Guardando' : 'Agregar'}</span>
                  </button>
               </form>

               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  {invitados.length === 0 ? (
                     <div className="p-16 text-center text-slate-400"><Users size={64} className="mx-auto mb-4 opacity-20"/><p className="font-medium text-lg">Todavía no agregaste a nadie.</p><p className="text-sm">Usá el formulario de arriba para armar tu lista VIP.</p></div>
                  ) : (
                     <div className="divide-y divide-slate-100">
                        {invitados.map(inv => (
                           <div key={inv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                              <div>
                                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">{inv.nombre_completo} {inv.asistencia_confirmada && <CheckCircle size={18} className="text-green-500"/>}</h3>
                                 <p className="text-sm font-medium text-slate-500 mt-1">{inv.apodo && <span className="italic mr-2">"{inv.apodo}" •</span>} Pases extra habilitados: <span className="font-bold text-slate-700">{inv.max_acompanantes}</span></p>
                              </div>
                              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                 {inv.asistencia_confirmada ? (
                                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg hidden md:block border border-green-200">Confirmado (+{inv.acompanantes_confirmados})</span>
                                 ) : (
                                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-lg hidden md:block border border-orange-200">Pendiente</span>
                                 )}
                                 <button onClick={()=>copyLink(inv.id)} className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors" title="Copiar Link"><Copy size={18}/></button>
                                 <button onClick={()=>sendWhatsApp(inv)} className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-colors flex items-center gap-2 font-bold shadow-sm" title="Enviar por WhatsApp"><Share2 size={18}/> <span className="hidden sm:inline">Enviar</span></button>
                                 <button onClick={()=>handleDelete(inv.id)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors ml-2"><Trash2 size={18}/></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
             </>
           )}

           {activeTab === 'mesas' && (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="mb-6 border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-black text-slate-800">Organizador de Mesas</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">Arrastrá a los invitados confirmados hacia su mesa.</p>
      </div>
      
      {/* EL CLIENTE SOLO VE EL LÍMITE, NO LO PUEDE EDITAR */}
      <div className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Capacidad Máxima:</span>
        <span className="text-sm font-black text-slate-800">{maxPaxPorMesa} pax/mesa</span>
      </div>
    </div>
    
    {/* ... acá abajo sigue tu grilla normal de mesas (grid-cols-1 md:grid-cols-3) ... */}
                  
                  <div className="flex items-center gap-3 bg-violet-50 p-2 pl-4 rounded-xl border border-violet-100">
                    <label className="text-xs font-bold text-violet-700 uppercase tracking-wide">Límite por Mesa:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={maxPaxPorMesa} 
                      onChange={(e) => setMaxPaxPorMesa(Number(e.target.value))}
                      onBlur={(e) => handleUpdateMaxPax(Number(e.target.value))} 
                      className="w-16 p-2 text-center text-sm font-black border border-violet-200 rounded-lg outline-none focus:border-violet-500 text-violet-900 bg-white"
                      title="Se guarda automáticamente al hacer clic afuera"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {['Sin Asignar', 'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10'].map((mesaNombre) => {
                     const invitadosMesa = invitados.filter(i => i.asistencia_confirmada && (i.mesa === mesaNombre || (!i.mesa && mesaNombre === 'Sin Asignar')));
                     
                     if (mesaNombre !== 'Sin Asignar' && invitadosMesa.length === 0) {
                        return (
                           <div key={mesaNombre} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, mesaNombre)} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 border-dashed opacity-50 hover:opacity-100 transition-opacity min-h-[150px]">
                             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">{mesaNombre}</h3>
                             <p className="text-[10px] font-bold text-slate-400 text-center mt-8">Soltar aquí</p>
                           </div>
                        );
                     }

                     return (
                       <div key={mesaNombre} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, mesaNombre)} className={`p-4 rounded-2xl border min-h-[150px] transition-colors ${mesaNombre === 'Sin Asignar' ? 'bg-orange-50 border-orange-200' : 'bg-violet-50 border-violet-200'}`}>
                         <div className="flex justify-between items-center mb-4">
                           <h3 className={`text-xs font-black uppercase tracking-widest ${mesaNombre === 'Sin Asignar' ? 'text-orange-700' : 'text-violet-700'}`}>{mesaNombre}</h3>
                           <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md shadow-sm">{invitadosMesa.length} Pax</span>
                         </div>
                         
                         <div className="space-y-2">
                           {invitadosMesa.map(inv => (
                             <div key={inv.id} draggable onDragStart={e => handleDragStart(e, inv.id)} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing flex flex-col md:flex-row md:items-center gap-2 md:gap-3 hover:border-violet-300 transition-colors group">
                               <div className="flex items-center gap-3 w-full">
                                 {/* Ocultamos el ícono de arrastrar en móvil porque ahí usaremos el selector */}
                                 <GripVertical size={14} className="text-slate-300 group-hover:text-violet-400 hidden md:block" />
                                 <div className="flex-1 min-w-0">
                                   <p className="text-xs font-bold text-slate-800 truncate" title={inv.nombre_completo}>{inv.nombre_completo}</p>
                                   {(inv.acompanantes_confirmados > 0) && <p className="text-[9px] text-slate-500 font-medium">+{inv.acompanantes_confirmados} acomp.</p>}
                                 </div>
                               </div>

                               {/* Selector rápido SOLO visible en móviles */}
                               <select 
                                 value={mesaNombre} 
                                 onChange={(e) => handleUpdateMesa(inv.id, e.target.value)}
                                 className="md:hidden w-full mt-2 text-[10px] p-2 font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none focus:border-violet-400"
                               >
                                 <option value="Sin Asignar" disabled={mesaNombre === 'Sin Asignar'}>Mover a...</option>
                                 {['Sin Asignar', 'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10'].map(opcion => (
                                   <option key={opcion} value={opcion}>{opcion}</option>
                                 ))}
                               </select>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                  })}
                </div>
             </div>
           )}

        </div>
     </div>
  );
};
