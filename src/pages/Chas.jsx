import { useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { chas } from '../data/chas'
import VideoPlayer from '../components/VideoPlayer'
import { useProgresso } from '../hooks/useProgresso'

function CardCha({ cha, onClick }) {
  return (
    <button
      onClick={() => onClick(cha)}
      className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-[#EDE5D8] flex items-center gap-4 active:scale-[0.98] transition-transform"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
        style={{ backgroundColor: cha.cor + '22' }}
      >
        {cha.emoji}
      </div>
      <div className="flex-1">
        <h3 className="font-titulo text-lg text-[#5C4A3D] font-semibold">{cha.nome}</h3>
        <p className="text-[#9C8A7A] text-sm mt-0.5">{cha.resumo}</p>
        <span
          className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: cha.cor + '22', color: cha.cor }}
        >
          {cha.horario}
        </span>
      </div>
      <span className="text-[#D4AF7A] text-xl">›</span>
    </button>
  )
}

function DetalheCha({ cha, onVoltar }) {
  const { estado, marcarTarefa } = useProgresso()
  // Encontra a tarefa correspondente do dia atual
  const tarefaId = `d1_cha_${cha.id === 'firmeza' ? 'firmeza' : cha.id === 'calmaria' ? 'calmaria' : 'anti'}`
  const feito = estado.concluidas[tarefaId] ?? false

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={onVoltar} className="p-2 rounded-full bg-white shadow-sm border border-[#EDE5D8]">
          <ArrowLeft size={20} className="text-[#5C4A3D]" />
        </button>
        <h2 className="font-titulo text-xl text-[#5C4A3D] font-semibold">{cha.nome}</h2>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Video */}
        <VideoPlayer url={cha.videoUrl} titulo={cha.nome} />

        {/* Horário */}
        <div
          className="rounded-xl px-4 py-2 inline-flex items-center gap-2"
          style={{ backgroundColor: cha.cor + '22' }}
        >
          <span className="text-xl">{cha.emoji}</span>
          <span className="font-semibold text-sm" style={{ color: cha.cor }}>
            Quando tomar: {cha.horario}
          </span>
        </div>

        {/* Ingredientes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EDE5D8]">
          <h3 className="font-titulo text-lg text-[#5C4A3D] mb-3">Ingredientes</h3>
          <ul className="flex flex-col gap-2">
            {cha.ingredientes.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-[#5C4A3D] text-base">
                <span className="text-[#9CAF88] mt-0.5">🌿</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Preparo */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EDE5D8]">
          <h3 className="font-titulo text-lg text-[#5C4A3D] mb-3">Modo de preparo</h3>
          <ol className="flex flex-col gap-3">
            {cha.preparo.map((passo, i) => (
              <li key={i} className="flex items-start gap-3 text-[#5C4A3D] text-base">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#C66B5A] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {passo}
              </li>
            ))}
          </ol>
        </div>

        {/* Benefício */}
        <div className="bg-[#E8F0E4] rounded-2xl p-4">
          <p className="text-[#4A6B3E] text-base leading-relaxed">🌱 {cha.beneficio}</p>
        </div>

        {/* Aviso */}
        {cha.aviso && (
          <div className="bg-[#FFF5E4] rounded-2xl p-4 flex gap-3 border border-[#D4AF7A]">
            <AlertCircle size={20} className="text-[#C68A30] shrink-0 mt-0.5" />
            <p className="text-[#7A5A20] text-sm leading-relaxed">{cha.aviso}</p>
          </div>
        )}

        {/* Botão marcar */}
        <button
          onClick={() => marcarTarefa(tarefaId, !feito)}
          className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
            feito
              ? 'bg-[#9CAF88] text-white'
              : 'bg-[#C66B5A] text-white active:bg-[#A85748]'
          }`}
        >
          <CheckCircle2 size={20} />
          {feito ? 'Feito hoje! ✓' : 'Marcar como feito hoje'}
        </button>
      </div>
    </div>
  )
}

export default function Chas() {
  const [chaAberto, setChaAberto] = useState(null)

  if (chaAberto) {
    return <DetalheCha cha={chaAberto} onVoltar={() => setChaAberto(null)} />
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      <div>
        <h1 className="font-titulo text-2xl text-[#5C4A3D]">Chás</h1>
        <p className="text-[#9C8A7A] text-base mt-1">Três chás simples para o seu ritual diário</p>
      </div>
      <div className="flex flex-col gap-3">
        {chas.map((cha) => (
          <CardCha key={cha.id} cha={cha} onClick={setChaAberto} />
        ))}
      </div>
    </div>
  )
}
