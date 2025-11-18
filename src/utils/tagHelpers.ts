import type { LucideIcon } from 'lucide-react'
import {
  Circle,
  Coffee,
  Fuel,
  PartyPopper,
  Plane,
  ShoppingBag,
  Receipt,
  UtensilsCrossed,
  MapPin,
} from 'lucide-react'
import type { ExpenseTag } from '../types/expenses'

export const TAG_ICON_MAP: Record<ExpenseTag, LucideIcon> = {
  Fuel,
  Snacks: Coffee,
  Trip: MapPin,
  Travel: Plane,
  Food: UtensilsCrossed,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: PartyPopper,
  Others: Circle,
}

export const TAG_BG_MAP: Record<ExpenseTag, string> = {
  Fuel: 'bg-amber-100 text-amber-700',
  Snacks: 'bg-pink-100 text-pink-700',
  Trip: 'bg-purple-100 text-purple-700',
  Travel: 'bg-sky-100 text-sky-700',
  Food: 'bg-emerald-100 text-emerald-700',
  Shopping: 'bg-rose-100 text-rose-700',
  Bills: 'bg-slate-100 text-slate-700',
  Entertainment: 'bg-indigo-100 text-indigo-700',
  Others: 'bg-gray-100 text-gray-700',
}

export const getTagIcon = (tag: ExpenseTag) => TAG_ICON_MAP[tag]
export const getTagStyles = (tag: ExpenseTag) => TAG_BG_MAP[tag]

export const TAG_HEX_COLOR_MAP: Record<ExpenseTag, string> = {
  Fuel: '#fb923c',
  Snacks: '#f472b6',
  Trip: '#c084fc',
  Travel: '#38bdf8',
  Food: '#34d399',
  Shopping: '#fb7185',
  Bills: '#94a3b8',
  Entertainment: '#818cf8',
  Others: '#9ca3af',
}

export const getTagHex = (tag: ExpenseTag) => TAG_HEX_COLOR_MAP[tag]
