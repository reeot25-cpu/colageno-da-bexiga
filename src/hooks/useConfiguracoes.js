import { useState, useCallback } from 'react'

const CHAVE = 'collagenflow_config'

function configInicial() {
  return { somAtivo: true }
}

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    // Se nunca abriu antes, usa o padrão (som ativado)
    return salvo ? { ...configInicial(), ...JSON.parse(salvo) } : configInicial()
  } catch {
    return configInicial()
  }
}

function salvar(config) {
  localStorage.setItem(CHAVE, JSON.stringify(config))
}

export function useConfiguracoes() {
  const [config, setConfig] = useState(carregar)

  const alterarSom = useCallback((valor) => {
    setConfig((prev) => {
      const novo = { ...prev, somAtivo: valor }
      salvar(novo)
      return novo
    })
  }, [])

  return { config, alterarSom }
}
