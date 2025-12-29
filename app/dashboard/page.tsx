'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { canAccessDashboard } from '@/lib/auth-utils'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import UserList from '@/components/dashboard/UserList'
import RequestList from '@/components/dashboard/RequestList'
import MarketAnalysisList from '@/components/dashboard/MarketAnalysisList'
import VipDashboardPreviewList from '@/components/dashboard/VipDashboardPreviewList'

export default function DashboardPage() {
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'marketAnalysis' | 'vipPreviews'>('users')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Redirect if not admin (dashboard is admin-only)
  useEffect(() => {
    if (!isLoading && isAuthenticated && !canAccessDashboard(user)) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-accent">Loading...</div>
      </main>
    )
  }

  // Don't render content if not authenticated or not admin (will redirect)
  if (!isAuthenticated || !canAccessDashboard(user)) {
    return null
  }

  const tabs = [
    { id: 'users' as const, label: t('dashboard.tabs.users'), icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: 'requests' as const, label: t('dashboard.tabs.requests'), icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )},
    { id: 'marketAnalysis' as const, label: t('dashboard.tabs.marketAnalysis'), icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'vipPreviews' as const, label: t('dashboard.tabs.vipPreviews'), icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )},
  ]

  return (
    <main className="min-h-screen bg-primary-dark">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl font-bold text-base-white mb-1 sm:mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-accent text-fluid-sm sm:text-fluid-base">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Tabs - Horizontal scrollable on mobile */}
        <div className="relative mb-6 sm:mb-8">
          {/* Gradient fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary-dark to-transparent pointer-events-none z-10 sm:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary-dark to-transparent pointer-events-none z-10 sm:hidden"></div>
          
          <div className={`horizontal-scroll -mx-4 px-4 sm:mx-0 sm:px-0`}>
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-1 sm:space-x-2 border-b border-accent/20 min-w-max sm:min-w-0`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 
                    font-medium text-xs sm:text-sm md:text-base
                    transition-all duration-200 whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-base-white border-b-2 border-accent bg-accent/5'
                      : 'text-accent/70 hover:text-base-white hover:bg-accent/5'
                    }
                  `}
                >
                  <span className={`${activeTab === tab.id ? 'text-accent' : 'text-accent/50'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Tab Indicator */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center gap-2 text-xs text-accent/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Swipe to see more tabs</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden">
          {activeTab === 'users' && <UserList />}
          {activeTab === 'requests' && <RequestList />}
          {activeTab === 'marketAnalysis' && <MarketAnalysisList />}
          {activeTab === 'vipPreviews' && <VipDashboardPreviewList />}
        </div>
      </div>
      <Footer />
    </main>
  )
}
