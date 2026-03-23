const STORAGE_KEY = "leadcms-interest-tags"

const safeWindow = () => typeof window !== "undefined"

function parseTags(value: string | null): string[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
  } catch {
    return []
  }
}

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.filter((x) => Boolean(x && x.trim())))]
}

export function getTrackedTags(): string[] {
  if (!safeWindow()) return []
  return parseTags(window.localStorage.getItem(STORAGE_KEY))
}

function persistTrackedTags(tags: string[]): void {
  if (!safeWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueTags(tags)))
}

export function trackContentTags(contentTags: string[] | undefined | null): string[] {
  if (!safeWindow()) return []
  if (!contentTags || contentTags.length === 0) return getTrackedTags()

  const nextTags = uniqueTags([...getTrackedTags(), ...contentTags])
  persistTrackedTags(nextTags)
  return nextTags
}

export function appendTrackedTagsToFormData(formData: FormData): void {
  const trackedTags = getTrackedTags()
  if (trackedTags.length === 0) return

  for (const tag of trackedTags) {
    formData.append("tags[]", tag)
  }
}
