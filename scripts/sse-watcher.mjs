import "dotenv/config";
import { EventSource } from "eventsource";
import { exec } from "child_process";
import {
  extractMediaUrlsFromContent,
  downloadMediaFile,
  saveContentFile,
  leadCMSUrl,
  leadCMSApiKey,
  language,
  CONTENT_DIR,
  MEDIA_DIR
} from "./leadcms-helpers.mjs";
import { fetchContentTypes } from "./leadcms-helpers.mjs";
import path from "path";

// Log environment configuration for debugging
console.log(`[SSE ENV] LeadCMS URL: ${leadCMSUrl}`);
console.log(`[SSE ENV] LeadCMS API Key: ${leadCMSApiKey ? `${leadCMSApiKey.substring(0, 8)}...` : 'NOT_SET'}`);
console.log(`[SSE ENV] Language: ${language || 'NOT_SET'}`);
console.log(`[SSE ENV] Content Dir: ${CONTENT_DIR}`);
console.log(`[SSE ENV] Media Dir: ${MEDIA_DIR}`);

function buildSSEUrl() {
  console.log(`[SSE URL] Building SSE URL with base: ${leadCMSUrl}`);
  const url = new URL("/api/sse/stream", leadCMSUrl);
  url.searchParams.set("entities", "Content");
  url.searchParams.set("includeContent", "true");
  url.searchParams.set("includeLiveDrafts", "true");
  if (language) {
    url.searchParams.set("language", language);
    console.log(`[SSE URL] Added language parameter: ${language}`);
  }
  const finalUrl = url.toString();
  console.log(`[SSE URL] Final SSE URL: ${finalUrl}`);
  return finalUrl;
}


async function startSSEWatcher() {
  console.log(`[SSE] Starting SSE watcher...`);
  const typeMap = await fetchContentTypes();
  const sseUrl = buildSSEUrl();
  const eventSourceOptions = {};

  if (leadCMSApiKey) {
    console.log(`[SSE] Using API key for authentication`);
    eventSourceOptions.fetch = (
      input,
      init,
    ) => {
      console.log(`[SSE FETCH] Making authenticated request to: ${input}`);
      console.log(`[SSE FETCH] Headers:`, JSON.stringify({
        ...init?.headers,
        Authorization: `Bearer ${leadCMSApiKey.substring(0, 8)}...`
      }, null, 2));

      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${leadCMSApiKey}`,
        },
      }).then(response => {
        console.log(`[SSE FETCH] Response status: ${response.status} ${response.statusText}`);
        console.log(`[SSE FETCH] Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
        if (!response.ok) {
          console.error(`[SSE FETCH] Failed response: ${response.status} ${response.statusText}`);
        }
        return response;
      }).catch(error => {
        console.error(`[SSE FETCH] Fetch error:`, error.message);
        throw error;
      });
    };
  } else {
    console.warn(`[SSE] No API key provided - attempting unauthenticated connection`);
  }

  console.log(`[SSE] Connecting to: ${sseUrl}`);
  console.log(`[SSE] Event source options:`, JSON.stringify(eventSourceOptions, null, 2));
  const es = new EventSource(sseUrl, eventSourceOptions);

  es.onopen = () => {
    console.log("[SSE] Connection opened successfully");
  };

  es.onmessage = (event) => {
    console.log(`[SSE] Received message:`, event.data);
    try {
      const data = JSON.parse(event.data);
      console.log(`[SSE] Parsed message data:`, JSON.stringify(data, null, 2));

      if (data.entityType === "Content") {
        console.log(`[SSE] Content message - Operation: ${data.operation}`);

        if (data.operation === "DraftModified" && data.createdById && data.data) {
          console.log(`[SSE] Processing draft modification for user: ${data.createdById}`);
          let contentData;
          try {
            contentData = typeof data.data === "string" ? JSON.parse(data.data) : data.data;
            console.log(`[SSE] Draft content data:`, JSON.stringify(contentData, null, 2));
          } catch (e) {
            console.warn("[SSE] Failed to parse draft content data:", e.message);
            console.warn("[SSE] Raw data:", data.data);
            return;
          }
          // Determine if this draft is MDX type only
          let contentType = undefined;
          if (contentData && contentData.type && typeMap && typeMap[contentData.type]) {
            contentType = typeMap[contentData.type];
          }
          
          if (contentType === "MDX") {
            const allMediaUrls = extractMediaUrlsFromContent(contentData);
            console.log(`[SSE] Found ${allMediaUrls.length} media URLs to download`);

            Promise.all(
              allMediaUrls.map(async (mediaUrl) => {
                const relPath = mediaUrl.replace(/^\/api\/media\//, "");
                const destPath = path.join(MEDIA_DIR, relPath);
                console.log(`[SSE] Downloading media: ${mediaUrl} -> ${destPath}`);
                await downloadMediaFile(mediaUrl, destPath, leadCMSUrl, leadCMSApiKey);
              })
            ).then(async () => {
              if (contentData && typeof contentData === "object") {
                const previewSlug = `${contentData.slug}-${data.createdById}`;
                console.log(`[SSE] Saving MDX draft content file for preview: ${previewSlug}`);
                await saveContentFile({
                  content: contentData,
                  typeMap,
                  contentDir: CONTENT_DIR,
                  previewSlug: previewSlug
                });
                console.log(`[SSE] Saved MDX draft preview for ${previewSlug}`);
              }
            }).catch(error => {
              console.error(`[SSE] Error processing draft modification:`, error.message);
            });
          } else {
            console.log(`[SSE] Draft is not MDX (type: ${contentType}), skipping file save.`);
          }
        } else {
          console.log(`[SSE] Non-draft content change - triggering full fetch`);
          exec("npm run fetch:leadcms", (err, stdout, stderr) => {
            if (err) {
              console.error("[SSE] fetch:leadcms failed:", err.message);
              console.error("[SSE] fetch:leadcms stderr:", stderr);
              return;
            }
            console.log("[SSE] fetch:leadcms completed successfully");
            console.log("[SSE] fetch:leadcms output:\n", stdout);
            if (stderr) console.warn("[SSE] fetch:leadcms stderr:", stderr);
          });
        }
      } else {
        console.log(`[SSE] Non-content message - Entity type: ${data.entityType}`);
      }
    } catch (e) {
      console.warn("[SSE] Failed to parse SSE message:", e.message);
      console.warn("[SSE] Raw event data:", event.data);
    }
  };

  es.addEventListener("connected", (event) => {
    console.log(`[SSE] Received 'connected' event:`, event.data);
    try {
      const data = JSON.parse(event.data);
      console.log(`[SSE] Connected successfully - Client ID: ${data.clientId}, Starting change log ID: ${data.startingChangeLogId}`);
    } catch (e) {
      console.warn("[SSE] Failed to parse connected event:", e.message);
      console.warn("[SSE] Raw connected event data:", event.data);
    }
  });

  es.addEventListener("heartbeat", (event) => {
    console.log(`[SSE] Received heartbeat:`, event.data);
    try {
      const data = JSON.parse(event.data);
      console.log(`[SSE] Heartbeat at ${data.timestamp}`);
    } catch (e) {
      console.warn("[SSE] Failed to parse heartbeat event:", e.message);
      console.warn("[SSE] Raw heartbeat event data:", event.data);
    }
  });

  es.onerror = (err) => {
    console.error("[SSE] Connection error occurred:", {
      type: err.type,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString(),
      readyState: es.readyState,
      url: es.url
    });
    
    // Log specific error types
    if (err.code === 401) {
      console.error("[SSE] Authentication failed (401) - check your LEADCMS_API_KEY");
      console.error("[SSE] Current API Key (first 8 chars):", leadCMSApiKey ? leadCMSApiKey.substring(0, 8) : 'NOT_SET');
    } else if (err.code === 403) {
      console.error("[SSE] Forbidden (403) - insufficient permissions");
    } else if (err.code === 404) {
      console.error("[SSE] Not Found (404) - check your LEADCMS_URL and endpoint path");
    } else if (err.code >= 500) {
      console.error("[SSE] Server error (5xx) - LeadCMS server issue");
    }
    
    console.log("[SSE] Closing connection and will reconnect in 5s");
    es.close();
    setTimeout(() => {
      console.log("[SSE] Attempting to reconnect...");
      startSSEWatcher();
    }, 5000);
  };
}

startSSEWatcher();
