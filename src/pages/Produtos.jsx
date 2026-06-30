import { useState } from 'react'
import { ShoppingBag, ExternalLink, AlertCircle, Package } from 'lucide-react'
import { produtos, categorias } from '../data/produtos'

function BadgeCategoria({ texto }) {
  const cores = {
    'Exercício pélvico':    { bg: '#EDE7F9', cor: '#6B4EA8' },
    'Acessório de exercício': { bg: '#E8E0F8', cor: '#7B5AA8' },
    'Suplemento':           { bg: '#FFF5E4', cor: '#A07020' },
    'Recuperação':          { bg: '#E8F0F8', cor: '#3A6A9A' },
  }
  const { bg, cor } = cores[texto] ?? { bg: '#EDE7F9', cor: '#6B4EA8' }
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: bg, color: cor }}
    >
      {texto}
    </span>
  )
}

function ImagemProduto({ url, nome }) {
  if (url) {
    return (
      <img
        src={url}
        alt={nome}
        className="w-full h-44 object-cover rounded-xl"
        onError={(e) => { e.target.style.display = 'none' }}
      />
    )
  }
  return (
    <div className="w-full h-44 bg-[#E8E0F8] rounded-xl flex flex-col items-center justify-center gap-2 border border-dashed border-[#B8A0E0]">
      <Package size={32} className="text-[#B8A0E0]" />
      <p className="text-[#9B8BBB] text-xs text-center px-3">Imagem em breve</p>
    </div>
  )
}

function CardProduto({ produto }) {
  const semLink = !produto.linkAfiliado

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
      produto.destaque ? 'border-[#9B7AD6]' : 'border-[#D8CCF0]'
    }`}>
      {/* Badge de destaque */}
      {produto.destaque && (
        <div className="bg-[#9B7AD6] px-4 py-1.5 text-center">
          <p className="text-white text-xs font-semibold tracking-wide uppercase">⭐ Mais recomendado</p>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Imagem */}
        <ImagemProduto url={produto.imagemUrl} nome={produto.nome} />

        {/* Categoria */}
        <BadgeCategoria texto={produto.categoria} />

        {/* Nome e descrição */}
        <div>
          <h3 className="font-titulo text-lg text-[#3D2B6B] font-semibold leading-tight">{produto.nome}</h3>
          <p className="text-[#7B6B9A] text-sm mt-1 leading-relaxed">{produto.descricao}</p>
        </div>

        {/* Botão comprar */}
        {semLink ? (
          <div className="w-full py-3.5 rounded-xl bg-[#F0EEF8] border border-[#D8CCF0] text-center">
            <span className="text-[#9B8BBB] text-sm font-semibold">Link em breve</span>
          </div>
        ) : (
          <a
            href={produto.linkAfiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl bg-[#9B7AD6] text-white font-semibold text-base flex items-center justify-center gap-2 active:bg-[#6B4EA8] transition-colors"
          >
            <ShoppingBag size={18} />
            Comprar
            <ExternalLink size={14} className="opacity-70" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function Produtos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  const produtosFiltrados =
    categoriaAtiva === 'Todos'
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva)

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B]">Produtos recomendados</h1>
        <p className="text-[#7B6B9A] text-base mt-1">
          Seleção de apoios para o seu ritual de bem-estar
        </p>
      </div>

      {/* Aviso de saúde */}
      <div className="bg-[#FFF5E4] rounded-2xl p-4 flex gap-3 border border-[#D4AF7A]">
        <AlertCircle size={18} className="text-[#C68A30] shrink-0 mt-0.5" />
        <p className="text-[#7A5A20] text-sm leading-relaxed">
          Estes produtos são <strong>sugestões de apoio</strong> ao bem-estar. Consulte um profissional de saúde antes de usar suplementos ou acessórios para exercício pélvico, especialmente cones e dispositivos.
        </p>
      </div>

      {/* Filtros por categoria */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              categoriaAtiva === cat
                ? 'bg-[#9B7AD6] text-white shadow-sm'
                : 'bg-white text-[#7B6B9A] border border-[#D8CCF0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grade de produtos */}
      <div className="flex flex-col gap-4">
        {produtosFiltrados.map((produto) => (
          <CardProduto key={produto.id} produto={produto} />
        ))}
      </div>

      {/* Nota de transparência */}
      <div className="bg-[#EDE7F9] rounded-2xl p-4">
        <p className="text-[#7B6B9A] text-xs leading-relaxed text-center">
          🛍️ Alguns links podem ser links de afiliado — ao comprar, você apoia o CollagenFlow sem pagar nada a mais por isso.
          Só recomendamos produtos em que acreditamos.
        </p>
      </div>
    </div>
  )
}
