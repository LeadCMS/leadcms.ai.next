import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllContentSlugsForLocale,
  getCMSContentBySlugForLocale,
} from "@leadcms/sdk";
import { getTemplate } from '@/components/templates';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';
import { DEFAULT_LANGUAGE } from './locale-utils';

export const pagesContentTypes = [
  'legal',
  'contact',
  'home',
  'doc',
  'blog-article',
  'blog-index',
] as const;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Factory function to create a locale-specific home page component
 */
export function createLocaleHomePage(locale?: string) {
  async function generateMetadata(): Promise<Metadata> {
    const content = getCMSContentBySlugForLocale('home', locale);
    if (!content) {
      throw new Error(`Home page content not found for locale: ${locale}. Build failed.`);
    }

    return {
      description: content.description,
      openGraph: {
        title: content.title,
        description: content.description,
      },
    };
  }

  async function LocaleHomePage() {
    const content = getCMSContentBySlugForLocale('home', locale);

    if (!content) {
      throw new Error(`Home page content not found for locale: ${locale}. Build failed.`);
    }

    const TemplateComponent = getTemplate(content.type);
    if (!TemplateComponent) {
      throw new Error(`No template found for content type: ${content.type}`);
    }

    return <TemplateComponent content={content} />;
  }

  return {
    generateMetadata,
    default: LocaleHomePage,
  };
}

/**
 * Factory function to create a locale-specific dynamic content page component
 */
export function createLocaleContentPage(locale?: string) {
  async function LocaleContentPage({ params }: PageProps) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug?.join('/') || '';

    const content = getCMSContentBySlugForLocale(slug, locale);
    if (!content) notFound();

    const TemplateComponent = getTemplate(content.type);
    if (!TemplateComponent) {
      throw new Error(`No template found for content type: ${content.type}`);
    }
    return <TemplateComponent content={content} />;
  }

  async function generateMetadata({ params }: PageProps) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug?.join('/') || '';
    const content = getCMSContentBySlugForLocale(slug, locale);
    if (!content) notFound();
    return {
      title: content.title,
      description: content.description,
    };
  }

  async function generateStaticParams() {
    const slugs: string[] = getAllContentSlugsForLocale(locale, [...pagesContentTypes, 'not-found']);
    console.log(`Generating static params for ${locale === DEFAULT_LANGUAGE ? 'default language' : locale} slugs:`, slugs);
    return slugs.map((slug: string) => ({ slug: slug.split('/') }));
  }

  return {
    default: LocaleContentPage,
    generateMetadata,
    generateStaticParams,
  };
}

/**
 * Factory function to create a locale-specific not-found page component
 */
export function createLocaleNotFoundPage(locale?: string) {
  function LocaleNotFoundPage() {
    // Load not-found content for the specific locale
    const content = getCMSContentBySlugForLocale('not-found', locale);

    const notFoundContent = () => {
      if (!content) {
        throw new Error(`Not-found page content not found for locale: ${locale}. Build failed.`);
      }

      const TemplateComponent = getTemplate(content.type);
      if (!TemplateComponent) {
        throw new Error(`No template found for content type: ${content.type}`);
      }
      return <TemplateComponent content={content} />;
    };

    // Only wrap with LocaleAwareLayout for the default language
    // Locale-specific not-found pages already get the layout from their locale layout files
    if (locale === DEFAULT_LANGUAGE) {
      return (
        <LocaleAwareLayout>
          {notFoundContent()}
        </LocaleAwareLayout>
      );
    }

    return notFoundContent();
  }

  return {
    default: LocaleNotFoundPage,
  };
}
