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
  
  // COVER
  coverPhoto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  eventTypeEmoji: "✨",
  eventType: "Mis Dulces 15",
  honoreeName: "Valentina",
  showBadge: true, // NUEVO
  badgeEmoji: "👑",
  badgeText: "La gran noche",
  
  // SECTIONS TOGGLES
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
  
  // DEFAULTS
  dateText: "2026-12-15",
  timeText: "21:00 a 05:00 hs",
  parkingType: "Estacionamiento privado cubierto",
  venueLinkType: "web",
  venueLink: "https://defiesta.lat",
  spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  
  // REDES SOCIALES
  showInstagram: false,
  instagramUrl: "",
  showFacebook: false,
  facebookUrl: "",
  showTiktok: false,
  tiktokUrl: "",
};

export const THEMES = [
  // 🎈 Infantiles (más modernos, menos “guardería”)
  {
    id: "t1",
    name: "Bubble Pink Pro",
    primary: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    bg1: "#fff1f7",
    bg2: "#ffe4f0",
    text: "#3b0a2a",
    card: "#ffffff",
    muted: "#f9a8d4"
  },
  {
    id: "t2",
    name: "Sky Soft",
    primary: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    bg1: "#f0f9ff",
    bg2: "#e0f2fe",
    text: "#082f49",
    card: "#ffffff",
    muted: "#7dd3fc"
  },
  {
    id: "t3",
    name: "Hero Red Modern",
    primary: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #f87171)",
    bg1: "#fff5f5",
    bg2: "#fee2e2",
    text: "#3f0a0a",
    card: "#ffffff",
    muted: "#fca5a5"
  },
  {
    id: "t4",
    name: "Magic Purple",
    primary: "#9333ea",
    gradient: "linear-gradient(135deg, #9333ea, #c084fc)",
    bg1: "#faf5ff",
    bg2: "#f3e8ff",
    text: "#2e1065",
    card: "#ffffff",
    muted: "#d8b4fe"
  },
  {
    id: "t5",
    name: "Jungle Fresh",
    primary: "#16a34a",
    gradient: "linear-gradient(135deg, #16a34a, #4ade80)",
    bg1: "#f0fdf4",
    bg2: "#dcfce7",
    text: "#052e16",
    card: "#ffffff",
    muted: "#86efac"
  },

  // 👑 15 Años (más premium / instagram-ready)
  {
    id: "t6",
    name: "Rose Gold Luxe",
    primary: "#be185d",
    gradient: "linear-gradient(135deg, #be185d, #f472b6)",
    bg1: "#fff1f7",
    bg2: "#ffe4f0",
    text: "#4a044e",
    card: "#ffffff",
    muted: "#f9a8d4"
  },
  {
    id: "t7",
    name: "Neon Night",
    primary: "#c026d3",
    gradient: "linear-gradient(135deg, #c026d3, #6366f1)",
    bg1: "#0f172a",
    bg2: "#020617",
    text: "#f8fafc",
    card: "#1e293b",
    muted: "#a78bfa"
  },
  {
    id: "t8",
    name: "Emerald Deep",
    primary: "#047857",
    gradient: "linear-gradient(135deg, #047857, #10b981)",
    bg1: "#ecfdf5",
    bg2: "#d1fae5",
    text: "#022c22",
    card: "#ffffff",
    muted: "#6ee7b7"
  },
  {
    id: "t9",
    name: "Royal Blue Pro",
    primary: "#1d4ed8",
    gradient: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    bg1: "#eff6ff",
    bg2: "#dbeafe",
    text: "#172554",
    card: "#ffffff",
    muted: "#93c5fd"
  },
  {
    id: "t10",
    name: "Black Silver Elite",
    primary: "#94a3b8",
    gradient: "linear-gradient(135deg, #0f172a, #334155)",
    bg1: "#020617",
    bg2: "#0f172a",
    text: "#e2e8f0",
    card: "#1e293b",
    muted: "#64748b"
  },

  // 💍 Bodas (elegancia real, no genérico)
  {
    id: "t11",
    name: "Classic Ivory Gold",
    primary: "#c9a227",
    gradient: "linear-gradient(135deg, #c9a227, #f5e6a8)",
    bg1: "#fffdf7",
    bg2: "#f8f6f0",
    text: "#3f3f46",
    card: "#ffffff",
    muted: "#e4d7a3"
  },
  {
    id: "t12",
    name: "Olive Rustic",
    primary: "#4d7c0f",
    gradient: "linear-gradient(135deg, #4d7c0f, #a3e635)",
    bg1: "#fefce8",
    bg2: "#f7fee7",
    text: "#1a2e05",
    card: "#ffffff",
    muted: "#bef264"
  },
  {
    id: "t13",
    name: "Burgundy Velvet",
    primary: "#7f1d1d",
    gradient: "linear-gradient(135deg, #7f1d1d, #b91c1c)",
    bg1: "#fff1f2",
    bg2: "#ffe4e6",
    text: "#2c0a0a",
    card: "#ffffff",
    muted: "#fca5a5"
  },
  {
    id: "t14",
    name: "Terracotta Warm",
    primary: "#c2410c",
    gradient: "linear-gradient(135deg, #c2410c, #fb923c)",
    bg1: "#fff7ed",
    bg2: "#ffedd5",
    text: "#431407",
    card: "#ffffff",
    muted: "#fdba74"
  }
]; 

// ESTO ERA LO QUE FALTABA PARA QUE VERCEL NO FALLE
export const FONTS = [
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Bodoni Moda", value: "Bodoni Moda" },
  { label: "Abril Fatface", value: "Abril Fatface" },
  { label: "Cinzel", value: "Cinzel" },
  { label: "Prata", value: "Prata" },
  { label: "Lora", value: "Lora" },
  { label: "Poppins", value: "Poppins" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Jost", value: "Jost" },
  { label: "Figtree", value: "Figtree" },
  { label: "Outfit", value: "Outfit" },
  { label: "Roboto", value: "Roboto" },
  { label: "Monsieur La Doulaise", value: "Monsieur La Doulaise" },
  { label: "Pinyon Script", value: "Pinyon Script" },
  { label: "Great Vibes", value: "Great Vibes" },
  { label: "Alex Brush", value: "Alex Brush" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Pacifico", value: "Pacifico" },
  { label: "Merriweather", value: "Merriweather" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond" },
  { label: "Libre Baskerville", value: "Libre Baskerville" },
  { label: "EB Garamond", value: "EB Garamond" },
  { label: "Radley", value: "Radley" },
  { label: "Spectral", value: "Spectral" }
];

export const GENERAL_EMOJIS = ["✨","👑","🎈","🎉","🍾","🥂","🍷","🎂","🍰","🥳","💍","💒","💒","👼","🎓","🎓","🚗","👗","👔","🎁","💝"];
export const FOOD_EMOJIS = ["🍕","🍔","🍟","🌭","🍿","🌮","🌯","🥙","🥗","🥪","🥘","🧆","🍲","🥣","🥗","🍿","🍗","🍖","🥩","🍤","🍣","🥓","🧀","🌮","🍔"];
export const CLOTHES_EMOJIS = ["👗","👔","👘","🥻","🩱","👖","🧥","🦺","👕","👕","🩳","🩲","👠","👡","👢","👞","👟","🥾","🧦","🧤","🧣","🎩","🧢","👒"];

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
  if (url.includes('spotify.link')) return null; // No soporta links acortados aún
  return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
};

export const formatToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
