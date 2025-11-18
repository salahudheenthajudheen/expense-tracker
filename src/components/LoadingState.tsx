import { Loader2 } from 'lucide-react'

export const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-et-background dark:bg-slate-900">
    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 px-6 py-4 shadow">
      <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading your dashboard…</p>
    </div>
  </div>
)
