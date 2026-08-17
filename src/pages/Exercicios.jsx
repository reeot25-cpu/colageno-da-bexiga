import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, SkipForward, Info, Timer, RotateCcw, Lock } from 'lucide-react'
import GuiaVisualExercicio from '../components/GuiaVisualExercicio'
import { treinos, avisoExercicios, comoContrair } from '../data/exercicios'
import {
  gruposInvisiveis,
  mensagemAberturaInvisiveis,
  subtituloInvisiveis,
} from '../data/exerciciosInvisiveis'
import { useProgresso } from '../hooks/useProgresso'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { getNomeSalvo } from '../hooks/useNome'
import { primeiroNome } from '../utils/saudacao'
import { LINK_ASSINATURA } from '../utils/acesso'
import { tocarTrocaEtapa, tocarConclusao } from '../utils/som'

// ── Seleção de voz feminina ───────────────────────────────────────────────────
// Regra: SEMPRE voz feminina, NUNCA masculina.
// Os nomes de voz variam por sistema/navegador:
//   Windows → "Microsoft Maria"        | Android → "Google português (Brasil)" / "Francisca"
//   iOS/Safari → "Luciana" (pt-BR), "Joana"/"Catarina" (pt-PT)
// Estratégia: entre as vozes em português, pegar a primeira reconhecidamente
// feminina em pt-BR; se não houver, feminina em pt-PT; depois feminina em
// qualquer idioma; e, por último, uma voz pt que NÃO seja masculina conhecida.
const NOMES_FEMININOS =
  /female|feminin|\bmaria\b|luciana|francisca|fernanda|joana|catarina|helena|c[íi]ntia|ines|in[eê]s|vit[oó]ria|google portugu[eê]s|paulina|isabela|let[íi]cia|ana\b/i
const NOMES_MASCULINOS =
  /\bmale\b|masculin|daniel|jo[aã]o|ricardo|felipe|paulo|ant[oó]nio|antonio|carlos|eduardo|heitor|felix/i

// As vozes carregam de forma ASSÍNCRONA (evento 'voiceschanged' no Chrome/Edge).
// Se getVoices() for chamado no clique antes de carregar, volta vazio e o sistema
// usa a voz padrão — que pode ser masculina. Por isso pré-carregamos num cache
// já na importação do módulo e mantemos atualizado.
let _vozesCache = []
function _atualizarVozes() {
  const v = window.speechSynthesis.getVoices()
  if (v && v.length) _vozesCache = v
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  _atualizarVozes()
  window.speechSynthesis.addEventListener?.('voiceschanged', _atualizarVozes)
}

function escolherVozFeminina() {
  if (!('speechSynthesis' in window)) return null
  const vozes = _vozesCache.length ? _vozesCache : window.speechSynthesis.getVoices() || []
  const pt = vozes.filter((v) => v.lang && v.lang.toLowerCase().startsWith('pt'))
  const ehFeminina = (v) => NOMES_FEMININOS.test(v.name)
  const ehMasculina = (v) => NOMES_MASCULINOS.test(v.name)

  return (
    pt.find((v) => v.lang === 'pt-BR' && ehFeminina(v)) ?? // 1. feminina pt-BR
    pt.find((v) => v.lang.toLowerCase() === 'pt-pt' && ehFeminina(v)) ?? // 2. feminina pt-PT
    pt.find((v) => ehFeminina(v)) ?? // 3. feminina em qualquer pt
    vozes.find((v) => ehFeminina(v)) ?? // 4. feminina em qualquer idioma
    pt.find((v) => v.lang === 'pt-BR' && !ehMasculina(v)) ?? // 5. pt-BR não-masculina
    pt.find((v) => !ehMasculina(v)) ?? // 6. qualquer pt não-masculina
    null // 7. nada seguro → deixa o padrão do sistema (não força masculina)
  )
}

// ── Botão de narração por voz ─────────────────────────────────────────────────
// A Web Speech API exige gesto direto do usuário (onClick).
// Chamar speak() dentro de useEffect não funciona no iOS/Chrome.
function BotaoNarracao({ texto, rate = 0.88, pitch = 1.05 }) {
  const [estado, setEstado] = useState('parado') // 'parado' | 'falando' | 'pausado'
  const utteranceRef = useRef(null)

  // Para e limpa ao desmontar (troca de etapa)
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      setEstado('parado')
    }
  }, [texto]) // reinicia quando o texto muda (nova etapa)

  if (!('speechSynthesis' in window)) return null

  function toggleVoz() {
    if (estado === 'falando') {
      window.speechSynthesis.pause()
      setEstado('pausado')
      return
    }

    if (estado === 'pausado') {
      window.speechSynthesis.resume()
      setEstado('falando')
      return
    }

    // estado === 'parado' → iniciar do zero
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(texto)
    u.lang = 'pt-BR'
    u.rate = rate
    u.pitch = pitch
    u.volume = 1

    // Seleciona uma voz FEMININA — nunca masculina (ver escolherVozFeminina).
    const voz = escolherVozFeminina()
    if (voz) u.voice = voz
    if (voz) u.lang = voz.lang

    u.onend = () => setEstado('parado')
    u.onerror = () => setEstado('parado')
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setEstado('falando')
  }

  const label = estado === 'falando' ? 'Pausar narração' : estado === 'pausado' ? 'Continuar narração' : 'Ouvir instruções'
  const icone = estado === 'falando' ? <Pause size={16} /> : <Play size={16} fill="currentColor" />

  return (
    <button
      onClick={toggleVoz}
      className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors w-full justify-center ${
        estado === 'falando'
          ? 'bg-[#EDE7F9] text-[#6B4EA8] border border-[#C9B3ED]'
          : 'bg-[#9B7AD6] text-white'
      }`}
    >
      {icone}
      {label}
    </button>
  )
}

// ── Cronômetro simples para os exercícios invisíveis ─────────────────────────
// Um contador único (sem etapas). Toca o sino de conclusão ao terminar.
function CronometroInvisivel({ segundos, label }) {
  const [restante, setRestante] = useState(segundos)
  const [rodando, setRodando] = useState(false)
  const { config } = useConfiguracoes()
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!rodando) return
    intervalRef.current = setInterval(() => {
      setRestante((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRodando(false)
          if (config.somAtivo) tocarConclusao()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [rodando, config.somAtivo])

  const terminou = restante === 0
  const mm = Math.floor(restante / 60)
  const ss = restante % 60
  const display = mm > 0 ? `${mm}:${String(ss).padStart(2, '0')}` : `${ss}s`

  function toggle() {
    if (terminou) {
      setRestante(segundos)
      setRodando(true)
      return
    }
    setRodando((r) => !r)
  }

  return (
    <button
      onClick={toggle}
      className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold w-full justify-center bg-[#EDE7F9] text-[#6B4EA8] border border-[#C9B3ED]"
    >
      {terminou ? <RotateCcw size={16} /> : <Timer size={16} />}
      {terminou ? 'Muito bem 💜 Repetir' : rodando ? `${display}…` : label}
    </button>
  )
}

// ── Card de um exercício invisível ────────────────────────────────────────────
function CartaoInvisivel({ ex }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
      <h4 className="font-titulo text-base text-[#6B4EA8] font-semibold mb-2">{ex.nome}</h4>

      <div className="inline-flex items-center gap-1.5 bg-[#EDE7F9] text-[#6B4EA8] text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
        🤫 Invisível — ninguém percebe
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <p className="text-[#3D2B6B] leading-relaxed">
          <span className="font-semibold text-[#7B6B9A]">Como ficar: </span>
          {ex.posicao}
        </p>
        <p className="text-[#3D2B6B] leading-relaxed">
          <span className="font-semibold text-[#7B6B9A]">O que contrair: </span>
          {ex.foco}
        </p>
        <p className="text-[#3D2B6B] leading-relaxed bg-[#F5F0FF] rounded-xl p-3 border border-[#D8CCF0]">
          {ex.instrucao}
        </p>
      </div>

      <BotaoNarracao key={ex.nome} texto={ex.narracao} rate={0.88} pitch={1.1} />
      {ex.timer && <CronometroInvisivel segundos={ex.timer} label={ex.timerLabel} />}
    </div>
  )
}

// ── Seção "Faça em Qualquer Lugar" — exercícios invisíveis por momento do dia ──
function SecaoInvisiveis() {
  return (
    <div className="flex flex-col gap-6">
      {/* Mensagem de abertura motivadora */}
      <div className="bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] rounded-2xl p-5 text-center shadow-sm">
        <p className="text-white font-titulo text-lg leading-snug">{mensagemAberturaInvisiveis}</p>
      </div>

      {gruposInvisiveis.map((grupo) => (
        <div key={grupo.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="text-2xl">{grupo.emoji}</span>
            <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold">{grupo.momento}</h3>
            {grupo.bonus && (
              <span className="ml-auto bg-[#FFF0DA] text-[#B57A2A] text-xs font-bold px-2.5 py-1 rounded-full border border-[#E9CFA0]">
                bônus ✨
              </span>
            )}
          </div>
          {grupo.exercicios.map((ex, i) => (
            <CartaoInvisivel key={i} ex={ex} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Card Premium bloqueado (Treino Avançado) ─────────────────────────────────
// Sempre bloqueado — leva para a página de assinatura. Quando existir o backend
// de assinatura, é aqui que o conteúdo avançado será liberado para assinantes.
function CardPremiumBloqueado() {
  return (
    <a
      href={LINK_ASSINATURA}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] relative overflow-hidden active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold">Treino Avançado</h3>
        </div>
        <span className="flex items-center gap-1 bg-[#EDE7F9] text-[#6B4EA8] font-bold text-xs px-3 py-1 rounded-full">
          <Lock size={12} /> Premium
        </span>
      </div>
      <p className="text-[#7B6B9A] text-sm mb-4">
        Rotina completa de 10 minutos para levar seu assoalho pélvico ao próximo nível.
      </p>
      <div className="w-full py-3.5 bg-[#EDE7F9] text-[#6B4EA8] rounded-xl font-semibold text-base flex items-center justify-center gap-2">
        <Lock size={16} /> Disponível na assinatura 💜
      </div>
    </a>
  )
}

function TelaTimer({ treino, onConcluir, onVoltar }) {
  const [etapaIdx, setEtapaIdx] = useState(0)
  const [segundosRestantes, setSegundosRestantes] = useState(treino.etapas[0].segundos)
  const [iniciado, setIniciado] = useState(false)
  const [pausado, setPausado] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const { config } = useConfiguracoes()
  const intervalRef = useRef(null)

  const etapa = treino.etapas[etapaIdx]
  const totalEtapas = treino.etapas.length

  function comecar() {
    setIniciado(true)
    setPausado(false)
  }

  useEffect(() => {
    if (!iniciado || pausado || concluido) return
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
  }, [etapaIdx, iniciado, pausado, concluido, config.somAtivo])

  function pularEtapa() {
    clearInterval(intervalRef.current)
    window.speechSynthesis?.cancel()
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
  const pctTimer = iniciado ? ((etapa.segundos - segundosRestantes) / etapa.segundos) * 100 : 0

  if (concluido) {
    const nome = primeiroNome(getNomeSalvo())
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="font-titulo text-2xl text-[#3D2B6B]">
          {nome ? `Parabéns, ${nome}!` : 'Parabéns!'}
        </h2>
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
              {Math.round((etapaIdx / totalEtapas) * 100)}% concluído
            </span>
          </div>
          <div className="bg-[#E8E0F8] rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-[#9B7AD6] h-full rounded-full transition-all duration-500"
              style={{ width: `${(etapaIdx / totalEtapas) * 100}%` }}
            />
          </div>
          <div className="flex gap-1">
            {treino.etapas.map((et, i) => (
              <div key={i} className="flex-1">
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

        {/* Timer circular */}
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
            {minutos === 0 && (
              <span className="text-[#7B6B9A] text-xs">
                {iniciado ? 'segundos' : 'seg para começar'}
              </span>
            )}
          </div>
        </div>

        {/* Guia visual de pulsação */}
        <GuiaVisualExercicio
          nomeEtapa={etapa.nome}
          segundosRestantes={segundosRestantes}
          duracaoTotal={etapa.segundos}
          ativo={iniciado && !pausado && !concluido}
        />

        {/* Instrução da etapa + botão de narração */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] w-full text-center">
          <h3 className="font-titulo text-lg text-[#9B7AD6] mb-2">{etapa.nome}</h3>
          <p className="text-[#3D2B6B] text-base leading-relaxed">{etapa.instrucao}</p>
          <BotaoNarracao key={etapaIdx} texto={etapa.narracao} />
        </div>

        {/* Botão Começar — aparece só antes de iniciar */}
        {!iniciado && (
          <button
            onClick={comecar}
            className="w-full py-4 bg-gradient-to-r from-[#9B7AD6] to-[#7B5ABE] text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
          >
            <Play size={22} fill="white" />
            Estou pronta — Começar!
          </button>
        )}

        {/* Controles durante o exercício */}
        {iniciado && (
          <div className="flex gap-3 items-center">
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
        )}
      </div>
    </div>
  )
}

export default function Exercicios() {
  const [telaPrincipal, setTelaPrincipal] = useState('lista')
  const [treinoSelecionado, setTreinoSelecionado] = useState(null)
  const [mostraAviso, setMostraAviso] = useState(true)
  const [secao, setSecao] = useState('treinos') // 'treinos' | 'invisiveis'
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
          <p className="text-[#7B6B9A] text-base mt-1">
            {secao === 'treinos' ? 'Faça enquanto espera' : subtituloInvisiveis}
          </p>
        </div>
        <button
          onClick={() => setTelaPrincipal('info')}
          className="flex items-center gap-1 text-sm text-[#7B6B9A] bg-white border border-[#D8CCF0] px-3 py-2 rounded-xl shadow-sm shrink-0"
        >
          <Info size={16} /> Como fazer?
        </button>
      </div>

      {/* Seletor de seção */}
      <div className="bg-white rounded-2xl p-1 flex gap-1 border border-[#D8CCF0] shadow-sm">
        <button
          onClick={() => setSecao('treinos')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            secao === 'treinos' ? 'bg-[#9B7AD6] text-white' : 'text-[#7B6B9A]'
          }`}
        >
          Treinos guiados
        </button>
        <button
          onClick={() => setSecao('invisiveis')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            secao === 'invisiveis' ? 'bg-[#9B7AD6] text-white' : 'text-[#7B6B9A]'
          }`}
        >
          Faça em qualquer lugar 💜
        </button>
      </div>

      {secao === 'treinos' && (
        <>
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

            {/* Treino avançado — sempre bloqueado (Premium) */}
            <CardPremiumBloqueado />
          </div>
        </>
      )}

      {secao === 'invisiveis' && <SecaoInvisiveis />}
    </div>
  )
}
