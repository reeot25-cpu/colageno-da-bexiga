import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import AvisoAtualizacao from './components/AvisoAtualizacao'
import PedirPermissaoNotificacao from './components/PedirPermissaoNotificacao'
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
import { inicializarNotificacoes } from './utils/notificacoes'

function AppInner() {
  const { config } = useConfiguracoes()

  useEffect(() => {
    inicializarNotificacoes(config.lembretesAtivos)
  }, [config.lembretesAtivos])

  return (
    <div className="flex flex-col min-h-dvh bg-[#EDE7F9] max-w-lg mx-auto w-full">
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
    </div>
  )
}

export default function App() {
  return <AppInner />
}
