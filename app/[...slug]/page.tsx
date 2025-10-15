import { createLocaleContentPage } from '@/lib/locale-page-factory';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';

const pageFactory = createLocaleContentPage();

export const generateMetadata = pageFactory.generateMetadata;
export const generateStaticParams = pageFactory.generateStaticParams;

export default function DefaultContentPage(props: any) {
  const ContentPage = pageFactory.default;
  return (
    <LocaleAwareLayout>
      <ContentPage {...props} />
    </LocaleAwareLayout>
  );
}
