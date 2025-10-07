import { type MetadataRoute } from "next";
import metadataJson from "@/.leadcms/content/metadata.json";
import { generateStaticParamsForAllLocales } from "@/lib/cms";
import path from "path";
import { pagesContentTypes } from "@/lib/locale-page-factory";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const CMS_CONTENT_PATH = path.resolve(".leadcms/content");
const homePageName = "home";
const baseUrl = metadataJson.siteMetadata.baseUrl;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = generateStaticParamsForAllLocales(CMS_CONTENT_PATH, pagesContentTypes);

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
      changeFrequency: "weekly" as const,
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
