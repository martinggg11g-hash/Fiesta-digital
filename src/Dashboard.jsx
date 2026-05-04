import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  ShieldCheck, LogOut, Plus, Trash2, Copy, CheckCircle2, Lock, 
  MapPin, CalendarClock, AlertTriangle, KeyRound, Building, Edit2, X, MessageCircle, Eye, EyeOff, Search,
  Phone, Users, Clock, Settings, UserCheck, Receipt,
  Moon, Sun, Printer, ClipboardList, ImageIcon, FileText, ScanBarcode, FileDown, PartyPopper, Loader2, CreditCard, Send
} from "lucide-react";

const slugify = (text) => text?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'salon';
const IMGBB_API_KEY = "904f81caf05efe58a799abdb1fedc2ce";

const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

const getTodaySpanish = () => {
  const today = new Date();
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;
};

export const Toast = ({ msg }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10 anim-pop">
    <CheckCircle2 size={18} className="text-green-400" /> {msg}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", multiline = false, className="", icon: Icon = null, prefix=null, isDark=false }) => {
  const [localVal, setLocalVal] = useState(value || "");
  const [showPwd, setShowPwd] = useState(false);
  const isFocused = useRef(false);

  useEffect(() => { if (!isFocused.current) setLocalVal(value || ""); }, [value]);
  useEffect(() => { const timeout = setTimeout(() => { if (localVal !== (value || "")) onChange(localVal); }, 400); return () => clearTimeout(timeout); }, [localVal, onChange, value]);

  const handleBlur = () => { isFocused.current = false; if (localVal !== (value || "")) onChange(localVal); };
  const bgClass = isDark ? "bg-slate-800 border-slate-700 text-white focus:bg-slate-700" : "bg-gray-50 border-gray-200 text-slate-800 focus:bg-white";
  const actualType = type === 'password' && showPwd ? 'text' : type;
  
  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
        {prefix && <span className="absolute left-4 text-slate-400 font-bold">{prefix}</span>}
        {multiline ? (
          <textarea value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} rows={3} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all resize-none ${bgClass} ${(Icon || prefix) ? 'pl-11 pr-4' : 'px-4'}`} />
        ) : (
          <input type={actualType} value={localVal} onChange={e => setLocalVal(e.target.value)} onFocus={() => isFocused.current = true} onBlur={handleBlur} placeholder={placeholder} className={`w-full py-3 rounded-xl text-sm focus:border-violet-400 outline-none transition-all ${bgClass} ${(Icon || prefix) ? 'pl-11' : 'px-4'} ${type === 'password' ? 'pr-12' : 'pr-4'}`} />
        )}
        {type === 'password' && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 text-slate-400 hover:text-violet-500 transition-colors cursor-pointer">
            {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
    </div>
  );
};

const FileUpload = ({ label, onChange, value, isDark=false }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
    } catch (err) { } finally { setUploading(false); }
  };
  return (
    <div className="mb-4 text-left relative">
      {label && <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>}
      <div className="relative">
        <label className={`flex items-center justify-center w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed bg-slate-700 text-white' : (isDark ? 'bg-slate-800 border-slate-700 text-violet-400 hover:bg-slate-700' : 'bg-white border-violet-200 text-violet-600 hover:bg-violet-50')}`}>
          <span className="flex items-center gap-2">{uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><ImageIcon size={16}/> Subir logo</>}</span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      </div>
      {value && !uploading && (
        <div className="relative mt-3 group w-fit">
          <img src={value} alt="preview" className="h-16 w-auto object-contain rounded-xl border border-gray-200 shadow-sm bg-white p-2" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"><Trash2 size={12} /></button>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer inline-block">
    <input type="checkbox" className="sr-only peer" checked={checked || false} onChange={e => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
  </label>
);

const QRScannerModal = ({ onClose, onScan }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => { html5QrCode.stop().then(() => onScan(decodedText)); },
      (err) => { }
    ).catch(err => {
      alert("Por favor, dale permisos a la cámara en tu navegador.");
    });
    return () => { if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.log(e)); };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl relative text-center anim-pop">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size="{20}"/></button>
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><ScanBarcode size="{30}"/></div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Control de Acceso</h2>
          <p className="text-slate-500 text-xs mb-6">Enfocá el QR del invitado.</p>
          <div id="reader" className="w-full overflow-hidden rounded-2xl border-4 border-slate-100 aspect-square"></div>
       </div>
    </div>
  );
};

export default function DashboardScreen({ user, onLogout, users, onUpdateUser, onCreateSalon, onDeleteSalon, invitations, onCreateInv, onDeleteInv, onUpdateInternal }) {
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCrmId, setActiveCrmId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Nuevo Modal de Pagos
  
  // Escaner
  const [scanningEvent, setScanningEvent] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  // Formularios de Salón
  const [newPassword, setNewPassword] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [newPhone, setNewPhone] = useState(""); 
  const [printMode, setPrintMode] = useState("ficha"); 

  // Modal para CRUD de Invitados (Crear/Editar)
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [gName, setGName] = useState("");
  const [gLastname, setGLastname] = useState("");
  const [gPax, setGPax] = useState(1);
  const [gStatus, setGStatus] = useState("Pendiente");

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => { localStorage.setItem("fiesta_darkmode", JSON.stringify(isDark)); }, [isDark]);

  const navigate = useNavigate();
  if (!user) return null;

  const isOwner = user.role === "owner";
  const myInvs = isOwner ? invitations : invitations.filter(i => i.salonId === user.email);
  const mySalons = users.filter(u => u.role === "salon");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const filteredInvs = myInvs.filter(inv => (inv.title || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const activeInv = myInvs.find(i => i.id === activeCrmId);
  const guestsList = activeInv?.internal_data?.guests || [];

  const themeBg = isDark ? "bg-slate-900" : "bg-[#f1f3f9]";
  const themeNav = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const themeText = isDark ? "text-white" : "text-slate-800";
  const themeCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/60";

  // MÓDULO INVITADOS: Exportar
  const handleExportCSV = () => {
    if(guestsList.length === 0) return alert("No hay invitados confirmados aún.");
    let csv = "ID Pase,Nombre Completo,Acompañantes,Estado,Fecha de Confirmación\n";
    guestsList.forEach(g => {
      csv += `${g.id},${g.name} ${g.lastname},${g.guests},${g.status},${new Date(g.timestamp).toLocaleDateString('es-AR')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Invitados_${activeInv.title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // MÓDULO INVITADOS: CRUD
  const openNewGuest = () => {
    setEditingGuest(null);
    setGName(""); setGLastname(""); setGPax(1); setGStatus("Pendiente");
    setShowGuestModal(true);
  };
  
  const openEditGuest = (g) => {
    setEditingGuest(g);
    setGName(g.name); setGLastname(g.lastname); setGPax(g.guests); setGStatus(g.status);
    setShowGuestModal(true);
  };

  const saveGuest = () => {
    if(!gName) return alert("Falta nombre");
    let newList = [...guestsList];
    
    if (editingGuest) {
      // Editando
      newList = newList.map(g => g.id === editingGuest.id ? { ...g, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus } : g);
    } else {
      // Nuevo manual (Fake QR ID)
      const fakeId = `MANUAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      newList.push({ id: fakeId, name: gName, lastname: gLastname, guests: Number(gPax), status: gStatus, timestamp: new Date().toISOString() });
    }
    
    onUpdateInternal(activeInv.id, 'guests', newList);
    setShowGuestModal(false);
    notify("Invitado guardado");
  };

  const deleteGuest = (guestId) => {
    if(window.confirm("¿Seguro que querés borrar a este invitado? El QR que descargó dejará de funcionar.")) {
      const newList = guestsList.filter(g => g.id !== guestId);
      onUpdateInternal(activeInv.id, 'guests', newList);
      notify("Invitado eliminado");
    }
  };

  // ESCANER LÓGICA
  const processQRScan = (qrString) => {
    const [tId, tName, tLast, tPax] = qrString.split('|');
    const guestDb = scanningEvent.internal_data?.guests?.find(g => g.id === tId);

    if (!guestDb) {
      setValidationResult({ status: 'error', title: 'Pase Inválido', desc: 'Este QR no pertenece a este evento o es falso.' });
    } else if (guestDb.status === 'Ingresó') {
      setValidationResult({ status: 'warning', title: 'Pase Usado', desc: `${guestDb.name} ${guestDb.lastname} ya registró su ingreso.`, data: guestDb });
    } else {
      setValidationResult({ status: 'success', title: 'Acceso Permitido', desc: 'Pase VIP verificado correctamente.', data: guestDb });
    }
  };

  const confirmAccess = () => {
    const updatedGuests = scanningEvent.internal_data.guests.map(g => g.id === validationResult.data.id ? { ...g, status: 'Ingresó' } : g);
    onUpdateInternal(scanningEvent.id, 'guests', updatedGuests);
    setValidationResult(null);
    notify("Ingreso registrado");
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 200); 
  };


  if (!isOwner) {
    const salonInfo = users.find(u => u.email === user.email);
    const isManualBlocked = salonInfo?.payment_alert;
    
    return (
      <div className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}>
        <style>{`
          @media print { 
            @page { margin: 0; } 
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
            .no-print { display: none !important; } 
            .only-print { display: block !important; padding: 1.5cm 2cm !important; } 
          }
        `}</style>

        <div className="no-print">
          <nav className={`h-20 border-b px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300 ${themeNav}`}>
            <div className="flex items-center gap-4">
               {salonInfo?.logo ? <img src={salonInfo.logo} alt="Logo" className="h-10 object-contain drop-shadow-sm" /> : <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200/20"><Building size={20}/></div>}
               <div className={`font-black text-xl tracking-tight ${themeText}`}>{user.name} <span className="text-violet-500 text-sm opacity-60 ml-2 hidden sm:inline-block">| Panel de Gestión</span></div>
            </div>
            <div className="flex items-center gap-3">
               {/* BOTÓN DE PAGOS NUEVO */}
               <button onClick={() => setShowPaymentModal(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 border cursor-pointer ${isDark ? 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100'}`}>
                 <CreditCard size={16}/> Pagos / Facturación
               </button>

               <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
               <button onClick={() => { setNewLogo(salonInfo?.logo || ""); setNewPhone(salonInfo?.phone || ""); setNewPassword(""); setShowSettings(true); }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Settings size={18}/></button>
               <button onClick={() => { onLogout(); navigate("/"); }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"><LogOut size={18}/></button>
            </div>
          </nav>
          
          {isManualBlocked && <div className="bg-red-500 text-white p-3 text-center font-bold text-xs flex items-center justify-center gap-3"><AlertTriangle size={16}/> Tu cuenta presenta un atraso en el pago. Por favor regularizá tu situación.</div>}

          <main className="max-w-7xl mx-auto p-6 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <h1 className={`text-4xl font-black tracking-tight ${themeText}`}>Mis Eventos</h1>
                <p className="text-slate-500 mt-1 font-medium italic">Gestioná tus invitaciones y la logística en tiempo real.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="relative group flex-1 md:flex-none">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18}/>
                    <input className={`w-full md:w-64 pl-11 pr-4 py-3.5 border rounded-2xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-violet-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} placeholder="Buscar evento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                 </div>
                 <button onClick={async () => { const id = await onCreateInv(user.email, user.name); navigate(`/editor/${id}`); }} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95 cursor-pointer"><Plus size={20}/> Nuevo Evento</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredInvs.map(inv => {
                const data = inv.internal_data || {};
                const pStatus = data.paymentStatus || 'Pendiente';
                const eStatus = data.eventStatus || 'Nuevo';
                const confGuests = data.guests?.reduce((acc, g) => acc + g.guests, 0) || 0;
                
                return (
                  <div key={inv.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-violet-500/30 ${themeCard}`}>
                    <div className="h-44 relative overflow-hidden">
                      <img src={inv.config?.coverPhoto || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Event" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${eStatus === 'Nuevo' ? 'bg-blue-100 text-blue-700' : eStatus === 'Confirmado' ? 'bg-violet-100 text-violet-700' : eStatus === 'Finalizado' ? 'bg-slate-200 text-slate-700' : 'bg-red-200 text-red-800'}`}>{eStatus}</span>
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                         <div>
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{data.internalDate ? formatDateSpanish(data.internalDate) : 'Sin fecha'} {data.internalTime ? `• ${data.internalTime} hs` : ''}</p>
                            <h3 className="font-black text-xl text-white truncate max-w-[200px]">{data.internalHonoree || inv.config?.honoreeName || inv.title}</h3>
                         </div>
                         <div className="text-right">
                           <span className="block text-[10px] font-black uppercase text-violet-300 mb-1">Confirmados</span>
                           <span className="px-3 py-1 rounded-full text-xs font-black border border-white/20 backdrop-blur-md bg-black/40 text-white">{confGuests}</span>
                         </div>
                      </div>
                      <button onClick={() => { if(window.confirm("¿Borrar definitivamente este evento?")) onDeleteInv(inv.id); }} className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg cursor-pointer"><Trash2 size={16}/></button>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        <button onClick={() => navigate(`/editor/${inv.id}`)} className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"><Edit2 size={14}/> DISEÑAR</button>
                        <button onClick={() => window.open(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Eye size={18}/></button>
                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${slugify(user.name)}/${inv.id}`); notify("¡Link Copiado!"); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Copy size={18}/></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { setActiveTab("info"); setActiveCrmId(inv.id); }} className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex justify-center items-center gap-2 border shadow-sm cursor-pointer transition-colors ${isDark ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}><Lock size={14}/> FICHA CRM</button>
                        <button onClick={() => setScanningEvent(inv)} className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex justify-center items-center gap-2 border shadow-sm cursor-pointer transition-colors ${isDark ? 'bg-slate-800 border-slate-600 text-violet-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-violet-600 hover:bg-slate-50'}`}><ScanBarcode size={14}/> ESCANEAR QR</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* ESCANER DE CÁMARA */}
          {scanningEvent && !validationResult && (
            <QRScannerModal onClose={() => setScanningEvent(null)} onScan={processQRScan} />
          )}

          {/* RESULTADO DE VALIDACIÓN DEL PASE */}
          {validationResult && (
            <div className="fixed inset-0 z-[130] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
               <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl relative text-center anim-pop border-4" style={{ borderColor: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white" style={{ background: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
                     {validationResult.status === 'success' && <CheckCircle2 size={40}/>}
                     {validationResult.status === 'error' && <X size={40}/>}
                     {validationResult.status === 'warning' && <AlertTriangle size={40}/>}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-wide">{validationResult.title}</h2>
                  <p className="text-slate-600 font-medium text-sm mb-6">{validationResult.desc}</p>
                  {validationResult.data && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Invitado</p>
                       <p className="font-bold text-lg text-slate-800 mb-3">{validationResult.data.name} {validationResult.data.lastname}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Personas Totales</p>
                       <p className="font-bold text-lg text-slate-800">{validationResult.data.guests}</p>
                    </div>
                  )}
                  {validationResult.status === 'success' && (
                    <button onClick={confirmAccess} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-lg mb-2">AUTORIZAR INGRESO</button>
                  )}
                  <button onClick={() => setValidationResult(null)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer">Cerrar y Escanear Otro</button>
               </div>
            </div>
          )}

          {/* MODAL CRM (FICHA + LISTA DE INVITADOS) */}
          {activeCrmId && activeInv && (
            <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
              <div className={`w-full max-w-5xl max-h-[95vh] h-full sm:h-auto rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-pop ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                   <div className="flex gap-4 border border-slate-300 rounded-xl p-1 bg-slate-100">
                     <button onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'info' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><ClipboardList size={14} className="inline-block mr-1"/> Ficha Interna</button>
                     <button onClick={() => setActiveTab('guests')} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors cursor-pointer ${activeTab === 'guests' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}><Users size={14} className="inline-block mr-1"/> Invitados</button>
                   </div>
                   <button onClick={() => setActiveCrmId(null)} className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-2"><X size={20}/></button>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto fd-sb flex-1 relative">
                  {/* PESTAÑA FICHA INTERNA */}
                  {activeTab === 'info' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex justify-end gap-2 mb-6">
                        <button onClick={() => handlePrint('presupuesto')} className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"><FileText size={14}/> Imprimir PDF Presupuesto</button>
                        <button onClick={() => handlePrint('ficha')} className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"><Printer size={14}/> Imprimir PDF Ficha</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                         <div>
                            <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><UserCheck size={14}/> Datos del Cliente</h3>
                            <Inp label="Nombre Completo" value={activeInv.internal_data.clientName || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientName', v)} isDark={isDark} />
                            <div className="flex gap-2 items-end mb-4">
                               <Inp label="WhatsApp del Cliente" placeholder="54911..." className="flex-1 !mb-0" value={activeInv.internal_data.clientPhone || ''} onChange={v => onUpdateInternal(activeInv.id, 'clientPhone', v)} isDark={isDark} />
                               <button onClick={() => window.open(`https://wa.me/${activeInv.internal_data.clientPhone}`)} className="h-[46px] px-4 bg-green-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md"><MessageCircle size={18}/></button>
                            </div>
                            <Inp label="Cantidad de Invitados (Aprox)" type="number" placeholder="Ej: 80" value={activeInv.internal_data.guestCount || ''} onChange={v => onUpdateInternal(activeInv.id, 'guestCount', v)} isDark={isDark} />
                         </div>
                         <div>
                            <h3 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><PartyPopper size={14}/> Detalles del Evento</h3>
                            <Inp label="Nombre del Agasajado/s" value={activeInv.internal_data.internalHonoree || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalHonoree', v)} isDark={isDark} />
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <Inp label="Tipo de Evento" placeholder="Ej: Boda" value={activeInv.internal_data.eventType || ''} onChange={v => onUpdateInternal(activeInv.id, 'eventType', v)} isDark={isDark} />
                              <div>
                                <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</label>
                                <select className={`w-full py-3 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer border ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`} value={activeInv.internal_data.eventStatus || 'Nuevo'} onChange={e => onUpdateInternal(activeInv.id, 'eventStatus', e.target.value)}>
                                   <option value="Nuevo">🔵 Nuevo / Borrador</option>
                                   <option value="Confirmado">🟣 Confirmado</option>
                                   <option value="Finalizado">⚪ Finalizado</option>
                                   <option value="Cancelado">🔴 Cancelado</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <Inp label="Fecha" type="date" icon={CalendarClock} value={activeInv.internal_data.internalDate || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalDate', v)} isDark={isDark} />
                               <Inp label="Horario" type="text" placeholder="Ej: 14:00 a 20:00" icon={Clock} value={activeInv.internal_data.internalTime || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalTime', v)} isDark={isDark} />
                            </div>
                         </div>
                      </div>

                      <div className="mb-8">
                         <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><ClipboardList size={14}/> Logística y Servicios</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Inp label="Servicios Solicitados (Para Presupuesto)" placeholder="Ej: DJ, Fotógrafo, Show de Magia..." multiline value={activeInv.internal_data.requestedServices || ''} onChange={v => onUpdateInternal(activeInv.id, 'requestedServices', v)} isDark={isDark} />
                            <Inp label="Menús Especiales / Alergias" placeholder="Ej: 2 Celíacos, 1 Vegano..." multiline value={activeInv.internal_data.specialMenus || ''} onChange={v => onUpdateInternal(activeInv.id, 'specialMenus', v)} isDark={isDark} />
                         </div>
                         <Inp label="Notas Internas (Privadas, no se imprimen al cliente)" placeholder="Anotaciones para la cocina o administración..." multiline className="mt-2" value={activeInv.internal_data.internalNotes || ''} onChange={v => onUpdateInternal(activeInv.id, 'internalNotes', v)} isDark={isDark} />
                      </div>

                      <div className="mb-8">
                         <h3 className="text-xs font-black text-green-500 uppercase tracking-widest mb-4 border-b border-slate-200/20 pb-2 flex items-center gap-2"><Receipt size={14}/> Finanzas</h3>
                         <div className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-4 ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                            <div>
                              <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-green-400' : 'text-slate-500'}`}>Estado de Pago</label>
                              <select className={`w-full py-3 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer border ${isDark ? 'bg-slate-800 text-white border-green-900' : 'bg-white text-slate-800 border-green-200'}`} value={activeInv.internal_data.paymentStatus || 'Pendiente'} onChange={e => onUpdateInternal(activeInv.id, 'paymentStatus', e.target.value)}>
                                 <option value="Pendiente">🔴 Pendiente</option>
                                 <option value="Seña / Parcial">🟡 Seña Adelantada</option>
                                 <option value="Pagado Total">🟢 Pagado Total</option>
                              </select>
                            </div>
                            <Inp label="Presupuesto Total" type="number" prefix="$" value={activeInv.internal_data.totalBudget || ''} onChange={v => onUpdateInternal(activeInv.id, 'totalBudget', v)} isDark={isDark} />
                            <Inp label="Abonado / Seña" type="number" prefix="$" value={activeInv.internal_data.paymentAmount || ''} onChange={v => onUpdateInternal(activeInv.id, 'paymentAmount', v)} isDark={isDark} />
                            <div>
                               <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDark ? 'text-green-400' : 'text-slate-500'}`}>Saldo Restante</label>
                               <div className={`w-full py-3 px-4 rounded-xl text-sm font-black flex items-center gap-1 border ${isDark ? 'bg-slate-800 border-green-900 text-white' : 'bg-white border-green-200 text-slate-800'}`}>
                                  <span className="text-slate-400 opacity-50">$</span> {(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA LISTA DE INVITADOS CON CRUD */}
                  {activeTab === 'guests' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className={`font-black text-xl flex items-center gap-2 ${themeText}`}><Users className="text-violet-500" size={24}/> Control de Accesos</h3>
                          <p className="text-slate-500 text-sm mt-1">Total de asistentes confirmados: <strong className="text-violet-600">{guestsList.reduce((acc, g) => acc + g.guests, 0)}</strong></p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={openNewGuest} className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"><Plus size={16}/> AGREGAR A MANO</button>
                           <button onClick={() => handlePrint('invitados')} className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"><Printer size={16}/> IMPRIMIR LISTA</button>
                           <button onClick={handleExportCSV} className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"><FileDown size={16}/> EXCEL</button>
                        </div>
                      </div>

                      {guestsList.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold">Todavía no hay invitados confirmados.</p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                          <table className="w-full text-left bg-white">
                            <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-4 border-b">Invitado</th><th className="p-4 border-b text-center">Pase VIP ID</th><th className="p-4 border-b text-center">Personas</th><th className="p-4 border-b text-center">Estado</th><th className="p-4 border-b text-right">Acciones</th></tr></thead>
                            <tbody className="text-sm">
                              {guestsList.slice().reverse().map((g, i) => (
                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                  <td className="p-4 font-bold text-slate-800">{g.name} {g.lastname}<br/><span className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">{new Date(g.timestamp).toLocaleDateString('es-AR')}</span></td>
                                  <td className="p-4 text-center"><code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 font-mono">{g.id}</code></td>
                                  <td className="p-4 text-center font-black text-slate-600">{g.guests}</td>
                                  <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${g.status === 'Ingresó' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span>
                                  </td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                     <button onClick={() => openEditGuest(g)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 flex items-center justify-center cursor-pointer transition-colors"><Edit2 size={14}/></button>
                                     <button onClick={() => deleteGuest(g.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors"><Trash2 size={14}/></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODAL CREAR/EDITAR INVITADO */}
                  {showGuestModal && (
                    <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                       <div className={`w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative text-center anim-pop ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                          <button onClick={() => setShowGuestModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={16}/></button>
                          <h3 className={`font-black text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{editingGuest ? 'Editar Invitado' : 'Agregar Invitado Manual'}</h3>
                          <div className="space-y-2">
                             <Inp label="Nombre" value={gName} onChange={setGName} isDark={isDark} />
                             <Inp label="Apellido" value={gLastname} onChange={setGLastname} isDark={isDark} />
                             <div className="flex gap-2">
                               <div className="flex-1"><Inp label="Cantidad" type="number" value={gPax} onChange={v => setGPax(v)} isDark={isDark} /></div>
                               <div className="flex-1">
                                 <label className={`block text-[10px] font-black uppercase mb-1.5 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</label>
                                 <select className={`w-full py-3 px-4 rounded-xl text-sm outline-none cursor-pointer border ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-slate-800 border-gray-200'}`} value={gStatus} onChange={e => setGStatus(e.target.value)}>
                                   <option value="Pendiente">Pendiente</option>
                                   <option value="Ingresó">Ingresó</option>
                                 </select>
                               </div>
                             </div>
                             <button onClick={saveGuest} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-md">GUARDAR</button>
                          </div>
                       </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* MODAL AJUSTES DE SALON */}
          {showSettings && (
            <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className={`w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative anim-pop text-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
                  <button onClick={() => setShowSettings(false)} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}><X size={16}/></button>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700 text-violet-400' : 'bg-violet-100 text-violet-600'}`}><Settings size={28}/></div>
                  <h2 className="text-xl font-black mb-6">Ajustes del Salón</h2>
                  <FileUpload label="Logo de tu Salón (Aparecerá en el PDF)" value={newLogo} onChange={setNewLogo} isDark={isDark} />
                  <Inp label="Teléfono de Contacto" placeholder="Ej: +54 9 11 1234-5678" icon={Phone} value={newPhone} onChange={setNewPhone} isDark={isDark} />
                  <div className="mt-6 pt-6 border-t border-slate-200/20"><Inp label="Cambiar Contraseña" type="password" placeholder="Nueva clave..." value={newPassword} onChange={setNewPassword} isDark={isDark} /></div>
                  <button onClick={() => { onUpdateUser(user.email, { logo: newLogo, phone: newPhone, ...(newPassword ? {pass: newPassword} : {}) }); setShowSettings(false); notify("Ajustes guardados"); }} className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer shadow-md">GUARDAR AJUSTES</button>
               </div>
            </div>
          )}

          {/* MODAL DE PAGOS (Suscripción del Salón) */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className={`w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative anim-pop ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
                  <button onClick={() => setShowPaymentModal(false)} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}><X size={16}/></button>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-100 text-amber-600"><CreditCard size={28}/></div>
                  <h2 className="text-xl font-black mb-2 text-center">Abonar Suscripción</h2>
                  <p className="text-sm text-center mb-6 opacity-70">Para mantener tu panel activo, podés transferir tu cuota mensual a las siguientes cuentas.</p>
                  
                  <div className="space-y-3 mb-6 text-sm">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Para México 🇲🇽 (CLABE)</p>
                       <p className="font-bold">Banco: BBVA</p>
                       <p className="font-bold">Titular: Jonatán Rivas</p>
                       <p className="font-mono text-base mt-1 text-violet-500 font-bold tracking-wider">012345678901234567</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Para Argentina 🇦🇷 (CBU/Alias)</p>
                       <p className="font-bold">Titular: Jonatán Rivas</p>
                       <p className="font-mono text-base mt-1 text-violet-500 font-bold tracking-wider">defiesta.lat.mp</p>
                    </div>
                  </div>

                  <button onClick={() => window.open(`https://t.me/jonatanrivas?text=Hola,%20soy%20el%20salón%20${user.name}.%20Te%20envío%20el%20comprobante%20de%20pago.`)} className="w-full py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg">
                    <Send size={18}/> ENVIAR COMPROBANTE POR TELEGRAM
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* ---------------- LA HOJA A4 PARA IMPRIMIR (DOBLE PLANTILLA) ---------------- */}
        {activeCrmId && activeInv && (
          <div className="hidden only-print w-full bg-white text-black font-sans max-w-4xl mx-auto">
             
             {printMode !== 'invitados' ? (
               <>
                 {/* PDF: PRESUPUESTO / FICHA */}
                 <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
                    <div className="flex items-center gap-6">
                      {salonInfo?.logo ? <img src={salonInfo.logo} className="max-h-24 max-w-[200px] object-contain" alt="Logo" /> : <div className="text-3xl font-black tracking-tighter text-slate-900">{user.name}</div>}
                      <div>
                        {salonInfo?.logo && <h1 className="text-xl font-black text-slate-900 m-0 leading-none mb-1">{user.name}</h1>}
                        <p className="text-slate-600 text-sm">{salonInfo?.address || 'Sin dirección registrada'}</p>
                        <p className="text-slate-600 text-sm">{salonInfo?.phone || 'Sin teléfono'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase mb-1">{printMode === 'presupuesto' ? 'PRESUPUESTO' : 'FICHA DE EVENTO'}</h2>
                      <p className="text-sm font-bold text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-lg border border-slate-200">Ref: {activeInv.id.split('-')[1].toUpperCase()}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">1. Detalles del Evento</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Agasajado:</span> <span className="font-black text-lg">{activeInv.internal_data.internalHonoree || '---'}</span></p>
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Tipo:</span> {activeInv.internal_data.eventType || '---'}</p>
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Fecha:</span> {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Horario:</span> {activeInv.internal_data.internalTime || '---'} hs</p>
                        {printMode === 'ficha' && <p><span className="font-bold text-slate-700 w-24 inline-block">Estado (Int):</span> <span className="uppercase font-bold border border-slate-300 px-2 py-0.5 rounded text-[10px] bg-slate-100">{activeInv.internal_data.eventStatus || 'Nuevo'}</span></p>}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">2. Datos del Cliente</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Nombre:</span> <span className="font-bold">{activeInv.internal_data.clientName || '---'}</span></p>
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Teléfono:</span> {activeInv.internal_data.clientPhone || '---'}</p>
                        <p><span className="font-bold text-slate-700 w-24 inline-block">Invitados Aprox:</span> {activeInv.internal_data.guestCount || '---'} personas</p>
                      </div>
                    </div>
                 </div>

                 <div className="mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">3. Servicios Incluidos</h3>
                    <div className="grid grid-cols-2 gap-8 text-sm">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><p className="font-black text-slate-700 mb-1">Servicios Solicitados:</p><p className="whitespace-pre-wrap">{activeInv.internal_data.requestedServices || 'Ninguno especificado.'}</p></div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><p className="font-black text-slate-700 mb-1">Menús Especiales / Alergias:</p><p className="whitespace-pre-wrap">{activeInv.internal_data.specialMenus || 'Ninguno especificado.'}</p></div>
                    </div>
                    {printMode === 'ficha' && <div className="mt-4 p-4 border border-slate-300 rounded-xl bg-yellow-50"><p className="font-black text-slate-700 mb-1 flex items-center gap-2"><AlertTriangle size={14}/> Notas Internas del Salón:</p><p className="whitespace-pre-wrap italic text-slate-600">{activeInv.internal_data.internalNotes || 'Sin observaciones.'}</p></div>}
                 </div>

                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">{printMode === 'presupuesto' ? '4. Detalle de Valores' : '4. Estado Financiero Interno'}</h3>
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-500">Valor Total</p><p className="text-2xl font-bold text-slate-800">${Number(activeInv.internal_data.totalBudget || 0).toLocaleString('es-AR')}</p></div>
                      <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-500">Abonado / Seña</p><p className="text-2xl font-bold text-green-700">${Number(activeInv.internal_data.paymentAmount || 0).toLocaleString('es-AR')}</p></div>
                      <div className="text-center bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg"><p className="text-[10px] font-black uppercase text-slate-300 opacity-80">Saldo Pendiente</p><p className="text-3xl font-black">${(Number(activeInv.internal_data.totalBudget || 0) - Number(activeInv.internal_data.paymentAmount || 0)).toLocaleString('es-AR')}</p></div>
                    </div>
                 </div>
                 
                 <div className="mt-16 text-center text-xs text-slate-400 font-bold border-t border-slate-200 pt-4">{printMode === 'presupuesto' ? <p>Documento emitido el {getTodaySpanish()} • Los valores expresados pueden estar sujetos a modificaciones.</p> : <p>Hoja de ruta interna generada el {getTodaySpanish()}</p>}</div>
               </>
             ) : (
               <>
                 {/* PDF: LISTA DE INVITADOS PARA CONTROL EN PUERTA */}
                 <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase mb-1">LISTA DE ACCESOS</h2>
                      <p className="text-lg font-bold text-slate-600">Evento: {activeInv.title}</p>
                      <p className="text-sm text-slate-500">Fecha: {formatDateSpanish(activeInv.internal_data.internalDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-violet-600">{guestsList.reduce((acc, g) => acc + g.guests, 0)}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Personas Totales</p>
                    </div>
                 </div>

                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-y-2 border-slate-300">
                       <th className="py-3 px-2">ID Pase</th>
                       <th className="py-3 px-2">Nombre del Invitado</th>
                       <th className="py-3 px-2 text-center">Pax</th>
                       <th className="py-3 px-2 text-center">Check-in (Firma)</th>
                     </tr>
                   </thead>
                   <tbody>
                     {guestsList.map((g, i) => (
                       <tr key={i} className="border-b border-slate-200 text-sm">
                         <td className="py-3 px-2 font-mono text-slate-500">{g.id}</td>
                         <td className="py-3 px-2 font-bold text-slate-800">{g.name} {g.lastname}</td>
                         <td className="py-3 px-2 text-center font-black">{g.guests}</td>
                         <td className="py-3 px-2 text-center">
                           <div className="w-6 h-6 rounded border-2 border-slate-300 mx-auto"></div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 <div className="mt-12 text-center text-xs text-slate-400 font-bold">Documento generado el {getTodaySpanish()} • {user.name}</div>
               </>
             )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VISTA MASTER (ADMIN)
  // ==========================================
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 
  const [editingEmail, setEditingEmail] = useState("");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState(""); 
  const [fPass, setFPass] = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fPayDate, setFPayDate] = useState("");
  const [fAlert, setFAlert] = useState(false);

  const openCreateModal = () => { setModalMode("create"); setFName(""); setFEmail(""); setFPhone(""); setFPass(""); setFAddress(""); setFPayDate(""); setFAlert(false); setShowModal(true); };
  const openEditModal = (salon) => { setModalMode("edit"); setEditingEmail(salon.email); setFName(salon.name); setFEmail(salon.email); setFPhone(salon.phone || ""); setFAddress(salon.address || ""); setFPayDate(salon.payment_date || ""); setFAlert(salon.payment_alert || false); setShowModal(true); };
  const openPassModal = (salon) => { setModalMode("password"); setEditingEmail(salon.email); setFPass(""); setShowModal(true); };

  const handleSaveModal = () => {
    if (modalMode === "create") {
      if(!fName || !fEmail || !fPass) return alert("Faltan datos");
      onCreateSalon({ name: fName, email: fEmail, pass: fPass, role: "salon", address: fAddress, phone: fPhone, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "edit") {
      onUpdateUser(editingEmail, { name: fName, phone: fPhone, address: fAddress, payment_date: fPayDate, payment_alert: fAlert });
    } else if (modalMode === "password") {
      onUpdateUser(editingEmail, { pass: fPass });
    }
    setShowModal(false);
    notify("¡Hecho!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <nav className="h-16 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="font-extrabold text-xl flex items-center gap-3"><ShieldCheck className="text-violet-400"/> Panel Maestro</div>
        <button onClick={() => { onLogout(); navigate("/master"); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><LogOut size={18}/></button>
      </nav>
      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div><h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Salones</h1><p className="text-slate-500 mt-2 font-medium">Administrando {mySalons.length} clientes activos</p></div>
          <button onClick={openCreateModal} className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl flex items-center gap-3 transition-transform active:scale-95 cursor-pointer"><Plus size={20}/> Nuevo Salón</button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-5">Salón</th><th className="p-5">Ubicación</th><th className="p-5">Vencimiento</th><th className="p-5">Estado</th><th className="p-5 text-right">Acciones</th></tr></thead>
              <tbody className="text-sm">
                {mySalons.map(salon => {
                  let status = <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">Al día</span>;
                  if (salon.payment_alert) status = <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Bloqueado</span>;
                  return (
                    <tr key={salon.email} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold">{salon.name}<br/><span className="text-xs text-slate-400 font-normal">{salon.email}</span></td>
                      <td className="p-5"><div className="flex gap-2 max-w-[180px]"><MapPin size={16} className="text-slate-300"/><span className="text-xs truncate">{salon.address || 'N/A'}</span></div></td>
                      <td className="p-5 font-bold">{salon.payment_date ? formatDateSpanish(salon.payment_date) : '--/--/----'}</td>
                      <td className="p-5">{status}</td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={() => openEditModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-violet-50 cursor-pointer transition-all"><Edit2 size={16}/></button>
                        <button onClick={() => openPassModal(salon)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-all"><KeyRound size={16}/></button>
                        <button onClick={() => window.confirm("Eliminar?") && onDeleteSalon(salon.email)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 cursor-pointer transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative anim-pop">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-8">{modalMode === 'create' ? 'Nuevo Salón' : modalMode === 'edit' ? 'Editar Salón' : 'Nueva Clave'}</h2>
            <div className="space-y-4">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <>
                  <div className="grid grid-cols-2 gap-3"><Inp label="Nombre" value={fName} onChange={setFName} /><Inp label="WhatsApp" value={fPhone} onChange={setFPhone} /></div>
                  <Inp label="Email" value={fEmail} onChange={setFEmail} className={modalMode === 'edit' ? 'opacity-50 pointer-events-none' : ''} />
                  {modalMode === 'create' && <Inp label="Contraseña" value={fPass} onChange={setFPass} type="password" />}
                  <Inp label="Ubicación Google Maps" value={fAddress} onChange={setFAddress} />
                  <div className="flex gap-4"><Inp label="Próximo Vencimiento" type="date" icon={CalendarClock} value={fPayDate} onChange={setFPayDate} className="flex-1" /><div className="flex flex-col items-center"><span className="text-[10px] font-black uppercase mb-2 text-red-500">Bloqueo</span><Toggle checked={fAlert} onChange={setFAlert} /></div></div>
                </>
              )}
              {modalMode === 'password' && <Inp label="Escribí Nueva Contraseña" value={fPass} onChange={setFPass} type="password" />}
              <button onClick={handleSaveModal} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg">GUARDAR CAMBIOS</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
}
