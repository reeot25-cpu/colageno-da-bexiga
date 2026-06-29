import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, SkipForward, Info } from 'lucide-react'
import { treinos, avisoExercicios, comoContrair } from '../data/exercicios'
import { useProgresso } from '../hooks/useProgresso'

// Tela do timer durante o treino
function TelaTimer({ treino, onConcluir, onVoltar }) {
  const [etapaIdx, setEtapaIdx] = useState(0)
  const [segundosRestantes, setSegundosRestantes] = useState(treino.etapas[0].segundos)
  const [pausado, setPausado] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const intervalRef = useRef(null)

  const etapa = treino.etapas[etapaIdx]
  const totalEtapas = treino.etapas.length

  useEffect(() => {
    if (pausado || concluido) return
    intervalRef.current = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          // Avança etapa
          const proximo = etapaIdx + 1
          if (proximo >= totalEtapas) {
            clearInterval(intervalRef.current)
            setConcluido(true)
            return 0
          }
          setEtapaIdx(proximo)
          return treino.etapas[proximo].segundos
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [etapaIdx, pausado, concluido])

  function pularEtapa() {
    clearInterval(intervalRef.current)
    const proximo = etapaIdx + 1
    if (proximo >= totalEtapas) {
      setConcluido(true)
    } else {
      setEtapaIdx(proximo)
      setSegundosRestantes(treino.etapas[proximo].segundos)
    }
  }

  const minutos = Math.floor(segundosRestantes / 60)
  const segs = segundosRestantes % 60
  const pctTimer = ((etapa.segundos - segundosRestantes) / etapa.segundos) * 100

  if (concluido) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="font-titulo text-2xl text-[#5C4A3D]">Parabéns!</h2>
        <p className="text-[#9C8A7A] text-base">
          Você completou o <strong>{treino.nome}</strong>. Seu corpo agradece o cuidado de hoje! 🌸
        </p>
        <button
          onClick={onConcluir}
          className="w-full py-4 bg-[#C66B5A] text-white rounded-2xl font-semibold text-lg"
        >
          Registrar conclusão ✓
        </button>
        <button onClick={onVoltar} className="text-[#9C8A7A] underline text-sm">
          Voltar aos exercícios
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 pb-32">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={onVoltar} className="p-2 rounded-full bg-white shadow-sm border border-[#EDE5D8]">
          <ArrowLeft size={20} className="text-[#5C4A3D]" />
        </button>
        <h2 className="font-titulo text-lg text-[#5C4A3D] font-semibold">{treino.nome}</h2>
      </div>

      <div className="px-4 flex flex-col items-center gap-6">
        {/* Progresso de etapas */}
        <div className="flex gap-1.5 w-full">
          {treino.etapas.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{ backgroundColor: i <= etapaIdx ? '#C66B5A' : '#EDE5D8' }}
            />
          ))}
        </div>

        <p className="text-[#9C8A7A] text-sm">
          Etapa {etapaIdx + 1} de {totalEtapas}
        </p>

        {/* Timer circular */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#EDE5D8" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#C66B5A" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pctTimer / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-titulo text-4xl font-bold text-[#5C4A3D]">
              {minutos > 0 ? `${minutos}:${String(segs).padStart(2, '0')}` : segs}
            </span>
            {minutos === 0 && <span className="text-[#9C8A7A] text-xs">segundos</span>}
          </div>
        </div>

        {/* Nome e instrução da etapa */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE5D8] w-full text-center">
          <h3 className="font-titulo text-lg text-[#C66B5A] mb-2">{etapa.nome}</h3>
          <p className="text-[#5C4A3D] text-base leading-relaxed">{etapa.instrucao}</p>
        </div>

        {/* Controles */}
        <div className="flex gap-4">
          <button
            onClick={() => setPausado((p) => !p)}
            className="flex items-center gap-2 px-6 py-3 bg-[#C66B5A] text-white rounded-2xl font-semibold"
          >
            {pausado ? <Play size={20} /> : <Pause size={20} />}
            {pausado ? 'Continuar' : 'Pausar'}
          </button>
          <button
            onClick={pularEtapa}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#EDE5D8] text-[#9C8A7A] rounded-2xl font-semibold"
          >
            <SkipForward size={20} />
            Pular
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Exercicios() {
  const [telaPrincipal, setTelaPrincipal] = useState('lista') // lista | info | timer
  const [treinoSelecionado, setTreinoSelecionado] = useState(null)
  const [mostraAviso, setMostraAviso] = useState(true)
  const { marcarTarefa, estado, diaAtivo } = useProgresso()

  const tarefaId = `d${diaAtivo}_exercicio`
  const feito = estado.concluidas[tarefaId] ?? false

  function iniciarTreino(treino) {
    setTreinoSelecionado(treino)
    setTelaPrincipal('timer')
  }

  function concluirTreino() {
    marcarTarefa(tarefaId, true)
    setTelaPrincipal('lista')
    setTreinoSelecionado(null)
  }

  if (telaPrincipal === 'timer') {
    return (
      <TelaTimer
        treino={treinoSelecionado}
        onConcluir={concluirTreino}
        onVoltar={() => setTelaPrincipal('lista')}
      />
    )
  }

  if (telaPrincipal === 'info') {
    return (
      <div className="flex flex-col gap-5 pb-32">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            onClick={() => setTelaPrincipal('lista')}
            className="p-2 rounded-full bg-white shadow-sm border border-[#EDE5D8]"
          >
            <ArrowLeft size={20} className="text-[#5C4A3D]" />
          </button>
          <h2 className="font-titulo text-xl text-[#5C4A3D]">Como contrair corretamente?</h2>
        </div>
        <div className="px-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE5D8]">
            <p className="text-[#5C4A3D] text-base leading-relaxed">{comoContrair.texto}</p>
          </div>
          <div className="bg-[#FFF5E4] rounded-2xl p-4 border border-[#D4AF7A]">
            <p className="text-[#7A5A20] text-sm leading-relaxed">⚠️ {avisoExercicios}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-titulo text-2xl text-[#5C4A3D]">Exercícios</h1>
          <p className="text-[#9C8A7A] text-base mt-1">Faça enquanto espera</p>
        </div>
        <button
          onClick={() => setTelaPrincipal('info')}
          className="flex items-center gap-1 text-sm text-[#9C8A7A] bg-white border border-[#EDE5D8] px-3 py-2 rounded-xl shadow-sm"
        >
          <Info size={16} /> Como fazer?
        </button>
      </div>

      {/* Aviso */}
      {mostraAviso && (
        <div className="bg-[#FFF5E4] rounded-2xl p-4 border border-[#D4AF7A] flex gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <p className="text-[#7A5A20] text-sm leading-relaxed">{avisoExercicios}</p>
            <button
              onClick={() => setMostraAviso(false)}
              className="mt-2 text-xs text-[#7A5A20] underline"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Treino de hoje marcado */}
      {feito && (
        <div className="bg-[#E8F0E4] rounded-2xl p-3 text-center">
          <p className="text-[#4A6B3E] font-semibold">🎉 Exercício de hoje concluído!</p>
        </div>
      )}

      {/* Cards de treino */}
      <div className="flex flex-col gap-3">
        {treinos.map((treino) => (
          <div
            key={treino.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE5D8]"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{treino.icone}</span>
                  <h3 className="font-titulo text-lg text-[#5C4A3D] font-semibold">{treino.nome}</h3>
                </div>
                <p className="text-[#9C8A7A] text-sm mt-0.5">{treino.descricao}</p>
              </div>
              <span className="bg-[#F5EAD8] text-[#A07840] font-bold text-sm px-3 py-1 rounded-full">
                {treino.duracao}
              </span>
            </div>

            {/* Etapas resumidas */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {treino.etapas.map((e, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F5F0E8] text-[#9C8A7A] px-2 py-0.5 rounded-full border border-[#EDE5D8]"
                >
                  {e.nome}
                </span>
              ))}
            </div>

            <button
              onClick={() => iniciarTreino(treino)}
              className="w-full py-3.5 bg-[#C66B5A] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:bg-[#A85748]"
            >
              <Play size={18} fill="white" />
              Começar treino
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
