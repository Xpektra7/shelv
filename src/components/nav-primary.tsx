import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar"
import type { NavPrimaryProps } from "#/lib/types"
import { Link } from "@tanstack/react-router"

export function NavPrimary({
  items,
}: { items: NavPrimaryProps[] }) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size="sm" className="h-fit" render={
                <Link to={item.url} className="flex items-center gap-3">
                  {item.icon}
                  {!isMobile && item.title}
                </Link>
              } />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
