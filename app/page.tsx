import { createLocaleHomePage } from '@/lib/locale-page-factory';
import { DEFAULT_LANGUAGE } from '@/lib/cms';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';

const pageFactory = createLocaleHomePage(DEFAULT_LANGUAGE);

export const generateMetadata = pageFactory.generateMetadata;

export default function DefaultHomePage(props: any) {
  const HomePage = pageFactory.default;
  return (
    <LocaleAwareLayout locale={DEFAULT_LANGUAGE}>
      <HomePage {...props} />
    </LocaleAwareLayout>
  );
}
