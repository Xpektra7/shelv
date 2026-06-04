'use client'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar'
import { HugeiconsIcon } from '@hugeicons/react'
import { UnfoldMoreIcon, LogoutIcon } from '@hugeicons/core-free-icons'
import { cn, handleSignOut } from '#/lib/utils'
import { buttonVariants } from './ui/button'
import { useNavigate } from '@tanstack/react-router'
import type { User } from 'better-auth'

export function NavUser({ user }: { user: User }) {
  const { isMobile, state } = useSidebar()
  const navigate = useNavigate()
  const collapsed = state === 'collapsed'
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
              />
            }
          >
            <Avatar className={collapsed ? 'size-8' : undefined}>
              <AvatarImage
                src={
                  user.image ??
                  `https://api.dicebear.com/9.x/dylan/svg?seed=${user.name}`
                }
              />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="ml-auto size-4 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-md"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.image ??
                        `https://api.dicebear.com/9.x/dylan/svg?seed=${user.name}`
                      }
                    />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => await handleSignOut(navigate)}
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'w-full justify-start!',
              )}
            >
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
