import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export const MonthSelector = ({ currentMonth, onMonthChange }: MonthSelectorProps) => {
  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  const goToCurrentMonth = () => {
    onMonthChange(new Date())
  }

  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && 
                         currentMonth.getFullYear() === new Date().getFullYear()

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm sm:p-4">
      <button
        onClick={goToPreviousMonth}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 sm:h-10 sm:w-10"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{monthName}</h2>
        {!isCurrentMonth && (
          <button
            onClick={goToCurrentMonth}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 sm:text-sm"
          >
            Go to current month
          </button>
        )}
      </div>

      <button
        onClick={goToNextMonth}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 sm:h-10 sm:w-10"
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
