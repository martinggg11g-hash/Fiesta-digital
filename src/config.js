// src/config.js

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
  
  dateText: "2026-12-15",
  timeText: "21:00 a 05:00 hs",
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

  // NUEVAS VARIABLES RSVP VIP Y ACCESOS
  showRsvpDeadline: false,
  rsvpDeadline: "",
  isPrivateList: false,
  clientPin: "", 

  // CONFIGURACIÓN DE EFECTOS
  effectOpacity: 100,

  // CONFIGURACIÓN DE BORDES (CORREGIDO PARA VISIBILIDAD INICIAL)
  showCoverBorders: false,
  selectedBorder: "/borders/1-Photoroom.png", // Ya dejamos uno cargado por defecto
  borderPosition: "both",
  borderColor: "#8b5cf6",
  ornamentSize: 150,
  borderRotationTop: 0,
  borderRotationBottom: 0,
};

export const THEMES = [
  {
    id: "t1",
    name: "Rose Gold Luxe",
    primary: "#e58aa8",
    secondary: "#f7c6d5",
    accent: "#fff1f5",
    bg1: "#fff8fa",
    bg2: "radial-gradient(circle at top left, #ffe4ec 0%, #f8d6df 35%, #f2c2d0 65%, #e6a8bc 100%)",
    glass: "rgba(255,255,255,0.55)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,245,248,0.72))",
    border: "rgba(255,255,255,0.45)",
    text: "#4b2330",
    muted: "#8f5d6d",
    shadow: "0 25px 50px rgba(229,138,168,0.25)",
    glow: "0 0 40px rgba(229,138,168,0.35)",
  },

  {
    id: "t2",
    name: "Galaxia Prime",
    primary: "#9d4edd",
    secondary: "#5a189a",
    accent: "#c77dff",
    bg1: "#090611",
    bg2: "radial-gradient(circle at top, #3c096c 0%, #240046 35%, #10002b 65%, #030014 100%)",
    glass: "rgba(32,22,58,0.55)",
    card: "linear-gradient(145deg, rgba(34,24,60,0.85), rgba(17,12,33,0.65))",
    border: "rgba(199,125,255,0.18)",
    text: "#faf5ff",
    muted: "#d8b4fe",
    shadow: "0 25px 60px rgba(157,78,221,0.35)",
    glow: "0 0 55px rgba(199,125,255,0.45)",
  },

  {
    id: "t3",
    name: "Emerald Forest",
    primary: "#10b981",
    secondary: "#065f46",
    accent: "#6ee7b7",
    bg1: "#ecfdf5",
    bg2: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #86efac 70%, #34d399 100%)",
    glass: "rgba(255,255,255,0.48)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(220,252,231,0.7))",
    border: "rgba(16,185,129,0.18)",
    text: "#042f2e",
    muted: "#047857",
    shadow: "0 25px 55px rgba(16,185,129,0.22)",
    glow: "0 0 40px rgba(16,185,129,0.28)",
  },

  {
    id: "t4",
    name: "Ocean Depths",
    primary: "#0ea5e9",
    secondary: "#0369a1",
    accent: "#7dd3fc",
    bg1: "#eff9ff",
    bg2: "radial-gradient(circle at top right, #dbeafe 0%, #bae6fd 35%, #38bdf8 70%, #0f172a 100%)",
    glass: "rgba(255,255,255,0.5)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(224,242,254,0.65))",
    border: "rgba(14,165,233,0.18)",
    text: "#082f49",
    muted: "#0369a1",
    shadow: "0 25px 60px rgba(14,165,233,0.25)",
    glow: "0 0 50px rgba(56,189,248,0.3)",
  },

  {
    id: "t5",
    name: "Neon Sunset",
    primary: "#ff4d6d",
    secondary: "#fb7185",
    accent: "#fecdd3",
    bg1: "#fff1f2",
    bg2: "linear-gradient(135deg, #ffedd5 0%, #fecdd3 30%, #fb7185 65%, #7f1d1d 100%)",
    glass: "rgba(255,255,255,0.42)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,228,230,0.7))",
    border: "rgba(255,255,255,0.28)",
    text: "#4c0519",
    muted: "#be123c",
    shadow: "0 25px 60px rgba(255,77,109,0.28)",
    glow: "0 0 45px rgba(251,113,133,0.38)",
  },

  {
    id: "t6",
    name: "Velvet Nebula",
    primary: "#8b5cf6",
    secondary: "#4c1d95",
    accent: "#c4b5fd",
    bg1: "#140c2e",
    bg2: "radial-gradient(circle at top left, #4c1d95 0%, #312e81 35%, #1e1b4b 70%, #09090b 100%)",
    glass: "rgba(49,46,129,0.38)",
    card: "linear-gradient(145deg, rgba(55,48,163,0.55), rgba(17,24,39,0.62))",
    border: "rgba(196,181,253,0.18)",
    text: "#f5f3ff",
    muted: "#ddd6fe",
    shadow: "0 25px 65px rgba(139,92,246,0.35)",
    glow: "0 0 50px rgba(167,139,250,0.4)",
  },

  {
    id: "t7",
    name: "Imperial Champagne",
    primary: "#eab308",
    secondary: "#ca8a04",
    accent: "#fde68a",
    bg1: "#fffbeb",
    bg2: "linear-gradient(135deg, #fffdf5 0%, #fef3c7 35%, #facc15 70%, #78350f 100%)",
    glass: "rgba(255,255,255,0.55)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(254,249,195,0.72))",
    border: "rgba(234,179,8,0.2)",
    text: "#422006",
    muted: "#92400e",
    shadow: "0 25px 55px rgba(234,179,8,0.28)",
    glow: "0 0 45px rgba(250,204,21,0.38)",
  },

  {
    id: "t8",
    name: "Cyberpunk X",
    primary: "#ff2ea6",
    secondary: "#7c3aed",
    accent: "#22d3ee",
    bg1: "#050505",
    bg2: "linear-gradient(135deg, #050505 0%, #111827 30%, #3b0764 65%, #ff0080 100%)",
    glass: "rgba(24,24,27,0.45)",
    card: "linear-gradient(145deg, rgba(39,39,42,0.7), rgba(17,24,39,0.6))",
    border: "rgba(255,46,166,0.25)",
    text: "#fdf4ff",
    muted: "#f0abfc",
    shadow: "0 30px 70px rgba(255,46,166,0.32)",
    glow: "0 0 60px rgba(34,211,238,0.35)",
  },

  {
    id: "t9",
    name: "Peach Aurora",
    primary: "#fb923c",
    secondary: "#ea580c",
    accent: "#fdba74",
    bg1: "#fff7ed",
    bg2: "radial-gradient(circle at top right, #ffedd5 0%, #fdba74 40%, #fb923c 70%, #7c2d12 100%)",
    glass: "rgba(255,255,255,0.5)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,237,213,0.7))",
    border: "rgba(251,146,60,0.2)",
    text: "#431407",
    muted: "#9a3412",
    shadow: "0 25px 60px rgba(251,146,60,0.28)",
    glow: "0 0 45px rgba(253,186,116,0.32)",
  },

  {
    id: "t10",
    name: "Glacial Silver",
    primary: "#94a3b8",
    secondary: "#475569",
    accent: "#e2e8f0",
    bg1: "#f8fafc",
    bg2: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #cbd5e1 70%, #94a3b8 100%)",
    glass: "rgba(255,255,255,0.58)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.72))",
    border: "rgba(148,163,184,0.18)",
    text: "#0f172a",
    muted: "#475569",
    shadow: "0 25px 55px rgba(100,116,139,0.22)",
    glow: "0 0 40px rgba(203,213,225,0.45)",
  },

  {
    id: "t11",
    name: "Ruby Inferno",
    primary: "#f43f5e",
    secondary: "#9f1239",
    accent: "#fda4af",
    bg1: "#fff1f2",
    bg2: "radial-gradient(circle at center, #ffe4e6 0%, #fb7185 40%, #be123c 70%, #3f0013 100%)",
    glass: "rgba(255,255,255,0.42)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,228,230,0.68))",
    border: "rgba(244,63,94,0.22)",
    text: "#4c0519",
    muted: "#9f1239",
    shadow: "0 25px 65px rgba(244,63,94,0.32)",
    glow: "0 0 50px rgba(251,113,133,0.4)",
  },

  {
    id: "t12",
    name: "Black Gold Elite",
    primary: "#fbbf24",
    secondary: "#78350f",
    accent: "#fde68a",
    bg1: "#000000",
    bg2: "linear-gradient(135deg, #000000 0%, #111111 35%, #2b1d00 70%, #fbbf24 120%)",
    glass: "rgba(24,24,27,0.55)",
    card: "linear-gradient(145deg, rgba(39,39,42,0.82), rgba(10,10,10,0.72))",
    border: "rgba(251,191,36,0.22)",
    text: "#fef3c7",
    muted: "#fcd34d",
    shadow: "0 30px 70px rgba(251,191,36,0.28)",
    glow: "0 0 55px rgba(251,191,36,0.42)",
  },
];

export const FONTS = [
  { label: "Playfair Display", value: "Playfair Display" }, { label: "Bodoni Moda", value: "Bodoni Moda" },
  { label: "Abril Fatface", value: "Abril Fatface" }, { label: "Cinzel", value: "Cinzel" },
  { label: "Prata", value: "Prata" }, { label: "Lora", value: "Lora" },
  { label: "Poppins", value: "Poppins" }, { label: "Montserrat", value: "Montserrat" },
  { label: "Jost", value: "Jost" }, { label: "Figtree", value: "Figtree" },
  { label: "Outfit", value: "Outfit" }, { label: "Roboto", value: "Roboto" },
  { label: "Monsieur La Doulaise", value: "Monsieur La Doulaise" }, { label: "Pinyon Script", value: "Pinyon Script" },
  { label: "Great Vibes", value: "Great Vibes" }, { label: "Alex Brush", value: "Alex Brush" },
  { label: "Dancing Script", value: "Dancing Script" }, { label: "Pacifico", value: "Pacifico" },
  { label: "Merriweather", value: "Merriweather" }, { label: "Cormorant Garamond", value: "Cormorant Garamond" },
  { label: "Libre Baskerville", value: "Libre Baskerville" }, { label: "EB Garamond", value: "EB Garamond" },
  { label: "Radley", value: "Radley" }, { label: "Spectral", value: "Spectral" }
];

export const FONT_CATEGORIES = {
  "Elegantes": ["Playfair Display", "Bodoni Moda", "Abril Fatface", "Cinzel", "Prata", "Lora"],
  "Modernas": ["Poppins", "Montserrat", "Jost", "Figtree", "Outfit", "Roboto"],
  "Manuscritas": ["Monsieur La Doulaise", "Pinyon Script", "Great Vibes", "Alex Brush", "Dancing Script", "Pacifico"],
  "Serif": ["Merriweather", "Cormorant Garamond", "Libre Baskerville", "EB Garamond", "Radley", "Spectral"]
};

export const ICON_CATEGORIES = {
  "Generales": ["icon-heart", "icon-crown", "icon-star", "icon-sparkles", "icon-gift", "icon-camera", "icon-church", "icon-rings", "icon-map-pin", "icon-calendar", "icon-clock"],
  "Comida": ["icon-utensils", "icon-wine", "icon-cake", "icon-pizza", "icon-burger", "icon-coffee", "icon-beer", "icon-cocktail"],
  "Ropa y Pases": ["icon-dress", "icon-suit", "icon-tie", "icon-hanger", "icon-ticket", "icon-vip"],
  "Fiesta": ["icon-music", "icon-disco", "icon-speaker", "icon-mic", "icon-balloon", "icon-confetti"]
};

export const EMOJI_CATEGORIES = {
  "Magia": ["✨","👑","🎈","🎉","🎊","🥳","🎁","💝","🪄","🎇","🎆"],
  "Bodas": ["💍","💒","👰","🤵","👼","❤️","💖","💕","💌","🥂"],
  "Bebidas": ["🍾","🥂","🍷","🍸","🍹","🍺","🍻","☕","🧋"],
  "Dulces": ["🎂","🍰","🧁","🍦","🍨","🍧","🍩","🍪","🍫","🍬","🍭"],
  "Salados": ["🍕","🍔","🍟","🌭","🍿","🌮","🌯","🥙","🥗","🥪","🥘","🧆","🍲","🥣","🍗","🍖","🥩","🍤","🍣","🥓","🧀"],
  "Ropa": ["👗","👔","👘","🥻","🩱","👖","🧥","🦺","👕","","🩲","👠","👡","👢","👞","👟","🥾","🧦","🧤","🧣","🎩","🧢","👒"]
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
    { id: "glitter-gold", name: "Brillos Dorados", icon: "✨" },
    { id: "glitter-color", name: "Brillos Multicolor", icon: "🌈" },
    { id: "bokeh", name: "Luces Bokeh", icon: "🚥" },
    { id: "bubbles", name: "Burbujas Flotantes", icon: "🫧" },
    { id: "bubbles-color", name: "Burbujas de Colores", icon: "🔴" },
    { id: "floating-diamonds", name: "Diamantes Flotantes", icon: "💎" }
  ],
  "Fiesta Temática": [
    { id: "emojis-party", name: "Mix Emojis Fiesta", icon: "🥳" },
    { id: "emojis-love", name: "Mix Emojis Amor", icon: "😍" },
    { id: "emojis-music", name: "Mix Emojis Música", icon: "🎵" },
    { id: "streamers", name: "Serpentinas", icon: "🎊" }
  ],
  "Lotties Premium": [
    { id: 'lottie_confeti', name: 'Confeti Pop', icon: '🎉', isLottie: true, url: 'https://lottie.host/0c7f0ad6-f5e9-4473-b606-8fe2ed1d10b1/QvafqoK8yh.lottie' },
    { id: 'lottie_estrellas', name: 'Estrellas', icon: '🌟', isLottie: true, url: 'https://lottie.host/d9fafde0-2c87-4458-a716-f68341282a91/prNFp1cX0s.lottie' },
    { id: 'lottie_nieve', name: 'Nieve/Polvo', icon: '❄️', isLottie: true, url: 'https://lottie.host/dc379347-ce11-49b0-8230-615f4eead16f/Ke19rkdxp8.lottie' },
    { id: 'lottie_luces', name: 'Luces Cálidas', icon: '💡', isLottie: true, url: 'https://lottie.host/e3f319e3-fdc2-46ae-b485-69741b5b5c46/eeMH3uzxKU.lottie' }
  ]
};

export const ANIMATION_CATEGORIES = {
  infantil: [ { id: 'mickey', emoji: '🕷️', name: 'Superhéroe' }, { id: 'minnie', emoji: '🎀', name: 'Princesa' }, { id: 'cars', emoji: '🚗', name: 'Autos' } ],
  quince: [ { id: 'crown', emoji: '👑', name: 'Corona' }, { id: 'butterfly', emoji: '🦋', name: 'Mariposa' }, { id: 'stars', emoji: '✨', name: 'Brillos' } ],
  bodas: [ { id: 'rings', emoji: '💍', name: 'Anillos' }, { id: 'dove', emoji: '🕊️', name: 'Paloma' }, { id: 'flower', emoji: '🌸', name: 'Flor' } ],
  general: [ { id: 'envelope', emoji: '✉️', name: 'Sobre Mágico' }, { id: 'balloon', emoji: '🎈', name: 'Globo' }, { id: 'cake', emoji: '🎂', name: 'Torta' } ]
};

export const TRANSITION_OPTS = [
  { label: "Desvanecer (Fade)", value: "fade" },
  { label: "Subir (Slide Up)", value: "slideUp" },
  { label: "Zoom (Scale)", value: "zoom" }
];

export const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getSpotifyEmbed = (url) => {
  if (!url) return null;
  if (url.includes('spotify.link')) return null;
  return url.replace('https://open.spotify.com/', 'https://open.spotify.com/embed/');
};

export const formatToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// GALERÍA DE BORDES RENOMBRADOS Y SIN EL 5
export const BORDERS = [
  { id: 'b1', name: 'Love', url: '/borders/1-Photoroom.png' },
  { id: 'b2', name: 'Único', url: '/borders/2-Photoroom.png' },
  { id: 'b3', name: 'Cyrax', url: '/borders/3-Photoroom.png' },
  { id: 'b4', name: 'Destellos', url: '/borders/4-Photoroom.png' },
  { id: 'b6', name: 'Elegancia', url: '/borders/6-Photoroom.png' },
  { id: 'b7', name: 'Vintage', url: '/borders/7-Photoroom.png' },
  { id: 'b8', name: 'Minimal', url: '/borders/8-Photoroom.png' },
  { id: 'b9', name: 'Curvas', url: '/borders/9-Photoroom.png' },
  { id: 'b10', name: 'Tribal', url: '/borders/10-Photoroom.png' },
  { id: 'b11', name: 'Floral', url: '/borders/11-Photoroom.png' },
  { id: 'b12', name: 'Abstracto', url: '/borders/12-Photoroom.png' },
  { id: 'b13', name: 'Real', url: '/borders/13-Photoroom.png' },
  { id: 'b14', name: 'Magia', url: '/borders/14-Photoroom.png' },
  { id: 'b15', name: 'Gala', url: '/borders/15-Photoroom.png' },
  { id: 'b16', name: 'Fiesta', url: '/borders/16-Photoroom.png' },
];
