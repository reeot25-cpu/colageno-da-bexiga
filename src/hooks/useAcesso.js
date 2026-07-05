import { useState } from 'react'
import { verificarAcesso, DIAS_ACESSO, LINK_ASSINATURA } from '../utils/acesso'

// Data da 1ª abertura do app — marca o começo dos 21 dias de acesso.
const CHAVE_INICIO = 'collagenflow_acesso_inicio'

// Lê (e, na 1ª vez, grava) a data de início do período de acesso.
export function getInicioAcesso() {
  try {
    const salvo = localStorage.getItem(CHAVE_INICIO)
    if (salvo) return parseInt(salvo, 10)
    const agora = Date.now()
    localStorage.setItem(CHAVE_INICIO, String(agora))
    return agora
  } catch {
    return Date.now()
  }
}

export function useAcesso() {
  // A data de início é fixa; recalcular o estado a cada render é barato.
  const [inicioMs] = useState(getInicioAcesso)
  const estado = verificarAcesso(inicioMs)
  return { ...estado, LINK_ASSINATURA, DIAS_ACESSO }
}
