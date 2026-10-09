import { useState, useCallback } from 'react'
import {
  lerRegistros, calcularGanhos, lerGastos, totalGasto, calcularMedalhas,
  premioDesbloqueado, desbloquearPremio,
} from '../utils/petalas'

// Recalcula tudo a partir do localStorage a cada render (dados pequenos, é barato).
// Assim o saldo sempre reflete o que as outras telas acabaram de gravar.
export function usePetalas() {
  const [, setVersao] = useState(0)
  const registros = lerRegistros()
  const ganhos = calcularGanhos(registros)
  const saldo = Math.max(0, ganhos.total - totalGasto(lerGastos()))

  const desbloquear = useCallback((premio) => {
    const ok = desbloquearPremio(premio)
    setVersao((v) => v + 1)
    return ok
  }, [])

  const atualizar = useCallback(() => setVersao((v) => v + 1), [])

  return {
    saldo,
    ganhos,
    medalhas: calcularMedalhas(registros),
    desbloqueado: premioDesbloqueado,
    desbloquear,
    atualizar,
  }
}
