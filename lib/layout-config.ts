import { readFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_LANGUAGE } from './locale-utils';

const contentDir = join(process.cwd(), '.leadcms', 'content');

export interface HeaderConfig {
  headerData: {
    logo: {
      src: string
      alt: string
      text: string
      href: string
    }
    navigation: Array<{
      label: string
      href: string
    }>
    externalLinks: Array<{
      label: string
      href: string
      icon?: string
      external: boolean
    }>
    cta: {
      label: string
      href: string
    }
  }
}

export interface FooterConfig {
  footerData: {
    logo: {
      src: string
      alt: string
    }
    copyright: {
      text: string
      showYear: boolean
    }
    navigation: Array<{
      label: string
      href: string
    }>
    externalLinks: Array<{
      label: string
      href: string
      external: boolean
    }>
    languages?: Array<{
      code: string
      name: string
      flag: string
      displayName?: string
    }>
  }
}

export interface LayoutConfig {
  header: HeaderConfig
  footer: FooterConfig
}

/**
 * Load layout configuration for a specific locale at build time
 */
export function getLayoutConfig(locale: string = DEFAULT_LANGUAGE): LayoutConfig {
  try {
    // For non-default locales, read from the locale-specific directory
    const localeDir = locale === DEFAULT_LANGUAGE ? contentDir : join(contentDir, locale);

    // Read header and footer configurations
    const headerData = readFileSync(join(localeDir, 'header.json'), 'utf8');
    const footerData = readFileSync(join(localeDir, 'footer.json'), 'utf8');

    const headerConfig = JSON.parse(headerData);
    const footerConfig = JSON.parse(footerData);

    return {
      header: headerConfig,
      footer: footerConfig,
    };
  } catch (error) {
    console.error('Error loading layout config for locale:', locale, error);

    // Try to fallback to default locale if current locale fails
    if (locale !== DEFAULT_LANGUAGE) {
      console.log('Falling back to default locale configuration');
      return getLayoutConfig(DEFAULT_LANGUAGE);
    }

    // Return fallback configuration if even default fails
    return {
      header: {
        headerData: {
          logo: {
            src: "/images/icon-192x192.png",
            alt: "LeadCMS Logo",
            text: "LeadCMS",
            href: "/"
          },
          navigation: [
            { label: "Features", href: "/#features" },
            { label: "Why LeadCMS", href: "/#why" },
            { label: "Compare", href: "/#compare" },
            { label: "Contact Us", href: "/contact-us" }
          ],
          externalLinks: [
            { label: "GitHub", href: "https://github.com/LeadCMS", icon: "github", external: true }
          ],
          cta: { label: "Get Started", href: "#contact" }
        }
      },
      footer: {
        footerData: {
          logo: {
            src: "/images/icon-192x192.png",
            alt: "LeadCMS Logo"
          },
          copyright: {
            text: "© {year} LeadCMS. All rights reserved.",
            showYear: true
          },
          navigation: [
            { label: "Terms", href: "/legal/terms" },
            { label: "Privacy", href: "/legal/privacy" }
          ],
          externalLinks: [
            { label: "Docs", href: "https://github.com/LeadCMS/leadcms.core", external: true },
            { label: "GitHub", href: "https://github.com/LeadCMS", external: true }
          ]
        }
      }
    };
  }
}
