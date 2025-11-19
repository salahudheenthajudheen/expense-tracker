import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, PiggyBank } from 'lucide-react'
import { clsx } from 'clsx'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Savings', href: '/savings', icon: PiggyBank },
  ]

  return (
    <div className="min-h-screen bg-et-background dark:bg-slate-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Expense Tracker</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">ExpenseTracker</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe">
        <nav className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                  'flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors'
                )}
              >
                <item.icon className="mb-1 h-6 w-6" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
