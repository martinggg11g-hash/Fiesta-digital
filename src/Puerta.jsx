import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, X, AlertTriangle, ScanBarcode, Users, Loader2, Check } from "lucide-react";

// ESCÁNER ULTRA RÁPIDO (Cámara trasera por defecto)
const FastScanner = ({ onClose, onScan }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
      { facingMode: "environment" }, 
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        html5QrCode.stop().then(() => onScan(decodedText));
      },
      (err) => { /* Ignoramos errores de enfoque de fondo */ }
    ).catch(err => {
      console.error(err);
      alert("Por favor, dale permisos a la cámara para poder escanear.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-[2rem] p-6 shadow-2xl relative text-center anim-pop">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><X size={20}/></button>
          <div className="w-16 h-16 bg-violet-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><ScanBarcode size={30}/></div>
          <h2 className="text-xl font-black text-white mb-2">Escáner de Recepción</h2>
          <p className="text-slate-400 text-xs mb-6">Apunta al QR del invitado.</p>
          <div id="reader" className="w-full overflow-hidden rounded-2xl border-4 border-violet-500 bg-black aspect-square"></div>
       </div>
    </div>
  );
};

export default function PuertaScreen({ invitations, onUpdateInternal }) {
  const { id } = useParams();
  const inv = invitations.find(i => i.id === id);
  const [scanning, setScanning] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  if (!inv) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white"><Loader2 className="animate-spin mb-4" size={40}/>Buscando evento...</div>;

  const guestsList = inv.internal_data?.guests || [];
  const ingresaron = guestsList.filter(g => g.status === 'Ingresó').reduce((acc, g) => acc + g.guests, 0);
  const total = guestsList.reduce((acc, g) => acc + g.guests, 0);

  const processQRScan = (qrString) => {
    const [tId, tName, tLast, tPax] = qrString.split('|');

    // 👉 MAGIA PARA PRUEBAS DESDE EL EDITOR
    if (tId === "VIP-MOCK-1234") {
      setValidationResult({ 
        status: 'success', 
        title: '¡QR de Prueba OK!', 
        desc: 'El escáner lee perfecto. Este es un QR generado por el panel de edición.', 
        data: { id: tId, name: 'Invitado', lastname: 'de Prueba', guests: 2 } 
      });
      return;
    }

    const guestDb = guestsList.find(g => g.id === tId);

    if (!guestDb) setValidationResult({ status: 'error', title: 'Pase Inválido', desc: 'Este QR es falso o de otra fiesta.' });
    else if (guestDb.status === 'Ingresó') setValidationResult({ status: 'warning', title: 'Pase Usado', desc: `${guestDb.name} ya registró su ingreso.`, data: guestDb });
    else setValidationResult({ status: 'success', title: 'Acceso Permitido', desc: 'Pase VIP verificado.', data: guestDb });
  };

  const confirmAccess = () => {
    // Si es el mock de prueba, no actualizamos la base de datos real
    if (validationResult.data.id === "VIP-MOCK-1234") {
      alert("¡Simulación de ingreso exitosa! (La base de datos real no fue alterada).");
      setValidationResult(null);
      return;
    }

    const updatedGuests = guestsList.map(g => g.id === validationResult.data.id ? { ...g, status: 'Ingresó' } : g);
    onUpdateInternal(inv.id, 'guests', updatedGuests);
    setValidationResult(null);
  };

  const handleManualEntry = (guestId, guestName) => {
    if (window.confirm(`¿Querés marcar el ingreso manual de ${guestName}?`)) {
      const updatedGuests = guestsList.map(g => g.id === guestId ? { ...g, status: 'Ingresó' } : g);
      onUpdateInternal(inv.id, 'guests', updatedGuests);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-10">
      <div className="p-6 max-w-md mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-1">{inv.title}</h1>
          <p className="text-violet-400 font-bold text-sm">Panel de Recepción</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Confirmados</p>
            <p className="text-3xl font-black text-white">{total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Ya Ingresaron</p>
            <p className="text-3xl font-black text-green-400">{ingresaron}</p>
          </div>
        </div>

        <button onClick={() => setScanning(true)} className="w-full py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-[1.5rem] font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-violet-900/50 transition-transform active:scale-95 mb-8 cursor-pointer">
          <ScanBarcode size={24}/> ABRIR ESCÁNER QR
        </button>

        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Users size={16}/> Lista de Acceso</h3>
        
        <div className="space-y-3">
          {guestsList.slice().reverse().map((g, i) => (
            <div key={i} className={`border p-4 rounded-2xl flex justify-between items-center gap-2 transition-colors ${g.status === 'Ingresó' ? 'bg-slate-900/50 border-green-500/20' : 'bg-slate-900 border-slate-700'}`}>
              <div className="flex-1">
                <p className={`font-bold text-sm ${g.status === 'Ingresó' ? 'text-slate-400' : 'text-white'}`}>{g.name} {g.lastname}</p>
                <p className="text-xs text-slate-500 mt-0.5">{g.guests} pax • <span className="font-mono text-[10px]">{g.id}</span></p>
              </div>
              
              {g.status === 'Ingresó' ? (
                <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 shrink-0 flex items-center gap-1">
                  <Check size={12}/> ADENTRO
                </span>
              ) : (
                <button onClick={() => handleManualEntry(g.id, g.name)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-amber-950 transition-transform active:scale-95 shrink-0 shadow-lg shadow-amber-500/20 cursor-pointer">
                  MARCAR INGRESO
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {scanning && <FastScanner onClose={() => setScanning(false)} onScan={processQRScan} />}

      {validationResult && (
        <div className="fixed inset-0 z-[130] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
           <div className="w-full max-w-sm bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative text-center border-4 anim-pop" style={{ borderColor: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl" style={{ background: validationResult.status === 'success' ? '#22c55e' : (validationResult.status === 'error' ? '#ef4444' : '#f59e0b') }}>
                 {validationResult.status === 'success' && <CheckCircle2 size={40}/>}
                 {validationResult.status === 'error' && <X size={40}/>}
                 {validationResult.status === 'warning' && <AlertTriangle size={40}/>}
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">{validationResult.title}</h2>
              <p className="text-slate-400 font-medium text-sm mb-6">{validationResult.desc}</p>
              
              {validationResult.data && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6 text-left">
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Invitado</p>
                   <p className="font-bold text-lg text-white mb-3">{validationResult.data.name} {validationResult.data.lastname}</p>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Personas Totales</p>
                   <p className="font-bold text-lg text-white">{validationResult.data.guests}</p>
                </div>
              )}

              {validationResult.status === 'success' && (
                <button onClick={confirmAccess} className="w-full py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-black text-sm transition-transform active:scale-95 shadow-lg mb-3 cursor-pointer">AUTORIZAR INGRESO</button>
              )}
              <button onClick={() => setValidationResult(null)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm transition-transform active:scale-95 cursor-pointer">Cerrar</button>
           </div>
        </div>
      )}
    </div>
  );
}
