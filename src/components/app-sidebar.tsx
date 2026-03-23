import * as React from "react"

import { NavPrimary } from "#/components/nav-primary"
import { NavUser } from "#/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "#/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { CropIcon, PieChartIcon, Bookmark02Icon, FileImportIcon, MapsIcon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"
import type { NavPrimaryProps } from "#/lib/types"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <HugeiconsIcon icon={CropIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />
      ),
    },
  ],
}

const navItems: NavPrimaryProps[] = [
  {
    title: "Items",
    url: "/dashboard/items",
    icon: <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />,
  },
  {
    title: "Import",
    url: "/dashboard/import",
    icon: <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} />,
  },
  {
    title: "Discover",
    url: "/dashboard/discover",
    icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
  }

]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuButton size="lg" className="h-fit" render={
              <Link to="/" className="flex items-center gap-3">
                <div className="flex p-3 bg-primary rounded-md">
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-16" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-heading text-lg">Recall</h1>
                  <p className="text-xs">Your AI Knowledge Base</p>
                </div>
              </Link>
            }>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
