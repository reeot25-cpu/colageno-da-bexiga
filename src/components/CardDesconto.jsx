import { Ticket } from 'lucide-react'
import { faixaDesconto } from '../utils/acesso'

// "Seu desconto na assinatura" (tela Início): faixa atual e quanto falta
// para a próxima. Usa o total de Pétalas GANHAS, não o saldo.
export default function CardDesconto({ ganhas }) {
  const { atual, proxima, faltam } = faixaDesconto(ganhas)
  const base = atual?.minimoPetalas ?? 0
  const pct = proxima ? Math.min(100, ((ganhas - base) / (proxima.minimoPetalas - base)) * 100) : 100
  const fmt = (n) => n.toLocaleString('pt-BR')

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
          <Ticket size={24} className="text-[#9B7AD6]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#3D2B6B] text-base">Seu desconto na assinatura</p>
          <p className="text-[#7B6B9A] text-sm">
            {!atual && `Faltam ${fmt(faltam)} Pétalas para ${proxima.desconto}% de desconto`}
            {atual && proxima && `Você já tem ${atual.desconto}% · faltam ${fmt(faltam)} para ${proxima.desconto}%`}
            {atual && !proxima && `Você chegou ao desconto máximo de ${atual.desconto}% 🎉`}
          </p>
        </div>
        {atual && (
          <span className="text-sm font-bold text-white bg-[#9B7AD6] px-2.5 py-1 rounded-full shrink-0">
            {atual.desconto}%
          </span>
        )}
      </div>
      <div className="bg-[#EDE7F9] rounded-full h-2 overflow-hidden mt-3">
        <div className="bg-[#9B7AD6] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[#9B8BBB] text-xs mt-2 leading-snug">
        {fmt(ganhas)} Pétalas ganhas no total — conta tudo o que você ganhou, mesmo o que já usou em prêmios.
      </p>
    </div>
  )
}
