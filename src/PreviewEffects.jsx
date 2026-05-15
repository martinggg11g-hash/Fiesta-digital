import React, { useState, useEffect, useRef } from "react";

export const CornerOrnament = ({ url, color, size, className, style }) => (
  <div className={className} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, WebkitMaskImage: `url("${url}")`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url("${url}")`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', ...style }} />
);

export const DraggableItem = ({ id, cfg, update, children, className }) => {
  const pos = cfg[`${id}Pos`] || { x: 0, y: 0 };
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(pos);
  const dragRef = useRef(null);

  useEffect(() => { setLocalPos(cfg[`${id}Pos`] || { x: 0, y: 0 }); }, [cfg[`${id}Pos`]]);

  const onPointerDown = (e) => {
    if (!update) return; 
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, origX: localPos.x, origY: localPos.y };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = dragRef.current.origX + (clientX - dragRef.current.startX);
    let y = dragRef.current.origY + (clientY - dragRef.current.startY);
    
    // Límite para que no se escape de la pantalla
    x = Math.max(-120, Math.min(x, 120));
    y = Math.max(-120, Math.min(y, 120));
    
    setLocalPos({ x, y });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (update) update(`${id}Pos`, localPos);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("touchmove", onPointerMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
    }
    return () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, [isDragging, localPos]);

  return (
    <div className={`group ${className || ''}`} style={{ transform: `translate(${localPos.x}px, ${localPos.y}px)`, cursor: update ? (isDragging ? "grabbing" : "grab") : "default", zIndex: isDragging ? 999 : 50, touchAction: update ? 'none' : 'auto', position: 'absolute' }} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
      {children}
      {update && (<div className={`absolute -inset-1 border-2 border-dashed border-violet-500 rounded-lg pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />)}
    </div>
  );
};

export const ParticleCanvas = ({ effect, primary }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (effect === "none" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let observer;
    try {
      const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
      resize(); observer = new ResizeObserver(resize); observer.observe(canvas);
    } catch(e) { }

    const spawnParticle = () => {
      const base = { x: Math.random() * canvas.width, y: -20, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2 + 1, alpha: 1, rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 4, size: Math.random() * 10 + 8, life: 1, decay: Math.random() * 0.005 + 0.002 };
      if (effect.startsWith("confetti")) {
        let colors = [primary, "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#ffffff"];
        if (effect === "confetti-gold") colors = ["#fbbf24", "#f59e0b", "#d97706", "#fef3c7"];
        if (effect === "confetti-silver") colors = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#f8fafc"];
        return { ...base, y: -50, vy: Math.random() * 3 + 2, type: "rect", color: colors[Math.floor(Math.random() * colors.length)], w: Math.random()*12+6, h: Math.random()*6+3, rotV: (Math.random() - 0.5) * 15, life: 2 };
      }
      if (effect === "balloons") return { ...base, y: canvas.height + 50, vy: -(Math.random() * 2 + 1), type: "text", emoji: "🎈", size: Math.random()*30+20 };
      if (effect.startsWith("stars") || effect === "meteor-shower" || effect === "fairy-dust" || effect === "galaxy-dust") {
        let c = "#ffffff";
        if (effect === "stars-gold" || effect === "fairy-dust") c = "#fbbf24";
        if (effect === "galaxy-dust") c = "#a855f7";
        if (effect === "meteor-shower") return { ...base, x: Math.random() * canvas.width * 1.5, y: -50, vx: -5, vy: 5, type: "star", color: c, size: Math.random() * 3 + 1, alphaDir: 0 }; 
        return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2, type: "star", color: c, size: Math.random() * 3 + 1, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1 };
      }
      if (effect === "glowing-orbs" || effect === "bokeh") { return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5, type: "circle", color: effect === "bokeh" ? ["#f472b6", "#fbbf24", "#60a5fa"][Math.floor(Math.random()*3)] : primary, filled: true, r: Math.random()*20+5, alpha: Math.random()*0.5, alphaDir: Math.random() > 0.5 ? 1 : -1 }; }
      if (effect.startsWith("hearts") || effect === "floating-kisses") {
        let e = "❤️"; if (effect === "hearts-pink") e = "💖"; if (effect === "hearts-white") e = "🤍"; if (effect === "floating-kisses") e = "💋";
        return { ...base, type: "text", emoji: e, size: Math.random()*18+10, vy: -(Math.random()*2+1), y: canvas.height+20 };
      }
      if (effect.startsWith("snow")) return { ...base, type: "circle", color: "#ffffff", filled: true, r: Math.random()*3+1, vy: effect==="snow-blizzard" ? Math.random()*4+2 : Math.random()*1.5+0.5, vx: effect==="snow-blizzard" ? Math.random()*3+1 : (Math.random()-0.5)*0.8 };
      if (effect === "sakura" || effect === "rose-petals") return { ...base, type: "text", emoji: effect==="sakura"?"🌸":"🌹", size: Math.random()*15+10, vy: Math.random()*2+1, rotV: Math.random()*5 };
      if (effect === "autumn-leaves") return { ...base, type: "text", emoji: "🍂", size: Math.random()*15+10, vy: Math.random()*2+1, rotV: Math.random()*5 };
      if (effect === "fireflies") return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, type: "circle", color: "#bef264", filled: true, r: Math.random()*2+1, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1, vy: (Math.random()-0.5)*1.5, vx: (Math.random()-0.5)*1.5 };
      if (effect === "butterflies") return { ...base, type: "text", emoji: "🦋", size: Math.random()*15+10, vy: -(Math.random()*2+1), vx: (Math.random()-0.5)*3, y: canvas.height+20 };
      if (effect === "rain") return { ...base, type: "rect", color: "#60a5fa", w: 1, h: Math.random()*15+10, vy: Math.random()*8+5, vx: 0 };
      if (effect.startsWith("glitter")) return { ...base, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, alpha: Math.random(), alphaDir: Math.random() > 0.5 ? 1 : -1, type: "star", color: effect==="glitter-gold" ? "#fbbf24" : ["#ffffff", "#fef08a", primary][Math.floor(Math.random()*3)], size: Math.random() * 3 + 1.5 };
      if (effect.startsWith("bubbles")) return { ...base, type: "circle", color: effect==="bubbles-color" ? ["#f472b6", "#60a5fa", "#fbbf24"][Math.floor(Math.random()*3)] : primary, filled: false, r: Math.random()*12+4, vx: (Math.random()-0.5)*1.5, vy: -(Math.random()*2+0.5), y: canvas.height+20 };
      if (effect === "floating-diamonds") return { ...base, type: "text", emoji: "💎", size: Math.random()*15+10, vy: -(Math.random()*2+1), y: canvas.height+20 };
      if (effect.startsWith("emojis") || effect === "streamers") {
        let list = ["🎉","🎊","🎈","✨","🌟","💖","🎂"];
        if (effect === "emojis-love") list = ["😍","🥰","😘","❤️","💕"];
        if (effect === "emojis-music") list = ["🎵","🎶","🎤","🎧","🎸"];
        if (effect === "streamers") list = ["🎊"];
        return { ...base, type: "text", emoji: list[Math.floor(Math.random()*list.length)], size: Math.random()*20+12 };
      }
      return null;
    };

    let frame = 0;
    const loop = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const maxParticles = effect.includes("blizzard") || effect.includes("rain") ? 150 : (effect.includes("glitter") || effect.includes("stars") || effect.includes("dust") ? 80 : 40);
      
      if (frame % (effect.includes("confetti") ? 3 : 6) === 0 && particlesRef.current.length < maxParticles) {
        const p = spawnParticle(); if (p) particlesRef.current.push(p);
      }
      
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + (p.rotV || 0); 
        if (p.alphaDir) {
          p.alpha += p.alphaDir * 0.02;
          if (p.alpha >= 1) { p.alpha = 1; p.alphaDir = -1; }
          if (p.alpha <= 0) { p.alpha = 0; p.alphaDir = 1; p.x = Math.random()*canvas.width; p.y = Math.random()*canvas.height; }
        } else {
          if (effect.startsWith("confetti")) p.life -= 0.005; else p.life -= p.decay;
          p.alpha = Math.max(0, Math.min(1, p.life));
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        if (p.type === "rect") { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot || 0) * Math.PI/180); ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore(); } 
        else if (p.type === "circle") { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); if (p.filled) { ctx.fillStyle = p.color; ctx.fill(); } else { ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.stroke(); } } 
        else if (p.type === "star") { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color; ctx.shadowBlur = 8; ctx.shadowColor = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore(); } 
        else if (p.type === "text") { ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot||0)*Math.PI/180); ctx.fillText(p.emoji, 0, 0); ctx.restore(); }
        
        ctx.globalAlpha = 1;
        if (p.alphaDir) return true; 
        if (p.vy < 0) return p.y > -50; 
        return p.y < canvas.height + 50 && p.x > -50 && p.x < canvas.width + 50; 
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); if(observer && canvasRef.current) observer.unobserve(canvasRef.current); particlesRef.current = []; };
  }, [effect, primary]);

  if (effect === "none") return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ opacity: 0.85 }} />;
};
