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
  showBadge: true,
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
  // 🎈 Infantiles — vibrantes pero con carácter
  {
    id: "t1",
    name: "Rosa Chicle",
    primary: "#e91e8c",
    bg1: "#fff0f7",
    bg2: "linear-gradient(135deg, #fce4f3 0%, #f8d0ea 100%)",
    text: "#6b0f4a",
    card: "#ffffff",
    muted: "#c4178a",
  },
  {
    id: "t2",
    name: "Celeste Nube",
    primary: "#0ea5e9",
    bg1: "#f0f9ff",
    bg2: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)",
    text: "#0c4a6e",
    card: "#ffffff",
    muted: "#0284c7",
  },
  {
    id: "t3",
    name: "Rojo Héroe",
    primary: "#dc2626",
    bg1: "#fff5f5",
    bg2: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    text: "#7f1d1d",
    card: "#ffffff",
    muted: "#b91c1c",
  },
  {
    id: "t4",
    name: "Lila Mágico",
    primary: "#9333ea",
    bg1: "#faf5ff",
    bg2: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    text: "#4c1d95",
    card: "#ffffff",
    muted: "#7c3aed",
  },
  {
    id: "t5",
    name: "Verde Selva",
    primary: "#16a34a",
    bg1: "#f0fdf4",
    bg2: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
    text: "#14532d",
    card: "#ffffff",
    muted: "#15803d",
  },

  // 👑 15 Años — elegantes y con drama
  {
    id: "t6",
    name: "Rose Gold",
    primary: "#be185d",
    bg1: "#fdf4ff",
    bg2: "linear-gradient(135deg, #fce7f3 0%, #f5d0e8 100%)",
    text: "#500724",
    card: "#fff8fc",
    muted: "#9d174d",
  },
  {
    id: "t7",
    name: "Neón Noche",
    primary: "#c026d3",
    bg1: "#0f0a1e",
    bg2: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 100%)",
    text: "#f0e6ff",
    card: "#1e1030",
    muted: "#a855f7",
  },
  {
    id: "t8",
    name: "Esmeralda",
    primary: "#059669",
    bg1: "#f0fdf8",
    bg2: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    text: "#064e3b",
    card: "#ffffff",
    muted: "#047857",
  },
  {
    id: "t9",
    name: "Azul Rey",
    primary: "#1d4ed8",
    bg1: "#f8faff",
    bg2: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    text: "#1e3a8a",
    card: "#ffffff",
    muted: "#1e40af",
  },
  {
    id: "t10",
    name: "Black & Gold Elite",
    primary: "#d4af37", // Dorado clásico
    bg1: "#0a0a0a", // Negro profundo
    bg2: "linear-gradient(135deg, #171717 0%, #000000 100%)",
    text: "#fef3c7", // Blanco cálido/crema
    card: "#171717", // Gris casi negro
    muted: "#a3a3a3", // Gris neutro para contraste
  },

  // 💍 Bodas — sofisticados y atemporales
  {
    id: "t11",
    name: "Blanco Clásico",
    primary: "#b8953f",
    bg1: "#fefefe",
    bg2: "linear-gradient(135deg, #fafaf9 0%, #f5f0e8 100%)",
    text: "#292524",
    card: "#ffffff",
    muted: "#a8a29e",
  },
  {
    id: "t12",
    name: "Rústica",
    primary: "#65a30d",
    bg1: "#fefdf0",
    bg2: "linear-gradient(135deg, #fef9c3 0%, #fef08a 40%, #ecfccb 100%)",
    text: "#3f6212",
    card: "#fefce8",
    muted: "#4d7c0f",
  },
  {
    id: "t13",
    name: "Borgoña",
    primary: "#9f1239",
    bg1: "#fff4f5",
    bg2: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
    text: "#4c0519",
    card: "#ffffff",
    muted: "#881337",
  },
  {
    id: "t14",
    name: "Terracota",
    primary: "#c2410c",
    bg1: "#fffaf5",
    bg2: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
    text: "#7c2d12",
    card: "#ffffff",
    muted: "#9a3412",
  },
]; 

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
  if (url.includes('spotify.link')) return null;
  return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
};

export const formatToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
