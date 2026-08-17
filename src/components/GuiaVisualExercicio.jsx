import { useState, useEffect, useMemo } from 'react'

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
  if (durCiclo === 0) return { fase: '', nivel: 0 }

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
      }
    }
    acum += f.duracao
  }
  return { fase: ciclo[0].fase, nivel: ciclo[0].nivel }
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

// ── Avatar da instrutora com mãos animadas ──────────────────────────────────
function AvatarInstrutora({ nivel }) {
  const yMao = nivel * 22
  const xIn = nivel * 8

  return (
    <svg viewBox="0 0 100 140" className="shrink-0" style={{ width: 88, height: 123 }}>
      {/* Cabelo traseiro */}
      <path
        d="M26,36 C26,10 74,10 74,36 C79,55 77,72 74,82 L26,82 C23,72 21,55 26,36Z"
        fill="#2D1B4E"
      />

      {/* Pescoço */}
      <rect x="42" y="78" width="16" height="12" rx="5" fill="#C68B59" />

      {/* Corpo / blusa */}
      <path
        d="M20,104 C27,88 42,87 50,87 C58,87 73,88 80,104 L84,140 L16,140Z"
        fill="#9B7AD6"
      />
      <path d="M42,87 Q50,97 58,87" fill="#EDE7F9" />

      {/* Braço esquerdo + mão */}
      <g
        style={{
          transform: `translate(${xIn}px, ${-yMao}px)`,
          transition: 'transform 180ms ease-out',
        }}
      >
        <line x1="20" y1="104" x2="4" y2="128" stroke="#C68B59" strokeWidth="6" strokeLinecap="round" />
        <circle cx="2" cy="130" r="5.5" fill="#C68B59" />
        <line x1="-2" y1="127" x2="-4" y2="122" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="126" x2="-1" y2="121" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="125" x2="3" y2="120" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="126" x2="6" y2="121" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Braço direito + mão */}
      <g
        style={{
          transform: `translate(${-xIn}px, ${-yMao}px)`,
          transition: 'transform 180ms ease-out',
        }}
      >
        <line x1="80" y1="104" x2="96" y2="128" stroke="#C68B59" strokeWidth="6" strokeLinecap="round" />
        <circle cx="98" cy="130" r="5.5" fill="#C68B59" />
        <line x1="94" y1="126" x2="93" y2="121" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="96" y1="125" x2="96" y2="120" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="99" y1="126" x2="100" y2="121" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
        <line x1="101" y1="127" x2="103" y2="122" stroke="#C68B59" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Rosto */}
      <ellipse cx="50" cy="54" rx="22" ry="27" fill="#C68B59" />

      {/* Cabelo frente */}
      <path d="M28,40 C30,22 48,14 52,20 C44,26 36,36 34,46Z" fill="#2D1B4E" />
      <path d="M72,40 C70,22 52,14 48,20 C56,26 64,36 66,46Z" fill="#2D1B4E" opacity="0.6" />

      {/* Olhos */}
      <ellipse cx="40" cy="49" rx="2.8" ry="3.2" fill="#2D1B4E" />
      <ellipse cx="60" cy="49" rx="2.8" ry="3.2" fill="#2D1B4E" />
      <circle cx="41.5" cy="48" r="1" fill="white" />
      <circle cx="61.5" cy="48" r="1" fill="white" />

      {/* Sobrancelhas */}
      <path d="M35,43 Q40,40 45,43" fill="none" stroke="#2D1B4E" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M55,43 Q60,40 65,43" fill="none" stroke="#2D1B4E" strokeWidth="1.3" strokeLinecap="round" />

      {/* Nariz */}
      <path d="M50,52 Q48,58 50,60" fill="none" stroke="#A87048" strokeWidth="0.8" />

      {/* Sorriso — muda com o nível */}
      <path
        d={`M42,${66 - nivel * 1.5} Q50,${73 - nivel * 3} 58,${66 - nivel * 1.5}`}
        fill="none"
        stroke="#B87060"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: 'd 200ms' }}
      />

      {/* Bochechas */}
      <circle cx="34" cy="60" r="4.5" fill="#E8907A" opacity="0.18" />
      <circle cx="66" cy="60" r="4.5" fill="#E8907A" opacity="0.18" />
    </svg>
  )
}

export default function GuiaVisualExercicio({ nomeEtapa, segundosRestantes, duracaoTotal, ativo }) {
  const svgId = useMemo(() => `gve${Math.random().toString(36).slice(2, 8)}`, [])
  const tipo = useMemo(() => detectarPadrao(nomeEtapa), [nomeEtapa])
  const ciclo = PADROES[tipo]

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

  const { fase, nivel } = useMemo(
    () => nivelNoTempo(ciclo, tempoSmooth),
    [ciclo, tempoSmooth],
  )

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

  const ehAperta = nivel > 0.2
  const ALT_BOLA_AREA = 150
  const RAIO_BOLA = 28
  const bolaY = ALT_BOLA_AREA - RAIO_BOLA - nivel * (ALT_BOLA_AREA - RAIO_BOLA * 2)

  const intervaloSegs = Math.max(5, Math.round(duracaoTotal / 6))

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0] w-full">
      {/* Label principal */}
      <div className="text-center mb-2">
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
      </div>

      {/* Fase específica */}
      <p
        className="text-center text-xs font-semibold mb-3 transition-colors duration-300"
        style={{ color: ehAperta ? '#9B7AD6' : '#7B6B9A' }}
      >
        {fase}
      </p>

      {/* Avatar + Bolinha lado a lado */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* Avatar */}
        <AvatarInstrutora nivel={nivel} />

        {/* Área da bolinha */}
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

            {/* Linha guia vertical */}
            <line x1="40" y1={RAIO_BOLA} x2="40" y2={ALT_BOLA_AREA - RAIO_BOLA} stroke="#D8CCF0" strokeWidth="1" strokeDasharray="3,4" />

            {/* Círculo-alvo pontilhado no topo */}
            <circle
              cx="40" cy={RAIO_BOLA}
              r={RAIO_BOLA - 1}
              fill="none" stroke="#D8CCF0" strokeWidth="1.5" strokeDasharray="4,3"
            />

            {/* Círculo-alvo pontilhado na base */}
            <circle
              cx="40" cy={ALT_BOLA_AREA - RAIO_BOLA}
              r={RAIO_BOLA - 1}
              fill="none" stroke="#D8CCF0" strokeWidth="1.5" strokeDasharray="4,3"
            />

            {/* Marcas intermediárias */}
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="32" y1={ALT_BOLA_AREA - RAIO_BOLA - p * (ALT_BOLA_AREA - RAIO_BOLA * 2)}
                x2="48" y2={ALT_BOLA_AREA - RAIO_BOLA - p * (ALT_BOLA_AREA - RAIO_BOLA * 2)}
                stroke="#EDE7F9" strokeWidth="1"
              />
            ))}

            {/* Brilho de fundo */}
            <circle cx="40" cy={bolaY} r={RAIO_BOLA + 12} fill={`url(#${svgId}-bg)`}>
              <animate attributeName="r" values={`${RAIO_BOLA + 10};${RAIO_BOLA + 16};${RAIO_BOLA + 10}`} dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Bolinha principal */}
            <circle
              cx="40" cy={bolaY}
              r={RAIO_BOLA}
              fill={`url(#${svgId}-bola)`}
              style={{ transition: 'cy 150ms ease-out' }}
            />

            {/* Reflexo de luz */}
            <ellipse
              cx="34" cy={bolaY - 8}
              rx="6" ry="4"
              fill="white" opacity="0.25"
              style={{ transition: 'cy 150ms ease-out' }}
            />

            {/* Seta dentro da bola */}
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

      {/* Gráfico de onda — Cronograma */}
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

          {/* Grid */}
          <line x1="0" y1={H} x2={W} y2={H} stroke="#EDE7F9" strokeWidth="1" />
          <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="#EDE7F9" strokeWidth="0.5" strokeDasharray="3,4" />
          <line x1="0" y1="4" x2={W} y2="4" stroke="#EDE7F9" strokeWidth="0.5" strokeDasharray="3,4" />

          {/* Marcadores de tempo */}
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

          {/* Onda completa — clara */}
          <path d={caminhoOnda} fill="none" stroke="#D8CCF0" strokeWidth="1.5" />

          {/* Preenchimento concluído */}
          <path d={caminhoFill} fill={`url(#${svgId}-wg)`} clipPath={`url(#${svgId}-cp)`} />

          {/* Onda concluída — destaque com gradiente */}
          <path d={caminhoOnda} fill="none" stroke={`url(#${svgId}-wl)`} strokeWidth="2.5" clipPath={`url(#${svgId}-cp)`} />

          {/* Indicador de progresso */}
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
