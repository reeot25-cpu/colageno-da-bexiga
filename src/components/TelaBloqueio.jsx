import { Sparkles, Heart, Lock } from 'lucide-react'
import { useProgresso } from '../hooks/useProgresso'
import { getNomeSalvo } from '../hooks/useNome'
import { primeiroNome } from '../utils/saudacao'
import { LINK_ASSINATURA, DIAS_ACESSO } from '../utils/acesso'
import CardEvolucao from './CardEvolucao'

// Conta quantos dias a usuária registrou no diário.
function contarDiasDiario() {
  try {
    return Object.keys(JSON.parse(localStorage.getItem('collagenflow_diario') || '{}')).length
  } catch {
    return 0
  }
}

// Tela mostrada quando os 21 dias terminam. Acolhedora, nunca punitiva:
// agradece, celebra as conquistas e convida a continuar via assinatura.
export default function TelaBloqueio() {
  const { progressoGeral } = useProgresso()
  const geral = progressoGeral()
  const nome = primeiroNome(getNomeSalvo())
  const diasDiario = contarDiasDiario()

  const conquistas = [
    {
      emoji: '📅',
      valor: geral.diasCompletos,
      label: geral.diasCompletos === 1 ? 'dia de ritual completo' : 'dias de ritual completos',
    },
    {
      emoji: '✅',
      valor: geral.feitas,
      label: geral.feitas === 1 ? 'tarefa de cuidado concluída' : 'tarefas de cuidado concluídas',
    },
    {
      emoji: '📝',
      valor: diasDiario,
      label: diasDiario === 1 ? 'dia registrado no diário' : 'dias registrados no diário',
    },
  ]

  return (
    <div className="fixed inset-0 z-[80] bg-[#EDE7F9] overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Coração / selo */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] flex items-center justify-center shadow-lg mb-5">
            <Heart size={38} className="text-white" fill="white" />
          </div>

          {/* Agradecimento */}
          <h1 className="font-titulo text-2xl text-[#6B4EA8] font-bold leading-tight">
            {nome ? `${nome}, que jornada linda! 💜` : 'Que jornada linda! 💜'}
          </h1>
          <p className="text-[#7B6B9A] text-base mt-3 leading-relaxed">
            Seus {DIAS_ACESSO} dias de acesso chegaram ao fim — mas o que você construiu nesse tempo
            fica com você. Obrigada por ter chegado até aqui e por ter cuidado tanto de você. 🌸
          </p>

          {/* Conquistas */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-[#D8CCF0] p-5 mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#B8A0E0]" />
              <p className="font-semibold text-[#3D2B6B] text-sm">Suas conquistas nesses {DIAS_ACESSO} dias</p>
            </div>
            <div className="flex flex-col gap-3">
              {conquistas.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F5F0FF] rounded-xl p-3">
                  <span className="text-2xl shrink-0">{c.emoji}</span>
                  <p className="text-[#3D2B6B] text-sm text-left leading-snug">
                    <strong className="text-[#6B4EA8] text-lg">{c.valor}</strong> {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evolução registrada no Diário (só aparece com 6+ dias de registro) */}
          <div className="w-full mt-4">
            <CardEvolucao convite={false} />
          </div>

          {/* Convite para continuar */}
          <p className="text-[#7B6B9A] text-sm mt-6 leading-relaxed">
            Sua bexiga e seu assoalho pélvico agradecem cada dia de constância. Que tal continuar
            essa evolução? Sua jornada não precisa parar aqui. 💜
          </p>

          {/* CTA assinatura */}
          <a
            href={LINK_ASSINATURA}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-5 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-[#9B7AD6] to-[#6B4EA8] text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Continuar minha jornada 💜
          </a>
          <p className="text-[#9B8BBB] text-xs mt-4 leading-relaxed">
            Ao assinar, você mantém acesso a todo o ritual, exercícios e ao seu diário de evolução.
          </p>
        </div>
      </div>
    </div>
  )
}
