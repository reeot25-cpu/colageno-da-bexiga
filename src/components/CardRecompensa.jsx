import { Gift } from 'lucide-react'
import { faixaDesconto, FAIXAS_DESCONTO } from '../utils/acesso'

// "Recompensa do dia 21" (tela Início): níveis conquistados e quanto falta para
// o próximo. Usa o total de Pétalas GANHAS, não o saldo.
// Antes do dia 21 NÃO menciona assinatura, desconto, cupom nem porcentagem —
// a recompensa (desconto) só é revelada na TelaBloqueio.
export default function CardRecompensa({ ganhas }) {
  const { atual, proxima, faltam } = faixaDesconto(ganhas)
  const nivel = atual?.faixa ?? 0
  const base = atual?.minimoPetalas ?? 0
  const pct = proxima ? Math.min(100, ((ganhas - base) / (proxima.minimoPetalas - base)) * 100) : 100
  const fmt = (n) => n.toLocaleString('pt-BR')

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
          <Gift size={24} className="text-[#9B7AD6]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#3D2B6B] text-base">Recompensa do dia 21</p>
          <p className="text-[#7B6B9A] text-sm">Suas Pétalas viram uma recompensa no dia 21</p>
        </div>
        <div className="flex gap-0.5 shrink-0" aria-label={`Nível ${nivel} de ${FAIXAS_DESCONTO.length}`}>
          {FAIXAS_DESCONTO.map((f) => (
            <span key={f.faixa} className={`text-lg ${f.faixa <= nivel ? '' : 'grayscale opacity-30'}`}>🌸</span>
          ))}
        </div>
      </div>
      <div className="bg-[#EDE7F9] rounded-full h-2 overflow-hidden mt-3">
        <div className="bg-[#9B7AD6] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[#6B4EA8] text-sm font-semibold mt-2">
        {proxima ? `Faltam ${fmt(faltam)} Pétalas para o próximo nível` : 'Você alcançou o nível máximo 🎉'}
      </p>
      <p className="text-[#9B8BBB] text-xs mt-1 leading-snug">
        {fmt(ganhas)} Pétalas ganhas no total — contando o que você já usou em prêmios.
      </p>
    </div>
  )
}
