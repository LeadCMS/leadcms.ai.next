import "dotenv/config"
import fs from "fs/promises"
import path from "path"
import axios from "axios"
import {
  extractMediaUrlsFromContent,
  downloadMediaFile,
  saveContentFile,
  leadCMSUrl,
  leadCMSApiKey,
  language,
  CONTENT_DIR,
  MEDIA_DIR,
  fetchContentTypes,
} from "./leadcms-helpers.mjs"

// Add axios request/response interceptors for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`[AXIOS REQUEST] ${config.method?.toUpperCase()} ${config.url}`)

    // Mask the Authorization header for security
    const maskedHeaders = { ...config.headers }
    if (maskedHeaders.Authorization && typeof maskedHeaders.Authorization === "string") {
      const authParts = maskedHeaders.Authorization.split(" ")
      if (authParts.length === 2 && authParts[0] === "Bearer") {
        maskedHeaders.Authorization = `Bearer ${authParts[1].substring(0, 8)}...`
      }
    }
    
    return config
  },
  (error) => {
    console.error(`[AXIOS REQUEST ERROR]`, error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error(
      `[AXIOS RESPONSE ERROR] ${error.response?.status || "NO_STATUS"} ${error.response?.statusText || "NO_STATUS_TEXT"} for ${error.config?.url || "NO_URL"}`
    )
    if (error.response) {
      console.error(`[AXIOS RESPONSE ERROR] Response data:`, error.response.data)
      console.error(
        `[AXIOS RESPONSE ERROR] Response headers:`,
        JSON.stringify(error.response.headers, null, 2)
      )
    }
    console.error(`[AXIOS RESPONSE ERROR] Full error:`, error.message)
    return Promise.reject(error)
  }
)

const SYNC_TOKEN_PATH = path.resolve(".leadcms/sync-token.txt")

async function readSyncToken() {
  try {
    return (await fs.readFile(SYNC_TOKEN_PATH, "utf8")).trim()
  } catch {
    return undefined
  }
}

async function writeSyncToken(token) {
  await fs.mkdir(path.dirname(SYNC_TOKEN_PATH), { recursive: true })
  await fs.writeFile(SYNC_TOKEN_PATH, token, "utf8")
}

async function walkMedia(dir) {
  let files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      files = files.concat(await walkMedia(path.join(dir, entry.name)))
    } else if (entry.isFile()) {
      // Only consider non-meta files
      if (!entry.name.endsWith(".meta.json")) {
        files.push(path.join(dir, entry.name))
      }
    }
  }
  return files
}

async function fetchContentSync(syncToken) {
  console.log(`[FETCH_CONTENT_SYNC] Starting with syncToken: ${syncToken || "NONE"}`)
  let allItems = []
  let allDeleted = []
  let token = syncToken || ""
  let nextSyncToken = undefined
  let page = 0

  while (true) {
    const url = new URL("/api/content/sync", leadCMSUrl)
    url.searchParams.set("filter[limit]", "100")
    url.searchParams.set("syncToken", token)

    if (language) {
      url.searchParams.set("filter[where][language][like]", language)
    }

    console.log(`[FETCH_CONTENT_SYNC] Page ${page}, URL: ${url.toString()}`)

    try {
      const res = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${leadCMSApiKey}` },
      })

      if (res.status === 204) {
        console.log(`[FETCH_CONTENT_SYNC] Got 204 No Content - ending sync`)
        break
      }

      const data = res.data
      console.log(
        `[FETCH_CONTENT_SYNC] Page ${page} - Got ${data.items?.length || 0} items, ${data.deleted?.length || 0} deleted`
      )

      if (data.items && Array.isArray(data.items)) allItems.push(...data.items)

      if (data.deleted && Array.isArray(data.deleted)) {
        allDeleted.push(...data.deleted)
      }

      const newSyncToken = res.headers["x-next-sync-token"] || token
      console.log(`[FETCH_CONTENT_SYNC] Next sync token: ${newSyncToken}`)

      if (!newSyncToken || newSyncToken === token) {
        nextSyncToken = newSyncToken || token
        console.log(`[FETCH_CONTENT_SYNC] No new sync token - ending sync`)
        break
      }

      nextSyncToken = newSyncToken
      token = newSyncToken
      page++
    } catch (error) {
      console.error(`[FETCH_CONTENT_SYNC] Failed on page ${page}:`, error.message)
      throw error
    }
  }

  console.log(
    `[FETCH_CONTENT_SYNC] Completed - Total items: ${allItems.length}, deleted: ${allDeleted.length}`
  )
  return {
    items: allItems,
    deleted: allDeleted,
    nextSyncToken: nextSyncToken || token,
  }
}


async function main() {
  // Log environment configuration for debugging
  console.log(`[ENV] LeadCMS URL: ${leadCMSUrl}`)
  console.log(
    `[ENV] LeadCMS API Key: ${leadCMSApiKey ? `${leadCMSApiKey.substring(0, 8)}...` : "NOT_SET"}`
  )
  console.log(`[ENV] Language: ${language || "NOT_SET"}`)
  console.log(`[ENV] Content Dir: ${CONTENT_DIR}`)
  console.log(`[ENV] Media Dir: ${MEDIA_DIR}`)

  await fs.mkdir(CONTENT_DIR, { recursive: true })
  await fs.mkdir(MEDIA_DIR, { recursive: true })

  const typeMap = await fetchContentTypes()

  const lastSyncToken = await readSyncToken()

  let items = [],
    deleted = [],
    nextSyncToken

  try {
    if (lastSyncToken) {
      console.log(`Syncing from LeadCMS using sync token: ${lastSyncToken}`)
      ;({ items, deleted, nextSyncToken } = await fetchContentSync(lastSyncToken))
    } else {
      console.log("No sync token found. Doing full fetch from LeadCMS...")
      ;({ items, deleted, nextSyncToken } = await fetchContentSync(undefined))
    }
  } catch (error) {
    console.error(`[MAIN] Failed to fetch content:`, error.message)
    if (error.response?.status === 401) {
      console.error(`[MAIN] Authentication failed - check your LEADCMS_API_KEY`)
    }
    throw error
  }

  console.log(`Fetched ${items.length} content items, ${deleted.length} deleted.`)


  // Save content files and collect all media URLs from content
  const allMediaUrls = new Set()
  for (const content of items) {
    if (content && typeof content === "object") {
      await saveContentFile({
        content,
        typeMap,
        contentDir: CONTENT_DIR,
      })
      for (const url of extractMediaUrlsFromContent(content)) {
        allMediaUrls.add(url)
      }
    }
  }

  // Remove deleted content files
  for (const id of deleted) {
    const idStr = String(id)
    const files = await fs.readdir(CONTENT_DIR)
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file)
      try {
        const content = await fs.readFile(filePath, "utf8")
        // Exact-match YAML frontmatter: lines like `id: 10` or `id: '10'`
        const yamlRegex = new RegExp(`(^|\\n)id:\\s*['\"]?${idStr}['\"]?(\\n|$)`)
        // Exact-match JSON: "id": 10 or "id": "10"
        const jsonRegex = new RegExp(`\\"id\\"\\s*:\\s*['\"]?${idStr}['\"]?\\s*(,|\\}|\\n|$)`)
        if (yamlRegex.test(content) || jsonRegex.test(content)) {
          await fs.unlink(filePath)
          console.log(`Deleted: ${filePath}`)
        }
      } catch {}
    }
  }

  // Always revalidate all media files in MEDIA_DIR, merging with found URLs
  const mediaFiles = await walkMedia(MEDIA_DIR)
  for (const filePath of mediaFiles) {
    // Get relative path from MEDIA_DIR root
    const relPath = path.relative(MEDIA_DIR, filePath)
    // Reconstruct original media URL
    const mediaUrl = "/api/media/" + relPath.replace(/\\/g, "/")
    allMediaUrls.add(mediaUrl)
  }

  // Download/revalidate all referenced media
  console.log(`\nDownloading/revalidating referenced media files...`)
  let downloaded = 0
  for (const mediaUrl of allMediaUrls) {
    const relPath = mediaUrl.replace(/^\/api\/media\//, "")
    const destPath = path.join(MEDIA_DIR, relPath)
    const didDownload = await downloadMediaFile(mediaUrl, destPath, leadCMSUrl, leadCMSApiKey)
    if (didDownload) {
      console.log(`Downloaded: ${mediaUrl} -> ${destPath}`)
      downloaded++
    } else {
      console.log(`Exists: ${destPath}`)
    }
  }
  console.log(`\nDone. ${downloaded} new media files downloaded.\n`)

  // Save new sync token
  if (nextSyncToken) {
    await writeSyncToken(nextSyncToken)
    console.log(`Sync token updated: ${nextSyncToken}`)
  }
}

main().catch((err) => {
  console.error("Error in fetch-leadcms-content:", err)
  process.exit(1)
})
