import { Play } from 'lucide-react'

export default function VideoPlayer({ url, titulo }) {
  if (!url) {
    return (
      <div className="w-full aspect-video bg-[#E8E0F8] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#B8A0E0]">
        <Play size={36} className="text-[#B8A0E0]" />
        <p className="text-[#9B8BBB] text-sm text-center px-4">
          Vídeo em breve
        </p>
      </div>
    )
  }

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title={titulo}
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
      <video className="w-full h-full object-cover" controls>
        <source src={url} />
      </video>
    </div>
  )
}
