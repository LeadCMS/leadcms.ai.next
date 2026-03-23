const STORAGE_KEY = "leadcms-utm-params"

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const

type UtmKey = (typeof UTM_PARAMS)[number]
type StoredUtms = Record<string, string>

const safeWindow = () => typeof window !== "undefined"

export function parseUtmParams(search: string): Partial<Record<UtmKey, string>> {
  if (!search) return {}

  const params = new URLSearchParams(search)
  const utms: Partial<Record<UtmKey, string>> = {}

  for (const key of UTM_PARAMS) {
    const value = params.get(key)
    if (value && value.trim().length > 0) {
      utms[key] = value.trim()
    }
  }

  return utms
}

export function getStoredUtms(): StoredUtms {
  if (!safeWindow()) return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function persistUtms(data: StoredUtms): void {
  if (!safeWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function hasFirstTouch(stored: StoredUtms): boolean {
  return Object.keys(stored).some((key) => key.startsWith("first_"))
}

function prefixUtms(
  utms: Partial<Record<UtmKey, string>>,
  prefix: string
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(utms)) {
    if (value) {
      result[`${prefix}${key}`] = value
    }
  }

  return result
}

export function captureUtmParams(search?: string): boolean {
  if (!safeWindow()) return false

  const currentSearch = search ?? window.location.search
  const utms = parseUtmParams(currentSearch)

  if (Object.keys(utms).length === 0) return false

  const stored = getStoredUtms()

  if (!hasFirstTouch(stored)) {
    persistUtms({ ...stored, ...prefixUtms(utms, "first_") })
    return true
  }

  const firstBackfill: Record<string, string> = {}

  for (const [key, value] of Object.entries(utms)) {
    if (!value) continue
    const firstKey = `first_${key}`
    if (!(firstKey in stored)) {
      firstBackfill[firstKey] = value
    }
  }

  persistUtms({
    ...stored,
    ...firstBackfill,
    ...prefixUtms(utms, "last_"),
  })

  return true
}

function getBestUtmValue(stored: StoredUtms, key: string): string {
  return stored[`last_${key}`] || stored[`first_${key}`] || ""
}

export function stripUtmParamsFromUrl(url: string): string | null {
  const [pathname, queryString] = url.split("?")
  if (!queryString) return null

  const params = new URLSearchParams(queryString)
  let changed = false

  for (const key of UTM_PARAMS) {
    if (params.has(key)) {
      params.delete(key)
      changed = true
    }
  }

  if (!changed) return null

  const remaining = params.toString()
  return remaining ? `${pathname}?${remaining}` : pathname || "/"
}

export function appendUtmDataToFormData(formData: FormData): void {
  const stored = getStoredUtms()
  if (Object.keys(stored).length === 0) return

  const source = getBestUtmValue(stored, "utm_source")
  const medium = getBestUtmValue(stored, "utm_medium")
  const campaign = getBestUtmValue(stored, "utm_campaign")
  const content = getBestUtmValue(stored, "utm_content")
  const term = getBestUtmValue(stored, "utm_term")

  if (source) formData.append("utms[source]", source)
  if (medium) formData.append("utms[medium]", medium)
  if (campaign) formData.append("utms[campaign]", campaign)
  if (content) formData.append("utms[content]", content)
  if (term) formData.append("utms[term]", term)
}
