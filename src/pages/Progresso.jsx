import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Circle, Lock, Star, RotateCcw, Flag, Award, Gift } from 'lucide-react'
import { diasRitual, semanaDoDia, SEMANAS_RITUAL } from '../data/ritual'
import { useProgresso, diasFaltando } from '../hooks/useProgresso'
import { usePetalas } from '../hooks/usePetalas'
import { getNomeSalvo } from '../hooks/useNome'
import { primeiroNome, comNome } from '../utils/saudacao'
import { VALORES } from '../utils/petalas'
import ModeTeste from '../components/ModeTeste'
import CardPremio from '../components/CardPremio'
import AvatarCartoon, { VARIACOES, lerAvatarEscolhido, salvarAvatarEscolhido } from '../components/AvatarCartoon'

// ── Modal de resumo do dia ────────────────────────────────────────────────────

function MensagemDia({ dia, feitas, total, onFechar }) {
  const completo = feitas === total && total > 0
  const nenhumaFeita = feitas === 0
  const nome = primeiroNome(getNomeSalvo())

  const msgCompleto = [
    `Você é incrível! Completou todos os ${total} itens do Dia ${dia}. Cada escolha conta — e hoje você escolheu se cuidar! 🌸`,
    `Dia ${dia} conquistado! ${total} de ${total} tarefas feitas. Seu assoalho pélvico agradece o carinho de hoje. 💜`,
    `Perfeita! Tudo certo no Dia ${dia}. A constância que você está construindo vai mudar sua qualidade de vida. 🌺`,
  ]
  const msgParcial = [
    `Não importa, cada pequeno passo conta! Você fez ${feitas} de ${total} itens hoje — isso já é cuidado. Amanhã é um novo dia 💜`,
    `Parabéns por estar aqui! ${feitas} de ${total} tarefas feitas. O importante é continuar, sem se cobrar. 🌷`,
    `Você se cuidou hoje, e isso já é muito! ${feitas} de ${total} itens. Amanhã você retoma, sem culpa. 🌸`,
  ]
  const msgNenhuma = [
    `Tudo bem, dias assim acontecem! O que importa é que você voltou. Amanhã você retoma com carinho 💜`,
    `Não se cobre, tá? Amanhã é um novo começo. Seu corpo sabe que você está tentando 🌸`,
  ]

  const msgs = completo ? msgCompleto : nenhumaFeita ? msgNenhuma : msgParcial
  const texto = comNome(nome, msgs[dia % msgs.length])

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="text-center mb-4">
          <span className="text-5xl">{completo ? '🌟' : nenhumaFeita ? '🤗' : '🌷'}</span>
        </div>
        <h3 className="font-titulo text-xl text-[#3D2B6B] text-center mb-3">
          {completo
            ? (nome ? `Parabéns, ${nome}!` : `Dia ${dia} completo!`)
            : nenhumaFeita
              ? 'Amanhã é um novo dia!'
              : (nome ? `Você se cuidou hoje, ${nome}!` : 'Você se cuidou hoje!')}
        </h3>

        {/* Barra de progresso no modal */}
        <div className="bg-[#EDE7F9] rounded-2xl px-4 py-3 mb-4">
          <div className="flex justify-between text-xs text-[#7B6B9A] mb-1.5">
            <span>Dia {dia}</span>
            <span className="font-semibold text-[#9B7AD6]">{feitas} de {total} tarefas</span>
          </div>
          <div className="bg-[#D8CCF0] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#9B7AD6] h-full rounded-full transition-all"
              style={{ width: `${total > 0 ? (feitas / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <p className="text-[#7B6B9A] text-sm leading-relaxed text-center mb-6">{texto}</p>

        <button
          onClick={onFechar}
          className="w-full py-3.5 rounded-2xl bg-[#9B7AD6] text-white font-semibold text-base"
        >
          {completo ? 'Que orgulho! 💜' : 'Obrigada, vou continuar! 💜'}
        </button>
      </div>
    </div>
  )
}

// ── Card de dia na grade ──────────────────────────────────────────────────────

function CardDia({ dia, prog, ativo, bloqueado, faltam, onClick }) {
  const completo = prog.feitas === prog.total && prog.total > 0
  return (
    <button
      onClick={onClick}
      disabled={bloqueado}
      className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
        bloqueado
          ? 'bg-[#F5F2FB] border border-dashed border-[#C9B3ED] opacity-60 cursor-default'
          : ativo
          ? 'bg-[#9B7AD6] text-white shadow-md'
          : completo
          ? 'bg-[#E8E0F8]'
          : 'bg-white border border-[#D8CCF0]'
      }`}
    >
      {bloqueado ? (
        <Lock size={14} className="text-[#C9B3ED]" />
      ) : completo ? (
        <Star size={16} fill={ativo ? 'white' : '#9B7AD6'} className={ativo ? 'text-white' : 'text-[#9B7AD6]'} />
      ) : (
        <span className={`text-xs font-bold ${ativo ? 'text-white' : 'text-[#7B6B9A]'}`}>D{dia}</span>
      )}
      {bloqueado ? (
        <span className="text-[9px] text-[#C9B3ED]">{faltam}d</span>
      ) : (
        <span className={`text-[10px] ${ativo ? 'text-[#D4C0F0]' : 'text-[#9B8BBB]'}`}>
          {prog.feitas}/{prog.total}
        </span>
      )}
      {!bloqueado && (
        <div className="w-full px-1">
          <div className={`h-1 rounded-full w-full ${ativo ? 'bg-white/30' : 'bg-[#E8E0F8]'}`}>
            <div
              className={`h-full rounded-full transition-all ${ativo ? 'bg-white' : 'bg-[#9B7AD6]'}`}
              style={{ width: `${prog.pct}%` }}
            />
          </div>
        </div>
      )}
    </button>
  )
}

// ── Medalhas ──────────────────────────────────────────────────────────────────

function SecaoMedalhas({ medalhas }) {
  const ganhas = medalhas.filter((m) => m.ganhou).length
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#9B7AD6]" />
          <p className="font-semibold text-[#3D2B6B] text-base">Suas medalhas</p>
        </div>
        <span className="text-xs font-bold text-[#9B7AD6]">{ganhas}/{medalhas.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {medalhas.map((m) => (
          <div key={m.id} className="flex flex-col items-center text-center gap-1">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
              m.ganhou
                ? 'bg-gradient-to-br from-[#C9B3ED] to-[#9B7AD6] shadow-md'
                : 'bg-[#F5F2FB] border border-dashed border-[#C9B3ED] grayscale opacity-50'
            }`}>
              {m.emoji}
            </div>
            <p className={`text-[11px] leading-tight ${m.ganhou ? 'text-[#3D2B6B] font-semibold' : 'text-[#9B8BBB]'}`}>
              {m.nome}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Prêmios (Pétalas) ─────────────────────────────────────────────────────────

const COMO_GANHAR = [
  ['Tarefa do ritual feita no próprio dia', VALORES.tarefaRitual],
  ['Dia do ritual completo (bônus)', VALORES.diaRitualCompleto],
  [`Treino até o fim, segurando no Aperta (até ${VALORES.treinosMaxPorDia} por dia)`, VALORES.treino],
  ['Diário preenchido no dia', VALORES.diarioPreenchido],
  ['A cada 7 dias seguidos de treino (bônus)', VALORES.bonusSemanaTreino],
]

function EscolhaAvatar() {
  const [escolhido, setEscolhido] = useState(lerAvatarEscolhido)
  function escolher(idx) {
    salvarAvatarEscolhido(idx)
    setEscolhido(idx)
  }
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {VARIACOES.map((v, i) => (
          <button
            key={i}
            onClick={() => escolher(i)}
            aria-label={`Aparência ${i + 1}`}
            aria-pressed={escolhido === i}
            className={`flex items-center justify-center rounded-xl py-1 transition-all ${
              escolhido === i ? 'bg-[#EDE7F9] ring-2 ring-[#9B7AD6]' : 'bg-[#F5F2FB]'
            }`}
          >
            <AvatarCartoon nivel={0} dedos={5} variacao={v} largura={52} />
          </button>
        ))}
      </div>
      <button
        onClick={() => escolher(null)}
        className={`w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border ${
          escolhido === null ? 'bg-[#EDE7F9] border-[#9B7AD6] text-[#6B4EA8]' : 'border-[#D8CCF0] text-[#7B6B9A]'
        }`}
      >
        🔀 Variar a cada sessão
      </button>
    </div>
  )
}

function SecaoPremios() {
  const { saldo, desbloqueado, desbloquear } = usePetalas()
  return (
    <div id="premios" className="flex flex-col gap-3 scroll-mt-4">
      <div className="bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Gift size={18} className="text-[#D4C0F0]" />
          <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Seus prêmios</p>
        </div>
        <p className="font-titulo text-3xl font-bold">🌸 {saldo.toLocaleString('pt-BR')} <span className="text-lg font-normal text-[#D4C0F0]">Pétalas</span></p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-[#D4C0F0] font-semibold">Como ganhar Pétalas</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {COMO_GANHAR.map(([texto, valor]) => (
              <li key={texto} className="flex justify-between gap-3">
                <span>{texto}</span>
                <span className="font-bold shrink-0">+{valor}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <CardPremio
        premio="treinoCompleto"
        emoji="✨"
        titulo="Treino Completo"
        descricao="Rotina completa de 10 minutos para o seu assoalho pélvico."
        saldo={saldo}
        desbloqueado={desbloqueado('treinoCompleto')}
        onDesbloquear={() => desbloquear('treinoCompleto')}
      >
        <Link to="/exercicios" className="block w-full py-3 bg-[#EDE7F9] text-[#6B4EA8] rounded-xl font-semibold text-center">
          Já está na sua lista de exercícios →
        </Link>
      </CardPremio>

      <CardPremio
        premio="avatar"
        emoji="🎨"
        titulo="Seu avatar"
        descricao="Escolha a aparência da guia que acompanha seus treinos."
        saldo={saldo}
        desbloqueado={desbloqueado('avatar')}
        onDesbloquear={() => desbloquear('avatar')}
      >
        <EscolhaAvatar />
      </CardPremio>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Progresso() {
  const {
    estado, marcarTarefa, reiniciar, recarregar,
    progressoDia, progressoGeral,
    diaDesbloqueado, iniciouEm,
  } = useProgresso()

  const [diaExpandido, setDiaExpandido] = useState(diaDesbloqueado)
  const [confirmaReinicio, setConfirmaReinicio] = useState(false)
  const [resumoDia, setResumoDia] = useState(null)
  const [diasResumoMostrados, setDiasResumoMostrados] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('cf_resumo_mostrado') ?? '[]') }
    catch { return [] }
  })

  const geral = progressoGeral()
  const { medalhas } = usePetalas()
  const location = useLocation()

  // Link "/progresso#premios" (selo de Pétalas da Início) rola até os prêmios
  useEffect(() => {
    if (location.hash === '#premios') {
      document.getElementById('premios')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  // FIX BUG 2: sincroniza diaExpandido quando diaDesbloqueado muda
  // (ex: modo de teste avança o dia — garante que nunca fique apontando para dia futuro)
  useEffect(() => {
    setDiaExpandido((prev) => Math.min(prev, diaDesbloqueado))
  }, [diaDesbloqueado])

  // FIX BUG 1: auto-mostra resumo só quando DIA FICA 100% COMPLETO pela primeira vez
  useEffect(() => {
    const prog = progressoDia(diaExpandido)
    const liberado = diaExpandido <= diaDesbloqueado
    const jaViu    = diasResumoMostrados.includes(diaExpandido)
    if (liberado && prog.feitas === prog.total && prog.total > 0 && !jaViu) {
      setResumoDia({ dia: diaExpandido, feitas: prog.feitas, total: prog.total })
    }
  }, [estado.concluidas, diaExpandido])

  function abrirResumoManual() {
    const prog = progressoDia(diaExpandido)
    setResumoDia({ dia: diaExpandido, feitas: prog.feitas, total: prog.total })
  }

  function fecharResumo() {
    const novosVistos = [...new Set([...diasResumoMostrados, resumoDia.dia])]
    setDiasResumoMostrados(novosVistos)
    sessionStorage.setItem('cf_resumo_mostrado', JSON.stringify(novosVistos))
    setResumoDia(null)
  }

  function handleReiniciar() {
    reiniciar()
    setDiaExpandido(1)
    setConfirmaReinicio(false)
    setResumoDia(null)
    setDiasResumoMostrados([])
    sessionStorage.removeItem('cf_resumo_mostrado')
  }

  function expandirDia(dia) {
    // FIX BUG 2: barreira extra — nunca deixa abrir dia futuro
    if (dia > diaDesbloqueado) return
    setDiaExpandido(dia)
  }

  const progExpandido = progressoDia(diaExpandido)
  const diaAtualExpandido = diaExpandido <= diaDesbloqueado

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">

      <ModeTeste iniciouEm={iniciouEm} onMudar={recarregar} onReiniciar={handleReiniciar} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-titulo text-2xl text-[#3D2B6B]">Meu Progresso</h1>
          <p className="text-[#7B6B9A] text-base mt-1">Ritual de {diasRitual.length} dias · {SEMANAS_RITUAL} semanas</p>
        </div>
        <button
          onClick={() => setConfirmaReinicio(true)}
          className="flex items-center gap-1 text-xs text-[#9B8BBB] bg-white border border-[#D8CCF0] px-3 py-2 rounded-xl shadow-sm"
        >
          <RotateCcw size={13} /> Reiniciar
        </button>
      </div>

      {/* Resumo geral */}
      <div className="bg-[#9B7AD6] rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Total do protocolo</p>
            <p className="font-titulo text-3xl font-bold mt-0.5">
              {geral.feitas}<span className="text-[#D4C0F0] text-xl font-normal"> / {geral.total}</span>
            </p>
            <p className="text-[#D4C0F0] text-sm">tarefas concluídas</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="white" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - geral.pct / 100)}`}
                strokeLinecap="round" className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">{Math.round(geral.pct)}%</span>
              <span className="text-white/60 text-[9px]">completo</span>
            </div>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${geral.pct}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#D4C0F0]">
          <span>🌟 {geral.diasCompletos} dia{geral.diasCompletos !== 1 ? 's' : ''} completo{geral.diasCompletos !== 1 ? 's' : ''}</span>
          <span>Você está no Dia {diaDesbloqueado}</span>
        </div>
      </div>

      {/* Grade: 3 semanas de 7 dias */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-[#9B8BBB] text-center">Toque em um dia desbloqueado para ver as tarefas</p>
        {Array.from({ length: SEMANAS_RITUAL }, (_, s) => (
          <div key={s}>
            <p className="text-xs font-semibold text-[#6B4EA8] mb-1.5">Semana {s + 1}</p>
            <div className="grid grid-cols-7 gap-1.5">
              {diasRitual.filter((d) => d.semana === s + 1).map(({ dia }) => {
                const bloqueado = dia > diaDesbloqueado
                return (
                  <CardDia
                    key={dia}
                    dia={dia}
                    prog={progressoDia(dia)}
                    ativo={dia === diaExpandido && !bloqueado}
                    bloqueado={bloqueado}
                    faltam={diasFaltando(dia, iniciouEm)}
                    onClick={() => expandirDia(dia)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {diaDesbloqueado < diasRitual.length && (
        <div className="flex items-center gap-2 justify-center">
          <Lock size={12} className="text-[#C9B3ED]" />
          <p className="text-xs text-[#9B8BBB]">Dias bloqueados desbloqueiam automaticamente a cada dia</p>
        </div>
      )}

      {/* Detalhe do dia selecionado */}
      {diasRitual.map(({ dia, tarefas }) => {
        if (dia !== diaExpandido) return null

        // Dia bloqueado
        if (dia > diaDesbloqueado) {
          const faltam = diasFaltando(dia, iniciouEm)
          return (
            <div key={dia} className="bg-white rounded-2xl shadow-sm border border-dashed border-[#C9B3ED] p-8 text-center">
              <Lock size={32} className="text-[#C9B3ED] mx-auto mb-3" />
              <p className="font-titulo text-lg text-[#3D2B6B] mb-1">Dia {dia} bloqueado</p>
              <p className="text-[#9B8BBB] text-sm">
                Disponível em <strong className="text-[#9B7AD6]">{faltam} dia{faltam !== 1 ? 's' : ''}</strong>
              </p>
              <p className="text-[#C9B3ED] text-xs mt-3">Continue com o Dia {diaDesbloqueado} enquanto isso 💜</p>
            </div>
          )
        }

        // Dia desbloqueado
        return (
          <div key={dia} className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] overflow-hidden">
            <div className="bg-[#9B7AD6] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-titulo text-white text-lg font-semibold">Semana {semanaDoDia(dia)} · Dia {dia}</h3>
                <span className="text-[#D4C0F0] text-sm font-semibold">
                  {progExpandido.feitas}/{progExpandido.total} tarefas
                </span>
              </div>
              <div className="flex gap-1">
                {tarefas.map((t) => (
                  <div key={t.id} title={t.label}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      estado.concluidas[t.id] ? 'bg-white' : 'bg-white/25'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#D4C0F0] text-xs mt-1">
                {progExpandido.pct === 100 ? '🌟 Dia completo!' : `${Math.round(progExpandido.pct)}% concluído`}
              </p>
            </div>

            {dia < diaDesbloqueado && (
              <p className="px-5 pt-3 text-xs text-[#9B8BBB]">
                Você pode marcar este dia, mas só as tarefas feitas no próprio dia rendem Pétalas 🌸
              </p>
            )}

            <ul>
              {tarefas.map((tarefa, i) => {
                const feita = estado.concluidas[tarefa.id] ?? false
                return (
                  <li key={tarefa.id}>
                    <button
                      onClick={() => marcarTarefa(tarefa.id, !feita)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:bg-[#F5F0FF] ${i > 0 ? 'border-t border-[#EDE7F9]' : ''}`}
                    >
                      {feita
                        ? <CheckCircle2 size={24} className="text-[#9B7AD6] shrink-0" />
                        : <Circle size={24} className="text-[#C4B8E0] shrink-0" />}
                      <span className="text-xl shrink-0">{tarefa.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-base font-semibold ${feita ? 'text-[#7B6B9A] line-through' : 'text-[#3D2B6B]'}`}>
                          {tarefa.label}
                        </p>
                        <p className="text-xs text-[#9B8BBB]">{tarefa.horario}</p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* FIX BUG 1: botão "Encerrar o dia" sempre visível no dia atual */}
            <div className="px-5 py-4 border-t border-[#EDE7F9]">
              {progExpandido.feitas === progExpandido.total ? (
                <div className="bg-[#E8E0F8] rounded-2xl py-3 text-center">
                  <p className="text-[#6B4EA8] font-semibold">🌟 Dia {dia} completo! Você arrasou!</p>
                </div>
              ) : (
                <button
                  onClick={abrirResumoManual}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#9B7AD6] text-[#9B7AD6] font-semibold text-base active:bg-[#EDE7F9] transition-colors"
                >
                  <Flag size={18} />
                  Encerrar o dia de hoje
                </button>
              )}
            </div>
          </div>
        )
      })}

      {/* Navegação entre dias — FIX BUG 2: seta → só aparece se há dia anterior desbloqueado */}
      <div className="flex gap-2">
        {diaExpandido > 1 && (
          <button
            onClick={() => setDiaExpandido((d) => d - 1)}
            className="flex-1 py-3 bg-white border border-[#D8CCF0] rounded-xl text-[#7B6B9A] font-semibold"
          >
            ← Dia {diaExpandido - 1}
          </button>
        )}
        {diaExpandido < diaDesbloqueado && (
          <button
            onClick={() => setDiaExpandido((d) => d + 1)}
            className="flex-1 py-3 bg-[#9B7AD6] text-white rounded-xl font-semibold"
          >
            Dia {diaExpandido + 1} →
          </button>
        )}
      </div>

      {/* Medalhas e prêmios */}
      <SecaoMedalhas medalhas={medalhas} />
      <SecaoPremios />

      {/* Modal confirma reinício */}
      {confirmaReinicio && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-titulo text-lg text-[#3D2B6B] mb-2">Reiniciar o ritual?</h3>
            <p className="text-[#7B6B9A] text-sm mb-5">
              Todo o seu progresso e a data de início serão apagados. Você voltará ao Dia 1.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmaReinicio(false)} className="flex-1 py-3 rounded-xl border border-[#D8CCF0] text-[#7B6B9A] font-semibold">
                Cancelar
              </button>
              <button onClick={handleReiniciar} className="flex-1 py-3 rounded-xl bg-[#9B7AD6] text-white font-semibold">
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de resumo do dia */}
      {resumoDia && (
        <MensagemDia
          dia={resumoDia.dia}
          feitas={resumoDia.feitas}
          total={resumoDia.total}
          onFechar={fecharResumo}
        />
      )}
    </div>
  )
}
