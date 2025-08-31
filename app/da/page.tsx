import { createLocaleHomePage } from '@/lib/locale-page-factory';

const { generateMetadata, default: DanishHomePage } = createLocaleHomePage('da');

export { generateMetadata };
export default DanishHomePage;
