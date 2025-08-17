import React, { useMemo } from 'react'

export default function App() {
  const inTelegram = useMemo(() => Boolean((window as any)?.Telegram?.WebApp), [])

  if (inTelegram) {
    // Экран Mini App внутри Telegram
    return (
      <div className="app" style={{paddingTop: 24}}>
        <img src="/logo.png" alt="PULMP.FUN" className="logo" />
        <h1>PULMP.FUN</h1>
        <p>Telegram Mini App запущен ✅</p>

        {/* сюда позже добавим: Connect Phantom, Create Token, Buy/Sell */}
        <div className="card">
          <h2>Devnet билд</h2>
          <p>Дальше добавляем подключение Phantom и тестовые действия.</p>
        </div>
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
