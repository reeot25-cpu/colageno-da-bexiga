import { useState } from 'react'
import { CheckCircle2, Circle, Star, RotateCcw } from 'lucide-react'
import { diasRitual } from '../data/ritual'
import { useProgresso } from '../hooks/useProgresso'

export default function Progresso() {
  const { estado, marcarTarefa, progressoDia, reiniciar, diaAtivo } = useProgresso()
  const [diaExpandido, setDiaExpandido] = useState(diaAtivo)
  const [confirmaReinicio, setConfirmaReinicio] = useState(false)

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

      {/* Visão geral dos 7 dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {diasRitual.map(({ dia }) => {
          const prog = progressoDia(dia)
          const completo = prog.feitas === prog.total && prog.total > 0
          const ativo = dia === diaExpandido
          return (
            <button
              key={dia}
              onClick={() => setDiaExpandido(dia)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                ativo ? 'bg-[#9B7AD6] text-white shadow-md' : completo ? 'bg-[#E8E0F8]' : 'bg-white border border-[#D8CCF0]'
              }`}
            >
              {completo ? (
                <Star size={16} fill="#9B7AD6" className={ativo ? 'text-white' : 'text-[#6B4EA8]'} />
              ) : (
                <span className={`text-xs font-bold ${ativo ? 'text-white' : 'text-[#7B6B9A]'}`}>D{dia}</span>
              )}
              <span className={`text-[10px] ${ativo ? 'text-[#D4C0F0]' : 'text-[#9B8BBB]'}`}>
                {prog.feitas}/{prog.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detalhe do dia selecionado */}
      {diasRitual.map(({ dia, tarefas }) =>
        dia !== diaExpandido ? null : (
          <div key={dia} className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] overflow-hidden">
            <div className="bg-[#9B7AD6] px-5 py-4 flex items-center justify-between">
              <h3 className="font-titulo text-white text-lg font-semibold">Dia {dia}</h3>
              {(() => {
                const p = progressoDia(dia)
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4C0F0] text-sm">{p.feitas}/{p.total}</span>
                    <div className="w-24 bg-[#7B5AB8] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>

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

            {(() => {
              const p = progressoDia(dia)
              return p.feitas === p.total ? (
                <div className="bg-[#E8E0F8] px-5 py-3 text-center">
                  <p className="text-[#6B4EA8] font-semibold">🌟 Dia {dia} completo! Você arrasou!</p>
                </div>
              ) : null
            })()}
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
