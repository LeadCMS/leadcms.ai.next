import { createLocaleHomePage } from '@/lib/locale-page-factory';

const pageFactory = createLocaleHomePage('da');

export const generateMetadata = pageFactory.generateMetadata;
export default pageFactory.default;
