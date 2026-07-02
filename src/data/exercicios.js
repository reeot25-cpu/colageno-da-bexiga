// Conteúdo dos exercícios — edite aqui para atualizar textos no app
//
// Cada etapa aceita:
//   instrucao → texto exibido na tela
//   narracao  → texto narrado pela voz (pode ser mais coloquial/guiado)
//   audioUrl  → caminho para arquivo gravado em /public/audio/ (deixe null para usar síntese)
//               Ex: '/audio/rapido-respiracao.mp3'

export const avisoExercicios =
  'Estes exercícios são um apoio de bem-estar. Pare imediatamente se sentir dor ou desconforto. Não faça com a bexiga cheia. Não substitui acompanhamento com fisioterapeuta pélvica.'

export const comoContrair = {
  titulo: 'Como contrair corretamente?',
  texto:
    'Imagine que você está tentando parar o xixi no meio do caminho. É esse músculo que queremos trabalhar. O erro mais comum é prender a respiração ou contrair o abdômen e os glúteos — tente manter tudo relaxado e focar apenas na musculatura interna. Respire normalmente durante todo o exercício.',
}

export const treinos = [
  {
    id: 'rapido',
    nome: 'Treino Rápido',
    duracao: '2 min',
    descricao: '"Enquanto a água ferve"',
    icone: '⚡',
    etapas: [
      {
        nome: 'Respiração de preparo',
        segundos: 20,
        instrucao: 'Respire fundo e devagar. Relaxe os ombros, o abdômen e os glúteos. Prepare-se com calma.',
        narracao: 'Vamos começar. Inspire fundo pelo nariz... e solte devagar pela boca. Relaxe os ombros, o abdômen e os glúteos. Chegue presente neste momento. Você está aqui, cuidando de você.',
        audioUrl: null,
      },
      {
        nome: 'Contração suave',
        segundos: 50,
        instrucao: 'Contraia o assoalho pélvico suavemente (como se fosse parar o xixi). Segure 5 segundos... solte 5 segundos. Repita sem pressa.',
        narracao: 'Agora, imagine que está tentando parar o xixi. Contraia suavemente esse músculo interno. Segure... dois, três, quatro, cinco. Solte devagar. Respire. Vamos repetir: contrai... segura... e solta. Sem pressa. Você está indo muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas',
        segundos: 30,
        instrucao: 'Agora contraia e solte rapidamente, 1 segundo cada. Mantenha a respiração tranquila.',
        narracao: 'Agora vamos acelerar um pouco. Contraia e solte rapidamente, um segundo cada. Contrai... solta... contrai... solta. Continue no seu ritmo. Respire sempre.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento final',
        segundos: 20,
        instrucao: 'Solte tudo. Respire fundo. Sinta o relaxamento dos músculos. Muito bem! 🌿',
        narracao: 'Solte tudo agora. Respire fundo e devagar. Sinta os músculos relaxando completamente. Você terminou. Parabéns pelo cuidado com você hoje!',
        audioUrl: null,
      },
    ],
  },

  {
    id: 'medio',
    nome: 'Treino Médio',
    duracao: '5 min',
    descricao: '"Uma pausa de cuidado"',
    icone: '🌿',
    etapas: [
      {
        nome: 'Respiração de preparo',
        segundos: 30,
        instrucao: 'Respire fundo e devagar. Relaxe os ombros, o abdômen e os glúteos. Sinta o chão sob os pés.',
        narracao: 'Vamos começar com calma. Inspire fundo pelo nariz... e expire devagar pela boca. Solte os ombros, o abdômen, os glúteos. Sinta o chão firme sob seus pés. Você tem este tempo todo para você.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 1ª série',
        segundos: 60,
        instrucao: 'Contraia o assoalho pélvico e segure por 10 segundos. Solte por 10 segundos. Repita com calma.',
        narracao: 'Contraia o assoalho pélvico agora. Segure... dois, três, quatro, cinco, seis, sete, oito, nove, dez. Solte devagar. Respire. Sinta o relaxamento. Vamos de novo: contrai, segura... e solta. Você está indo muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 1ª série',
        segundos: 30,
        instrucao: 'Contraia e solte rapidamente, 1 segundo cada. Mantenha a respiração tranquila.',
        narracao: 'Agora rápido: contrai e solta, contrai e solta. Mantenha a respiração fluindo. Não prenda o ar. Continue no seu ritmo.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe completamente.',
        narracao: 'Descanse agora. Inspire fundo... e solte tudo. Relaxe completamente. Você merece essa pausa.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador',
        segundos: 60,
        instrucao: 'Imagine um elevador subindo. Contraia aos poucos em 4 "andares" — cada nível mais firme. Depois desça devagar, nível por nível. Repita 2 vezes.',
        narracao: 'Agora o exercício do elevador. Imagine que seu assoalho pélvico é um elevador. Suba para o primeiro andar... segundo andar... terceiro... quarto — máxima contração. Agora desça: terceiro... segundo... primeiro... térreo. Relaxe. Vamos repetir mais uma vez. Sobe devagar... e desce devagar.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 2ª série',
        segundos: 60,
        instrucao: 'Contraia e segure por 10 segundos. Solte por 10 segundos. Mais 3 repetições.',
        narracao: 'Segunda série de contrações longas. Contraia e segure... cinco, seis, sete, oito, nove, dez. Solte. Respire. Você está quase terminando, continue firme.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 2ª série',
        segundos: 30,
        instrucao: 'Última série rápida! Contraia e solte, 1 segundo cada.',
        narracao: 'Última série rápida! Contrai e solta, contrai e solta. Você consegue! Quase lá.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento final',
        segundos: 30,
        instrucao: 'Solte tudo. Respire fundo 3 vezes. Parabéns pelo cuidado consigo! 🌸',
        narracao: 'Solte tudo agora. Respire fundo três vezes. Inspire... e expire. Inspire... e expire. Inspire... e expire. Você completou o treino médio. Parabéns pelo cuidado com você mesma hoje!',
        audioUrl: null,
      },
    ],
  },

  {
    id: 'completo',
    nome: 'Treino Completo',
    duracao: '10 min',
    descricao: '"Ritual completo de bem-estar"',
    icone: '✨',
    etapas: [
      {
        nome: 'Respiração de preparo',
        segundos: 30,
        instrucao: 'Respire fundo e devagar. Relaxe ombros, abdômen e glúteos. Chegue presente neste momento.',
        narracao: 'Bem-vinda ao treino completo. Este é um presente que você está dando ao seu corpo. Inspire fundo... e expire devagar. Relaxe ombros, abdômen, glúteos. Chegue presente neste momento. Você tem tempo, e está no lugar certo.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 1ª série',
        segundos: 90,
        instrucao: 'Contraia o assoalho pélvico e segure por 10 segundos. Solte por 10 segundos. Continue com calma.',
        narracao: 'Primeira série. Contraia o assoalho pélvico e segure... dois, três, quatro, cinco, seis, sete, oito, nove, dez. Solte devagar. Respire. Relaxe. Vamos repetir com calma. Cada repetição fortalece seus músculos internos.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 1ª série',
        segundos: 30,
        instrucao: 'Contraia e solte rapidamente, 1 segundo cada. Respire sempre.',
        narracao: 'Agora rápido. Contrai e solta. Contrai e solta. Respire sempre. Não prenda o ar. Continue.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe completamente.',
        narracao: 'Descanse. Respire fundo. Relaxe completamente. Seu corpo está respondendo ao cuidado.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador — 1ª série',
        segundos: 90,
        instrucao: 'Contraia em 4 níveis crescentes (como um elevador subindo). Depois desça devagar. Repita 3 vezes.',
        narracao: 'Exercício do elevador. Suba devagar: primeiro andar... segundo... terceiro... quarto, máxima contração. Agora desça: terceiro... segundo... primeiro... relaxa. Respira. Repita mais duas vezes. Sobe com calma... e desce com atenção.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 2ª série',
        segundos: 90,
        instrucao: 'Contraia e segure por 10 segundos. Solte por 10 segundos. Mais 4 repetições.',
        narracao: 'Segunda série de contrações longas. Contrai e segura... dez segundos... e solta. Respire. Você está na metade do treino. Sua constância está construindo algo real.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe.',
        narracao: 'Descanse. Respire. Você está indo muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 2ª série',
        segundos: 40,
        instrucao: 'Contraia e solte rapidamente. Mantenha o ritmo.',
        narracao: 'Segunda série rápida. Contrai e solta. Mantenha o ritmo. Respire. Continue.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador — 2ª série',
        segundos: 90,
        instrucao: 'Mais uma série do elevador. 4 andares subindo, 4 descendo. Devagar e com atenção.',
        narracao: 'Última série do elevador. Suba devagar pelos quatro andares... e desça com atenção. Cada andar com consciência. Você está quase lá.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — série final',
        segundos: 60,
        instrucao: 'Última série de contrações longas. Segure 10 segundos, solte 10. Você está quase lá!',
        narracao: 'Última série de contrações longas. Dê o seu melhor agora. Contrai e segura... dez segundos. Solta. Respira. Você está quase terminando. Cada segundo vale.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento guiado',
        segundos: 60,
        instrucao: 'Solte tudo completamente. Respire fundo e devagar. Sinta o peso do corpo. Agradeça ao seu corpo pelo cuidado de hoje.',
        narracao: 'Solte tudo agora. Completamente. Inspire fundo... e expire soltando qualquer tensão. Sinta o peso do seu corpo. Sinta a leveza que vem depois do esforço. Agradeça ao seu corpo pela dedicação de hoje. Você completou o treino completo. Isso é cuidado real, e você merece.',
        audioUrl: null,
      },
    ],
  },
]
