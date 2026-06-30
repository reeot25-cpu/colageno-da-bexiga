import { ArrowLeft, Volume2, VolumeX, Bell, BellOff, Info, Shield } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { tocarTrocaEtapa } from '../utils/som'
import {
  pedirPermissao,
  permissaoAtual,
  agendarLembrete,
  cancelarLembrete,
  dispararNotificacao,
} from '../utils/notificacoes'

function Toggle({ ativo, onChange, label, descricao, iconeAtivo, iconeDesativo }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${ativo ? 'bg-[#EDE7F9]' : 'bg-[#F0EEF8]'}`}>
          {ativo ? iconeAtivo : iconeDesativo}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#3D2B6B] text-base">{label}</p>
          <p className="text-[#7B6B9A] text-sm mt-0.5 leading-snug">{descricao}</p>
        </div>
      </div>
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
  const { config, alterarSom, alterarLembretes } = useConfiguracoes()

  const permissao = permissaoAtual()
  const bloqueado = permissao === 'denied'
  const semSuporte = permissao === 'unsupported'

  function handleSomChange(valor) {
    alterarSom(valor)
    if (valor) tocarTrocaEtapa()
  }

  async function handleLembretesChange(valor) {
    if (valor) {
      // Tentar obter permissão se ainda não tem
      if (permissao === 'default') {
        const res = await pedirPermissao()
        if (res !== 'granted') return   // usuária recusou — não muda o toggle
      }
      if (permissaoAtual() === 'granted') {
        alterarLembretes(true)
        agendarLembrete()
        // Mostra prévia da notificação
        setTimeout(() => dispararNotificacao(), 1500)
      }
    } else {
      alterarLembretes(false)
      cancelarLembrete()
    }
  }

  function descricaoLembrete() {
    if (bloqueado)   return 'Notificações bloqueadas nas configurações do dispositivo'
    if (semSuporte)  return 'Seu navegador não suporta notificações'
    if (!config.lembretesAtivos) return 'Lembretes desativados — você não receberá avisos'
    return 'Lembretes ativos — você receberá um aviso diário às 9h'
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

      {/* Som + Lembretes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] px-5 divide-y divide-[#EDE7F9]">
        <Toggle
          ativo={config.somAtivo}
          onChange={handleSomChange}
          label="Sons do app"
          descricao={
            config.somAtivo
              ? 'Toques ativos ao trocar de etapa nos exercícios'
              : 'Sons desativados — o app funcionará em silêncio'
          }
          iconeAtivo={<Volume2 size={20} className="text-[#9B7AD6]" />}
          iconeDesativo={<VolumeX size={20} className="text-[#9B8BBB]" />}
        />

        <Toggle
          ativo={config.lembretesAtivos && !bloqueado && !semSuporte}
          onChange={handleLembretesChange}
          label="Lembretes diários"
          descricao={descricaoLembrete()}
          iconeAtivo={<Bell size={20} className="text-[#9B7AD6]" />}
          iconeDesativo={<BellOff size={20} className="text-[#9B8BBB]" />}
        />
      </div>

      {/* Aviso se bloqueado pelo sistema */}
      {bloqueado && (
        <div className="bg-[#FFF5E0] border border-[#D4AF7A] rounded-2xl p-4">
          <p className="text-[#7A5A20] text-sm leading-relaxed">
            <strong>Notificações bloqueadas.</strong> Para reativar, acesse as configurações do seu dispositivo → Notificações → CollagenFlow e permita.
          </p>
        </div>
      )}

      {/* Nota explicativa lembretes */}
      {!bloqueado && !semSuporte && (
        <div className="bg-[#EDE7F9] rounded-2xl p-4">
          <p className="text-[#7B6B9A] text-sm leading-relaxed">
            🔔 O lembrete aparece como notificação do dispositivo para te convidar a fazer os exercícios e registrar o diário.
            No <strong>Android</strong> funciona mesmo com o app fechado. No <strong>iPhone</strong>, o app precisa estar instalado na tela inicial (PWA) e o iOS 16.4+ é necessário.
          </p>
        </div>
      )}

      {/* Sobre */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D8CCF0] px-5 divide-y divide-[#EDE7F9]">
        <div className="py-4">
          <p className="font-semibold text-[#3D2B6B] text-base mb-1 flex items-center gap-2">
            <Info size={18} className="text-[#9B7AD6]" /> Sobre o CollagenFlow
          </p>
          <p className="text-[#7B6B9A] text-sm leading-relaxed">
            Versão 1.1 · Ritual de bem-estar de 7 dias para a saúde da bexiga e do assoalho pélvico.
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

      <div className="bg-[#EDE7F9] rounded-2xl p-4">
        <p className="text-[#7B6B9A] text-sm leading-relaxed">
          💡 O som é ativado por padrão para ajudar a perceber a troca de etapas durante os exercícios — sem precisar olhar para a tela.
        </p>
      </div>
    </div>
  )
}
