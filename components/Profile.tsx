'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { getUserType } from '@/lib/auth-utils'
import Link from 'next/link'
import { useState } from 'react'

interface ProfileProps {
  isScrolled?: boolean
  onLogout?: () => void
}

export default function Profile({ isScrolled = false, onLogout }: ProfileProps) {
  const { t, isRTL } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    setIsOpen(false)
  }

  const userType = getUserType(user)
  const userTypeLabel = userType.charAt(0).toUpperCase() + userType.slice(1)

  // When navbar is white (not scrolled), use dark background
  const buttonStyles = isScrolled
    ? 'bg-secondary-surface bg-opacity-50 border border-accent border-opacity-30 text-base-white'
    : 'bg-primary-dark border border-primary-dark text-base-white'

  if (!isAuthenticated) {
    // Show login button when not authenticated
    return (
      <Link 
        href="/login" 
        className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2 flex-row-reverse' : 'space-x-2'} px-4 py-2 rounded-lg ${buttonStyles} hover:opacity-80 transition-all duration-200 text-sm font-medium`}
        style={isScrolled ? {
          background: 'rgba(207, 226, 243, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
        } : {
          background: '#182231',
          borderColor: '#182231',
          color: '#FFFFFF',
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span>{t('nav.login')}</span>
      </Link>
    )
  }

  // Show profile dropdown when authenticated
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2 flex-row-reverse' : 'space-x-2'} px-3 py-2 rounded-lg ${buttonStyles} hover:opacity-80 transition-all duration-200 text-sm font-medium`}
        style={isScrolled ? {
          background: 'rgba(207, 226, 243, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
        } : {
          background: '#182231',
          borderColor: '#182231',
          color: '#FFFFFF',
        }}
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline text-xs">{userTypeLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-secondary-surface border border-accent rounded-lg shadow-lg z-20 min-w-[200px]`}>
            <div className="px-4 py-3 border-b border-accent/20">
              <p className="text-xs text-accent/70">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 flex items-center ${isRTL ? 'space-x-reverse space-x-2 flex-row-reverse' : 'space-x-2'} hover:bg-primary-dark transition-colors rounded-b-lg text-sm font-medium text-base-white`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

