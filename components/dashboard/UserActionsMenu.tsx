'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface User {
  id: string
  name: string
  email: string
  user_type?: 'admin' | 'user' | 'member'
  type?: 'admin' | 'user' | 'member' | 'vip' | 'subscriber' | 'regular'
  status?: 'active' | 'inactive'
}

interface UserActionsMenuProps {
  user: User
  onEdit: () => void
  onChangeType: () => void
  onDelete: () => void
}

export default function UserActionsMenu({
  user,
  onEdit,
  onChangeType,
  onDelete,
}: UserActionsMenuProps) {
  const { t, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-primary-dark transition-colors text-accent hover:text-base-white"
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-secondary-surface border border-accent rounded-lg shadow-lg z-50 min-w-[180px] py-2`}
        >
          <button
            onClick={() => {
              onEdit()
              setIsOpen(false)
            }}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'} hover:bg-primary-dark transition-colors text-sm`}
          >
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-base-white">{t('dashboard.users.actions.edit')}</span>
          </button>

          <button
            onClick={() => {
              onChangeType()
              setIsOpen(false)
            }}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'} hover:bg-primary-dark transition-colors text-sm`}
          >
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span className="text-base-white">{t('dashboard.users.actions.changeType')}</span>
          </button>

          <div className="border-t border-accent border-opacity-20 my-1" />

          <button
            onClick={() => {
              onDelete()
              setIsOpen(false)
            }}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'} hover:bg-primary-dark transition-colors text-sm text-red-400`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>{t('dashboard.users.actions.delete')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

