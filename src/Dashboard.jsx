import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Plus, Trash2, Copy, CheckCircle2, Building, Edit2, 
  Search, Sun, Moon, Settings, CreditCard, Send, Eye, Filter, ScanBarcode, Smartphone, AlertTriangle, AlertCircle, ImageIcon, Loader2, X, MessageCircle, Menu
} from "lucide-react";

import { Inp, Toast, QRScannerModal } from "./DashboardUI";
import { MasterPanel } from "./MasterPanel";
import { CrmModal } from "./CrmModal";
import { formatDateSpanish } from "./config";
import { FileUpload } from "./EditorUI"; // FD-001: Importado para reemplazar el Inp de Logo
import { supabase } from "./supabase"; // FD-004: Importado para hacer el update real (ajustá la ruta si es necesario)

const slugify = (text) => text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN; 
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export default function DashboardScreen({ user, onLogout, users, onUpdateUser, onCreateSalon, onDeleteSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal, onUpdateConfig, globalAlert, onUpdateAlert }) {
  const navigate = useNavigate();
  
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); 

  const [activeCrmId, setActiveCrmId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  
  const [deleteConfirm, setDeleteConfirm] = useState(null); 

  const [scanningEvent, setScanningEvent] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const [receiptFile, setReceiptFile] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  const salonInfo = users.find(u => u.email === user?.email);
  const [newPassword, setNewPassword] = useState("");
  const [newLogo, setNewLogo] = useState(salonInfo?.logo || "");
  const [newPhone, setNewPhone] = useState(salonInfo?.phone || "");
  const [newInstagram, setNewInstagram] = useState(salonInfo?.instagram || "");
  const [newFacebook, setNewFacebook] = useState(salonInfo?.facebook || "");
  const [newTiktok, setNewTiktok] = useState(salonInfo?.tiktok || "");
  
  const [newMaxPax, setNewMaxPax] = useState(salonInfo?.max_por_mesa || 10);
  const [newTotalMesas, setNewTotalMesas] = useState(salonInfo?.cantidad_mesas || 10);

  const chatEndRef = useRef(null);
  const [lastSeenChat, setLastSeenChat] = useState(() => Number(localStorage.getItem(`fiesta_chat_seen_${user?.email}`)) || 0);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (showSettings) {
      setNewLogo(salonInfo?.logo || "");
      setNewPhone(salonInfo?.phone || "");
      setNewInstagram(salonInfo?.instagram || "");
      setNewFacebook(salonInfo?.facebook || "");
      setNewTiktok(salonInfo?.tiktok || "");
      setNewMaxPax(salonInfo?.max_por_mesa || 10);
      setNewTotalMesas(salonInfo?.cantidad_mesas || 10);
    }
  }, [showSettings, salonInfo]);

  useEffect(() => { localStorage.setItem("fiesta_darkmode", JSON.stringify(isDark)); }, [isDark]);
  
  useEffect(() => {
    if (showSupportModal) {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      const now = Date.now();
      setLastSeenChat(now);
      localStorage.setItem(`fiesta_chat_seen_${user?.email}`, now.toString());
    }
  }, [showSupportModal, salonInfo?.support_chat, user?.email]);

  if (!user) return null;

  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => { setCopiedStates(prev => ({ ...prev, [id]: false })); }, 2000);
  };

  const isOwner = user.role === "owner";
  
  const myInvs = (isOwner ? invitations : invitations.filter(i => i.salonId === user.email))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  let filteredInvs = myInvs.filter(inv => {
    const term = searchTerm.trim().toLowerCase();
    const data = inv.internal_data || {};
    const honoree = inv.config?.honoreeName || "";
    const matchText = !term || inv.title?.toLowerCase().includes(term) || (data.clientName || "").toLowerCase().includes(term) || honoree.toLowerCase().includes(term);
    
    if (!matchText) return false;
    if (filterType === 'upcoming') return !inv.config?.date || new Date(inv.config.date) >= new Date().setHours(0,0,0,0);
    if (filterType === 'past') return inv.config?.date && new Date(inv.config.date) < new Date().setHours(0,0,0,0);
    return true;
  });

  const processQRScan = (qrString) => {
    let isVIP = false;
    
    let guestDb = scanningEvent.internal_data?.guests?.find(g => g.id === qrString) || 
                  scanningEvent.internal_data?.guests?.find(g => qrString.includes(g.id));

    if (!guestDb && scanningEvent.invitados) {
      guestDb = scanningEvent.invitados.find(g => g.id === qrString);
      if (guestDb) isVIP = true;
    }

    if (!guestDb) {
      setValidationResult({ status: 'error', title: 'Pase Inválido', desc: 'Este QR no pertenece a este evento o es falso.' });
    } else if (guestDb.status === 'Ingresó') {
      const nameToShow = guestDb.name || guestDb.nombre; 
      setValidationResult({ status: 'warning', title: 'Pase Usado', desc: `${nameToShow} ya ingresó.`, data: { ...guestDb, isVIP } });
    } else {
      setValidationResult({ status: 'success', title: 'Acceso Permitido', desc: 'Pase verificado correctamente.', data: { ...guestDb, isVIP } });
    }
  };

  // FD-004 y FD-006: Función convertida a async, update real en Supabase y mutación evitada
  const confirmAccess = async () => {
    const { isVIP, id } = validationResult.data;
    
    if (isVIP) {
      try {
        // FD-004: Llamada real a producción en Supabase
        await supabase.from('invitados').update({ status: 'Ingresó' }).eq('id', id);
        
        // FD-006: Evitar mutar `scanningEvent.invitados` directamente
        if (scanningEvent.invitados) {
          setScanningEvent(prev => ({
            ...prev,
            invitados: prev.invitados.map(g => g.id === id ? { ...g, status: 'Ingresó' } : g)
          }));
        }
      } catch (error) {
        console.error("Error al actualizar invitado VIP:", error);
        notify("Error al registrar el ingreso VIP");
        return; // Salir temprano si hay error
      }
    } else {
      const updated = scanningEvent.internal_data.guests.map(g => g.id === id ? { ...g, status: 'Ingresó' } : g);
      onUpdateInternal(scanningEvent.id, 'guests', updated);
      
      // Actualizamos el estado local también de forma inmutable por consistencia visual
      setScanningEvent(prev => ({
        ...prev,
        internal_data: {
          ...prev.internal_data,
          guests: updated
        }
      }));
    }
    
    setValidationResult(null);
    notify("Ingreso registrado");
  };

  const handleSendReceipt = async () => {
    if (!receiptFile) return alert("Por favor, seleccioná una foto del comprobante primero.");
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn("Modo Sandbox: Simulando envío de comprobante porque no hay tokens de Telegram.");
      setSendingReceipt(true);
      setTimeout(() => {
        notify("¡Simulado con éxito (Modo Sandbox)!"); 
        setShowPaymentModal(false); 
        setReceiptFile(null);
        setSendingReceipt(false);
      }, 1500);
      return;
    }

    setSendingReceipt(true);
    try {
      const formData = new FormData();
      formData.append("chat_id", TELEGRAM_CHAT_ID);
      formData.append("photo", receiptFile);
      formData.append("caption", `💰 Nuevo Comprobante de Pago\n🏢 Salón: ${user.name}\n📧 Email: ${user.email}`);

      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: "POST", body: formData });
      if (res.ok) { notify("¡Comprobante enviado con éxito!"); setShowPaymentModal(false); setReceiptFile(null); } 
      else { alert("No se pudo enviar el comprobante. Verificá la configuración del bot."); }
    } catch (e) { alert("Error de red al intentar enviar el comprobante."); }
    setSendingReceipt(false);
  };

  const handleSendSupportMessage = async () => {
    if (!supportMessage.trim()) return;
    const newMsg = { sender: 'salon', text: supportMessage, date: new Date().toISOString() };
    const chatArray = [...(salonInfo?.support_chat || []), newMsg];
    setSupportMessage(""); 
    await onUpdateUser(user.email, { support_chat: chatArray });
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const formData = new FormData();
        formData.append("chat_id", TELEGRAM_CHAT_ID);
        formData.append("text", `🆘 *NUEVO MENSAJE DE SOPORTE*\n🏢 Salón: ${user.name}\n\n💬 Mensaje:\n_${newMsg.text}_\n\n📲 _Entrá al Master Panel para responderle._`);
        formData.append("parse_mode", "Markdown");
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", body: formData });
      } catch (e) { console.error("Error enviando notificación a Telegram:", e); }
    }
  };

  if (isOwner) {
    return <MasterPanel mySalons={users.filter(u => u.role === "salon")} onLogout={onLogout} onCreateSalon={onCreateSalon} onUpdateUser={onUpdateUser} onDeleteSalon={onDeleteSalon} globalAlert={globalAlert} onUpdateAlert={onUpdateAlert} />;
  }

  const themeBg = isDark ? "bg-slate-900" : "bg-[#f1f3f9]";
  const themeNav = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const themeText = isDark ? "text-white" : "text-slate-800";
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/60";

  const isDemo = salonInfo?.is_demo;
  const invitesCreated = salonInfo?.invites_created || 0;
  const canCreate = !isDemo || invitesCreated < 3;

  const chatArr = salonInfo?.support_chat || [];
  const lastMsg = chatArr[chatArr.length - 1];
  const hasUnreadChat = lastMsg && lastMsg.sender === 'master' && new Date(lastMsg.date).getTime() > lastSeenChat;

  return (
    <div className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}>
      <style>{`@media print { .no-print { display: none !important; } .only-print { display: block !important; } }`}</style>

      {globalAlert?.activo && globalAlert?.mensaje && (
        <>
          <style>{`@keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } } .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 20s linear infinite; will-change: transform; } .animate-marquee:hover { animation-play-state: paused; }`}</style>
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-2 text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-md flex items-center overflow-hidden sticky top-0 z-50 h-9">
            <div className="shrink-0 z-10 bg-black/20 px-3 py-1.5 rounded-r-xl backdrop-blur-md flex items-center gap-2 border-r border-white/10 mr-2 shadow-[10px_0_15px_rgba(0,0,0,0.2)]">
               <AlertCircle size={16} className="animate-pulse text-yellow-300"/>
               <span className="text-yellow-300">INFO</span>
            </div>
            <div className="flex-1 overflow-hidden flex items-center h-full relative"><div className="animate-marquee cursor-default flex items-center h-full">{globalAlert.mensaje}</div></div>
          </div>
        </>
      )}

      <nav className={`h-20 border-b px-6 sm:px-8 flex items-center justify-between sticky ${globalAlert?.activo && globalAlert?.mensaje ? 'top-9' : 'top-0'} z-40 transition-colors duration-300 no-print ${themeNav}`}>
        <div className="flex items-center gap-4 overflow-hidden pr-2">
           {salonInfo?.logo ? <img src={salonInfo.logo} alt="Logo" className="h-10 w-10 object-contain shrink-0" /> : <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"><Building size={20}/></div>}
           <div className={`font-black text-xl tracking-tight truncate ${themeText}`}>{user.name}</div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
           <button onClick={() => setShowSupportModal(true)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 cursor-pointer relative transition-colors">
             <MessageCircle size={18}/>
             {hasUnreadChat && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>}
           </button>
           <button onClick={() => setShowPaymentModal(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border cursor-pointer ${isDark ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-amber-200 text-amber-600 bg-amber-50'}`}><CreditCard size={16}/> Pagos</button>
           <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-yellow-400 cursor-pointer">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
           <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"><Settings size={18}/></button>
           <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 cursor-pointer"><LogOut size={18}/></button>
        </div>

        <div className="flex items-center gap-2 md:hidden shrink-0">
           <button onClick={() => setShowSupportModal(true)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer relative">
             <MessageCircle size={18}/>
             {hasUnreadChat && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
           </button>
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
             {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
           </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className={`md:hidden absolute left-0 right-0 border-b shadow-2xl z-30 flex flex-col p-4 gap-3 anim-pop ${themeCard}`} style={{ top: globalAlert?.activo && globalAlert?.mensaje ? '7.25rem' : '5rem', transformOrigin: 'top' }}>
            <button onClick={() => { setShowPaymentModal(true); setMobileMenuOpen(false); }} className={`w-full px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border shadow-sm ${isDark ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-amber-200 text-amber-600 bg-amber-50'}`}><CreditCard size={18}/> Abonar Suscripción</button>
            <div className="flex gap-3">
              <button onClick={() => { setIsDark(!isDark); setMobileMenuOpen(false); }} className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border shadow-sm ${isDark ? 'bg-slate-700 border-slate-600 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'}`}>{isDark ? <><Sun size={16}/> Claro</> : <><Moon size={16}/> Oscuro</>}</button>
              <button onClick={() => { setShowSettings(true); setMobileMenuOpen(false); }} className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border shadow-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}><Settings size={16}/> Ajustes</button>
            </div>
            <button onClick={() => { onLogout(); navigate("/"); }} className="w-full py-3.5 mt-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-xs font-bold"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 md:p-12 no-print">
        {isDemo && (
           <div className={`mb-8 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${invitesCreated >= 3 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
             <div>
              <p className="font-black flex items-center gap-2 uppercase tracking-widest text-sm mb-1"><AlertTriangle size={18}/> Cuenta Demo Activa</p>
              <p className="text-xs font-medium">Has creado {invitesCreated} de 3 invitaciones permitidas. {invitesCreated >= 3 && 'Límite alcanzado.'}</p>
             </div>
             <button onClick={() => setShowSupportModal(true)} className={`px-6 py-2.5 rounded-xl font-black text-xs text-white uppercase tracking-widest cursor-pointer shadow-md transition-transform active:scale-95 ${invitesCreated >= 3 ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}>Mejorar Plan</button>
           </div>
        )}

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
             <button onClick={async () => { 
                 if (!canCreate) return alert("Has alcanzado el límite de 3 invitaciones en tu cuenta Demo. Por favor, contacta a soporte.");
                 const id = await onCreateInv(user.email, user.name); 
                 if (id) navigate(`/editor/${id}`); 
             }} 
             className={`px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 transition-transform active:scale-95 uppercase tracking-widest ${canCreate ? 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
             >
               <Plus size={20}/> Nuevo Evento
             </button>
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
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{inv.config?.date ? formatDateSpanish(inv.config.date) : 'Sin fecha'}</p>
                      <h3 className="font-black text-xl text-white truncate max-w-[180px]">{inv.config?.honoreeName || inv.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase text-violet-300">Confirmados</span>
                      <span className="px-3 py-1 rounded-full text-xs font-black border border-white/20 backdrop-blur-md bg-black/40 text-white">{confGuests}</span>
                    </div>
                  </div>
                  <button onClick={() => setDeleteConfirm(inv.id)} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 size={16}/></button>
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

      {/* MODALES RECUPERADOS */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[130] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative text-center anim-pop border-4 border-red-500 ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
             <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500 text-white">
                <Trash2 size={40}/>
             </div>
             <h2 className="text-2xl font-black mb-2 uppercase">¿Borrar Evento?</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">Esta acción no se puede deshacer. Todos los datos y confirmaciones se perderán.</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteConfirm(null)} className={`flex-1 py-4 rounded-xl font-black transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>CANCELAR</button>
               <button onClick={() => { onDeleteInv(deleteConfirm); setDeleteConfirm(null); notify("Evento eliminado"); }} className="flex-1 py-4 bg-red-500 text-white hover:bg-red-600 rounded-xl font-black shadow-lg">BORRAR</button>
             </div>
           </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`} style={{ height: '70vh' }}>
             <button onClick={() => setShowSupportModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer transition-colors"><X size={20}/></button>
             <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">
               <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><MessageCircle size={24} /></div>
               <div>
                 <h2 className="text-xl font-black tracking-tight">Soporte Técnico</h2>
                 <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Chateá con un asesor</p>
               </div>
             </div>
             <div className={`flex-1 overflow-y-auto p-4 rounded-2xl border mb-4 space-y-4 fd-sb ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
               {!(salonInfo?.support_chat?.length) && (
                   <div className="text-center opacity-50 mt-10">
                      <MessageCircle size={30} className="mx-auto mb-2" />
                      <p className="text-xs font-bold">Aún no hay mensajes.</p>
                      <p className="text-[10px]">Escribinos tus dudas o solicitá mejorar tu plan.</p>
                   </div>
               )}
               {(salonInfo?.support_chat || []).map((msg, i) => (
                 <div key={i} className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.sender === 'salon' ? 'bg-emerald-600 text-white self-end ml-auto rounded-tr-sm' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-tl-sm'}`}>
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                     <span className={`text-[9px] block mt-1.5 opacity-70 ${msg.sender==='salon'?'text-right':''}`}>{new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>
             <div className="flex gap-2 shrink-0">
               <input type="text" value={supportMessage} onChange={e=>setSupportMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') handleSendSupportMessage();}} placeholder="Escribir mensaje..." className={`flex-1 p-3.5 rounded-xl border text-sm outline-none focus:border-emerald-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'}`} />
               <button onClick={handleSendSupportMessage} disabled={!supportMessage.trim()} className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors"><Send size={20}/></button>
             </div>
           </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative text-center anim-pop ${isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
             <button onClick={() => { setShowPaymentModal(false); setReceiptFile(null); }} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer transition-colors"><X size={20}/></button>
             <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-500/20"><CreditCard size={32} /></div>
             <h2 className="text-2xl font-black mb-2 tracking-tight">Abonar Suscripción</h2>
             <p className="text-sm opacity-70 mb-6 font-medium">Transferí tu cuota para mantener el panel activo.</p>
             <div className={`p-5 rounded-2xl border mb-6 text-left shadow-inner ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Datos Bancarios</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{salonInfo?.payment_titular || "A nombre del Titular"}</p>
                <p className="font-mono text-xl mt-3 text-violet-600 dark:text-violet-400 font-bold tracking-wider text-center bg-white dark:bg-slate-800 py-3 rounded-xl border border-violet-200 dark:border-slate-600 shadow-sm">{salonInfo?.payment_clabe || "012345678901234567"}</p>
             </div>
             <div className="mb-6 relative"><input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files[0])} className="hidden" id="receipt-upload" disabled={sendingReceipt}/><label htmlFor="receipt-upload" className={`w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${receiptFile ? 'bg-violet-50 border-violet-300 text-violet-600' : (isDark ? 'bg-slate-700 border-slate-500 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-500')}`}>{receiptFile ? (<><CheckCircle2 size={24} className="text-violet-500" /><span className="font-bold text-sm truncate max-w-[200px]">{receiptFile.name}</span><span className="text-[10px] uppercase font-black opacity-60 mt-1 hover:underline">Cambiar foto</span></>) : (<><ImageIcon size={24} /><span className="font-bold text-sm">Cargar Comprobante</span><span className="text-[10px] uppercase font-black opacity-60 mt-1">Tap para subir foto</span></>)}</label></div>
             <button onClick={handleSendReceipt} disabled={sendingReceipt || !receiptFile} className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm ${(!receiptFile || sendingReceipt) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0088cc] text-white hover:bg-[#0077b5] cursor-pointer'}`}>{sendingReceipt ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>} {sendingReceipt ? 'ENVIANDO...' : 'ENVIAR COMPROBANTE'}</button>
           </div>
        </div>
      )}

      {activeCrmId && (
        <CrmModal 
          key={activeCrmId} 
          activeInv={myInvs.find(i => i.id === activeCrmId)} 
          onClose={() => setActiveCrmId(null)} 
          user={user} 
          salonInfo={salonInfo} 
          onUpdateInternal={onUpdateInternal} 
          onUpdateConfig={onUpdateConfig} 
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
               
               {/* FD-001: Reemplazado <Inp> por <FileUpload> */}
               <FileUpload label="Logo del Salón" value={newLogo} onChange={setNewLogo} isDark={isDark} />
               
               <Inp label="Teléfono (WhatsApp)" placeholder="Ej: +54 9 11 1234-5678" value={newPhone} onChange={setNewPhone} isDark={isDark} />
               
               <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-4 text-left">Organización</p>
                 <Inp label="Cantidad Total de Mesas" type="number" placeholder="Ej: 20" value={newTotalMesas} onChange={setNewTotalMesas} isDark={isDark} />
                 <Inp label="Límite Personas x Mesa" type="number" placeholder="Ej: 10" value={newMaxPax} onChange={setNewMaxPax} isDark={isDark} />
               </div>

               <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-4 text-left">Redes Sociales</p>
                 <Inp label="Instagram (URL completa)" placeholder="https://instagram.com/tusalon" value={newInstagram} onChange={setNewInstagram} isDark={isDark} />
                 <Inp label="Facebook (URL completa)" placeholder="https://facebook.com/tusalon" value={newFacebook} onChange={setNewFacebook} isDark={isDark} />
                 <Inp label="TikTok (URL completa)" placeholder="https://tiktok.com/@tusalon" value={newTiktok} onChange={setNewTiktok} isDark={isDark} />
               </div>
               <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-4 text-left">Seguridad</p>
                 <Inp label="Nueva Clave de Acceso" type="password" value={newPassword} onChange={setNewPassword} isDark={isDark} />
               </div>
             </div>
             <button onClick={() => { onUpdateUser(user.email, { logo: newLogo, phone: newPhone, max_por_mesa: Number(newMaxPax) || 10, cantidad_mesas: Number(newTotalMesas) || 10, instagram: newInstagram, facebook: newFacebook, tiktok: newTiktok, ...(newPassword ? {pass: newPassword} : {}) }); setShowSettings(false); notify("Ajustes guardados"); }} className="w-full py-4 mt-4 bg-violet-600 text-white rounded-xl font-black cursor-pointer shadow-lg active:scale-95 transition-transform">GUARDAR</button>
             <button onClick={() => setShowSettings(false)} className="mt-4 text-xs font-bold opacity-50 cursor-pointer">CANCELAR</button>
           </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
