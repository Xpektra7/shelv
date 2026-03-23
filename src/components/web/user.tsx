"use client"
import { handleSignOut } from "#/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Link, useNavigate } from "@tanstack/react-router"

export function User({ name }: { name?: string }) {
  const navigate = useNavigate()
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
          <DropdownMenuItem variant="destructive" onClick={async () => await handleSignOut(navigate)}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
