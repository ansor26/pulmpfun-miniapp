import React, { useEffect, useState } from 'react'
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'

type PhantomProvider = {
  isPhantom?: boolean
  connect: () => Promise<{ publicKey: { toString(): string } }>
  publicKey?: { toString(): string }
  request: (args: any) => Promise<any>
}

const DEVNET = clusterApiUrl('devnet')
const connection = new Connection(DEVNET, 'confirmed')

function isRunningInTelegram(): boolean {
  try {
    const hasObj = Boolean((window as any)?.Telegram?.WebApp)
    const qs = new URLSearchParams(window.location.search)
    const hasTgParams = qs.has('tgWebAppPlatform') || qs.has('tgWebAppStartParam')
    return hasObj || hasTgParams
  } catch {
    return false
  }
}

export default function App() {
  const [wallet, setWallet] = useState<PhantomProvider | null>(null)
  const [pubkey, setPubkey] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const provider = (window as any)?.solana as PhantomProvider | undefined
    if (provider?.isPhantom) setWallet(provider)
  }, [])

  async function connectPhantom() {
    try {
      if (!wallet) {
        setStatus('Phantom не найден. Открой во внешнем браузере, где установлен Phantom.')
        return
      }
      const res = await wallet.connect()
      setPubkey(res.publicKey.toString())
      setStatus('Кошелёк подключен ✅')
    } catch (e: any) {
      setStatus('Ошибка подключения: ' + (e?.message || e))
    }
  }

  async function airdropDevnet() {
    try {
      if (!pubkey) return setStatus('Сначала подключи Phantom')
      setStatus('Запрашиваю airdrop 1 SOL…')
      const sig = await connection.requestAirdrop(new PublicKey(pubkey), 1 * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(sig, 'confirmed')
      setStatus('Airdrop зачислен ✅ (1 SOL Devnet)')
    } catch (e: any) {
      setStatus('Airdrop ошибка: ' + (e?.message || e))
    }
  }

  async function createTestMint() {
    try {
      if (!pubkey) return setStatus('Сначала подключи Phantom')

      setStatus('Создаю тестовый mint…')
      const mintAuthority = Keypair.generate()

      const mint = await createMint(
        connection,
        mintAuthority,
        mintAuthority.publicKey,
        null,
        6
      )

      const ata = await getOrCreateAssociatedTokenAccount(
        connection,
        mintAuthority,
        mint,
        new PublicKey(pubkey)
      )

      await mintTo(
        connection,
        mintAuthority,
        mint,
        ata.address,
        mintAuthority.publicKey,
        1_000_000
      )

      setStatus(`Mint создан ✅: ${mint.toBase58()}\nНа ATA зачислено 1 токен`)
    } catch (e: any) {
      setStatus('Mint ошибка: ' + (e?.message || e))
    }
  }

  async function buyMock() {
    if (!pubkey) return setStatus('Подключи Phantom')
    setStatus('Buy (mock): подключим после пула/маркета.')
  }
  async function sellMock() {
    if (!pubkey) return setStatus('Подключи Phantom')
    setStatus('Sell (mock): подключим после пула/маркета.')
  }

  const insideTG = isRunningInTelegram()

  return (
    <div className="app" style={{ paddingTop: insideTG ? 24 : 60 }}>
      <img src="/logo.png" alt="PULMP.FUN" className="logo" />
      <h1>PULMP.FUN</h1>

      <p style={{ marginTop: 8 }}>
        {insideTG ? 'Telegram Mini App запущен ✅' : 'Welcome to the Mini App 🚀'}
      </p>

      {!insideTG && (
        <a className="btn" href="https://t.me/pulmpfunbot?startapp=launch">
          Открыть в Telegram
        </a>
      )}

      <div className="card" style={{ maxWidth: 520, marginTop: 24 }}>
        <h2>Devnet билд</h2>
        <p>Подключи кошелёк и протестируй базовые действия.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn" onClick={connectPhantom}>Connect Phantom</button>
          <button className="btn" onClick={airdropDevnet}>Airdrop 1 SOL</button>
          <button className="btn" onClick={createTestMint}>Create Test Token</button>
          <button onClick={buyMock}>Buy (mock)</button>
          <button onClick={sellMock}>Sell (mock)</button>
        </div>

        <div style={{ marginTop: 12, fontSize: 14, whiteSpace: 'pre-line' }}>
          {pubkey && <>Wallet: <b>{pubkey}</b><br/></>}
          {status && <span>{status}</span>}
        </div>
      </div>

      {!wallet && (
        <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          Если Phantom не обнаружен внутри Telegram — нажми «⋯» → «Открыть в браузере»
          и подключи кошелёк там.
        </p>
      )}
    </div>
  )
}
