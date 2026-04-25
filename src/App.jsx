import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Importamos las pantallas desde los archivos que creaste recién
import { LoginScreen, DashboardScreen } from "./Master";
import { EditorScreen, InvitePreview, DEF_CONFIG } from "./Editor";

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
        
        {/* Ruta de la Invitación Pública (La que se le manda por WhatsApp a los invitados) */}
        <Route path="/i/:salon/:invId" element={<PublicInviteScreen invitations={invitations} />} />
      </Routes>
    </Router>
  );
}
