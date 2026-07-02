import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, Droplets, Zap, AlertTriangle,
  TrendingDown, TrendingUp, Minus, Heart, ShieldCheck, BarChart2,
} from 'lucide-react'
import { useDiario } from '../hooks/useDiario'
import RelatorioDia from '../components/RelatorioDia'

// ── helpers ───────────────────────────────────────────────────────────────────

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

// Compara média dos últimos 3 dias vs 3 dias anteriores para detectar melhora
function calcularTendencia(hist14, campo) {
  const comDados = hist14.filter((h) => h.entrada !== null)
  if (comDados.length < 4) return null
  const recentes  = comDados.slice(-3).map((h) => h.entrada[campo])
  const anteriores = comDados.slice(-6, -3).map((h) => h.entrada[campo])
  if (anteriores.length === 0) return null
  const mediaRec = recentes.reduce((s, v) => s + v, 0) / recentes.length
  const mediaAnt = anteriores.reduce((s, v) => s + v, 0) / anteriores.length
  if (mediaAnt === 0) return null
  const diff = mediaAnt - mediaRec          // positivo = diminuiu = melhora
  const pct  = Math.round(Math.abs(diff / mediaAnt) * 100)
  return { melhora: diff > 0.3, piora: diff < -0.3, pct, mediaRec: +mediaRec.toFixed(1), mediaAnt: +mediaAnt.toFixed(1) }
}

// ── Gráfico de linha SVG ──────────────────────────────────────────────────────

function GraficoLinha({ pontos, cor, altura = 64, vazio }) {
  if (vazio || pontos.every((p) => p === null)) {
    return (
      <div className="flex items-center justify-center h-16 text-[#C9B3ED] text-xs">
        Registre mais dias para ver a evolução
      </div>
    )
  }

  const W = 280
  const H = altura
  const PAD = 8
  const validos = pontos.filter((p) => p !== null)
  const maxVal = Math.max(...validos, 1)

  // mapeia índice → coordenada X, valor → coordenada Y (invertido: maior = mais alto na tela = menor Y)
  const xDe = (i) => PAD + (i / (pontos.length - 1)) * (W - PAD * 2)
  const yDe = (v) => H - PAD - ((v / maxVal) * (H - PAD * 2))

  // constrói o path apenas pelos pontos não-nulos
  let path = ''
  let area = ''
  const pts = pontos
    .map((v, i) => (v !== null ? { x: xDe(i), y: yDe(v), v } : null))
    .filter(Boolean)

  if (pts.length === 1) {
    // só um ponto: desenha círculo
    path = null
  } else {
    path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    area = `${path} L${pts.at(-1).x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: altura }}>
      {/* Área preenchida */}
      {area && <path d={area} fill={cor} fillOpacity="0.10" />}
      {/* Linha */}
      {path && <path d={path} fill="none" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {/* Pontos */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={cor} strokeWidth="2" />
      ))}
      {/* Ponto único */}
      {pts.length === 1 && (
        <circle cx={pts[0].x} cy={pts[0].y} r="5" fill={cor} />
      )}
    </svg>
  )
}

// ── Mensagem de incentivo ─────────────────────────────────────────────────────

const mensagensEscapes = [
  { emoji: '🌸', texto: 'Uau! Seus escapes diminuíram {pct}% nos últimos dias. O seu assoalho pélvico está ficando mais forte — continue com os exercícios, você está no caminho certo!' },
  { emoji: '💜', texto: 'Que conquista linda! Os escapes caíram {pct}% comparando com antes. Cada exercício que você fez contou. Sua constância está transformando seu corpo.' },
  { emoji: '✨', texto: 'Você está melhorando de verdade! Menos {pct}% de escapes em relação aos dias anteriores. Isso é resultado do seu cuidado e dedicação. Continue assim!' },
]
const mensagensUrgencias = [
  { emoji: '🌿', texto: 'As urgências reduziram {pct}% — você está ganhando mais controle e isso é incrível! Os exercícios pélvicos estão fazendo efeito.' },
  { emoji: '💪', texto: 'Menos corridas ao banheiro em pânico! Queda de {pct}% nas urgências. Seu assoalho pélvico está respondendo ao treino.' },
]

function calcMensagem(tendencia, tipo) {
  if (!tendencia?.melhora) return null
  const lista = tipo === 'escapes' ? mensagensEscapes : mensagensUrgencias
  const m = lista[Math.floor(Math.random() * lista.length)]
  return { emoji: m.emoji, texto: m.texto.replace('{pct}', tendencia.pct) }
}

function CardIncentivo({ mensagem }) {
  if (!mensagem) return null
  return (
    <div className="bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] rounded-2xl p-5 shadow-md text-white">
      <div className="flex gap-3 items-start">
        <span className="text-3xl shrink-0">{mensagem.emoji}</span>
        <div>
          <p className="font-semibold text-white text-sm leading-snug mb-1">Você está melhorando!</p>
          <p className="text-[#E0D4F8] text-sm leading-relaxed">{mensagem.texto}</p>
        </div>
      </div>
    </div>
  )
}

// ── Painel de evolução ────────────────────────────────────────────────────────

function SetaTendencia({ tendencia }) {
  if (!tendencia) return <Minus size={14} className="text-[#C9B3ED]" />
  if (tendencia.melhora) return <TrendingDown size={14} className="text-emerald-500" />
  if (tendencia.piora)   return <TrendingUp   size={14} className="text-red-400" />
  return <Minus size={14} className="text-[#C9B3ED]" />
}

function PainelEvolucao({ hist14, metricas }) {
  const [metricaAtiva, setMetricaAtiva] = useState('escapes')
  const m = metricas.find((x) => x.campo === metricaAtiva)
  const pontos = hist14.map((h) => (h.entrada !== null ? h.entrada[metricaAtiva] : null))
  const labels = hist14.map((h) => {
    const d = h.data
    const hoje = new Date()
    if (mesmoDia(d, hoje)) return 'Hj'
    return d.toLocaleDateString('pt-BR', { weekday: 'narrow' })
  })
  const tendencia = calcularTendencia(hist14, metricaAtiva)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-[#3D2B6B] text-base">Evolução — 14 dias</p>
        {tendencia && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            tendencia.melhora
              ? 'bg-emerald-50 text-emerald-600'
              : tendencia.piora
              ? 'bg-red-50 text-red-500'
              : 'bg-[#EDE7F9] text-[#9B7AD6]'
          }`}>
            <SetaTendencia tendencia={tendencia} />
            {tendencia.melhora
              ? `−${tendencia.pct}% melhorando`
              : tendencia.piora
              ? `+${tendencia.pct}% atenção`
              : 'estável'}
          </div>
        )}
      </div>

      {/* Seletor de métrica */}
      <div className="flex gap-2 mb-4">
        {metricas.map((mx) => {
          const tend = calcularTendencia(hist14, mx.campo)
          return (
            <button
              key={mx.campo}
              onClick={() => setMetricaAtiva(mx.campo)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                metricaAtiva === mx.campo
                  ? 'text-white shadow-sm'
                  : 'bg-[#F5F0FF] text-[#9B8BBB]'
              }`}
              style={metricaAtiva === mx.campo ? { backgroundColor: mx.cor } : {}}
            >
              <mx.icone size={14} />
              <span>{mx.labelCurto}</span>
              <SetaTendencia tendencia={tend} />
            </button>
          )
        })}
      </div>

      {/* Gráfico SVG */}
      <GraficoLinha
        pontos={pontos}
        cor={m.cor}
        vazio={pontos.every((p) => p === null)}
      />

      {/* Labels dos dias abaixo */}
      <div className="flex mt-1">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center text-[8px] text-[#C9B3ED]">{l}</span>
        ))}
      </div>

      {tendencia && (
        <p className="text-[#9B8BBB] text-xs text-center mt-3">
          Média recente: <strong style={{ color: m.cor }}>{tendencia.mediaRec}</strong> &nbsp;·&nbsp; Antes: <strong className="text-[#9B8BBB]">{tendencia.mediaAnt}</strong>
        </p>
      )}
    </div>
  )
}

// ── Contadores ────────────────────────────────────────────────────────────────

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
      <span className="text-4xl font-bold w-12 text-center leading-none" style={{ color: cor }}>
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
  const badge =
    campo === 'idas'
      ? valor === 0 ? null : valor <= 8 ? { txt: 'Normal', bg: '#E8F5E9', c: '#2E7D32' } : { txt: 'Elevado', bg: bgCor, c: cor }
      : campo === 'urgencias'
      ? valor === 0 ? null : valor <= 2 ? { txt: 'Leve', bg: '#FFF9E6', c: '#B07A00' } : { txt: 'Atenção', bg: bgCor, c: cor }
      : valor === 0 ? null : { txt: `${valor} registrado${valor > 1 ? 's' : ''}`, bg: bgCor, c: cor }

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
        {badge && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: badge.bg, color: badge.c }}>
            {badge.txt}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Diario() {
  const hoje = new Date()
  const [dataAtiva, setDataAtiva] = useState(hoje)
  const { obterDia, salvar, historico } = useDiario()

  const [relatorioAberto, setRelatorioAberto] = useState(false)

  const ehHoje = mesmoDia(dataAtiva, hoje)
  const entrada = obterDia(dataAtiva)
  const hist14  = historico(14)

  // Dados de ontem para comparativo
  const ontem = (() => {
    const d = new Date(dataAtiva); d.setDate(d.getDate() - 1)
    const e = obterDia(d)
    return (e.idas === 0 && e.urgencias === 0 && e.escapes === 0) ? null : e
  })()

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
      labelCurto: 'Idas',
      titulo: 'Idas ao banheiro',
      descricao: 'Total de vezes que foi urinar no dia. O normal é 6–8 vezes.',
      icone: Droplets,
      cor: '#9B7AD6',
      bgCor: '#EDE7F9',
    },
    {
      campo: 'urgencias',
      labelCurto: 'Urgência',
      titulo: 'Urgências',
      descricao: 'Vezes que precisou correr ao banheiro com vontade súbita e intensa.',
      icone: Zap,
      cor: '#C07A10',
      bgCor: '#FFF5E0',
    },
    {
      campo: 'escapes',
      labelCurto: 'Escapes',
      titulo: 'Escapes',
      descricao: 'Episódios de perda involuntária de urina (qualquer quantidade).',
      icone: AlertTriangle,
      cor: '#B83030',
      bgCor: '#FDE8E8',
    },
  ]

  // Mensagens de incentivo baseadas em tendência
  const tendEscapes   = calcularTendencia(hist14, 'escapes')
  const tendUrgencias = calcularTendencia(hist14, 'urgencias')
  const mensagemEsc = calcMensagem(tendEscapes, 'escapes')
  const mensagemUrg = calcMensagem(tendUrgencias, 'urgencias')
  const mensagemAtiva = mensagemEsc ?? mensagemUrg

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">

      {/* Header */}
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B]">Diário da Bexiga</h1>
        <p className="text-[#7B6B9A] text-sm mt-1">Registre seus sintomas diários em segundos</p>
      </div>

      {/* Mensagem de incentivo (aparece quando há melhora detectada) */}
      {mensagemAtiva && <CardIncentivo mensagem={mensagemAtiva} />}

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
            Registro anterior — apenas leitura. Para editar, volte para <strong>Hoje</strong>.
          </p>
        </div>
      )}

      {/* Métricas do dia */}
      {metricas.map((m) => (
        <CardMetrica
          key={m.campo}
          {...m}
          valor={entrada[m.campo]}
          ehHoje={ehHoje}
          onChange={(v) => atualizar(m.campo, v)}
        />
      ))}

      {/* Botão relatório — só aparece no dia atual */}
      {ehHoje && (
        <button
          onClick={() => setRelatorioAberto(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#9B7AD6] to-[#6B4EA8] text-white font-semibold text-base shadow-md active:opacity-90 transition-opacity"
        >
          <BarChart2 size={20} />
          Ver meu relatório de hoje
        </button>
      )}

      {/* Gráfico de evolução */}
      <PainelEvolucao hist14={hist14} metricas={metricas} />

      {/* Aviso de saúde — destacado */}
      <div className="bg-white rounded-2xl border border-[#D8CCF0] p-5 shadow-sm">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-[#9B7AD6]" />
          </div>
          <div>
            <p className="font-semibold text-[#3D2B6B] text-sm mb-1">Aviso importante</p>
            <p className="text-[#7B6B9A] text-xs leading-relaxed">
              Este diário é um <strong>acompanhamento pessoal de bem-estar</strong>, não um diagnóstico médico. Ele ajuda você a perceber padrões e motivar sua rotina de cuidados.
            </p>
            <p className="text-[#7B6B9A] text-xs leading-relaxed mt-2">
              Se os sintomas <strong>piorarem, persistirem ou causarem desconforto</strong>, procure uma médica ou fisioterapeuta especialista em saúde pélvica.
            </p>
          </div>
        </div>
      </div>

      {/* Referência rápida */}
      <div className="bg-[#EDE7F9] rounded-2xl p-4">
        <p className="text-[#6B4EA8] text-xs font-semibold mb-2 flex items-center gap-1">
          <Heart size={12} /> Referência rápida
        </p>
        <div className="flex flex-col gap-1.5">
          <p className="text-[#7B6B9A] text-xs">🟣 <strong>Idas:</strong> 6–8x/dia é o intervalo considerado normal</p>
          <p className="text-[#7B6B9A] text-xs">🟡 <strong>Urgência frequente:</strong> pode indicar bexiga hiperativa — vale consultar</p>
          <p className="text-[#7B6B9A] text-xs">🔴 <strong>Escapes:</strong> qualquer episódio merece atenção e cuidado</p>
        </div>
      </div>

    </div>

    {/* Modal de relatório */}
    {relatorioAberto && (
      <RelatorioDia
        hoje={entrada}
        ontem={ontem}
        historico={hist14}
        onFechar={() => setRelatorioAberto(false)}
      />
    )}
  )
}
