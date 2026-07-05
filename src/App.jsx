import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import AvisoAtualizacao from './components/AvisoAtualizacao'
import PedirPermissaoNotificacao from './components/PedirPermissaoNotificacao'
import SplashScreen from './components/SplashScreen'
import BoasVindasNome from './components/BoasVindasNome'
import TelaBloqueio from './components/TelaBloqueio'
import Inicio from './pages/Inicio'
import Chas from './pages/Chas'
import Receitas from './pages/Receitas'
import Exercicios from './pages/Exercicios'
import Progresso from './pages/Progresso'
import Aviso from './pages/Aviso'
import Configuracoes from './pages/Configuracoes'
import Produtos from './pages/Produtos'
import Diario from './pages/Diario'
import { useConfiguracoes } from './hooks/useConfiguracoes'
import { useBadgeDiario } from './hooks/useBadgeDiario'
import { useNome } from './hooks/useNome'
import { useAcesso } from './hooks/useAcesso'
import { inicializarNotificacoes } from './utils/notificacoes'

function AppInner() {
  const { config } = useConfiguracoes()
  const { nome, salvarNome } = useNome()
  const acesso = useAcesso()
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    inicializarNotificacoes(config.lembretesAtivos)
  }, [config.lembretesAtivos])

  // Badge no ícone do app (respeita a config de lembretes)
  useBadgeDiario(config.lembretesAtivos)

  // Onboarding do nome: enquanto não houver nome (após a splash), mostramos só a
  // tela de boas-vindas — o app principal nem monta. Assim, ao salvar o nome, as
  // páginas montam já com ele (evita saudação genérica por estado desatualizado).
  const precisaOnboarding = splashDone && !nome

  return (
    <div className="flex flex-col min-h-dvh bg-[#EDE7F9] max-w-lg mx-auto w-full">
      <SplashScreen onDone={() => setSplashDone(true)} />

      {precisaOnboarding ? (
        <BoasVindasNome onSalvar={salvarNome} />
      ) : acesso.expirado ? (
        // Fim dos 21 dias → tela de bloqueio acolhedora (substitui o app)
        <TelaBloqueio />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/chas" element={<Chas />} />
              <Route path="/receitas" element={<Receitas />} />
              <Route path="/exercicios" element={<Exercicios />} />
              <Route path="/progresso" element={<Progresso />} />
              <Route path="/aviso" element={<Aviso />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/diario" element={<Diario />} />
            </Routes>
          </main>
          <BottomNav />
          <AvisoAtualizacao />
          <PedirPermissaoNotificacao lembretesAtivos={config.lembretesAtivos} />
        </>
      )}
    </div>
  )
}

export default function App() {
  return <AppInner />
}
