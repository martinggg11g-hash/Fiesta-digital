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
// 📣 PANTALLA INVITADO PÚBLICO (Sincronizada con estado global)
// ===============================================
const PublicInviteScreen = ({ invitations, onConfirmRSVP, onUpdateInternal }) => {
  const { invId } = useParams();
  
  // 👉 BUSCAMOS EN EL ESTADO GLOBAL Y NO HACEMOS FETCH MANUAL
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);
  
  useEffect(() => {
    if (inv) {
        document.title = inv.config?.honoreeName ? `${inv.config.honoreeName} | Invitación` : "Invitación";
    }
  }, [inv]);

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
             const currentPhotos = inv.internal_data?.live_photos || [];
             const updatedPhotos = [url, ...currentPhotos];
             await onUpdateInternal(inv.id, 'live_photos', updatedPhotos);
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
      if (local) return JSON.parse(local);
      if (session) return JSON.parse(session);
      return null;
    } catch (e) { return null; }
  });

  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [globalAlert, setGlobalAlert] = useState({ mensaje: "", activo: false });
  const [loading, setLoading] = useState(true);

  const handleLogin = (userData, rememberMe) => {
    setUser(userData);
    if (rememberMe) localStorage.setItem("fiesta_user", JSON.stringify(userData));
    else sessionStorage.setItem("fiesta_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fiesta_user");
    sessionStorage.removeItem("fiesta_user");
  };

  // FETCH PRINCIPAL: Obtiene todos los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salones } = await supabase.from('salones').select('*');
        const { data: invs } = await supabase.from('invitaciones').select('*');
        const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
        
        if (salones) setUsers(salones);
        if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {}, config: i.config || {} })));
        if (alertData) setGlobalAlert(alertData);
      } catch (error) {
        console.error("Error al cargar la base de datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Radar de actualización para usuarios logueados
    const radar = setInterval(async () => {
      const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
      if (alertData) setGlobalAlert({ mensaje: alertData.mensaje, activo: alertData.activo });
      
      if (user) {
        if (user.role === 'owner') {
          const { data: salones } = await supabase.from('salones').select('*');
          if (salones) setUsers(salones);
        } else {
          const { data: miSalon } = await supabase.from('salones').select('*').eq('email', user.email);
          if (miSalon && miSalon.length > 0) setUsers(prev => prev.map(u => u.email === user.email ? miSalon[0] : u));
        }
      }
    }, 5000);

    return () => clearInterval(radar);
  }, [user]);

  // FUNCIONES DE ACTUALIZACIÓN
  const handleUpdateInternal = async (id, f, v) => {
    setInvitations(prevInvs => {
       const updatedInvs = prevInvs.map(i => i.id === id ? { ...i, internal_data: { ...i.internal_data, [f]: v } } : i);
       const target = updatedInvs.find(i => i.id === id);
       if(target) {
          supabase.from('invitaciones').update({ internal_data: target.internal_data }).eq('id', id);
       }
       return updatedInvs;
    });
  };

  const handleUpdateConfig = async (id, key, value) => {
    setInvitations(prevInvs => {
       const updatedInvs = prevInvs.map(i => i.id === id ? { ...i, config: { ...i.config, [key]: value } } : i);
       const target = updatedInvs.find(i => i.id === id);
       if(target) {
          supabase.from('invitaciones').update({ config: target.config }).eq('id', id);
       }
       return updatedInvs;
    });
  };

  const handleConfirmRSVP = async (invId, guestData, realEventIdFromChild = null) => {
    const realEventId = realEventIdFromChild || invId;
    const fullName = `${guestData.name} ${guestData.lastname}`.trim();
    const totalPax = guestData.guests || 1;
    const extraPax = totalPax - 1 >= 0 ? totalPax - 1 : 0;

    const { error } = await supabase.from('invitados').insert([{
       evento_id: realEventId,
       nombre_completo: fullName,
       max_acompanantes: extraPax,
       asistencia_confirmada: true, 
       acompanantes_confirmados: extraPax,
       status: 'Pendiente',
       mesa: 'Sin Asignar'
    }]);

    if (error) alert("Error al confirmar: " + error.message);
    else alert("¡Asistencia confirmada!");
  };

  const handleCreateInv = async (sE, sN) => { 
    const sInfo = users.find(u => u.email === sE);
    if (sInfo?.is_demo && (sInfo?.invites_created || 0) >= 3) {
      alert("⚠️ LÍMITE DEMO ALCANZADO. Contactá a soporte.");
      return null;
    }
    const nId = "evt-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const nI = { id: nId, salon_id: sE, title: "Nuevo Evento", config: { ...DEF_CONFIG }, internal_data: {} };
    const { error } = await supabase.from('invitaciones').insert([nI]);
    if (!error) { 
      setInvitations(p => [...p, { ...nI, salonId: sE }]); 
      return nId; 
    }
  };

  const handleSaveInv = async (uI) => { 
    await supabase.from('invitaciones').update({ title: uI.title, config: uI.config, internal_data: uI.internal_data }).eq('id', uI.id); 
    setInvitations(p => p.map(i => i.id === uI.id ? uI : i)); 
  };
  
  const handleDeleteInv = async (id) => { 
    await supabase.from('invitaciones').delete().eq('id', id); 
    setInvitations(p => p.filter(i => i.id !== id)); 
  };

  if (loading) return <LoadingFallback />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={handleLogin} users={users} />} />
        <Route path="/dashboard" element={user ? <DashboardScreen user={user} users={users} invitations={invitations} onCreateInv={handleCreateInv} onDeleteInv={handleDeleteInv} onUpdateInternal={handleUpdateInternal} onUpdateConfig={handleUpdateConfig} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
        <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} onConfirmRSVP={handleConfirmRSVP} onUpdateInternal={handleUpdateInternal} />} />
        {/* ... el resto de tus rutas */}
      </Routes>
    </Suspense>
  );
}
