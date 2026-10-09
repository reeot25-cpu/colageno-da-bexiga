import { Link } from 'react-router-dom'
import { TrendingDown } from 'lucide-react'
import { calcularEvolucao, lerDiario } from '../utils/evolucao'

const fmt = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const SELO = {
  menos: { texto: '↓ menos', classe: 'bg-[#9B7AD6] text-white' },
  igual: { texto: '= estável', classe: 'bg-[#EDE7F9] text-[#6B4EA8]' },
  mais:  { texto: '↑ mais',  classe: 'bg-[#F5F2FB] text-[#7B6B9A]' },
}

function Linha({ rotulo, dados }) {
  const selo = SELO[dados.tendencia]
  return (
    <div className="flex items-center justify-between gap-3 bg-[#F5F0FF] rounded-xl px-3 py-2.5">
      <div className="text-left">
        <p className="text-sm font-semibold text-[#3D2B6B]">{rotulo}</p>
        <p className="text-xs text-[#7B6B9A]">
          média {fmt(dados.antes)} → {fmt(dados.agora)} por dia
        </p>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${selo.classe}`}>{selo.texto}</span>
    </div>
  )
}

function mensagem(ev) {
  const menos = [
    ev.escapes.tendencia === 'menos' && 'escapes',
    ev.urgencias.tendencia === 'menos' && 'urgências',
  ].filter(Boolean)
  if (menos.length) return `Seus registros mostram menos ${menos.join(' e ')} nos últimos dias. 💜`
  return 'Cada corpo tem seu ritmo. Continuar registrando ajuda você a acompanhar como está se sentindo. 💜'
}

// "Sua evolução" — compara os 3 primeiros dias registrados no Diário com os 3 últimos.
// Com menos de 6 dias, convida a preencher o Diário (ou não mostra nada, se convite=false).
// Descreve só o que a usuária anotou: nunca promete cura nem resultado.
export default function CardEvolucao({ convite = true }) {
  const ev = calcularEvolucao(lerDiario())

  if (!ev.suficiente) {
    if (!convite) return null
    return (
      <Link to="/diario" className="block">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-dashed border-[#C9B3ED] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
            <TrendingDown size={24} className="text-[#9B7AD6]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#3D2B6B] text-base">Sua evolução</p>
            <p className="text-[#7B6B9A] text-sm">
              Registre mais {ev.faltam} dia{ev.faltam > 1 ? 's' : ''} no Diário para acompanhar
              seus escapes e urgências ao longo do tempo.
            </p>
            <p className="text-[#9B7AD6] text-sm font-semibold mt-1">Abrir diário →</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] text-left">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={18} className="text-[#9B7AD6]" />
        <p className="font-semibold text-[#3D2B6B] text-base">Sua evolução</p>
      </div>
      <div className="flex flex-col gap-2">
        <Linha rotulo="Escapes" dados={ev.escapes} />
        <Linha rotulo="Urgências" dados={ev.urgencias} />
      </div>
      <p className="text-[#6B4EA8] text-sm mt-3 leading-snug">{mensagem(ev)}</p>
      <p className="text-[#9B8BBB] text-xs mt-2 leading-snug">
        Média dos seus 3 primeiros dias registrados comparada aos 3 últimos, com base no que você
        anotou ({ev.diasRegistrados} dias). Não substitui avaliação profissional.
      </p>
    </div>
  )
}
