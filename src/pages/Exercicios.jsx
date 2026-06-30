import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, SkipForward, Info } from 'lucide-react'
import { treinos, avisoExercicios, comoContrair } from '../data/exercicios'
import { useProgresso } from '../hooks/useProgresso'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { tocarTrocaEtapa, tocarConclusao } from '../utils/som'

function TelaTimer({ treino, onConcluir, onVoltar }) {
  const [etapaIdx, setEtapaIdx] = useState(0)
  const [segundosRestantes, setSegundosRestantes] = useState(treino.etapas[0].segundos)
  const [pausado, setPausado] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const { config } = useConfiguracoes()
  const intervalRef = useRef(null)

  const etapa = treino.etapas[etapaIdx]
  const totalEtapas = treino.etapas.length

  useEffect(() => {
    if (pausado || concluido) return
    intervalRef.current = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          const proximo = etapaIdx + 1
          if (proximo >= totalEtapas) {
            clearInterval(intervalRef.current)
            setConcluido(true)
            if (config.somAtivo) tocarConclusao()
            return 0
          }
          if (config.somAtivo) tocarTrocaEtapa()
          setEtapaIdx(proximo)
          return treino.etapas[proximo].segundos
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [etapaIdx, pausado, concluido, config.somAtivo])

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
        <h2 className="font-titulo text-2xl text-[#3D2B6B]">Parabéns!</h2>
        <p className="text-[#7B6B9A] text-base">
          Você completou o <strong>{treino.nome}</strong>. Seu corpo agradece o cuidado de hoje! 🌸
        </p>
        <button
          onClick={onConcluir}
          className="w-full py-4 bg-[#9B7AD6] text-white rounded-2xl font-semibold text-lg"
        >
          Registrar conclusão ✓
        </button>
        <button onClick={onVoltar} className="text-[#7B6B9A] underline text-sm">
          Voltar aos exercícios
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 pb-32">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={onVoltar} className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]">
          <ArrowLeft size={20} className="text-[#3D2B6B]" />
        </button>
        <h2 className="font-titulo text-lg text-[#3D2B6B] font-semibold">{treino.nome}</h2>
      </div>

      <div className="px-4 flex flex-col items-center gap-5">
        {/* Barra de progresso das etapas */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#3D2B6B] font-semibold text-sm">
              Etapa {etapaIdx + 1} de {totalEtapas}
            </span>
            <span className="text-[#9B7AD6] font-bold text-sm">
              {Math.round(((etapaIdx) / totalEtapas) * 100)}% concluído
            </span>
          </div>
          {/* Barra contínua */}
          <div className="bg-[#E8E0F8] rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-[#9B7AD6] h-full rounded-full transition-all duration-500"
              style={{ width: `${(etapaIdx / totalEtapas) * 100}%` }}
            />
          </div>
          {/* Segmentos por etapa */}
          <div className="flex gap-1">
            {treino.etapas.map((et, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i < etapaIdx ? '#9B7AD6' : i === etapaIdx ? '#B8A0E0' : '#E8E0F8',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#D8CCF0" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#9B7AD6" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pctTimer / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-titulo text-4xl font-bold text-[#3D2B6B]">
              {minutos > 0 ? `${minutos}:${String(segs).padStart(2, '0')}` : segs}
            </span>
            {minutos === 0 && <span className="text-[#7B6B9A] text-xs">segundos</span>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] w-full text-center">
          <h3 className="font-titulo text-lg text-[#9B7AD6] mb-2">{etapa.nome}</h3>
          <p className="text-[#3D2B6B] text-base leading-relaxed">{etapa.instrucao}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setPausado((p) => !p)}
            className="flex items-center gap-2 px-6 py-3 bg-[#9B7AD6] text-white rounded-2xl font-semibold"
          >
            {pausado ? <Play size={20} /> : <Pause size={20} />}
            {pausado ? 'Continuar' : 'Pausar'}
          </button>
          <button
            onClick={pularEtapa}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#D8CCF0] text-[#7B6B9A] rounded-2xl font-semibold"
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
  const [telaPrincipal, setTelaPrincipal] = useState('lista')
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
            className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]"
          >
            <ArrowLeft size={20} className="text-[#3D2B6B]" />
          </button>
          <h2 className="font-titulo text-xl text-[#3D2B6B]">Como contrair corretamente?</h2>
        </div>
        <div className="px-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
            <p className="text-[#3D2B6B] text-base leading-relaxed">{comoContrair.texto}</p>
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
          <h1 className="font-titulo text-2xl text-[#3D2B6B]">Exercícios</h1>
          <p className="text-[#7B6B9A] text-base mt-1">Faça enquanto espera</p>
        </div>
        <button
          onClick={() => setTelaPrincipal('info')}
          className="flex items-center gap-1 text-sm text-[#7B6B9A] bg-white border border-[#D8CCF0] px-3 py-2 rounded-xl shadow-sm"
        >
          <Info size={16} /> Como fazer?
        </button>
      </div>

      {mostraAviso && (
        <div className="bg-[#FFF5E4] rounded-2xl p-4 border border-[#D4AF7A] flex gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <p className="text-[#7A5A20] text-sm leading-relaxed">{avisoExercicios}</p>
            <button onClick={() => setMostraAviso(false)} className="mt-2 text-xs text-[#7A5A20] underline">
              Entendi
            </button>
          </div>
        </div>
      )}

      {feito && (
        <div className="bg-[#E8E0F8] rounded-2xl p-3 text-center">
          <p className="text-[#6B4EA8] font-semibold">🎉 Exercício de hoje concluído!</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {treinos.map((treino) => (
          <div key={treino.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{treino.icone}</span>
                  <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold">{treino.nome}</h3>
                </div>
                <p className="text-[#7B6B9A] text-sm mt-0.5">{treino.descricao}</p>
              </div>
              <span className="bg-[#EDE7F9] text-[#6B4EA8] font-bold text-sm px-3 py-1 rounded-full">
                {treino.duracao}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {treino.etapas.map((e, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F5F0FF] text-[#7B6B9A] px-2 py-0.5 rounded-full border border-[#D8CCF0]"
                >
                  {e.nome}
                </span>
              ))}
            </div>

            <button
              onClick={() => iniciarTreino(treino)}
              className="w-full py-3.5 bg-[#9B7AD6] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:bg-[#6B4EA8]"
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
