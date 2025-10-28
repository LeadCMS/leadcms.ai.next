# LeadCMS.ai Next.js Site

A Next.js-based website powered by LeadCMS with support for multiple languages and static site generation.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (install with `npm install -g pnpm`)
- Docker (optional, for containerized deployment)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:LeadCMS/leadcms.ai.next.git
   cd leadcms.ai.next
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.sample .env
   ```

   Edit `.env` and configure the following variables:
   ```bash
   # LeadCMS Configuration
   NEXT_PUBLIC_LEADCMS_URL=https://admin.leadcms.ai

   # LeadCMS API Key (keep this private - no NEXT_PUBLIC_ prefix)
   LEADCMS_API_KEY=[Your LeadCMS API Key]

   # Default language for content
   NEXT_PUBLIC_LEADCMS_DEFAULT_LANGUAGE=en

   # Development Mode Configuration
   NEXT_PUBLIC_DEV_MODE=false
   ```

## 🛠️ Development

### Running Locally

Start the development server:

```bash
pnpm run dev
```

This command will:
1. Fetch content from LeadCMS (`pnpm run fetch`)
2. Generate environment JavaScript file (`pnpm run generate:env`)
3. Start the Next.js development server on `http://localhost:3000`

The site supports multiple languages with the following URL structure:
- English (default): `http://localhost:3000/`
- Danish: `http://localhost:3000/da/`
- Russian: `http://localhost:3000/ru/`
- Sinhala: `http://localhost:3000/si/`

### Development Features

- **Hot reloading**: Changes to code are automatically reflected
- **Content sync**: LeadCMS content is fetched automatically before starting
- **Multi-language support**: Navigate between different language versions
- **MDX support**: Full MDX component support for rich content

## 🏗️ Building for Production

### Standard Build

Create a production build:

```bash
pnpm run build
```

This will:
1. Fetch the latest content from LeadCMS
2. Generate static files optimized for production
3. Create an `out/` directory with the static site

### Serving the Build

Serve the production build locally:

```bash
pnpm run serve
```

This uses `pnpm dlx serve` which downloads and runs the `serve` package to serve the static files from the `out/` directory on `http://localhost:3000`.

> **Note:** `pnpm dlx` is equivalent to `npx` - it downloads and executes a package without permanently installing it.

## 🐳 Docker Deployment

### Production Docker Build

Build and run the production Docker container:

```bash
# Build the production image
pnpm run docker:build

# Run the production container
pnpm run docker:run
```

The site will be available at `http://localhost:3000`.

### Preview Mode with Docker

For development and preview purposes, you can run the site in preview mode which includes:
- Live content updates from LeadCMS
- Server-side rendering
- Real-time content synchronization

```bash
# Build the preview image
pnpm run docker:preview:build

# Run the preview container
pnpm run docker:preview:run
```

The preview mode includes:
- **nginx reverse proxy** on port 80
- **Next.js server** on internal port 3000
- **SSE watcher** for live LeadCMS content updates
- **Supervisor** managing all services

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server with content fetch |
| `pnpm run build` | Build for production |
| `pnpm run start` | Start production server |
| `pnpm run serve` | Serve static build locally (uses pnpm dlx) |
| `pnpm run fetch` | Manually fetch LeadCMS content |
| `pnpm run generate:env` | Generate environment JavaScript file |
| `pnpm run docker:build` | Build production Docker image |
| `pnpm run docker:run` | Run production Docker container |
| `pnpm run docker:preview:build` | Build preview Docker image |
| `pnpm run docker:preview:run` | Run preview Docker container |
| `pnpm run format` | Format code with Prettier |
| `pnpm run lint` | Run ESLint |

## 🌍 Multi-language Support

The site supports multiple languages:
- **English** (default): Content stored in `.leadcms/content/`
- **Other languages**: Content stored in `.leadcms/content/{language}/`

### Adding New Languages

1. Add the language route in `app/{language}/`
2. Configure the language in your LeadCMS instance
3. Content will be automatically fetched and organized by language

## 📝 Content Management

Content is managed through LeadCMS and automatically synchronized:

1. **Content Fetching**: Run `pnpm run fetch` to pull latest content
2. **Auto-sync**: Content is fetched automatically before builds
3. **Live Updates**: Preview mode supports real-time content updates via Server-Sent Events

### Preview/Development
Use preview mode for:
- Staging environments
- Live content preview
- Development with real-time updates

## 🔍 Troubleshooting

### Common Issues

1. **Missing environment variables**: Ensure `.env` is properly configured
2. **Content not loading**: Check LeadCMS API key and URL
3. **Build failures**: Run `pnpm run fetch` manually to debug content issues
4. **Docker issues**: Ensure environment variables are passed to containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `pnpm run dev`
5. Build and test with `pnpm run build`
6. Submit a pull request

---

Built with ❤️ using [Next.js](https://nextjs.org/) and [LeadCMS](https://leadcms.ai/)
