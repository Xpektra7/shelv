# Shelf

> A personal resource manager for developers — save articles, inspirations, snippets, and repos. Summarize and organize them with AI.

---

## Overview

Shelf is a full-stack web app that lets developers build a private, searchable library of web content. Paste a URL and Shelf scrapes the page, generates an AI summary, and auto-tags it — so finding things later is actually fast.

---

## Features

### Current

- **Save URLs** into a personal reading library with scraped metadata
- **Bulk import** links discovered from any website
- **AI summaries** generated from scraped content via OpenRouter
- **Auto-tagging** derived from article summaries
- **Search** across titles, tags, and status
- **Authentication-backed dashboard** — your library is private by default

### Upcoming

- **Code snippet saving** — save and organize code blocks with syntax highlighting and one-click copy
- **GitHub repo cards** — paste a repo URL to auto-pull stars, language, description, and last updated date
- **Collections** — group resources by project or topic (e.g. "Auth research", "Side project ideas")
- **Bookmark websites** — Bookmark inspirational websites or components libraries
- **Read-later queue** — a dev inbox to triage links before filing them
- **Status tagging** — mark items as `reading`, `done`, `revisit`, or `abandoned`
- **Duplicate detection** — get alerted when saving a resource you already have
- **Export to Markdown** — dump any collection into a `.md` file for use in Notion, Obsidian, or docs

---

## Tech Stack

| Category | Tool |
|---|---|
| Framework | TanStack Start + TanStack Router |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Auth | Better Auth |
| Database | PostgreSQL via Prisma |
| Scraping | Firecrawl |
| AI | OpenRouter |
| Runtime | Bun |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A running PostgreSQL database
- API keys for Firecrawl and OpenRouter

### Environment

Create a `.env.local` file in the root:

```bash
DATABASE_URL=
BETTER_AUTH_SECRET=
FIRECRAWL_API_KEY=
AI_KEY=
```

### Setup

```bash
bun install
bun run db:generate
bun run db:push
bun run dev
```

App runs at `http://localhost:3000`.

---

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run test` | Run test suite |
| `bun run lint` | Run ESLint |
| `bun run format` | Check formatting with Prettier |
| `bun run check` | Format + lint fix |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:push` | Push schema to database |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:seed` | Seed the database |

---

## Project Structure

```
src/
├── routes/        # App routes and pages
├── components/    # Reusable UI components
├── data/          # Server functions and data access layer
├── schema/        # Zod validation schemas
└── lib/           # Shared integrations and helpers
prisma/
├── schema.prisma  # Database schema
├── migrations/    # Migration history
└── seed.ts        # Seed logic
```

---

## Contributing

Contributions are welcome, especially around the upcoming features listed above.

### How to contribute

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes — keep PRs focused and small
3. Ensure lint and format pass: `bun run check`
4. Open a pull request with a clear description of what you changed and why

### Good first areas

- Implementing a feature from the **Upcoming** list
- Improving search (fuzzy matching, filter by collection/status)
- UI polish and accessibility improvements
- Writing tests for server functions

### Guidelines

- Follow the existing file and folder conventions
- Server logic belongs in `src/data/` as server functions — avoid putting data access in components
- Keep components presentational where possible; data fetching goes through TanStack loaders

---

## Notes

- Auth middleware is enforced on all dashboard and AI routes.
- `DATABASE_URL` must be set before running any `db:*` commands.
- Scraping and AI enrichment (summary + tags) run server-side via TanStack server functions.

---

## License

MIT
