import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

declare global { interface Window { Telegram?: any } }

const tg = (window as any)?.Telegram?.WebApp
if (tg) {
  try {
    tg.ready()
    tg.expand()
    tg.enableClosingConfirmation()
  } catch {}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
