import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, PartyPopper, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

// 👉 MC-09: Inp simplificado al 100%. Sin debounce, directo y reactivo.
const Inp = ({ label, value, onChange, placeholder, type="text", className="", icon: Icon = null }) => {
  const [showPwd, setShowPwd] = useState(false);
  const actualType = type === 'password' && showPwd ? 'text' : type;
  
  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-slate-500">{label}</label>}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-4 text-slate-400"><Icon size={16}/></div>}
        <input 
          type={actualType} 
          value={value || ""} 
          onChange={e => onChange(e.target.value)} 
          placeholder={placeholder} 
          className={`w-full py-3 rounded-xl text-sm border focus:border-violet-400 outline-none transition-all bg-gray-50 border-gray-200 text-slate-800 focus:bg-white ${Icon ? 'pl-11' : 'px-4'} ${type === 'password' ? 'pr-12' : 'pr-4'}`} 
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 text-slate-400 hover:text-violet-500 transition-colors cursor-pointer">
            {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
    </div>
  );
};

export default function LoginScreen({ isMaster = false, onLogin, users }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // NOTA: BC-01 y BM-07 (Seguridad y Auth de base de datos) 
    // se mantienen tal cual para resolver en la etapa de paso a Producción.

    if (isMaster && email === "owner@defiesta.lat" && pass === "owner123") {
      onLogin({ name: "Master", role: "owner", email }, rememberMe);
      navigate("/dashboard");
      return;
    }
    
    const found = users.find(u => u.email === email && u.pass === pass);
    if (found) { 
      onLogin(found, rememberMe); 
      navigate("/dashboard"); 
    } else {
      setError("Credenciales no válidas.");
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isMaster ? 'bg-slate-950' : 'bg-[#08060f]'}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-2xl ${isMaster ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600'}`}>
            {isMaster ? <ShieldCheck size={40} color="white"/> : <PartyPopper size={40} color="white"/>}
          </div>
          <h1 className="text-white text-3xl font-black">DeFiesta<span className="text-violet-400">.lat</span></h1>
        </div>
        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-2">
            {error && <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3"><AlertCircle size={16} /> {error}</div>}
            
            <Inp label="Email" value={email} onChange={setEmail} />
            <Inp label="Clave" type="password" value={pass} onChange={setPass} />
            
            <label className="flex items-center gap-2 mb-4 mt-4 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500" />
              <span className="text-sm text-slate-300 font-bold">Mantener sesión iniciada</span>
            </label>

            <button className="w-full py-4 mt-2 bg-violet-600 text-white rounded-2xl font-black text-sm transition-transform active:scale-95 flex justify-center items-center cursor-pointer shadow-lg">
              {loading ? <Loader2 size={18} className="animate-spin"/> : "INGRESAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
