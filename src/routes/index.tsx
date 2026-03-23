import Navbar from '#/components/web/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Navbar />
    </main>
  )
}
