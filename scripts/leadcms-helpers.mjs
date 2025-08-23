import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import axios from "axios";

export const leadCMSUrl = process.env.NEXT_PUBLIC_LEADCMS_URL;
export const leadCMSApiKey = process.env.LEADCMS_API_KEY;
export const language = process.env.NEXT_PUBLIC_LEADCMS_LANGUAGE;
export const CONTENT_DIR = path.resolve(".leadcms/content");
export const MEDIA_DIR = path.resolve("public/media");

// Fetch content types to build typeMap
export async function fetchContentTypes() {
  console.log(`[LeadCMS] Fetching content types...`);
  const url = new URL("/api/content-types", leadCMSUrl);
  url.searchParams.set("filter[limit]", "100");
  try {
    const res = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${leadCMSApiKey}` },
    });
    const types = res.data;
    const typeMap = {};
    for (const t of types) {
      typeMap[t.uid] = t.format;
    }
    return typeMap;
  } catch (error) {
    console.error(`[LeadCMS] Failed to fetch content types:`, error.message);
    return {};
  }
}

export function extractMediaUrlsFromContent(content) {
  const urls = new Set();
  const body = content.body || "";
  const regex = /["'\(](\/api\/media\/[^"'\)\s]+)/g;
  let match;
  while ((match = regex.exec(body))) {
    urls.add(match[1]);
  }
  if (content.coverImageUrl && content.coverImageUrl.startsWith("/api/media/")) {
    urls.add(content.coverImageUrl);
  }
  return Array.from(urls);
}

export async function downloadMediaFile(mediaUrl, destPath, leadCMSUrl, leadCMSApiKey) {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  const metaFilePath = path.resolve(".leadcms/meta.json");
  let metaAll = {};
  let metaExists = false;
  try {
    metaAll = JSON.parse(await fs.readFile(metaFilePath, "utf8"));
    metaExists = true;
  } catch {
    // If meta file is missing, force re-download all files
    metaAll = {};
    metaExists = false;
  }

  // Use relative path from project root for key
  const relPath = path.relative(process.cwd(), destPath);
  let etag, lastModified;
  if (metaAll[relPath]) {
    etag = metaAll[relPath].etag;
    lastModified = metaAll[relPath].lastModified;
  }

  // If meta file is missing, always re-download
  const skipConditional = !metaExists;

  const fullUrl = mediaUrl.startsWith("http") ? mediaUrl : leadCMSUrl.replace(/\/$/, "") + mediaUrl;
  const headers = { Authorization: `Bearer ${leadCMSApiKey}` };
  if (!skipConditional) {
    if (etag) headers["If-None-Match"] = etag;
    if (lastModified) headers["If-Modified-Since"] = lastModified;
  }

  try {
    const res = await axios.get(fullUrl, {
      responseType: "arraybuffer",
      headers,
      validateStatus: status => (status >= 200 && status < 300) || status === 304 || status === 404,
    });
    if (res.status === 404) {
      // Remove file and meta if not found on server
      try { await fs.unlink(destPath); } catch {}
      delete metaAll[relPath];
      await fs.writeFile(metaFilePath, JSON.stringify(metaAll, null, 2), "utf8");
      return false;
    }
    if (!skipConditional && res.status === 304) {
      // Not modified, skip download
      return false;
    }
    await fs.writeFile(destPath, res.data);
    // Save new metadata
    metaAll[relPath] = {
      etag: res.headers["etag"] || undefined,
      lastModified: res.headers["last-modified"] || undefined,
    };
    await fs.writeFile(metaFilePath, JSON.stringify(metaAll, null, 2), "utf8");
    return true;
  } catch (err) {
    // If file exists and server returns 304, treat as not modified
    if (!skipConditional && err.response && err.response.status === 304) {
      return false;
    }
    throw err;
  }
}

export function buildFrontmatter(content) {
  const omit = ["body"];
  const fm = Object.fromEntries(
    Object.entries(content).filter(([k, v]) => !omit.includes(k) && v !== undefined && v !== null)
  );
  return `---\n${yaml.dump(fm)}---`;
}

export function replaceApiMediaPaths(obj) {
  if (typeof obj === "string") {
    return obj.replace(/\/api\/media\//g, "/media/");
  } else if (Array.isArray(obj)) {
    return obj.map(replaceApiMediaPaths);
  } else if (typeof obj === "object" && obj !== null) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = replaceApiMediaPaths(v);
    }
    return out;
  }
  return obj;
}

export async function saveContentFile({
  content,
  typeMap,
  contentDir,
  previewSlug,
}) {
  if (!content || typeof content !== "object") {
    console.warn("[LeadCMS] Skipping undefined or invalid content:", content);
    return;
  }
  const slug = previewSlug || content.slug;
  if (!slug) {
    console.warn("[LeadCMS] Skipping content with missing slug:", content);
    return;
  }
  const contentType = typeMap ? typeMap[content.type] : content.format || (content.body ? "MDX" : "JSON");
  const cleanedContent = replaceApiMediaPaths(content);

  if (contentType === "MDX") {
      const filePath = path.join(contentDir, `${slug}.mdx`);
      let body = cleanedContent.body || "";
      let bodyFrontmatter = {};
      let bodyContent = body;
      // Extract frontmatter from body if present
      const fmMatch = body.match(/^---\n([\s\S]*?)\n---\n?/);
      if (fmMatch) {
        try {
          bodyFrontmatter = require("js-yaml").load(fmMatch[1]) || {};
        } catch {}
        bodyContent = body.slice(fmMatch[0].length);
      }
      // Merge frontmatters, content metadata takes precedence
      const mergedFrontmatter = { ...bodyFrontmatter, ...cleanedContent };
      delete mergedFrontmatter.body;
      const frontmatterStr = buildFrontmatter(mergedFrontmatter);
      const mdx = `${frontmatterStr}\n\n${bodyContent.replace(/\/api\/media\//g, "/media/").trim()}\n`;
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, mdx, "utf8");
      return filePath;
  } else {
    let bodyObj = {};
    try {
      bodyObj = cleanedContent.body ? JSON.parse(cleanedContent.body) : {};
    } catch {
      bodyObj = {};
    }
    const merged = { ...bodyObj };
    for (const [k, v] of Object.entries(cleanedContent)) {
      if (k !== "body") merged[k] = v;
    }
    const filePath = path.join(contentDir, `${slug}.json`);
    const jsonStr = JSON.stringify(merged, null, 2);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, jsonStr, "utf8");
    return filePath;
  }
}
