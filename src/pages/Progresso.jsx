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
          <h1 className="font-titulo text-2xl text-[#5C4A3D]">Meu Progresso</h1>
          <p className="text-[#9C8A7A] text-base mt-1">Ritual de 7 dias</p>
        </div>
        <button
          onClick={() => setConfirmaReinicio(true)}
          className="flex items-center gap-1 text-xs text-[#B0A090] bg-white border border-[#EDE5D8] px-3 py-2 rounded-xl shadow-sm"
        >
          <RotateCcw size={13} />
          Reiniciar
        </button>
      </div>

      {/* Modal de confirmação */}
      {confirmaReinicio && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-titulo text-lg text-[#5C4A3D] mb-2">Reiniciar o ritual?</h3>
            <p className="text-[#9C8A7A] text-sm mb-5">
              Todo o seu progresso atual será apagado. Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmaReinicio(false)}
                className="flex-1 py-3 rounded-xl border border-[#EDE5D8] text-[#9C8A7A] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleReiniciar}
                className="flex-1 py-3 rounded-xl bg-[#C66B5A] text-white font-semibold"
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
                ativo ? 'bg-[#C66B5A] text-white shadow-md' : completo ? 'bg-[#E8F0E4]' : 'bg-white border border-[#EDE5D8]'
              }`}
            >
              {completo ? (
                <Star size={16} fill="#9CAF88" className={ativo ? 'text-white' : 'text-[#6B8F5E]'} />
              ) : (
                <span className={`text-xs font-bold ${ativo ? 'text-white' : 'text-[#9C8A7A]'}`}>D{dia}</span>
              )}
              <span className={`text-[10px] ${ativo ? 'text-[#F5D5CE]' : 'text-[#B0A090]'}`}>
                {prog.feitas}/{prog.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detalhe do dia selecionado */}
      {diasRitual.map(({ dia, tarefas }) =>
        dia !== diaExpandido ? null : (
          <div key={dia} className="bg-white rounded-2xl shadow-sm border border-[#EDE5D8] overflow-hidden">
            {/* Header do dia */}
            <div className="bg-[#C66B5A] px-5 py-4 flex items-center justify-between">
              <h3 className="font-titulo text-white text-lg font-semibold">Dia {dia}</h3>
              {(() => {
                const p = progressoDia(dia)
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-[#F5D5CE] text-sm">{p.feitas}/{p.total}</span>
                    <div className="w-24 bg-[#A85748] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Lista de tarefas */}
            <ul>
              {tarefas.map((tarefa, i) => {
                const feita = estado.concluidas[tarefa.id] ?? false
                return (
                  <li key={tarefa.id}>
                    <button
                      onClick={() => marcarTarefa(tarefa.id, !feita)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:bg-[#FBF7F2] ${
                        i > 0 ? 'border-t border-[#F0E8E0]' : ''
                      }`}
                    >
                      {feita ? (
                        <CheckCircle2 size={24} className="text-[#9CAF88] shrink-0" />
                      ) : (
                        <Circle size={24} className="text-[#D4C8B8] shrink-0" />
                      )}
                      <span className="text-xl shrink-0">{tarefa.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-base font-semibold ${feita ? 'text-[#9C8A7A] line-through' : 'text-[#5C4A3D]'}`}>
                          {tarefa.label}
                        </p>
                        <p className="text-xs text-[#B0A090]">{tarefa.horario}</p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Dia completo */}
            {(() => {
              const p = progressoDia(dia)
              return p.feitas === p.total ? (
                <div className="bg-[#E8F0E4] px-5 py-3 text-center">
                  <p className="text-[#4A6B3E] font-semibold">🌟 Dia {dia} completo! Você arrasou!</p>
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
            className="flex-1 py-3 bg-white border border-[#EDE5D8] rounded-xl text-[#9C8A7A] font-semibold"
          >
            ← Dia {diaExpandido - 1}
          </button>
        )}
        {diaExpandido < 7 && (
          <button
            onClick={() => setDiaExpandido((d) => d + 1)}
            className="flex-1 py-3 bg-[#C66B5A] text-white rounded-xl font-semibold"
          >
            Dia {diaExpandido + 1} →
          </button>
        )}
      </div>
    </div>
  )
}
