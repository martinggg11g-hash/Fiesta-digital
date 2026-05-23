export const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

export const DEF_CONFIG = {
  theme: "default",
  primary: "#8b5cf6",
  bg1: "#f8f7ff",
  bg2: "#e0dcfc",
  text: "#1e1b4b",
  muted: "#6b7280",
  card: "#ffffff",
  fontBody: "Montserrat",
  fontTitle: "Playfair Display",
  
  date: "2026-12-15",
  time: "21:00 a 05:00 hs",
  
  coverPhoto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  eventTypeEmoji: "✨",
  eventType: "Mis Dulces 15",
  honoreeName: "Valentina",
  showBadge: true,
  badgeEmoji: "👑",
  badgeText: "La gran noche",
  badgeBgColor: "rgba(0,0,0,0.5)",
  
  showCountdown: true,
  showBanner: false,
  bannerOffsetX: 50,
  bannerOffsetY: 50,
  showDate: true,
  showTime: true,
  showLocation: true,
  showParking: true,
  showVenueLogo: true,
  showVideo: false,
  showMusic: true,
  showItinerary: true,
  showMenu: true,
  showDressCode: true,
  showGifts: true,
  showGallery: true,
  
  parkingType: "Estacionamiento privado cubierto",
  venueLinkType: "web",
  venueLink: "https://defiesta.lat",
  spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  
  showInstagram: false,
  instagramUrl: "",
  showFacebook: false,
  facebookUrl: "",
  showTiktok: false,
  tiktokUrl: "",

  showRsvpDeadline: false,
  rsvpDeadline: "",
  isPrivateList: false,
  clientPin: "", 

  effectOpacity: 100,
  animationDuration: 3,

  showCoverBorders: false,
  selectedBorder: "/borders/1-Photoroom.png", 
  borderPosition: "both",
  borderColor: "#8b5cf6",
  ornamentSize: 150,
  borderRotationTop: 0,
  borderRotationBottom: 0,
};

export const THEMES = [
  {
    id: "t1", name: "Rose Gold",
    primary: "#e8829a", bg1: "#fdf0f3", bg2: "linear-gradient(145deg, #fff5f7 0%, #fce4ea 25%, #f5c6d3 55%, #eea8bc 80%, #e690a8 100%)",
    text: "#3d1e27", card: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(252,228,234,0.75) 100%)", muted: "#9b5f6e",
    shadow: "0 8px 32px rgba(217,119,147,0.22), 0 2px 8px rgba(217,119,147,0.14)", border: "rgba(232,130,154,0.25)", accent: "#f0a0b8", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t2", name: "Galaxia (Dark)",
    primary: "#b97ef8", bg1: "#07051a", bg2: "linear-gradient(145deg, #07051a 0%, #110d35 20%, #1e1550 40%, #2d1f6e 60%, #1a1040 80%, #0d0924 100%)",
    text: "#ede9ff", card: "linear-gradient(160deg, rgba(35,28,75,0.72) 0%, rgba(55,40,110,0.55) 100%)", muted: "#a78bfa",
    shadow: "0 8px 40px rgba(139,92,246,0.35), 0 2px 12px rgba(80,50,180,0.25)", border: "rgba(168,85,247,0.3)", accent: "#7c3aed", shine: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t3", name: "Esmeralda",
    primary: "#0fba7e", bg1: "#eafdf5", bg2: "linear-gradient(145deg, #f0fefa 0%, #d6fbee 20%, #a7f3d8 45%, #6ee7be 70%, #34d399 90%, #10b981 100%)",
    text: "#053729", card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(209,250,229,0.78) 100%)", muted: "#047857",
    shadow: "0 8px 36px rgba(16,185,129,0.22), 0 2px 10px rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.22)", accent: "#34d399", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t4", name: "Océano",
    primary: "#0ea5e9", bg1: "#eaf8ff", bg2: "linear-gradient(145deg, #f0fbff 0%, #cceeff 22%, #99ddfa 45%, #5bc8f5 68%, #1faee3 88%, #0ea5e9 100%)",
    text: "#082f49", card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(186,230,253,0.75) 100%)", muted: "#0284c7",
    shadow: "0 8px 36px rgba(14,165,233,0.24), 0 2px 10px rgba(14,165,233,0.14)", border: "rgba(14,165,233,0.22)", accent: "#38bdf8", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t5", name: "Atardecer",
    primary: "#f43f5e", bg1: "#fff0f1", bg2: "linear-gradient(145deg, #fff5f5 0%, #ffe0e3 18%, #fdb8be 38%, #fc8594 58%, #f95d74 78%, #f43f5e 100%)",
    text: "#6d0e1f", card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(254,205,211,0.75) 100%)", muted: "#be123c",
    shadow: "0 8px 36px rgba(244,63,94,0.24), 0 2px 10px rgba(244,63,94,0.14)", border: "rgba(244,63,94,0.22)", accent: "#fb7185", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t6", name: "Terciopelo (Dark)",
    primary: "#9d6ef8", bg1: "#160d38", bg2: "linear-gradient(145deg, #160d38 0%, #200f50 18%, #32146a 36%, #48178e 55%, #2e1060 75%, #1a0b40 100%)",
    text: "#f0ebff", card: "linear-gradient(160deg, rgba(50,20,106,0.7) 0%, rgba(72,23,142,0.5) 100%)", muted: "#c084fc",
    shadow: "0 8px 40px rgba(139,92,246,0.38), 0 2px 14px rgba(109,40,217,0.28)", border: "rgba(192,132,252,0.28)", accent: "#a855f7", shine: "linear-gradient(135deg, rgba(196,181,253,0.2) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t7", name: "Champagne",
    primary: "#c9a227", bg1: "#fefcf7", bg2: "linear-gradient(145deg, #fffef9 0%, #fdf6e3 22%, #f7e9c0 45%, #f0d896 68%, #e8c96e 88%, #d4af37 100%)",
    text: "#2e2208", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(243,234,211,0.78) 100%)", muted: "#8c6d1f",
    shadow: "0 8px 36px rgba(212,175,55,0.28), 0 2px 10px rgba(212,175,55,0.16)", border: "rgba(212,175,55,0.28)", accent: "#e8c96e", shine: "linear-gradient(135deg, rgba(255,248,200,0.55) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t8", name: "Cyberpunk (Dark)",
    primary: "#f72585", bg1: "#050507", bg2: "linear-gradient(145deg, #050507 0%, #0d0d12 20%, #161220 40%, #0f0a1a 60%, #050510 80%, #000000 100%)",
    text: "#fff0fa", card: "linear-gradient(160deg, rgba(20,10,30,0.8) 0%, rgba(40,10,40,0.65) 100%)", muted: "#f472b6",
    shadow: "0 0 30px rgba(247,37,133,0.5), 0 0 8px rgba(247,37,133,0.4), 0 2px 10px rgba(0,0,0,0.6)", border: "rgba(247,37,133,0.4)", accent: "#7b2fff", shine: "linear-gradient(135deg, rgba(247,37,133,0.2) 0%, rgba(123,47,255,0.1) 50%, rgba(255,255,255,0) 100%)",
  },
  {
    id: "t9", name: "Durazno Suave",
    primary: "#f97316", bg1: "#fff8f0", bg2: "linear-gradient(145deg, #fffaf5 0%, #ffe8cc 20%, #ffd0a0 40%, #ffb874 62%, #ffa050 82%, #f97316 100%)",
    text: "#341005", card: "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, rgba(254,215,170,0.76) 100%)", muted: "#9a3412",
    shadow: "0 8px 36px rgba(249,115,22,0.24), 0 2px 10px rgba(249,115,22,0.14)", border: "rgba(249,115,22,0.22)", accent: "#fb923c", shine: "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t10", name: "Plata Glacial",
    primary: "#5b7fa6", bg1: "#f4f8fc", bg2: "linear-gradient(145deg, #f8fbff 0%, #edf2f9 22%, #dde6f2 45%, #ccd8ea 68%, #b8c9e0 88%, #a4bad6 100%)",
    text: "#0c1c2e", card: "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(220,232,248,0.72) 100%)", muted: "#4a6480",
    shadow: "0 8px 36px rgba(91,127,166,0.18), 0 2px 10px rgba(91,127,166,0.10)", border: "rgba(100,116,139,0.18)", accent: "#93b4d4", shine: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t11", name: "Rubí Pasión",
    primary: "#e11d48", bg1: "#fff0f2", bg2: "linear-gradient(145deg, #fff5f6 0%, #ffd6dc 20%, #ffaab7 40%, #ff7591 62%, #f04468 82%, #e11d48 100%)",
    text: "#3a000e", card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(253,164,175,0.7) 100%)", muted: "#9f1239",
    shadow: "0 8px 36px rgba(225,29,72,0.28), 0 2px 10px rgba(225,29,72,0.16)", border: "rgba(225,29,72,0.24)", accent: "#fb4f6e", shine: "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t12", name: "Black & Gold",
    primary: "#f5c518", bg1: "#0a0800", bg2: "linear-gradient(145deg, #0a0800 0%, #14100a 18%, #1e1806 35%, #120f00 55%, #0c0900 75%, #000000 100%)",
    text: "#fef9e7", card: "linear-gradient(160deg, rgba(30,24,6,0.85) 0%, rgba(50,38,8,0.65) 100%)", muted: "#d4a017",
    shadow: "0 0 28px rgba(245,197,24,0.36), 0 0 8px rgba(245,197,24,0.28), 0 2px 12px rgba(0,0,0,0.7)", border: "rgba(245,197,24,0.3)", accent: "#fde68a", shine: "linear-gradient(135deg, rgba(245,197,24,0.22) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t13", name: "Ivory & Gold (Boda)",
    primary: "#d4af37", bg1: "#ffffff", bg2: "linear-gradient(145deg, #ffffff 0%, #fefcf9 30%, #f8f1df 70%, #eadcae 100%)",
    text: "#3e3214", card: "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 100%)", muted: "#967f40",
    shadow: "0 10px 40px rgba(212,175,55,0.15), 0 2px 8px rgba(0,0,0,0.02)", border: "rgba(212,175,55,0.25)", accent: "#e3cc7c", shine: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t14", name: "Perla Rosa (Boda)",
    primary: "#d48b9c", bg1: "#ffffff", bg2: "linear-gradient(145deg, #ffffff 0%, #fffbfc 30%, #fbeff2 70%, #f0ced6 100%)",
    text: "#4a2a32", card: "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 100%)", muted: "#ab6879",
    shadow: "0 10px 40px rgba(212,139,156,0.15), 0 2px 8px rgba(0,0,0,0.02)", border: "rgba(212,139,156,0.25)", accent: "#e2afbd", shine: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t15", name: "Superhéroe (Rojo/Azul)",
    primary: "#dc2626", bg1: "#eff6ff", bg2: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 85%, #60a5fa 100%)",
    text: "#1e3a8a", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(219,234,254,0.8) 100%)", muted: "#2563eb",
    shadow: "0 8px 36px rgba(220,38,38,0.2), 0 2px 10px rgba(37,99,235,0.15)", border: "rgba(220,38,38,0.3)", accent: "#ef4444", shine: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t16", name: "Gamer Neón (Dark)",
    primary: "#22c55e", bg1: "#020617", bg2: "linear-gradient(145deg, #020617 0%, #0f172a 30%, #1e293b 70%, #0f172a 100%)",
    text: "#f8fafc", card: "linear-gradient(160deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.6) 100%)", muted: "#4ade80",
    shadow: "0 0 25px rgba(34,197,94,0.3), 0 2px 10px rgba(0,0,0,0.8)", border: "rgba(34,197,94,0.4)", accent: "#10b981", shine: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t17", name: "Aventura Jurásica",
    primary: "#65a30d", bg1: "#fdf8ea", bg2: "linear-gradient(145deg, #fdf8ea 0%, #fef08a 30%, #d9f99d 70%, #a3e635 100%)",
    text: "#3f6212", card: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(217,249,157,0.75) 100%)", muted: "#4d7c0f",
    shadow: "0 8px 32px rgba(101,163,13,0.2), 0 2px 8px rgba(101,163,13,0.1)", border: "rgba(101,163,13,0.3)", accent: "#84cc16", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t18", name: "Misión Espacial (Dark)",
    primary: "#6366f1", bg1: "#030712", bg2: "linear-gradient(145deg, #030712 0%, #0f172a 30%, #1e1b4b 60%, #312e81 100%)",
    text: "#e0e7ff", card: "linear-gradient(160deg, rgba(30,27,75,0.8) 0%, rgba(15,23,42,0.6) 100%)", muted: "#818cf8",
    shadow: "0 0 35px rgba(99,102,241,0.25), 0 2px 10px rgba(0,0,0,0.8)", border: "rgba(99,102,241,0.3)", accent: "#8b5cf6", shine: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t19", name: "Piratas / Tesoro",
    primary: "#b45309", bg1: "#fffbeb", bg2: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 30%, #fde68a 60%, #fcd34d 100%)",
    text: "#78350f", card: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(253,230,138,0.7) 100%)", muted: "#d97706",
    shadow: "0 8px 32px rgba(180,83,9,0.2), 0 2px 10px rgba(180,83,9,0.1)", border: "rgba(180,83,9,0.3)", accent: "#d97706", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t20", name: "Construcción",
    primary: "#ca8a04", bg1: "#f8fafc", bg2: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 70%, #cbd5e1 100%)",
    text: "#1e293b", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.8) 100%)", muted: "#eab308",
    shadow: "0 8px 32px rgba(202,138,4,0.2), 0 2px 10px rgba(15,23,42,0.1)", border: "rgba(202,138,4,0.4)", accent: "#eab308", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t21", name: "Fútbol / Campeón",
    primary: "#16a34a", bg1: "#f0fdf4", bg2: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #86efac 100%)",
    text: "#14532d", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(220,252,231,0.8) 100%)", muted: "#22c55e",
    shadow: "0 8px 32px rgba(22,163,74,0.2), 0 2px 10px rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.3)", accent: "#4ade80", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t22", name: "Océano Profundo",
    primary: "#0284c7", bg1: "#f0f9ff", bg2: "linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 70%, #7dd3fc 100%)",
    text: "#0c4a6e", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(186,230,253,0.8) 100%)", muted: "#0369a1",
    shadow: "0 8px 32px rgba(2,132,199,0.2), 0 2px 10px rgba(2,132,199,0.1)", border: "rgba(2,132,199,0.3)", accent: "#38bdf8", shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t23", name: "Princesa Mágica",
    primary: "#c084fc", bg1: "#faf5ff", bg2: "linear-gradient(145deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #d8b4fe 100%)",
    text: "#4c1d95", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(233,213,255,0.8) 100%)", muted: "#9333ea",
    shadow: "0 8px 32px rgba(192,132,252,0.25), 0 2px 10px rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.3)", accent: "#d8b4fe", shine: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t24", name: "Sirena Encantada",
    primary: "#2dd4bf", bg1: "#f0fdfa", bg2: "linear-gradient(145deg, #f0fdfa 0%, #ccfbf1 30%, #99f6e4 70%, #5eead4 100%)",
    text: "#134e4a", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(153,246,228,0.7) 100%)", muted: "#14b8a6",
    shadow: "0 8px 32px rgba(45,212,191,0.25), 0 2px 10px rgba(45,212,191,0.15)", border: "rgba(45,212,191,0.3)", accent: "#5eead4", shine: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t25", name: "Unicornio Pastel",
    primary: "#f472b6", bg1: "#fdf2f8", bg2: "linear-gradient(145deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 70%, #f9a8d4 100%)",
    text: "#831843", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(251,207,232,0.8) 100%)", muted: "#db2777",
    shadow: "0 8px 32px rgba(244,114,182,0.25), 0 2px 10px rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.3)", accent: "#f9a8d4", shine: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t26", name: "Bosque de Hadas",
    primary: "#a3e635", bg1: "#fcffe6", bg2: "linear-gradient(145deg, #f7fee7 0%, #ecfccb 30%, #d9f99d 70%, #bef264 100%)",
    text: "#3f6212", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(217,249,157,0.7) 100%)", muted: "#65a30d",
    shadow: "0 8px 32px rgba(163,230,53,0.25), 0 2px 10px rgba(163,230,53,0.15)", border: "rgba(163,230,53,0.3)", accent: "#bef264", shine: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t27", name: "Plata Elegante (Dark)",
    primary: "#94a3b8", bg1: "#0f172a", bg2: "linear-gradient(145deg, #020617 0%, #0f172a 40%, #1e293b 80%, #334155 100%)",
    text: "#f8fafc", card: "linear-gradient(160deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.7) 100%)", muted: "#cbd5e1",
    shadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(255,255,255,0.05)", border: "rgba(148,163,184,0.3)", accent: "#cbd5e1", shine: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t28", name: "Verde Oliva & Oro",
    primary: "#d4af37", bg1: "#1f2924", bg2: "linear-gradient(145deg, #0d1410 0%, #17241d 40%, #2a3b30 80%, #3d5244 100%)",
    text: "#fefcf5", card: "linear-gradient(160deg, rgba(42,59,48,0.85) 0%, rgba(23,36,29,0.7) 100%)", muted: "#e3cc7c",
    shadow: "0 10px 40px rgba(0,0,0,0.4), 0 2px 10px rgba(212,175,55,0.15)", border: "rgba(212,175,55,0.3)", accent: "#e8c96e", shine: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t29", name: "Marsala Glamour",
    primary: "#e11d48", bg1: "#2a0a12", bg2: "linear-gradient(145deg, #1a050a 0%, #2d0b13 40%, #4a1321 80%, #701c34 100%)",
    text: "#fff1f2", card: "linear-gradient(160deg, rgba(74,19,33,0.85) 0%, rgba(45,11,19,0.7) 100%)", muted: "#fda4af",
    shadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(225,29,72,0.2)", border: "rgba(225,29,72,0.3)", accent: "#fb7185", shine: "linear-gradient(135deg, rgba(251,113,133,0.15) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t30", name: "Azul Noche Premium",
    primary: "#fbbf24", bg1: "#0b162c", bg2: "linear-gradient(145deg, #060d1a 0%, #0c1a36 40%, #162b59 80%, #204085 100%)",
    text: "#fdf8ea", card: "linear-gradient(160deg, rgba(22,43,89,0.85) 0%, rgba(12,26,54,0.7) 100%)", muted: "#fde047",
    shadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(251,191,36,0.2)", border: "rgba(251,191,36,0.3)", accent: "#fcd34d", shine: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t31", name: "Terracota Chic",
    primary: "#c05621", bg1: "#fff8f6", bg2: "linear-gradient(145deg, #fff3ec 0%, #feebd1 40%, #fcd4a6 80%, #fbd1a0 100%)",
    text: "#431407", card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(252,212,166,0.8) 100%)", muted: "#9a3412",
    shadow: "0 10px 40px rgba(192,86,33,0.15), 0 2px 10px rgba(192,86,33,0.1)", border: "rgba(192,86,33,0.25)", accent: "#ed8936", shine: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "negro-blanco",
    name: "Negro y Blanco (Elegante)",
    primary: "#ffffff",           
    bg1: "#000000",               
    bg2: "#18181b",               
    text: "#ffffff",              
    muted: "#a1a1aa",             
    card: "#27272a"               
  },
  {
    id: "blanco-negro",
    name: "Blanco y Negro (Minimalista)",
    primary: "#000000",           
    bg1: "#ffffff",               
    bg2: "#f4f4f5",               
    text: "#000000",              
    muted: "#71717a",             
    card: "#ffffff"               
  },
  {
    id: "negro-violeta",
    name: "Negro y Violeta (Cyber)",
    primary: "#a78bfa",           
    bg1: "#0b061f",               
    bg2: "#1e0b36",               
    text: "#ffffff",              
    muted: "#c084fc",             
    card: "#25143a"               
  },
  {
    id: "rosa-negro",
    name: "Rosa y Negro (Glam)",
    primary: "#f472b6",           
    bg1: "#000000",               
    bg2: "#1c0512",               
    text: "#ffffff",              
    muted: "#f9a8d4",             
    card: "#2d0b1e"               
  }
];

export const FONTS = [
  { label: "Instrument Serif", value: "Instrument Serif" },
  { label: "Strichpunkt Sans", value: "Strichpunkt Sans" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Noto Sans", value: "Noto Sans" },
  { label: "Playwrite MX", value: "Playwrite MX" },
  { label: "PT Sans", value: "PT Sans" },
  { label: "Bebas Neue", value: "Bebas Neue" },
  { label: "Bricolage Grotesque", value: "Bricolage Grotesque" },
  { label: "Lora", value: "Lora" },
  { label: "Saira", value: "Saira" },
  { label: "Barlow", value: "Barlow" },
  { label: "Fira Sans", value: "Fira Sans" },
  { label: "Smooch Sans", value: "Smooch Sans" },
  { label: "Fjalla One", value: "Fjalla One" },
  { label: "Playwrite GB S", value: "Playwrite GB S" },
  { label: "Changa One", value: "Changa One" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Lobster Two", value: "Lobster Two" },
  { label: "Pacifico", value: "Pacifico" },
  { label: "Bungee", value: "Bungee" },
  { label: "Lilita One", value: "Lilita One" },
  { label: "Diplomata", value: "Diplomata" },
  { label: "Caveat", value: "Caveat" },
  { label: "Bodoni Moda", value: "Bodoni Moda" },
  { label: "Indie Flower", value: "Indie Flower" },
  { label: "Gravitas One", value: "Gravitas One" },
  { label: "Goldman", value: "Goldman" },
  { label: "Supermercado One", value: "Supermercado One" },
  { label: "Zen Dots", value: "Zen Dots" },
  { label: "Great Vibes", value: "Great Vibes" },
  { label: "Satisfy", value: "Satisfy" },
  { label: "Saira Stencil One", value: "Saira Stencil One" },
  { label: "Press Start 2P", value: "Press Start 2P" },
  { label: "Advent Pro", value: "Advent Pro" },
  { label: "Creepster", value: "Creepster" },
  { label: "VT323", value: "VT323" },
  { label: "Berkshire Swash", value: "Berkshire Swash" },
  { label: "Rock Salt", value: "Rock Salt" },
  { label: "Kaushan Script", value: "Kaushan Script" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Cinzel", value: "Cinzel" }
];

export const FONT_CATEGORIES = {
  "Elegantes": ["Playfair Display", "Bodoni Moda", "Lora", "Instrument Serif", "Cinzel", "Diplomata"],
  "Modernas": ["Montserrat", "Noto Sans", "PT Sans", "Bricolage Grotesque", "Saira", "Barlow", "Fira Sans", "Advent Pro", "Smooch Sans", "Strichpunkt Sans"],
  "Cursivas": ["Dancing Script", "Great Vibes", "Pacifico", "Caveat", "Satisfy", "Indie Flower", "Berkshire Swash", "Rock Salt", "Kaushan Script", "Playwrite MX", "Playwrite GB S"],
  "Impacto": ["Bebas Neue", "Fjalla One", "Changa One", "Bungee", "Lilita One", "Gravitas One", "Saira Stencil One", "Goldman", "Supermercado One", "Lobster Two"],
  "Retro & Gamer": ["Press Start 2P", "VT323", "Creepster", "Roboto Mono", "Zen Dots"]
};

export const ICON_CATEGORIES = {
  "Generales": ["icon-heart", "icon-crown", "icon-star", "icon-sparkles", "icon-gift", "icon-camera", "icon-church", "icon-rings", "icon-map-pin", "icon-calendar", "icon-clock"],
  "Comida": ["icon-beef", "icon-fish", "icon-ham", "icon-sandwich", "icon-pizza", "icon-burger", "icon-taco"],
  "Dulces y Bebidas": ["icon-cake", "icon-cake-slice", "icon-ice-cream-bowl", "icon-wine", "icon-cocktail", "icon-coffee", "icon-cup-soda"],
  "Fiesta": ["icon-music", "icon-disco", "icon-speaker", "icon-mic", "icon-balloon", "icon-confetti"],
  "Ropa y Pases": ["icon-dress", "icon-suit", "icon-tie", "icon-hanger", "icon-ticket", "icon-vip", "icon-chef-hat"]
};

export const EMOJI_CATEGORIES = {
  "Magia": ["✨","👑","🎈","🎉","🎊","🥳","🎁","💝","🪄","🎇","🎆"],
  "Bodas": ["💍","💒","👰","🤵","👼","❤️","💖","💕","💌","🥂"],
  "Bebidas": ["🍾","🥂","🍷","🍸","🍹","🍺","🍻","☕","🧋"],
  "Dulces": ["🎂","🍰","🧁","🍦","🍨","🍧","🍩","🍪","🍫","🍬","🍭"],
  "Salados": ["🍕","🍔","🍟","🌭","🍿","🌮","🌯","🥗","🥪","🥘","🧆","🍲","🥣","🍗","🍖","🥩","🍤","🍣","🥓","🧀"],
  "Ropa": ["👔","👘","🥻","🩱","👖","🧥","🦺","👕","🩲","👠","👡","👢","👞","👟","🥾","🧦","🧤","🧣","🎩","🧢","👒"]
};

export const PARTICLE_CATEGORIES = {
  "Clásicos": [
    { id: "none", name: "Ninguno", icon: "🚫" },
    { id: "confetti-multi", name: "Confeti Multicolor", icon: "🎉" },
    { id: "confetti-gold", name: "Confeti Dorado", icon: "✨" },
    { id: "confetti-silver", name: "Confeti Plateado", icon: "💿" },
    { id: "balloons", name: "Globos Subiendo", icon: "🎈" },
  ],
  "Estrellas y Magia": [
    { id: "meteor-shower", name: "Lluvia de Estrellas", icon: "🌠" },
    { id: "stars-gold", name: "Estrellas Doradas", icon: "⭐" },
    { id: "stars-silver", name: "Estrellas Plateadas", icon: "✨" },
    { id: "galaxy-dust", name: "Polvo Galáctico", icon: "🌌" },
    { id: "fairy-dust", name: "Polvo de Hadas", icon: "🧚" },
    { id: "glowing-orbs", name: "Orbes Luminosos", icon: "🔮" }
  ],
  "Romance": [
    { id: "hearts-red", name: "Corazones Rojos", icon: "❤️" },
    { id: "hearts-pink", name: "Corazones Rosas", icon: "💖" },
    { id: "hearts-white", name: "Corazones Blancos", icon: "🤍" },
    { id: "rose-petals", name: "Pétalos de Rosa", icon: "🌹" },
    { id: "floating-kisses", name: "Besos", icon: "💋" }
  ],
  "Naturaleza": [
    { id: "snowflakes", name: "Nevada Suave", icon: "❄️" },
    { id: "snow-blizzard", name: "Tormenta de Nieve", icon: "🌨️" },
    { id: "sakura", name: "Pétalos de Cerezo", icon: "🌸" },
    { id: "autumn-leaves", name: "Hojas de Otoño", icon: "🍂" },
    { id: "fireflies", name: "Luciérnagas", icon: "✨" },
    { id: "butterflies", name: "Mariposas Flotantes", icon: "🦋" },
    { id: "rain", name: "Lluvia Ligera", icon: "🌧️" }
  ],
  "Luces y Formas": [
    { id: "bokeh", name: "Luces Bokeh", icon: "💡" },
    { id: "bubbles", name: "Burbujas Suaves", icon: "🫧" },
    { id: "geometric", name: "Formas Geométricas", icon: "🔺" },
    { id: "music-notes", name: "Notas Musicales", icon: "🎵" }
  ]
};

export const TRANSITION_OPTS = [
  { value: "slide-up", label: "Deslizar Arriba" },
  { value: "fade", label: "Desvanecer" },
  { value: "zoom", label: "Zoom In" },
  { value: "flip", label: "Giro 3D" },
  { value: "bounce", label: "Rebote" },
  { value: "slide-left", label: "Deslizar Izquierda" },
  { value: "slide-right", label: "Deslizar Derecha" }
];

export const ANIMATION_CATEGORIES = {
  "Sutiles": ["fade", "zoom"],
  "Deslizamientos": ["slide-up", "slide-left", "slide-right"],
  "Divertidas": ["bounce", "flip"]
};

export const BORDERS = [
  { id: 'b1', name: 'Love', url: '/borders/1-Photoroom.png' },
  { id: 'b2', name: 'Único', url: '/borders/2-Photoroom.png' },
  { id: 'b3', name: 'Cyrax', url: '/borders/3-Photoroom.png' },
  { id: 'b4', name: 'Destellos', url: '/borders/4-Photoroom.png' },
  { id: 'b6', name: 'Elegancia', url: '/borders/6-Photoroom.png' },
  { id: 'b7', name: 'Vintage', url: '/borders/7-Photoroom.png' },
  { id: 'b8', name: 'Minimal', url: '/borders/8-Photoroom.png' },
  { id: 'b9', name: 'Clásico', url: '/borders/9-Photoroom.png' },
  { id: 'b10', name: 'Romántico', url: '/borders/10-Photoroom.png' },
  { id: 'b11', name: 'Oro', url: '/borders/11-Photoroom.png' },
  { id: 'b12', name: 'Art Deco', url: '/borders/12-Photoroom.png' },
  { id: 'b13', name: 'Floral', url: '/borders/13-Photoroom.png' },
  { id: 'b14', name: 'Estrellas', url: '/borders/14-Photoroom.png' },
  { id: 'b15', name: 'Neon', url: '/borders/15-Photoroom.png' },
  { id: 'b16', name: 'Líneas', url: '/borders/16-Photoroom.png' }
];
