// Aviso gentil que aparece nos últimos dias do programa (faltam 3, 2, 1 e 0).
// Nunca punitivo e SEM menção a assinatura ou desconto — isso só aparece
// depois do dia 21, na TelaBloqueio.
export default function AvisoFimAcesso({ faltam }) {
  const texto =
    faltam > 0
      ? `Faltam ${faltam} dia${faltam > 1 ? 's' : ''} para o fim do seu programa de 21 dias.`
      : 'Hoje é o último dia do seu programa de 21 dias.'

  return (
    <div className="bg-gradient-to-br from-[#9B7AD6] to-[#6B4EA8] rounded-2xl p-4 shadow-md text-white">
      <div className="flex gap-3 items-start">
        <span className="text-2xl shrink-0 leading-none">💜</span>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-snug">{texto}</p>
          <p className="text-white/80 text-sm mt-0.5 leading-snug">
            Aproveite estes últimos dias: cada cuidado ainda vira Pétalas para a sua recompensa 🌸
          </p>
        </div>
      </div>
    </div>
  )
}
