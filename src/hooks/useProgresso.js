import { useState, useCallback } from 'react'
import { diasRitual } from '../data/ritual'

const CHAVE = 'colageno_progresso'

function progressoInicial() {
  const concluidas = {}
  diasRitual.forEach(({ tarefas }) =>
    tarefas.forEach(({ id }) => (concluidas[id] = false))
  )
  return { diaAtual: 1, iniciouEm: Date.now(), concluidas }
}

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? JSON.parse(salvo) : progressoInicial()
  } catch {
    return progressoInicial()
  }
}

function salvar(estado) {
  localStorage.setItem(CHAVE, JSON.stringify(estado))
}

export function useProgresso() {
  const [estado, setEstado] = useState(carregar)

  const marcarTarefa = useCallback((tarefaId, valor) => {
    setEstado((prev) => {
      const novo = { ...prev, concluidas: { ...prev.concluidas, [tarefaId]: valor } }
      salvar(novo)
      return novo
    })
  }, [])

  const avancarDia = useCallback((dia) => {
    setEstado((prev) => {
      const novo = { ...prev, diaAtual: Math.max(prev.diaAtual, dia) }
      salvar(novo)
      return novo
    })
  }, [])

  const reiniciar = useCallback(() => {
    const novo = progressoInicial()
    salvar(novo)
    setEstado(novo)
  }, [])

  // Progresso de um dia específico
  function progressoDia(dia) {
    const tarefas = diasRitual[dia - 1]?.tarefas ?? []
    const feitas = tarefas.filter((t) => estado.concluidas[t.id]).length
    return { feitas, total: tarefas.length, pct: tarefas.length ? (feitas / tarefas.length) * 100 : 0 }
  }

  // Progresso geral dos 7 dias (todas as tarefas)
  function progressoGeral() {
    const todas = diasRitual.flatMap((d) => d.tarefas)
    const feitas = todas.filter((t) => estado.concluidas[t.id]).length
    const diasCompletos = diasRitual.filter(({ dia, tarefas }) =>
      tarefas.every((t) => estado.concluidas[t.id])
    ).length
    return {
      feitas,
      total: todas.length,
      pct: todas.length ? (feitas / todas.length) * 100 : 0,
      diasCompletos,
    }
  }

  const diaAtivo = estado.diaAtual

  return { estado, marcarTarefa, avancarDia, reiniciar, progressoDia, progressoGeral, diaAtivo }
}
