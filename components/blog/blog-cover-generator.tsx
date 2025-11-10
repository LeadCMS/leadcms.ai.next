import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

interface BlogCoverGeneratorProps {
  title: string
  category?: string
  tags?: string[]
  author?: string
  coverImageUrl?: string
  featured?: boolean
  size?: 'card' | 'hero'
  publishedAt?: string
  readTime?: number
}

// Generate a consistent color scheme based on category string
function getCategoryColorScheme(category: string = 'default') {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Professional color schemes matching site theme
  const colorSchemes = [
    {
      bg: 'from-slate-500 to-slate-600',
      overlay: 'from-slate-600/40 to-slate-700/40',
      badge: 'bg-slate-700 text-slate-50 border-0',
      badgeDark: 'dark:bg-slate-800/90 dark:text-slate-100'
    },
    {
      bg: 'from-blue-500 to-blue-600',
      overlay: 'from-blue-600/40 to-blue-700/40',
      badge: 'bg-blue-600 text-blue-50 border-0',
      badgeDark: 'dark:bg-blue-700/90 dark:text-blue-100'
    },
    {
      bg: 'from-indigo-500 to-indigo-600',
      overlay: 'from-indigo-600/40 to-indigo-700/40',
      badge: 'bg-indigo-600 text-indigo-50 border-0',
      badgeDark: 'dark:bg-indigo-700/90 dark:text-indigo-100'
    },
    {
      bg: 'from-violet-500 to-violet-600',
      overlay: 'from-violet-600/40 to-violet-700/40',
      badge: 'bg-violet-600 text-violet-50 border-0',
      badgeDark: 'dark:bg-violet-700/90 dark:text-violet-100'
    },
    {
      bg: 'from-purple-500 to-purple-600',
      overlay: 'from-purple-600/40 to-purple-700/40',
      badge: 'bg-purple-600 text-purple-50 border-0',
      badgeDark: 'dark:bg-purple-700/90 dark:text-purple-100'
    },
    {
      bg: 'from-emerald-500 to-emerald-600',
      overlay: 'from-emerald-600/40 to-emerald-700/40',
      badge: 'bg-emerald-600 text-emerald-50 border-0',
      badgeDark: 'dark:bg-emerald-700/90 dark:text-emerald-100'
    },
    {
      bg: 'from-teal-500 to-teal-600',
      overlay: 'from-teal-600/40 to-teal-700/40',
      badge: 'bg-teal-600 text-teal-50 border-0',
      badgeDark: 'dark:bg-teal-700/90 dark:text-teal-100'
    },
    {
      bg: 'from-cyan-500 to-cyan-600',
      overlay: 'from-cyan-600/40 to-cyan-700/40',
      badge: 'bg-cyan-600 text-cyan-50 border-0',
      badgeDark: 'dark:bg-cyan-700/90 dark:text-cyan-100'
    },
  ]

  const index = Math.abs(hash) % colorSchemes.length
  return colorSchemes[index]
}

export function BlogCoverGenerator({
  title,
  category,
  tags,
  author,
  coverImageUrl,
  featured,
  size = 'card',
  publishedAt,
  readTime
}: BlogCoverGeneratorProps) {
  const heightClass = size === 'hero' ? 'h-64 md:h-96' : 'h-72 md:h-80'
  const colors = getCategoryColorScheme(category || title)

  const titleSize = size === 'hero' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
  const padding = size === 'hero' ? 'p-6 md:p-8' : 'p-5'

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-t-lg`}>
      {/* Background - either image or gradient */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
      )}

      {/* Overlay - light for images, colored for gradients */}
      {coverImageUrl ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.overlay} backdrop-blur-[2px]`} />
      )}

      {/* Content overlay */}
      <div className={`relative h-full flex flex-col justify-between ${padding} text-white`}>
        {/* Top section with metadata */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-black/60 text-white border-white/50 backdrop-blur-sm font-normal shadow-lg"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {featured && (
            <Badge className="bg-yellow-400 text-yellow-950 border-0 font-semibold whitespace-nowrap shadow-lg">
              Featured
            </Badge>
          )}
        </div>

        {/* Center section with large category text for auto-generated covers */}
        {!coverImageUrl && category && (
          <div className="absolute inset-x-4 inset-y-0 flex items-center justify-center -mt-6">
            <div className="w-full text-center px-4">
              <div className={`
                font-black uppercase tracking-wider text-white/20 select-none pointer-events-none leading-none break-words
                ${category.length > 15 ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' :
                  category.length > 10 ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' :
                  category.length > 6 ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' :
                  'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'}
                ${size === 'hero' ? (
                  category.length > 15 ? 'xl:text-4xl' :
                  category.length > 10 ? 'xl:text-5xl' :
                  category.length > 6 ? 'xl:text-6xl' :
                  'xl:text-7xl'
                ) : ''}
              `}>
                {category}
              </div>
            </div>
          </div>
        )}

        {/* Bottom section with title and metadata */}
        <div className="space-y-3">
          <h3 className={`${titleSize} font-bold line-clamp-3 text-white drop-shadow-lg leading-tight`}>
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
            {category && (
              <Badge className={`${colors.badge} ${colors.badgeDark} font-medium`}>
                {category}
              </Badge>
            )}
            {author && (
              <span className="font-medium">by {author}</span>
            )}
            {publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readTime} min read
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
