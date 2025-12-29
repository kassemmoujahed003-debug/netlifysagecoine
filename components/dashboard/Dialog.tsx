'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: DialogProps) {
  const { isRTL } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-secondary-surface border border-accent rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent border-opacity-20">
          <h2 className={`text-xl font-bold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-accent hover:text-base-white transition-colors p-1 rounded-lg hover:bg-accent hover:bg-opacity-10"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} justify-end gap-4 p-6 border-t border-accent border-opacity-20`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

