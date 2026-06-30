import { useState, useCallback } from 'react'

const CHAVE = 'collagenflow_diario'

function chaveData(data) {
  return data.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function entradaVazia() {
  return { idas: 0, urgencias: 0, escapes: 0 }
}

function carregarTudo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}')
  } catch {
    return {}
  }
}

export function useDiario() {
  const [registros, setRegistros] = useState(carregarTudo)

  const salvar = useCallback((data, campo, valor) => {
    const chave = chaveData(data)
    setRegistros((prev) => {
      const atual = prev[chave] ?? entradaVazia()
      const atualizado = {
        ...prev,
        [chave]: { ...atual, [campo]: Math.max(0, valor) },
      }
      localStorage.setItem(CHAVE, JSON.stringify(atualizado))
      return atualizado
    })
  }, [])

  const obterDia = useCallback(
    (data) => registros[chaveData(data)] ?? entradaVazia(),
    [registros],
  )

  // últimos N dias com entrada registrada
  const historico = useCallback(
    (n = 7) => {
      return Array.from({ length: n }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const chave = chaveData(d)
        return { data: new Date(d), chave, entrada: registros[chave] ?? null }
      }).reverse()
    },
    [registros],
  )

  return { obterDia, salvar, historico }
}
