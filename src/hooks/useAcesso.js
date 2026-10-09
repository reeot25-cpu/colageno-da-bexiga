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

// Modo dona — libera o app sem o limite de 21 dias (para a dona testar).
const CHAVE_DONA = 'collagenflow_dona'

// A senha vem do arquivo .env.local (VITE_SENHA_DONA), que não vai para o GitHub.
// Sem senha configurada (vazia, só espaços ou inexistente), o ?dona=... fica
// DESLIGADO — nunca libera com senha vazia.
// ⚠️ Atenção: no app publicado a senha fica dentro do JavaScript, então é uma
// trava simples, não uma proteção forte.
const SENHA_DONA = String(import.meta.env.VITE_SENHA_DONA ?? '').trim()
const DONA_POR_URL_ATIVO = SENHA_DONA.length > 0

export function ehDona() {
  if (import.meta.env.DEV) return true
  try {
    return localStorage.getItem(CHAVE_DONA) === '1'
  } catch {
    return false
  }
}

// Lê ?dona=... na URL ao carregar o app: grava ou apaga o modo dona e
// remove o parâmetro da barra de endereço.
export function processarParametroDona() {
  try {
    const url = new URL(window.location.href)
    const valor = url.searchParams.get('dona')
    if (valor === null) return
    if (valor === 'sair') localStorage.removeItem(CHAVE_DONA)
    else if (DONA_POR_URL_ATIVO && valor.trim() === SENHA_DONA) localStorage.setItem(CHAVE_DONA, '1')
    url.searchParams.delete('dona')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  } catch {
    // localStorage ou history indisponível — ignora
  }
}

export function useAcesso() {
  // A data de início é fixa; recalcular o estado a cada render é barato.
  const [inicioMs] = useState(getInicioAcesso)
  const estado = verificarAcesso(inicioMs)
  if (ehDona()) return { ...estado, expirado: false, dentroDoPrazo: true, dona: true, LINK_ASSINATURA, DIAS_ACESSO }
  return { ...estado, dona: false, LINK_ASSINATURA, DIAS_ACESSO }
}
