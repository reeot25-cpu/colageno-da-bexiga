// ── Badge no ícone do app (App Badging API) ───────────────────────────────────
//
// Mostra aquele "numerozinho" no ícone do app (igual WhatsApp/Instagram) usando
// navigator.setAppBadge() / navigator.clearAppBadge().
//
// ⚠️ COMPATIBILIDADE — leia antes de mexer:
//
// A API só funciona quando o app está INSTALADO como PWA (adicionado à tela
// inicial), nunca numa aba comum do navegador. Por dispositivo:
//
//   ✅ Android + Chrome/Edge .......... funciona bem; badge aparece no ícone.
//   ✅ Desktop Chrome/Edge (Win/macOS) . funciona com o PWA instalado.
//   ⚠️ iPhone / iPad (Safari, iOS) ..... SUPORTE LIMITADO E INSTÁVEL. O iOS
//        normalmente só exibe badge via notificação push nativa; setAppBadge
//        pode ser ignorado ou não aparecer. Não há como garantir.
//   ❌ Firefox ......................... não implementa a API (ignora em silêncio).
//
// Outra limitação: o badge só é atualizado enquanto o app está EM EXECUÇÃO
// (aberto ou por pouco tempo em segundo plano). Sem um backend de push, não dá
// para "acender" o badge com o app totalmente fechado. Por isso agendamos a
// virada do dia via setTimeout enquanto o app estiver vivo (ver useBadgeDiario),
// exatamente como fazemos com os lembretes diários.

export function suportaBadge() {
  return typeof navigator !== 'undefined' && 'setAppBadge' in navigator
}

// Acende o badge com um número (padrão: 1). Nunca lança para fora.
export async function mostrarBadge(quantidade = 1) {
  if (!suportaBadge()) return
  try {
    await navigator.setAppBadge(quantidade)
  } catch {
    // Alguns navegadores (ex.: iOS) podem lançar — ignoramos silenciosamente.
  }
}

// Remove o badge do ícone. Nunca lança para fora.
export async function limparBadge() {
  if (!suportaBadge()) return
  try {
    await navigator.clearAppBadge()
  } catch {
    // Ignora se não suportado.
  }
}
