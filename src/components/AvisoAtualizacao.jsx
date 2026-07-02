import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export default function AvisoAtualizacao() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) return
      // Verifica imediatamente ao registrar
      r.update()
      // Verifica a cada 30s enquanto o app está aberto
      setInterval(() => r.update(), 30_000)
    },
  })

  // CORREÇÃO PRINCIPAL — quando o novo SW assume o controle, recarrega a página
  // Isso garante que os arquivos JS/CSS novos sejam carregados (fix iOS PWA)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let recarregando = false
    function aoTrocarControle() {
      if (recarregando) return
      recarregando = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', aoTrocarControle)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', aoTrocarControle)
  }, [])

  // Verifica atualização quando o app volta ao primeiro plano (essencial para iOS)
  useEffect(() => {
    function aoVoltarAoFoco() {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker?.getRegistration().then((r) => r?.update())
      }
    }
    document.addEventListener('visibilitychange', aoVoltarAoFoco)
    return () => document.removeEventListener('visibilitychange', aoVoltarAoFoco)
  }, [])

  // Fallback: banner manual caso a atualização automática não consiga recarregar
  if (!needRefresh) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
      role="alert"
      aria-live="polite"
    >
      <button
        onClick={() => updateServiceWorker(true)}
        className="w-full bg-[#6B4EA8] text-white text-sm font-semibold py-3 px-4 flex items-center justify-center gap-2 shadow-lg"
      >
        <RefreshCw size={15} className="text-[#C9B3ED] shrink-0" />
        Nova versão disponível — toque para atualizar 🔄
      </button>
    </div>
  )
}
