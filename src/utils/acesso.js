// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE ACESSO POR TEMPO — CollagenFlow (período de 21 dias)
//
// Hoje o acesso é decidido 100% LOCALMENTE: guardamos a data da 1ª abertura no
// localStorage e liberamos 21 dias a partir dela.
//
// ⚙️ PONTO DE SUBSTITUIÇÃO FUTURA — verificação real de assinatura (API/DB):
// Quando existir backend de assinatura, troque APENAS o corpo de
// `verificarAcesso()` por uma checagem real, mantendo a MESMA forma de retorno.
// Exemplo:
//
//   export async function verificarAcesso(usuarioId) {
//     const r = await fetch(`/api/assinatura/${usuarioId}`)
//     const { ativa, diaAtual, faltam } = await r.json()
//     return { diaAtual, faltam, expirado: !ativa, dentroDoPrazo: ativa, total: DIAS_ACESSO }
//   }
//
// Todo o resto do app só consome o objeto retornado — nada mais precisa mudar.
// ─────────────────────────────────────────────────────────────────────────────

export const DIAS_ACESSO = 21

// TODO: substituir pelo link real da Kiwify quando você me enviar.
export const LINK_ASSINATURA = 'https://kiwify.com.br/ASSINATURA-COLLAGENFLOW'

// ─── 🎟️ DESCONTO NA ASSINATURA POR PÉTALAS ───────────────────────────────────
// ÚNICO lugar com os cupons. TROCAR pelos códigos reais criados na Kiwify —
// um cupom que não existe lá pode dar erro na compra.
// A faixa usa o total de Pétalas GANHAS (não o saldo): gastar em prêmios não
// reduz o desconto. Calibragem: faixa 3 ≈ 19 dos 21 dias de uso constante.
export const FAIXAS_DESCONTO = [
  { faixa: 1, desconto: 10, minimoPetalas: 500,  cupom: 'TROCAR-CUPOM-10' },
  { faixa: 2, desconto: 20, minimoPetalas: 1000, cupom: 'TROCAR-CUPOM-20' },
  { faixa: 3, desconto: 30, minimoPetalas: 1500, cupom: 'TROCAR-CUPOM-30' },
]

// { atual: faixa|null, proxima: faixa|null, faltam: Pétalas até a próxima }
export function faixaDesconto(petalasGanhas) {
  const atual = [...FAIXAS_DESCONTO].reverse().find((f) => petalasGanhas >= f.minimoPetalas) ?? null
  const proxima = FAIXAS_DESCONTO.find((f) => petalasGanhas < f.minimoPetalas) ?? null
  return { atual, proxima, faltam: proxima ? proxima.minimoPetalas - petalasGanhas : 0 }
}

// Link da assinatura com ?coupon= da faixa (sem faixa → link sem cupom).
export function linkAssinatura(faixa) {
  if (!faixa) return LINK_ASSINATURA
  try {
    const url = new URL(LINK_ASSINATURA)
    url.searchParams.set('coupon', faixa.cupom)
    return url.toString()
  } catch {
    return LINK_ASSINATURA
  }
}

const DIA_MS = 1000 * 60 * 60 * 24

// Decide se a usuária está dentro do prazo. Retorno:
//   diaAtual      → 1..21 (para exibir "Dia X de 21")
//   faltam        → dias até o fim, depois de hoje (dia 18 → 3, dia 21 → 0)
//   expirado      → true quando os 21 dias já passaram
//   dentroDoPrazo → !expirado
//   total         → 21
export function verificarAcesso(inicioMs, agoraMs = Date.now()) {
  const diasPassados = Math.max(0, Math.floor((agoraMs - inicioMs) / DIA_MS))
  const expirado = diasPassados >= DIAS_ACESSO
  const diaAtual = Math.min(diasPassados + 1, DIAS_ACESSO)
  const faltam = Math.max(DIAS_ACESSO - (diasPassados + 1), 0)
  return { inicioMs, diaAtual, faltam, expirado, dentroDoPrazo: !expirado, total: DIAS_ACESSO }
}
