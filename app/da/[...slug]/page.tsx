import { createLocaleContentPage } from '@/lib/locale-page-factory';

const {
  default: DanishContentPage,
  generateMetadata,
  generateStaticParams
} = createLocaleContentPage('da');

export { generateMetadata, generateStaticParams };
export default DanishContentPage;
