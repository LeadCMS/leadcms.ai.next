'use client'

import React, { createContext, useContext } from 'react'
import { DEFAULT_LANGUAGE } from './locale-utils'

// Get default language from environment variable (safe for client)

const LocaleContext = createContext<string>(DEFAULT_LANGUAGE)

export interface LocaleProviderProps {
  locale?: string
  children: React.ReactNode
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return (
    <LocaleContext.Provider value={locale || DEFAULT_LANGUAGE}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): string {
  return useContext(LocaleContext)
}
