// Server page for `/editor` — render a client-side auth gate which
// determines whether to show the editor or redirect to login.
export const dynamic = 'force-dynamic'

import EditorGate from '@/components/editor/EditorGate'

export default function Page() {
  return <EditorGate />
}
