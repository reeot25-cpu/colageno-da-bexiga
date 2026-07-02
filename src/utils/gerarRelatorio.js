// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE RELATÓRIO DIÁRIO — CollagenFlow
//
// Função principal: gerarRelatorio(params) → RelatorioData
//
// PARA SUBSTITUIR POR IA NO FUTURO:
// 1. Crie async function gerarRelatorioIA(params) com a mesma assinatura
// 2. Monte o prompt a partir de params (exemplo no bloco PROMPT_TEMPLATE abaixo)
// 3. Chame a API (Anthropic Claude / OpenAI) e parse o JSON retornado
// 4. Retorne um objeto com a mesma forma de RelatorioData
// 5. Substitua a chamada em RelatorioDia.jsx: gerarRelatorio → gerarRelatorioIA
//
// PROMPT_TEMPLATE (para uso futuro com IA):
// const prompt = `
//   Você é uma assistente de bem-estar feminino acolhedora e não-punitiva.
//   A usuária registrou hoje no diário:
//   - Idas ao banheiro: ${params.hoje.idas} (ontem: ${params.ontem?.idas ?? 'sem dado'})
//   - Urgências: ${params.hoje.urgencias} (ontem: ${params.ontem?.urgencias ?? 'sem dado'})
//   - Escapes: ${params.hoje.escapes} (ontem: ${params.ontem?.escapes ?? 'sem dado'})
//   Histórico 7 dias (JSON): ${JSON.stringify(params.historico)}
//   Gere um relatório no formato JSON com campos:
//   cenario, analiseDia, mensagemPrincipal, destaqueDia, sugestaoAmanha, comparativoSemanal, avisoProfissional
// `
// ─────────────────────────────────────────────────────────────────────────────

// ── tipos de dados ────────────────────────────────────────────────────────────
// params: {
//   hoje:     { idas, urgencias, escapes }
//   ontem:    { idas, urgencias, escapes } | null
//   historico: [{ data, chave, entrada }]   // últimos 14 dias
// }
//
// RelatorioData: {
//   cenario:             'bom' | 'neutro' | 'dificil'
//   analiseDia:          [{ campo, label, emoji, hoje, ontem, delta, textoComparativo }]
//   mensagemPrincipal:   string
//   destaqueDia:         string
//   sugestaoAmanha:      { texto, destino, labelBotao }
//   comparativoSemanal:  null | { mediaEscapes, tendencia, mensagem }
//   avisoProfissional:   boolean
// }

// ── helpers ───────────────────────────────────────────────────────────────────

function delta(hoje, ontem) {
  if (ontem === null || ontem === undefined) return null
  return hoje - ontem
}

function sinal(d) {
  if (d === null) return 'neutro'
  if (d < 0) return 'melhora'
  if (d > 0) return 'piora'
  return 'neutro'
}

function textoComparativo(campo, hoje, ontem) {
  if (ontem === null || ontem === undefined) return `${hoje} registrado${hoje !== 1 ? 's' : ''} hoje`
  const d = hoje - ontem
  if (d < 0)  return `${hoje} hoje — ${Math.abs(d)} a menos que ontem 🌸`
  if (d > 0)  return `${hoje} hoje — ${d} a mais que ontem`
  return `${hoje} hoje — igual a ontem`
}

function calcularCenario(hoje, ontem) {
  if (!ontem) return 'neutro'
  // Peso: escapes têm peso 3, urgências peso 2, idas peso 1
  const scoreHoje  = hoje.escapes * 3 + hoje.urgencias * 2 + Math.max(hoje.idas - 8, 0)
  const scoreOntem = ontem.escapes * 3 + ontem.urgencias * 2 + Math.max(ontem.idas - 8, 0)
  const diff = scoreHoje - scoreOntem
  if (diff <= -1) return 'bom'
  if (diff >= 2)  return 'dificil'
  return 'neutro'
}

function diasSeguindoPiorando(historico) {
  // Retorna quantos dias consecutivos (do mais recente para trás) a pontuação piorou
  const comDados = historico.filter((h) => h.entrada !== null).slice(-7)
  if (comDados.length < 2) return 0
  let count = 0
  for (let i = comDados.length - 1; i >= 1; i--) {
    const e  = comDados[i].entrada
    const ep = comDados[i - 1].entrada
    const scoreAtual  = e.escapes  * 3 + e.urgencias  * 2
    const scoreAnterior = ep.escapes * 3 + ep.urgencias * 2
    if (scoreAtual > scoreAnterior) count++
    else break
  }
  return count
}

function calcularComparativoSemanal(historico) {
  const semanaAtual   = historico.slice(-7).filter((h) => h.entrada !== null)
  const semanaAnterior = historico.slice(-14, -7).filter((h) => h.entrada !== null)
  if (semanaAtual.length < 3) return null

  const media = (arr, campo) =>
    arr.length ? +(arr.reduce((s, h) => s + h.entrada[campo], 0) / arr.length).toFixed(1) : null

  const mediaEsc  = media(semanaAtual, 'escapes')
  const mediaUrg  = media(semanaAtual, 'urgencias')
  const mediaIda  = media(semanaAtual, 'idas')
  const mediaEscAnt = media(semanaAnterior, 'escapes')

  let tendencia = 'estavel'
  let mensagem  = `Esta semana você teve em média ${mediaEsc} escape${mediaEsc !== 1 ? 's' : ''} e ${mediaUrg} urgência${mediaUrg !== 1 ? 's' : ''} por dia. Continue assim! 💜`

  if (mediaEscAnt !== null) {
    if (mediaEsc < mediaEscAnt - 0.3) {
      tendencia = 'melhora'
      const pct = Math.round(((mediaEscAnt - mediaEsc) / Math.max(mediaEscAnt, 1)) * 100)
      mensagem = `Incrível! Seus escapes caíram ${pct}% em relação à semana passada. Seu assoalho pélvico está respondendo ao treino! 🌸`
    } else if (mediaEsc > mediaEscAnt + 0.3) {
      tendencia = 'piora'
      mensagem = `Esta semana foi um pouco mais difícil, mas você não desistiu — e isso é o que importa. Continue registrando e praticando. 💜`
    }
  }

  return { mediaEscapes: mediaEsc, mediaUrgencias: mediaUrg, mediaIda, tendencia, mensagem }
}

// ── banco de mensagens ────────────────────────────────────────────────────────

const MENSAGENS = {
  bom: [
    'Que dia incrível! Seus números mostram que seu assoalho pélvico está ficando mais forte. Continue assim 💜',
    'Parabéns! Cada exercício que você fez hoje fez diferença real. Você está no caminho certo 🌸',
    'Seus resultados de hoje são motivo de comemoração! A constância está transformando seu corpo 🌺',
  ],
  neutro: [
    'Manter a estabilidade também é uma vitória! Cada dia de prática conta — amanhã foque um pouco mais nos exercícios 🌷',
    'Você está aqui, registrando e cuidando de você mesma. Isso já é muito! Continue com o ritual amanhã 💜',
    'Dias estáveis são parte do processo. O segredo está na constância — e você está mostrando isso! 🌸',
  ],
  dificil: [
    'Tudo bem! Dias difíceis fazem parte do processo. O importante é que você está aqui, registrando e cuidando de você. Amanhã é um novo começo 💜',
    'Não se cobre, tá? Seu corpo tem dias bons e dias mais desafiadores. O que importa é não parar 🌸',
    'Você veio aqui registrar mesmo num dia difícil — isso diz muito sobre você. Amanhã vai ser diferente 💜',
  ],
}

const DESTAQUES = {
  bom: [
    'O exercício de contração rápida contribui muito para reduzir escapes — continue priorizando! 🧘‍♀️',
    'A hidratação e o chá do protocolo ajudam a manter a bexiga estável. Ótimo trabalho hoje! 🌿',
    'Seu comprometimento com os exercícios pélvicos está fazendo efeito. Não pare! 💪',
  ],
  neutro: [
    'Amanhã, tente focar um pouco mais no exercício de contração lenta — ele é excelente para urgências 🧘‍♀️',
    'Uma dica para amanhã: faça o exercício de hoje com mais atenção à respiração. Faz toda a diferença 🌿',
    'Tente completar todas as tarefas do ritual amanhã — cada item tem um papel na sua recuperação 💜',
  ],
  dificil: [
    'Para amanhã, foque no exercício de contração e relaxamento — ele é o mais indicado para escapes 🧘‍♀️',
    'O exercício de Kegel lento é seu aliado nos dias mais difíceis. Comece amanhã com calma 🌸',
    'Tente o exercício de respiração diafragmática amanhã — ajuda a relaxar a bexiga hiperativa 🌿',
  ],
}

const SUGESTOES_AMANHA = {
  bom: { texto: 'Continue com os exercícios pélvicos — sua consistência é sua maior força!', destino: '/exercicios', labelBotao: 'Ver exercícios' },
  neutro: { texto: 'Amanhã priorize o exercício do dia e tente completar o ritual completo 💜', destino: '/progresso', labelBotao: 'Ver ritual do dia' },
  dificil: { texto: 'Amanhã foque nos exercícios pélvicos — eles são o melhor remédio para dias assim', destino: '/exercicios', labelBotao: 'Ir para exercícios' },
}

// ── função principal ──────────────────────────────────────────────────────────

export function gerarRelatorio({ hoje, ontem, historico }) {
  const cenario = calcularCenario(hoje, ontem)

  const analiseDia = [
    {
      campo: 'escapes',
      label: 'Escapes',
      emoji: '🔴',
      hoje: hoje.escapes,
      ontem: ontem?.escapes ?? null,
      delta: delta(hoje.escapes, ontem?.escapes),
      textoComparativo: textoComparativo('escapes', hoje.escapes, ontem?.escapes),
    },
    {
      campo: 'urgencias',
      label: 'Urgências',
      emoji: '🟡',
      hoje: hoje.urgencias,
      ontem: ontem?.urgencias ?? null,
      delta: delta(hoje.urgencias, ontem?.urgencias),
      textoComparativo: textoComparativo('urgencias', hoje.urgencias, ontem?.urgencias),
    },
    {
      campo: 'idas',
      label: 'Idas ao banheiro',
      emoji: '🟣',
      hoje: hoje.idas,
      ontem: ontem?.idas ?? null,
      delta: delta(hoje.idas, ontem?.idas),
      textoComparativo: textoComparativo('idas', hoje.idas, ontem?.idas),
    },
  ]

  const idx = new Date().getDay()
  const mensagemPrincipal = MENSAGENS[cenario][idx % MENSAGENS[cenario].length]
  const destaqueDia       = DESTAQUES[cenario][idx % DESTAQUES[cenario].length]
  const sugestaoAmanha    = SUGESTOES_AMANHA[cenario]
  const comparativoSemanal = calcularComparativoSemanal(historico)
  const diasPiorando      = diasSeguindoPiorando(historico)
  const avisoProfissional = diasPiorando >= 3

  return {
    cenario,
    analiseDia,
    mensagemPrincipal,
    destaqueDia,
    sugestaoAmanha,
    comparativoSemanal,
    avisoProfissional,
  }
}
