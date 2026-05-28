import { Badge } from '#/components/ui/badge'
import { Button, buttonVariants } from '#/components/ui/button'
import { getItemById, saveSummaryAndGenerateTagsFn } from '#/data/item'
import { cn } from '#/lib/utils'
import {
  ArrowLeft02FreeIcons,
  Calendar,
  Clock01Icon,
  ExternalLink,
  LoaderCircle,
  SparklesIcon,
  User02Icon,
} from '@hugeicons/core-free-icons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { MessageResponse } from '#/components/ai-elements/message'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title || 'Item Detail',
      },
      {
        property: 'og:title',
        comtent: loaderData?.title || 'Item Detail',
      },
      {
        property: 'og:title',
        comtent: loaderData?.ogImage || 'Item Image',
      },
      {
        name: 'twitter:title',
        comtent: loaderData?.title || 'Item Detail',
      },
    ],
  }),
})

function RouteComponent() {
  const item = Route.useLoaderData()
  const router = useRouter()

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/summary',
    initialCompletion: item.summary ? item.summary : undefined,
    streamProtocol: 'text',
    body: {
      itemId: item.id,
    },
    onFinish: async (_prompt, completionText) => {
      await saveSummaryAndGenerateTagsFn({
        data: {
          id: item.id,
          summary: completionText,
        },
      })

      toast.success('Summary generated and saved')

      router.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleGenerateSummary() {
    if (!item.content) {
      toast.error('No content to summarize!')
      return
    }

    complete(item.content)
  }

  return (
    <div className="mx-auto p-8 md:px-16 max-w-6xl w-full space-y-6">
      <div className="flex">
        <Link
          to="/dashboard/items"
          className={buttonVariants({
            variant: 'ghost',
          })}
        >
          <HugeiconsIcon icon={ArrowLeft02FreeIcons} />
          Go Back
        </Link>
      </div>

      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <img
          src={
            item.ogImage ||
            `https://images.unsplash.com/photo-1778229231117-be0f44a41b8d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
          }
          alt={item.title || 'Article Thumbnail'}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-102"
        />
      </div>

      {/* Body */}
      <div className="space-y-3">
        {/* Title */}
        <h1 className="text-3xl font-medium tracking-tight">{item.title}</h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {item.author && (
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={User02Icon} className="size-6" />
              {item.author}
            </span>
          )}

          {item.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Calendar} className="size-6" />
              {new Date(item.publishedAt).toLocaleDateString('en-UK')}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} className="size-6" />
            Saved {new Date(item.createdAt).toLocaleDateString('en-UK')}
          </span>
        </div>
        {/* Metadata End */}

        <a
          href={item.url}
          target="_blank"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0!')}
        >
          View Original
          <HugeiconsIcon icon={ExternalLink} />
        </a>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Summary Section*/}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>
              <h2 className="tracking-wide text-primary">Summary</h2>
            </CardTitle>
            <CardAction>
              {item.content && !item.summary && (
                <Button disabled={isLoading} onClick={handleGenerateSummary}>
                  {isLoading ? (
                    <>
                      <HugeiconsIcon
                        icon={LoaderCircle}
                        className="animate-spin"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={SparklesIcon} />
                      Generate
                    </>
                  )}
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="">
            {completion || item.summary ? (
              <MessageResponse>{completion}</MessageResponse>
            ) : (
              <p>
                {item.content
                  ? 'No summary yet. Generate one with AI'
                  : 'No content available to summarize'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        {item.content && (
          <Accordion>
            <AccordionItem className="border-b border-border">
              <AccordionTrigger className="font-sans text-sm">
                View full content
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <MessageResponse>{item.content}</MessageResponse>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  )
}
