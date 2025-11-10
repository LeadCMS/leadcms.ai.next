import { type MetadataRoute } from "next";
import metadataJson from "@/.leadcms/content/metadata.json";
import { getAllContentSlugsForLocale, getAvailableLanguages } from "@leadcms/sdk";
import { pagesContentTypes } from "@/lib/locale-page-factory";
import { DEFAULT_LANGUAGE } from "@/lib/locale-utils";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const homePageName = "home";
const baseUrl = metadataJson.siteMetadata.baseUrl;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = generateStaticParamsForAllLocales(pagesContentTypes);

  const defaultLanguagePages = slugs
    .filter((x) => !x.locale)
    .reduce((result, x) => [...result, x.slug.join("/")], [] as string[])
    .filter((x) => x !== homePageName);

  const localeSlugs: Record<string, Set<string>> = {};
  slugs
    .filter(
      (
        x
      ): x is {
        locale: string;
        slug: string[];
      } => !!x.locale
    )
    .forEach((x) => {
      const slugString = x.slug.join("/");

      if (localeSlugs[x.locale]) {
        localeSlugs[x.locale].add(slugString);
      } else {
        localeSlugs[x.locale] = new Set([slugString]);
      }
    });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: getAlternates(homePageName, localeSlugs),
    },
    ...defaultLanguagePages.map<ArrayElement<MetadataRoute.Sitemap>>((slug) => ({
      url: new URL(slug, baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: getAlternates(slug, localeSlugs),
    })),
  ];
}

function getAlternates(
  slug: string,
  localeSlugs: Record<string, Set<string>>
): ArrayElement<MetadataRoute.Sitemap>["alternates"] {
  const languages = Object.keys(localeSlugs).reduce<Record<string, string> | undefined>(
    (result, x) => {
      if (!localeSlugs[x] || !localeSlugs[x].has(slug)) {
        return result;
      }

      return {
        ...result,
        [x]: new URL(slug === homePageName ? x : `${x}/${slug}`, baseUrl).toString(),
      };
    },
    undefined
  );

  return languages ? { languages } : undefined;
}

/**
 * Generate static params for all locales and content
 */
export function generateStaticParamsForAllLocales(
  contentTypes?: readonly string[],
  draftUserUid?: string | null
): { locale?: string; slug: string[] }[] {
  const languages = getAvailableLanguages();
  const allParams: { locale?: string; slug: string[] }[] = [];

  for (const locale of languages) {
    const slugs = getAllContentSlugsForLocale(locale, contentTypes as string[], draftUserUid as any);

    for (const slug of slugs) {
      if (locale === DEFAULT_LANGUAGE) {
        // Default language doesn't need locale prefix
        allParams.push({ slug: slug.split("/") });
      } else {
        // Non-default languages get locale prefix
        allParams.push({ locale, slug: slug.split("/") });
      }
    }
  }

  return allParams;
}
