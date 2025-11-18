import { Loader2 } from 'lucide-react'

export const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-et-background">
    <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow">
      <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-600">Loading your dashboard…</p>
    </div>
  </div>
)
