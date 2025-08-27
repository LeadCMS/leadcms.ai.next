import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@/lib/cms"
import { useMDXComponents } from "@/components/mdx-components"

export default function ContactTemplate({ content }: CMSContentTemplateProps) {
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {
      // Add any additional scope variables here
    },
  }

  // Contact pages need components that include contact components
  const components = useMDXComponents({})

  // For static builds, let errors bubble up to fail the build
  // No need for Suspense or error handling since everything is resolved at build time
  return (
    <main className="flex-1">
      <MDXRemote source={content.body} options={options} components={components} />
    </main>
  )
}
