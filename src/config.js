// src/config.jsx

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
  // 🎈 5 Infantiles
  { id: "t1", name: "Rosa Chicle", primary: "#f472b6", bg1: "#fdf2f8", bg2: "#fbcfe8", text: "#831843", card: "#ffffff", muted: "#f472b6" },
  { id: "t2", name: "Celeste Nube", primary: "#38bdf8", bg1: "#f0f9ff", bg2: "#e0f2fe", text: "#0c4a6e", card: "#ffffff", muted: "#38bdf8" },
  { id: "t3", name: "Rojo Héroe", primary: "#ef4444", bg1: "#fef2f2", bg2: "#fee2e2", text: "#7f1d1d", card: "#ffffff", muted: "#ef4444" },
  { id: "t4", name: "Lila Mágico", primary: "#a855f7", bg1: "#faf5ff", bg2: "#f3e8ff", text: "#581c87", card: "#ffffff", muted: "#a855f7" },
  { id: "t5", name: "Verde Selva", primary: "#22c55e", bg1: "#f0fdf4", bg2: "#dcfce7", text: "#14532d", card: "#ffffff", muted: "#22c55e" },

  // 👑 5 de 15 Años
  { id: "t6", name: "Rose Gold", primary: "#db2777", bg1: "#fdf2f8", bg2: "#fce7f3", text: "#4c1d95", card: "#ffffff", muted: "#db2777" },
  { id: "t7", name: "Neón Noche", primary: "#d946ef", bg1: "#1e1b4b", bg2: "#0f172a", text: "#ffffff", card: "#1e1b4b", muted: "#a855f7" },
  { id: "t8", name: "Esmeralda", primary: "#059669", bg1: "#ecfdf5", bg2: "#d1fae5", text: "#064e3b", card: "#ffffff", muted: "#059669" },
  { id: "t9", name: "Azul Rey", primary: "#2563eb", bg1: "#f0f9ff", bg2: "#dbeafe", text: "#1e3a8a", card: "#ffffff", muted: "#2563eb" },
  { id: "t10", name: "Black & Silver", primary: "#64748b", bg1: "#0f172a", bg2: "#1e293b", text: "#f8fafc", card: "#334155", muted: "#cbd5e1" },

  // 💍 4 de Bodas
  { id: "t11", name: "Blanco Clásico", primary: "#d4af37", bg1: "#ffffff", bg2: "#f8fafc", text: "#334155", card: "#ffffff", muted: "#94a3b8" },
  { id: "t12", name: "Rústica", primary: "#84cc16", bg1: "#fefce8", bg2: "#f7fee7", text: "#3f6212", card: "#ffffff", muted: "#84cc16" },
  { id: "t13", name: "Borgoña", primary: "#9f1239", bg1: "#fff1f2", bg2: "#ffe4e6", text: "#4c0519", card: "#ffffff", muted: "#9f1239" },
  { id: "t14", name: "Terracota", primary: "#ea580c", bg1: "#fff7ed", bg2: "#ffedd5", text: "#7c2d12", card: "#ffffff", muted: "#ea580c" }
];

export const FONTS = [
  { label: "Montserrat (Moderna)", value: "Montserrat" },
  { label: "Playfair (Elegante)", value: "Playfair Display" },
  { label: "Pacifico (Cursiva)", value: "Pacifico" },
  { label: "Caveat (A mano)", value: "Caveat" },
  { label: "Syne (Urbana)", value: "Syne" },
  { label: "Bebas Neue (Impacto)", value: "Bebas Neue" },
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
