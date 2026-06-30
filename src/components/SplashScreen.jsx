import { useEffect, useState } from 'react'

// Mostra apenas na primeira abertura de cada sessão
const JA_MOSTROU = 'collagenflow_splash_shown'

export default function SplashScreen({ onDone }) {
  // fase: 'show' → 'fade' → 'done'
  const [fase, setFase] = useState(() =>
    sessionStorage.getItem(JA_MOSTROU) ? 'done' : 'show'
  )

  useEffect(() => {
    if (fase === 'done') { onDone(); return }

    // Após 1.6s começa o fade-out (400ms de transição)
    const t1 = setTimeout(() => setFase('fade'), 1600)
    // Após o fade, desmonta e avisa o pai
    const t2 = setTimeout(() => { setFase('done'); onDone() }, 2000)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fase === 'done') sessionStorage.setItem(JA_MOSTROU, '1')
  }, [fase])

  if (fase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#9B7AD6',
        opacity: fase === 'fade' ? 0 : 1,
        transition: 'opacity 400ms ease-in-out',
      }}
      aria-hidden="true"
    >
      {/* Logo */}
      <img
        src="/icon-512.png"
        alt="CollagenFlow"
        className="w-32 h-32 rounded-3xl shadow-2xl"
        style={{
          transform: fase === 'fade' ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 400ms ease-in-out',
        }}
      />

      {/* Nome do app */}
      <p
        className="font-titulo text-white text-3xl font-bold mt-6 tracking-wide"
        style={{
          opacity: fase === 'fade' ? 0 : 1,
          transition: 'opacity 400ms ease-in-out',
        }}
      >
        CollagenFlow
      </p>

      {/* Tagline suave */}
      <p className="text-white/70 text-sm mt-2 tracking-wide">
        seu ritual de bem-estar
      </p>
    </div>
  )
}
