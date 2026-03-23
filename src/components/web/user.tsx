"use client"

import { authClient } from "#/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"

export function User({ name }: { name?: string }) {
  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out successfully!')
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      }
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="rounded-full"><Avatar>
          <AvatarFallback>{name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar></Button>} />
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem render={
            <Link to="/dashboard" className="w-full h-full flex gap-2 items-center">
              <HugeiconsIcon icon={DashboardCircleIcon} />
              Dashbord
            </Link>
          }></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
