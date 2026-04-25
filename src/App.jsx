import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Importamos todo de los archivos que separamos
import { LoginScreen, DashboardScreen } from "./Master";
import { EditorScreen, InvitePreview, OpeningAnimation, DEF_CONFIG } from "./Editor";

/* ============================================================================
   ESTILOS GLOBALES E INYECCIÓN DE TAILWIND
============================================================================ */
const GlobalStyles = () => {
  React.useEffect(() => {
    if (!document.getElementById("tw-cdn")) {
      const tw = document.createElement("script");
      tw.id = "tw-cdn";
      tw.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tw);
    }
    if (!document.getElementById("fd-global")) {
      const s = document.createElement("style");
      s.id = "fd-global";
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .fd-sb::-webkit-scrollbar { width: 4px; height: 4px; }
        .fd-sb::-webkit-scrollbar-thumb { background: #d8d4ff; border-radius: 99px; }
        @keyframes fdPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: fdPop 0.4s cubic-bezier(0.2, 1, 0.3, 1) both; }
        .invite-phone { width: 100%; max-width: 390px; border-radius: 50px; overflow: hidden; box-shadow: 0 0 0 12px #1a1a2e, 0 0 0 14px #0d0d1a, 0 32px 64px rgba(0,0,0,.65); position: relative; height: 780px; background: #000; }
        .fd-input { transition: all 0.2s; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); outline: none; }
        .fd-input:focus { border-color: #7c3aed; background: rgba(255,255,255,0.08); }
        .acc-body { overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.2s; }
        .fd-toggle { position: relative; width: 44px; height: 26px; flex-shrink: 0; }
        .fd-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .fd-toggle-track { position: absolute; inset: 0; border-radius: 99px; cursor: pointer; transition: .3s; background: #e2e0ef; }
        .fd-toggle-track::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: .3s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
        .fd-toggle input:checked ~ .fd-toggle-track { background: linear-gradient(135deg,#6d28d9,#8b5cf6); }
        .fd-toggle input:checked ~ .fd-toggle-track::before { transform: translateX(18px); }

        /* Animaciones Personalizadas para las Entradas */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes openEnvelope { 0% { transform: rotateX(0deg); z-index: 20; } 100% { transform: rotateX(180deg); z-index: 0; } }
        .animate-envelope-open { transform-origin: top; animation: openEnvelope 1s forwards; }
        @keyframes openChest { 0% { transform: rotateX(0deg); } 100% { transform: rotateX(-90deg); opacity: 0; } }
        .animate-chest-open { transform-origin: top; animation: openChest 1s forwards; }
        @keyframes shootBall { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, -150px) scale(0.5); opacity: 0; } }
        .animate-shoot { animation: shootBall 0.8s forwards ease-in; }
        @keyframes spinNote { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(720deg) scale(0); opacity: 0; } }
        .animate-spin-away { animation: spinNote 1.5s forwards ease-in-out; }
        @keyframes explodeGift { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(0); opacity: 0; } }
        .animate-explode { animation: explodeGift 0.8s forwards; }
      `;
      document.head.appendChild(s);
    }
  }, []);
  return null;
};

/* ============================================================================
   VISTA PÚBLICA DE LA INVITACIÓN
============================================================================ */
const PublicInviteScreen = ({ invitations }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);
  const [opened, setOpened] = useState(false);

  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 size={30} className="animate-spin text-white"/></div>;

  return (
    <div className="bg-black min-h-screen flex justify-center w-full relative overflow-hidden">
      {!opened && <OpeningAnimation cfg={inv.config} onOpen={() => setOpened(true)} />}
      
      <div className={`w-full max-w-[480px] bg-white shadow-2xl relative overflow-x-hidden transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};

/* ============================================================================
   APP PRINCIPAL Y RUTAS
============================================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  
  const [users, setUsers] = useState([
    { name:"Oswaldo Master", email:"owner@fiestadigital.com", pass:"owner123", role:"owner" },
    { name:"Aventura Kids", email:"admin@admin.com", pass:"admin", role:"salon", phone:"112233", paymentMethod:"Efectivo", paymentAlert: false, createdAt: new Date().toLocaleDateString() }
  ]);
  
  const [invitations, setInvitations] = useState([
    { id: "demo-1", salonId: "admin@admin.com", salonName: "Aventura Kids", title: "Cumple de Valentina", config: DEF_CONFIG, internalDate:"", internalGuests:"", internalNotes:"" }
  ]);

  const handleCreateSalon = (newUser) => setUsers(prev => [...prev, newUser]);
  const handleUpdateUser = (email, data) => setUsers(prev => prev.map(u => u.email === email ? {...u, ...data} : u));
  const handleCreateInv = (salonId, salonName) => {
    const newId = "evt-" + Math.random().toString(36).substr(2,6);
    setInvitations(prev => [...prev, { id: newId, salonId, salonName, title: "Nuevo Evento", config: DEF_CONFIG, internalDate:"", internalGuests:"", internalNotes:"" }]);
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
          <Route path="/dashboard" element={
            <DashboardScreen 
              user={user} 
              users={users} 
              invitations={invitations} 
              onCreateSalon={handleCreateSalon} 
              onCreateInv={handleCreateInv} 
              onDeleteInv={handleDeleteInv} 
              onUpdateUser={handleUpdateUser} 
              onUpdateInternal={handleUpdateInternal} 
              onLogout={() => setUser(null)} 
            />
          } />
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} />} />
        </Routes>
      </Router>
    </>
  );
}
