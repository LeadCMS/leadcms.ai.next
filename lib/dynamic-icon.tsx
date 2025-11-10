import { type IconName, getIcon } from './icon-registry'
import { type LucideProps } from 'lucide-react'

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string
}

/**
 * Dynamic icon component that renders Lucide icons by string name
 * Only imports icons that are actually used in MDX files
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = getIcon(name as IconName)

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`)
    return null
  }

  return <IconComponent {...props} />
}

// Convenience function for checking if an icon exists
export function isValidIcon(name: string): name is IconName {
  try {
    const icon = getIcon(name as IconName)
    return !!icon
  } catch {
    return false
  }
}

export type { IconName }
