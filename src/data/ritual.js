// Protocolo de 7 dias — cada dia tem uma lista de tarefas
// O id deve ser único e estável (não mude depois que usuárias começarem a usar)
export const diasRitual = Array.from({ length: 7 }, (_, i) => ({
  dia: i + 1,
  tarefas: [
    { id: `d${i + 1}_cha_firmeza`,    label: 'Chá da Firmeza',       emoji: '🌿', horario: 'Manhã' },
    { id: `d${i + 1}_vitamina`,       label: 'Vitamina da Firmeza',  emoji: '🥝', horario: 'Café da manhã' },
    { id: `d${i + 1}_prato_base`,     label: 'Prato Base',           emoji: '🥗', horario: 'Almoço' },
    { id: `d${i + 1}_cha_anti`,       label: 'Chá Anti-Inflama',     emoji: '🫚', horario: 'Tarde' },
    { id: `d${i + 1}_exercicio`,      label: 'Exercício do dia',     emoji: '💪', horario: 'Qualquer momento' },
    { id: `d${i + 1}_caldo`,          label: 'Caldo Pró-Colágeno',   emoji: '🍲', horario: 'Jantar' },
    { id: `d${i + 1}_cha_calmaria`,   label: 'Chá da Calmaria',      emoji: '🌼', horario: 'Noite' },
  ],
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
