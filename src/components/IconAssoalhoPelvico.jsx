/**
 * Ícone personalizado do assoalho pélvico.
 * Representa a bacia feminina vista de frente, de forma abstrata e elegante:
 * - Arco superior: ossos ilíacos (quadril)
 * - Laterais curvas: paredes pélvicas
 * - Arco inferior: assoalho pélvico (a musculatura em "rede")
 * - Linha interna sutil: camada profunda do assoalho pélvico
 * Estilo linha fina, compatível com lucide-react.
 */
export default function IconAssoalhoPelvico({
  size = 24,
  strokeWidth = 1.8,
  className = '',
  style = {},
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-label="Assoalho pélvico"
    >
      {/* Arco ilíaco — parte superior da bacia */}
      <path d="M3 9 C5 4 19 4 21 9" />

      {/* Parede lateral esquerda */}
      <path d="M3 9 C2 13 4 17 8 18" />

      {/* Parede lateral direita */}
      <path d="M21 9 C22 13 20 17 16 18" />

      {/* Assoalho pélvico — arco muscular principal */}
      <path d="M8 18 C9.5 22 14.5 22 16 18" />

      {/* Camada profunda — linha interna sutil */}
      <path
        d="M10 16.5 C11 19 13 19 14 16.5"
        strokeWidth={strokeWidth * 0.65}
        strokeOpacity="0.55"
      />
    </svg>
  )
}
