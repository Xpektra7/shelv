import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getSessionFn } from '#/data/session'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const session = await getSessionFn()

    return {
      user: session.user,
    }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 pxshrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex gap-2 px-8 md:px-16">
            <SidebarTrigger className="-ml-2" />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
