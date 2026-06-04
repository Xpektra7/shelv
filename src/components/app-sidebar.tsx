import { NavPrimary } from '#/components/nav-primary'
import { NavUser } from '#/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/ui/sidebar'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Bookmark01Icon,
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
    icon: (
      <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} className="size-6" />
    ),
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    url: '/dashboard/import',
    icon: (
      <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} className="size-6" />
    ),
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    url: '/dashboard/discover',
    icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} className="size-6" />,
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground">
                <HugeiconsIcon
                  icon={Bookmark01Icon}
                  size={4}
                  className="size-4!"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Shelv</span>
                <span className="truncate text-xs">Your AI Knowledge Base</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
