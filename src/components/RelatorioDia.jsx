import { Link } from 'react-router-dom'
import { X, TrendingDown, TrendingUp, Minus, ShieldCheck, ChevronRight } from 'lucide-react'
import { gerarRelatorio } from '../utils/gerarRelatorio'

// ── Seta de tendência ─────────────────────────────────────────────────────────

function SetaDelta({ delta, campo }) {
  // Para escapes/urgências: delta negativo = melhora (menos = melhor)
  // Para idas: depende se estava acima/abaixo de 8
  if (delta === null) return <Minus size={14} className="text-[#C9B3ED]" />
  if (delta < 0) return <TrendingDown size={14} className="text-emerald-500" />
  if (delta > 0) return <TrendingUp size={14} className="text-red-400" />
  return <Minus size={14} className="text-[#9B8BBB]" />
}

// ── Card de métrica comparativa ───────────────────────────────────────────────

function CardMetricaRelatorio({ item }) {
  const melhora = item.delta !== null && item.delta < 0
  const piora   = item.delta !== null && item.delta > 0

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#EDE7F9] last:border-0">
      <span className="text-lg shrink-0">{item.emoji}</span>
      <div className="flex-1">
        <p className="text-[#3D2B6B] text-sm font-semibold">{item.label}</p>
        <p className="text-[#9B8BBB] text-xs mt-0.5">{item.textoComparativo}</p>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        melhora ? 'bg-emerald-50 text-emerald-600'
        : piora ? 'bg-red-50 text-red-500'
        : 'bg-[#EDE7F9] text-[#9B7AD6]'
      }`}>
        <SetaDelta delta={item.delta} campo={item.campo} />
        <span className="text-[#3D2B6B] font-bold">{item.hoje}</span>
      </div>
    </div>
  )
}

// ── Comparativo semanal ───────────────────────────────────────────────────────

function ComparativoSemanal({ dados }) {
  if (!dados) return null
  const cor = dados.tendencia === 'melhora' ? 'bg-emerald-50 border-emerald-200'
    : dados.tendencia === 'piora' ? 'bg-red-50 border-red-200'
    : 'bg-[#EDE7F9] border-[#D8CCF0]'

  return (
    <div className={`rounded-2xl border p-4 ${cor}`}>
      <p className="font-semibold text-[#3D2B6B] text-sm mb-1">📅 Resumo da semana</p>
      <div className="flex gap-4 mb-2">
        <span className="text-xs text-[#7B6B9A]">
          Média de escapes: <strong className="text-[#3D2B6B]">{dados.mediaEscapes}/dia</strong>
        </span>
        <span className="text-xs text-[#7B6B9A]">
          Urgências: <strong className="text-[#3D2B6B]">{dados.mediaUrgencias}/dia</strong>
        </span>
      </div>
      <p className="text-[#7B6B9A] text-xs leading-relaxed">{dados.mensagem}</p>
    </div>
  )
}

// ── Ícone do cenário ──────────────────────────────────────────────────────────

const ICONE_CENARIO = { bom: '🌟', neutro: '🌷', dificil: '🤗' }
const COR_CENARIO = {
  bom:      'from-[#9B7AD6] to-[#6B4EA8]',
  neutro:   'from-[#B06AAA] to-[#8B4A8A]',
  dificil:  'from-[#7B6B9A] to-[#5B4B7A]',
}

// ── Modal principal ───────────────────────────────────────────────────────────

export default function RelatorioDia({ hoje, ontem, historico, onFechar }) {
  // Gera o relatório (trocar por gerarRelatorioIA() no futuro)
  const rel = gerarRelatorio({ hoje, ontem, historico })

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div
        className="bg-[#EDE7F9] rounded-t-3xl shadow-2xl w-full max-w-lg overflow-y-auto"
        style={{ maxHeight: '92dvh' }}
      >
        {/* Header colorido */}
        <div className={`bg-gradient-to-br ${COR_CENARIO[rel.cenario]} px-6 pt-6 pb-8 rounded-t-3xl`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-wide">Relatório de hoje</p>
              <p className="text-white font-titulo text-2xl font-bold mt-0.5">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <button
              onClick={onFechar}
              className="p-2 rounded-full bg-white/20 active:bg-white/30"
              aria-label="Fechar relatório"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Emoji grande + mensagem principal */}
          <div className="flex gap-4 items-start bg-white/15 rounded-2xl p-4">
            <span className="text-4xl shrink-0">{ICONE_CENARIO[rel.cenario]}</span>
            <p className="text-white text-sm leading-relaxed">{rel.mensagemPrincipal}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 pb-10">

          {/* Análise comparativa dos dados */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] px-4 py-2">
            <p className="font-semibold text-[#3D2B6B] text-sm py-2 border-b border-[#EDE7F9] mb-1">
              📊 Seus números de hoje
            </p>
            {rel.analiseDia.map((item) => (
              <CardMetricaRelatorio key={item.campo} item={item} />
            ))}
          </div>

          {/* Destaque do dia */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-4">
            <p className="font-semibold text-[#3D2B6B] text-sm mb-2">💡 Destaque do dia</p>
            <p className="text-[#7B6B9A] text-sm leading-relaxed">{rel.destaqueDia}</p>
          </div>

          {/* Comparativo semanal */}
          <ComparativoSemanal dados={rel.comparativoSemanal} />

          {/* Sugestão para amanhã */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-4">
            <p className="font-semibold text-[#3D2B6B] text-sm mb-2">🌅 Para amanhã</p>
            <p className="text-[#7B6B9A] text-sm leading-relaxed mb-3">{rel.sugestaoAmanha.texto}</p>
            <Link
              to={rel.sugestaoAmanha.destino}
              onClick={onFechar}
              className="flex items-center justify-between bg-[#EDE7F9] rounded-xl px-4 py-3"
            >
              <span className="text-[#6B4EA8] font-semibold text-sm">{rel.sugestaoAmanha.labelBotao}</span>
              <ChevronRight size={16} className="text-[#9B7AD6]" />
            </Link>
          </div>

          {/* Aviso profissional (só aparece se 3+ dias seguidos piorando) */}
          {rel.avisoProfissional && (
            <div className="bg-white rounded-2xl border border-[#D8CCF0] p-4">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-[#9B7AD6]" />
                </div>
                <div>
                  <p className="font-semibold text-[#3D2B6B] text-sm mb-1">Uma dica com carinho</p>
                  <p className="text-[#7B6B9A] text-xs leading-relaxed">
                    Seus sintomas estão persistindo por alguns dias seguidos. Isso não quer dizer que algo está errado — mas
                    pode ser uma boa hora para conversar com uma médica ou fisioterapeuta especialista em saúde pélvica. Cuidar de você é o melhor investimento 💜
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão fechar */}
          <button
            onClick={onFechar}
            className="w-full py-4 rounded-2xl bg-[#9B7AD6] text-white font-semibold text-base"
          >
            Obrigada! Até amanhã 💜
          </button>
        </div>
      </div>
    </div>
  )
}
