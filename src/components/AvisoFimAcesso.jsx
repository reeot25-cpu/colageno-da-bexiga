import { LINK_ASSINATURA } from '../utils/acesso'

// Aviso gentil que aparece nos últimos dias do período (faltam 3, 2, 1 e 0).
// Nunca punitivo — só um lembrete carinhoso com convite para continuar.
export default function AvisoFimAcesso({ faltam }) {
  const texto =
    faltam > 0
      ? `Faltam ${faltam} dia${faltam > 1 ? 's' : ''} para o fim do seu período de acesso.`
      : 'Hoje é o seu último dia de acesso.'

  return (
    <div className="bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] rounded-2xl p-4 shadow-md text-white">
      <div className="flex gap-3 items-start">
        <span className="text-2xl shrink-0 leading-none">💜</span>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-snug">{texto}</p>
          <p className="text-white/80 text-sm mt-0.5 leading-snug">
            Que tal continuar sua jornada? Você está indo tão bem!
          </p>
          <a
            href={LINK_ASSINATURA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-white text-[#6B4EA8] font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Quero continuar 💜
          </a>
        </div>
      </div>
    </div>
  )
}
