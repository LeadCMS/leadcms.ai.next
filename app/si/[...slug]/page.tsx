import { createLocaleContentPage } from '@/lib/locale-page-factory';

const pageFactory = createLocaleContentPage('si');

export const generateMetadata = pageFactory.generateMetadata;
export const generateStaticParams = pageFactory.generateStaticParams;
export default pageFactory.default;
