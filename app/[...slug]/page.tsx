import { createLocaleContentPage } from '@/lib/locale-page-factory';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';
import { extractUserUidFromSlug } from '@leadcms/sdk';
import { PageProps } from '@/lib/types';

const pageFactory = createLocaleContentPage();

export const generateMetadata = pageFactory.generateMetadata;
export const generateStaticParams = pageFactory.generateStaticParams;

export default async function DefaultContentPage({ params }: PageProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug?.join('/') || '';

  // Extract userUid from slug if it's a preview slug
  const userUid = extractUserUidFromSlug(slug);

  const ContentPage = pageFactory.default;
  return (
    <LocaleAwareLayout userUid={userUid}>
      <ContentPage params={Promise.resolve(awaitedParams)} />
    </LocaleAwareLayout>
  );
}
