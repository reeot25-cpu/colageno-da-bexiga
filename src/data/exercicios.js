// Conteúdo dos exercícios — edite aqui para atualizar textos no app
//
// Cada etapa aceita:
//   instrucao → texto exibido na tela
//   narracao  → texto narrado pela voz (guiado como uma fisioterapeuta ao vivo)
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
        narracao:
          'Vamos começar juntas. Fique confortável, sentada ou em pé, com a coluna reta e os ombros soltos. Deixe o rosto e a barriga relaxados. Agora respire fundo pelo nariz, enchendo a barriga de ar… e solte devagar pela boca, soltando toda a tensão do dia. Mais uma vez: inspira pelo nariz… e expira pela boca, bem lento. Isso. Este é o seu momento agora. Vamos com calma.',
        audioUrl: null,
      },
      {
        nome: 'Contração suave',
        segundos: 50,
        instrucao: 'Contraia o assoalho pélvico suavemente (como se fosse parar o xixi). Segure 5 segundos... solte 5 segundos. Repita sem pressa.',
        narracao:
          'Agora vamos encontrar o músculo certo. O assoalho pélvico é uma rede de músculos no fundo da barriga, que sustenta a bexiga. Para achar, imagine que você está segurando o xixi e prendendo um gasinho ao mesmo tempo, puxando tudo para dentro e para cima. A barriga, os glúteos e as pernas ficam relaxados. Vamos lá: inspire… e ao soltar o ar, contraia suave. Segure… um… dois… três… quatro… cinco. Agora solte devagar e relaxe por cinco segundos… um… dois… três… quatro… cinco. Sentiu a diferença entre contrair e soltar? É exatamente isso. Você está indo muito bem. Vamos repetir sem pressa, sempre soltando o ar na contração.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas',
        segundos: 30,
        instrucao: 'Agora contraia e solte rapidamente, 1 segundo cada. Mantenha a respiração tranquila.',
        narracao:
          'Agora vamos trabalhar a força rápida, que é a que segura o xixi quando você tosse ou espirra. Deixe a respiração solta, sem prender o ar em nenhum momento. Contraia e solte rápido, um segundo em cada. Contrai… e solta. Contrai… e solta. Você deve sentir o músculo subir e descer por dentro a cada vez. Continue no seu ritmo… contrai… solta. Isso mesmo, com controle. Se cansar, respire fundo e siga. Você está quase lá.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento final',
        segundos: 20,
        instrucao: 'Solte tudo. Respire fundo. Sinta o relaxamento dos músculos. Muito bem! 🌿',
        narracao:
          'Agora solte tudo completamente. Relaxar é tão importante quanto contrair. Respire fundo pelo nariz… e solte pela boca, deixando o assoalho pélvico amolecer por inteiro. Sinta a região sem nenhuma tensão, descansada. Você acabou de cuidar de um músculo que sustenta muito do seu bem-estar. Parabéns por esses minutos dedicados a você. Nos vemos no próximo treino.',
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
        narracao:
          'Bem-vinda ao seu treino médio. Sente-se com a coluna apoiada e os pés no chão, ou deite de costas com os joelhos dobrados e os pés apoiados — o que for melhor pra você. Solte os ombros, a mandíbula e a barriga. Agora respire fundo pelo nariz, sentindo a barriga expandir… e solte lentamente pela boca. De novo, inspira contando até quatro… e expira contando até seis. Sinta o corpo desacelerar. Você tem esse tempo só pra você.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 1ª série',
        segundos: 60,
        instrucao: 'Contraia o assoalho pélvico e segure por 10 segundos. Solte por 10 segundos. Repita com calma.',
        narracao:
          'Vamos fortalecer com contrações longas. Lembre do músculo: imagine segurar o xixi e puxar para dentro e para cima, sem apertar barriga, glúteos ou coxas. Inspire preparando… e ao soltar o ar, contraia firme. Segure… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Agora solte devagar e descanse por dez segundos, respirando normal. Ao contrair, você deve sentir uma leve elevação interna, e um alívio quando solta. Está indo muito bem. Vamos repetir: inspira… contrai ao expirar… e segura.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 1ª série',
        segundos: 30,
        instrucao: 'Contraia e solte rapidamente, 1 segundo cada. Mantenha a respiração tranquila.',
        narracao:
          'Agora as contrações rápidas, para o músculo aprender a reagir depressa. Não prenda a respiração, deixe o ar fluir. Contrai e solta, um segundo cada. Contrai… solta… contrai… solta. Sinta o músculo subindo e descendo rápido. Continue firme, no seu ritmo. Você consegue.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe completamente.',
        narracao:
          'Momento de descanso. Solte completamente o assoalho pélvico. Respire fundo pelo nariz… e solte pela boca. Sinta a região amolecer. Esse descanso faz parte do treino: é ele que deixa o músculo pronto para a próxima série. Aproveite e respire.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador',
        segundos: 60,
        instrucao: 'Imagine um elevador subindo. Contraia aos poucos em 4 "andares" — cada nível mais firme. Depois desça devagar, nível por nível. Repita 2 vezes.',
        narracao:
          'Agora o exercício do elevador, que ensina o controle da força. Imagine que o seu assoalho pélvico é um elevador subindo andar por andar. Inspire… e ao soltar o ar, suba devagar: primeiro andar, contração leve… segundo andar, um pouco mais firme… terceiro andar, mais forte… quarto andar, a contração máxima que você consegue. Segure um instante no topo. Agora desça com controle: terceiro andar… segundo… primeiro… e relaxa totalmente no térreo. Percebeu como você comanda a intensidade? Isso é força e consciência juntas. Vamos repetir mais uma vez, subindo com calma e descendo com atenção. Muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 2ª série',
        segundos: 60,
        instrucao: 'Contraia e segure por 10 segundos. Solte por 10 segundos. Mais 3 repetições.',
        narracao:
          'Segunda série de contrações longas. Mantenha a postura e a respiração solta. Inspire… e ao expirar, contraia firme e segure… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Solte devagar e descanse dez segundos. Você já está na metade — sua constância é o que constrói o resultado. Vamos de novo, com a mesma qualidade.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 2ª série',
        segundos: 30,
        instrucao: 'Última série rápida! Contraia e solte, 1 segundo cada.',
        narracao:
          'Última série rápida! Respire normalmente, sem travar o ar. Contrai e solta, contrai e solta, um segundo cada. Sinta o músculo respondendo depressa. Dá pra notar a diferença desde o começo do treino, né? Continue, você está arrasando.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento final',
        segundos: 30,
        instrucao: 'Solte tudo. Respire fundo 3 vezes. Parabéns pelo cuidado consigo! 🌸',
        narracao:
          'Chegamos ao fim. Solte tudo agora, completamente. Respire fundo três vezes comigo: inspira pelo nariz… e expira pela boca. Inspira… e expira. Inspira… e expira. Sinta o assoalho pélvico totalmente relaxado e a leveza no corpo. Você completou o treino médio inteiro. Isso é cuidado de verdade com você mesma. Tenho muito orgulho da sua dedicação de hoje.',
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
        narracao:
          'Bem-vinda ao treino completo, o seu ritual mais profundo de cuidado. Escolha uma posição confortável: deitada de costas com os joelhos dobrados e os pés apoiados, ou sentada com a coluna reta. Feche os olhos se quiser. Solte os ombros, a barriga e o rosto. Respire fundo pelo nariz, enchendo a barriga de ar… e solte devagar pela boca. Mais uma vez, bem lento: inspira… e expira, soltando o mundo lá fora. Este tempo é todo seu.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 1ª série',
        segundos: 90,
        instrucao: 'Contraia o assoalho pélvico e segure por 10 segundos. Solte por 10 segundos. Continue com calma.',
        narracao:
          'Vamos começar fortalecendo. Localize o assoalho pélvico: imagine segurar o xixi e um gasinho ao mesmo tempo, puxando tudo para dentro e para cima. Barriga, glúteos e pernas ficam relaxados, só a musculatura interna trabalha. Inspire preparando… e ao soltar o ar, contraia firme. Segure… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Solte bem devagar e descanse dez segundos. Ao contrair, você sente uma elevação suave por dentro. Perfeito. Cada repetição fortalece de verdade — vamos continuar com calma.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 1ª série',
        segundos: 30,
        instrucao: 'Contraia e solte rapidamente, 1 segundo cada. Respire sempre.',
        narracao:
          'Agora as contrações rápidas, que treinam o reflexo de segurar numa tosse ou espirro. Deixe a respiração livre, nunca prenda o ar. Contrai e solta, um segundo cada. Contrai… solta… contrai… solta. Sinta o músculo subindo e descendo rápido. Continue firme. Você está indo muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe completamente.',
        narracao:
          'Descanse agora. Solte o assoalho pélvico por completo e respire fundo. Sinta a região relaxada. Seu corpo está respondendo ao cuidado, e esse descanso é parte essencial do fortalecimento.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador — 1ª série',
        segundos: 90,
        instrucao: 'Contraia em 4 níveis crescentes (como um elevador subindo). Depois desça devagar. Repita 3 vezes.',
        narracao:
          'Hora do exercício do elevador. Imagine o seu assoalho pélvico como um elevador. Inspire… e ao soltar o ar, suba devagar: primeiro andar, leve… segundo, mais firme… terceiro, mais forte… quarto andar, força máxima. Segure um instante no topo. Agora desça com controle: terceiro… segundo… primeiro… e relaxa no térreo. Repita mais duas vezes, subindo com calma e descendo com atenção total. Esse controle fino é o que devolve a firmeza no dia a dia. Você está mandando muito bem.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — 2ª série',
        segundos: 90,
        instrucao: 'Contraia e segure por 10 segundos. Solte por 10 segundos. Mais 4 repetições.',
        narracao:
          'Segunda série de contrações longas. Mantenha a respiração solta e a barriga relaxada. Inspire… e ao expirar, contraia firme e segure dez segundos… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Solte devagar, descanse dez segundos. Você está na metade do treino, e sua constância está construindo algo real. Vamos de novo com a mesma qualidade.',
        audioUrl: null,
      },
      {
        nome: 'Descanso',
        segundos: 20,
        instrucao: 'Respire fundo. Relaxe.',
        narracao:
          'Respire e descanse. Solte tudo. Inspire fundo pelo nariz… e expire pela boca, soltando qualquer tensão. Você está indo muito bem — aproveite essa pausa.',
        audioUrl: null,
      },
      {
        nome: 'Contrações rápidas — 2ª série',
        segundos: 40,
        instrucao: 'Contraia e solte rapidamente. Mantenha o ritmo.',
        narracao:
          'Segunda série rápida. Ar sempre fluindo, sem travar. Contrai e solta, contrai e solta, mantendo o ritmo. Sinta a resposta rápida do músculo. Continue no seu tempo, com controle. Falta pouco, você consegue.',
        audioUrl: null,
      },
      {
        nome: 'Exercício Elevador — 2ª série',
        segundos: 90,
        instrucao: 'Mais uma série do elevador. 4 andares subindo, 4 descendo. Devagar e com atenção.',
        narracao:
          'Última série do elevador. Inspire… e suba devagar pelos quatro andares, sentindo cada nível de força: primeiro… segundo… terceiro… quarto, máximo. Segure no topo. E desça com atenção: terceiro… segundo… primeiro… relaxa no térreo. Cada andar com consciência plena. Você está quase no fim, e com muita qualidade.',
        audioUrl: null,
      },
      {
        nome: 'Contrações longas — série final',
        segundos: 60,
        instrucao: 'Última série de contrações longas. Segure 10 segundos, solte 10. Você está quase lá!',
        narracao:
          'Última série de contrações longas. Dê o seu melhor agora, com calma. Inspire… e ao expirar, contraia firme e segure… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Solte devagar. Respire. Cada segundo dessa série vale muito. Você está quase terminando — que orgulho de você.',
        audioUrl: null,
      },
      {
        nome: 'Relaxamento guiado',
        segundos: 60,
        instrucao: 'Solte tudo completamente. Respire fundo e devagar. Sinta o peso do corpo. Agradeça ao seu corpo pelo cuidado de hoje.',
        narracao:
          'Chegamos ao relaxamento final. Solte tudo agora, completamente. Inspire fundo pelo nariz… e expire pela boca, soltando qualquer tensão que ainda restou. Sinta o peso do seu corpo apoiado, e a leveza que vem depois do esforço. Leve a atenção ao assoalho pélvico e sinta ele macio, descansado. Respire com tranquilidade. Você completou o treino completo, do início ao fim. Isso é dedicação real com a sua saúde, e você merece se orgulhar. Até o próximo cuidado.',
        audioUrl: null,
      },
    ],
  },
]
