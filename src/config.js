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
    id: "t1", name: "Rose Gold", 
    primary: "#d97793", bg1: "#fdf8f9", 
    bg2: "linear-gradient(135deg, #fdf8f9 0%, #f6e5e9 50%, #f0d5dc 100%)", 
    text: "#4a2c33", card: "#ffffff", muted: "#8a5a66" 
  },
  { 
    id: "t2", name: "Galaxia (Dark)", 
    primary: "#a855f7", bg1: "#0f0c29", 
    bg2: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", 
    text: "#f8fafc", card: "rgba(30, 30, 45, 0.6)", muted: "#cbd5e1" 
  },
  { 
    id: "t3", name: "Esmeralda", 
    primary: "#10b981", bg1: "#ecfdf5", 
    bg2: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)", 
    text: "#064e3b", card: "#ffffff", muted: "#047857" 
  },
  { 
    id: "t4", name: "Océano", 
    primary: "#0ea5e9", bg1: "#f0f9ff", 
    bg2: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)", 
    text: "#0c4a6e", card: "#ffffff", muted: "#0284c7" 
  },
  { 
    id: "t5", name: "Atardecer", 
    primary: "#f43f5e", bg1: "#fff1f2", 
    bg2: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)", 
    text: "#881337", card: "#ffffff", muted: "#be123c" 
  },
  { 
    id: "t6", name: "Terciopelo (Dark)", 
    primary: "#8b5cf6", bg1: "#1e1b4b", 
    bg2: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%)", 
    text: "#f5f3ff", card: "rgba(46, 16, 101, 0.6)", muted: "#c4b5fd" 
  },
  { 
    id: "t7", name: "Champagne", 
    primary: "#d4af37", bg1: "#fcfbf9", 
    bg2: "linear-gradient(135deg, #fdfbf7 0%, #f6f0e4 50%, #f3ead3 100%)", 
    text: "#3e3214", card: "#ffffff", muted: "#8c7322" 
  },
  { 
    id: "t8", name: "Cyberpunk (Dark)", 
    primary: "#ec4899", bg1: "#09090b", 
    bg2: "linear-gradient(135deg, #09090b 0%, #171717 50%, #27272a 100%)", 
    text: "#fdf2f8", card: "rgba(39, 39, 42, 0.6)", muted: "#f472b6" 
  },
  { 
    id: "t9", name: "Durazno Suave", 
    primary: "#f97316", bg1: "#fff7ed", 
    bg2: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)", 
    text: "#431407", card: "#ffffff", muted: "#9a3412" 
  },
  { 
    id: "t10", name: "Plata Glacial", 
    primary: "#64748b", bg1: "#f8fafc", 
    bg2: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", 
    text: "#0f172a", card: "#ffffff", muted: "#475569" 
  },
  { 
    id: "t11", name: "Rubí Pasión", 
    primary: "#e11d48", bg1: "#fff1f2", 
    bg2: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fda4af 100%)", 
    text: "#4c0519", card: "#ffffff", muted: "#9f1239" 
  },
  { 
    id: "t12", name: "Black & Gold", 
    primary: "#fbbf24", bg1: "#000000", 
    bg2: "linear-gradient(135deg, #18181b 0%, #09090b 50%, #000000 100%)", 
    text: "#fef3c7", card: "rgba(39, 39, 42, 0.5)", muted: "#d97706" 
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
