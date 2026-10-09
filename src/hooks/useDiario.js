import { useState, useCallback } from 'react'

const CHAVE = 'collagenflow_diario'

// Data LOCAL no formato "YYYY-MM-DD" (mesmo formato de antes).
// Antes usava toISOString(), que é UTC: no Brasil, um registro feito depois das
// 21h caía no dia seguinte. Os registros antigos são mantidos como estão — sem o
// horário original não dá para saber quais foram deslocados, então não mexemos neles.
export function chaveData(data) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
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
