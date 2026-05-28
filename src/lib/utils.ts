import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { authClient } from './auth-client'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleSignOut = async (
  navigate: (opts: { to: string }) => void,
) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        navigate({
          to: '/',
        })
        toast.success('Logged out successfully!')
      },
      onError: ({ error }) => {
        toast.error(error.message || 'Error Occured!')
      },
    },
  })
}
