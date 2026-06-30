// Mensagens rotativas para os lembretes diários
const MENSAGENS = [
  { titulo: 'CollagenFlow 💜', corpo: 'Hora de cuidar de você! Já fez seus exercícios hoje?' },
  { titulo: 'Seu ritual te espera 🌸', corpo: 'Um tempinho só seu — seu assoalho pélvico agradece!' },
  { titulo: 'CollagenFlow 💜', corpo: 'Você lembrou de registrar seu diário hoje?' },
  { titulo: 'Cuidado contigo 🌿', corpo: 'Pequenas constâncias fazem grandes transformações. Vamos?' },
  { titulo: 'Seu ritual diário 💜', corpo: 'Cada exercício conta. Abra o app e continue sua sequência!' },
  { titulo: 'Oi! Passando para lembrar 🌺', corpo: 'Seu corpo merece atenção todos os dias. Vamos lá?' },
  { titulo: 'CollagenFlow 💜', corpo: 'Já tomou seu chá hoje? Confira o ritual do dia!' },
]

const CHAVE_INDICE = 'collagenflow_msg_idx'
const CHAVE_HORA   = 'collagenflow_lembrete_hora'
const HORA_PADRAO  = 9 // 09:00

// ── permissão ─────────────────────────────────────────────────────────────────

export async function pedirPermissao() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied')  return 'denied'
  const result = await Notification.requestPermission()
  return result
}

export function permissaoAtual() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

// ── helpers internos ──────────────────────────────────────────────────────────

function proximaMensagem() {
  let idx = parseInt(localStorage.getItem(CHAVE_INDICE) ?? '0', 10)
  const msg = MENSAGENS[idx % MENSAGENS.length]
  localStorage.setItem(CHAVE_INDICE, String((idx + 1) % MENSAGENS.length))
  return msg
}

function horaLembrete() {
  return parseInt(localStorage.getItem(CHAVE_HORA) ?? String(HORA_PADRAO), 10)
}

// Calcula ms até o próximo horário definido (hoje se ainda não passou, senão amanhã)
function msAteProximo(hora) {
  const agora = new Date()
  const alvo  = new Date()
  alvo.setHours(hora, 0, 0, 0)
  if (alvo <= agora) alvo.setDate(alvo.getDate() + 1)
  return alvo.getTime() - agora.getTime()
}

// ── agendamento via setTimeout (funciona quando o app está aberto) ─────────────

let _timer = null

export function agendarLembrete(hora = horaLembrete()) {
  cancelarLembrete()
  const ms = msAteProximo(hora)

  _timer = setTimeout(() => {
    dispararNotificacao()
    // Reagenda para o dia seguinte
    agendarLembrete(hora)
  }, ms)
}

export function cancelarLembrete() {
  if (_timer !== null) {
    clearTimeout(_timer)
    _timer = null
  }
}

// ── disparar notificação ──────────────────────────────────────────────────────

export async function dispararNotificacao() {
  if (Notification.permission !== 'granted') return

  const msg = proximaMensagem()

  // Prefere o service worker (persiste mesmo com app fechado no Android)
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready.catch(() => null)
    if (reg?.showNotification) {
      reg.showNotification(msg.titulo, {
        body:  msg.corpo,
        icon:  '/icon-192.png',
        badge: '/icon-192.png',
        tag:   'collagenflow-lembrete',
        renotify: true,
        data:  { url: '/' },
      })
      return
    }
  }

  // Fallback: Notification direta (só funciona com app aberto)
  new Notification(msg.titulo, {
    body: msg.corpo,
    icon: '/icon-192.png',
    tag:  'collagenflow-lembrete',
  })
}

// ── inicialização (chamada no boot do app) ────────────────────────────────────

export function inicializarNotificacoes(lembretesAtivos) {
  if (!lembretesAtivos) { cancelarLembrete(); return }
  if (Notification.permission !== 'granted') return
  agendarLembrete()
}
