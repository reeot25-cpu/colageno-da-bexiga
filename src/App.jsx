import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Inicio from './pages/Inicio'
import Chas from './pages/Chas'
import Receitas from './pages/Receitas'
import Exercicios from './pages/Exercicios'
import Progresso from './pages/Progresso'
import Aviso from './pages/Aviso'

export default function App() {
  return (
    <div className="flex flex-col min-h-dvh bg-[#F5F0E8] max-w-lg mx-auto w-full">
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/chas" element={<Chas />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/exercicios" element={<Exercicios />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/aviso" element={<Aviso />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
