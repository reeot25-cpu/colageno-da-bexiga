import { useState, useCallback } from 'react'

// Nome da usuária, salvo só no aparelho (localStorage). Digitado uma vez no
// onboarding; editável nas Configurações.
const CHAVE = 'collagenflow_nome'

// Leitura direta (para usar fora de componentes ou no render inicial).
export function getNomeSalvo() {
  try {
    return (localStorage.getItem(CHAVE) || '').trim()
  } catch {
    return ''
  }
}

export function useNome() {
  const [nome, setNome] = useState(getNomeSalvo)

  const salvarNome = useCallback((valor) => {
    const limpo = (valor || '').trim()
    try {
      if (limpo) localStorage.setItem(CHAVE, limpo)
      else localStorage.removeItem(CHAVE)
    } catch {
      // Ignora se localStorage indisponível.
    }
    setNome(limpo)
  }, [])

  return { nome, salvarNome, temNome: nome.length > 0 }
}
