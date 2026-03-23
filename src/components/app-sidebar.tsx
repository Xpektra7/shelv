import * as React from "react"

import { NavMain } from "#/components/nav-main"
import { NavProjects } from "#/components/nav-projects"
import { NavUser } from "#/components/nav-user"
import { TeamSwitcher } from "#/components/team-switcher"
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
import { LayoutBottomIcon, AudioWave01Icon, CommandIcon, ComputerTerminalIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, CropIcon, PieChartIcon, MapsIcon, Bookmark02Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuButton size="lg" className="h-fit" render={
              <Link to="/">
                <div className="flex p-3 bg-primary rounded-md">
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-16" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-heading text-lg">Recall</h1>
                  <p className="text-xs">AI-powered recall assistant</p>
                </div>
              </Link>
            }>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
