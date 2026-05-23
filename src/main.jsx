import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// BUG 15 CORREGIDO: Callbacks para evitar fallos silenciosos del Service Worker
registerSW({ 
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión disponible. Recargando la página en segundo plano.');
  },
  onOfflineReady() {
    console.log('Aplicación lista para funcionar offline.');
  },
  onRegisterError(error) {
    console.error('Error al registrar el Service Worker:', error);
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
