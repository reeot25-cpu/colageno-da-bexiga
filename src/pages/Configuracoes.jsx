import { ArrowLeft, Volume2, VolumeX, Info, Shield } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { tocarTrocaEtapa } from '../utils/som'

function Toggle({ ativo, onChange, label, descricao, iconeAtivo, iconeDesativo }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${ativo ? 'bg-[#EDE7F9]' : 'bg-[#F0EEF8]'}`}>
          {ativo ? iconeAtivo : iconeDesativo}
        </div>
        <div>
          <p className="font-semibold text-[#3D2B6B] text-base">{label}</p>
          <p className="text-[#7B6B9A] text-sm mt-0.5">{descricao}</p>
        </div>
      </div>
      {/* Toggle switch */}
      <button
        onClick={() => onChange(!ativo)}
        className={`relative shrink-0 w-14 h-7 rounded-full transition-colors duration-300 ${
          ativo ? 'bg-[#9B7AD6]' : 'bg-[#D8CCF0]'
        }`}
        aria-label={ativo ? 'Desativar ' + label : 'Ativar ' + label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
            ativo ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default function Configuracoes() {
  const navigate = useNavigate()
  const { config, alterarSom } = useConfiguracoes()

  function handleSomChange(valor) {
    alterarSom(valor)
    if (valor) tocarTrocaEtapa() // prévia do som ao ativar
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]"
        >
          <ArrowLeft size={20} className="text-[#3D2B6B]" />
        </button>
        <h1 className="font-titulo text-2xl text-[#3D2B6B]">Configurações</h1>
      </div>

      {/* Som */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] px-5 divide-y divide-[#EDE7F9]">
        <Toggle
          ativo={config.somAtivo}
          onChange={handleSomChange}
          label="Sons do app"
          descricao={
            config.somAtivo
              ? 'Toques ativos — você ouvirá ao trocar de etapa nos exercícios'
              : 'Sons desativados — o app funcionará em silêncio'
          }
          iconeAtivo={<Volume2 size={20} className="text-[#9B7AD6]" />}
          iconeDesativo={<VolumeX size={20} className="text-[#9B8BBB]" />}
        />
      </div>

      {/* Sobre */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] px-5 divide-y divide-[#EDE7F9]">
        <div className="py-4">
          <p className="font-semibold text-[#3D2B6B] text-base mb-1 flex items-center gap-2">
            <Info size={18} className="text-[#9B7AD6]" /> Sobre o CollagenFlow
          </p>
          <p className="text-[#7B6B9A] text-sm leading-relaxed">
            Versão 1.0 · Ritual de bem-estar de 7 dias para a saúde da bexiga e do assoalho pélvico.
          </p>
        </div>
        <div className="py-4">
          <Link
            to="/aviso"
            className="flex items-center gap-2 text-[#9B7AD6] font-semibold text-base"
          >
            <Shield size={18} />
            Ver aviso de saúde e disclaimer
          </Link>
        </div>
      </div>

      {/* Nota sobre som */}
      <div className="bg-[#EDE7F9] rounded-2xl p-4">
        <p className="text-[#7B6B9A] text-sm leading-relaxed">
          💡 O som é ativado por padrão para ajudar a perceber a troca de etapas durante os exercícios — sem precisar olhar para a tela.
          Se estiver em um lugar silencioso, desative aqui.
        </p>
      </div>
    </div>
  )
}
