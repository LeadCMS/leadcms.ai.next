import { createLocaleHomePage } from '@/lib/locale-page-factory';

const pageFactory = createLocaleHomePage('si');

export const generateMetadata = pageFactory.generateMetadata;
export default pageFactory.default;
