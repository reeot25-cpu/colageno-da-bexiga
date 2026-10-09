// ─────────────────────────────────────────────────────────────────────────────
// PÉTALAS 🌸 — moeda de engajamento do CollagenFlow (100% localStorage)
//
// O saldo NÃO é guardado: é recalculado a partir dos registros que já existem
// (ritual, histórico de treinos e diário). Assim vale também para tudo o que a
// usuária fez antes desta função existir. Só os GASTOS ficam salvos, em
// `collagenflow_petalas_gastos`.
//
//   saldo = ganhos (calculados) − gastos (salvos), nunca abaixo de 0
// ─────────────────────────────────────────────────────────────────────────────

import { diasRitual } from '../data/ritual'
import { ehDona } from '../hooks/useAcesso'

export const VALORES = {
  tarefaRitual: 5,
  diaRitualCompleto: 20,
  treino: 10,
  treinosMaxPorDia: 2,
  diarioPreenchido: 10,
  bonusSemanaTreino: 50, // a cada bloco de 7 dias seguidos de treino
}

export const PREMIOS = {
  treinoCompleto: { preco: 500, nome: 'Treino Completo (10 min)' },
  avatar: { preco: 150, nome: 'Escolher a aparência do avatar' },
}

const CHAVE_GASTOS = 'collagenflow_petalas_gastos'
const DIA_MS = 86400000

// ── Leitura dos registros existentes ─────────────────────────────────────────

function lerJson(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao
  } catch {
    return padrao
  }
}

export function lerRegistros() {
  return {
    concluidas: lerJson('colageno_progresso', {})?.concluidas ?? {},
    treinos: lerJson('collagenflow_historico_exercicios', []),
    diario: lerJson('collagenflow_diario', {}),
  }
}

// ── Datas e sequências ───────────────────────────────────────────────────────

// Aceita "2026-10-9" (treinos) e "2026-10-09" (diário). Devolve dia em UTC (ms),
// para que a diferença entre dias seja sempre exatamente 24h.
function diaUtc(texto) {
  const [a, m, d] = String(texto).split('-').map(Number)
  return Date.UTC(a, m - 1, d)
}

// Tamanho de cada sequência de dias consecutivos, ex.: [3, 7, 1]
export function sequencias(datas) {
  const dias = [...new Set(datas.map(diaUtc))].filter(Number.isFinite).sort((a, b) => a - b)
  const resultado = []
  let atual = 0
  dias.forEach((dia, i) => {
    atual = i > 0 && dia - dias[i - 1] === DIA_MS ? atual + 1 : 1
    if (i === dias.length - 1 || dias[i + 1] - dia !== DIA_MS) resultado.push(atual)
  })
  return resultado
}

const maior = (lista) => (lista.length ? Math.max(...lista) : 0)

// ── Ganhos ───────────────────────────────────────────────────────────────────

export function calcularGanhos({ concluidas, treinos, diario }) {
  const tarefas = diasRitual.flatMap((d) => d.tarefas).filter((t) => concluidas[t.id]).length
  const diasCompletos = diasRitual.filter((d) => d.tarefas.every((t) => concluidas[t.id])).length

  const treinosPorDia = {}
  treinos.forEach((t) => { treinosPorDia[t.data] = (treinosPorDia[t.data] ?? 0) + 1 })
  const treinosQueContam = Object.values(treinosPorDia)
    .reduce((soma, n) => soma + Math.min(n, VALORES.treinosMaxPorDia), 0)

  const blocosSemana = sequencias(Object.keys(treinosPorDia))
    .reduce((soma, n) => soma + Math.floor(n / 7), 0)

  const diasDiario = Object.keys(diario).length

  const partes = {
    tarefas: tarefas * VALORES.tarefaRitual,
    diasCompletos: diasCompletos * VALORES.diaRitualCompleto,
    treinos: treinosQueContam * VALORES.treino,
    diario: diasDiario * VALORES.diarioPreenchido,
    bonusSemanas: blocosSemana * VALORES.bonusSemanaTreino,
  }
  const total = Object.values(partes).reduce((a, b) => a + b, 0)
  return { total, partes }
}

// ── Gastos e prêmios ─────────────────────────────────────────────────────────

export function lerGastos() {
  const g = lerJson(CHAVE_GASTOS, {})
  return g && typeof g === 'object' ? g : {}
}

export function totalGasto(gastos = lerGastos()) {
  return Object.values(gastos).reduce((soma, v) => soma + (Number(v) || 0), 0)
}

export function calcularSaldo(registros = lerRegistros(), gastos = lerGastos()) {
  return Math.max(0, calcularGanhos(registros).total - totalGasto(gastos))
}

// No modo dona, todos os prêmios aparecem liberados (sem gastar Pétalas).
export function premioDesbloqueado(premio) {
  return ehDona() || premio in lerGastos()
}

// Gasta as Pétalas do prêmio. Retorna true se deu certo.
export function desbloquearPremio(premio) {
  const info = PREMIOS[premio]
  if (!info || premioDesbloqueado(premio)) return false
  if (calcularSaldo() < info.preco) return false
  try {
    localStorage.setItem(CHAVE_GASTOS, JSON.stringify({ ...lerGastos(), [premio]: info.preco }))
    return true
  } catch {
    return false
  }
}

// ── Medalhas ─────────────────────────────────────────────────────────────────

export function calcularMedalhas({ treinos, diario }) {
  const maiorSeqTreino = maior(sequencias(treinos.map((t) => t.data)))
  const maiorSeqDiario = maior(sequencias(Object.keys(diario)))
  return [
    { id: 'primeiro_treino', emoji: '🌱', nome: 'Primeiro treino', ganhou: treinos.length > 0 },
    { id: 'seq_3',  emoji: '🔥', nome: '3 dias seguidos de treino',  ganhou: maiorSeqTreino >= 3 },
    { id: 'seq_7',  emoji: '⭐', nome: '7 dias seguidos de treino',  ganhou: maiorSeqTreino >= 7 },
    { id: 'seq_14', emoji: '🌟', nome: '14 dias seguidos de treino', ganhou: maiorSeqTreino >= 14 },
    { id: 'seq_21', emoji: '👑', nome: '21 dias seguidos de treino', ganhou: maiorSeqTreino >= 21 },
    { id: 'diario_7', emoji: '📝', nome: '1ª semana de diário completa', ganhou: maiorSeqDiario >= 7 },
  ]
}
