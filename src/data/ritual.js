// Protocolo de 21 dias = o mesmo ciclo de 7 dias repetido em 3 semanas.
// Cada semana tem as tarefas desmarcadas; o que foi marcado na Semana 1 é mantido.
// O id deve ser único e estável (não mude depois que usuárias começarem a usar):
//   Semana 1 → ids originais  `d{1..7}_{chave}`
//   Semana 2 → `s2_d{1..7}_{chave}` · Semana 3 → `s3_d{1..7}_{chave}`
export const DIAS_POR_SEMANA = 7
export const SEMANAS_RITUAL = 3

const tarefasDoCiclo = [
  { chave: 'cha_firmeza',  label: 'Chá da Firmeza',       emoji: '🌿', horario: 'Manhã' },
  { chave: 'vitamina',     label: 'Vitamina da Firmeza',  emoji: '🥝', horario: 'Café da manhã' },
  { chave: 'prato_base',   label: 'Prato Base',           emoji: '🥗', horario: 'Almoço' },
  { chave: 'cha_anti',     label: 'Chá Anti-Inflama',     emoji: '🫚', horario: 'Tarde' },
  { chave: 'exercicio',    label: 'Exercício do dia',     emoji: '🧘', horario: 'Qualquer momento' },
  { chave: 'caldo',        label: 'Caldo Pró-Colágeno',   emoji: '🍲', horario: 'Jantar' },
  { chave: 'cha_calmaria', label: 'Chá da Calmaria',      emoji: '🌼', horario: 'Noite' },
]

export function semanaDoDia(dia) {
  return Math.floor((dia - 1) / DIAS_POR_SEMANA) + 1
}

// Id da tarefa `chave` no dia `dia` (1..21) — use sempre isto em vez de montar o id à mão.
export function idTarefa(dia, chave) {
  const semana = semanaDoDia(dia)
  const diaSemana = ((dia - 1) % DIAS_POR_SEMANA) + 1
  return semana === 1 ? `d${diaSemana}_${chave}` : `s${semana}_d${diaSemana}_${chave}`
}

export const diasRitual = Array.from({ length: DIAS_POR_SEMANA * SEMANAS_RITUAL }, (_, i) => ({
  dia: i + 1,
  semana: semanaDoDia(i + 1),
  tarefas: tarefasDoCiclo.map((t) => ({ ...t, id: idTarefa(i + 1, t.chave) })),
}))

// Frases motivacionais rotativas
export const frases = [
  'Cuidar do seu corpo é um ato de amor próprio. 🌸',
  'Cada pequena escolha saudável conta. Continue! 🌿',
  'Você está investindo na melhor versão de si mesma. ✨',
  'A consistência é o segredo do bem-estar duradouro. 💛',
  'Seu corpo merece atenção e carinho todos os dias. 🌺',
  'Um passo de cada vez. Você está no caminho certo! 🌻',
  'O autocuidado começa com gestos simples e constantes. 🍃',
]
