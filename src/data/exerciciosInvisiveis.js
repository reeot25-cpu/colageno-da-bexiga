// Exercícios "invisíveis" — feitos em qualquer lugar, sem ninguém perceber.
//
// Cada exercício aceita:
//   nome        → título curto exibido no card
//   posicao     → em que posição fazer (onde/como ficar)
//   foco        → o que exatamente contrair
//   instrucao   → texto de apoio exibido no card (linguagem de amiga)
//   narracao    → texto narrado pela voz feminina (pausas estratégicas com … e vírgulas)
//   timer       → segundos para o cronômetro; deixe null quando não fizer sentido
//   timerLabel  → rótulo do botão de cronômetro (ex: 'Segurar 10s')

export const mensagemAberturaInvisiveis =
  'Seu treino cabe em qualquer momento do dia. Ninguém precisa saber — mas sua bexiga vai agradecer 💜'

export const subtituloInvisiveis =
  'Exercícios discretos que você faz enquanto vive o seu dia. Ninguém vê, ninguém sabe.'

export const gruposInvisiveis = [
  {
    id: 'louca',
    momento: 'Lavando a louça, na pia',
    emoji: '🍽️',
    exercicios: [
      {
        nome: 'Contração rápida na pia',
        posicao: 'Em pé, de frente para a pia, com o peso bem distribuído nos dois pés.',
        foco: 'O músculo interno que segura o xixi — só ele, sem apertar barriga ou glúteos.',
        instrucao:
          'Enquanto lava, contraia e solte rapidinho, como piscadinhas lá dentro. Ninguém vê, ninguém sabe. 😉',
        narracao:
          'Você está de frente para a pia, em pé, com o peso igual nos dois pés e a coluna reta. Ninguém imagina que você vai treinar agora. Primeiro, ache o músculo: imagine que está segurando o xixi e puxando tudo para dentro e para cima. Só ele, sem apertar a barriga nem os glúteos. Mantenha a respiração solta, sem prender o ar. Agora, enquanto lava, contraia e solte rápido: contrai… e solta. Contrai… e solta. Um segundo em cada. Você vai sentir o músculo subir levemente por dentro a cada contração. A mão continua lavando, e ninguém percebe nada. Continue no seu ritmo. Muito bem, você acabou de treinar sem parar a louça.',
        timer: null,
        timerLabel: null,
      },
      {
        nome: 'Respiração apoiada na pia',
        posicao: 'Em pé, mãos apoiadas na beira da pia, ombros soltos.',
        foco: 'Aqui o foco é relaxar. Deixe a barriga expandir ao inspirar.',
        instrucao:
          'Uma pausa de respiração no meio da louça. Inspire pela barriga, solte devagar. Isso acalma a bexiga também. 🌿',
        narracao:
          'Apoie as duas mãos na beira da pia e solte os ombros para longe das orelhas. Os pés firmes no chão, joelhos levemente soltos. Aqui o foco é relaxar, não contrair. Inspire fundo pelo nariz, deixando a barriga crescer como um balão, sentindo o ar descer até embaixo… e solte devagar pela boca, esvaziando toda a barriga. A cada vez que você solta o ar, o assoalho pélvico amolece junto e a vontade de banheiro se acalma. Vamos de novo: inspira pelo nariz, a barriga enche… e expira pela boca, bem lento. Você deve sentir o corpo mais leve e a respiração mais calma. Isso mesmo. Continue nesse ritmo tranquilo.',
        timer: 40,
        timerLabel: 'Respirar 40s',
      },
      {
        nome: 'Contração lenta e progressiva',
        posicao: 'Em pé na pia, enquanto esfrega uma louça mais demorada.',
        foco: 'O músculo interno — subindo a força aos poucos, como um volume aumentando.',
        instrucao:
          'Vá apertando devagarzinho, cada vez mais forte, enquanto esfrega. Segure no topo e desça com calma. 🍽️',
        narracao:
          'Em pé na pia, coluna reta, escolha uma louça pra esfregar com calma. Respiração solta. Lembre do músculo: segurar o xixi e puxar para dentro e para cima. Agora vamos subir a força bem devagar. Inspire… e ao soltar o ar, comece leve, só um toque de contração… aumente um pouco… mais firme… e agora o máximo que você consegue, sem apertar a barriga. Segure no topo… um… dois… três. E desça devagarzinho, soltando aos poucos, como quem tira o pé do acelerador… até relaxar tudo. Sentiu o controle sobre a força? É esse controle que segura o xixi na hora que você precisa. Muito bem, você está no comando.',
        timer: 8,
        timerLabel: 'Segurar 8s',
      },
    ],
  },

  {
    id: 'trabalho',
    momento: 'No trabalho, sentada',
    emoji: '💼',
    exercicios: [
      {
        nome: 'Kegel discreto na cadeira',
        posicao: 'Sentada, coluna apoiada no encosto, pés no chão.',
        foco: 'O músculo de segurar o xixi. Ninguém enxerga esse movimento por fora.',
        instrucao:
          'Como se estivesse segurando o xixi: aperta, segura 10 segundos, solta. Pode fazer no meio do e-mail. 💼',
        narracao:
          'Sente-se bem na cadeira, com a coluna apoiada no encosto e os dois pés no chão. Ninguém à sua volta vai perceber. Ache o músculo: imagine que está segurando o xixi e puxando para dentro e para cima. A barriga e os glúteos ficam relaxados. Inspire… e ao soltar o ar, contraia firme, como se estivesse segurando bem o xixi. Segure… um… dois… três… quatro… cinco… seis… sete… oito… nove… dez. Agora solte devagar e relaxe completamente. Respire normal. Você sente uma leve elevação interna quando contrai, e o alívio quando solta. Ninguém percebeu, e você acabou de fazer um exercício completo sentada. Que orgulho de você.',
        timer: 10,
        timerLabel: 'Segurar 10s',
      },
      {
        nome: 'Contração ao sentar e levantar',
        posicao: 'Cada vez que for sentar ou levantar da cadeira.',
        foco: 'O assoalho pélvico, ativado no exato momento do movimento.',
        instrucao:
          'Vai levantar pra pegar um café? Contraia enquanto sobe. Vai sentar? Contraia enquanto desce. Aproveite o movimento. ☕',
        narracao:
          'Essa você faz o dia todo, aproveitando um movimento que já existe. Antes de levantar da cadeira, inspire. Ao começar a subir, solte o ar e contraia o assoalho pélvico, imaginando puxar para dentro e para cima, e mantenha firme até estar totalmente em pé. Para sentar, contraia de novo enquanto desce devagar, sem se jogar na cadeira, controlando o corpo até encostar. Vamos treinar uma vez: prepara… inspira… e levanta contraindo. Sentiu o músculo trabalhando junto com o movimento? É assim que ele protege você toda vez. Agora é só virar hábito: cada vez que senta ou levanta, um mini treino invisível.',
        timer: null,
        timerLabel: null,
      },
      {
        nome: 'Respiração pélvica em reunião',
        posicao: 'Sentada, ereta, ombros relaxados. Serve até em videochamada.',
        foco: 'Respiração calma que solta a tensão do assoalho. Ninguém percebe.',
        instrucao:
          'No meio da reunião, respire fundo e solte o assoalho ao expirar. Acalma o corpo e a vontade de banheiro. 🌸',
        narracao:
          'Você está sentada, ereta, ombros relaxados. Serve até em videochamada com a câmera ligada, ninguém nota. Aqui não vamos contrair, vamos soltar. Inspire devagar pelo nariz, contando até quatro, deixando a barriga expandir… um… dois… três… quatro. Segure um instante. E solte pela boca bem lento, contando até seis, relaxando o assoalho pélvico junto… um… dois… três… quatro… cinco… seis. A cada vez que você solta o ar, aquela vontade urgente de ir ao banheiro perde a força. Você deve sentir o corpo mais calmo e no controle. Continue respirando assim, presente na reunião e cuidando de você ao mesmo tempo.',
        timer: 30,
        timerLabel: 'Respirar 30s',
      },
    ],
  },

  {
    id: 'casa',
    momento: 'Arrumando a casa, em movimento',
    emoji: '🧺',
    exercicios: [
      {
        nome: 'Contração ao se abaixar',
        posicao: 'De pé, sempre que precisar pegar algo no chão.',
        foco: 'Contraia o assoalho ANTES de abaixar e mantenha durante o movimento.',
        instrucao:
          'Antes de abaixar pra pegar algo, aperta lá dentro. Isso protege sua bexiga do esforço. 🧺',
        narracao:
          'Toda vez que você se abaixa, a pressão da barriga empurra a bexiga para baixo. Então vamos proteger antes. Fique em pé, de frente para o que vai pegar. Antes de descer, inspire e contraia o assoalho pélvico, aquele de segurar o xixi, puxando para dentro e para cima. Mantendo o músculo firme, dobre os joelhos e abaixe com a coluna reta, sem curvar as costas de qualquer jeito. Pegue o que precisa e suba, ainda contraindo. Só quando estiver em pé de novo, solte devagar. Você vai sentir que segurou a pressão, sem aquele peso lá embaixo. É assim, sempre que se abaixar. Seu corpo agradece cada vez.',
        timer: null,
        timerLabel: null,
      },
      {
        nome: 'A cada degrau da escada',
        posicao: 'Subindo escada, uma contração por degrau.',
        foco: 'Um aperto rápido do assoalho a cada passo que sobe.',
        instrucao:
          'Subiu um degrau, contraiu. Outro degrau, outra contração. Vira um treino no automático. 🪜',
        narracao:
          'Você vai subir a escada, e cada degrau vira um treino invisível. Fique com a coluna reta e a respiração solta. Antes de subir, ache o músculo: segurar o xixi, puxar para dentro e para cima. Agora, a cada degrau que você pisa, dê uma contração rápida e firme. Sobe um degrau… e contrai. Outro degrau… contrai. Mais um… aperta. No ritmo natural dos seus passos, sem prender o ar. Você vai sentir o músculo respondendo junto com o movimento das pernas. Quando chegar no topo, relaxa e respira fundo. Pronto, você transformou uma escada comum num exercício, e ninguém desconfiou.',
        timer: null,
        timerLabel: null,
      },
      {
        nome: 'Contração ao carregar peso',
        posicao: 'Ao levantar sacola de compras, caixa ou cesto de roupa.',
        foco: 'Contraia o assoalho antes de pegar o peso e segure enquanto carrega.',
        instrucao:
          'Antes de levantar a sacola, aperta lá dentro. Segura firme enquanto carrega. Protege tudo por dentro. 🛍️',
        narracao:
          'Carregar peso aumenta a pressão sobre a bexiga, então vamos fazer do jeito certo pra proteger. De pé, perto da sacola ou da caixa. Antes de levantar o peso, inspire e contraia o assoalho pélvico com firmeza, puxando para dentro e para cima. Dobre os joelhos, mantenha a coluna reta e levante usando as pernas, sem prender a respiração e sem soltar a contração. Continue com o músculo firme enquanto carrega. Só quando pousar o peso é que você relaxa devagar. Você vai sentir a base bem sustentada, sem aquela sensação de pressão para baixo. Assim você fortalece e protege ao mesmo tempo. Muito bem.',
        timer: null,
        timerLabel: null,
      },
    ],
  },

  {
    id: 'fila',
    momento: 'Em pé na fila, esperando',
    emoji: '🕐',
    exercicios: [
      {
        nome: 'Kegel em pé discreto',
        posicao: 'Em pé, parada na fila, peso nos dois pés.',
        foco: 'Contrações rápidas do músculo de segurar o xixi. Invisível por fora.',
        instrucao:
          '10 apertinhos rápidos enquanto espera. Ninguém na fila vai desconfiar de nada. 🕐',
        narracao:
          'Você está parada na fila, em pé, com o peso igual nos dois pés e a coluna reta. Ninguém vai ver nada. Ache o músculo: imagine segurar o xixi e puxar para dentro e para cima, sem apertar a barriga ou os glúteos. Mantenha a respiração solta. Vamos fazer dez contrações firmes e rápidas, cerca de um segundo cada. Prepara. Contrai e solta… um. Contrai e solta… dois. Três. Quatro. Cinco, metade do caminho, muito bem. Seis. Sete. Oito. Nove. E dez. Agora relaxe completamente e respire. Você vai sentir o músculo mais desperto. A fila nem andou, e você já treinou.',
        timer: 25,
        timerLabel: '10 contrações',
      },
      {
        nome: 'Peso de um pé pro outro',
        posicao: 'Em pé, transferindo o peso de uma perna para a outra.',
        foco: 'Contraia o assoalho a cada vez que troca o apoio de pé.',
        instrucao:
          'Passe o peso pra um pé e contraia. Passe pro outro e contraia. Parece que você só está esperando. 🦶',
        narracao:
          'Essa é bem disfarçada, parece que você só está cansada de esperar. Em pé, comece transferindo o peso do corpo para o pé direito e, ao fazer isso, contraia o assoalho pélvico, puxando para dentro e para cima. Segura um instante. Agora passe o peso para o pé esquerdo e contraia de novo. Volta para o direito… contrai. Esquerdo… contrai. Respire normalmente durante todo o movimento, sem prender o ar. Você vai sentir o músculo ativando a cada troca de apoio. Por fora é só um balanço leve; por dentro, é treino de verdade. Continue no seu tempo, tranquila.',
        timer: null,
        timerLabel: null,
      },
      {
        nome: 'Contração progressiva na espera',
        posicao: 'Em pé, parada, respirando tranquila.',
        foco: 'Aumente a força da contração aos poucos, até o máximo, e desça.',
        instrucao:
          'Vá apertando cada vez mais forte enquanto espera, segure no topo e solte devagar. 💜',
        narracao:
          'Em pé, parada, respirando com calma, coluna reta. Vamos treinar o controle da força enquanto você espera. Ache o músculo: segurar o xixi, para dentro e para cima. Inspire… e ao soltar o ar, comece bem leve, só um toque… aumente um pouco… mais firme… mais forte ainda… e agora o máximo que você aguenta. Segure no topo… um… dois… três. E desça devagarinho, soltando aos poucos, com controle, até relaxar por completo. Respire. Você vai sentir cada nível de força, do mais leve ao mais forte, e é esse controle que fortalece de verdade. Muito bem, ninguém percebeu nada.',
        timer: 8,
        timerLabel: 'Segurar 8s',
      },
    ],
  },

  {
    id: 'dormir',
    momento: 'Deitada, antes de dormir',
    emoji: '🌙',
    bonus: true,
    exercicios: [
      {
        nome: 'Sequência relaxante de 2 minutos',
        posicao: 'Deitada de costas, joelhos dobrados, pés apoiados na cama.',
        foco: 'Contrações suaves e longas, alternadas com relaxamento total.',
        instrucao:
          'Um mini ritual pra fechar o dia. Contrai suave, segura, solta. Termina relaxada e pronta pra dormir. 🌙',
        narracao:
          'Agora você tem dois minutinhos só seus. Deite de costas, dobre os joelhos e apoie os pés na cama, um pouco afastados. Deixe os braços soltos ao lado do corpo e feche os olhos. Respire fundo pelo nariz… e solte pela boca, entregando o peso do dia. Vamos alternar contrair e relaxar, bem suave. Inspire… e ao soltar o ar, contraia o assoalho pélvico com delicadeza, puxando para dentro e para cima. Segure… um… dois… três… quatro. E solte devagar, relaxando tudo, por quatro segundos… um… dois… três… quatro. Sinta a diferença entre a contração gentil e o relaxamento completo. Você está indo tão bem. Vamos de novo, sem nenhum esforço: inspira… contrai suave ao expirar… segura… e solta. Mais uma vez, no seu tempo. Agora deixe o corpo pesado, afundando na cama, e só respire. Seu dia foi cuidado. Você merece esse descanso. Durma tranquila.',
        timer: 120,
        timerLabel: 'Sequência 2 min',
      },
      {
        nome: 'Respiração e relaxamento pélvico',
        posicao: 'Deitada, corpo pesado, sem contrair nada.',
        foco: 'Apenas soltar. Deixe o assoalho amolecer a cada expiração.',
        instrucao:
          'Sem apertar nada. Só respire fundo e deixe tudo amolecer. Ajuda a bexiga a descansar durante a noite. 😴',
        narracao:
          'Essa é só pra relaxar e preparar o corpo pro sono. Nada de contrair aqui. Deite confortável, de costas ou de lado, e deixe o corpo bem pesado sobre a cama. Solte os ombros, a mandíbula, a barriga. Agora inspire fundo pelo nariz, sem pressa, sentindo o ar encher a barriga… e solte lentamente pela boca. A cada vez que você solta o ar, deixe o assoalho pélvico amolecer, soltar, descansar, como se ele estivesse derretendo. Inspira de novo… e solta, afundando mais na cama. Você vai sentir uma leveza e um calorzinho na região, sinal de que está relaxando de verdade. Seus músculos trabalharam bem hoje; agora é a hora deles descansarem com você. Continue respirando assim, cada vez mais lento, até o sono chegar naturalmente. Boa noite, você cuidou muito bem de você hoje.',
        timer: 60,
        timerLabel: 'Relaxar 1 min',
      },
    ],
  },
]
