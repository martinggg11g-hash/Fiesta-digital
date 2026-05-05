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
  { id: "default", name: "Violeta Premium", primary: "#8b5cf6", bg1: "#f8f7ff", bg2: "#e0dcfc", text: "#1e1b4b", muted: "#6b7280", card: "#ffffff", fontTitle: "Playfair Display" },
  { id: "rosa", name: "Rosa Pastel", primary: "#ec4899", bg1: "#fff1f2", bg2: "#fbcfe8", text: "#4c0519", muted: "#9f1239", card: "#ffffff", fontTitle: "Pacifico" },
  { id: "gold", name: "Dorado Noche", primary: "#d4af37", bg1: "#000000", bg2: "#1a1a1a", text: "#ffffff", muted: "#9ca3af", card: "#262626", fontTitle: "Playfair Display" },
  { id: "blue", name: "Azul Bebé", primary: "#3b82f6", bg1: "#eff6ff", bg2: "#bfdbfe", text: "#172554", muted: "#1e40af", card: "#ffffff", fontTitle: "Montserrat" },
  { id: "neon", name: "Neón Party", primary: "#22c55e", bg1: "#0f172a", bg2: "#020617", text: "#ffffff", muted: "#94a3b8", card: "#1e293b", fontTitle: "Syne" },
  { id: "boho", name: "Boho Chic", primary: "#b45309", bg1: "#fffbeb", bg2: "#fef3c7", text: "#451a03", muted: "#78350f", card: "#ffffff", fontTitle: "Caveat" },
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
