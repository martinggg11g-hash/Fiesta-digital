import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Plus, Trash2, Copy, CheckCircle2, Building, Edit2, 
  Search, Sun, Moon, Settings, CreditCard, Send, Eye, Filter, ScanBarcode, Smartphone, AlertTriangle, AlertCircle, ImageIcon, Loader2, X, MessageCircle, Menu
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

const TELEGRAM_BOT_TOKEN = "8613978258:AAHC2F6xe9mwNxc3JFCBWWQen4CIGEqGvW8"; 
const TELEGRAM_CHAT_ID = "5121261948";

export default function DashboardScreen({ user, onLogout, users, onUpdateUser, onCreateSalon, onDeleteSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal, onUpdateConfig, globalAlert, onUpdateAlert }) {
  const navigate = useNavigate();
  
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCrmId, setActiveCrmId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

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

  const chatEndRef = useRef(null);
  const [lastSeenChat, setLastSeenChat] = useState(() => Number(localStorage.getItem(`fiesta_chat_seen_${user?.email}`)) || 0);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");
    return saved ? JSON.parse(saved) : false;
  });

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
    return <MasterPanel mySalons={users.filter(u => u.role === "salon")} onLogout={onLogout} onCreateSalon={onCreateSalon} onUpdateUser={onUpdateUser} onDeleteSalon={onDeleteSalon} globalAlert={globalAlert} onUpdateAlert={onUpdateAlert} />;
  }

  const themeBg = isDark ? "bg-slate-900" : "bg-[#f1f3f9]";
  const themeNav = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const themeText = isDark ? "text-white" : "text-slate-800";
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/60";

  return (
    <div className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}>
      <nav className={`h-20 border-b px-6 flex items-center justify-between sticky top-0 z-40 ${themeNav}`}>
        <div className="flex items-center gap-4 overflow-hidden pr-2">
           {salonInfo?.logo ? <img src={salonInfo.logo} alt="Logo" className="h-10 w-10 object-contain shrink-0" /> : <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shrink-0"><Building size={20}/></div>}
           <div className={`font-black text-xl tracking-tight truncate ${themeText}`}>{user.name}</div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center"><LogOut size={18}/></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredInvs.map(inv => {
            const data = inv.internal_data || {};
            const confGuests = data.guests?.reduce((acc, g) => acc + (Number(g.guests) || 1), 0) || 0;
            return (
              <div key={inv.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full ${themeCard}`}>
                <div className="h-44 relative overflow-hidden">
                  <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div>
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                        {inv.config?.date ? formatDateSpanish(inv.config.date) : 'Sin fecha'}
                      </p>
                      <h3 className="font-black text-xl text-white truncate max-w-[180px]">{inv.config?.honoreeName || inv.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase text-violet-300">Confirmados</span>
                      <span className="px-3 py-1 rounded-full text-xs font-black border border-white/20 backdrop-blur-md bg-black/40 text-white">{confGuests}</span>
                    </div>
                  </div>
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
          key={activeCrmId + JSON.stringify(myInvs.find(i => i.id === activeCrmId))}
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
    </div>
  );
}
