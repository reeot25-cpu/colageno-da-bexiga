import { faixaDesconto, linkAssinatura } from '../utils/acesso'

// Só no MODO DONA: mostra a faixa de desconto e o cupom que a TelaBloqueio
// usaria hoje. A usuária comum nunca vê este card.
export default function CardDonaDesconto({ ganhas }) {
  const { atual } = faixaDesconto(ganhas)
  return (
    <div className="bg-[#FFF8E7] border-2 border-dashed border-[#F5C842] rounded-2xl p-4 text-[#7A5A20] text-sm">
      <p className="font-bold">🔑 Modo dona — visível só para você</p>
      <p className="mt-1">
        {atual
          ? <>Faixa {atual.faixa} · {atual.desconto}% · cupom <code className="font-mono font-bold">{atual.cupom}</code></>
          : 'Sem faixa ainda (abaixo do mínimo) · sem cupom'}
      </p>
      <p className="mt-1 text-xs break-all">Link da TelaBloqueio: {linkAssinatura(atual)}</p>
    </div>
  )
}
