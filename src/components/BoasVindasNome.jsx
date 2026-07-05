import { useState } from 'react'

// Tela de onboarding (1ª abertura, após a splash): pergunta o nome da usuária.
// Aparece só enquanto não houver nome salvo. Ao salvar, some para sempre.
export default function BoasVindasNome({ onSalvar }) {
  const [valor, setValor] = useState('')
  const nomeValido = valor.trim().length > 0

  function enviar(e) {
    e.preventDefault()
    if (!nomeValido) return
    onSalvar(valor.trim())
  }

  return (
    <div className="fixed inset-0 z-[90] bg-[#EDE7F9] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <img
          src="/icon-512.png"
          alt="CollagenFlow"
          className="w-24 h-24 rounded-3xl shadow-lg mb-6"
        />

        <h1 className="font-titulo text-3xl text-[#6B4EA8] font-bold leading-tight">
          Olá! Que bom<br />te ter aqui 💜
        </h1>
        <p className="text-[#7B6B9A] text-base mt-3 mb-8">Como posso te chamar?</p>

        <form onSubmit={enviar} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite seu nome ou apelido"
            autoFocus
            maxLength={30}
            enterKeyHint="go"
            className="w-full px-5 py-4 rounded-2xl bg-white border border-[#D8CCF0] text-[#3D2B6B] text-lg text-center placeholder:text-[#B8A8D8] focus:outline-none focus:border-[#9B7AD6] shadow-sm"
          />
          <button
            type="submit"
            disabled={!nomeValido}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              nomeValido
                ? 'bg-gradient-to-r from-[#9B7AD6] to-[#6B4EA8] text-white shadow-lg active:scale-95'
                : 'bg-[#D8CCF0] text-white/70'
            }`}
          >
            Começar minha jornada 💜
          </button>
        </form>

        <p className="text-[#9B8BBB] text-xs mt-6 leading-relaxed">
          Seu nome fica salvo só no seu aparelho. Você pode mudar depois nas configurações.
        </p>
      </div>
    </div>
  )
}
