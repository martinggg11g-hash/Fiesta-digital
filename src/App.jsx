import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useParams, Navigate, useSearchParams } from "react-router-dom";
import { Loader2, PartyPopper } from "lucide-react";

import { InvitePreview } from "./Preview";
import { DEF_CONFIG } from "./config";
import { OpeningAnimation } from "./Lotties";
import { supabase } from "./supabase"; 

// 👉 ACÁ ESTÁ LA MAGIA DEL LAZY LOADING: 
// Esto divide tu app en "pedacitos". Si el usuario no entra a esta ruta, este código NO se descarga.
const LoginScreen = React.lazy(() => import("./Login"));
const DashboardScreen = React.lazy(() => import("./Dashboard"));
const PuertaScreen = React.lazy(() => import("./Puerta"));
// Nota: Editor y Manage tienen "exportaciones nombradas", se importan un poquito distinto con lazy
const EditorScreen = React.lazy(() => import("./Editor").then(module => ({ default: module.EditorScreen })));
const ManageScreen = React.lazy(() => import("./Manage").then(module => ({ default: module.ManageScreen })));

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

const GlobalStyles = () => {
  useEffect(() => {
    if (!document.getElementById("fd-global")) {
      const s = document.createElement("style");
      s.id = "fd-global";
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Pacifico&family=Caveat:wght@400;700&family=Syne:wght@400;700;800&family=Bebas+Neue&display=swap');
        body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
        .fd-sb::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
        .fd-sb::-webkit-scrollbar-thumb { background: #b4aee8 !important; border-radius: 10px !important; }
        .fd-sb::-webkit-scrollbar-thumb:hover { background: #8b5cf6 !important; }
        .fd-sb::-webkit-scrollbar-track { background: #f1f0f5 !important; border-radius: 10px !important; }
        @keyframes fdPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: fdPop 0.4s cubic-bezier(0.2, 1, 0.3, 1) both; }
        .invite-phone { width: 100%; max-width: 390px; border-radius: 50px; overflow: hidden; box-shadow: 0 0 0 12px #1a1a2e, 0 0 0 14px #0d0d1a, 0 32px 64px rgba(0,0,0,.65); position: relative; height: 780px; background: #000; }
      `;
      document.head.appendChild(s);
    }
  }, []);
  return null;
};

// 👉 PANTALLA DE CARGA GLOBAL (Se usa mientras React descarga los archivos perezosos)
const LoadingFallback = () => (
  <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden transition-opacity duration-1000 z-[9999]">
     <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-10 animate-pulse"></div>
     <div className="w-20 h-20 bg-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-600/50 mb-6 anim-pop">
        <PartyPopper size={40} className="text-white animate-bounce" />
     </div>
     <h1 className="font-black text-2xl tracking-widest uppercase text-white/90">DeFiesta<span className="text-violet-400">.lat</span></h1>
  </div>
);

// 👉 PANTALLA INVITADO REAL
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
      const { data: eventData } = await supabase.from('eventos').select('*').eq('slug', eventSlug).single();
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

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
       <Loader2 size={30} className="animate-spin text-violet-500 mb-4"/>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Preparando Pase VIP...</p>
    </div>
  );

  if (!inv) return <div className="h-screen bg-black text-white flex items-center justify-center font-black text-xl tracking-widest uppercase">Evento no encontrado 👻</div>;

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
                alert("¡Asistencia confirmada! Ya le avisamos a los organizadores.");
             }
          }} 
          onUploadLivePhoto={async (url) => {
             const currentPhotos = inv.internal_data?.live_photos || [];
             const updatedPhotos = [url, ...currentPhotos];
             const updatedInternal = { ...inv.internal_data, live_photos: updatedPhotos };
             // 👉 ARREGLO DE BUG: Ahora guardamos la foto en la tabla 'eventos' correcta
             await supabase.from('eventos').update({ internal_data: updatedInternal }).eq('id', inv.id);
             setInv({ ...inv, internal_data: updatedInternal });
          }}
        />
      </div>
    </div>
  );
};

// 👉 PANTALLA INVITADO PÚBLICO
const PublicInviteScreen = ({ invitations, onConfirmRSVP, onUpdateInternal }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);
  
  useEffect(() => {
    if (inv) { document.title = inv.config?.honoreeName ? `${inv.config.honoreeName} | Invitación` : "Invitación"; }
  }, [inv]);

  if (!inv) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
       <Loader2 size={30} className="animate-spin text-white opacity-50"/>
    </div>
  );
  
  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} isPreview={false} />}
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview 
          cfg={inv.config} 
          internalData={inv.internal_data}
          status={inv.internal_data?.eventStatus} 
          onConfirmRSVP={(guestData) => onConfirmRSVP(inv.id, guestData)} 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salones } = await supabase.from('salones').select('*');
        const { data: invs } = await supabase.from('invitaciones').select('*');
        const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
        
        if (salones) setUsers(salones);
        if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {} })));
        if (alertData) setGlobalAlert(alertData);
      } catch (error) {
        console.error("Error al cargar la base de datos:", error);
      } finally {
        setLoading(false); // 👉 ARREGLO DE UX: Siempre frenamos el loading, aunque falle la DB
      }
    };
    fetchData();

    // 👉 ARREGLO PERFORMANCE: Polling optimizado (solo pide lo necesario)
    const radar = setInterval(async () => {
      // 1. Siempre buscamos las alertas
      const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
      if (alertData) {
        setGlobalAlert({ mensaje: alertData.mensaje, activo: alertData.activo });
      }
      
      // 2. Si el usuario está logueado, solo buscamos actualizaciones de chat
      if (user) {
        if (user.role === 'owner') {
          // El owner necesita ver todos los salones por si alguien escribe
          const { data: salones } = await supabase.from('salones').select('*');
          if (salones) setUsers(salones);
        } else {
          // El salón solo necesita descargar SU PROPIO registro (ahorramos 99% de recursos)
          const { data: miSalon } = await supabase.from('salones').select('*').eq('email', user.email);
          if (miSalon && miSalon.length > 0) {
            setUsers(prev => prev.map(u => u.email === user.email ? miSalon[0] : u));
          }
        }
      }
    }, 5000);

    return () => clearInterval(radar);
  }, [user]);

  const handleUpdateAlert = async (mensaje, activo) => {
    const { error } = await supabase.from('alertas').upsert({ id: 1, mensaje, activo });
    if (error) {
       alert("⚠️ ERROR EN SUPABASE:\nNo se pudo guardar la alerta.\nDetalle: " + error.message);
    } else {
       setGlobalAlert({ mensaje, activo });
    }
  };

  const handleUpdateUser = async (email, updateData) => {
    const { error } = await supabase.from('salones').update(updateData).eq('email', email);
    if (error) return alert("Error: " + error.message);

    setUsers(prev => prev.map(u => u.email === email ? {...u, ...updateData} : u));
    if (user && user.email === email) {
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem("fiesta_user", JSON.stringify(updatedUser));
    }
  };

  const handleConfirmRSVP = async (invId, guestData) => {
    const inv = invitations.find(i => i.id === invId);
    if (!inv) return;
    const currentGuests = inv.internal_data?.guests || [];
    const updatedGuests = [...currentGuests, guestData];
    const updatedInternal = { ...inv.internal_data, guests: updatedGuests };

    await supabase.from('invitaciones').update({ internal_data: updatedInternal }).eq('id', invId);
    setInvitations(prev => prev.map(i => i.id === invId ? { ...i, internal_data: updatedInternal } : i));
  };

  const handleCreateSalon = async (nU) => { const { error } = await supabase.from('salones').insert([nU]); if (!error) setUsers(p => [...p, nU]); };
  const handleDeleteSalon = async (em) => { await supabase.from('invitaciones').delete().eq('salon_id', em); await supabase.from('salones').delete().eq('email', em); setUsers(p => p.filter(u => u.email !== em)); setInvitations(p => p.filter(i => i.salonId !== em)); };
  
  const handleCreateInv = async (sE, sN) => { 
    const sInfo = users.find(u => u.email === sE);
    
    if (sInfo?.is_demo && (sInfo?.invites_created || 0) >= 3) {
      alert("⚠️ LÍMITE DEMO ALCANZADO\nTu cuenta Demo solo permite crear 3 invitaciones en total. Contactá a soporte para actualizar tu plan.");
      return null;
    }

    // 👉 ARREGLO DE IDs SEGÚN CLAUDE (Usamos un random más seguro)
    const nId = "evt-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    
    const cfg = { 
      ...DEF_CONFIG, 
      locationName: sN, 
      locationAddress: sInfo?.address || "",
      venueLogoUrl: sInfo?.logo || "",
      showVenueLogo: !!sInfo?.logo,
      instagramUrl: sInfo?.instagram || "",
      showInstagram: !!sInfo?.instagram,
      facebookUrl: sInfo?.facebook || "",
      showFacebook: !!sInfo?.facebook,
      tiktokUrl: sInfo?.tiktok || "",
      showTiktok: !!sInfo?.tiktok
    };
    
    const nI = { id: nId, salon_id: sE, title: "Nuevo Evento", config: cfg, internal_data: {} };
    const { error } = await supabase.from('invitaciones').insert([nI]);
    if (!error) { 
      setInvitations(p => [...p, { ...nI, salonId: sE }]); 
      
      const newCount = (sInfo?.invites_created || 0) + 1;
      await supabase.from('salones').update({ invites_created: newCount }).eq('email', sE);
      setUsers(prev => prev.map(u => u.email === sE ? { ...u, invites_created: newCount } : u));

      return nId; 
    }
  };
  
  const handleSaveInv = async (uI) => { await supabase.from('invitaciones').update({ title: uI.title, config: uI.config, internal_data: uI.internal_data }).eq('id', uI.id); setInvitations(p => p.map(i => i.id === uI.id ? uI : i)); };
  const handleDeleteInv = async (id) => { await supabase.from('invitaciones').delete().eq('id', id); setInvitations(p => p.filter(i => i.id !== id)); };
  
  const handleUpdateInternal = async (id, f, v) => {
    setInvitations(prevInvs => {
       const updatedInvs = prevInvs.map(i => i.id === id ? { ...i, internal_data: { ...i.internal_data, [f]: v } } : i);
       const target = updatedInvs.find(i => i.id === id);
       if(target) {
          supabase.from('invitaciones').update({ internal_data: target.internal_data }).eq('id', id).then(({error}) => {
             if(error) console.error("Error actualizando datos internos:", error);
          });
       }
       return updatedInvs;
    });
  };

  if (loading) return <LoadingFallback />;

  return (
    <>
      <GlobalStyles />
      {/* 👉 ACÁ ENVOLVEMOS LAS RUTAS CON SUSPENSE */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={handleLogin} users={users} />} />
          <Route path="/master" element={user ? <Navigate to="/dashboard" /> : <LoginScreen isMaster={true} onLogin={handleLogin} users={users} />} />
          <Route path="/dashboard" element={user ? <DashboardScreen user={user} users={users} invitations={invitations} onCreateSalon={handleCreateSalon} onDeleteSalon={handleDeleteSalon} onCreateInv={handleCreateInv} onDeleteInv={handleDeleteInv} onUpdateUser={handleUpdateUser} onUpdateInternal={handleUpdateInternal} onLogout={handleLogout} globalAlert={globalAlert} onUpdateAlert={handleUpdateAlert} /> : <Navigate to="/" />} />
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} onConfirmRSVP={handleConfirmRSVP} onUpdateInternal={handleUpdateInternal} />} />
          <Route path="/puerta/:id" element={<PuertaScreen invitations={invitations} onUpdateInternal={handleUpdateInternal} />} />
          <Route path="/manage/:id" element={<ManageScreen />} />
          <Route path="/invite/:id" element={<LiveInviteScreen />} />
        </Routes>
      </Suspense>
    </>
  );
}
