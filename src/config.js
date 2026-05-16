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
    id: "t1", name: "Rose Gold",
    primary: "#e8829a",
    bg1: "#fdf0f3",
    bg2: "linear-gradient(145deg, #fff5f7 0%, #fce4ea 25%, #f5c6d3 55%, #eea8bc 80%, #e690a8 100%)",
    text: "#3d1e27",
    card: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(252,228,234,0.75) 100%)",
    muted: "#9b5f6e",
    shadow: "0 8px 32px rgba(217,119,147,0.22), 0 2px 8px rgba(217,119,147,0.14)",
    border: "rgba(232,130,154,0.25)",
    accent: "#f0a0b8",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t2", name: "Galaxia (Dark)",
    primary: "#b97ef8",
    bg1: "#07051a",
    bg2: "linear-gradient(145deg, #07051a 0%, #110d35 20%, #1e1550 40%, #2d1f6e 60%, #1a1040 80%, #0d0924 100%)",
    text: "#ede9ff",
    card: "linear-gradient(160deg, rgba(35,28,75,0.72) 0%, rgba(55,40,110,0.55) 100%)",
    muted: "#a78bfa",
    shadow: "0 8px 40px rgba(139,92,246,0.35), 0 2px 12px rgba(80,50,180,0.25)",
    border: "rgba(168,85,247,0.3)",
    accent: "#7c3aed",
    shine: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t3", name: "Esmeralda",
    primary: "#0fba7e",
    bg1: "#eafdf5",
    bg2: "linear-gradient(145deg, #f0fefa 0%, #d6fbee 20%, #a7f3d8 45%, #6ee7be 70%, #34d399 90%, #10b981 100%)",
    text: "#053729",
    card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(209,250,229,0.78) 100%)",
    muted: "#047857",
    shadow: "0 8px 36px rgba(16,185,129,0.22), 0 2px 10px rgba(16,185,129,0.14)",
    border: "rgba(16,185,129,0.22)",
    accent: "#34d399",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t4", name: "Océano",
    primary: "#0ea5e9",
    bg1: "#eaf8ff",
    bg2: "linear-gradient(145deg, #f0fbff 0%, #cceeff 22%, #99ddfa 45%, #5bc8f5 68%, #1faee3 88%, #0ea5e9 100%)",
    text: "#082f49",
    card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(186,230,253,0.75) 100%)",
    muted: "#0284c7",
    shadow: "0 8px 36px rgba(14,165,233,0.24), 0 2px 10px rgba(14,165,233,0.14)",
    border: "rgba(14,165,233,0.22)",
    accent: "#38bdf8",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t5", name: "Atardecer",
    primary: "#f43f5e",
    bg1: "#fff0f1",
    bg2: "linear-gradient(145deg, #fff5f5 0%, #ffe0e3 18%, #fdb8be 38%, #fc8594 58%, #f95d74 78%, #f43f5e 100%)",
    text: "#6d0e1f",
    card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(254,205,211,0.75) 100%)",
    muted: "#be123c",
    shadow: "0 8px 36px rgba(244,63,94,0.24), 0 2px 10px rgba(244,63,94,0.14)",
    border: "rgba(244,63,94,0.22)",
    accent: "#fb7185",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t6", name: "Terciopelo (Dark)",
    primary: "#9d6ef8",
    bg1: "#160d38",
    bg2: "linear-gradient(145deg, #160d38 0%, #200f50 18%, #32146a 36%, #48178e 55%, #2e1060 75%, #1a0b40 100%)",
    text: "#f0ebff",
    card: "linear-gradient(160deg, rgba(50,20,106,0.7) 0%, rgba(72,23,142,0.5) 100%)",
    muted: "#c084fc",
    shadow: "0 8px 40px rgba(139,92,246,0.38), 0 2px 14px rgba(109,40,217,0.28)",
    border: "rgba(192,132,252,0.28)",
    accent: "#a855f7",
    shine: "linear-gradient(135deg, rgba(196,181,253,0.2) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t7", name: "Champagne",
    primary: "#c9a227",
    bg1: "#fefcf7",
    bg2: "linear-gradient(145deg, #fffef9 0%, #fdf6e3 22%, #f7e9c0 45%, #f0d896 68%, #e8c96e 88%, #d4af37 100%)",
    text: "#2e2208",
    card: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(243,234,211,0.78) 100%)",
    muted: "#8c6d1f",
    shadow: "0 8px 36px rgba(212,175,55,0.28), 0 2px 10px rgba(212,175,55,0.16)",
    border: "rgba(212,175,55,0.28)",
    accent: "#e8c96e",
    shine: "linear-gradient(135deg, rgba(255,248,200,0.55) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t8", name: "Cyberpunk (Dark)",
    primary: "#f72585",
    bg1: "#050507",
    bg2: "linear-gradient(145deg, #050507 0%, #0d0d12 20%, #161220 40%, #0f0a1a 60%, #050510 80%, #000000 100%)",
    text: "#fff0fa",
    card: "linear-gradient(160deg, rgba(20,10,30,0.8) 0%, rgba(40,10,40,0.65) 100%)",
    muted: "#f472b6",
    shadow: "0 0 30px rgba(247,37,133,0.5), 0 0 8px rgba(247,37,133,0.4), 0 2px 10px rgba(0,0,0,0.6)",
    border: "rgba(247,37,133,0.4)",
    accent: "#7b2fff",
    shine: "linear-gradient(135deg, rgba(247,37,133,0.2) 0%, rgba(123,47,255,0.1) 50%, rgba(255,255,255,0) 100%)",
  },
  {
    id: "t9", name: "Durazno Suave",
    primary: "#f97316",
    bg1: "#fff8f0",
    bg2: "linear-gradient(145deg, #fffaf5 0%, #ffe8cc 20%, #ffd0a0 40%, #ffb874 62%, #ffa050 82%, #f97316 100%)",
    text: "#341005",
    card: "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, rgba(254,215,170,0.76) 100%)",
    muted: "#9a3412",
    shadow: "0 8px 36px rgba(249,115,22,0.24), 0 2px 10px rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.22)",
    accent: "#fb923c",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t10", name: "Plata Glacial",
    primary: "#5b7fa6",
    bg1: "#f4f8fc",
    bg2: "linear-gradient(145deg, #f8fbff 0%, #edf2f9 22%, #dde6f2 45%, #ccd8ea 68%, #b8c9e0 88%, #a4bad6 100%)",
    text: "#0c1c2e",
    card: "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(220,232,248,0.72) 100%)",
    muted: "#4a6480",
    shadow: "0 8px 36px rgba(91,127,166,0.18), 0 2px 10px rgba(91,127,166,0.10)",
    border: "rgba(100,116,139,0.18)",
    accent: "#93b4d4",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t11", name: "Rubí Pasión",
    primary: "#e11d48",
    bg1: "#fff0f2",
    bg2: "linear-gradient(145deg, #fff5f6 0%, #ffd6dc 20%, #ffaab7 40%, #ff7591 62%, #f04468 82%, #e11d48 100%)",
    text: "#3a000e",
    card: "linear-gradient(160deg, rgba(255,255,255,0.93) 0%, rgba(253,164,175,0.7) 100%)",
    muted: "#9f1239",
    shadow: "0 8px 36px rgba(225,29,72,0.28), 0 2px 10px rgba(225,29,72,0.16)",
    border: "rgba(225,29,72,0.24)",
    accent: "#fb4f6e",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t12", name: "Black & Gold",
    primary: "#f5c518",
    bg1: "#0a0800",
    bg2: "linear-gradient(145deg, #0a0800 0%, #14100a 18%, #1e1806 35%, #120f00 55%, #0c0900 75%, #000000 100%)",
    text: "#fef9e7",
    card: "linear-gradient(160deg, rgba(30,24,6,0.85) 0%, rgba(50,38,8,0.65) 100%)",
    muted: "#d4a017",
    shadow: "0 0 28px rgba(245,197,24,0.36), 0 0 8px rgba(245,197,24,0.28), 0 2px 12px rgba(0,0,0,0.7)",
    border: "rgba(245,197,24,0.3)",
    accent: "#fde68a",
    shine: "linear-gradient(135deg, rgba(245,197,24,0.22) 0%, rgba(255,255,255,0) 60%)",
  },
  
  // 👉 ACÁ ESTÁN LOS NUEVOS DE BODAS SÚPER ELEGANTES
  {
    id: "t13", name: "Ivory & Gold (Boda)",
    primary: "#d4af37",
    bg1: "#ffffff",
    bg2: "linear-gradient(145deg, #ffffff 0%, #fefcf9 30%, #f8f1df 70%, #eadcae 100%)",
    text: "#3e3214",
    card: "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 100%)",
    muted: "#967f40",
    shadow: "0 10px 40px rgba(212,175,55,0.15), 0 2px 8px rgba(0,0,0,0.02)",
    border: "rgba(212,175,55,0.25)",
    accent: "#e3cc7c",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
  },
  {
    id: "t14", name: "Perla Rosa (Boda)",
    primary: "#d48b9c",
    bg1: "#ffffff",
    bg2: "linear-gradient(145deg, #ffffff 0%, #fffbfc 30%, #fbeff2 70%, #f0ced6 100%)",
    text: "#4a2a32",
    card: "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 100%)",
    muted: "#ab6879",
    shadow: "0 10px 40px rgba(212,139,156,0.15), 0 2px 8px rgba(0,0,0,0.02)",
    border: "rgba(212,139,156,0.25)",
    accent: "#e2afbd",
    shine: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
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

// 👉 ACÁ ESTÁ EL CAMBIO. AÑADÍ LOS NUEVOS DE COMIDA.
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
