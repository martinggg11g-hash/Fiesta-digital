import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Loader2, Users, CheckCircle, Clock, Plus, Share2, Copy, Trash2, Lock } from 'lucide-react';

export const ManageScreen = () => {
  // Extraemos el slug del evento de la URL
  const eventSlug = window.location.pathname.split('/').pop();
  
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  
  // Estados para el Login con PIN
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estados para la gestión de la lista
  const [invitados, setInvitados] = useState([]);
  const [newGuest, setNewGuest] = useState({ nombre_completo: '', apodo: '', max_acompanantes: 0 });
  const [adding, setAdding] = useState(false);

  // 1️⃣ Cargar datos del evento para verificar el PIN
  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', eventSlug)
        .single();
        
      if (data) {
         setEventData(data);
         // Si el salón no le configuró PIN, entra directo
         if (!data.config?.clientPin) setIsAuthenticated(true);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventSlug]);

  // 2️⃣ Cargar la lista de invitados (solo si ya pasó el PIN)
  useEffect(() => {
    if (isAuthenticated && eventData) {
      fetchInvitados();
    }
  }, [isAuthenticated, eventData]);

  const fetchInvitados = async () => {
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .eq('evento_id', eventData.id)
      .order('created_at', { ascending: false });
      
    if (data) setInvitados(data);
  };

  // 3️⃣ Validar el PIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === eventData?.config?.clientPin) {
      setIsAuthenticated(true);
    } else {
      alert('PIN incorrecto. Revisá el código e intentá de nuevo.');
      setPinInput('');
    }
  };

  // 4️⃣ Agregar un invitado nuevo a la BD
  const handleAddGuest = async (e) => {
     e.preventDefault();
     if (!newGuest.nombre_completo) return;
     setAdding(true);
     
     const { data, error } = await supabase.from('invitados').insert([{
        evento_id: eventData.id,
        nombre_completo: newGuest.nombre_completo,
        apodo: newGuest.apodo,
        max_acompanantes: newGuest.max_acompanantes
     }]).select();

     if (data) {
        setInvitados([data[0], ...invitados]); // Lo agregamos arriba en la lista local
        setNewGuest({ nombre_completo: '', apodo: '', max_acompanantes: 0 }); // Limpiamos inputs
     } else {
        alert("Error al guardar invitado.");
     }
     setAdding(false);
  };

  // 5️⃣ Borrar un invitado
  const handleDelete = async (id) => {
     if(!window.confirm("¿Seguro que querés borrar a este invitado? Su pase dejará de funcionar.")) return;
     await supabase.from('invitados').delete().eq('id', id);
     setInvitados(invitados.filter(i => i.id !== id));
  };

  // 6️⃣ Copiar y compartir link
  const generateInviteLink = (guestId) => {
     // Este será el link público final que armaremos después
     return `${window.location.origin}/invite/${eventSlug}?guest=${guestId}`;
  };

  const copyLink = (id) => {
     navigator.clipboard.writeText(generateInviteLink(id));
     alert("¡Link copiado al portapapeles!");
  };

  const sendWhatsApp = (invitado) => {
     const link = generateInviteLink(invitado.id);
     const nombreAMostrar = invitado.apodo || invitado.nombre_completo;
     const text = `¡Hola ${nombreAMostrar}! Te comparto tu pase VIP para nuestro evento. Por favor confirmá tu asistencia acá: ${link}`;
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Pantallas de Carga y Error
  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-violet-600" size={40} /></div>;
  if (!eventData) return <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-slate-500">Evento no encontrado.</div>;

  // PANTALLA DE LOGIN CON PIN
  if (!isAuthenticated) {
     return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
           <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={32}/></div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Acceso Privado</h2>
              <p className="text-sm text-slate-500 mb-6">Ingresá el PIN de 4 dígitos que te brindó el salón para gestionar tu lista de invitados.</p>
              <input 
                type="password" 
                maxLength="4" 
                className="w-full text-center text-3xl tracking-[0.5em] font-black p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" 
                value={pinInput} 
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} // Solo números
                required 
              />
              <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">Ingresar</button>
           </form>
        </div>
     );
  }

  // CÁLCULO DE ESTADÍSTICAS
  const confirmados = invitados.filter(i => i.asistencia_confirmada).length;
  const pendientes = invitados.length - confirmados;

  // DASHBOARD PRINCIPAL
  return (
     <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
        <div className="max-w-5xl mx-auto space-y-6">
           
           <header className="mb-8 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Panel de Invitados VIP</h1>
              <p className="text-slate-500">Agregá a tus invitados y enviales su pase único por WhatsApp.</p>
           </header>

           {/* TARJETAS DE ESTADÍSTICAS */}
           <div className="grid grid-cols-3 gap-3 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Users size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p><p className="text-xl md:text-3xl font-black">{invitados.length}</p></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirman</p><p className="text-xl md:text-3xl font-black">{confirmados}</p></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0"><Clock size={24}/></div>
                 <div><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Faltan</p><p className="text-xl md:text-3xl font-black">{pendientes}</p></div>
              </div>
           </div>

           {/* FORMULARIO PARA AGREGAR INVITADO */}
           <form onSubmit={handleAddGuest} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nombre y Apellido *</label>
                <input type="text" required value={newGuest.nombre_completo} onChange={e=>setNewGuest({...newGuest, nombre_completo: e.target.value})} placeholder="Ej: Familia Pérez" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Apodo (Opcional)</label>
                <input type="text" value={newGuest.apodo} onChange={e=>setNewGuest({...newGuest, apodo: e.target.value})} placeholder="Ej: Los Tíos" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium" />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Pases Extra</label>
                <input type="number" min="0" value={newGuest.max_acompanantes} onChange={e=>setNewGuest({...newGuest, max_acompanantes: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-center font-bold" />
              </div>
              <button type="submit" disabled={adding} className="w-full md:w-auto p-4 px-8 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                {adding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20}/>} 
                <span className="md:hidden lg:inline">{adding ? 'Guardando' : 'Agregar'}</span>
              </button>
           </form>

           {/* LISTA DE INVITADOS CARGADOS */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {invitados.length === 0 ? (
                 <div className="p-16 text-center text-slate-400">
                   <Users size={64} className="mx-auto mb-4 opacity-20"/> 
                   <p className="font-medium text-lg">Todavía no agregaste a nadie.</p>
                   <p className="text-sm">Usá el formulario de arriba para armar tu lista VIP.</p>
                 </div>
              ) : (
                 <div className="divide-y divide-slate-100">
                    {invitados.map(inv => (
                       <div key={inv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          
                          <div>
                             <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                               {inv.nombre_completo} 
                               {inv.asistencia_confirmada && <CheckCircle size={18} className="text-green-500"/>}
                             </h3>
                             <p className="text-sm font-medium text-slate-500 mt-1">
                               {inv.apodo && <span className="italic mr-2">"{inv.apodo}" •</span>} 
                               Pases extra habilitados: <span className="font-bold text-slate-700">{inv.max_acompanantes}</span>
                             </p>
                          </div>

                          <div className="flex items-center gap-2 md:gap-3 shrink-0">
                             {inv.asistencia_confirmada ? (
                                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg hidden md:block border border-green-200">
                                  Confirmado (+{inv.acompanantes_confirmados})
                                </span>
                             ) : (
                                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-lg hidden md:block border border-orange-200">
                                  Pendiente
                                </span>
                             )}
                             
                             <button onClick={()=>copyLink(inv.id)} className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors" title="Copiar Link">
                               <Copy size={18}/>
                             </button>
                             <button onClick={()=>sendWhatsApp(inv)} className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-colors flex items-center gap-2 font-bold shadow-sm" title="Enviar por WhatsApp">
                               <Share2 size={18}/> <span className="hidden sm:inline">Enviar</span>
                             </button>
                             <button onClick={()=>handleDelete(inv.id)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors ml-2">
                               <Trash2 size={18}/>
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>

        </div>
     </div>
  );
};
