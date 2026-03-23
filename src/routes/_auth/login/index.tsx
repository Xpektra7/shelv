import { LoginForm } from '#/components/web/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  )
}
