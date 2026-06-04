import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { cn } from '#/lib/utils'
import { buttonVariants } from '../ui/button'
import { authClient } from '#/lib/auth-client'
import { User } from './user'

export default function Navbar() {
  const { data, isPending } = authClient.useSession()
  return (
    <header className="sticky top-0 z-50 border-b border-border px-4 py-4 mx-4">
      <nav className="flex justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Bookmark02Icon} className="" size={24} />
          <span className="text-3xl font-heading">Shelv</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <span>...</span>
          ) : data?.session ? (
            <User user={data.user} />
          ) : (
            <>
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  'px-4',
                )}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
