import { useState, useCallback, useMemo } from 'react'

const CHAVE = 'collagenflow_historico_exercicios'

function lerHistorico() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

function dataLocal(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function useHistoricoExercicios() {
  const [registros, setRegistros] = useState(lerHistorico)

  const registrarTreino = useCallback((treino) => {
    const novo = {
      id: Date.now(),
      data: dataLocal(),
      timestamp: Date.now(),
      treinoId: treino.id,
      treinoNome: treino.nome,
      duracao: treino.duracao,
      etapas: treino.etapas.length,
    }
    setRegistros((prev) => {
      const atualizado = [...prev, novo]
      localStorage.setItem(CHAVE, JSON.stringify(atualizado))
      return atualizado
    })
    return novo
  }, [])

  const stats = useMemo(() => {
    const totalTreinos = registros.length
    if (totalTreinos === 0) {
      return { totalTreinos: 0, streak: 0, maiorStreak: 0, diasUnicos: 0, ultimoTreino: null }
    }

    const diasSet = new Set(registros.map((r) => r.data))
    const diasUnicos = diasSet.size
    const ultimoTreino = registros[registros.length - 1]

    const diasOrdenados = [...diasSet].sort((a, b) => {
      const [aY, aM, aD] = a.split('-').map(Number)
      const [bY, bM, bD] = b.split('-').map(Number)
      return new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD)
    })

    let streak = 0
    let maiorStreak = 0
    let streakAtual = 0
    const hoje = dataLocal()
    const ontem = dataLocal(new Date(Date.now() - 86400000))

    for (let i = diasOrdenados.length - 1; i >= 0; i--) {
      const dia = diasOrdenados[i]
      if (i === diasOrdenados.length - 1) {
        if (dia === hoje || dia === ontem) {
          streakAtual = 1
        } else {
          break
        }
      } else {
        const [aY, aM, aD] = diasOrdenados[i + 1].split('-').map(Number)
        const [bY, bM, bD] = dia.split('-').map(Number)
        const diff = new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD)
        if (diff === 86400000) {
          streakAtual++
        } else {
          break
        }
      }
    }
    streak = streakAtual

    let tempStreak = 1
    for (let i = 1; i < diasOrdenados.length; i++) {
      const [aY, aM, aD] = diasOrdenados[i].split('-').map(Number)
      const [bY, bM, bD] = diasOrdenados[i - 1].split('-').map(Number)
      const diff = new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD)
      if (diff === 86400000) {
        tempStreak++
      } else {
        maiorStreak = Math.max(maiorStreak, tempStreak)
        tempStreak = 1
      }
    }
    maiorStreak = Math.max(maiorStreak, tempStreak)

    return { totalTreinos, streak, maiorStreak, diasUnicos, ultimoTreino }
  }, [registros])

  const treinoHoje = useMemo(() => {
    const hoje = dataLocal()
    return registros.filter((r) => r.data === hoje)
  }, [registros])

  return { registros, registrarTreino, stats, treinoHoje }
}
