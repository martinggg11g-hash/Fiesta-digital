import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useSearchParams } from "react-router-dom";
import { Loader2, PartyPopper } from "lucide-react";

import { EditorScreen } from "./Editor";
import { InvitePreview } from "./Preview";
import { DEF_CONFIG } from "./config";
import { OpeningAnimation } from "./Lotties";
import { supabase } from "./supabase"; 
import LoginScreen from "./Login";
import DashboardScreen from "./Dashboard";
import PuertaScreen from "./Puerta";
import { ManageScreen } from "./Manage"; 

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

const GlobalStyles = () => {
  useEffect(() => {
    if (!document.getElementById("tw-cdn")) {
      const tw = document.createElement("script");
      tw.id = "tw-cdn"; tw.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tw);
    }
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
          guestData={guestData} 
          onConfirmRSVP={async (formData) => {
             if (guestData) {
                await supabase.from('invitados').update({ asistencia_confirmada: true, acompanantes_confirmados: formData.guests }).eq('id', guestData.id);
                alert("¡Asistencia confirmada! Ya le avisamos a los organizadores.");
             }
          }} 
        />
      </div>
    </div>
  );
};

const PublicInviteScreen = ({ invitations, onConfirmRSVP }) => {
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
          status={inv.internal_data?.eventStatus} 
          onConfirmRSVP={(guestData) => onConfirmRSVP(inv.id, guestData)} 
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
  
  // 👉 ESTADO PARA LA ALERTA GLOBAL
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
      const { data: salones } = await supabase.from('salones').select('*');
      const { data: invs } = await supabase.from('invitaciones').select('*');
      
      const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
      
      if (salones) setUsers(salones);
      if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {} })));
      if (alertData) setGlobalAlert(alertData);
      
      setLoading(false);
    };
    fetchData();

    // 👉 RADAR AUTOMÁTICO: Consulta la alerta a Supabase cada 5 segundos
    const radar = setInterval(async () => {
      const { data: alertData } = await supabase.from('alertas').select('*').eq('id', 1).single();
      if (alertData) {
        setGlobalAlert({ mensaje: alertData.mensaje, activo: alertData.activo });
      }
    }, 5000);

    return () => clearInterval(radar); // Limpia el radar si cerramos la app
  }, []);

  // 👉 GUARDA LA ALERTA (con aviso de error por si falla Supabase)
  const handleUpdateAlert = async (mensaje, activo) => {
    const { error } = await supabase.from('alertas').upsert({ id: 1, mensaje, activo });
    if (error) {
       alert("⚠️ ERROR EN SUPABASE:\nNo se pudo guardar la alerta. Por favor asegurate de haber corrido el código SQL para crear la tabla 'alertas'.\n\nDetalle: " + error.message);
       console.error("Error alertas:", error);
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
    const nId = "evt-" + Math.random().toString(36).substr(2,6);
    
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
    if (!error) { setInvitations(p => [...p, { ...nI, salonId: sE }]); return nId; }
  };
  
  const handleSaveInv = async (uI) => { await supabase.from('invitaciones').update({ title: uI.title, config: uI.config, internal_data: uI.internal_data }).eq('id', uI.id); setInvitations(p => p.map(i => i.id === uI.id ? uI : i)); };
  const handleDeleteInv = async (id) => { await supabase.from('invitaciones').delete().eq('id', id); setInvitations(p => p.filter(i => i.id !== id)); };
  const handleUpdateInternal = async (id, f, v) => {
    setInvitations(p => p.map(i => i.id === id ? { ...i, internal_data: { ...i.internal_data, [f]: v } } : i));
    const target = invitations.find(i => i.id === id);
    if(target) await supabase.from('invitaciones').update({ internal_data: { ...target.internal_data, [f]: v } }).eq('id', id);
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden transition-opacity duration-1000">
       <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-10 animate-pulse"></div>
       <div className="w-20 h-20 bg-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-600/50 mb-6 anim-pop">
          <PartyPopper size={40} className="text-white animate-bounce" />
       </div>
       <h1 className="font-black text-2xl tracking-widest uppercase text-white/90">DeFiesta<span className="text-violet-400">.lat</span></h1>
    </div>
  );

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={handleLogin} users={users} />} />
          <Route path="/master" element={user ? <Navigate to="/dashboard" /> : <LoginScreen isMaster={true} onLogin={handleLogin} users={users} />} />
          
          <Route path="/dashboard" element={user ? <DashboardScreen user={user} users={users} invitations={invitations} onCreateSalon={handleCreateSalon} onDeleteSalon={handleDeleteSalon} onCreateInv={handleCreateInv} onDeleteInv={handleDeleteInv} onUpdateUser={handleUpdateUser} onUpdateInternal={handleUpdateInternal} onLogout={handleLogout} globalAlert={globalAlert} onUpdateAlert={handleUpdateAlert} /> : <Navigate to="/" />} />
          
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} onConfirmRSVP={handleConfirmRSVP} />} />
          <Route path="/puerta/:id" element={<PuertaScreen invitations={invitations} onUpdateInternal={handleUpdateInternal} />} />
          <Route path="/manage/:id" element={<ManageScreen />} />
          <Route path="/invite/:id" element={<LiveInviteScreen />} />
        </Routes>
      </Router>
    </>
  );
}
