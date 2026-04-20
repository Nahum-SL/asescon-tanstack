import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/services/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/services/create"!</div>
}
