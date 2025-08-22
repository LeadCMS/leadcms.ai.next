import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Layout } from "@/components/layout";

export const metadata: Metadata = {
  title: "LeadCMS - The Modern Headless CMS for Developers",
  description:
    "Build faster, deploy anywhere. LeadCMS gives you the power of a headless CMS with the simplicity of traditional content management.",
  generator: "LeadCMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
  );
}
