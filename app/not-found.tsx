import { createLocaleNotFoundPage } from '@/lib/locale-page-factory';
import { DEFAULT_LANGUAGE } from '@/lib/cms';

const { default: NotFound } = createLocaleNotFoundPage(DEFAULT_LANGUAGE);

export default NotFound;
