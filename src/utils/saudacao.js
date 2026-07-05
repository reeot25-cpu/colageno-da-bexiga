// Helpers para usar o nome da usuária de forma acolhedora e natural.

// "Bom dia" / "Boa tarde" / "Boa noite" conforme o horário local.
export function saudacaoHorario(d = new Date()) {
  const h = d.getHours()
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

// Só o primeiro nome (para chamar pelo nome como uma amiga).
export function primeiroNome(nome) {
  return (nome || '').trim().split(/\s+/)[0] || ''
}

// Prefixa uma frase com o nome em vocativo, ajustando a 1ª letra:
//   comNome('Ana', 'Que dia incrível!') → 'Ana, que dia incrível!'
//   comNome('',    'Que dia incrível!') → 'Que dia incrível!'
export function comNome(nome, frase) {
  const n = primeiroNome(nome)
  if (!n || !frase) return frase
  return `${n}, ${frase.charAt(0).toLowerCase()}${frase.slice(1)}`
}
