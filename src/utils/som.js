// Gera sons suaves via Web Audio API — sem arquivos externos

let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

// Toque suave ao trocar de etapa no exercício
export function tocarTrocaEtapa() {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(528, ctx.currentTime)        // nota suave
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch {
    // Silencia erros em browsers que bloqueiam áudio
  }
}

// Toque de conclusão (mais alegre)
export function tocarConclusao() {
  try {
    const ctx = getCtx()
    const notas = [528, 660, 792]
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.18
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  } catch {
    // Silencia erros
  }
}
