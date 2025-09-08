import { getAllContentSlugsForLocale, getCMSContentBySlugForLocale, DEFAULT_LANGUAGE } from "@/lib/cms"
import path from "path"
import { DocNavigationClient } from "./doc-navigation-client"

interface DocItem {
  slug: string
  title: string
  group: string
  order: number
  description?: string
}

interface DocGroup {
  name: string
  items: DocItem[]
  order: number
}

interface DocNavigationProps {
  currentSlug: string
}

const CMS_CONTENT_PATH = path.resolve('.leadcms/content')

export function getDocsData(): DocGroup[] {
  try {
    const slugs = getAllContentSlugsForLocale(CMS_CONTENT_PATH, DEFAULT_LANGUAGE, ['doc'])
    const docItems: DocItem[] = []

    for (const slug of slugs) {
      try {
        const content = getCMSContentBySlugForLocale(slug, CMS_CONTENT_PATH, DEFAULT_LANGUAGE)
        if (content && content.type === 'doc' && content.group && content.order !== undefined) {
          docItems.push({
            slug,
            title: content.title || slug,
            group: content.group,
            order: content.order,
            description: content.description,
          })
        }
      } catch (error) {
        console.warn(`Warning: Could not load doc content for slug: ${slug}`, error)
      }
    }

    // Group and sort items
    const groups = new Map<string, DocItem[]>()
    const groupOrders = new Map<string, number>()

    docItems.forEach(item => {
      if (!groups.has(item.group)) {
        groups.set(item.group, [])
        // Default group orders
        const defaultOrder =
          item.group === 'Getting Started' ? 1 :
          item.group === 'Plugins' ? 2 :
          item.group === 'Architecture' ? 3 :
          item.group === 'Advanced' ? 5 : 10
        groupOrders.set(item.group, defaultOrder)
      }
      groups.get(item.group)!.push(item)
    })

    // Sort items within each group
    groups.forEach(items => {
      items.sort((a, b) => a.order - b.order)
    })

    // Convert to DocGroup array and sort by group order
    const sortedGroups: DocGroup[] = Array.from(groups.entries())
      .map(([name, items]) => ({
        name,
        items,
        order: groupOrders.get(name) || 10
      }))
      .sort((a, b) => a.order - b.order)

    return sortedGroups
  } catch (error) {
    console.error('Error loading documentation structure:', error)
    return []
  }
}

export function DocNavigation({ currentSlug }: DocNavigationProps) {
  const docGroups = getDocsData()
  return <DocNavigationClient docGroups={docGroups} currentSlug={currentSlug} />
}
