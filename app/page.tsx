import { createLocaleHomePage } from '@/lib/locale-page-factory';
import { DEFAULT_LANGUAGE } from '@/lib/cms';

const { generateMetadata, default: HomePage } = createLocaleHomePage(DEFAULT_LANGUAGE);

export { generateMetadata };
export default HomePage;
