'use client'

import Navbar from '#/components/web/Header'
import { GradientBars } from '#/components/gradient-bars'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { Link, createFileRoute } from '@tanstack/react-router'
import { buttonVariants } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

const features = [
  {
    title: 'Save URLs',
    description:
      'Capture articles, repos, and references before they disappear into tabs.',
  },
  {
    title: 'Summarize fast',
    description:
      'Get a concise AI summary without reading the whole page first.',
  },
  {
    title: 'Auto-tag everything',
    description: 'Shelf turns content into a library you can search later.',
  },
]

const workflow = [
  'Paste a link',
  'Shelf scrapes and summarizes',
  'Tags land with the item',
  'Search it again when you need it',
]

const upcoming = [
  'Code snippets',
  'GitHub repo cards',
  'Collections',
  'Read-later queue',
]

function App() {
  const { data } = authClient.useSession()
  const signedIn = Boolean(data?.session)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto overflow-y-hidden relative w-full flex justify-center h-[calc(100vh-8rem)]">
        <div className="max-w-4xl pt-32 text-center flex flex-col items-center">
          <h1 className="font-heading text-4xl leading-[0.95] text-center text-foreground sm:text-5xl lg:text-7xl">
            Save the web like a developer, not a browser.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Shelf turns URLs into a private, searchable library with summaries,
            tags, and enough structure to find things later.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={signedIn ? '/dashboard' : '/signup'}
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'px-8 ',
              )}
            >
              {signedIn ? 'Go to dashboard' : 'Get started'}
            </Link>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'px-8',
              )}
            >
              Login
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Articles, snippets, repos, and ideas. One library.
          </p>
        </div>
        <GradientBars
          animation="pulse"
          duration={3}
          colors={['var(--primary)', 'transparent']}
          className="opacity-70"
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6 md:pb-24 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              size="sm"
              className="bg-card/70 backdrop-blur"
            >
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  0{index + 1}
                </CardDescription>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6 md:pb-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Built for speed
            </p>
            <h2 className="mt-3 font-heading text-3xl tracking-tight text-foreground">
              One flow. No clutter.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Shelf keeps the work on your side simple: capture, enrich, search,
              repeat.
            </p>
          </div>

          <div className="grid gap-3 rounded-[calc(var(--radius)*2)] border border-border bg-card/70 p-4 shadow-xs backdrop-blur">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-[var(--radius)] px-2 py-2"
              >
                <div className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground">
                  0{index + 1}
                </div>
                <div className="text-sm text-foreground">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6 lg:px-8">
        <div className="rounded-[calc(var(--radius)*2)] border border-border bg-card/70 p-6 shadow-xs backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Next up
              </p>
              <h2 className="mt-3 font-heading text-2xl tracking-tight text-foreground md:text-3xl">
                The library gets deeper.
              </h2>
            </div>
            <Link
              to={signedIn ? '/dashboard' : '/signup'}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-[var(--radius)] px-4 text-sm font-medium transition-all',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              )}
            >
              {signedIn ? 'Go to dashboard' : 'Start now'}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {upcoming.map((item) => (
              <span
                key={item}
                className="rounded-[var(--radius)] border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
