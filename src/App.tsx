import React, { useEffect, useState } from 'react'

export default function App() {
  const [inTelegram, setInTelegram] = useState(false)

  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp) {
      setInTelegram(true)
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
      tg.enableClosingConfirmation()
    }
  }, [])

  if (inTelegram) {
    // Экран Mini App внутри Telegram (без лишних ссылок)
    return (
      <div className="app" style={{ paddingTop: 24 }}>
        <img src="/logo.png" alt="PULMP.FUN" className="logo" />
        <h1>PULMP.FUN</h1>
        <p>Telegram Mini App запущен ✅</p>
        {/* тут дальше появятся Connect Phantom / Create Token / Buy-Sell */}
      </div>
    )
  }

  // Обычный лендинг в браузере
  return (
    <div className="app">
      <img src="/logo.png" alt="PULMP.FUN" className="logo" />
      <h1>PULMP.FUN</h1>
      <p>Welcome to the Mini App 🚀</p>
      <a className="btn" href="https://t.me/pulmpfunbot?startapp=launch">
        Открыть в Telegram
      </a>
    </div>
  )
}
