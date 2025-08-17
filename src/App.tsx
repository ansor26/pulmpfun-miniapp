import React, { useEffect, useMemo, useState } from 'react'

function isRunningInTelegram(): boolean {
  try {
    const hasObj = Boolean((window as any)?.Telegram?.WebApp)
    const qs = new URLSearchParams(window.location.search)
    // Telegram добавляет эти параметры мини‑приложению
    const hasTgParams = qs.has('tgWebAppPlatform') || qs.has('tgWebAppStartParam')
    return hasObj || hasTgParams
  } catch {
    return false
  }
}

export default function App() {
  const [inTelegram, setInTelegram] = useState(false)

  useEffect(() => {
    setInTelegram(isRunningInTelegram())
  }, [])

  if (inTelegram) {
    // Экран внутри Telegram Mini App (без ссылки "Открыть в Telegram")
    return (
      <div className="app" style={{ paddingTop: 24 }}>
        <img src="/logo.png" alt="PULMP.FUN" className="logo" />
        <h1>PULMP.FUN</h1>
        <p>Telegram Mini App запущен ✅</p>

        {/* сюда позже добавим: Connect Phantom / Create Token / Buy / Sell */}
        <div className="card" style={{maxWidth:520}}>
          <h2>Devnet билд</h2>
          <p>Готово: запускается как мини‑приложение. Дальше подключаем Phantom.</p>
        </div>
      </div>
    )
  }

  // Экран в обычном браузере
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
