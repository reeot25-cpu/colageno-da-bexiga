import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export default function AvisoAtualizacao() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // verifica atualizações a cada 60 segundos enquanto o app está aberto
      if (r) setInterval(() => r.update(), 60_000)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-[#3D2B6B] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-sm w-full">
        <RefreshCw size={18} className="text-[#C9B3ED] shrink-0" />
        <p className="text-sm flex-1 leading-snug">Nova versão disponível!</p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-[#9B7AD6] hover:bg-[#6B4EA8] text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors shrink-0"
        >
          Atualizar
        </button>
      </div>
    </div>
  )
}
