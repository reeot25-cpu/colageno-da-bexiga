// Avatar cartoon inclusivo com mão contadora de dedos.
// Para adicionar variações: acrescente objetos ao array VARIACOES.
// A troca é sequencial a cada nova sessão do app.

const VARIACOES = [
  { pele: '#FCDCC8', peleSombra: '#E8BCA8', cabelo: '#4A2B20', estilo: 'lisoLongo', idade: false },
  { pele: '#F0C8A0', peleSombra: '#D4AC84', cabelo: '#C4A882', estilo: 'onduladoMedio', idade: false },
  { pele: '#C68B59', peleSombra: '#A87048', cabelo: '#1A1A1A', estilo: 'cacheado', idade: false },
  { pele: '#8B5E3C', peleSombra: '#704A2E', cabelo: '#2D1B4E', estilo: 'afro', idade: false },
  { pele: '#5C3A1E', peleSombra: '#442A14', cabelo: '#0D0D0D', estilo: 'curto', idade: false },
  { pele: '#F5D0B0', peleSombra: '#D8B494', cabelo: '#B0B0B0', estilo: 'lisoCurto', idade: true },
  { pele: '#A0704A', peleSombra: '#8A5C3A', cabelo: '#E8E0E0', estilo: 'cacheadoCurto', idade: true },
  { pele: '#3B2415', peleSombra: '#2A1A0E', cabelo: '#1A1A1A', estilo: 'onduladoMedio', idade: false },
]

const CABELO_TRASEIRO = {
  lisoLongo:      'M26,36 C26,12 74,12 74,36 C78,55 76,75 74,88 L26,88 C24,75 22,55 26,36Z',
  onduladoMedio:  'M26,36 C26,14 74,14 74,36 C76,52 78,68 72,80 L28,80 C22,68 24,52 26,36Z',
  cacheado:       'M24,38 C22,12 78,12 76,38 C80,58 78,78 74,86 L26,86 C22,78 20,58 24,38Z',
  afro:           'M18,42 C16,8 84,8 82,42 C86,62 82,82 76,90 L24,90 C18,82 14,62 18,42Z',
  curto:          'M28,38 C28,18 72,18 72,38 C74,50 72,60 70,66 L30,66 C28,60 26,50 28,38Z',
  lisoCurto:      'M30,38 C30,18 70,18 70,38 C72,50 70,58 68,64 L32,64 C30,58 28,50 30,38Z',
  cacheadoCurto:  'M26,40 C24,16 76,16 74,40 C78,56 74,68 70,72 L30,72 C26,68 22,56 26,40Z',
}

const CABELO_FRENTE = {
  lisoLongo:      [
    { d: 'M28,40 C30,22 48,14 52,20 C44,26 36,36 34,46Z', op: 1 },
    { d: 'M72,40 C70,22 52,14 48,20 C56,26 64,36 66,46Z', op: 0.6 },
  ],
  onduladoMedio:  [
    { d: 'M28,38 C32,20 46,16 50,22 C42,28 36,38 34,46Z', op: 1 },
    { d: 'M72,38 C68,20 54,16 50,22 C58,28 64,38 66,46Z', op: 0.7 },
    { d: 'M26,50 C24,44 30,36 34,44 Q30,50 28,52Z', op: 0.5 },
  ],
  cacheado:       [
    { d: 'M26,42 C28,20 46,12 52,20 C44,28 34,40 32,48Z', op: 1 },
    { d: 'M74,42 C72,20 54,12 48,20 C56,28 66,40 68,48Z', op: 0.8 },
    { d: 'M30,48 Q26,40 32,34 Q36,40 32,48Z', op: 0.5 },
    { d: 'M70,48 Q74,40 68,34 Q64,40 68,48Z', op: 0.5 },
  ],
  afro:           [
    { d: 'M22,46 C24,18 48,8 52,18 C42,26 30,42 28,50Z', op: 0.9 },
    { d: 'M78,46 C76,18 52,8 48,18 C58,26 70,42 72,50Z', op: 0.9 },
    { d: 'M24,52 Q20,42 28,36 Q32,44 26,52Z', op: 0.5 },
    { d: 'M76,52 Q80,42 72,36 Q68,44 74,52Z', op: 0.5 },
  ],
  curto:          [
    { d: 'M30,40 C34,24 48,18 52,24 C46,30 38,40 36,46Z', op: 1 },
    { d: 'M70,40 C66,24 52,18 48,24 C54,30 62,40 64,46Z', op: 0.6 },
  ],
  lisoCurto:      [
    { d: 'M32,40 C36,26 48,20 52,26 C46,32 40,40 38,44Z', op: 1 },
    { d: 'M68,40 C64,26 52,20 48,26 C54,32 60,40 62,44Z', op: 0.6 },
  ],
  cacheadoCurto:  [
    { d: 'M28,42 C32,22 48,16 52,22 C44,28 36,42 34,48Z', op: 0.9 },
    { d: 'M72,42 C68,22 52,16 48,22 C56,28 64,42 66,48Z', op: 0.8 },
  ],
}

// Dedos da mão: 5 paths individuais (vistos de frente, palma para fora)
function MaoContagem({ dedos, corPele, espelho }) {
  const escala = espelho ? 'scale(-1,1)' : ''
  const fantasma = 0.15

  return (
    <g transform={`translate(${espelho ? 50 : 0}, 0) ${escala}`}>
      {/* Palma */}
      <ellipse cx="25" cy="38" rx="12" ry="10" fill={corPele} />

      {/* Dedo 1 — mindinho (mais à esquerda) */}
      <rect x="5" y="14" width="6" height="20" rx="3" fill={corPele}
        opacity={dedos >= 5 ? 1 : fantasma}
        style={{ transition: 'opacity 120ms' }}
      />

      {/* Dedo 2 — anelar */}
      <rect x="13" y="8" width="6.5" height="24" rx="3.2" fill={corPele}
        opacity={dedos >= 4 ? 1 : fantasma}
        style={{ transition: 'opacity 120ms' }}
      />

      {/* Dedo 3 — médio */}
      <rect x="21.5" y="4" width="7" height="28" rx="3.5" fill={corPele}
        opacity={dedos >= 3 ? 1 : fantasma}
        style={{ transition: 'opacity 120ms' }}
      />

      {/* Dedo 4 — indicador */}
      <rect x="30" y="8" width="6.5" height="24" rx="3.2" fill={corPele}
        opacity={dedos >= 2 ? 1 : fantasma}
        style={{ transition: 'opacity 120ms' }}
      />

      {/* Dedo 5 — polegar (mais à direita, mais curto e inclinado) */}
      <rect x="38" y="22" width="7" height="16" rx="3.5" fill={corPele}
        opacity={dedos >= 1 ? 1 : fantasma}
        style={{ transition: 'opacity 120ms' }}
        transform="rotate(-20, 41, 30)"
      />
    </g>
  )
}

export function escolherVariacao() {
  const CHAVE = 'collagenflow_avatar_seq'
  let idx = 0
  try {
    const salvo = localStorage.getItem(CHAVE)
    idx = salvo !== null ? (parseInt(salvo, 10) + 1) % VARIACOES.length : 0

    const sessaoKey = 'collagenflow_avatar_sessao'
    const sessaoAtual = sessionStorage.getItem(sessaoKey)
    if (sessaoAtual !== null) {
      return VARIACOES[parseInt(sessaoAtual, 10) % VARIACOES.length]
    }

    localStorage.setItem(CHAVE, String(idx))
    sessionStorage.setItem(sessaoKey, String(idx))
  } catch { /* fallback */ }
  return VARIACOES[idx % VARIACOES.length]
}

export default function AvatarCartoon({ nivel, dedos, variacao }) {
  const v = variacao
  const yBraco = nivel * 18
  const traseiro = CABELO_TRASEIRO[v.estilo] || CABELO_TRASEIRO.lisoLongo
  const frente = CABELO_FRENTE[v.estilo] || CABELO_FRENTE.lisoLongo

  const bochechaOp = v.pele.startsWith('#F') || v.pele.startsWith('#E') ? 0.2 : 0.12

  return (
    <svg viewBox="0 0 100 155" className="shrink-0" style={{ width: 90, height: 140 }}>
      {/* Cabelo traseiro */}
      <path d={traseiro} fill={v.cabelo} />

      {/* Pescoço */}
      <rect x="42" y="78" width="16" height="12" rx="5" fill={v.pele} />

      {/* Corpo / blusa */}
      <path
        d="M20,104 C27,88 42,87 50,87 C58,87 73,88 80,104 L84,145 L16,145Z"
        fill="#9B7AD6"
      />
      <path d="M42,87 Q50,97 58,87" fill="#EDE7F9" />

      {/* Braço esquerdo + mão com dedos */}
      <g style={{
        transform: `translate(0px, ${-yBraco}px)`,
        transition: 'transform 180ms ease-out',
      }}>
        <line x1="20" y1="104" x2="2" y2="120" stroke={v.pele} strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(-22, 88) scale(0.6)">
          <MaoContagem dedos={dedos} corPele={v.pele} espelho={false} />
        </g>
      </g>

      {/* Braço direito (gesto simples — acompanha o nível) */}
      <g style={{
        transform: `translate(0px, ${-yBraco}px)`,
        transition: 'transform 180ms ease-out',
      }}>
        <line x1="80" y1="104" x2="98" y2="120" stroke={v.pele} strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(72, 88) scale(0.6)">
          <MaoContagem dedos={dedos} corPele={v.pele} espelho={true} />
        </g>
      </g>

      {/* Rosto */}
      <ellipse cx="50" cy="54" rx="22" ry="27" fill={v.pele} />

      {/* Cabelo frente */}
      {frente.map((f, i) => (
        <path key={i} d={f.d} fill={v.cabelo} opacity={f.op} />
      ))}

      {/* Olhos */}
      <ellipse cx="40" cy="49" rx="2.8" ry="3.2" fill="#2D1B4E" />
      <ellipse cx="60" cy="49" rx="2.8" ry="3.2" fill="#2D1B4E" />
      <circle cx="41.5" cy="48" r="1" fill="white" />
      <circle cx="61.5" cy="48" r="1" fill="white" />

      {/* Sobrancelhas */}
      <path d="M35,43 Q40,40 45,43" fill="none" stroke={v.cabelo} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <path d="M55,43 Q60,40 65,43" fill="none" stroke={v.cabelo} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />

      {/* Nariz */}
      <path d="M50,52 Q48,58 50,60" fill="none" stroke={v.peleSombra} strokeWidth="0.8" />

      {/* Sorriso — muda com o nível */}
      <path
        d={`M42,${66 - nivel * 1.5} Q50,${73 - nivel * 3} 58,${66 - nivel * 1.5}`}
        fill="none"
        stroke={v.peleSombra}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: 'd 200ms' }}
      />

      {/* Bochechas */}
      <circle cx="34" cy="60" r="4.5" fill="#E8907A" opacity={bochechaOp} />
      <circle cx="66" cy="60" r="4.5" fill="#E8907A" opacity={bochechaOp} />

      {/* Linhas de expressão (idade) */}
      {v.idade && (
        <>
          <line x1="32" y1="50" x2="30" y2="53" stroke={v.peleSombra} strokeWidth="0.5" opacity="0.4" />
          <line x1="68" y1="50" x2="70" y2="53" stroke={v.peleSombra} strokeWidth="0.5" opacity="0.4" />
          <line x1="33" y1="64" x2="31" y2="66" stroke={v.peleSombra} strokeWidth="0.4" opacity="0.3" />
          <line x1="67" y1="64" x2="69" y2="66" stroke={v.peleSombra} strokeWidth="0.4" opacity="0.3" />
        </>
      )}
    </svg>
  )
}
