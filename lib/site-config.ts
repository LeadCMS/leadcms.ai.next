export const siteConfig = {
  title: "LeadCMS",
  siteUrl: "https://leadcms.ai",
  description: "LeadCMS - Content Management System",
  author: "LeadCMS Team",

  // PWA Configuration
  manifest: {
    name: "LeadCMS",
    short_name: "LeadCMS",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B0B0D",
    icons: [
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // Analytics
  googleAnalyticsId: process.env.GATSBY_GA_TRACKING_ID,

  // Blog configuration
  blog: {
    postsPerPage: 15,
  },
} as const
