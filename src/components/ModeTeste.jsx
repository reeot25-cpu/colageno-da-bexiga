// Componente só renderiza em desenvolvimento (localhost / 127.0.0.1)
// Em produção (Netlify) não aparece de forma alguma.

import { useState } from 'react'
import { FlaskConical, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { calcularDiaDesbloqueado } from '../hooks/useProgresso'

const CHAVE_OFFSET = 'collagenflow_test_offset'
const EM_DEV = import.meta.env.DEV   // true só no `npm run dev`

export default function ModeTeste({ iniciouEm, onMudar, onReiniciar }) {
  const [aberto, setAberto] = useState(false)
  if (!EM_DEV) return null

  const offsetMs       = parseInt(localStorage.getItem(CHAVE_OFFSET) ?? '0', 10)
  const offsetDias     = Math.round(offsetMs / (1000 * 60 * 60 * 24))
  const diaSimulado    = calcularDiaDesbloqueado(iniciouEm)

  function mudarOffset(delta) {
    const novoOffset = Math.max(offsetMs + delta * 1000 * 60 * 60 * 24, 0)
    localStorage.setItem(CHAVE_OFFSET, String(novoOffset))
    onMudar()
  }

  function resetarOffset() {
    localStorage.removeItem(CHAVE_OFFSET)
    onMudar()
  }

  return (
    <div className="fixed top-3 right-3 z-[200] text-xs">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 font-bold px-3 py-1.5 rounded-full shadow-lg"
      >
        <FlaskConical size={13} />
        TESTE · Dia {diaSimulado}
        {aberto ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {aberto && (
        <div className="mt-2 bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 shadow-xl w-56 flex flex-col gap-3">
          <p className="font-bold text-yellow-800">Modo de Teste</p>
          <p className="text-yellow-700 leading-snug">
            Simulando <strong>Dia {diaSimulado}</strong><br />
            (+{offsetDias} dia{offsetDias !== 1 ? 's' : ''} artificiais)
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => mudarOffset(-1)}
              disabled={offsetDias === 0}
              className="flex-1 py-1.5 bg-yellow-200 text-yellow-900 font-bold rounded-lg disabled:opacity-30"
            >
              − 1 dia
            </button>
            <button
              onClick={() => mudarOffset(+1)}
              className="flex-1 py-1.5 bg-yellow-400 text-yellow-900 font-bold rounded-lg"
            >
              + 1 dia
            </button>
          </div>

          <button
            onClick={resetarOffset}
            className="flex items-center justify-center gap-1 py-1.5 bg-white border border-yellow-300 text-yellow-700 rounded-lg"
          >
            <RotateCcw size={11} /> Voltar ao dia real
          </button>

          <button
            onClick={() => { onReiniciar(); resetarOffset() }}
            className="py-1.5 bg-red-100 text-red-700 font-bold rounded-lg border border-red-200"
          >
            🗑 Reiniciar do zero
          </button>

          <p className="text-yellow-600 italic text-[10px] text-center">
            Visível só em localhost — nunca em produção
          </p>
        </div>
      )}
    </div>
  )
}
