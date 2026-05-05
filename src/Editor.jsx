import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

// Importamos la configuración y componentes externos
import { DEF_CONFIG } from "./config";
import { OpeningAnimation } from "./Lotties";
import { InvitePreview } from "./Preview";

// Importamos lo que separamos recién
import { MiniInp } from "./EditorUI";
import EditorSidebar from "./EditorSidebar";

export const EditorScreen = ({ invitations, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [previewAnim, setPreviewAnim] = useState(false);
  const [mobileView, setMobileView] = useState("editor");

  // Buscamos la invitación en la base de datos
  useEffect(() => {
    const found = invitations.find(i => i.id === id);
    if (found) setInv({ ...found }); else navigate("/dashboard");
  }, [id, invitations, navigate]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando editor...</div>;

  // Funciones para actualizar datos y guardar
  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const handleSave = () => { onSave(inv); navigate("/dashboard"); };
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      
      {/* HEADER SUPERIOR */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"><ArrowLeft size={20}/></button>
          <MiniInp className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5 focus:bg-white/10 transition-colors" value={inv.title} onChange={v => setInv({...inv, title: v})} />
        </div>
        <button onClick={handleSave} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl shadow-violet-900/40 cursor-pointer transition-colors">
          <Save size={16}/> GUARDAR CAMBIOS
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex relative overflow-hidden bg-slate-950">
        
        {/* BOTTOM TABS FLOTANTES (Solo Mobile) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/95 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 p-1.5 anim-pop">
          <button onClick={() => setMobileView("editor")} className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${mobileView === "editor" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>✏️ Editar</button>
          <button onClick={() => setMobileView("preview")} className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${mobileView === "preview" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👀 Previa</button>
        </div>

        {/* PANEL LATERAL DE CONTROLES (Importado desde EditorSidebar) */}
        <EditorSidebar 
          inv={inv} 
          setInv={setInv} 
          cfg={cfg} 
          update={update} 
          setPreviewAnim={setPreviewAnim} 
          mobileView={mobileView} 
        />

        {/* VISTA PREVIA CENTRAL (Celular Virtual) */}
        <main className={`w-[100vw] md:flex-1 h-full shrink-0 snap-center bg-slate-900 flex items-center justify-center p-6 md:p-10 relative overflow-hidden pb-24 md:pb-6 ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl relative z-10 max-h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center"><div className="w-10 h-1 bg-slate-800 rounded-full" /></div>
            
            {previewAnim && <OpeningAnimation cfg={cfg} onOpen={() => setPreviewAnim(false)} isPreview={true} />}
            
            <div className="h-full w-full overflow-y-auto bg-black pb-10 fd-sb" style={{ scrollBehavior: 'smooth' }}>
              {/* ACÁ ESTABA EL ERROR: AHORA LE PASAMOS EL UPDATE */}
              <InvitePreview cfg={cfg} status={inv.internal_data?.eventStatus || "Nuevo"} update={update} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
