import { useState, useCallback } from 'react'
import { diasRitual } from '../data/ritual'

const CHAVE        = 'colageno_progresso'
const CHAVE_OFFSET = 'collagenflow_test_offset' // só usado em desenvolvimento

// ── estado inicial ────────────────────────────────────────────────────────────

function progressoInicial() {
  const concluidas = {}
  diasRitual.forEach(({ tarefas }) =>
    tarefas.forEach(({ id }) => (concluidas[id] = false))
  )
  return { iniciouEm: Date.now(), concluidas }
}

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (!salvo) return progressoInicial()
    const dados = JSON.parse(salvo)
    // Migração: dados antigos tinham `diaAtual` avançado manualmente.
    // Reseta iniciouEm para agora para que o novo sistema de datas comece do zero.
    if ('diaAtual' in dados) {
      const migrado = { iniciouEm: Date.now(), concluidas: dados.concluidas ?? {} }
      persistir(migrado)
      return migrado
    }
    return dados
  } catch {
    return progressoInicial()
  }
}

function persistir(estado) {
  localStorage.setItem(CHAVE, JSON.stringify(estado))
}

// ── cálculo do dia desbloqueado ───────────────────────────────────────────────

export function calcularDiaDesbloqueado(iniciouEm) {
  // Offset em ms adicionado apenas no modo de teste (dev)
  const offsetMs  = parseInt(localStorage.getItem(CHAVE_OFFSET) ?? '0', 10)
  const agora     = Date.now() + offsetMs
  const diasPassados = Math.floor((agora - iniciouEm) / (1000 * 60 * 60 * 24))
  return Math.min(Math.max(diasPassados + 1, 1), diasRitual.length)
}

export function diasFaltando(dia, iniciouEm) {
  const desbloqueado = calcularDiaDesbloqueado(iniciouEm)
  return Math.max(dia - desbloqueado, 0)
}

// ── hook principal ────────────────────────────────────────────────────────────

export function useProgresso() {
  const [estado, setEstado] = useState(carregar)

  const diaDesbloqueado = calcularDiaDesbloqueado(estado.iniciouEm)

  const marcarTarefa = useCallback((tarefaId, valor) => {
    setEstado((prev) => {
      const novo = { ...prev, concluidas: { ...prev.concluidas, [tarefaId]: valor } }
      persistir(novo)
      return novo
    })
  }, [])

  const reiniciar = useCallback(() => {
    const novo = progressoInicial()
    persistir(novo)
    localStorage.removeItem(CHAVE_OFFSET)
    setEstado(novo)
  }, [])

  // Força releitura do estado (usado pelo modo de teste após mudar o offset)
  const recarregar = useCallback(() => {
    setEstado((prev) => ({ ...prev }))
  }, [])

  function progressoDia(dia) {
    const tarefas = diasRitual[dia - 1]?.tarefas ?? []
    const feitas  = tarefas.filter((t) => estado.concluidas[t.id]).length
    return { feitas, total: tarefas.length, pct: tarefas.length ? (feitas / tarefas.length) * 100 : 0 }
  }

  function progressoGeral() {
    const todas  = diasRitual.flatMap((d) => d.tarefas)
    const feitas = todas.filter((t) => estado.concluidas[t.id]).length
    const diasCompletos = diasRitual.filter(({ tarefas }) =>
      tarefas.every((t) => estado.concluidas[t.id])
    ).length
    return {
      feitas,
      total: todas.length,
      pct: todas.length ? (feitas / todas.length) * 100 : 0,
      diasCompletos,
    }
  }

  return {
    estado,
    marcarTarefa,
    reiniciar,
    recarregar,
    progressoDia,
    progressoGeral,
    diaAtivo: diaDesbloqueado,       // alias legado para Inicio.jsx
    diaDesbloqueado,
    iniciouEm: estado.iniciouEm,
  }
}
