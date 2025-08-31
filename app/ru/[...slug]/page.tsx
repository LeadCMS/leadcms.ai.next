import { createLocaleContentPage } from '@/lib/locale-page-factory';

const {
  default: RussianContentPage,
  generateMetadata,
  generateStaticParams
} = createLocaleContentPage('ru');

export { generateMetadata, generateStaticParams };
export default RussianContentPage;
