import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { DEF_CONFIG } from "./config";
import { OpeningAnimation } from "./Lotties";
import { InvitePreview } from "./Preview";
import { MiniInp } from "./EditorUI";
import EditorSidebar from "./EditorSidebar";

export const EditorScreen = ({ invitations, onSave, onUpdateInternal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [previewAnim, setPreviewAnim] = useState(false);
  const [mobileView, setMobileView] = useState("editor");

  useEffect(() => {
    const found = invitations.find(i => i.id === id);
    if (found) setInv({ ...found }); else navigate("/dashboard");
  }, [id, invitations, navigate]);

  if (!inv) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-3"/> Cargando...</div>;

  const update = (k, v) => setInv(p => ({ ...p, config: { ...(p.config || DEF_CONFIG), [k]: v } }));
  const handleSave = () => { onSave(inv); navigate("/dashboard"); };
  const cfg = inv.config || DEF_CONFIG;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-white/5 rounded-xl text-white flex items-center justify-center hover:bg-white/10 transition-colors"><ArrowLeft size={20}/></button>
          <MiniInp className="bg-transparent border-none text-white font-black text-sm outline-none w-48 px-2 py-1 rounded hover:bg-white/5" value={inv.title} onChange={v => setInv({...inv, title: v})} />
        </div>
        <button onClick={handleSave} className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs flex items-center gap-3 shadow-xl cursor-pointer transition-colors"><Save size={16}/> GUARDAR CAMBIOS</button>
      </header>

      <div className="flex-1 flex relative overflow-hidden bg-slate-950">
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/95 backdrop-blur-xl rounded-full border border-white/10 p-1.5 shadow-2xl">
          <button onClick={() => setMobileView("editor")} className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${mobileView === "editor" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400'}`}>✏️ Editar</button>
          <button onClick={() => setMobileView("preview")} className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${mobileView === "preview" ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400'}`}>👀 Previa</button>
        </div>

        <EditorSidebar inv={inv} setInv={setInv} cfg={cfg} update={update} setPreviewAnim={setPreviewAnim} mobileView={mobileView} onUpdateInternal={onUpdateInternal} />

        <main className={`w-[100vw] md:flex-1 h-full bg-slate-900 flex items-center justify-center p-6 md:p-10 relative overflow-hidden pb-24 md:pb-6 ${mobileView === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="invite-phone anim-pop border-[8px] border-slate-800 shadow-2xl relative z-10 max-h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a2e] rounded-b-2xl z-50 flex items-center justify-center"><div className="w-10 h-1 bg-slate-800 rounded-full" /></div>
            {previewAnim && <OpeningAnimation cfg={cfg} onOpen={() => setPreviewAnim(false)} isPreview={true} />}
            <div className="h-full w-full overflow-y-auto bg-black pb-10" style={{ scrollBehavior: 'smooth' }}>
              <InvitePreview cfg={cfg} status={inv.internal_data?.eventStatus || "Nuevo"} update={update} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
