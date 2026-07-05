import { useEffect } from 'react'
import { mostrarBadge, limparBadge } from '../utils/badge'

// Controla o badge do ícone conforme o "dia novo" de conteúdo (ritual/diário).
//
// Regras (pedido da usuária):
//   • Acende o badge quando o dia vira e há conteúdo novo do dia disponível.
//   • Some o badge quando ela abre (ou volta para) o app.
//   • Se ela desativou os lembretes nas configurações → nunca mostra badge.
//
// Como o app não tem backend de push, o badge só é aceso enquanto o app está
// vivo: agendamos um setTimeout para a próxima meia-noite local. Ao abrir o app,
// limpamos o badge e marcamos o dia como visto. (Ver limitações em utils/badge.js.)

const CHAVE_VISTO = 'collagenflow_badge_visto' // último dia (local) em que abriu o app

function hojeChave() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function msAteMeiaNoite() {
  const agora = new Date()
  const amanha = new Date(agora)
  amanha.setHours(24, 0, 0, 0) // 00:00 do dia seguinte (horário local)
  return amanha.getTime() - agora.getTime()
}

export function useBadgeDiario(lembretesAtivos) {
  useEffect(() => {
    // Config desligada → garante que não há badge e não agenda nada.
    if (!lembretesAtivos) {
      limparBadge()
      return
    }

    let timer = null

    // Abriu/voltou ao app: marca hoje como visto e limpa o badge.
    const marcarVistoELimpar = () => {
      localStorage.setItem(CHAVE_VISTO, hojeChave())
      limparBadge()
    }

    // Agenda o acendimento do badge para a virada do dia, e reagenda a cada dia.
    const agendarViradaDoDia = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        mostrarBadge(1) // novo dia → conteúdo novo não visto
        agendarViradaDoDia()
      }, msAteMeiaNoite())
    }

    const aoVisivel = () => {
      if (document.visibilityState === 'visible') marcarVistoELimpar()
    }

    // Ao montar: se o último dia visto for anterior a hoje, havia novidade —
    // como ela está abrindo o app agora, limpamos e marcamos como visto.
    marcarVistoELimpar()
    agendarViradaDoDia()
    document.addEventListener('visibilitychange', aoVisivel)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', aoVisivel)
    }
  }, [lembretesAtivos])
}
