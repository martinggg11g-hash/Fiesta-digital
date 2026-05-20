import React, { useState, useEffect, Suspense } from "react";
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

const LoadingFallback = () => (
  <div className="h-screen w-full bg-black absolute inset-0 z-[9999] flex items-center justify-center">
    <Loader2 className="animate-spin text-white" size={40} />
  </div>
);

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
      const { data: eventData } = await supabase.from('invitaciones').select('*').eq('id', eventSlug).single();
      if (eventData) {
        setInv(eventData);
        document.title = eventData.config?.honoreeName ? `${eventData.config.honoreeName} | Invitación` : "Invitación";
      }
      if (guestId) {
        const { data: gData } = await supabase.from('invitados').select('*').eq('id', guestId).single();
        if (gData) setGuestData(gData);
      }
      setLoading(false);
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
                await supabase.from('invitados').update({ asistencia_confirmada: true, acompanantes_confirmados: formData.guests }).eq('id', guestData.id);
                alert("¡Asistencia confirmada!");
             }
          }} 
          onUploadLivePhoto={async (url) => {
             const updatedPhotos = [url, ...(inv.internal_data?.live_photos || [])];
             const updatedInternal = { ...inv.internal_data, live_photos: updatedPhotos };
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
             await onUpdateInternal(inv.id, 'live_photos', [url, ...(inv.internal_data?.live_photos || [])]);
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

  const handleLogin = (u, r) => {
    setUser(u);
    if (r) localStorage.setItem("fiesta_user", JSON.stringify(u));
    else sessionStorage.setItem("fiesta_user", JSON.stringify(u));
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem("fiesta_user"); sessionStorage.removeItem("fiesta_user"); };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salones } = await supabase.from('salones').select('*');
        const { data: invs } = await supabase.from('invitaciones').select('*');
        const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
        if (salones) setUsers(salones);
        if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {}, config: i.config || {} })));
        if (alertData) setGlobalAlert(alertData);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();

    // 👉 CANAL REALTIME A PRUEBA DE BALAS
    const channel = supabase
      .channel('fiesta-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitaciones' }, (payload) => {
        console.log("🔥 SUPABASE AVISÓ DE UN CAMBIO:", payload);
        if (payload.new && payload.new.id) {
          setInvitations(prevInvs => prevInvs.map(inv => 
            inv.id === payload.new.id ? { 
              ...inv, // Conservamos local
              ...payload.new, // Sobrescribimos con BD
              salonId: payload.new.salon_id, 
              internal_data: payload.new.internal_data || {}, 
              config: payload.new.config || {} 
            } : inv
          ));
        }
      })
      .subscribe((status) => {
        console.log("📡 ESTADO REALTIME:", status);
      });

    const radar = setInterval(async () => {
      const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
      if (alertData) setGlobalAlert({ mensaje: alertData.mensaje, activo: alertData.activo });
      // Removemos el recargo de salones tan frecuente para no saturar
    }, 30000);

    return () => { 
      clearInterval(radar); 
      supabase.removeChannel(channel); 
    };
  }, [user]);

  // 👉 CORRECCIÓN DEL ANTI-PATRÓN DE ESTADO (Separamos UI de Base de Datos)
  const handleUpdateInternal = async (id, f, v) => {
    let targetData = null;
    
    // 1. Actualizamos la UI al instante (Memoria local)
    setInvitations(prevInvs => prevInvs.map(i => {
      if (i.id === id) {
        targetData = { ...i.internal_data, [f]: v };
        return { ...i, internal_data: targetData };
      }
      return i;
    }));

    // 2. Guardamos en Base de Datos por fuera
    if (targetData) {
      const { error } = await supabase.from('invitaciones').update({ internal_data: targetData }).eq('id', id);
      if (error) console.error("Error al guardar internal_data:", error);
    }
  };

  const handleUpdateConfig = async (id, key, value) => {
    let targetConfig = null;

    // 1. Actualizamos la UI al instante
    setInvitations(prevInvs => prevInvs.map(i => {
      if (i.id === id) {
        targetConfig = { ...i.config, [key]: value };
        return { ...i, config: targetConfig };
      }
      return i;
    }));

    // 2. Guardamos en BD por fuera
    if (targetConfig) {
      const { error } = await supabase.from('invitaciones').update({ config: targetConfig }).eq('id', id);
      if (error) console.error("Error al guardar config:", error);
    }
  };

  // 👉 NUEVA FUNCIÓN: Actualizar datos del salón (Redes, Logo, Limite Mesas, etc)
  const handleUpdateUser = async (email, updates) => {
    setUsers(prevUsers => prevUsers.map(u => u.email === email ? { ...u, ...updates } : u));
    const { error } = await supabase.from('salones').update(updates).eq('email', email);
    if (error) console.error("Error al guardar ajustes del salón:", error);
  };

  // 👉 NUEVA FUNCIÓN: Borrar una invitación
  const handleDeleteInv = async (id) => {
    setInvitations(prev => prev.filter(i => i.id !== id));
    await supabase.from('invitaciones').delete().eq('id', id);
  };

  const handleConfirmRSVP = async (invId, guestData, realId = null) => {
    const { error } = await supabase.from('invitados').insert([{
       evento_id: realId || invId,
       nombre_completo: `${guestData.name} ${guestData.lastname}`,
       max_acompanantes: (guestData.guests || 1) - 1,
       asistencia_confirmada: true, 
       status: 'Pendiente'
    }]);
    if (error) alert("Error: " + error.message);
    else alert("¡Asistencia confirmada!");
  };

  const handleCreateInv = async (sE, sN) => { 
    const sInfo = users.find(u => u.email === sE);
    if (sInfo?.is_demo && (sInfo?.invites_created || 0) >= 3) return null;
    const nId = "evt-" + Date.now().toString(36);
    const nI = { id: nId, salon_id: sE, title: "Nuevo Evento", config: { ...DEF_CONFIG }, internal_data: {} };
    const { error } = await supabase.from('invitaciones').insert([nI]);
    if (!error) { setInvitations(p => [...p, { ...nI, salonId: sE }]); return nId; }
  };
  
  const handleSaveInv = async (uI) => { 
    await supabase.from('invitaciones').update({ title: uI.title, config: uI.config, internal_data: uI.internal_data }).eq('id', uI.id); 
    setInvitations(p => p.map(i => i.id === uI.id ? uI : i)); 
  };

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
            onCreateInv={handleCreateInv} 
            onUpdateInternal={handleUpdateInternal} 
            onUpdateConfig={handleUpdateConfig} 
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onDeleteInv={handleDeleteInv}
          /> : <Navigate to="/" />
        } />
        
        <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} onUpdateInternal={handleUpdateInternal} onUpdateConfig={handleUpdateConfig} />} />
        
        <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} onConfirmRSVP={handleConfirmRSVP} onUpdateInternal={handleUpdateInternal} />} />
        <Route path="/puerta/:id" element={<PuertaScreen invitations={invitations} onUpdateInternal={handleUpdateInternal} />} />
        
        <Route path="/manage/:id" element={<ManageScreen invitations={invitations} onUpdateInternal={handleUpdateInternal} onUpdateConfig={handleUpdateConfig} />} />
        
        <Route path="/invite/:id" element={<LiveInviteScreen />} />
      </Routes>
    </Suspense>
  );
}
