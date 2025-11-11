'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockWithCopyProps {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

/**
 * Code block component with copy functionality.
 * Wraps pre/code blocks and adds a copy button.
 */
export function CodeBlockWithCopy({ children, className, ...props }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false)

  const extractTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (!node) return ''

    if (React.isValidElement(node)) {
      const props = node.props as any
      if (props && props.children) {
        return extractTextContent(props.children)
      }
    }

    if (Array.isArray(node)) {
      return node.map(extractTextContent).join('')
    }

    return ''
  }

  const handleCopy = async () => {
    const textContent = extractTextContent(children)

    try {
      await navigator.clipboard.writeText(textContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative group my-8">
      <button
        onClick={handleCopy}
        className={cn(
          'absolute top-2 right-2 z-10 p-2 rounded transition-all',
          'bg-muted/80 hover:bg-muted',
          'text-muted-foreground hover:text-foreground',
          'border border-border/50',
          'opacity-0 group-hover:opacity-100'
        )}
        title={copied ? 'Copied!' : 'Copy code'}
        aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre
        className={cn(
          'rounded-lg bg-black text-green-400 p-6 overflow-x-auto text-sm whitespace-pre-wrap break-words max-w-full',
          '[.tab-content_&]:rounded-none [.tab-content_&]:my-0',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
