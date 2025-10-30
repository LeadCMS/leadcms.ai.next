/**
 * Extracts plain text content from React children, stripping away MDX-generated wrapper elements.
 * This is useful when you want to render text directly without MDX prose processing.
 *
 * @param node - React children to extract text from
 * @returns Plain text string
 */
export function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return getTextContent((node as any).props.children)
  }
  return ''
}
