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
  CropIcon,
  PieChartIcon,
  Bookmark02Icon,
  FileImportIcon,
  MapsIcon,
} from '@hugeicons/core-free-icons'
import { Link, linkOptions } from '@tanstack/react-router'
import type { NavPrimaryProps } from '#/lib/types'
import { authClient } from "#/lib/auth-client"

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://avatar.vercel.sh/shadcn',
  },
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: <HugeiconsIcon icon={CropIcon} strokeWidth={2} />,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
    },
    {
      name: 'Travel',
      url: '#',
      icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    },
  ],
}

const navItems: NavPrimaryProps[] = linkOptions([
  {
    title: 'Items',
    to: '/dashboard/items',
    icon: <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    to: '/dashboard/import',
    icon: <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    to: '/dashboard/discover',
    icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isPending } = authClient.useSession()

  return (
    <Sidebar collapsible="icon" {...props}>
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
        <NavUser user={data ? { name: data.user.name, email: data.user.email } : { name: '', email: '' }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
