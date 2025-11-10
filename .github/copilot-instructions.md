# GitHub Copilot Instructions for LeadCMS Integration

This file provides context and guidelines for GitHub Copilot when working with LeadCMS-powered Next.js projects.

## Project Context

This is a Next.js project integrated with LeadCMS headless CMS. The architecture separates content (managed in LeadCMS) from presentation (React components).

**Critical: This is a static site using `output: "export"`**. All components and logic must be compatible with static generation - there is no server-side runtime.

## Core Architecture Principles

### Static Site Generation

This project uses Next.js static export (`output: "export"`) in production:

- **No server-side runtime** - All pages generated at build time
- **Build-time only** - Content fetched during `pnpm run build`, not at request time
- **Client-side only** - All interactivity must be client-side (React hooks, browser APIs)
- **No API routes** - Cannot use Next.js API routes (they require a server)
- **Static file serving** - Deployed as static HTML/CSS/JS files to nginx/CDN

**Key Implications:**

```tsx
❌ WRONG - Server-side features:
- API routes (app/api/)
- Server Actions
- getServerSideProps
- middleware.ts
- Dynamic routes without generateStaticParams
- Server Components with dynamic data fetching

✅ CORRECT - Static-compatible features:
- generateStaticParams for all dynamic routes
- Client Components with useState, useEffect
- Build-time data fetching (during build)
- Static file generation
- Client-side form submissions to external APIs
```

**Development vs Production:**
- Development: `output: undefined` (allows dynamic routes for easier development)
- Production: `output: "export"` (forces static generation)

All dynamic routes MUST implement `generateStaticParams` to pre-generate all possible paths at build time.

## Core Architecture Principles

### Content vs Presentation Separation

- **Components** (`components/mdx/`, `components/templates/`) contain presentation logic and styling
- **Content** (`.leadcms/content/*.mdx`, `.leadcms/content/*.json`) contains all text, data, and configuration
- **No hardcoded content** in React components - all content must come from LeadCMS
- **Fail builds** when required content is missing - never use fallback content

### Content Type Design

Design content types based on structure and purpose, NOT URL patterns.

#### Standard Content Types (use these when applicable):
- `home` - Homepage content
- `doc` - Documentation pages
- `blog-index` + `blog-article` - Blog system
- `legal` - Terms, privacy policy, GDPR notices
- `contact` - Contact forms and information
- `not-found` - 404 error pages
- `component` - Reusable configuration components (header, footer)

#### Content Type Patterns:

**Index vs. Detail Pattern** - Use when listing and detail views have different structures:
```
✅ Correct: `blog-index` (lists posts) + `blog-article` (individual post)
❌ Wrong: `blog-index` without corresponding detail type
```

**Unified Structure Pattern** - Use when all pages share the same structure:
```
✅ Correct: Single `doc` type covers all documentation pages
❌ Wrong: Separate `doc-index` and `doc-article` when structure is identical
```

**Avoid Over-Specialization:**
```
❌ Don't create: `testimonials`, `services-consulting`, `team-members`
✅ Use instead: `home` or generic content with appropriate `category` field
```

### MDX vs JSON

**Use MDX when:**
- Content is narrative with rich formatting
- Need custom components in content
- Content managers edit text

**Use JSON when:**
- Structured configuration data
- Fixed schema (header, footer, site metadata)
- No narrative text needed

**CRITICAL: `type` attribute is REQUIRED in both MDX and JSON:**
- ✅ **MDX files** - Must have `type: "content-type"` in frontmatter
- ✅ **JSON files** - Must have `"type": "content-type"` as a top-level attribute
- ❌ **Missing type** - Content without `type` will cause errors or be inaccessible
- 📋 **Examples**: `type: "home"`, `type: "doc"`, `type: "component"`

**JSON Configuration Files** must include all required CMS fields:
```json
{
  "type": "component",
  "title": "Configuration Title (min 10 chars)",
  "description": "Configuration description (min 20 chars)",
  "slug": "config-name",
  "author": "Author Name",
  "language": "en",
  "publishedAt": "2024-01-01T00:00:00Z",
  "coverImageUrl": "/media/path/to/image.jpg",
  "coverImageAlt": "Descriptive alt text",
  ... // other configuration fields
}
```

## LeadCMS SDK Usage

This project uses the official `@leadcms/sdk` package for all content access. **Never** create wrapper functions or read files directly.

### Core SDK Functions

```typescript
import {
  getCMSContentBySlugForLocale,
  getAllContentSlugsForLocale,
  getAllContentRoutes,
  loadContentConfigStrict
} from '@leadcms/sdk'

// Get content by slug
const content = getCMSContentBySlugForLocale('about', 'en')
// Returns: { metadata: {...}, body: "..." }

// Get all slugs for a locale (for static generation)
const slugs = getAllContentSlugsForLocale('en')
// Returns: ['', 'projects/xltools', 'projects/leadcms', ...]

// Get all routes (multi-locale sites)
const routes = getAllContentRoutes()
// Returns: [{ slug: 'about', locale: 'en', path: '/about', ... }, ...]

// Load JSON configuration files
const config = loadContentConfigStrict('header', 'en')
// Loads .leadcms/content/header.json (or header.en.json)
```

### Getting the Locale

Always get the locale from environment variables:

```typescript
const locale = process.env.LEADCMS_DEFAULT_LANGUAGE ||
               process.env.NEXT_PUBLIC_LEADCMS_DEFAULT_LANGUAGE ||
               'en'
```

### Error Handling

The SDK throws errors when content is missing. Always provide helpful error messages:

```typescript
const content = getCMSContentBySlugForLocale(slug, locale)

if (!content) {
  throw new Error(
    `Content not found for slug: ${slug}. ` +
    `Please ensure the corresponding MDX file exists in .leadcms/content/ ` +
    `or run 'npx leadcms pull' to sync content from LeadCMS.`
  )
}
```

For JSON configs, use `loadContentConfigStrict` with try-catch:

```typescript
let config: { logo: { text: string; href: string } }

try {
  config = loadContentConfigStrict('header', locale) as typeof config
} catch (error) {
  throw new Error(
    `Header configuration not found. ` +
    `Please ensure header.json exists in .leadcms/content/ ` +
    `or run 'npx leadcms pull' to sync content from LeadCMS.`
  )
}
```

### Type Annotations

The SDK returns `unknown` types, so add type annotations:

```typescript
// For content
const content = getCMSContentBySlugForLocale(slug, locale)
// content has metadata (Record<string, any>) and body (string)

// For configs
const config = loadContentConfigStrict('metadata', locale) as {
  siteTitle: string
  siteDescription: string
  language: string
  theme: string
}
```

### Static Generation

Use SDK functions in `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  const locale = process.env.LEADCMS_DEFAULT_LANGUAGE || 'en'
  const slugs = getAllContentSlugsForLocale(locale)

  return slugs
    .filter((slug) => slug !== '') // Exclude homepage
    .map((slug) => ({
      slug: slug.split('/'), // Convert to path segments
    }))
}
```

### CLI Commands

Content is synced using the LeadCMS CLI:

```bash
# Pull all content, media, and comments
npx leadcms pull

# Pull only content
npx leadcms pull-content

# Pull only media
npx leadcms pull-media

# Check sync status
npx leadcms status

# Push local changes
npx leadcms push
```

### Content Frontmatter Requirements

**CRITICAL:** Every MDX file MUST include `publishedAt` to be visible. Without it, content is treated as draft and filtered out.

```yaml
---
title: "Page Title"              # Required: min 10 characters
description: "Page description"  # Required: min 20 characters
slug: "page-slug"                # Required: URL slug (MANDATORY, cannot be empty)
type: "content-type"             # Required: Content type (home, project, etc.)
author: "Author Name"            # Required
language: "en"                   # Required: Language code
publishedAt: "2024-01-01T00:00:00Z"  # REQUIRED: ISO 8601 date, omit for drafts
coverImageUrl: "/media/path/to/image.jpg"  # REQUIRED: Cover image URL
coverImageAlt: "Descriptive alt text for image"  # REQUIRED: Alt text for accessibility
---
```

**Required Fields (both MDX and JSON):**
- ✅ **title** - Minimum 10 characters
- ✅ **description** - Minimum 20 characters
- ✅ **slug** - Non-empty string (e.g., "home", "projects/my-project")
- ✅ **type** - Content type identifier (e.g., "home", "project", "component")
- ✅ **author** - Content author name
- ✅ **language** - Language code (e.g., "en")
- ✅ **publishedAt** - ISO 8601 date (omit for drafts)
- ✅ **coverImageUrl** - Path to cover image (required by CMS database)
- ✅ **coverImageAlt** - Alt text for cover image (required for accessibility)

**Slug Requirements:**
- ✅ **MANDATORY** - Every MDX file MUST have a non-empty slug
- 🏠 **Homepage** - Use `slug: "home"` for the homepage (handled separately in routing)
- ❌ **Empty slug** - Never use empty string `""` for slug
- 📁 **Nested paths** - Use forward slashes for subdirectories (e.g., `"blog/my-post"`)

**Publishing Rules:**
- ✅ **With `publishedAt`** - Content is visible and returned by SDK
- ❌ **Without `publishedAt`** - Content is treated as draft and NOT returned
- 🕐 **Future `publishedAt`** - Content scheduled for future publication (not visible until that date)
- 📝 **Drafts** - Omit `publishedAt` to create draft content

### Key Principles

1. **Use SDK directly** - Never create wrapper functions (no `lib/leadcms.ts`)
2. **Import from '@leadcms/sdk'** - Use official SDK functions
3. **Type annotations** - Cast SDK results to specific types
4. **Error handling** - Provide helpful error messages with sync instructions
5. **Build-time only** - All SDK calls happen during build, not at runtime
6. **Always add publishedAt** - Content without `publishedAt` will not be visible

## MDX Component Design Principles

### 1. Content Inside Tags, Metadata as Props

This is the MOST IMPORTANT principle for MDX components.

```mdx
✅ CORRECT - Content inside tags:
<ServiceCard icon="Wrench" title="Consulting">
  Expert guidance for your projects
  * Strategic planning
  * Technical architecture
  * Best practices
</ServiceCard>

<Quote author="John Doe" date="2024">
  This product changed my life completely.
</Quote>

❌ WRONG - JSON props:
<ServiceCard
  title="Consulting"
  description="Expert guidance"
  features={["Planning", "Architecture", "Practices"]}
/>

<Quote
  text="This product changed my life"
  author="John Doe"
/>
```

**Rule:** Use props for metadata (author, title, variant, icon names). Place primary content inside component tags.

### 1.1. Handling MDX Text Processing

MDX automatically wraps text content in `<p>` tags with prose styling. For components that need plain text (buttons, badges, labels), use the `getTextContent` utility:

```tsx
import { getTextContent } from "@/lib/mdx-utils"

export const Button: React.FC<ButtonProps> = ({ children, href }) => {
  // Extract plain text to avoid MDX <p> wrapper
  const textContent = getTextContent(children)

  return (
    <a href={href}>
      <button>{textContent}</button>
    </a>
  )
}
```

**When to use `getTextContent`:**
- ✅ Buttons, badges, labels (inline text elements)
- ✅ Navigation items, breadcrumbs
- ✅ Form labels, placeholders
- ❌ Descriptions, paragraphs (these should keep MDX formatting)

### 1.2. Prefer Standard Markdown Syntax

Always use standard Markdown syntax when possible to keep MDX content simple and readable.

```mdx
✅ CORRECT - Standard Markdown lists:
<FeatureCard icon="Database" title="Headless CMS">
  Free, open source CMS with API-first architecture.

  * RESTful API with OpenAPI docs
  * Content versioning and history
  * Works with any frontend framework
</FeatureCard>

❌ WRONG - Custom component for every element:
<FeatureCard icon="Database" title="Headless CMS">
  <FeatureDescription>Free, open source CMS with API-first architecture.</FeatureDescription>
  <FeatureBullet>RESTful API with OpenAPI docs</FeatureBullet>
  <FeatureBullet>Content versioning and history</FeatureBullet>
  <FeatureBullet>Works with any frontend framework</FeatureBullet>
</FeatureCard>
```

**Rule:** Design components to accept standard Markdown (lists, paragraphs, emphasis) as children. Only create custom sub-components when standard Markdown cannot express the structure.

**Benefits:**
- Content is more readable and maintainable
- Content editors don't need to learn custom components
- MDX files work better with standard Markdown tools
- Easier migration from/to other Markdown systems

### 2. Never Use Raw HTML

```mdx
❌ WRONG:
<div style={{ display: 'flex' }}>
  <a href="/signup">Sign Up</a>
</div>

✅ CORRECT:
<ButtonGroup>
  <Button href="/signup">Sign Up</Button>
</ButtonGroup>
```

### 3. Support Both Component and String Props

Components should accept both direct component references and string identifiers for better MDX compatibility:

```tsx
// Component implementation
interface ServiceCardProps {
  icon?: LucideIcon | string  // Accept both!
  title: string
  children: React.ReactNode
}

// String-to-component mapping
const iconMap = {
  'Wrench': Wrench,
  'Code': Code,
  'Database': Database,
} as const

// In the component
const IconComponent = typeof icon === 'string'
  ? iconMap[icon as keyof typeof iconMap]
  : icon
```

This allows MDX authors to use:
```mdx
<ServiceCard icon="Wrench" title="Service" />
```

### 4. Use Semantic Component Names

```mdx
✅ Clear: <ServiceGrid>, <HeroSection>, <ContactForm>, <CallToAction>
❌ Vague: <Section>, <Container>, <Div>, <Component>
```

### 5. Nested Components Over Arrays

```mdx
❌ WRONG - Array props:
<ServiceGrid
  services={[
    { title: "Service 1", description: "..." },
    { title: "Service 2", description: "..." }
  ]}
/>

✅ CORRECT - Nested components:
<ServiceGrid title="Our Services">
  <ServiceCard title="Service 1">
    Description content here
  </ServiceCard>
  <ServiceCard title="Service 2">
    Description content here
  </ServiceCard>
</ServiceGrid>
```

## File Organization

### Content Structure
```
.leadcms/content/
├── metadata.json          # Site-wide metadata
├── header.json           # Header configuration
├── footer.json           # Footer configuration
├── contact-us-form.json  # Contact form configuration
├── home.mdx              # Homepage
├── docs.mdx              # Documentation index
├── blog.mdx              # Blog index
├── contact-us.mdx        # Contact page
├── not-found.mdx         # 404 page
├── blog/                 # Blog articles
│   ├── introducing-leadcms.mdx
│   └── building-sites-with-leadcms-sdk.mdx
├── docs/                 # Documentation pages
│   ├── getting-started/
│   │   ├── installation.mdx
│   │   ├── deploying.mdx
│   │   └── plugins.mdx
│   └── plugins/
└── legal/                # Legal pages
    ├── privacy.mdx
    └── terms.mdx
```

### Slug Mirrors Folder Structure
```
Content slug: "docs/getting-started/installation"
File location: .leadcms/content/docs/getting-started/installation.mdx
URL: /docs/getting-started/installation
```

## Frontmatter Requirements

**CRITICAL:** Every MDX file MUST include `publishedAt` to be visible!

```yaml
---
title: "Page Title"                      # Required
description: >-                          # Required: SEO description
  Page description text
slug: 'page-slug'                        # Required: URL slug
type: 'content-type'                     # Required: Content type (home, project, doc, etc.)
author: 'Author Name'                    # Required: Content author
language: 'en'                           # Required: Language code
publishedAt: "2024-01-01T00:00:00Z"     # REQUIRED: ISO 8601 date (content is invisible without this!)
category: 'category-name'                # Optional: category
tags: ['tag1', 'tag2']                   # Optional: tags
---
```

**Publishing Rules:**
- ✅ **With `publishedAt`** - Content is visible and returned by SDK
- ❌ **Without `publishedAt`** - Content is treated as draft and NOT returned by SDK
- 🕐 **Future `publishedAt`** - Content scheduled for future (not visible until that date)
- 📝 **Create Drafts** - Omit `publishedAt` to create draft content

## Build-Time Validation

Always validate that required content exists at build time:

```tsx
// ❌ WRONG - Fallback content
const config = getHeaderConfig() || DEFAULT_HEADER_CONFIG

// ✅ CORRECT - Fail fast
const config = getHeaderConfig()
if (!config) {
  throw new Error(
    'Header configuration missing. ' +
    'Ensure header.json exists in .leadcms/content/'
  )
}
```

## Component Implementation Pattern

Example of properly designed MDX components from the doc-components:

```tsx
// components/mdx/doc-components.tsx
interface FeatureCardProps {
  title: string
  description: string
  icon?: IconName
  href?: string
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  const content = (
    <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-2">
        {icon && (
          <div className="mr-3">
            <DynamicIcon name={icon} className="h-6 w-6" />
          </div>
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )

  if (href) {
    return <a href={href} className="block">{content}</a>
  }

  return content
}

interface FeatureGridProps {
  children: React.ReactNode
  columns?: number
}

export function FeatureGrid({ children, columns = 2 }: FeatureGridProps) {
  return (
    <div className={cn(
      "my-6 grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    )}>
      {children}
    </div>
  )
}
```

## Usage in MDX

```mdx
---
title: Documentation
type: doc
slug: docs
---

# LeadCMS Documentation

Welcome to the LeadCMS documentation!

## Next Steps

Deploy your first LeadCMS instance and learn the core features:

<FeatureGrid columns={2}>
  <FeatureCard
    title="Getting Started"
    description="Complete setup guide with step-by-step instructions"
    href="/docs/getting-started/installation/"
  />
  <FeatureCard
    title="Plugins"
    description="Extend functionality with built-in and custom plugins"
    href="/docs/getting-started/plugins/"
  />
</FeatureGrid>
```

**Note:** This follows the correct pattern - FeatureCard accepts props for metadata (title, description, icon, href) but doesn't use JSON arrays for content. The nested structure makes content more maintainable in MDX.

## Template System

### Template Registry

Templates control how different content types are rendered:

```tsx
// components/templates/index.tsx
export const templateRegistry: Record<string, TemplateComponent> = {
  legal: LegalTemplate,
  contact: ContactTemplate,
  doc: DocTemplate,
  'blog-article': BlogTemplate,
  'blog-index': BlogIndexTemplate,
}

export function getTemplate(type: string): TemplateComponent {
  return templateRegistry[type] || DefaultTemplate
}
```

### Available Templates

- **DefaultTemplate** - Used for `home` and other unregistered types (full-width MDX content)
- **LegalTemplate** - Used for `legal` type (privacy, terms, etc.)
- **ContactTemplate** - Used for `contact` type (contact forms and info)
- **DocTemplate** - Used for `doc` type (documentation with navigation)
- **BlogTemplate** - Used for `blog-article` type (individual blog posts)
- **BlogIndexTemplate** - Used for `blog-index` type (blog listing page)

### Creating a New Template

1. Create template file in `components/templates/`
2. Import and use MDX components
3. Register in `templateRegistry`
4. Use in content by setting `type` in frontmatter

```tsx
// components/templates/custom-template.tsx
import { MDXRemote } from "next-mdx-remote-client/rsc"
import { useMDXComponents } from "@/components/mdx-components"

export default function CustomTemplate({ content }: CMSContentTemplateProps) {
  const components = useMDXComponents({})

  return (
    <article className="container prose lg:prose-xl">
      <h1>{content.title}</h1>
      <MDXRemote source={content.body} components={components} />
    </article>
  )
}
```

## Common Tasks

### Adding a New Page

1. Create MDX file: `.leadcms/content/new-page.mdx` (or in appropriate subdirectory)
2. Add frontmatter with appropriate `type` (e.g., `type: 'home'`, `type: 'doc'`)
3. Use existing MDX components to compose the page
4. No code changes needed - page automatically generated

### Adding a New MDX Component

1. Create component in `components/mdx/`
2. Export from `components/mdx/index.tsx`
3. Use semantic naming (e.g., `PricingTable`, not `Table`)
4. Accept content as `children`, metadata as props
5. Support string identifiers where appropriate (icons, variants)

### Fetching Content

```bash
# Fetch latest content from LeadCMS
pnpm run fetch

# Development (auto-fetches)
pnpm run dev

# Build (auto-fetches)
pnpm run build
```

## Media and Asset Management

### How LeadCMS Handles Media

LeadCMS automatically manages media files through its SDK:

**Media Flow:**
1. Upload images/assets through LeadCMS admin interface
2. Run `pnpm run fetch` to download content AND media
3. Media files are placed directly in `public/media/`
4. Reference media in MDX using `/media/` paths
5. Commit media files to git for version control

### Media File Structure

```
public/
  media/             # Downloaded from LeadCMS (committed to git)
    common/          # Shared assets
      logo.svg
      icon.png
    blog/            # Blog-specific media
      article-1/
        cover.jpg
        diagram.png
    services/        # Service page media
      service-1/
        hero-image.jpg
```

**Important:** Media files are committed to git to preserve version history. This is different from some CMS approaches - we want git-based version control for all assets.

### Using Media in MDX

```mdx
---
title: "My Blog Post"
coverImageUrl: "/media/blog/my-post/cover.jpg"
---

# Article Title

<Image
  src="/media/blog/my-post/diagram.png"
  alt="Architecture Diagram"
  width={800}
  height={600}
/>

Regular markdown images also work:
![Screenshot](/media/blog/my-post/screenshot.png)
```

### Using Media in Components

```tsx
import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/media/common/logo.svg"
      alt="Company Logo"
      width={200}
      height={50}
      // Required for static export
      unoptimized={true}
    />
  )
}
```

**Note:** When using `output: "export"`, Next.js Image optimization is disabled. Set `images: { unoptimized: true }` in `next.config.mjs`.

### Media Best Practices

1. **Upload through LeadCMS admin** - Don't manually place files in public/media/
2. **Use relative paths** - Always start with `/media/`
3. **Organize by content** - Use folders matching content structure (common/, blog/, services/)
4. **Optimize before upload** - LeadCMS doesn't auto-optimize images
5. **Use Next.js Image component** - For automatic optimization in Next.js
6. **Commit media files** - Media is version-controlled in git for history tracking
7. **Run fetch before committing** - Ensure latest media is synced with `pnpm run fetch`

### Media Configuration in Frontmatter

```yaml
---
coverImageUrl: '/media/blog/article/cover.jpg'
coverImageAlt: 'Cover image description'
---
```

These fields are used by templates to display featured images, social media previews, and SEO metadata.

### Troubleshooting Media

**Images not loading:**
1. Run `pnpm run fetch` to sync media from LeadCMS
2. Check file exists in `public/media/`
3. Verify path starts with `/media/` (not `./media/` or `media/`)
4. Check browser console for 404 errors

**Images not updating:**
1. Run `pnpm run fetch` to get latest media from LeadCMS
2. Check if file was updated in `public/media/`
3. Restart dev server to clear cache
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

## Environment Variables

```bash
# .env (never commit this file)
NEXT_PUBLIC_LEADCMS_URL=https://admin.example.com
LEADCMS_API_KEY=your-secret-key-here  # No NEXT_PUBLIC_ prefix!
LEADCMS_DEFAULT_LANGUAGE=en
```

## Key Reminders When Assisting

1. **No hardcoded content** - Move ALL content to `.leadcms/content/`
2. **Content inside tags** - Never use JSON props for content
3. **Fail builds** - Never use fallback content
4. **String support** - Accept string identifiers (icons, variants) in props
5. **Semantic names** - Use clear, descriptive component names
6. **Structure over URLs** - Design content types by structure, not URL patterns
7. **Standard types first** - Use standard content types before creating custom ones
8. **Static export compatible** - No server-side features, all logic must work at build time

## Package Manager

This project uses **pnpm**. Always use:
- `pnpm install` (not npm install) - Install dependencies
- `pnpm add <package>` (not npm install) - Add a dependency
- `pnpm run <script>` (not npm run) - Run a package.json script
- `pnpm exec <command>` - Execute a command from installed dependencies
- `pnpm dlx <command>` (not npx) - Download and execute a package temporarily

**Key Difference:**
- `pnpm exec` only runs commands from **installed** dependencies in `node_modules/.bin`
- `pnpm dlx` downloads and runs packages **on-the-fly** (like `npx`)
