// ─────────────────────────────────────────────────────────────────────────────
// TRAVAS CONTRA TRAPAÇA — um treino só rende Pétalas se:
//   1. o cronômetro rodou até o fim com o app em primeiro plano (sem "Pular");
//   2. a usuária segurou o botão no "↑ Aperta" e soltou no "↓ Solta", com acerto
//      de pelo menos ACERTO_MINIMO (média entre Aperta e Solta — ver calcularAcerto).
// O limite de 2 treinos pontuados por dia fica em utils/petalas.js.
// Obs.: tudo roda no aparelho — impede a trapaça fácil, não quem edita os dados.
// ─────────────────────────────────────────────────────────────────────────────

export const ACERTO_MINIMO = 0.7
export const TOLERANCIA_TEMPO_MS = 2000 // folga para arredondamentos do cronômetro
export const CARENCIA_TROCA_MS = 500    // tempo de reação após cada troca Aperta/Solta

// Acerto = média entre o acerto nos momentos de Aperta e nos de Solta.
// Assim, nunca apertar (0% + 100%) ou segurar o tempo todo (100% + 0%) dá 50%,
// mesmo em treinos com muito descanso.
// amostras = { aperta: { total, acertos }, solta: { total, acertos } }
export function calcularAcerto(amostras) {
  const taxas = [amostras.aperta, amostras.solta]
    .filter((a) => a.total > 0)
    .map((a) => a.acertos / a.total)
  if (!taxas.length) return 0
  return Math.round((taxas.reduce((s, t) => s + t, 0) / taxas.length) * 100) / 100
}

// Resultado gravado no histórico: { valido, motivo?, acerto }
export function avaliarTreino({ pulou, tempoAtivoMs, duracaoMs, amostras }) {
  const acerto = calcularAcerto(amostras)
  if (pulou) return { valido: false, motivo: 'pulou', acerto }
  if (tempoAtivoMs < duracaoMs - TOLERANCIA_TEMPO_MS) return { valido: false, motivo: 'tempo', acerto }
  if (acerto < ACERTO_MINIMO) return { valido: false, motivo: 'botao', acerto }
  return { valido: true, acerto }
}

// Treinos gravados antes das travas não têm `valido` — continuam valendo.
export const treinoConta = (registro) => registro.valido !== false

export const MOTIVOS = {
  pulou: 'algumas etapas foram puladas',
  tempo: 'o cronômetro não rodou até o fim com o app aberto',
  botao: 'o botão não acompanhou o Aperta/Solta do guia na maior parte do tempo',
}
