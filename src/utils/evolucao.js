// Evolução registrada no Diário: compara a média dos 3 PRIMEIROS dias
// registrados com a dos 3 ÚLTIMOS, para escapes e urgências.
// Só descreve o que a usuária anotou — nunca promete cura nem resultado.

export const DIAS_MINIMOS_EVOLUCAO = 6
const JANELA = 3

function media(entradas, campo) {
  return entradas.reduce((soma, e) => soma + (Number(e[campo]) || 0), 0) / entradas.length
}

// diario: { "YYYY-MM-DD": { idas, urgencias, escapes } }
export function calcularEvolucao(diario) {
  const datas = Object.keys(diario ?? {}).sort()
  const diasRegistrados = datas.length
  if (diasRegistrados < DIAS_MINIMOS_EVOLUCAO) {
    return { suficiente: false, diasRegistrados, faltam: DIAS_MINIMOS_EVOLUCAO - diasRegistrados }
  }
  const primeiros = datas.slice(0, JANELA).map((d) => diario[d])
  const ultimos = datas.slice(-JANELA).map((d) => diario[d])
  const comparar = (campo) => {
    const antes = media(primeiros, campo)
    const agora = media(ultimos, campo)
    // diferença menor que 0,05 conta como "igual" (evita ruído de arredondamento)
    const tendencia = agora < antes - 0.05 ? 'menos' : agora > antes + 0.05 ? 'mais' : 'igual'
    return { antes, agora, tendencia }
  }
  return {
    suficiente: true,
    diasRegistrados,
    escapes: comparar('escapes'),
    urgencias: comparar('urgencias'),
  }
}

export function lerDiario() {
  try {
    return JSON.parse(localStorage.getItem('collagenflow_diario') ?? '{}') ?? {}
  } catch {
    return {}
  }
}
