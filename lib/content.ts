export interface ContentItem {
  slug: string
  title: string
  description?: string
  type: string
  content: string
  frontmatter: Record<string, any>
  publishedAt?: string
  author?: string
  tags?: string[]
  coverImageUrl?: string
  coverImageAlt?: string
}

export function getContentData(): {
  heroData: any
  featuresData: any
  whyData: any
  compareData: any
  contactData: any
  deployData: any
  helpData: any
} {
  return {
    heroData: {
      badge: "Open Source CMS",
      title: "The Modern Headless CMS for Developers",
      description:
        "Build faster, deploy anywhere. LeadCMS gives you the power of a headless CMS with the simplicity of traditional content management.",
      image: "/media/index/leadcms-preview.png",
      primaryButton: { label: "Get Started", href: "#contact" },
      secondaryButton: { label: "View on GitHub", href: "https://github.com/LeadCMS" },
      dashboardLabel: "LeadCMS Dashboard",
    },
    featuresData: {
      title: "Everything you need to build modern websites",
      description:
        "LeadCMS provides all the tools and features you need to create, manage, and deploy content-driven websites and applications.",
      features: [
        {
          icon: "Database" as const,
          title: "Headless Architecture",
          description: "API-first approach that works with any frontend framework",
          bullets: [
            "RESTful API endpoints",
            "GraphQL support",
            "Real-time content updates",
            "Multi-channel publishing",
          ],
        },
        {
          icon: "Globe" as const,
          title: "Developer Experience",
          description: "Built by developers, for developers with modern tooling",
          bullets: [
            "TypeScript support",
            "CLI tools and SDKs",
            "Local development server",
            "Hot reload and live preview",
          ],
        },
        {
          icon: "Zap" as const,
          title: "Performance First",
          description: "Optimized for speed and scalability from day one",
          bullets: [
            "CDN-ready static generation",
            "Image optimization",
            "Caching strategies",
            "Edge deployment support",
          ],
        },
      ],
    },
    whyData: {
      title: "Why Choose LeadCMS?",
      description:
        "LeadCMS combines the best of traditional and headless CMS approaches, giving you flexibility without complexity.",
      reasons: [
        {
          icon: "Code" as const,
          title: "Developer Friendly",
          description: "Built with modern development practices and tools you already know and love.",
        },
        {
          icon: "Server" as const,
          title: "Deploy Anywhere",
          description: "Static generation support means you can deploy to any hosting platform or CDN.",
        },
        {
          icon: "GitBranch" as const,
          title: "Version Control",
          description: "Content versioning and Git-based workflows for better collaboration.",
        },
        {
          icon: "Package" as const,
          title: "Extensible",
          description: "Plugin architecture and custom field types to fit your exact needs.",
        },
        {
          icon: "Lock" as const,
          title: "Secure by Default",
          description: "Built-in security features and best practices to keep your content safe.",
        },
        {
          icon: "Zap" as const,
          title: "Lightning Fast",
          description: "Optimized performance with caching, CDN support, and static generation.",
        },
      ],
    },
    compareData: {
      title: "How LeadCMS Compares",
      description: "See how LeadCMS stacks up against other popular CMS solutions.",
      comparison: {
        features: [
          "Open Source",
          "Headless Architecture",
          "Static Generation",
          "Developer Experience",
          "Performance",
          "Scalability",
        ],
        solutions: [
          {
            name: "LeadCMS",
            features: [true, true, true, true, true, true],
          },
          {
            name: "WordPress",
            features: [true, false, false, false, false, true],
          },
          {
            name: "Contentful",
            features: [false, true, true, true, true, true],
          },
          {
            name: "Strapi",
            features: [true, true, false, true, true, true],
          },
        ],
      },
    },
    contactData: {
      title: "Ready to Get Started?",
      description: "Join thousands of developers who are already building amazing websites with LeadCMS.",
      buttons: [
        { label: "Get Started", href: "#contact-form" },
        { label: "View Documentation", href: "https://github.com/LeadCMS/leadcms.core", icon: "GitBranch" as const },
      ],
    },
    deployData: {
      title: "Deploy Everywhere",
      description: "LeadCMS works with all major hosting platforms and deployment services.",
      platforms: [
        { name: "Vercel", logo: "/logo.svg" },
        { name: "Netlify", logo: "/logo.svg" },
        { name: "AWS", logo: "/logo.svg" },
        { name: "GitHub Pages", logo: "/logo.svg" },
      ],
    },
    helpData: {
      title: "Need Help Getting Started?",
      description: "We're here to help you succeed with LeadCMS.",
      resources: [
        {
          title: "Documentation",
          description: "Comprehensive guides and API reference",
          href: "https://github.com/LeadCMS/leadcms.core",
        },
        {
          title: "Community",
          description: "Join our Discord community for support",
          href: "https://discord.gg/leadcms",
        },
        {
          title: "Examples",
          description: "Starter templates and example projects",
          href: "https://github.com/LeadCMS/examples",
        },
      ],
    },
  }
}

export function getBlogPosts(): ContentItem[] {
  return [
    {
      slug: "remote-mdx-content-in-gatsby",
      title: "Remote MDX Content in Gatsby",
      description: "Learn how to integrate remote MDX content with Gatsby for dynamic, flexible content management.",
      type: "blog-post",
      content: "# Remote MDX Content in Gatsby\n\nThis is a sample blog post about integrating remote MDX content...",
      frontmatter: {
        title: "Remote MDX Content in Gatsby",
        description: "Learn how to integrate remote MDX content with Gatsby for dynamic, flexible content management.",
        type: "blog-post",
        publishedAt: "2025-05-14",
        author: "LeadCMS Team",
        tags: ["gatsby", "mdx", "cms"],
        coverImageUrl: "/media/blog/remote-mdx-content-in-gatsby/img-2025-05-14-18-45-32.png",
        coverImageAlt: "Remote MDX Content Integration",
      },
      publishedAt: "2025-05-14",
      author: "LeadCMS Team",
      tags: ["gatsby", "mdx", "cms"],
      coverImageUrl: "/media/blog/remote-mdx-content-in-gatsby/img-2025-05-14-18-45-32.png",
      coverImageAlt: "Remote MDX Content Integration",
    },
    {
      slug: "test-blog-post",
      title: "Getting Started with LeadCMS",
      description: "A comprehensive guide to setting up and using LeadCMS for your next project.",
      type: "blog-post",
      content: "# Getting Started with LeadCMS\n\nWelcome to LeadCMS! This guide will help you get started...",
      frontmatter: {
        title: "Getting Started with LeadCMS",
        description: "A comprehensive guide to setting up and using LeadCMS for your next project.",
        type: "blog-post",
        publishedAt: "2025-01-15",
        author: "LeadCMS Team",
        tags: ["getting-started", "tutorial", "cms"],
        coverImageUrl: "/media/blog/test-blog-post/leadcms-preview.png",
        coverImageAlt: "LeadCMS Getting Started Guide",
      },
      publishedAt: "2025-01-15",
      author: "LeadCMS Team",
      tags: ["getting-started", "tutorial", "cms"],
      coverImageUrl: "/media/blog/test-blog-post/leadcms-preview.png",
      coverImageAlt: "LeadCMS Getting Started Guide",
    },
  ]
}
