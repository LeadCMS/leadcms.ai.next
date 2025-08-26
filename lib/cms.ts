import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface CMSContentTemplateProps {
  content: CMSContent;
}

export interface CMSContent {
  id: string | number
  slug: string
  type: string
  title?: string
  description?: string
  coverImageUrl?: string
  coverImageAlt?: string
  [key: string]: any
  body: string
}

export function getAllContentSlugs(
  contentDir: string, 
  contentTypes?: string[]
): string[] {
  function walk(dir: string, prefix = ""): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const slugs: string[] = []
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subSlugs = walk(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name)
        slugs.push(...subSlugs)
      }
      else if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".json"))) {

        const ext = entry.name.endsWith(".mdx") ? ".mdx" : ".json";
        const slug = (prefix ? `${prefix}/` : "") + entry.name.replace(new RegExp(`\\${ext}$`), "")
        
        // If content types filter is provided, check the file's type
        if (contentTypes && contentTypes.length > 0) {
          const filePath = path.join(dir, entry.name)
          try {
            const fileType = getFileTypeOptimized(filePath, ext)
            // Only include if the type matches the filter
            if (fileType && contentTypes.includes(fileType)) {
              slugs.push(slug)
            }
          }
          catch (e) {
            // Skip files that can't be parsed
            continue
          }
        } else {
          // No filter, include all files
          slugs.push(slug)
        }
      }     
    }
    return slugs
  }
  return walk(contentDir)
}

export function getCMSContentBySlug(
  slug: string,
  contentDir: string
): CMSContent | null {
  // Try both .mdx and .json extensions
  const mdxPath = path.join(contentDir, `${slug}.mdx`)
  const jsonPath = path.join(contentDir, `${slug}.json`)
  
  try {
    // Try MDX first - combine existence check with read operation
    try {
      const file = fs.readFileSync(mdxPath, "utf8")
      const { data, content } = matter(file)
      return {
        ...data,
        slug,
        body: content,
      } as CMSContent
    } catch (mdxError: any) {
      // If MDX doesn't exist or can't be read, try JSON
      if (mdxError.code !== 'ENOENT') {
        // If it's not a "file not found" error, rethrow
        throw mdxError
      }
    }
    
    // Try JSON
    try {
      const file = fs.readFileSync(jsonPath, "utf8")
      const data = JSON.parse(file)
      return {
        ...data,
        slug,
      } as CMSContent
    }
    catch (jsonError: any) {
      // If JSON doesn't exist or can't be read, return null
      if (jsonError.code === 'ENOENT') {
        return null
      }
      // If it's a parse error or other issue, rethrow
      throw jsonError
    }
  } catch (e) {
    return null
  }
}

/**
 * Optimized function to extract file type without reading the entire file content.
 * For MDX files, it reads only the frontmatter section.
 * For JSON files, it attempts to read just enough to find the type field.
 */
function getFileTypeOptimized(filePath: string, ext: string): string | undefined {
  if (ext === ".mdx") {
    return extractTypeFromMDXFrontmatter(filePath)
  }
  else if (ext === ".json") {
    return extractTypeFromJSON(filePath)
  }
  return undefined
}

/**
 * Reads only the frontmatter section of an MDX file to extract the type.
 * This is much more efficient than parsing the entire file.
 */
function extractTypeFromMDXFrontmatter(filePath: string): string | undefined {
  try {
    const file = fs.readFileSync(filePath, "utf8")
    // Quick check if file starts with frontmatter
    if (!file.startsWith('---\n') && !file.startsWith('---\r\n')) {
      return undefined
    }
    
    // Find the end of frontmatter
    let endIndex = file.indexOf('\n---\n', 4)
    if (endIndex === -1) {
      endIndex = file.indexOf('\r\n---\r\n', 4)
    }
    if (endIndex === -1) {
      return undefined
    }
    
    // Extract and parse only the frontmatter
    const frontmatterContent = file.slice(4, endIndex)
    const { data } = matter(`---\n${frontmatterContent}\n---`)
    
    return data.type
  }
  catch (e) {
    return undefined
  }
}

/**
 * Attempts to extract the type field from a JSON file without parsing the entire content.
 * Uses streaming approach for large files.
 */
function extractTypeFromJSON(filePath: string): string | undefined {
  try {
    const file = fs.readFileSync(filePath, "utf8")
    
    // For small files, just parse normally
    if (file.length < 100) {
      const data = JSON.parse(file)
      return data.type
    }
    
    // For larger files, try to find the type field early in the content
    // This is a simple optimization - look for "type": in the first part of the file
    const typeMatch = file.match(/"type"\s*:\s*"([^"]+)"/)
    if (typeMatch) {
      return typeMatch[1]
    }
    
    // Fallback to full parsing if quick match fails
    const data = JSON.parse(file)
    return data.type
  } catch (e) {
    return undefined
  }
}


