import { Badge } from '#/components/ui/badge'
import { Button, buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from '#/components/ui/card'
import { copyToClipboard } from '#/lib/clipboard'
import {
  Copy01Icon,
  Delete01Icon,
  Folder02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useRouter } from '@tanstack/react-router'
import { use } from 'react'
import z from 'zod'
import { deleteUrlFn } from '#/data/item'
import type { getItemsFn } from '#/data/item'
import { ItemsStatus } from '#/generated/prisma/enums'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { toast } from 'sonner'

const itemsSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemsStatus)]).default('all'),
})

type ItemsSearch = z.infer<typeof itemsSearchSchema>

export default function ItemsList({
  data,
  status,
  q,
}: {
  data: ReturnType<typeof getItemsFn>
  status: ItemsSearch['status']
  q: ItemsSearch['q']
}) {
  const items = use(data)
  const router = useRouter()

  // Filtering itmes based on serach params
  const filteredItemStatus =
    status === 'all' ? items : items.filter((item) => item.status == status)

  const filteredItems =
    q === ''
      ? filteredItemStatus
      : filteredItemStatus.filter(
          (item) =>
            item.title?.toLowerCase().includes(q.toLowerCase()) ||
            item.tags.some((tag) =>
              tag.toLowerCase().includes(q.toLowerCase()),
            ),
        )
  // End of Filtering

  async function handleDeleteItem(id: string) {
    try {
      await deleteUrlFn({ data: { id: id } })
      router.invalidate()
      toast.success('Item deleted successfully!')
    } catch (error: any) {
      if (error?.message === 'Not Found' || error?.status === 404) {
        toast.error('Item not found!')
      } else {
        toast.error('Failed to delete item. Please try again.')
      }
    }
  }

  if (filteredItems.length === 0) {
    return (
      <Empty className="w-full border rounded-lg border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Folder02Icon} size={12} />
          </EmptyMedia>
          <EmptyTitle>
            {items.length === 0 ? 'No items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {items.length === 0
              ? 'Import a URL to get started with saving your content'
              : 'No items matching your current search filters'}
          </EmptyDescription>
        </EmptyHeader>
        {items.length === 0 ? (
          <EmptyContent>
            <Link
              className={buttonVariants({ variant: 'default' })}
              to="/dashboard/import"
            >
              Import URL
            </Link>
          </EmptyContent>
        ) : (
          ' '
        )}
      </Empty>
    )
  } else {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden transition-all pt-0"
          >
            <Link
              to={`/dashboard/items/$itemId`}
              params={{
                itemId: item.id,
              }}
              className="block"
            >
              <div className="aspect-video relative w-full overflow-hidden bg-muted">
                <img
                  src={
                    item.ogImage ||
                    'https://images.unsplash.com/photo-1778229231117-be0f44a41b8d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt={item.title || 'Article Thumbnail'}
                  className="h-full w-full transition-transform duration-300 object-cover group-hover:scale-102"
                />
              </div>
              <CardHeader className="pt-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      item.status === 'COMPLETED' ? 'default' : 'secondary'
                    }
                  >
                    {item.status}
                  </Badge>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async (e) => {
                        e.preventDefault()
                        await copyToClipboard(item.url)
                      }}
                    >
                      <HugeiconsIcon icon={Copy01Icon} className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async (e) => {
                        e.preventDefault()
                        handleDeleteItem(item.id)
                      }}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="size-5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="line-clamp-1 text-xl leading-snug group-hover:text-primary">
                  {item.title}
                </CardTitle>

                <p>{item.author === 'Unknown' ? 'Anonymous ' : item.author}</p>
                {item.summary && (
                  <CardDescription className="line-clamp-3 pt-4">
                    {item.summary}
                  </CardDescription>
                )}

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <Badge variant="secondary" key={tag}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    )
  }
}
