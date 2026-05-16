import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Eye, Edit2 } from 'lucide-react'; // 👉 Importamos Eye y Edit2 para los botones móviles
import EditorSidebar from './EditorSidebar';
import { InvitePreview } from './Preview';
import { DEF_CONFIG } from './config';
import { supabase } from './supabase';
import { OpeningAnimation } from './Lotties'; 

export const EditorScreen = () => {
  const [inv, setInv] = useState({ config: DEF_CONFIG });
  const [salonProfile, setSalonProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewAnim, setPreviewAnim] = useState(false); 
  const [mobileView, setMobileView] = useState('editor'); // 👉 Controla qué panel se ve en el celular

  const eventSlug = window.location.pathname.split('/').pop();

  useEffect(() => {
    const loadData = async () => {
      if (!eventSlug || eventSlug === 'editor') {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.from('eventos').select('*').eq('slug', eventSlug).single();

        if (data) {
          setInv({ ...data, config: { ...DEF_CONFIG, ...data.config } });
        } else {
          const { data: newData } = await supabase.from('eventos').insert([{ slug: eventSlug, config: DEF_CONFIG }]).select().single();
          if (newData) setInv(newData);
        }

        const { data: invData } = await supabase.from('invitaciones').select('salon_id').eq('id', eventSlug).single();
        if (invData?.salon_id) {
          const { data: sData } = await supabase.from('salones').select('*').eq('email', invData.salon_id).single();
          if (sData) setSalonProfile(sData); 
        }

      } catch (err) {
        console.error("Error cargando evento:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('eventos').update({ config: inv.config }).eq('slug', eventSlug);
      await supabase.from('invitaciones').update({ config: inv.config }).eq('id', eventSlug);
      
      alert("¡Cambios guardados correctamente en la base de datos! 🚀");
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Hubo un error al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key, val) => {
    setInv(prev => ({ ...prev, config: { ...prev.config, [key]: val } }));
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <Loader2 size={48} className="animate-spin text-violet-500 mb-4" />
        <p className="font-bold tracking-widest uppercase text-xs">Cargando evento desde Supabase...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a] relative">
      
      {/* RENDER DE ANIMACIÓN DE ENTRADA */}
      {previewAnim && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center">
           <OpeningAnimation 
              cfg={inv.config} 
              onOpen={() => setPreviewAnim(false)} 
              isPreview={true} 
           />
        </div>
      )}

      {/* HEADER DE CONTROL */}
      <header className="h-16 bg-[#0f172a] border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-black text-sm uppercase tracking-widest hidden md:block">
            Editando: <span className="text-violet-400">{eventSlug}</span>
          </h1>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(124,58,246,0.3)] cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "GUARDAR CAMBIOS"}
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL DOS COLUMNAS */}
      <div className="flex-1 flex overflow-hidden relative">
        <EditorSidebar 
          inv={inv} 
          setInv={setInv} 
          cfg={inv.config} 
          update={updateConfig} 
          setPreviewAnim={setPreviewAnim} 
          mobileView={mobileView} 
          salonProfile={salonProfile} 
        />

        <main className={`flex-1 overflow-hidden bg-[#0b0f19] flex items-center justify-center p-0 md:p-6 lg:p-8 relative ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`} style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          <div className={`bg-white shadow-2xl relative overflow-hidden transition-all duration-300 w-full h-full md:w-auto md:h-[95%] md:max-h-[812px] md:aspect-[375/812] md:rounded-[2.5rem] lg:md:rounded-[3rem] md:border-[8px] md:border-[#1e293b] md:shrink-0`}>
            
            <div className="absolute top-0 inset-x-0 h-5 lg:h-6 bg-[#1e293b] rounded-b-2xl lg:rounded-b-3xl w-[40%] mx-auto z-50 hidden md:block"></div>
            
            <div className="w-full h-full overflow-y-auto overflow-x-hidden relative pb-[80px] md:pb-0" id="preview-container">
              {/* 👇 ACÁ VOLVEMOS A USAR inv.config PARA QUE NO EXPLOTE */}
              <InvitePreview 
                cfg={inv.config} 
                update={updateConfig} 
              />
            </div>
            
          </div>
        </main>
      </div>

      {/* 👉 BARRA DE NAVEGACIÓN FLOTANTE MÓVIL (Aparece solo en pantallas chicas) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl md:hidden z-[9999]">
        <button 
          type="button"
          onClick={() => setMobileView('editor')} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${mobileView === 'editor' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Edit2 size={14} /> Opciones
        </button>
        <button 
          type="button"
          onClick={() => setMobileView('preview')} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${mobileView === 'preview' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Eye size={14} /> Vista Previa
        </button>
      </div>

    </div>
  );
};
