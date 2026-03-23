import { buttonVariants } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="border-b border-border py-2 w-full max-w-sm">
        <Link to="/" className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0')}>
          <HugeiconsIcon icon={ArrowLeft02Icon} />
          Back to Home
        </Link>
      </div>
      <Outlet />
    </div>);
}

