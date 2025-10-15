import { createLocaleHomePage } from '@/lib/locale-page-factory';
import { LocaleAwareLayout } from '@/components/locale-aware-layout';

const pageFactory = createLocaleHomePage();

export const generateMetadata = pageFactory.generateMetadata;

export default function DefaultHomePage(props: any) {
  const HomePage = pageFactory.default;
  return (
    <LocaleAwareLayout>
      <HomePage {...props} />
    </LocaleAwareLayout>
  );
}
