'use client'

import { useLocale } from '@/lib/locale-context'
import { getContactFormText } from '@/lib/contact-form-static'
import { ContactUsLocalized } from './contact-us-localized'

export function ContactUs() {
  const locale = useLocale()
  const contactFormText = getContactFormText(locale)

  return <ContactUsLocalized text={contactFormText} />
}
