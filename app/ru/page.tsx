import { createLocaleHomePage } from '@/lib/locale-page-factory';

const { generateMetadata, default: RussianHomePage } = createLocaleHomePage('ru');

export { generateMetadata };
export default RussianHomePage;
