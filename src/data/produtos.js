// Produtos recomendados — edite aqui para atualizar nomes, descrições e links de afiliado
// Substitua o campo "linkAfiliado" pela sua URL de afiliado quando tiver
// "imagemUrl" aceita URL externa ou caminho local (ex: '/imagens/produto1.jpg')

export const produtos = [
  {
    id: 'cones-pelvicos',
    nome: 'Kit de Cones Pélvicos',
    categoria: 'Exercício pélvico',
    descricao:
      'Conjunto progressivo com diferentes pesos para fortalecer o assoalho pélvico de forma gradual e segura. Ideal para uso em casa, com orientação profissional.',
    imagemUrl: '', // cole aqui a URL da imagem do produto
    linkAfiliado: '', // cole aqui o link de afiliado
    destaque: true,
  },
  {
    id: 'bola-pilates',
    nome: 'Bola de Pilates 65cm',
    categoria: 'Acessório de exercício',
    descricao:
      'Bola suíça para exercícios de fortalecimento do core, postura e equilíbrio. Complementa os exercícios pélvicos com apoio e estabilidade.',
    imagemUrl: '',
    linkAfiliado: '',
    destaque: false,
  },
  {
    id: 'faixa-resistencia',
    nome: 'Faixa Elástica de Resistência',
    categoria: 'Exercício pélvico',
    descricao:
      'Faixa elástica leve para exercícios de quadril, glúteos e assoalho pélvico. Versátil e fácil de usar em qualquer ambiente.',
    imagemUrl: '',
    linkAfiliado: '',
    destaque: false,
  },
  {
    id: 'colageno-hidrolisado',
    nome: 'Colágeno Hidrolisado em Pó',
    categoria: 'Suplemento',
    descricao:
      'Colágeno tipo I e III, sem sabor, para dissolver em sucos ou água. Fonte de aminoácidos essenciais para os tecidos conjuntivos.',
    imagemUrl: '',
    linkAfiliado: '',
    destaque: false,
  },
  {
    id: 'tapete-yoga',
    nome: 'Tapete de Yoga Antiderrapante',
    categoria: 'Acessório de exercício',
    descricao:
      'Tapete de alta aderência para praticar os exercícios do protocolo com conforto e segurança, em qualquer superfície.',
    imagemUrl: '',
    linkAfiliado: '',
    destaque: false,
  },
  {
    id: 'rolo-massagem',
    nome: 'Rolo de Massagem (Foam Roller)',
    categoria: 'Recuperação',
    descricao:
      'Para relaxamento muscular e melhora da circulação após os exercícios. Excelente para a região lombar e quadril.',
    imagemUrl: '',
    linkAfiliado: '',
    destaque: false,
  },
]

// Categorias disponíveis — usadas para filtragem
export const categorias = ['Todos', 'Exercício pélvico', 'Acessório de exercício', 'Suplemento', 'Recuperação']
