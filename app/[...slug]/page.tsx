import { createLocaleContentPage } from '@/lib/locale-page-factory';
import { DEFAULT_LANGUAGE } from '@/lib/cms';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';

const pageFactory = createLocaleContentPage(DEFAULT_LANGUAGE);

export const generateMetadata = pageFactory.generateMetadata;
export const generateStaticParams = pageFactory.generateStaticParams;

export default function DefaultContentPage(props: any) {
  const ContentPage = pageFactory.default;
  return (
    <LocaleAwareLayout locale={DEFAULT_LANGUAGE}>
      <ContentPage {...props} />
    </LocaleAwareLayout>
  );
}
