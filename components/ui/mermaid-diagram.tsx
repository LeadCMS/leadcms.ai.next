'use client'

import { useEffect, useRef } from 'react'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#60a5fa',
            lineColor: '#9ca3af',
            secondaryColor: '#e5e7eb',
            tertiaryColor: '#f3f4f6',
            fontSize: '14px',
          },
        })

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, chart)

        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Failed to render Mermaid diagram:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 border border-red-300 bg-red-50 rounded-lg text-red-700">
              <p class="font-semibold">Failed to render diagram</p>
              <pre class="mt-2 text-xs overflow-x-auto">${chart}</pre>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div
      ref={containerRef}
      className={`my-8 flex justify-center items-center ${className}`}
    />
  )
}
