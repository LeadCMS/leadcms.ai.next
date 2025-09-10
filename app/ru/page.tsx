import { createLocaleHomePage } from '@/lib/locale-page-factory';

const pageFactory = createLocaleHomePage('ru');

export const generateMetadata = pageFactory.generateMetadata;
export default pageFactory.default;
