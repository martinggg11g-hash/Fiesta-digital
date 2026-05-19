import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Eye, Edit2 } from 'lucide-react';
import EditorSidebar from './EditorSidebar';
import { InvitePreview } from './Preview';
import { DEF_CONFIG } from './config';
import { OpeningAnimation } from './Lotties';

export const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 👉 Usamos la prop 'invitations' que viene de App.jsx en lugar de hacer fetch
  const initialInv = invitations.find(i => i.id === id) || { config: DEF_CONFIG, internal_data: {} };
  
  const [inv, setInv] = useState(initialInv);
  const [loading, setLoading] = useState(false); // Ya no necesitamos loading de fetch
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [previewAnim, setPreviewAnim] = useState(false); 
  const [mobileView, setMobileView] = useState('editor');

  // Si las invitaciones globales cambian, actualizamos el estado local del editor
  useEffect(() => {
    const currentInv = invitations.find(i => i.id === id);
    if (currentInv) setInv(currentInv);
  }, [invitations, id]);

  const handleSave = async () => {
  setSaveStatus('saving');
  try {
    // onSave es la función que viene de App.jsx (que ya sincroniza todo)
    await onSave(inv); 
    
    setSaveStatus('saved');
    
    // Volver al estado original después de 2 segundos
    setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
    
  } catch (err) {
    console.error("Error guardando:", err);
    alert("Hubo un error al guardar. Intentá de nuevo.");
    setSaveStatus('idle');
  }
};

  const updateConfig = (key, val) => {
    setInv(prev => ({ 
        ...prev, 
        config: { ...prev.config, [key]: val } 
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a] relative">
      
      {/* ANIMACIÓN DE ENTRADA */}
      {previewAnim && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center">
           <OpeningAnimation cfg={inv.config} onOpen={() => setPreviewAnim(false)} isPreview={true} />
        </div>
      )}

      {/* HEADER */}
      <header className="h-16 bg-[#0f172a] border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-black text-sm uppercase tracking-widest hidden md:block">
            Editando: <span className="text-violet-400">{inv.title}</span>
          </h1>
        </div>
        
        <button 
  onClick={handleSave} 
  disabled={saveStatus !== 'idle'}
  className={`flex items-center gap-2 px-6 py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg cursor-pointer
    ${saveStatus === 'saving' ? 'bg-violet-700 opacity-80' : 
      saveStatus === 'saved' ? 'bg-green-600 shadow-green-500/20' : 
      'bg-violet-600 hover:bg-violet-700 shadow-violet-600/30'}`}
>
  {saveStatus === 'saving' && <Loader2 size={16} className="animate-spin" />}
  {saveStatus === 'saved' && <CheckCircle2 size={16} />}
  {saveStatus === 'idle' && <Save size={16} />}
  
  {saveStatus === 'saving' ? "GUARDANDO..." : 
   saveStatus === 'saved' ? "¡CAMBIOS GUARDADOS!" : 
   "GUARDAR CAMBIOS"}
</button>
      </header>

      {/* CUERPO */}
      <div className="flex-1 flex overflow-hidden relative">
        <EditorSidebar 
          inv={inv} 
          setInv={setInv} 
          cfg={inv.config} 
          update={updateConfig} 
          setPreviewAnim={setPreviewAnim} 
          mobileView={mobileView} 
        />

        <main className={`flex-1 overflow-hidden bg-[#0b0f19] flex items-center justify-center p-0 md:p-6 lg:p-8 relative ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="bg-white shadow-2xl relative overflow-hidden w-full h-full md:w-[375px] md:max-h-[812px] md:rounded-[2.5rem] md:border-[8px] md:border-[#1e293b] shrink-0">
            <div className="absolute top-0 inset-x-0 h-5 bg-[#1e293b] rounded-b-2xl w-[40%] mx-auto z-50 hidden md:block"></div>
            <div className="w-full h-full overflow-y-auto overflow-x-hidden relative pb-[80px] md:pb-0" id="preview-container">
              <InvitePreview 
                cfg={inv.config} 
                update={updateConfig}
                internalData={inv.internal_data}
              />
            </div>
          </div>
        </main>
      </div>

      {/* NAV MÓVIL */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl md:hidden z-[9999]">
        <button onClick={() => setMobileView('editor')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${mobileView === 'editor' ? 'bg-violet-600 text-white' : 'text-slate-400'}`}><Edit2 size={14} /> Opciones</button>
        <button onClick={() => setMobileView('preview')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${mobileView === 'preview' ? 'bg-violet-600 text-white' : 'text-slate-400'}`}><Eye size={14} /> Vista Previa</button>
      </div>
    </div>
  );
};
