// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE NARRAÇÃO — CollagenFlow
//
// Prioridade de fonte (em ordem):
//   1. audioUrl (arquivo .mp3/.ogg gravado) — se preenchido em exercicios.js
//   2. Web Speech API (síntese gratuita do navegador)
//   3. Silêncio (fallback seguro)
//
// PARA UPGRADE FUTURO:
//   A. Voz gravada própria:
//      → Coloque o arquivo em /public/audio/etapa-nome.mp3
//      → Preencha o campo audioUrl na etapa em exercicios.js
//      → Esta função detecta e usa automaticamente
//
//   B. ElevenLabs / API de voz premium:
//      → Crie src/utils/narradorElevenLabs.js com a mesma interface
//      → Substitua o import em Exercicios.jsx: criarNarrador → criarNarradorElevenLabs
//      → A interface é idêntica: { falar, parar, pausar, retomar }
// ─────────────────────────────────────────────────────────────────────────────

// ── seleção de voz feminina pt-BR ─────────────────────────────────────────────

let _voz = null

export function obterVozFeminina() {
  if (_voz) return _voz
  if (!('speechSynthesis' in window)) return null

  const vozes = window.speechSynthesis.getVoices()
  if (vozes.length === 0) return null

  // 1ª prioridade: voz feminina pt-BR explícita
  const feminina = vozes.find(
    (v) => v.lang.startsWith('pt') && /female|feminina|fem/i.test(v.name)
  )
  if (feminina) { _voz = feminina; return _voz }

  // 2ª prioridade: qualquer voz pt-BR
  const ptBR = vozes.find((v) => v.lang === 'pt-BR') ?? vozes.find((v) => v.lang.startsWith('pt'))
  if (ptBR) { _voz = ptBR; return _voz }

  // Fallback: primeira voz disponível
  _voz = vozes[0]
  return _voz
}

// Recarrega vozes quando o navegador as lista assincronamente (Chrome)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { _voz = null }
}

// ── player de áudio gravado ───────────────────────────────────────────────────

function criarPlayerAudio(url) {
  const audio = new Audio(url)
  audio.preload = 'auto'
  return {
    falar: () => { audio.currentTime = 0; audio.play().catch(() => {}) },
    parar: () => { audio.pause(); audio.currentTime = 0 },
    pausar: () => audio.pause(),
    retomar: () => audio.play().catch(() => {}),
  }
}

// ── síntese de voz (Web Speech API) ──────────────────────────────────────────

function criarSpeech(texto, { velocidade = 0.88, tom = 1.05 } = {}) {
  if (!('speechSynthesis' in window)) return null

  const utterance = new SpeechSynthesisUtterance(texto)
  utterance.lang  = 'pt-BR'
  utterance.rate  = velocidade
  utterance.pitch = tom
  utterance.volume = 1

  const voz = obterVozFeminina()
  if (voz) utterance.voice = voz

  return utterance
}

// ── interface pública ─────────────────────────────────────────────────────────

export function criarNarrador() {
  let audioAtual = null
  let utteranceAtual = null

  function pararTudo() {
    if (audioAtual) { audioAtual.parar(); audioAtual = null }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    utteranceAtual = null
  }

  function falar(texto, audioUrl = null) {
    pararTudo()

    // Fonte 1: arquivo de áudio gravado
    if (audioUrl) {
      audioAtual = criarPlayerAudio(audioUrl)
      audioAtual.falar()
      return
    }

    // Fonte 2: Web Speech API
    if (!('speechSynthesis' in window)) return
    const u = criarSpeech(texto)
    if (!u) return
    utteranceAtual = u
    // Chrome exige um pequeno delay após cancel()
    setTimeout(() => window.speechSynthesis.speak(u), 80)
  }

  function parar() { pararTudo() }

  function pausar() {
    if (audioAtual) { audioAtual.pausar(); return }
    if ('speechSynthesis' in window) window.speechSynthesis.pause()
  }

  function retomar() {
    if (audioAtual) { audioAtual.retomar(); return }
    if ('speechSynthesis' in window) window.speechSynthesis.resume()
  }

  return { falar, parar, pausar, retomar }
}

// ── textos de aviso sincronizados com o timer ─────────────────────────────────

export const AVISO_5_SEGUNDOS  = 'Quase lá... mais 5 segundos!'
export const AVISO_CONCLUSAO   = 'Muito bem! Exercício concluído. Você foi incrível hoje! 💜'
export const AVISO_PROXIMA_ETAPA = 'Ótimo! Vamos para a próxima etapa.'
