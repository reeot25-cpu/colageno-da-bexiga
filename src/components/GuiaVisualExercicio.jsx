import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import AvatarCartoon, { escolherVariacao } from './AvatarCartoon'

// ── Padrões de exercício (inalterados) ───────────────────────────────────────

const PADROES = {
  respiracao: [
    { fase: 'Inspirar', duracao: 4, nivel: 0.2 },
    { fase: 'Expirar', duracao: 6, nivel: 0 },
  ],
  suave: [
    { fase: 'Contrair', duracao: 5, nivel: 1 },
    { fase: 'Relaxar', duracao: 5, nivel: 0 },
  ],
  rapida: [
    { fase: 'Contrair', duracao: 1, nivel: 1 },
    { fase: 'Relaxar', duracao: 1, nivel: 0 },
  ],
  longa: [
    { fase: 'Contrair', duracao: 10, nivel: 1 },
    { fase: 'Relaxar', duracao: 10, nivel: 0 },
  ],
  elevador: [
    { fase: '1º andar', duracao: 2.5, nivel: 0.25 },
    { fase: '2º andar', duracao: 2.5, nivel: 0.5 },
    { fase: '3º andar', duracao: 2.5, nivel: 0.75 },
    { fase: '4º andar', duracao: 2.5, nivel: 1 },
    { fase: 'Segurar', duracao: 2, nivel: 1 },
    { fase: 'Descendo 3º', duracao: 2, nivel: 0.75 },
    { fase: 'Descendo 2º', duracao: 2, nivel: 0.5 },
    { fase: 'Descendo 1º', duracao: 2, nivel: 0.25 },
    { fase: 'Relaxar', duracao: 5, nivel: 0 },
  ],
  relaxamento: [
    { fase: 'Relaxar', duracao: 6, nivel: 0 },
    { fase: 'Respirar', duracao: 4, nivel: 0.1 },
  ],
}

function detectarPadrao(nomeEtapa) {
  const n = nomeEtapa.toLowerCase()
  if (n.includes('respiração') || n.includes('preparo')) return 'respiracao'
  if (n.includes('relaxamento') || n.includes('descanso')) return 'relaxamento'
  if (n.includes('elevador')) return 'elevador'
  if (n.includes('rápida') || n.includes('rápidas')) return 'rapida'
  if (n.includes('suave')) return 'suave'
  if (n.includes('longa') || n.includes('longas')) return 'longa'
  return 'suave'
}

function nivelNoTempo(ciclo, tempo) {
  const durCiclo = ciclo.reduce((s, f) => s + f.duracao, 0)
  if (durCiclo === 0) return { fase: '', nivel: 0, tempoNaFase: 0 }

  const pos = ((tempo % durCiclo) + durCiclo) % durCiclo
  let acum = 0

  for (let i = 0; i < ciclo.length; i++) {
    const f = ciclo[i]
    if (pos < acum + f.duracao) {
      const tNaFase = pos - acum
      const ant = ciclo[(i - 1 + ciclo.length) % ciclo.length]
      const durTrans = Math.min(f.duracao * 0.25, 0.5)
      const t = durTrans > 0 ? Math.min(tNaFase / durTrans, 1) : 1
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t)
      return {
        fase: f.fase,
        nivel: ant.nivel + (f.nivel - ant.nivel) * eased,
        tempoNaFase: tNaFase,
      }
    }
    acum += f.duracao
  }
  return { fase: ciclo[0].fase, nivel: ciclo[0].nivel, tempoNaFase: 0 }
}

function gerarCaminhoOnda(ciclo, duracaoTotal, w, h) {
  const step = Math.max(0.15, duracaoTotal / 600)
  let d = ''
  for (let t = 0; t <= duracaoTotal; t += step) {
    const { nivel } = nivelNoTempo(ciclo, t)
    const x = (t / duracaoTotal) * w
    const y = h - nivel * (h - 4)
    d += `${d ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `
  }
  return d.trim()
}

// ── Áudio guia via Web Speech API ────────────────────────────────────────────

const NOMES_FEMININOS =
  /female|feminin|\bmaria\b|luciana|francisca|fernanda|joana|catarina|helena|c[íi]ntia|ines|in[eê]s|vit[oó]ria|google portugu[eê]s|paulina|isabela|let[íi]cia|ana\b/i
const NOMES_MASCULINOS =
  /\bmale\b|masculin|daniel|jo[aã]o|ricardo|felipe|paulo|ant[oó]nio|antonio|carlos|eduardo|heitor|felix/i

let _vozesCache = []
function _atualizarVozes() {
  const v = window.speechSynthesis?.getVoices()
  if (v && v.length) _vozesCache = v
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  _atualizarVozes()
  window.speechSynthesis.addEventListener?.('voiceschanged', _atualizarVozes)
}

function _vozFeminina() {
  if (!('speechSynthesis' in window)) return null
  const vozes = _vozesCache.length ? _vozesCache : window.speechSynthesis.getVoices() || []
  const pt = vozes.filter((v) => v.lang && v.lang.toLowerCase().startsWith('pt'))
  const ehFem = (v) => NOMES_FEMININOS.test(v.name)
  const ehMasc = (v) => NOMES_MASCULINOS.test(v.name)
  const ptBR = pt.filter((v) => v.lang.toLowerCase().includes('br'))
  return ptBR.find(ehFem) || pt.find(ehFem)
    || vozes.find(ehFem) || ptBR.find((v) => !ehMasc(v))
    || pt.find((v) => !ehMasc(v)) || null
}

const NUMEROS = ['', 'um', 'dois', 'três', 'quatro', 'cinco']

function useAudioGuia(fase, tempoNaFase, ativo, audioAtivo) {
  const faseAnterior = useRef('')
  const segundoAnterior = useRef(-1)

  const falar = useCallback((texto, rate = 1.1) => {
    if (!audioAtivo || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(texto)
    u.rate = rate
    u.pitch = 1.15
    u.volume = 0.9
    const voz = _vozFeminina()
    if (voz) { u.voice = voz; u.lang = voz.lang }
    window.speechSynthesis.speak(u)
  }, [audioAtivo])

  useEffect(() => {
    if (!ativo || !audioAtivo) return

    const ehContrair = /contrai|aperta|andar|segur/i.test(fase)
    const ehRelaxar = /relaxa|solta|expir|descend|descanso/i.test(fase)
    const ehRespirar = /inspir|respir|preparo/i.test(fase)

    if (fase !== faseAnterior.current) {
      faseAnterior.current = fase
      segundoAnterior.current = -1

      if (ehContrair) falar('Aperta')
      else if (ehRelaxar) falar('Solta')
      else if (ehRespirar) falar('Inspire')
    }

    const segAtual = Math.floor(tempoNaFase)
    if (segAtual !== segundoAnterior.current && segAtual > 0) {
      segundoAnterior.current = segAtual
      const num = ((segAtual - 1) % 5) + 1
      if (num <= 5 && (ehContrair || ehRelaxar)) {
        falar(NUMEROS[num], 1.3)
      }
    }
  }, [fase, tempoNaFase, ativo, audioAtivo, falar])

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [])
}

// ── Instrução dinâmica que lê os segundos do gráfico ─────────────────────────

function _formatarSegs(s) {
  if (s === 0.5) return 'meio segundo'
  if (s === 1) return '1 segundo'
  if (s === 1.5) return 'um segundo e meio'
  if (s === 2.5) return 'dois segundos e meio'
  if (s % 1 !== 0) return `${s} segundos`
  return `${s} segundos`
}

export function gerarInstrucaoDinamica(nomeEtapa) {
  const tipo = detectarPadrao(nomeEtapa)
  const ciclo = PADROES[tipo]

  if (tipo === 'elevador') {
    const andares = ciclo.filter((f) => /andar/i.test(f.fase))
    const segurar = ciclo.find((f) => /segur/i.test(f.fase))
    const relaxar = ciclo.find((f) => /relaxar/i.test(f.fase))
    return (
      `Agora é o exercício elevador. ` +
      `Você vai subir ${andares.length} andares, apertando um pouco mais a cada andar, ${_formatarSegs(andares[0]?.duracao || 2.5)} cada. ` +
      (segurar ? `Depois segure no topo por ${_formatarSegs(segurar.duracao)}. ` : '') +
      `Desça devagar, relaxando aos poucos. ` +
      (relaxar ? `Termine com ${_formatarSegs(relaxar.duracao)} de relaxamento total.` : '')
    )
  }

  if (tipo === 'respiracao' || tipo === 'relaxamento') {
    const fases = ciclo.map((f) => `${f.fase.toLowerCase()} por ${_formatarSegs(f.duracao)}`).join(' e ')
    const intro = tipo === 'respiracao'
      ? 'Esta é a fase de respiração e preparo.'
      : 'Esta é a fase de relaxamento final.'
    return `${intro} ${fases.charAt(0).toUpperCase() + fases.slice(1)}. Relaxe os ombros e o abdômen. Acompanhe a bolinha.`
  }

  // suave, rapida, longa
  const contrair = ciclo.find((f) => /contrai/i.test(f.fase))
  const relaxar = ciclo.find((f) => /relaxa/i.test(f.fase))
  const tContrair = contrair?.duracao || 5
  const tRelaxar = relaxar?.duracao || 5

  if (tipo === 'rapida') {
    return (
      `Agora são contrações rápidas. ` +
      `Você tem ${_formatarSegs(tContrair)} para apertar e ${_formatarSegs(tRelaxar)} para soltar. ` +
      `Siga a bolinha no ritmo.`
    )
  }

  return (
    `Aqui abaixo está o exercício de apertar e soltar. ` +
    `Você tem ${_formatarSegs(tContrair)} para apertar e segurar, e ${_formatarSegs(tRelaxar)} para soltar. ` +
    `É só seguir a bolinha: quando ela sobe, você aperta; quando ela desce, você solta. ` +
    `Acompanhe pelo gráfico.`
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function GuiaVisualExercicio({ nomeEtapa, segundosRestantes, duracaoTotal, ativo, audioAtivo, onToggleAudio }) {
  const svgId = useMemo(() => `gve${Math.random().toString(36).slice(2, 8)}`, [])
  const tipo = useMemo(() => detectarPadrao(nomeEtapa), [nomeEtapa])
  const ciclo = PADROES[tipo]
  const [variacao] = useState(() => escolherVariacao())

  const tempoDecorrido = duracaoTotal - segundosRestantes
  const [tempoSmooth, setTempoSmooth] = useState(tempoDecorrido)

  useEffect(() => {
    setTempoSmooth(tempoDecorrido)
  }, [tempoDecorrido])

  useEffect(() => {
    if (!ativo) return
    const interval = setInterval(() => {
      setTempoSmooth((prev) => prev + 0.1)
    }, 100)
    return () => clearInterval(interval)
  }, [ativo, tempoDecorrido])

  const { fase, nivel, tempoNaFase } = useMemo(
    () => nivelNoTempo(ciclo, tempoSmooth),
    [ciclo, tempoSmooth],
  )

  // Contagem de dedos: cicla 1-5 a cada 5 segundos durante contração e relaxamento
  const ehAperta = nivel > 0.2
  const ehFaseAtiva = /contrai|aperta|andar|segur|relaxa|solta|expir|descend/i.test(fase)
  const dedos = ehFaseAtiva
    ? Math.min(Math.floor(tempoNaFase % 5) + 1, 5)
    : 5 // respiração: mão aberta

  // Áudio guia
  useAudioGuia(fase, tempoNaFase, ativo, audioAtivo)

  // ── Gráfico de onda (inalterado) ──────────────────────────────────────────

  const W = 300
  const H = 55
  const caminhoOnda = useMemo(
    () => gerarCaminhoOnda(ciclo, duracaoTotal, W, H),
    [ciclo, duracaoTotal],
  )
  const progresso = duracaoTotal > 0 ? tempoDecorrido / duracaoTotal : 0
  const xProg = Math.min(progresso * W, W)
  const caminhoFill = caminhoOnda
    ? `M 0,${H} ${caminhoOnda.replace(/^M/, 'L')} L${W},${H} Z`
    : ''

  const ALT_BOLA_AREA = 150
  const RAIO_BOLA = 28
  const bolaY = ALT_BOLA_AREA - RAIO_BOLA - nivel * (ALT_BOLA_AREA - RAIO_BOLA * 2)

  const intervaloSegs = Math.max(5, Math.round(duracaoTotal / 6))

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0] w-full">
      {/* Label principal + botão de som */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base transition-all duration-300"
          style={{
            backgroundColor: ehAperta ? '#EDE7F9' : '#E8F8F0',
            color: ehAperta ? '#6B4EA8' : '#3A9B6E',
          }}
        >
          {ehAperta ? '↑' : '↓'}
          <span className="text-lg">{ehAperta ? 'Aperta' : 'Solta'}</span>
        </span>

        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
            style={{
              backgroundColor: audioAtivo ? '#EDE7F9' : 'white',
              borderColor: '#D8CCF0',
            }}
            aria-label={audioAtivo ? 'Desligar áudio guia' : 'Ligar áudio guia'}
          >
            <span className="text-base">{audioAtivo ? '🔊' : '🔇'}</span>
          </button>
        )}
      </div>

      {/* Fase específica + contagem */}
      <div className="text-center mb-3">
        <p
          className="text-xs font-semibold transition-colors duration-300"
          style={{ color: ehAperta ? '#9B7AD6' : '#7B6B9A' }}
        >
          {fase}
          {ehFaseAtiva && (
            <span className="ml-2 text-sm font-bold" style={{ color: ehAperta ? '#6B4EA8' : '#3A9B6E' }}>
              {dedos}
            </span>
          )}
        </p>
      </div>

      {/* Avatar + Bolinha lado a lado */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* Avatar cartoon */}
        <AvatarCartoon nivel={nivel} dedos={dedos} variacao={variacao} />

        {/* Área da bolinha (inalterada) */}
        <div className="flex flex-col items-center">
          <span
            className="text-[11px] font-bold mb-1 transition-colors duration-300"
            style={{ color: ehAperta ? '#6B4EA8' : '#B8A0E0' }}
          >
            Aperta
          </span>

          <svg
            viewBox={`0 0 80 ${ALT_BOLA_AREA}`}
            style={{ width: 80, height: ALT_BOLA_AREA }}
            className="shrink-0"
          >
            <defs>
              <radialGradient id={`${svgId}-bg`}>
                <stop offset="0%" stopColor="#9B7AD6" stopOpacity={ehAperta ? 0.5 : 0.15} />
                <stop offset="100%" stopColor="#9B7AD6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`${svgId}-bola`} cx="40%" cy="35%">
                <stop offset="0%" stopColor={ehAperta ? '#B896E8' : '#D8CCF0'} />
                <stop offset="100%" stopColor={ehAperta ? '#6B4EA8' : '#B8A0E0'} />
              </radialGradient>
            </defs>

            <line x1="40" y1={RAIO_BOLA} x2="40" y2={ALT_BOLA_AREA - RAIO_BOLA} stroke="#D8CCF0" strokeWidth="1" strokeDasharray="3,4" />

            <circle
              cx="40" cy={RAIO_BOLA}
              r={RAIO_BOLA - 1}
              fill="none" stroke="#D8CCF0" strokeWidth="1.5" strokeDasharray="4,3"
            />

            <circle
              cx="40" cy={ALT_BOLA_AREA - RAIO_BOLA}
              r={RAIO_BOLA - 1}
              fill="none" stroke="#D8CCF0" strokeWidth="1.5" strokeDasharray="4,3"
            />

            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="32" y1={ALT_BOLA_AREA - RAIO_BOLA - p * (ALT_BOLA_AREA - RAIO_BOLA * 2)}
                x2="48" y2={ALT_BOLA_AREA - RAIO_BOLA - p * (ALT_BOLA_AREA - RAIO_BOLA * 2)}
                stroke="#EDE7F9" strokeWidth="1"
              />
            ))}

            <circle cx="40" cy={bolaY} r={RAIO_BOLA + 12} fill={`url(#${svgId}-bg)`}>
              <animate attributeName="r" values={`${RAIO_BOLA + 10};${RAIO_BOLA + 16};${RAIO_BOLA + 10}`} dur="2s" repeatCount="indefinite" />
            </circle>

            <circle
              cx="40" cy={bolaY}
              r={RAIO_BOLA}
              fill={`url(#${svgId}-bola)`}
              style={{ transition: 'cy 150ms ease-out' }}
            />

            <ellipse
              cx="34" cy={bolaY - 8}
              rx="6" ry="4"
              fill="white" opacity="0.25"
              style={{ transition: 'cy 150ms ease-out' }}
            />

            <text
              x="40" y={bolaY + 5}
              textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.8"
              style={{ transition: 'y 150ms ease-out' }}
            >
              {ehAperta ? '↑' : '↓'}
            </text>
          </svg>

          <span
            className="text-[11px] font-bold mt-1 transition-colors duration-300"
            style={{ color: !ehAperta ? '#3A9B6E' : '#B8A0E0' }}
          >
            Solta
          </span>
        </div>
      </div>

      {/* Gráfico de onda — Cronograma (inalterado) */}
      <div className="mt-1">
        <p className="text-[10px] text-[#7B6B9A] mb-1.5 text-center font-semibold uppercase tracking-widest">
          Cronograma do exercício
        </p>
        <svg
          viewBox={`0 0 ${W} ${H + 16}`}
          className="w-full"
          style={{ height: 65 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`${svgId}-wg`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9B7AD6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#9B7AD6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#5BB88A" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={`${svgId}-wl`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B4EA8" />
              <stop offset="100%" stopColor="#5BB88A" />
            </linearGradient>
            <clipPath id={`${svgId}-cp`}>
              <rect x="0" y="0" width={xProg} height={H + 16} />
            </clipPath>
          </defs>

          <line x1="0" y1={H} x2={W} y2={H} stroke="#EDE7F9" strokeWidth="1" />
          <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="#EDE7F9" strokeWidth="0.5" strokeDasharray="3,4" />
          <line x1="0" y1="4" x2={W} y2="4" stroke="#EDE7F9" strokeWidth="0.5" strokeDasharray="3,4" />

          {Array.from({ length: Math.floor(duracaoTotal / intervaloSegs) + 1 }, (_, i) => {
            const t = i * intervaloSegs
            if (t > duracaoTotal) return null
            const x = (t / duracaoTotal) * W
            return (
              <g key={i}>
                <line x1={x} y1={H} x2={x} y2={H + 4} stroke="#B8A0E0" strokeWidth="0.5" />
                <text x={x} y={H + 13} textAnchor="middle" fill="#B8A0E0" fontSize="7" fontFamily="sans-serif">
                  {t}s
                </text>
              </g>
            )
          })}

          <path d={caminhoOnda} fill="none" stroke="#D8CCF0" strokeWidth="1.5" />
          <path d={caminhoFill} fill={`url(#${svgId}-wg)`} clipPath={`url(#${svgId}-cp)`} />
          <path d={caminhoOnda} fill="none" stroke={`url(#${svgId}-wl)`} strokeWidth="2.5" clipPath={`url(#${svgId}-cp)`} />

          <line x1={xProg} y1="0" x2={xProg} y2={H} stroke="#6B4EA8" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          <circle
            cx={xProg}
            cy={H - nivel * (H - 4)}
            r="4.5"
            fill={ehAperta ? '#6B4EA8' : '#5BB88A'}
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}
