import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Routes, Route, useParams, Navigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { InvitePreview } from "./Preview";
import { DEF_CONFIG } from "./config";
import { OpeningAnimation } from "./Lotties";
import { supabase } from "./supabase"; 

// LAZY LOADING
const LoginScreen = React.lazy(() => import("./Login"));
const DashboardScreen = React.lazy(() => import("./Dashboard"));
const PuertaScreen = React.lazy(() => import("./Puerta"));
const EditorScreen = React.lazy(() => import("./Editor").then(module => ({ default: module.EditorScreen })));
const ManageScreen = React.lazy(() => import("./Manage").then(module => ({ default: module.ManageScreen })));
const GuestListClientScreen = React.lazy(() => import("./GuestListClient").then(module => ({ default: module.GuestListClient })));

const LoadingFallback = () => (
  <div className="h-screen w-full bg-black absolute inset-0 z-[9999] flex items-center justify-center">
    <Loader2 className="animate-spin text-white" size={40} />
  </div>
);

const toBool = (v) => v === true || v === 'true' || v === 1;

// ===============================================
// 📱 PANTALLA INVITADO VIP
// ===============================================
const LiveInviteScreen = () => {
  const { id: eventSlug } = useParams();
  const [searchParams] = useSearchParams();
  const guestId = searchParams.get('guest'); 
  const [inv, setInv] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventAndGuest = async () => {
      try { 
        const { data: eventData } = await supabase.from('invitaciones').select('*').eq('id', eventSlug).single();
        if (eventData) {
          setInv(eventData);
          document.title = eventData.config?.honoreeName ? `${eventData.config.honoreeName} | Invitación` : "Invitación";
        }
        if (guestId) {
          const { data: gData } = await supabase.from('invitados').select('*').eq('id', guestId).single();
          if (gData) setGuestData(gData);
        }
      } catch (error) {
        console.error("Error cargando evento:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchEventAndGuest();
  }, [eventSlug, guestId]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!inv) return <div className="h-screen bg-black text-white flex items-center justify-center font-black">Evento no encontrado</div>;

  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} isPreview={false} />}
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview 
          cfg={inv.config} 
          internalData={inv.internal_data}
          guestData={guestData} 
          onConfirmRSVP={async (formData) => {
             if (guestData) {
                await supabase.from('invitados').update({ 
                  asistencia_confirmada: true, 
                  acompanantes_confirmados: formData.guests 
                }).eq('id', guestData.id);
             }
          }} 
          onUploadLivePhoto={async (url) => {
             // Operación segura: leemos el estado fresco antes de guardar (previene borrado de datos cruzados)
             const { data: latest } = await supabase.from('invitaciones').select('internal_data').eq('id', inv.id).single();
             const currentPhotos = latest?.internal_data?.live_photos || inv.internal_data?.live_photos || [];
             
             const updatedInternal = { ...inv.internal_data, ...(latest?.internal_data || {}), live_photos: [url, ...currentPhotos] };
             await supabase.from('invitaciones').update({ internal_data: updatedInternal }).eq('id', inv.id);
             setInv({ ...inv, internal_data: updatedInternal });
          }}
        />
      </div>
    </div>
  );
};

// ===============================================
// 📣 PANTALLA INVITADO PÚBLICO
// ===============================================
const PublicInviteScreen = ({ invitations, onConfirmRSVP, onUpdateInternal }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);
  
  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  
  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} isPreview={false} />}
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview 
          cfg={inv.config} 
          internalData={inv.internal_data}
          status={inv.internal_data?.eventStatus} 
          onConfirmRSVP={(guestData) => onConfirmRSVP(inv.id, guestData, inv.evento_id || inv.id)} 
          onUploadLivePhoto={async (url) => {
             // Se maneja a través de onUpdateInternal para evitar concurrencia
             const currentPhotos = inv.internal_data?.live_photos || [];
             await onUpdateInternal(inv.id, 'live_photos', [url, ...currentPhotos]);
          }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const local = localStorage.getItem("fiesta_user");
      const session = sessionStorage.getItem("fiesta_user");
      return local ? JSON.parse(local) : session ? JSON.parse(session) : null;
    } catch (e) { return null; }
  });

  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [globalAlert, setGlobalAlert] = useState({ mensaje: "", activo: false });
  const [loading, setLoading] = useState(true);

  const handleLogin = useCallback((u, r) => {
    setUser(u);
    if (r) localStorage.setItem("fiesta_user", JSON.stringify(u));
    else sessionStorage.setItem("fiesta_user", JSON.stringify(u));
  }, []);

  const handleLogout = useCallback(() => { 
    setUser(null); 
    localStorage.removeItem("fiesta_user"); 
    sessionStorage.removeItem("fiesta_user"); 
  }, []);

  // Fetch inicial aislado (CRASH-04 mitigado)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salones } = await supabase.from('salones').select('*');
        const { data: invs } = await supabase.from('invitaciones').select('*');
        const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
        
        if (salones) setUsers(salones);
        if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {}, config: i.config || {} })));
        if (alertData) setGlobalAlert({ mensaje: alertData.mensaje || "", activo: toBool(alertData.activo) });
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Canal realtime aislado (CRASH-04 mitigado)
  useEffect(() => {
    const channel = supabase
      .channel('fiesta-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitaciones' }, (payload) => {
        if (payload.new && payload.new.id) {
          setInvitations(prevInvs => prevInvs.map(inv => 
            inv.id === payload.new.id ? { 
              ...inv, 
              ...payload.new,
              salonId: payload.new.salon_id, 
              internal_data: payload.new.internal_data || {}, 
              config: payload.new.config || {} 
            } : inv
          ));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alertas' }, (payload) => {
        if (payload.new && payload.new.id === 1) {
          setGlobalAlert({ mensaje: payload.new.mensaje || "", activo: toBool(payload.new.activo) });
        }
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, []);

  // 👇 FIX CRÍTICO CRASH-02: Evitamos race conditions aislando la db del React state
  const handleUpdateInternal = useCallback(async (id, f, v) => {
    // 1. UI Optimista (se siente instantáneo para el usuario)
    setInvitations(prev => {
      const inv = prev.find(i => i.id === id);
      if (!inv) return prev;
      return prev.map(i => i.id === id ? { ...i, internal_data: { ...inv.internal_data, [f]: v } } : i);
    });

    // 2. Base de datos: Consultar lo último antes de pisar el objeto
    try {
      const { data: latest } = await supabase.from('invitaciones').select('internal_data').eq('id', id).single();
      const mergedInternal = latest && latest.internal_data ? { ...latest.internal_data, [f]: v } : { [f]: v };
      
      const { error } = await supabase.from('invitaciones').update({ internal_data: mergedInternal }).eq('id', id);
      if (error) console.error("Error al guardar internal_data:", error);
    } catch (err) {
      console.error("Error crítico de concurrencia guardando internal:", err);
    }
  }, []);

  // 👇 FIX CRÍTICO CRASH-02: Misma protección para config
  const handleUpdateConfig = useCallback(async (id, key, value) => {
    setInvitations(prev => {
      const inv = prev.find(i => i.id === id);
      if (!inv) return prev;
      return prev.map(i => i.id === id ? { ...i, config: { ...inv.config, [key]: value } } : i);
    });

    try {
      const { data: latest } = await supabase.from('invitaciones').select('config').eq('id', id).single();
      const mergedConfig = latest && latest.config ? { ...latest.config, [key]: value } : { [key]: value };
      
      const { error } = await supabase.from('invitaciones').update({ config: mergedConfig }).eq('id', id);
      if (error) console.error("Error al guardar config:", error);
    } catch (err) {
      console.error("Error crítico de concurrencia guardando config:", err);
    }
  }, []);

  const handleUpdateUser = useCallback(async (email, updates) => {
    setUsers(prevUsers => prevUsers.map(u => u.email === email ? { ...u, ...updates } : u));
    const { error } = await supabase.from('salones').update(updates).eq('email', email);
    if (error) console.error("Error al guardar ajustes del salón:", error);
  }, []);

  const handleDeleteInv = useCallback(async (id) => {
    setInvitations(prev => prev.filter(i => i.id !== id));
    await supabase.from('invitaciones').delete().eq('id', id);
  }, []);

  const handleUpdateAlert = useCallback(async (mensaje, activo) => {
    const isActivo = toBool(activo);
    const dataToSave = { mensaje: mensaje || "", activo: isActivo };
    
    setGlobalAlert(dataToSave);
    const { error } = await supabase.from('alertas').update(dataToSave).eq('id', 1);
    if (error) alert("Hubo un error al guardar la notificación.");
  }, []);

  const handleCreateSalon = useCallback(async (salonData) => {
    const { data, error } = await supabase.from('salones').insert([salonData]).select();
    if (!error && data) setUsers(p => [...p, data[0]]);
  }, []);

  const handleDeleteSalon = useCallback(async (email) => {
    setUsers(p => p.filter(u => u.email !== email));
    await supabase.from('salones').delete().eq('email', email);
  }, []);

  const handleConfirmRSVP = useCallback(async (invId, guestData, realId = null) => {
    await supabase.from('invitados').insert([{
       evento_id: realId || invId,
       nombre_completo: `${guestData.name} ${guestData.lastname}`,
       max_acompanantes: (guestData.guests || 1) - 1,
       asistencia_confirmada: true, 
       status: 'Pendiente'
    }]);
  }, []);

  const handleCreateInv = useCallback(async (sE, sN) => { 
    const sInfo = users.find(u => u.email === sE);
    if (sInfo?.is_demo && (sInfo?.invites_created || 0) >= 3) return null;
    
    const nId = "evt-" + Date.now().toString(36);
    const nI = { id: nId, salon_id: sE, title: sN || "Nuevo Evento", config: { ...DEF_CONFIG }, internal_data: {} };
    
    const { error } = await supabase.from('invitaciones').insert([nI]);
    if (error) { 
      console.error(error); 
      return null; 
    }
    
    setInvitations(p => [...p, { ...nI, salonId: sE }]); 
    return nId;
  }, [users]);
  
  const handleSaveInv = useCallback(async (uI) => { 
    await supabase.from('invitaciones').update({ title: uI.title, config: uI.config, internal_data: uI.internal_data }).eq('id', uI.id); 
    setInvitations(p => p.map(i => i.id === uI.id ? uI : i)); 
  }, []);

  if (loading) return <LoadingFallback />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={handleLogin} users={users} />} />
        
        <Route path="/dashboard" element={
          user ? <DashboardScreen 
            user={user} 
            users={users} 
            invitations={invitations} 
            globalAlert={globalAlert} 
            onCreateInv={handleCreateInv} 
            onUpdateInternal={handleUpdateInternal} 
            onUpdateConfig={handleUpdateConfig} 
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onDeleteInv={handleDeleteInv}
            onUpdateAlert={handleUpdateAlert}
            onCreateSalon={handleCreateSalon}
            onDeleteSalon={handleDeleteSalon}
          /> : <Navigate to="/" />
        } />
        
        {/* CORRECCIÓN BUG-09: Pasamos onUpdateInternal y onUpdateConfig al Editor */}
        <Route path="/editor/:id" element={user ? <EditorScreen invitations={invitations} onSave={handleSaveInv} onUpdateInternal={handleUpdateInternal} onUpdateConfig={handleUpdateConfig} /> : <Navigate to="/" />} />
        <Route path="/manage/:id" element={user ? <ManageScreen invitations={invitations} onUpdateInternal={handleUpdateInternal} onUpdateConfig={handleUpdateConfig} /> : <Navigate to="/" />} />
        
        <Route path="/puerta/:id" element={user ? <PuertaScreen /> : <Navigate to="/" />} />
        
        <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} onConfirmRSVP={handleConfirmRSVP} onUpdateInternal={handleUpdateInternal} />} />
        <Route path="/lista/:id" element={<GuestListClientScreen />} />
        <Route path="/invite/:id" element={<LiveInviteScreen />} />
      </Routes>
    </Suspense>
  );
}
