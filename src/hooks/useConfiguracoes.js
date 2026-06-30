import { useState, useCallback } from 'react'

const CHAVE = 'collagenflow_config'

function configInicial() {
  return { somAtivo: true, lembretesAtivos: true }
}

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? { ...configInicial(), ...JSON.parse(salvo) } : configInicial()
  } catch {
    return configInicial()
  }
}

function persistir(config) {
  localStorage.setItem(CHAVE, JSON.stringify(config))
}

export function useConfiguracoes() {
  const [config, setConfig] = useState(carregar)

  const alterarSom = useCallback((valor) => {
    setConfig((prev) => {
      const novo = { ...prev, somAtivo: valor }
      persistir(novo)
      return novo
    })
  }, [])

  const alterarLembretes = useCallback((valor) => {
    setConfig((prev) => {
      const novo = { ...prev, lembretesAtivos: valor }
      persistir(novo)
      return novo
    })
  }, [])

  return { config, alterarSom, alterarLembretes }
}
