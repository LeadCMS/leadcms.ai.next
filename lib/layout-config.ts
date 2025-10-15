import { getHeaderConfig, getFooterConfig } from '@leadcms/sdk';

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
 * Fails the build if header or footer configuration is not present
 */
export function getLayoutConfig(locale?: string): LayoutConfig {
  const headerConfig = getHeaderConfig(locale) as HeaderConfig;
  const footerConfig = getFooterConfig(locale) as FooterConfig;

  if (!headerConfig) {
    throw new Error(`Header configuration not found for locale: ${locale}. Build failed.`);
  }

  if (!footerConfig) {
    throw new Error(`Footer configuration not found for locale: ${locale}. Build failed.`);
  }

  return {
    header: headerConfig,
    footer: footerConfig,
  };
}
