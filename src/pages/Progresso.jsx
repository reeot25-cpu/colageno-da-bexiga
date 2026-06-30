import { useState } from 'react'
import { CheckCircle2, Circle, Star, RotateCcw } from 'lucide-react'
import { diasRitual } from '../data/ritual'
import { useProgresso } from '../hooks/useProgresso'

export default function Progresso() {
  const { estado, marcarTarefa, progressoDia, progressoGeral, reiniciar, diaAtivo } = useProgresso()
  const [diaExpandido, setDiaExpandido] = useState(diaAtivo)
  const [confirmaReinicio, setConfirmaReinicio] = useState(false)
  const geral = progressoGeral()

  function handleReiniciar() {
    reiniciar()
    setDiaExpandido(1)
    setConfirmaReinicio(false)
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-titulo text-2xl text-[#3D2B6B]">Meu Progresso</h1>
          <p className="text-[#7B6B9A] text-base mt-1">Ritual de 7 dias</p>
        </div>
        <button
          onClick={() => setConfirmaReinicio(true)}
          className="flex items-center gap-1 text-xs text-[#9B8BBB] bg-white border border-[#D8CCF0] px-3 py-2 rounded-xl shadow-sm"
        >
          <RotateCcw size={13} />
          Reiniciar
        </button>
      </div>

      {/* RESUMO GERAL */}
      <div className="bg-[#9B7AD6] rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Total do protocolo</p>
            <p className="font-titulo text-3xl font-bold mt-0.5">
              {geral.feitas}
              <span className="text-[#D4C0F0] text-xl font-normal"> / {geral.total}</span>
            </p>
            <p className="text-[#D4C0F0] text-sm">tarefas concluídas</p>
          </div>
          {/* Círculo percentual grande */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle
                cx="30" cy="30" r="25" fill="none"
                stroke="white" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - geral.pct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">{Math.round(geral.pct)}%</span>
              <span className="text-white/60 text-[9px]">completo</span>
            </div>
          </div>
        </div>

        {/* Barra geral */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-700"
            style={{ width: `${geral.pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#D4C0F0]">
          <span>🌟 {geral.diasCompletos} dia{geral.diasCompletos !== 1 ? 's' : ''} completo{geral.diasCompletos !== 1 ? 's' : ''}</span>
          <span>Faltam {geral.total - geral.feitas} tarefas</span>
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmaReinicio && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-titulo text-lg text-[#3D2B6B] mb-2">Reiniciar o ritual?</h3>
            <p className="text-[#7B6B9A] text-sm mb-5">
              Todo o seu progresso atual será apagado. Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmaReinicio(false)}
                className="flex-1 py-3 rounded-xl border border-[#D8CCF0] text-[#7B6B9A] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleReiniciar}
                className="flex-1 py-3 rounded-xl bg-[#9B7AD6] text-white font-semibold"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade dos 7 dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {diasRitual.map(({ dia }) => {
          const p = progressoDia(dia)
          const completo = p.feitas === p.total && p.total > 0
          const ativo = dia === diaExpandido
          return (
            <button
              key={dia}
              onClick={() => setDiaExpandido(dia)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                ativo
                  ? 'bg-[#9B7AD6] text-white shadow-md'
                  : completo
                  ? 'bg-[#E8E0F8]'
                  : 'bg-white border border-[#D8CCF0]'
              }`}
            >
              {completo ? (
                <Star size={16} fill={ativo ? 'white' : '#9B7AD6'} className={ativo ? 'text-white' : 'text-[#9B7AD6]'} />
              ) : (
                <span className={`text-xs font-bold ${ativo ? 'text-white' : 'text-[#7B6B9A]'}`}>D{dia}</span>
              )}
              <span className={`text-[10px] ${ativo ? 'text-[#D4C0F0]' : 'text-[#9B8BBB]'}`}>
                {p.feitas}/{p.total}
              </span>
              {/* Mini barra por dia */}
              <div className="w-full px-1">
                <div className={`h-1 rounded-full w-full ${ativo ? 'bg-white/30' : 'bg-[#E8E0F8]'}`}>
                  <div
                    className={`h-full rounded-full transition-all ${ativo ? 'bg-white' : 'bg-[#9B7AD6]'}`}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detalhe do dia selecionado */}
      {diasRitual.map(({ dia, tarefas }) =>
        dia !== diaExpandido ? null : (
          <div key={dia} className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] overflow-hidden">
            {/* Header com barra de progresso */}
            <div className="bg-[#9B7AD6] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-titulo text-white text-lg font-semibold">Dia {dia}</h3>
                <span className="text-[#D4C0F0] text-sm font-semibold">
                  {progressoDia(dia).feitas}/{progressoDia(dia).total} tarefas
                </span>
              </div>
              {/* Barra segmentada por tarefa */}
              <div className="flex gap-1">
                {tarefas.map((t) => (
                  <div
                    key={t.id}
                    title={t.label}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      estado.concluidas[t.id] ? 'bg-white' : 'bg-white/25'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#D4C0F0] text-xs mt-1">
                {progressoDia(dia).pct === 100
                  ? '🌟 Dia completo!'
                  : `${Math.round(progressoDia(dia).pct)}% concluído`}
              </p>
            </div>

            {/* Lista de tarefas */}
            <ul>
              {tarefas.map((tarefa, i) => {
                const feita = estado.concluidas[tarefa.id] ?? false
                return (
                  <li key={tarefa.id}>
                    <button
                      onClick={() => marcarTarefa(tarefa.id, !feita)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:bg-[#F5F0FF] ${
                        i > 0 ? 'border-t border-[#EDE7F9]' : ''
                      }`}
                    >
                      {feita ? (
                        <CheckCircle2 size={24} className="text-[#9B7AD6] shrink-0" />
                      ) : (
                        <Circle size={24} className="text-[#C4B8E0] shrink-0" />
                      )}
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

            {progressoDia(dia).feitas === progressoDia(dia).total && (
              <div className="bg-[#E8E0F8] px-5 py-3 text-center">
                <p className="text-[#6B4EA8] font-semibold">🌟 Dia {dia} completo! Você arrasou!</p>
              </div>
            )}
          </div>
        )
      )}

      {/* Navegação entre dias */}
      <div className="flex gap-2">
        {diaExpandido > 1 && (
          <button
            onClick={() => setDiaExpandido((d) => d - 1)}
            className="flex-1 py-3 bg-white border border-[#D8CCF0] rounded-xl text-[#7B6B9A] font-semibold"
          >
            ← Dia {diaExpandido - 1}
          </button>
        )}
        {diaExpandido < 7 && (
          <button
            onClick={() => setDiaExpandido((d) => d + 1)}
            className="flex-1 py-3 bg-[#9B7AD6] text-white rounded-xl font-semibold"
          >
            Dia {diaExpandido + 1} →
          </button>
        )}
      </div>
    </div>
  )
}
