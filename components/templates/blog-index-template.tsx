import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@leadcms/sdk"
import { useMDXComponents } from "@/components/mdx-components"

export default function BlogIndexTemplate({ content, userUid }: CMSContentTemplateProps & { userUid?: string | null }) {
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {},
  }

  const components = useMDXComponents({ userUid })

  return (
    <main className="flex-1">
      <div className="w-full">
        {/* All content is now controlled via MDX */}
        {content.body && content.body.trim().length > 0 && (
          <div className="w-full">
            <MDXRemote source={content.body} options={options} components={components} />
          </div>
        )}
      </div>
    </main>
  )
}
