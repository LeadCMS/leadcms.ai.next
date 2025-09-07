import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';
import {
  getAllContentSlugsForLocale,
  getCMSContentBySlugForLocale,
  DEFAULT_LANGUAGE,
} from '@/lib/cms';
import { getTemplate } from '@/components/templates';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';

const CMS_CONTENT_PATH = path.resolve('.leadcms/content');

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Factory function to create a locale-specific home page component
 */
export function createLocaleHomePage(locale: string) {
  async function generateMetadata(): Promise<Metadata> {
    const content = getCMSContentBySlugForLocale('home', CMS_CONTENT_PATH, locale);
    if (!content) {
      // Try fallback to default language
      const fallbackContent = getCMSContentBySlugForLocale('home', CMS_CONTENT_PATH, DEFAULT_LANGUAGE);
      if (!fallbackContent) {
        return {
          title: 'Page Not Found',
        };
      }

      return {
        title: fallbackContent.title,
        description: fallbackContent.description,
        openGraph: {
          title: fallbackContent.title,
          description: fallbackContent.description,
        },
      };
    }

    return {
      title: content.title,
      description: content.description,
      openGraph: {
        title: content.title,
        description: content.description,
      },
    };
  }

  async function LocaleHomePage() {
    const content = getCMSContentBySlugForLocale('home', CMS_CONTENT_PATH, locale);

    if (!content) {
      // Try to fallback to default language content
      const fallbackContent = getCMSContentBySlugForLocale('home', CMS_CONTENT_PATH, DEFAULT_LANGUAGE);
      if (!fallbackContent) {
        notFound();
      }

      const TemplateComponent = getTemplate(fallbackContent.type);
      if (!TemplateComponent) {
        throw new Error(`No template found for content type: ${fallbackContent.type}`);
      }

      return <TemplateComponent content={fallbackContent} />;
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
export function createLocaleContentPage(locale: string) {
  async function LocaleContentPage({ params }: PageProps) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug?.join('/') || '';

    const content = getCMSContentBySlugForLocale(slug, CMS_CONTENT_PATH, locale);
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
    const content = getCMSContentBySlugForLocale(slug, CMS_CONTENT_PATH, locale);
    if (!content) notFound();
    return {
      title: content.title,
      description: content.description,
    };
  }

  async function generateStaticParams() {
    const slugs: string[] = getAllContentSlugsForLocale(CMS_CONTENT_PATH, locale, [
      'legal',
      'contact',
      'not-found',
      'home',
      'doc',
    ]);
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
export function createLocaleNotFoundPage(locale: string) {
  function LocaleNotFoundPage() {
    // Load not-found content for the specific locale
    const content = getCMSContentBySlugForLocale('not-found', CMS_CONTENT_PATH, locale);

    const notFoundContent = () => {
      if (!content) {
        // Fallback if not-found.mdx doesn't exist for this locale
        return (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
          </div>
        );
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
        <LocaleAwareLayout locale={locale}>
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
