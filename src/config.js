// src/config.js

// Única fuente de verdad para el formateo de fechas (Corrige BUG-12)
export const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
  return dateStr;
};

// Constantes de UI requeridas por EditorSidebar
export const THEMES = [
  { id: "default", name: "Original", primary: "#8b5cf6", bg1: "#f8f7ff", bg2: "#e0dcfc", text: "#1e1b4b", muted: "#6b7280", card: "#ffffff" },
  { id: "dark", name: "Oscuro", primary: "#c084fc", bg1: "#0f172a", bg2: "#1e293b", text: "#f8fafc", muted: "#94a3b8", card: "#1e293b" },
  { id: "rose", name: "Rosa", primary: "#fb7185", bg1: "#fff1f2", bg2: "#ffe4e6", text: "#4c0519", muted: "#9f1239", card: "#ffffff" },
  { id: "emerald", name: "Esmeralda", primary: "#34d399", bg1: "#ecfdf5", bg2: "#d1fae5", text: "#064e3b", muted: "#047857", card: "#ffffff" },
  { id: "amber", name: "Ámbar", primary: "#fbbf24", bg1: "#fffbeb", bg2: "#fef3c7", text: "#78350f", muted: "#b45309", card: "#ffffff" }
];

export const ANIMATION_CATEGORIES = {
  "infantil": [
    { id: "envelope", name: "Sobre Mágico", emoji: "✉️" },
    { id: "curtain", name: "Telón", emoji: "🎭" }
  ],
  "quince": [
    { id: "sparkle", name: "Brillos 15", emoji: "✨" },
    { id: "stars", name: "Estrellas", emoji: "⭐" }
  ],
  "boda": [
    { id: "rings", name: "Anillos", emoji: "💍" },
    { id: "hearts", name: "Corazones", emoji: "🤍" }
  ]
};

export const TRANSITION_OPTS = [
  { label: "Suave (Fade)", value: "fade" },
  { label: "Deslizar (Slide)", value: "slide" },
  { label: "Zoom In", value: "zoom" }
];

export const PARTICLE_CATEGORIES = {
  "Clásicos": [
    { id: "none", name: "Sin Efecto", icon: "🚫" },
    { id: "confetti", name: "Confetti", icon: "🎉" },
    { id: "bubbles", name: "Burbujas", icon: "🫧" }
  ],
  "Románticos": [
    { id: "hearts", name: "Corazones", icon: "💖" },
    { id: "petals", name: "Pétalos", icon: "🌸" }
  ],
  "Mágicos": [
    { id: "stars", name: "Estrellas", icon: "⭐" },
    { id: "snow", name: "Nieve", icon: "❄️" }
  ]
};

export const FONTS = [
  { label: "Montserrat", value: "Montserrat" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Lato", value: "Lato" },
  { label: "Poppins", value: "Poppins" }
];

// Objeto de configuración completo (Corrige BUG-08)
export const DEF_CONFIG = {
  // Temas y colores base
  theme: "default",
  primary: "#8b5cf6",
  bg1: "#f8f7ff",
  bg2: "#e0dcfc",
  text: "#1e1b4b",
  muted: "#6b7280",
  card: "#ffffff",
  fontBody: "Montserrat",
  fontTitle: "Playfair Display",
  cardGlow: 0,
  
  // Animación
  openingAnimation: "none",
  animationDuration: 3,
  animationTransition: "fade",

  // Partículas
  particleEffect: "none",
  particlesFullscreen: false,

  // Bordes
  showCoverBorders: false,
  selectedBorder: "",
  borderPosition: "both",
  borderRotationTop: 0,
  borderRotationBottom: 0,
  borderColor: "#8b5cf6",
  ornamentSize: 150,
  
  // Portada Principal
  useGiphyCover: false,
  coverPhoto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  eventTypeEmoji: "✨",
  eventType: "Estás invitado a...",
  eventTypeFont: "Montserrat",
  eventTypeColor: "#8b5cf6",
  eventTypeSize: 11,
  eventTypeShadowSize: 0,
  eventTypeShadowColor: "#000000",
  
  honoreeName: "Nombre Principal",
  honoreeFont: "Playfair Display",
  honoreeColor: "#1e1b4b",
  honoreeSize: 48,
  honoreeShadowSize: 0,
  honoreeShadowColor: "#000000",
  
  showBadge: true,
  badgeEmoji: "👑",
  badgeText: "El gran evento",
  badgeFont: "Montserrat",
  badgeSize: 14,
  badgeBgColor: "#000000",
  
  // Cuenta Regresiva
  showCountdown: true,
  
  // Cuándo y Dónde
  dateSize: 18,
  showDate: true,
  date: "",
  showTime: true,
  time: "",
  showLocation: true,
  locationName: "",
  locationAddress: "",
  showParking: false,
  parkingType: "Estacionamiento privado",
  customParking: "",
  
  // Tarjeta del Salón
  showVenueLogo: true,
  venueName: "",
  venueLogoUrl: "",
  venueLinkType: "web",
  venueLink: "",
  
  // Multimedia
  showVideo: false,
  videoTitle: "",
  videoUrl: "",
  showMusic: false,
  spotifyUrl: "",
  
  // Programa
  showItinerary: false,
  itinerarySectionTitle: "¿Qué vamos a hacer?",
  itinerary: [],
  
  // Menú
  showMenu: false,
  menuSectionTitle: "¿Qué vamos a comer?",
  menuItems: [],
  
  // Vestimenta y Regalos
  notesSectionTitle: "A tener en cuenta",
  showDressCode: false,
  dressCodeIcon: "👔",
  dressCodeText: "",
  showGifts: false,
  giftIcon: "🎁",
  giftLabel: "Regalos",
  giftText: "El mejor regalo es tu presencia...",
  showGiftNote: false,
  giftNoteText: "",
  giftNoteColor: "#8b5cf6",
  giftNoteSize: 11,
  giftLinks: [],
  
  // Galería
  showGallery: false,
  galleryLayout: "carousel",
  galleryTitle: "Nuestros Momentos",
  galleryPhotos: [],
  
  // Cámara en Vivo
  showLiveCamera: false,
  liveCameraTitle: "Álbum Colaborativo",
  
  // RSVP y Redes
  isPrivateList: false,
  clientPin: "",
  showRsvpDeadline: false,
  rsvpDeadline: "",
  maxGuestsPerFamily: 5,
  whatsappNumber: "",
  whatsappMessage: "¡Hola! Confirmo mi asistencia para el evento de {nombre}.",
  
  showInstagram: false,
  instagramUrl: "",
  showFacebook: false,
  facebookUrl: "",
  showTiktok: false,
  tiktokUrl: ""
};
