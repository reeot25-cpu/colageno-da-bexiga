import { useState } from 'react'
import { ChevronLeft, ChevronRight, Droplets, Zap, AlertTriangle } from 'lucide-react'
import { useDiario } from '../hooks/useDiario'

// ── helpers ──────────────────────────────────────────────────────────────────

function mesmoDia(a, b) {
  return a.toDateString() === b.toDateString()
}

function labelData(data) {
  const hoje = new Date()
  const ontem = new Date(); ontem.setDate(hoje.getDate() - 1)
  if (mesmoDia(data, hoje))  return 'Hoje'
  if (mesmoDia(data, ontem)) return 'Ontem'
  return data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function labelDataCompleto(data) {
  return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── componentes internos ──────────────────────────────────────────────────────

function Contador({ valor, onChange, cor, desabilitado }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(valor - 1)}
        disabled={desabilitado || valor <= 0}
        className="w-10 h-10 rounded-full bg-white border-2 border-[#D8CCF0] text-[#9B7AD6] text-xl font-bold flex items-center justify-center active:bg-[#EDE7F9] disabled:opacity-30 transition-colors"
        aria-label="Diminuir"
      >
        −
      </button>
      <span
        className="text-4xl font-bold w-12 text-center leading-none"
        style={{ color: cor }}
      >
        {valor}
      </span>
      <button
        onClick={() => onChange(valor + 1)}
        disabled={desabilitado}
        className="w-10 h-10 rounded-full text-white text-xl font-bold flex items-center justify-center active:opacity-80 transition-opacity"
        style={{ backgroundColor: cor }}
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  )
}

function CardMetrica({ icone: Icone, titulo, descricao, campo, valor, cor, bgCor, onChange, ehHoje }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgCor }}>
          <Icone size={20} style={{ color: cor }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#3D2B6B] text-base leading-tight">{titulo}</p>
          <p className="text-[#9B8BBB] text-xs mt-0.5 leading-snug">{descricao}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Contador valor={valor} onChange={onChange} cor={cor} desabilitado={!ehHoje} />
        {valor > 0 && (
          <div
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: bgCor, color: cor }}
          >
            {campo === 'idas'
              ? valor <= 8 ? 'Normal' : 'Elevado'
              : campo === 'urgencias'
              ? valor === 0 ? '' : valor <= 2 ? 'Leve' : 'Atenção'
              : valor === 0 ? '' : 'Registrado'}
          </div>
        )}
      </div>
    </div>
  )
}

function MiniBarHistorico({ entrada, label, isHoje }) {
  if (!entrada && !isHoje) {
    return (
      <div className="flex flex-col items-center gap-1 flex-1">
        <div className="w-full h-16 rounded-lg bg-[#F0EEF8] flex items-end justify-center pb-1">
          <span className="text-[9px] text-[#C9B3ED]">—</span>
        </div>
        <span className="text-[9px] text-[#9B8BBB] text-center">{label}</span>
      </div>
    )
  }
  const idas      = entrada?.idas ?? 0
  const urgencias = entrada?.urgencias ?? 0
  const escapes   = entrada?.escapes ?? 0
  const maxAltura = 48
  const maxIda = 15
  const hIda = Math.min((idas / maxIda) * maxAltura, maxAltura)
  const hUrg = Math.min((urgencias / 6) * maxAltura, maxAltura)
  const hEsc = Math.min((escapes / 3) * maxAltura, maxAltura)

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full h-16 rounded-lg bg-[#F0EEF8] flex items-end justify-center gap-0.5 px-1 pb-1 relative">
        {isHoje && (
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#9B7AD6]" />
        )}
        <div className="w-2.5 rounded-t-sm" style={{ height: hIda || 2, backgroundColor: '#9B7AD6' }} title={`${idas} idas`} />
        <div className="w-2.5 rounded-t-sm" style={{ height: hUrg || 2, backgroundColor: '#E8A020' }} title={`${urgencias} urgências`} />
        <div className="w-2.5 rounded-t-sm" style={{ height: hEsc || 2, backgroundColor: '#D05050' }} title={`${escapes} escapes`} />
      </div>
      <span className="text-[9px] text-[#9B8BBB] text-center">{label}</span>
    </div>
  )
}

// ── página principal ──────────────────────────────────────────────────────────

export default function Diario() {
  const hoje = new Date()
  const [dataAtiva, setDataAtiva] = useState(hoje)
  const { obterDia, salvar, historico } = useDiario()

  const ehHoje = mesmoDia(dataAtiva, hoje)
  const entrada = obterDia(dataAtiva)
  const hist = historico(7)

  function mudarDia(delta) {
    const nova = new Date(dataAtiva)
    nova.setDate(nova.getDate() + delta)
    if (nova <= hoje) setDataAtiva(nova)
  }

  function atualizar(campo, valor) {
    salvar(dataAtiva, campo, valor)
  }

  const metricas = [
    {
      campo: 'idas',
      titulo: 'Idas ao banheiro',
      descricao: 'Total de vezes que foi urinar no dia. O normal é 6 a 8 vezes.',
      icone: Droplets,
      cor: '#9B7AD6',
      bgCor: '#EDE7F9',
    },
    {
      campo: 'urgencias',
      titulo: 'Urgências',
      descricao: 'Vezes que precisou correr ao banheiro com vontade súbita e intensa.',
      icone: Zap,
      cor: '#C07A10',
      bgCor: '#FFF5E0',
    },
    {
      campo: 'escapes',
      titulo: 'Escapes',
      descricao: 'Episódios de perda involuntária de urina (qualquer quantidade).',
      icone: AlertTriangle,
      cor: '#B83030',
      bgCor: '#FDE8E8',
    },
  ]

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B]">Diário da Bexiga</h1>
        <p className="text-[#7B6B9A] text-sm mt-1">Registre seus sintomas diários em segundos</p>
      </div>

      {/* Navegação de data */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => mudarDia(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-[#EDE7F9] active:bg-[#D8CCF0] transition-colors"
          aria-label="Dia anterior"
        >
          <ChevronLeft size={18} className="text-[#9B7AD6]" />
        </button>

        <div className="text-center">
          <p className="font-semibold text-[#3D2B6B] text-base capitalize">{labelData(dataAtiva)}</p>
          <p className="text-[#9B8BBB] text-xs capitalize">{labelDataCompleto(dataAtiva)}</p>
        </div>

        <button
          onClick={() => mudarDia(+1)}
          disabled={ehHoje}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-[#EDE7F9] active:bg-[#D8CCF0] disabled:opacity-30 transition-colors"
          aria-label="Próximo dia"
        >
          <ChevronRight size={18} className="text-[#9B7AD6]" />
        </button>
      </div>

      {/* Aviso dias anteriores */}
      {!ehHoje && (
        <div className="bg-[#FFF5E0] border border-[#D4AF7A] rounded-2xl px-4 py-3">
          <p className="text-[#7A5A20] text-sm text-center">
            Você está vendo um registro anterior. Para editar, volte para <strong>Hoje</strong>.
          </p>
        </div>
      )}

      {/* Métricas */}
      {metricas.map((m) => (
        <CardMetrica
          key={m.campo}
          {...m}
          valor={entrada[m.campo]}
          ehHoje={ehHoje}
          onChange={(v) => atualizar(m.campo, v)}
        />
      ))}

      {/* Legenda referência rápida */}
      <div className="bg-[#EDE7F9] rounded-2xl p-4">
        <p className="text-[#6B4EA8] text-xs font-semibold mb-2">Referência rápida</p>
        <div className="flex flex-col gap-1">
          <p className="text-[#7B6B9A] text-xs">🟣 <strong>Idas:</strong> 6–8x/dia é considerado normal</p>
          <p className="text-[#7B6B9A] text-xs">🟡 <strong>Urgência:</strong> fale com médica se for frequente</p>
          <p className="text-[#7B6B9A] text-xs">🔴 <strong>Escapes:</strong> qualquer episódio merece atenção</p>
        </div>
      </div>

      {/* Histórico 7 dias */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-4">
        <p className="font-semibold text-[#3D2B6B] text-sm mb-3">Últimos 7 dias</p>
        <div className="flex gap-1.5">
          {hist.map(({ data, entrada: e, chave }) => (
            <MiniBarHistorico
              key={chave}
              entrada={e}
              label={labelData(data) === 'Hoje' ? 'Hoje' : data.toLocaleDateString('pt-BR', { weekday: 'narrow' })}
              isHoje={mesmoDia(data, hoje)}
            />
          ))}
        </div>
        {/* Legenda do gráfico */}
        <div className="flex gap-3 mt-3 justify-center">
          <span className="flex items-center gap-1 text-[10px] text-[#7B6B9A]">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#9B7AD6' }} />Idas
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#7B6B9A]">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#E8A020' }} />Urgências
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#7B6B9A]">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#D05050' }} />Escapes
          </span>
        </div>
      </div>

      {/* Aviso médico */}
      <p className="text-center text-xs text-[#9B8BBB] leading-relaxed px-2 pb-2">
        Este diário é um registro pessoal. Não substitui avaliação médica. Se notar piora dos sintomas, consulte uma profissional de saúde.
      </p>
    </div>
  )
}
