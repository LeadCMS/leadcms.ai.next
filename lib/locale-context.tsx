'use client'

import React, { createContext, useContext } from 'react'
import { DEFAULT_LANGUAGE } from '@/lib/locale-utils'

const LocaleContext = createContext<string>(DEFAULT_LANGUAGE)

export interface LocaleProviderProps {
  locale: string
  children: React.ReactNode
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): string {
  return useContext(LocaleContext)
}
