import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface BottomSheetProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Small delay to allow render before animating in
            requestAnimationFrame(() => setIsAnimating(true))
        } else {
            setIsAnimating(false)
            // Wait for animation to finish before hiding
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
            {/* Backdrop */}
            <div
                className={clsx(
                    'absolute inset-0 bg-slate-900/50 transition-opacity duration-300',
                    isAnimating ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={clsx(
                    'relative w-full rounded-t-2xl bg-white dark:bg-slate-800 p-4 shadow-xl transition-transform duration-300 ease-out',
                    isAnimating ? 'translate-y-0' : 'translate-y-full'
                )}
            >
                {/* Handle bar for visual cue */}
                <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />

                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto pb-safe">
                    {children}
                </div>
            </div>
        </div>
    )
}
