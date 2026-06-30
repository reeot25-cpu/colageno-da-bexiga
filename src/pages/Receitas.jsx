import { useState } from 'react'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { receitas, oQueEvitar } from '../data/receitas'
import VideoPlayer from '../components/VideoPlayer'
import { useProgresso } from '../hooks/useProgresso'

const tarefaIdMap = {
  'caldo-pro-colageno': 'd1_caldo',
  'vitamina-firmeza':   'd1_vitamina',
  'prato-base':         'd1_prato_base',
  'gelatina-noite':     null,
}

function CardReceita({ receita, onClick }) {
  return (
    <button
      onClick={() => onClick(receita)}
      className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] flex items-center gap-4 active:scale-[0.98] transition-transform"
    >
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#E8E0F8]">
        {receita.emoji}
      </div>
      <div className="flex-1">
        <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold">{receita.nome}</h3>
        <p className="text-[#7B6B9A] text-sm mt-0.5">{receita.resumo}</p>
        <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE7F9] text-[#6B4EA8]">
          {receita.horario}
        </span>
      </div>
      <span className="text-[#B8A0E0] text-xl">›</span>
    </button>
  )
}

function DetalheReceita({ receita, onVoltar }) {
  const { estado, marcarTarefa } = useProgresso()
  const tarefaId = tarefaIdMap[receita.id]
  const feito = tarefaId ? (estado.concluidas[tarefaId] ?? false) : false

  return (
    <div className="flex flex-col gap-5 pb-32">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={onVoltar} className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]">
          <ArrowLeft size={20} className="text-[#3D2B6B]" />
        </button>
        <h2 className="font-titulo text-xl text-[#3D2B6B] font-semibold">{receita.nome}</h2>
      </div>

      <div className="px-4 flex flex-col gap-4">
        <VideoPlayer url={receita.videoUrl} titulo={receita.nome} />

        <div className="rounded-xl px-4 py-2 inline-flex items-center gap-2 bg-[#EDE7F9]">
          <span className="text-xl">{receita.emoji}</span>
          <span className="font-semibold text-sm text-[#6B4EA8]">{receita.horario}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
          <h3 className="font-titulo text-lg text-[#3D2B6B] mb-3">Ingredientes</h3>
          <ul className="flex flex-col gap-2">
            {receita.ingredientes.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-[#3D2B6B] text-base">
                <span className="text-[#9B7AD6] mt-0.5">🍃</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
          <h3 className="font-titulo text-lg text-[#3D2B6B] mb-3">Como fazer</h3>
          <ol className="flex flex-col gap-3">
            {receita.preparo.map((passo, i) => (
              <li key={i} className="flex items-start gap-3 text-[#3D2B6B] text-base">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#9B7AD6] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {passo}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#E8E0F8] rounded-2xl p-4">
          <p className="text-[#4A3B7E] text-base leading-relaxed">🌱 {receita.beneficio}</p>
        </div>

        {tarefaId && (
          <button
            onClick={() => marcarTarefa(tarefaId, !feito)}
            className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
              feito ? 'bg-[#9B7AD6] text-white opacity-80' : 'bg-[#9B7AD6] text-white active:bg-[#6B4EA8]'
            }`}
          >
            <CheckCircle2 size={20} />
            {feito ? 'Feito hoje! ✓' : 'Marcar como feito hoje'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Receitas() {
  const [aberta, setAberta] = useState(null)

  if (aberta) {
    return <DetalheReceita receita={aberta} onVoltar={() => setAberta(null)} />
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B]">Receitas</h1>
        <p className="text-[#7B6B9A] text-base mt-1">Alimentos que apoiam a saúde dos seus tecidos</p>
      </div>

      <div className="flex flex-col gap-3">
        {receitas.map((r) => (
          <CardReceita key={r.id} receita={r} onClick={setAberta} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
        <h3 className="font-titulo text-lg text-[#3D2B6B] mb-3 flex items-center gap-2">
          <XCircle size={20} className="text-[#9B7AD6]" />
          O que evitar
        </h3>
        <ul className="flex flex-col gap-3">
          {oQueEvitar.map((item, i) => (
            <li key={i} className="flex flex-col gap-0.5">
              <span className="font-semibold text-[#3D2B6B] text-base">❌ {item.item}</span>
              <span className="text-[#7B6B9A] text-sm pl-5">{item.motivo}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
