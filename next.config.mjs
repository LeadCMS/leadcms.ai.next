import createMDX from "@next/mdx"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

/** @type {import('next').NextConfig} */
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NODE_ENV !== "production"

const nextConfig = {  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // When running in development we avoid enabling `output: "export"` because
  // it forces Next.js to require every dynamic param to be listed in
  // `generateStaticParams()` (which causes runtime errors when you add files
  // to `.leadcms/content` while the dev server is running). Keep static
  // export enabled only for production builds.
  output: isDevMode ? undefined : "export",
  trailingSlash: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
