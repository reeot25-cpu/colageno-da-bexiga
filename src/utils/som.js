// Sons via Web Audio API + vibração via Vibration API
// Vibration API funciona no Android Chrome; iOS Safari não suporta (sem erro — simplesmente ignora)

let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Retoma contexto suspenso (política de autoplay de alguns browsers)
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

// Cria um "parcial" de sino: oscilador + envelope de decaimento longo
function parcelaSino(ctx, freq, volume, inicio, duracao) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, inicio)
  // Ataque instantâneo, decaimento exponencial longo — comportamento real de sino
  gain.gain.setValueAtTime(0, inicio)
  gain.gain.linearRampToValueAtTime(volume, inicio + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracao)
  osc.start(inicio)
  osc.stop(inicio + duracao)
}

// Vibração curta — Android apenas (iOS ignora silenciosamente)
function vibrar(padrao) {
  try {
    if (navigator.vibrate) navigator.vibrate(padrao)
  } catch {
    // Ignora se não suportado
  }
}

/**
 * Sino de troca de etapa — toca quando o tempo de uma etapa termina.
 * Som: sino médio com 3 harmônicos (fundamental + 2ª + 3ª parcial).
 * Vibração: 1 pulso curto de 80ms (Android).
 */
export function tocarTrocaEtapa() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    const fundamental = 659 // Mi5 — tom claro e agradável

    // Harmônicos do sino (fundamental + parciais com volumes decrescentes)
    parcelaSino(ctx, fundamental,       0.22, t, 1.2)   // fundamental
    parcelaSino(ctx, fundamental * 2.76, 0.10, t, 0.9)  // 2ª parcial do sino (não é 2x exato)
    parcelaSino(ctx, fundamental * 5.40, 0.05, t, 0.5)  // 3ª parcial mais aguda

    // Vibração Android: 1 pulso suave
    vibrar([80])
  } catch {
    // Silencia erros
  }
}

/**
 * Sino de conclusão — toca ao terminar o treino inteiro.
 * Som: 3 sinos em sequência ascendente (como campainha de vitória).
 * Vibração: padrão curto-curto-longo (Android).
 */
export function tocarConclusao() {
  try {
    const ctx = getCtx()

    // 3 sinos em sequência: Mi, Sol#, Si (acorde de Mi maior)
    const sequencia = [
      { freq: 659, t: 0.00 },   // Mi5
      { freq: 830, t: 0.25 },   // Sol#5
      { freq: 988, t: 0.50 },   // Si5
    ]

    sequencia.forEach(({ freq, t: offset }) => {
      const t = ctx.currentTime + offset
      parcelaSino(ctx, freq,        0.20, t, 1.4)
      parcelaSino(ctx, freq * 2.76, 0.08, t, 1.0)
      parcelaSino(ctx, freq * 5.40, 0.04, t, 0.6)
    })

    // Vibração Android: curto-curto-longo
    vibrar([60, 80, 60, 80, 180])
  } catch {
    // Silencia erros
  }
}
