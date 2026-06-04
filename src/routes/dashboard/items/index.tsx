import { Input } from '#/components/ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from '#/components/ui/select'
import { getItemsFn } from '#/data/item'
import { ItemsStatus } from '#/generated/prisma/enums'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense, useEffect, useState } from 'react'
import z from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import ItemsList from '#/components/web/items-list'
import ItemsSkeleton from '#/components/web/items-skeleton'

const itemsSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemsStatus)]).default('all'),
})

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => ({ streamedData: getItemsFn() }),
  validateSearch: zodValidator(itemsSearchSchema),
  head: () => ({
    meta: [
      {
        title: 'Saved Items | Shelv',
      },
      {
        property: 'og:title',
        comtent: 'Saved Items | Shelv',
      },
    ],
  }),
})

function RouteComponent() {
  const { streamedData } = Route.useLoaderData()
  const { status, q } = Route.useSearch()
  const [searchInput, setSearchInput] = useState(q)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    if (searchInput === q) return

    const timeoutId = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchInput, q, navigate])

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 md:px-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium">Saved Items</h1>
        <p className="text-muted-foreground">Your saved articles and content</p>
      </div>

      {/* Search an filter control */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by title or tags"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Select
          onValueChange={(value) => {
            navigate({
              search: (prev) => ({ ...prev, status: value as typeof status }),
            })
          }}
          items={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Failed', value: 'FAILED' },
            { label: 'Processing', value: 'PROCESSING' },
          ]}
        >
          <SelectTrigger>
            <SelectValue placeholder="FIlter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(ItemsStatus).map((status) => (
                <SelectItem value={status} key={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<ItemsSkeleton />}>
        <ItemsList data={streamedData} status={status} q={q} />
      </Suspense>
    </div>
  )
}
