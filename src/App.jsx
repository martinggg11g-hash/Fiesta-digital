import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LoginScreen, DashboardScreen } from "./Master";
import { EditorScreen, InvitePreview, DEF_CONFIG } from "./Editor";
import { OpeningAnimation } from "./Lotties";
import { supabase } from "./supabase"; // <--- Importamos la conexión

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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
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

const PublicInviteScreen = ({ invitations }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);
  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 size={30} className="animate-spin text-white"/></div>;
  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} isPreview={false} />}
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // CARGAR DATOS DESDE SUPABASE AL INICIAR
  useEffect(() => {
    const fetchData = async () => {
      const { data: salones } = await supabase.from('salones').select('*');
      const { data: invs } = await supabase.from('invitaciones').select('*');
      if (salones) setUsers(salones);
      if (invs) setInvitations(invs.map(i => ({ ...i, salonId: i.salon_id, internal_data: i.internal_data || {} })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateSalon = async (newUser) => {
    const { error } = await supabase.from('salones').insert([newUser]);
    if (!error) setUsers(prev => [...prev, newUser]);
  };
  
  const handleUpdateUser = async (email, updateData) => {
    const { error } = await supabase.from('salones').update(updateData).eq('email', email);
    if (!error) setUsers(prev => prev.map(u => u.email === email ? {...u, ...updateData} : u));
  };
  
  const handleDeleteSalon = async (email) => {
    await supabase.from('invitaciones').delete().eq('salon_id', email);
    await supabase.from('salones').delete().eq('email', email);
    setUsers(prev => prev.filter(u => u.email !== email));
    setInvitations(prev => prev.filter(inv => inv.salonId !== email));
  };

  const handleCreateInv = async (salonEmail, salonName) => {
    const salonInfo = users.find(u => u.email === salonEmail);
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    const customConfig = { ...DEF_CONFIG, locationName: salonName, locationAddress: salonInfo?.address || "" };
    const newInv = { id: newId, salon_id: salonEmail, title: "Nuevo Evento", config: customConfig, internal_data: {} };
    
    const { error } = await supabase.from('invitaciones').insert([newInv]);
    if (!error) {
      setInvitations(prev => [...prev, { ...newInv, salonId: salonEmail }]);
      return newId;
    }
  };
  
  const handleSaveInv = async (updatedInv) => {
    const { error } = await supabase.from('invitaciones').update({ 
      title: updatedInv.title, 
      config: updatedInv.config,
      internal_data: updatedInv.internal_data 
    }).eq('id', updatedInv.id);
    if (!error) setInvitations(prev => prev.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
  };

  const handleDeleteInv = async (id) => {
    await supabase.from('invitaciones').delete().eq('id', id);
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleUpdateInternal = async (id, field, val) => {
    const inv = invitations.find(i => i.id === id);
    const updatedData = { ...inv.internal_data, [field]: val };
    const { error } = await supabase.from('invitaciones').update({ internal_data: updatedData }).eq('id', id);
    if (!error) setInvitations(prev => prev.map(i => i.id === id ? {...i, internal_data: updatedData} : i));
  };

  if (loading) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4"><Loader2 className="animate-spin" size={40}/><p className="font-bold animate-pulse">Conectando con la base de datos...</p></div>;

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen onLogin={setUser} users={users} />} />
          <Route path="/master" element={<LoginScreen isMaster={true} onLogin={setUser} users={users} />} />
          <Route path="/dashboard" element={<DashboardScreen user={user} users={users} invitations={invitations} onCreateSalon={handleCreateSalon} onDeleteSalon={handleDeleteSalon} onCreateInv={handleCreateInv} onDeleteInv={handleDeleteInv} onUpdateUser={handleUpdateUser} onUpdateInternal={handleUpdateInternal} onLogout={() => setUser(null)} />} />
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} />} />
        </Routes>
      </Router>
    </>
  );
}
