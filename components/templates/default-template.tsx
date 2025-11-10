import { MDXRemote } from "next-mdx-remote-client/rsc"
import { useMDXComponents } from "@/components/mdx-components"
import { TemplateProps } from "./index"

/**
 * Default template for home and other content types
 * Renders full-width MDX content with proper prose styling
 */
export default function DefaultTemplate({ content, userUid }: TemplateProps) {
  const components = useMDXComponents({ userUid })

  return <MDXRemote source={content.body} components={components} />
}
