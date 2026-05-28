import { Card, CardHeader } from '#/components/ui/card'
import { Skeleton } from '../ui/skeleton'

export default function ItemsSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, e) => (
        <Card className="group overflow-hidden transition-all pt-0" key={e}>
          <Skeleton className="aspect-video relative w-full rounded-none overflow-hidden bg-muted" />
          <CardHeader className="pt-0 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="w-1/3 h-4" />
              <div className="flex gap-2">
                <Skeleton className="aspect-square h-6 rounded-sm" />
                <Skeleton className="aspect-square h-6 rounded-sm" />
              </div>
            </div>
            <Skeleton className="w-full h-6 rounded-sm" />

            <Skeleton className="w-1/3 h-4" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
