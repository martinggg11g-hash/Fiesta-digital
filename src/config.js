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
  clientPin: "", // PIN de 4 dígitos para que el agasajado acceda a su panel

  // NUEVA VARIABLE: OPACIDAD DE LOS EFECTOS
  effectOpacity: 100,
};

export const THEMES = [
  // 🎈 Infantiles
  { id: "t1", name: "Rosa Chicle", primary: "#e91e8c", bg1: "#fff0f7", bg2: "linear-gradient(135deg, #fce4f3 0%, #f8d0ea 100%)", text: "#6b0f4a", card: "#ffffff", muted: "#c4178a" },
  { id: "t2", name: "Celeste Nube", primary: "#0ea5e9", bg1: "#f0f9ff", bg2: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)", text: "#0c4a6e", card: "#ffffff", muted: "#0284c7" },
  { id: "t3", name: "Rojo Héroe", primary: "#dc2626", bg1: "#fff5f5", bg2: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", text: "#7f1d1d", card: "#ffffff", muted: "#b91c1c" },
  { id: "t4", name: "Lila Mágico", primary: "#9333ea", bg1: "#faf5ff", bg2: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)", text: "#4c1d95", card: "#ffffff", muted: "#7c3aed" },
  { id: "t5", name: "Verde Selva", primary: "#16a34a", bg1: "#f0fdf4", bg2: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", text: "#14532d", card: "#ffffff", muted: "#15803d" },

  // 👑 15 Años
  { id: "t6", name: "Rose Gold", primary: "#be185d", bg1: "#fdf4ff", bg2: "linear-gradient(135deg, #fce7f3 0%, #f5d0e8 100%)", text: "#500724", card: "#fff8fc", muted: "#9d174d" },
  { id: "t7", name: "Neón Noche", primary: "#c026d3", bg1: "#0f0a1e", bg2: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 100%)", text: "#f0e6ff", card: "#1e1030", muted: "#a855f7" },
  { id: "t8", name: "Esmeralda", primary: "#059669", bg1: "#f0fdf8", bg2: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", text: "#064e3b", card: "#ffffff", muted: "#047857" },
  { id: "t9", name: "Azul Rey", primary: "#1d4ed8", bg1: "#f8faff", bg2: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", text: "#1e3a8a", card: "#ffffff", muted: "#1e40af" },
  { id: "t10", name: "Black & Gold Elite", primary: "#d4af37", bg1: "#000000", bg2: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)", text: "#000000", card: "#d4af37", muted: "#d4af37" },

  // 💍 Bodas
  { id: "t11", name: "Ivory Gold", primary: "#b8953f", bg1: "#fefefe", bg2: "linear-gradient(135deg, #fafaf9 0%, #f5f0e8 100%)", text: "#292524", card: "#ffffff", muted: "#a8a29e" },
  { id: "t12", name: "Olive Rustic", primary: "#65a30d", bg1: "#fefdf0", bg2: "linear-gradient(135deg, #fef9c3 0%, #fef08a 40%, #ecfccb 100%)", text: "#3f6212", card: "#fefce8", muted: "#4d7c0f" },
  { id: "t13", name: "Burgundy Velvet", primary: "#9f1239", bg1: "#fff4f5", bg2: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)", text: "#4c0519", card: "#ffffff", muted: "#881337" },
  { id: "t14", name: "Terracotta Warm", primary: "#c2410c", bg1: "#fffaf5", bg2: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)", text: "#7c2d12", card: "#ffffff", muted: "#9a3412" },
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
  "Ropa": ["👗","👔","👘","🥻","🩱","👖","🧥","🦺","👕","🩳","🩲","👠","👡","👢","👞","👟","🥾","🧦","🧤","🧣","🎩","🧢","👒"]
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

// 👉 ACÁ VAN TUS BORDES EN BASE64
// Reemplazá "data:image/png;base64,PEGAR_AQUI..." por tus verdaderos códigos.
// 👉 TUS BORDES DESDE LA CARPETA PUBLIC
export const BORDERS = [
  { 
    id: 'b1', 
    name: 'Borde 1', 
    url: '/borders/1-Photoroom.png' 
  },
  { 
    id: 'b2', 
    name: 'Borde 2', 
    url: '/borders/2-Photoroom.png' 
  },
  { 
    id: 'b3', 
    name: 'Borde 3', 
    url: '/borders/3-Photoroom.png' 
  },
  { 
    id: 'b4', 
    name: 'Borde 4', 
    url: '/borders/4-Photoroom.png' 
  },
  { 
    id: 'b5', 
    name: 'Borde 5', 
    url: '/borders/6-Photoroom.png' 
  },
  { 
    id: 'b6', 
    name: 'Borde 6', 
    url: '/borders/7-Photoroom.png' 
  },
  { 
    id: 'b7', 
    name: 'Borde 7', 
    url: '/borders/8-Photoroom.png' 
  },
  { 
    id: 'b8', 
    name: 'Borde 8', 
    url: '/borders/9-Photoroom.png' 
  },
  { 
    id: 'b9', 
    name: 'Borde 9', 
    url: '/borders/10-Photoroom.png' 
  },
  { 
    id: 'b10', 
    name: 'Borde 10', 
    url: '/borders/11-Photoroom.png' 
  },
  { 
    id: 'b11', 
    name: 'Borde 11', 
    url: '/borders/12-Photoroom.png' 
  },
  { 
    id: 'b12', 
    name: 'Borde 12', 
    url: '/borders/13-Photoroom.png' 
  },
  { 
    id: 'b13', 
    name: 'Borde 13', 
    url: '/borders/14-Photoroom.png' 
  },
  { 
    id: 'b14', 
    name: 'Borde 14', 
    url: '/borders/15-Photoroom.png' 
  },
  { 
    id: 'b15', 
    name: 'Borde 15', 
    url: '/borders/16-Photoroom.png' 
  },

  // ... ¡Y así sucesivamente hasta llegar al 16! Podés ponerles el "name" que quieras.
];
