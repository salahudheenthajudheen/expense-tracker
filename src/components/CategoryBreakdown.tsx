import { PieChart as PieChartIcon } from 'lucide-react'
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategorySlice } from '../types/expenses'
import { formatCurrency } from '../utils/format'
import { getTagHex } from '../utils/tagHelpers'

interface CategoryBreakdownProps {
  data: CategorySlice[]
  total: number
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload as CategorySlice
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-xs shadow">
      <p className="font-semibold text-slate-900">{slice.tag}</p>
      <p className="text-slate-500">{formatCurrency(slice.amount)} · {slice.percent}%</p>
    </div>
  )
}

export const CategoryBreakdown = ({ data, total }: CategoryBreakdownProps) => (
  <section className="rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 sm:rounded-2xl sm:p-3">
        <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Category breakdown</h3>
        <p className="hidden text-sm text-slate-500 sm:block">Track where your rupees go.</p>
      </div>
    </div>

    {!data.length ? (
      <p className="mt-6 text-sm text-slate-500">Add a few expenses to unlock the chart.</p>
    ) : (
      <div className="mt-4 grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="tag"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((slice) => (
                  <Cell key={slice.tag} fill={getTagHex(slice.tag)} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2 sm:space-y-3">
          {data.map((slice) => (
            <li key={slice.tag} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
              <div>
                <p className="text-xs font-semibold text-slate-900 sm:text-sm">{slice.tag}</p>
                <p className="text-xs text-slate-500">{slice.percent}% of spend</p>
              </div>
              <p className="text-xs font-semibold text-slate-800 sm:text-sm">{formatCurrency(slice.amount)}</p>
            </li>
          ))}
        </ul>
      </div>
    )}

    <p className="mt-4 text-xs text-slate-500">Total tracked this month: {formatCurrency(total)}</p>
  </section>
)
