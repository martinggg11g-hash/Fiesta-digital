import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import EditorSidebar from './EditorSidebar';
import { InvitePreview } from './Preview';
import { DEF_CONFIG } from './config';
import { supabase } from './supabase';

// 🚀 AHORA RECIBE 'invitations' y 'onSave' desde App.jsx
export const EditorScreen = ({ invitations, onSave }) => {
  const [inv, setInv] = useState({ config: DEF_CONFIG });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewAnim, setPreviewAnim] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); 

  const eventSlug = window.location.pathname.split('/').pop();

  // 🔥 MAGIA ACÁ: Buscamos la invitación en los datos del Dashboard para saber quién es el dueño
  const parentInv = invitations?.find(i => i.id === eventSlug);
  const salonEmail = parentInv?.salon_id || parentInv?.salonId;

  // 1️⃣ CARGAR DATOS DESDE SUPABASE AL ABRIR EL EDITOR
  useEffect(() => {
    const loadData = async () => {
      if (!eventSlug || eventSlug === 'editor') {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('slug', eventSlug)
          .single();

        if (data) {
          // Le inyectamos el salon_id a la fuerza para que el Sidebar sepa de quién buscar las redes
          setInv({ ...data, config: { ...DEF_CONFIG, ...data.config }, salon_id: salonEmail });
        } else {
          const { data: newData, error: insertError } = await supabase
            .from('eventos')
            .insert([{ slug: eventSlug, config: DEF_CONFIG }])
            .select()
            .single();
            
          if (newData) setInv({ ...newData, salon_id: salonEmail });
        }
      } catch (err) {
        console.error("Error cargando evento:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventSlug, salonEmail]);

  // 2️⃣ GUARDAR DATOS EN SUPABASE AL TOCAR EL BOTÓN
  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Guardamos en la tabla 'eventos' para la vista pública
      const { error } = await supabase
        .from('eventos')
        .update({ config: inv.config })
        .eq('slug', eventSlug);

      if (error) throw error;
      
      // 2. SINCRONIZACIÓN: Le avisamos a App.jsx que actualice la tabla 'invitaciones'
      // Así tu panel cambia la foto de portada cuando la editan
      if (onSave && parentInv) {
        await onSave({ ...parentInv, config: inv.config });
      }

      alert("¡Cambios guardados correctamente en la base de datos! 🚀");
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Hubo un error al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key, val) => {
    setInv(prev => ({
      ...prev,
      config: { ...prev.config, [key]: val }
    }));
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a]">
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

      <div className="flex-1 flex overflow-hidden relative">
        <EditorSidebar 
          inv={inv} 
          setInv={setInv} 
          cfg={inv.config} 
          update={updateConfig} 
          setPreviewAnim={setPreviewAnim} 
          mobileView={mobileView} 
        />

        <main className={`flex-1 overflow-y-auto bg-[#0b0f19] flex items-center justify-center p-4 md:p-8 ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`} style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="w-[375px] h-[812px] bg-white rounded-[3rem] overflow-hidden shadow-2xl relative border-[8px] border-[#1e293b] shrink-0">
            <div className="absolute top-0 inset-x-0 h-6 bg-[#1e293b] rounded-b-3xl w-40 mx-auto z-50"></div>
            
            <div className="w-full h-full overflow-y-auto overflow-x-hidden relative" id="preview-container">
              <InvitePreview 
                cfg={inv.config} 
                update={updateConfig} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
