import { useMemo } from 'react'
import { mensagensBoasVindas } from '../data/mensagensBoasVindas'

const CHAVE = 'collagenflow_bv_idx'

// Sorteia uma mensagem diferente a cada sessão, sem repetir a anterior
function sortearMensagem() {
  const total = mensagensBoasVindas.length
  const ultimoIdx = parseInt(sessionStorage.getItem(CHAVE) ?? '-1', 10)

  // Gera índice aleatório excluindo o último
  let novoIdx
  do {
    novoIdx = Math.floor(Math.random() * total)
  } while (novoIdx === ultimoIdx && total > 1)

  sessionStorage.setItem(CHAVE, String(novoIdx))
  return mensagensBoasVindas[novoIdx]
}

// Calculado uma vez por montagem do componente (estável dentro da sessão)
const mensagemDaSessao = sortearMensagem()

export function useMensagemBoasVindas() {
  return useMemo(() => mensagemDaSessao, [])
}
