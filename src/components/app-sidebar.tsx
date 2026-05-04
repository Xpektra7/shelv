import { NavPrimary } from '#/components/nav-primary'
import { NavUser } from '#/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from '#/components/ui/sidebar'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Bookmark02Icon,
  FileImportIcon,
  MapsIcon,
} from '@hugeicons/core-free-icons'
import { Link, linkOptions } from '@tanstack/react-router'
import type { NavPrimaryProps } from '#/lib/types'
import type { User } from 'better-auth'

const navItems: NavPrimaryProps[] = linkOptions([
  {
    title: 'Items',
    url: '/dashboard/items',
    icon: <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    url: '/dashboard/import',
    icon: <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    url: '/dashboard/discover',
    icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuButton
              size="lg"
              className="h-fit"
              render={
                <Link to="/" className="flex items-center gap-3">
                  <div className="flex p-3 bg-primary rounded-md">
                    <HugeiconsIcon icon={Bookmark02Icon} className="size-16" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-heading text-lg">Recall</h1>
                    <p className="text-xs">Your AI Knowledge Base</p>
                  </div>
                </Link>
              }
            ></SidebarMenuButton>
          </SidebarMenu>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
