import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Importamos las pantallas desde los archivos separados
import { LoginScreen, DashboardScreen } from "./Master";
import { EditorScreen, InvitePreview, DEF_CONFIG } from "./Editor";

/* ═══════════════════════════════════════════════════════════
   ESTILOS Y FUENTES GLOBALES (Inyectados de forma segura)
═══════════════════════════════════════════════════════════ */
const GlobalStyles = () => {
  useEffect(() => {
    if (!document.getElementById("fd-global-styles")) {
      const style = document.createElement("style");
      style.id = "fd-global-styles";
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Pacifico&family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        body { margin: 0; padding: 0; background: #f8f7ff; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .fd-sb::-webkit-scrollbar { width: 4px; height: 4px; }
        .fd-sb::-webkit-scrollbar-thumb { background: #d8d4ff; border-radius: 99px; }
        @keyframes fdPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: fdPop 0.4s cubic-bezier(0.2, 1, 0.3, 1) both; }
        .invite-phone { width: 100%; max-width: 390px; border-radius: 50px; overflow: hidden; box-shadow: 0 0 0 12px #1a1a2e, 0 0 0 14px #0d0d1a, 0 32px 64px rgba(0,0,0,.65); position: relative; height: 780px; background: #000; }
        .invite-scroll { height: 100%; overflow-y: auto; scrollbar-width: none; }
        .invite-scroll::-webkit-scrollbar { display: none; }
        .fd-input { transition: all 0.2s; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); outline: none; }
        .fd-input:focus { border-color: #7c3aed; background: rgba(255,255,255,0.08); }
        .acc-body { overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.2s; }
        .fd-toggle { position: relative; width: 44px; height: 26px; flex-shrink: 0; }
        .fd-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .fd-toggle-track { position: absolute; inset: 0; border-radius: 99px; cursor: pointer; transition: .3s; background: #e2e0ef; }
        .fd-toggle-track::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: .3s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
        .fd-toggle input:checked ~ .fd-toggle-track { background: linear-gradient(135deg,#6d28d9,#8b5cf6); }
        .fd-toggle input:checked ~ .fd-toggle-track::before { transform: translateX(18px); }
      `;
      document.head.appendChild(style);
    }
  }, []);
  return null;
};

/* ═══════════════════════════════════════════════════════════
   VISTA PÚBLICA (EL INVITADO ENTRA ACÁ Y VE SU INVITACIÓN)
═══════════════════════════════════════════════════════════ */
const PublicInviteScreen = ({ invitations }) => {
  const { invId } = useParams();
  const inv = invitations.find(i => i.id === invId);

  if (!inv) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 size={30} className="animate-spin text-white"/></div>;

  return (
    <div className="bg-black min-h-screen flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-white shadow-2xl relative overflow-x-hidden">
        <InvitePreview cfg={inv.config} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RAÍZ DE LA APLICACIÓN (CONECTA TODO EL SISTEMA)
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  
  // Base de datos en memoria local para que puedas probar todo
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
          {/* Rutas de Login */}
          <Route path="/" element={<LoginScreen onLogin={setUser} users={users} />} />
          <Route path="/master" element={<LoginScreen isMaster={true} onLogin={setUser} users={users} />} />
          
          {/* Ruta del Panel Principal (Dashboard) */}
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
          
          {/* Ruta del Editor */}
          <Route path="/editor/:id" element={<EditorScreen invitations={invitations} onSave={handleSaveInv} />} />
          
          {/* Ruta de la Invitación Pública */}
          <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} />} />
        </Routes>
      </Router>
    </>
  );
}
