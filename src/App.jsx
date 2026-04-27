import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LoginScreen, DashboardScreen } from "./Master";
import { EditorScreen, InvitePreview, DEF_CONFIG } from "./Editor";
import { OpeningAnimation } from "./Lotties";

const GlobalStyles = () => {
  React.useEffect(() => {
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
        .fd-input { transition: all 0.2s; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); outline: none; }
        .fd-input:focus { border-color: #7c3aed; background: rgba(255,255,255,0.08); }
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
  
  // BD Simulada: Acá se guardan los datos Master de los salones
  const [users, setUsers] = useState([
    { name:"Oswaldo Master", email:"owner@fiestadigital.com", pass:"owner123", role:"owner" },
    { 
      name: "Aventura Kids", 
      email: "admin@admin.com", 
      pass: "admin", 
      role: "salon", 
      phone: "112233", 
      address: "Av. San Martín 1234, Buenos Aires", // Dirección fijada por Master
      paymentDate: "2026-05-10", // Vencimiento del pago
      paymentAlert: false, // Switch de moroso
      createdAt: new Date().toISOString() 
    }
  ]);

  const [invitations, setInvitations] = useState([
    { id: "demo-1", salonId: "admin@admin.com", salonName: "Aventura Kids", title: "Cumple de Valentina", config: DEF_CONFIG, internalDate:"", internalGuests:"", internalNotes:"" }
  ]);

  const handleCreateSalon = (newUser) => setUsers(prev => [...prev, newUser]);
  
  const handleUpdateUser = (email, data) => setUsers(prev => prev.map(u => u.email === email ? {...u, ...data} : u));
  
  const handleDeleteSalon = (email) => {
    // Borramos el salón y de paso todas las invitaciones que le pertenecían
    setUsers(prev => prev.filter(u => u.email !== email));
    setInvitations(prev => prev.filter(inv => inv.salonId !== email));
  };

  const handleCreateInv = (salonEmail, salonName) => {
    const salonInfo = users.find(u => u.email === salonEmail);
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    
    // Inyectamos la dirección fija del salón en la configuración por defecto
    const customConfig = {
      ...DEF_CONFIG,
      locationName: salonName,
      locationAddress: salonInfo?.address || ""
    };

    setInvitations(prev => [...prev, { id: newId, salonId: salonEmail, salonName, title: "Nuevo Evento", config: customConfig, internalDate:"", internalGuests:"", internalNotes:"" }]);
    return newId;
  };
  
  const handleSaveInv = (updatedInv) => setInvitations(prev => prev.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
  const handleDeleteInv = (id) => setInvitations(prev => prev.filter(inv => inv.id !== id));
  const handleUpdateInternal = (id, field, val) => setInvitations(prev => prev.map(i => i.id === id ? {...i, [field]:val} : i));

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
