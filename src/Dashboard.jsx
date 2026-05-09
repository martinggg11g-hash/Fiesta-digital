import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Plus, Trash2, Copy, CheckCircle2, Building, Edit2, 
  Search, Sun, Moon, Settings, CreditCard, Send, Eye, Filter, ScanBarcode, Smartphone, AlertTriangle
} from "lucide-react";

import { Inp, FileUpload, Toast, QRScannerModal } from "./DashboardUI";
import { MasterPanel } from "./MasterPanel";
import { CrmModal } from "./CrmModal";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

export default function DashboardScreen({ user, onLogout, users, onUpdateUser, onCreateSalon, onDeleteSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal }) {
  const navigate = useNavigate();
  
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [activeCrmId, setActiveCrmId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [scanningEvent, setScanningEvent] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const salonInfo = users.find(u => u.email === user?.email);
  const [newPassword, setNewPassword] = useState("");
  const [newLogo, setNewLogo] = useState(salonInfo?.logo || "");
  const [newPhone, setNewPhone] = useState(salonInfo?.phone || "");
  const [newInstagram, setNewInstagram] = useState(salonInfo?.instagram || "");
  const [newFacebook, setNewFacebook] = useState(salonInfo?.facebook || "");
  const [newTiktok, setNewTiktok] = useState(salonInfo?.tiktok || "");

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => { localStorage.setItem("fiesta_darkmode", JSON.stringify(isDark)); }, [isDark]);

  if (!user) return null;

  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => { setCopiedStates(prev => ({ ...prev, [id]: false })); }, 2000);
  };

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);

  let filteredInvs = myInvs.filter(inv => {
    const term = searchTerm.trim().toLowerCase();
    const data = inv.internal_data || {};
    const honoree = inv.config?.honoreeName || "";
    const matchText = !term || inv.title?.toLowerCase().includes(term) || (data.clientName || "").toLowerCase().includes(term) || honoree.toLowerCase().includes(term);
    
    if (!matchText) return false;
    if (filterType === 'upcoming') return !data.internalDate || new Date(data.internalDate) >= new Date().setHours(0,0,0,0);
    if (filterType === 'past') return data.internalDate && new Date(data.internalDate) < new Date().setHours(0,0,0,0);
    return true;
  });

  const processQRScan = (qrString) => {
    const guestDb = scanningEvent.internal_data?.guests?.find(g => g.id === qrString) || 
                    scanningEvent.internal_data?.guests?.find(g => qrString.includes(g.id));

    if (!guestDb) {
      setValidationResult({ status: 'error', title: 'Pase Inválido', desc: 'Este QR no pertenece a este evento o es falso.' });
    } else if (guestDb.status === 'Ingresó') {
      setValidationResult({ status: 'warning', title: 'Pase Usado', desc: `${guestDb.name} ya ingresó.`, data: guestDb });
    } else {
      setValidationResult({ status: 'success', title: 'Acceso Permitido', desc: 'Pase verificado correctamente.', data: guestDb });
    }
  };

  const confirmAccess = () => {
    const updated = scanningEvent.internal_data.guests.map(g => g.id === validationResult.data.id ? { ...g, status: 'Ingresó' } : g);
    onUpdateInternal(scanningEvent.id, 'guests', updated);
    setValidationResult(null);
    notify("Ingreso registrado");
  };

  if (isOwner) {
    return <MasterPanel mySalons={users.filter(u => u.role === "salon")} onLogout={onLogout} onCreateSalon={onCreateSalon} onUpdateUser={onUpdateUser} onDeleteSalon={onDeleteSalon} />;
  }

  const themeBg = isDark ? "bg-slate-900" : "bg-[#f1f3f9]";
  const themeNav = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const themeText = isDark ? "text-white" : "text-slate-800";
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/60";

  return (
    <div className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}>
      <style>{`@media print { .no-print { display: none !important; } .only-print { display: block !important; } }`}</style>

      <nav className={`h-20 border-b px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300 no-print ${themeNav}`}>
        <div className="flex items-center gap-4">
           {salonInfo?.logo ? <img src={salonInfo.logo} alt="Logo" className="h-10 object-contain" /> : <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Building size={20}/></div>}
           <div className={`font-black text-xl tracking-tight ${themeText}`}>{user.name}</div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setShowPaymentModal(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border cursor-pointer ${isDark ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-amber-200 text-amber-600 bg-amber-50'}`}><CreditCard size={16}/> Pagos</button>
           <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-yellow-400 cursor-pointer">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
           <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"><Settings size={18}/></button>
           <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 cursor-pointer"><LogOut size={18}/></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className={`text-4xl font-black tracking-tight ${themeText}`}>Mis Eventos</h1>
            <p className="text-slate-500 mt-1 font-medium">Gestioná tus invitaciones en tiempo real.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <select className={`py-3.5 px-4 border rounded-2xl text-sm font-bold outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Todos</option>
                <option value="upcoming">Próximos</option>
                <option value="past">Pasados</option>
             </select>
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input className={`w-full md:w-64 pl-11 pr-4 py-3.5 border rounded-2xl text-sm font-medium outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`} placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
             <button onClick={async () => { const id = await onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 cursor-pointer transition-transform active:scale-95"><Plus size={20}/> Nuevo Evento</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredInvs.map(inv => {
            const data = inv.internal_data || {};
            const confGuests = data.guests?.reduce((acc, g) => acc + (Number(g.guests) || 1), 0) || 0;
            return (
              <div key={inv.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/30 ${themeCard}`}>
                <div className="h-44 relative overflow-hidden">
                  <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div>
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{data.internalDate ? formatDateSpanish(data.internalDate) : 'Sin fecha'}</p>
                      <h3 className="font-black text-xl text-white truncate max-w-[180px]">{inv.config?.honoreeName || inv.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase text-violet-300">Confirmados</span>
                      <span className="px-3 py-1 rounded-full text-xs font-black border border-white/20 backdrop-blur-md bg-black/40 text-white">{confGuests}</span>
                    </div>
                  </div>
                  <button onClick={() => window.confirm("¿Borrar evento?") && onDeleteInv(inv.id)} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 size={16}/></button>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3 bg-violet-600 text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md"><Edit2 size={14}/> DISEÑAR</button>
                    <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"><Eye size={18}/></button>
                    <button onClick={() => handleCopyLink(inv.id, `${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${copiedStates[inv.id] ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{copiedStates[inv.id] ? <CheckCircle2 size={18}/> : <Copy size={18}/>}</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setActiveCrmId(inv.id)} className={`py-3 rounded-2xl font-black text-[10px] uppercase border cursor-pointer ${isDark ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-200'}`}>FICHA CRM</button>
                    <button onClick={() => setScanningEvent(inv)} className={`py-3 rounded-2xl font-black text-[10px] uppercase border text-violet-600 border-violet-200 cursor-pointer ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white'}`}>ESCANEAR</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {activeCrmId && (
        <CrmModal 
          activeInv={myInvs.find(i => i.id === activeCrmId)} 
          onClose={() => setActiveCrmId(null)} 
          user={user} 
          salonInfo={salonInfo} 
          onUpdateInternal={onUpdateInternal} 
          isDark={isDark} 
        />
      )}

      {scanningEvent && !validationResult && <QRScannerModal onClose={() => setScanningEvent(null)} onScan={processQRScan} />}

      {validationResult && (
        <div className="fixed inset-0 z-[130] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl relative text-center anim-pop border-4" style={{ borderColor: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white" style={{ background: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
                 {validationResult.status === 'success' && <CheckCircle2 size={40}/>}{validationResult.status === 'error' && <Trash2 size={40}/>}{validationResult.status === 'warning' && <AlertTriangle size={40}/>}
              </div>
              <h2 className="text-2xl font-black mb-2 uppercase">{validationResult.title}</h2>
              <p className="text-slate-600 mb-6">{validationResult.desc}</p>
              {validationResult.status === 'success' && <button onClick={confirmAccess} className="w-full py-4 bg-green-500 text-white rounded-xl font-black shadow-lg mb-2">REGISTRAR INGRESO</button>}
              <button onClick={() => setValidationResult(null)} className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-black">CERRAR</button>
           </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative text-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
              <h2 className="text-xl font-black mb-6">Ajustes del Salón</h2>
              <div className="max-h-[60vh] overflow-y-auto px-2 fd-sb">
                <FileUpload label="Logo" value={newLogo} onChange={setNewLogo} isDark={isDark} />
                <Inp label="Teléfono (WhatsApp)" placeholder="Ej: +54 9 11 1234-5678" value={newPhone} onChange={setNewPhone} isDark={isDark} />
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 text-left">Redes Sociales (Se aplican a las nuevas invitaciones)</p>
                  <Inp label="Instagram (URL completa)" placeholder="https://instagram.com/tusalon" value={newInstagram} onChange={setNewInstagram} isDark={isDark} />
                  <Inp label="Facebook (URL completa)" placeholder="https://facebook.com/tusalon" value={newFacebook} onChange={setNewFacebook} isDark={isDark} />
                  <Inp label="TikTok (URL completa)" placeholder="https://tiktok.com/@tusalon" value={newTiktok} onChange={setNewTiktok} isDark={isDark} />
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                  <Inp label="Nueva Clave de Acceso" type="password" value={newPassword} onChange={setNewPassword} isDark={isDark} />
                </div>
              </div>
              <button onClick={() => { 
                onUpdateUser(user.email, { 
                  logo: newLogo, 
                  phone: newPhone, 
                  instagram: newInstagram, 
                  facebook: newFacebook, 
                  tiktok: newTiktok, 
                  ...(newPassword ? {pass: newPassword} : {}) 
                }); 
                setShowSettings(false); 
                notify("Ajustes guardados"); 
              }} className="w-full py-4 mt-4 bg-violet-600 text-white rounded-xl font-black cursor-pointer shadow-lg active:scale-95 transition-transform">GUARDAR</button>
              <button onClick={() => setShowSettings(false)} className="mt-4 text-xs font-bold opacity-50 cursor-pointer">CANCELAR</button>
           </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative text-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
              <h2 className="text-xl font-black mb-2">Abonar Suscripción</h2>
              <p className="text-sm opacity-70 mb-6">Transferí tu cuota para mantener el panel activo.</p>
              <div className={`p-4 rounded-xl border mb-6 text-left ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Transferencia BBVA (CLABE)</p>
                 <p className="font-bold">Titular: Jonatán Rivas</p>
                 <p className="font-mono text-xl mt-3 text-violet-500 font-bold tracking-wider text-center bg-white dark:bg-slate-800 py-2 rounded-lg border border-violet-200 dark:border-slate-600">
                   {salonInfo?.payment_clabe || "012345678901234567"}
                 </p>
              </div>
              <button onClick={() => window.open(`https://t.me/jonatanrivas?text=Hola,%20pagué%20la%20cuota%20de%20${user.name}`)} className="w-full py-4 bg-[#0088cc] text-white rounded-xl font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"><Send size={18}/> ENVIAR COMPROBANTE</button>
              <button onClick={() => setShowPaymentModal(false)} className="mt-4 text-xs font-bold opacity-50 cursor-pointer">CERRAR</button>
           </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
