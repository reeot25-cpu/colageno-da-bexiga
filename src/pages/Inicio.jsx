import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Settings, ShoppingBag, Flame, Trophy } from 'lucide-react'
import IconAssoalhoPelvico from '../components/IconAssoalhoPelvico'
import { useProgresso } from '../hooks/useProgresso'
import { useMensagemBoasVindas } from '../hooks/useMensagemBoasVindas'
import { useNome } from '../hooks/useNome'
import { useAcesso } from '../hooks/useAcesso'
import { useHistoricoExercicios } from '../hooks/useHistoricoExercicios'
import { saudacaoHorario, primeiroNome } from '../utils/saudacao'
import AvisoFimAcesso from '../components/AvisoFimAcesso'
import { diasRitual, semanaDoDia, DIAS_POR_SEMANA } from '../data/ritual'
import { usePetalas } from '../hooks/usePetalas'
import SaldoPetalas from '../components/SaldoPetalas'
import CardEvolucao from '../components/CardEvolucao'
import CardRecompensa from '../components/CardRecompensa'
import CardDonaDesconto from '../components/CardDonaDesconto'

const atalhos = [
  { to: '/chas',       label: 'Chás',       emoji: '🍵', bg: '#E8E0F8', cor: '#6B4EA8' },
  { to: '/receitas',   label: 'Receitas',   emoji: '🥗', bg: '#EAE0FA', cor: '#7B5AA8' },
  { to: '/exercicios', label: 'Exercícios', emoji: null,  Icone: IconAssoalhoPelvico, bg: '#EDE0F8', cor: '#6B4EA8' },
]

function CardBoasVindas({ mensagem }) {
  return (
    <Link to={mensagem.destino} className="block">
      <div
        className="rounded-2xl p-5 shadow-md flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${mensagem.bgDe}, ${mensagem.bgAte})`,
        }}
      >
        <span className="text-4xl shrink-0 leading-none">{mensagem.emoji}</span>
        <div className="flex-1">
          <p className="text-white font-semibold text-base leading-snug">{mensagem.texto}</p>
          <p className="text-white/70 text-sm mt-1">
            {mensagem.tipo === 'exercicios' ? 'Ir para exercícios →' : 'Abrir diário →'}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function Inicio() {
  const { diaAtivo, progressoDia, progressoGeral, estado } = useProgresso()
  const mensagem = useMensagemBoasVindas()
  const { nome } = useNome()
  const primeiro = primeiroNome(nome)
  const acesso = useAcesso()
  const { stats, treinoHoje } = useHistoricoExercicios()
  const prog  = progressoDia(diaAtivo)
  const geral = progressoGeral()

  const tarefasHoje  = diasRitual[diaAtivo - 1]?.tarefas ?? []
  const proximaTarefa = tarefasHoje.find((t) => !estado.concluidas[t.id])
  const pctRitual = Math.round((geral.diasCompletos / diasRitual.length) * 100)
  const semana = semanaDoDia(diaAtivo)
  const inicioSemana = (semana - 1) * DIAS_POR_SEMANA
  const { saldo, ganhos } = usePetalas()

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <span className="font-titulo text-[#6B4EA8] text-2xl font-bold tracking-tight">CollagenFlow</span>
        <Link to="/configuracoes" className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]">
          <Settings size={20} className="text-[#9B7AD6]" />
        </Link>
      </div>

      {/* Saudação */}
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B] leading-tight">
          {primeiro ? (
            <>{saudacaoHorario()}, {primeiro}!<br />Que bom te ver por aqui 💜</>
          ) : (
            <>Olá! Que bom<br />te ver por aqui 💜</>
          )}
        </h1>
        {/* Contagem regressiva discreta do período de acesso */}
        <span className="inline-block mt-2 text-xs font-semibold text-[#9B7AD6] bg-[#EDE7F9] border border-[#D8CCF0] rounded-full px-3 py-1">
          Você está no Dia {acesso.diaAtual} de {acesso.total} 💜
        </span>
        <SaldoPetalas saldo={saldo} />
      </div>

      {/* Aviso gentil nos últimos dias (18, 19, 20 e 21) — escondido no modo dona */}
      {!acesso.dona && acesso.faltam <= 3 && <AvisoFimAcesso faltam={acesso.faltam} />}

      {/* Card de boas-vindas dinâmico */}
      <CardBoasVindas mensagem={mensagem} />

      {/* Card de streak de exercícios */}
      {(stats.totalTreinos > 0 || treinoHoje.length > 0) && (
        <Link to="/exercicios" className="block">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0] flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              stats.streak > 0
                ? 'bg-gradient-to-br from-[#FF8C42] to-[#F5C842]'
                : 'bg-[#EDE7F9]'
            }`}>
              {stats.streak > 0
                ? <Flame size={24} className="text-white" />
                : <Trophy size={24} className="text-[#9B7AD6]" />
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#3D2B6B] text-base">
                  {stats.streak > 0
                    ? `${stats.streak} dia${stats.streak > 1 ? 's' : ''} seguido${stats.streak > 1 ? 's' : ''} 🔥`
                    : `${stats.totalTreinos} treino${stats.totalTreinos > 1 ? 's' : ''} feito${stats.totalTreinos > 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <p className="text-[#7B6B9A] text-sm">
                {treinoHoje.length > 0
                  ? `Hoje: ${treinoHoje.length} treino${treinoHoje.length > 1 ? 's' : ''} concluído${treinoHoje.length > 1 ? 's' : ''} ✓`
                  : 'Faça seu treino de hoje →'
                }
              </p>
            </div>
            <ChevronRight size={18} className="text-[#9B7AD6] shrink-0" />
          </div>
        </Link>
      )}

      {/* Card Ritual — 3 semanas de 7 dias */}
      <Link to="/progresso" className="block">
        <div className="bg-[#9B7AD6] rounded-2xl p-5 shadow-md text-white">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Seu Ritual</p>
              <h2 className="font-titulo text-2xl font-bold">Semana {semana} · Dia {diaAtivo}</h2>
            </div>
            {/* Círculo de percentual */}
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="white" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  strokeDashoffset={`${2 * Math.PI * 15 * (1 - pctRitual / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{pctRitual}%</span>
              </div>
            </div>
          </div>

          {/* Barra dos 7 dias da semana atual */}
          <div className="flex gap-1 mb-2 mt-3">
            {Array.from({ length: DIAS_POR_SEMANA }, (_, i) => {
              const d = inicioSemana + i + 1
              const p = progressoDia(d)
              const completo = p.feitas === p.total && p.total > 0
              const atual    = d === diaAtivo
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      completo ? 'bg-white' : atual ? 'bg-white/50' : 'bg-white/20'
                    }`}
                  />
                  <span className="text-[9px] text-white/60">{d}</span>
                </div>
              )
            })}
          </div>

          <p className="text-[#D4C0F0] text-sm mt-1">
            {geral.diasCompletos} de {diasRitual.length} dias completos · {geral.feitas}/{geral.total} tarefas →
          </p>
        </div>
      </Link>

      {/* Tarefa de hoje */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#B8A0E0]" />
            <p className="font-semibold text-[#3D2B6B] text-base">Hoje</p>
          </div>
          <span className="text-sm font-bold text-[#9B7AD6]">
            {prog.feitas}/{prog.total} tarefas
          </span>
        </div>

        {proximaTarefa ? (
          <Link to="/progresso" className="flex items-center gap-3 bg-[#F5F0FF] rounded-xl p-3 mb-3">
            <span className="text-2xl">{proximaTarefa.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-[#3D2B6B]">{proximaTarefa.label}</p>
              <p className="text-[#7B6B9A] text-sm">{proximaTarefa.horario}</p>
            </div>
            <ChevronRight size={18} className="text-[#9B7AD6]" />
          </Link>
        ) : (
          <div className="bg-[#E8E0F8] rounded-xl p-3 text-center mb-3">
            <p className="text-[#6B4EA8] font-semibold">🎉 Dia {diaAtivo} completo!</p>
          </div>
        )}

        {/* Barra do dia com segmentos por tarefa */}
        <div className="flex gap-1">
          {tarefasHoje.map((t) => (
            <div
              key={t.id}
              title={t.label}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                estado.concluidas[t.id] ? 'bg-[#9B7AD6]' : 'bg-[#E8E0F8]'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#7B6B9A] mt-1 text-right">
          {prog.feitas === prog.total && prog.total > 0
            ? '✓ Tudo feito hoje!'
            : `Faltam ${prog.total - prog.feitas} tarefas`}
        </p>
      </div>

      {/* Recompensa do dia 21 (sem mencionar assinatura/desconto antes do fim) */}
      <CardRecompensa ganhas={ganhos.total} />
      {acesso.dona && <CardDonaDesconto ganhas={ganhos.total} />}

      {/* Evolução registrada no Diário */}
      <CardEvolucao />

      {/* Atalhos */}
      <div className="grid grid-cols-3 gap-3">
        {atalhos.map(({ to, label, emoji, Icone, bg, cor }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl shadow-sm"
            style={{ backgroundColor: bg }}
          >
            {Icone
              ? <Icone size={34} strokeWidth={1.6} style={{ color: cor }} />
              : <span className="text-3xl">{emoji}</span>
            }
            <span className="text-sm font-semibold" style={{ color: cor }}>{label}</span>
          </Link>
        ))}
      </div>

      {/* Card Produtos */}
      <Link to="/produtos" className="block">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EDE7F9] flex items-center justify-center shrink-0">
            <ShoppingBag size={24} className="text-[#9B7AD6]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#3D2B6B] text-base">Produtos recomendados</p>
            <p className="text-[#7B6B9A] text-sm">Acessórios e suplementos para o seu ritual</p>
          </div>
          <ChevronRight size={18} className="text-[#9B7AD6] shrink-0" />
        </div>
      </Link>

      <Link to="/aviso" className="text-center text-xs text-[#9B8BBB] underline underline-offset-2 pb-2">
        Aviso importante
      </Link>
    </div>
  )
}
