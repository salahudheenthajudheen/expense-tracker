import { Plus } from 'lucide-react'

interface MobileFABProps {
    onClick: () => void
    ariaLabel?: string
}

export function MobileFAB({ onClick, ariaLabel = 'Add new item' }: MobileFABProps) {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95 sm:hidden"
        >
            <Plus className="h-6 w-6" />
        </button>
    )
}
