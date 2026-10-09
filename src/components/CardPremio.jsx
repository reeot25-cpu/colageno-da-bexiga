import { useState } from 'react'
import { Lock } from 'lucide-react'
import { PREMIOS } from '../utils/petalas'

// Card de um prêmio pago com Pétalas. Mostra quanto falta ou o botão de
// desbloquear (com confirmação, porque gastar é definitivo).
// Quando já está desbloqueado, mostra `children` (o conteúdo liberado).
export default function CardPremio({ premio, emoji, titulo, descricao, saldo, desbloqueado, onDesbloquear, children }) {
  const [confirmando, setConfirmando] = useState(false)
  const preco = PREMIOS[premio].preco
  const falta = Math.max(0, preco - saldo)
  const pct = Math.min(100, (saldo / preco) * 100)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold">{titulo}</h3>
        </div>
        <span className={`flex items-center gap-1 font-bold text-xs px-3 py-1 rounded-full shrink-0 ${
          desbloqueado ? 'bg-[#9B7AD6] text-white' : 'bg-[#EDE7F9] text-[#6B4EA8]'
        }`}>
          {desbloqueado ? '✓ Liberado' : <><Lock size={12} /> {preco} 🌸</>}
        </span>
      </div>
      <p className="text-[#7B6B9A] text-sm mb-4">{descricao}</p>

      {desbloqueado ? children : falta > 0 ? (
        <div>
          <div className="bg-[#EDE7F9] rounded-full h-2.5 overflow-hidden">
            <div className="bg-[#9B7AD6] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-[#6B4EA8] font-semibold mt-2 text-center">
            Faltam {falta.toLocaleString('pt-BR')} Pétalas 🌸
          </p>
        </div>
      ) : confirmando ? (
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmando(false)}
            className="flex-1 py-3 rounded-xl border border-[#D8CCF0] text-[#7B6B9A] font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={() => { setConfirmando(false); onDesbloquear() }}
            className="flex-1 py-3 rounded-xl bg-[#9B7AD6] text-white font-semibold active:bg-[#6B4EA8]"
          >
            Usar {preco} 🌸
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmando(true)}
          className="w-full py-3.5 bg-[#9B7AD6] text-white rounded-xl font-semibold text-base active:bg-[#6B4EA8]"
        >
          Desbloquear com {preco} Pétalas 🌸
        </button>
      )}
    </div>
  )
}
