"use client"

import { useState } from "react"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  TwitterIcon as TikTok,
  Video,
  ImageIcon,
  FileText,
  Mic,
  Clock,
  Target,
  Hash,
  ChevronDown,
  ChevronUp,
  Share2,
  MessageSquare,
  Edit,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  CheckCheck,
  Sparkles,
  Users,
  TrendingUp,
  Eye,
  Award,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { parseISO, format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
// Mapeo de iconos para redes sociales (en minúsculas para coincidir con el JSON)
const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: TikTok,
}

// Mapeo de iconos para formatos (en minúsculas para coincidir con el JSON)
const formatIcons = {
  video: Video,
  carrusel: ImageIcon,
  imagen: ImageIcon,
  documento: FileText,
  podcast: Mic,
}

// Mapeo de iconos para ciclos
const typeIcons = {
  valor: Sparkles,
  posicionamiento: Eye,
  venta: CheckCheck,
}

// Mapeo de iconos para objetivos
const objectiveIcons = {
  "Conseguir 10 usuarios": Users,
  "Aumentar visibilidad": Eye,
  "Generar leads": TrendingUp,
  Posicionamiento: Award,
}

// Mapeo de colores para categorías
const categoryColors = {
  Consejo: {
    primary: "#22C55E", // Verde
    secondary: "#DCFCE7",
  },
  Tips: {
    primary: "#3B82F6", // Azul
    secondary: "#DBEAFE",
  },
  Promoción: {
    primary: "#F59E0B", // Naranja
    secondary: "#FEF3C7",
  },
  Evento: {
    primary: "#8B5CF6", // Morado
    secondary: "#EDE9FE",
  },
  Tutorial: {
    primary: "#EC4899", // Rosa
    secondary: "#FCE7F3",
  },
  Noticia: {
    primary: "#EF4444", // Rojo
    secondary: "#FEE2E2",
  },
  Entrevista: {
    primary: "#14B8A6", // Turquesa
    secondary: "#CCFBF1",
  },
  Reseña: {
    primary: "#9333EA", // Púrpura oscuro
    secondary: "#E9D5FF",
  },
  Anuncio: {
    primary: "#F43F5E", // Rojo intenso
    secondary: "#FFE4E6",
  },
  Inspiración: {
    primary: "#0EA5E9", // Azul celeste
    secondary: "#E0F2FE",
  },
  Curiosidad: {
    primary: "#EAB308", // Amarillo
    secondary: "#FEF9C3",
  },
  Opinión: {
    primary: "#4B5563", // Gris oscuro
    secondary: "#E5E7EB",
  },
  Historia: {
    primary: "#B45309", // Marrón
    secondary: "#FDE68A",
  },
  Trivia: {
    primary: "#10B981", // Verde esmeralda
    secondary: "#D1FAE5",
  },
};

// Mapeo de iconos y colores para estados
const statusConfig = {
  Creado: {
    icon: CheckCircle,
    color: "#22C55E",
  },
  "En proceso": {
    icon: Loader,
    color: "#F59E0B",
  },
  Publicado: {
    icon: CheckCheck,
    color: "#3B82F6",
  },
  Cancelado: {
    icon: AlertCircle,
    color: "#EF4444",
  },
}

// Función para formatear fecha y hora



const formatDateTime = (dateTimeString) => {
  try {
    if (!dateTimeString) return dateTimeString;

    const date = parseISO(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;

    const daysDiff = differenceInDays(date, new Date());

    let dateLabel;

    if (isToday(date)) {
      dateLabel = "Hoy";
    } else if (isTomorrow(date)) {
      dateLabel = "Mañana";
    } else if (daysDiff > 0 && daysDiff <= 7) {
      dateLabel = format(date, "EEEE", { locale: es }); // Día de la semana en español
    } else {
      dateLabel = format(date, "dd/MM/yyyy", { locale: es }); // Fecha completa
    }

    const timeLabel = format(date, "hh:mm a", { locale: es }); // Hora en formato 12h

    return `${dateLabel} a las ${timeLabel}`;
  } catch (error) {
    return dateTimeString;
  }
};


export default function ContentCard({ content, setEdit, setShowEventForm }) {
  const [expanded, setExpanded] = useState(false)
  const hanledEdit = () => {
    console.log('editando', content)
    setEdit(content)
    setShowEventForm(true)
  }

  if (!content) return null

  // Obtener el color de la categoría o usar un valor por defecto
  const categoryColor = categoryColors[content.category] || {
    primary: "#64748B",
    secondary: "#F1F5F9",
  }

  // Obtener la configuración de estado o usar un valor por defecto
  const statusInfo = statusConfig[content.status] || {
    icon: Clock,
    color: "#64748B",
  }

  const SocialIcon = content?.socialMedia ? socialIcons[content.socialMedia.toLowerCase()] || Instagram : Instagram;
  const FormatIcon = content?.format ? formatIcons[content.format.toLowerCase()] || ImageIcon : ImageIcon;
  const TypeIcon = content?.type ? typeIcons[content.type.toLowerCase()] || Sparkles : Sparkles;
  const ObjectiveIcon = content?.objective ? objectiveIcons[content.objective] || Target : Target;
  const StatusIcon = statusInfo?.icon || DefaultStatusIcon; // Asegura que statusInfo exista

  // Convertir hashtags en un array
  const hashtagsArray = content.hashtags.split(" ").filter((tag) => tag.trim() !== "")

  // Formatear la hora
  const formattedTime = formatDateTime(content.time)

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-0 bg-white shadow-sm rounded-xl transition-all duration-300 hover:shadow-md">
      {/* Header con título y estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-start gap-3 mb-3 sm:mb-0">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${categoryColor.secondary}` }}>
            <SocialIcon className="w-5 h-5" style={{ color: categoryColor.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge
                className="font-medium px-2 py-0.5"
                style={{
                  backgroundColor: categoryColor.primary,
                  color: "white",
                }}
              >
                {content.category}
              </Badge>
              <Badge variant="outline" className="font-normal px-2 py-0.5 border-slate-200">
                {content.socialMedia}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 truncate">{content.title}</h2>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full self-start sm:self-center"
          style={{ backgroundColor: `${statusInfo.color}15` }}
        >
          <StatusIcon className="w-3.5 h-3.5" style={{ color: statusInfo.color }} />
          <span className="text-sm font-medium" style={{ color: statusInfo.color }}>
            {content.status}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-5">
        {/* Información del contenido en tarjetas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

          <div className="flex flex-col p-3 rounded-xl" style={{ backgroundColor: `${categoryColor.secondary}15` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md" style={{ backgroundColor: `${categoryColor.secondary}` }}>
                <ObjectiveIcon className="w-3.5 h-3.5" style={{ color: categoryColor.primary }} />
              </div>
              <span className="text-sm text-slate-500">Objetivo</span>
            </div>
            <p className="text-sm font-medium text-slate-700 line-clamp-2">{content.objective}</p>
          </div>

          <div className="flex flex-col p-3 rounded-xl" style={{ backgroundColor: `${categoryColor.secondary}15` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md" style={{ backgroundColor: `${categoryColor.secondary}` }}>
                <FormatIcon className="w-3.5 h-3.5" style={{ color: categoryColor.primary }} />
              </div>
              <span className="text-sm text-slate-500">Formato</span>
            </div>
            <p className="text-sm font-medium text-slate-700 capitalize">{content.format}</p>
          </div>

          <div className="flex flex-col p-3 rounded-xl" style={{ backgroundColor: `${categoryColor.secondary}15` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md" style={{ backgroundColor: `${categoryColor.secondary}` }}>
                <TypeIcon className="w-3.5 h-3.5" style={{ color: categoryColor.primary }} />
              </div>
              <span className="text-sm text-slate-500">Tipo</span>
            </div>
            <p className="text-sm font-medium text-slate-700 capitalize">{content.type}</p>
          </div>

          <div className="flex flex-col p-3 rounded-xl" style={{ backgroundColor: `${categoryColor.secondary}15` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md" style={{ backgroundColor: `${categoryColor.secondary}` }}>
                <Clock className="w-3.5 h-3.5" style={{ color: categoryColor.primary }} />
              </div>
              <span className="text-sm text-slate-500">Fecha</span>
            </div>
            <p className="text-xs font-medium text-slate-700">{formattedTime}</p>
          </div>
        </div>

        {/* Vista previa del contenido */}
        <div className="rounded-xl p-4 mb-4 relative" style={{ backgroundColor: `${categoryColor.secondary}10` }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium" style={{ color: categoryColor.primary }}>
              Contenido
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 w-6 p-0 rounded-full bg-primary/10"
              style={{ color: "rgba(100, 116, 139, 0.8)" }}
            >
              {expanded ? <ChevronUp color="#000" className="h-3.5 w-3.5" /> : <ChevronDown color="#000" className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[500px]" : "max-h-16"}`}>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{content.text}</p>
          </div>

          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-8"
              style={{
                background: `linear-gradient(to top, ${categoryColor.secondary}10, transparent)`,
              }}
            ></div>
          )}
        </div>

        {/* Hashtags */}
        {hashtagsArray.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-sm text-slate-500">Hashtags</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hashtagsArray.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="font-normal px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${categoryColor.secondary}30`,
                    color: categoryColor.primary,
                    borderColor: `${categoryColor.secondary}`,
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Footer con acciones */}
      <div className="flex justify-end gap-2 p-4 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-sms font-normal"
          style={{
            backgroundColor: categoryColor.primary,
            color: "white",
          }}
          onClick={hanledEdit}
        >
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Editar
        </Button>
      </div>
    </Card>
  )
}

