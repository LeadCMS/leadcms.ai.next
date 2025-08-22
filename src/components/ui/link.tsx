import type * as React from "react"
import Link from "next/link"

interface LinkProps {
  href: string
  as?: string
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  prefetch?: boolean
  locale?: string | false
  children: React.ReactNode
  className?: string
  [key: string]: any
}

const CustomLink: React.FC<LinkProps> = ({ href, children, className, ...rest }) => {
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

export { CustomLink as Link }
