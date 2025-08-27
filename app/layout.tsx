// Declare window.__env for TypeScript
declare global {
  interface Window {
    __env?: Record<string, string>
  }
}

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Layout } from "@/components/layout"
import Script from "next/script"

import metadataJson from "@/.leadcms/content/metadata.json"

export const metadata: Metadata = {
  ...metadataJson.siteMetadata,
  metadataBase: new URL(metadataJson.siteMetadata.baseUrl),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="/__env.js" strategy="beforeInteractive" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
