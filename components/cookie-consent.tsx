"use client"

import * as React from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { LocaleAwareLink } from "@/components/locale-aware-link"

const STORAGE_KEY = "cookie-consent"

type ConsentState = "granted" | "denied" | null

export interface CookieBannerConfig {
  cookieBanner: {
    message: string
    policyLinkLabel: string
    policyLinkHref: string
    acceptLabel: string
    declineLabel: string
    gtagid: string
  }
}

interface CookieConsentProps {
  config: CookieBannerConfig
  locale?: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function CookieConsent({ config, locale }: CookieConsentProps) {
  const [consent, setConsent] = React.useState<ConsentState>(null)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "granted" || stored === "denied") {
      setConsent(stored)
    }
    setIsReady(true)
  }, [])

  const gtagid = config.cookieBanner.gtagid
  const shouldLoadGtag = isReady && consent === "granted" && Boolean(gtagid)
  const shouldShowBanner = isReady && consent === null

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "granted")
    }
    setConsent("granted")
  }

  const handleDecline = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "denied")
    }
    setConsent("denied")
  }

  React.useEffect(() => {
    if (!shouldLoadGtag) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer?.push(args)
      })

    window.gtag("js", new Date())
    window.gtag("consent", "update", { analytics_storage: "granted" })
    window.gtag("config", gtagid)
  }, [gtagid, shouldLoadGtag])

  return (
    <>
      {shouldLoadGtag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagid}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'update', { analytics_storage: 'granted' });
gtag('config', '${gtagid}');`}
          </Script>
        </>
      )}

      {shouldShowBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1750px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              {config.cookieBanner.message}{" "}
              <LocaleAwareLink
                href={config.cookieBanner.policyLinkHref}
                locale={locale}
                className="underline underline-offset-4"
              >
                {config.cookieBanner.policyLinkLabel}
              </LocaleAwareLink>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleDecline}>
                {config.cookieBanner.declineLabel}
              </Button>
              <Button onClick={handleAccept}>{config.cookieBanner.acceptLabel}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
