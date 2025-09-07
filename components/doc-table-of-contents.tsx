"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface TocItem {
  id: string
  level: number
  text: string
}

interface DocTableOfContentsProps {
  content: string
}

export function DocTableOfContents({ content }: DocTableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from the actual DOM after MDX renders
    const extractHeadingsFromDOM = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const tocItems: TocItem[] = []

      headings.forEach((heading) => {
        if (heading.textContent) {
          const level = parseInt(heading.tagName.charAt(1))
          const text = heading.textContent.trim()
          let id = heading.id

          // If the heading doesn't have an ID, create one
          if (!id) {
            id = text
              .toLowerCase()
              .replace(/[^a-zA-Z0-9\s]/g, "")
              .replace(/\s+/g, "-")
              .trim()
            heading.id = id
          }

          tocItems.push({
            id,
            level,
            text,
          })
        }
      })

      return tocItems
    }

    // Wait for MDX to render, then extract headings
    const timer = setTimeout(() => {
      const tocItems = extractHeadingsFromDOM()
      setToc(tocItems)
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      if (toc.length === 0) return

      const headings = toc.map(item => document.getElementById(item.id)).filter(Boolean)

      // Find the heading that's currently in view
      let currentHeading = null
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && heading.getBoundingClientRect().top <= 120) {
          currentHeading = heading
          break
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [toc])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Scroll to element with offset for the fixed header (64px + some padding)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - 100 // Account for header height + padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update the URL hash without triggering a page reload
      history.pushState(null, "", `#${id}`)
    }
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <nav className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <List className="h-4 w-4" />
            <h3 className="font-semibold text-sm">On this page</h3>
          </div>
        </div>

        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded border-l-2 border-transparent hover:border-muted-foreground/30",
                  activeId === item.id && "text-foreground font-medium border-l-primary",
                  item.level === 1 && "font-medium",
                  item.level === 2 && "ml-2",
                  item.level === 3 && "ml-4",
                  item.level === 4 && "ml-6",
                  item.level === 5 && "ml-8",
                  item.level === 6 && "ml-10"
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
