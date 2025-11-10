import { createLocaleHomePage } from '@/lib/locale-page-factory';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';
import { extractUserUidFromSlug } from '@leadcms/sdk';
import { PageProps } from '@/lib/types';

const pageFactory = createLocaleHomePage();

export const generateMetadata = pageFactory.generateMetadata;

export default async function DefaultHomePage({ params }: PageProps) {
  // For homepage, we might get preview URLs with userUid in slug
  let userUid: string | null = null;

  if (params) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug?.join('/') || 'home';
    userUid = extractUserUidFromSlug(slug);
  }

  const HomePage = pageFactory.default;
  return (
    <LocaleAwareLayout userUid={userUid}>
      <HomePage params={params || Promise.resolve({ slug: [] })} />
    </LocaleAwareLayout>
  );
}
