import { SignupForm } from '#/components/web/signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-sm">
      <SignupForm />
    </div>

  )
}
