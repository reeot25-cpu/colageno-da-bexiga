import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Aviso() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]">
          <ArrowLeft size={20} className="text-[#3D2B6B]" />
        </button>
        <h1 className="font-titulo text-xl text-[#3D2B6B]">Aviso Importante</h1>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8CCF0] flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#9B7AD6]">
          <ShieldCheck size={24} />
          <h2 className="font-titulo text-lg font-semibold">Caráter educativo</h2>
        </div>
        <p className="text-[#3D2B6B] text-base leading-relaxed">
          Este aplicativo tem caráter <strong>educativo e de bem-estar</strong>. Não substitui acompanhamento médico e{' '}
          <strong>não trata nem cura doenças</strong>.
        </p>
        <p className="text-[#3D2B6B] text-base leading-relaxed">
          Consulte um profissional de saúde antes de iniciar qualquer protocolo.
        </p>
        <p className="text-[#3D2B6B] text-base leading-relaxed">
          <strong>Gestantes, lactantes e pessoas com condições de saúde ou em uso de medicação</strong> devem
          obrigatoriamente consultar o médico antes de seguir o protocolo.
        </p>
        <p className="text-[#7B6B9A] text-sm leading-relaxed border-t border-[#EDE7F9] pt-3">
          Os conteúdos apresentados são baseados em tradições de bem-estar e não constituem prescrição médica ou
          nutricional. Resultados individuais podem variar.
        </p>
      </div>
    </div>
  )
}
