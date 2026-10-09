import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Último saldo que a usuária viu — se o saldo atual for maior, mostramos "+N 🌸".
const CHAVE_VISTO = 'collagenflow_petalas_visto'

function lerVisto() {
  try {
    return parseInt(localStorage.getItem(CHAVE_VISTO) ?? '0', 10) || 0
  } catch {
    return 0
  }
}

// Selo de saldo de Pétalas (tela Início) com animação curta ao ganhar.
export default function SaldoPetalas({ saldo }) {
  // Calculado uma vez ao montar: quanto ela ganhou desde a última vez que viu.
  const [ganho] = useState(() => Math.max(0, saldo - lerVisto()))
  const [mostrarGanho, setMostrarGanho] = useState(ganho > 0)

  useEffect(() => {
    try { localStorage.setItem(CHAVE_VISTO, String(saldo)) } catch { /* ignora */ }
  }, [saldo])

  useEffect(() => {
    if (!mostrarGanho) return
    const t = setTimeout(() => setMostrarGanho(false), 1800)
    return () => clearTimeout(t)
  }, [mostrarGanho])

  return (
    <Link
      to="/progresso#premios"
      className="relative inline-flex items-center gap-1.5 mt-2 ml-2 text-xs font-bold text-[#6B4EA8] bg-white border border-[#D8CCF0] rounded-full px-3 py-1 shadow-sm"
      aria-label={`${saldo} Pétalas. Ver prêmios`}
    >
      <span className={mostrarGanho ? 'anim-petalas-pulso inline-block' : 'inline-block'}>🌸</span>
      {saldo.toLocaleString('pt-BR')} Pétalas
      {mostrarGanho && (
        <span
          aria-hidden="true"
          className="anim-petalas-ganho absolute -top-5 right-1 text-xs font-bold text-[#9B7AD6] whitespace-nowrap pointer-events-none"
        >
          +{ganho.toLocaleString('pt-BR')} 🌸
        </span>
      )}
    </Link>
  )
}
