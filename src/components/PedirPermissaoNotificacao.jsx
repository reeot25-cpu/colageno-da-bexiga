import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { pedirPermissao, permissaoAtual, agendarLembrete } from '../utils/notificacoes'

const CHAVE_JA_PERGUNTOU = 'collagenflow_notif_perguntou'

export default function PedirPermissaoNotificacao({ lembretesAtivos }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    if (!lembretesAtivos) return
    if (!('Notification' in window)) return
    if (permissaoAtual() !== 'default') return                    // já respondeu antes
    if (localStorage.getItem(CHAVE_JA_PERGUNTOU)) return         // já mostrou o card

    // Aguarda 30s após abrir o app para não ser intrusivo
    const t = setTimeout(() => setVisivel(true), 30_000)
    return () => clearTimeout(t)
  }, [lembretesAtivos])

  async function aceitar() {
    localStorage.setItem(CHAVE_JA_PERGUNTOU, '1')
    setVisivel(false)
    const resultado = await pedirPermissao()
    if (resultado === 'granted') agendarLembrete()
  }

  function recusar() {
    localStorage.setItem(CHAVE_JA_PERGUNTOU, '1')
    setVisivel(false)
  }

  if (!visivel) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-label="Ativar lembretes"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        {/* Ícone */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE7F9] flex items-center justify-center">
            <Bell size={28} className="text-[#9B7AD6]" />
          </div>
          <button
            onClick={recusar}
            className="p-2 rounded-full text-[#C9B3ED] active:bg-[#EDE7F9]"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Texto */}
        <h2 className="font-titulo text-xl text-[#3D2B6B] mb-2">
          Ativar lembretes diários?
        </h2>
        <p className="text-[#7B6B9A] text-sm leading-relaxed mb-6">
          Posso te lembrar todos os dias de fazer seus exercícios e registrar seu diário — com mensagens acolhedoras, no horário que você preferir. 💜
        </p>

        {/* Botões */}
        <div className="flex flex-col gap-2">
          <button
            onClick={aceitar}
            className="w-full py-3.5 rounded-2xl bg-[#9B7AD6] text-white font-semibold text-base active:bg-[#6B4EA8] transition-colors"
          >
            Sim, quero ser lembrada!
          </button>
          <button
            onClick={recusar}
            className="w-full py-3 rounded-2xl text-[#9B8BBB] font-semibold text-sm active:bg-[#EDE7F9] transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
