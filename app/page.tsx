'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import UserDashboard from '@/components/UserDashboard'
import CoursesSection from '@/components/CoursesSection'
import MarketAnalysisSection from '@/components/MarketAnalysisSection'
import dynamic from 'next/dynamic'
import PublicCTASection from '@/components/PublicCTASection'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { isMember } from '@/lib/auth-utils'

// Dynamically import VipTradingSection with SSR disabled to prevent hydration issues
// Also provides better performance on initial load
const VipTradingSection = dynamic(() => import('@/components/VipTradingSection'), {
  ssr: false,
  loading: () => (
    <div className="py-12 sm:py-16 lg:py-20 flex items-center justify-center">
      <div className="text-accent/50 animate-pulse">Loading VIP Section...</div>
    </div>
  )
})

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if user is member (can access member/VIP content)
  const isMemberUser = isMember(user)
  
  const currentLeverage = user?.current_leverage || 100
  const currentLotSize = user?.current_lot_size || 0.1

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent hydration mismatch by waiting for auth to load
  if (isLoading) {
    return (
      <main className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="text-accent text-sm">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main 
      id="home-page"
      className="min-h-screen bg-primary-dark page-content"
      style={{
        // Critical: Use 'clip' instead of 'hidden' to prevent horizontal scroll
        // 'clip' doesn't create a scroll container, so sticky positioning still works
        overflowX: 'clip',
      }}
    >
      <Navbar />
      
      {/* 1. Hero Section - "Who We Are" */}
      <Hero />
      
      {/* 2. Market Analysis Section (Public) */}
      <MarketAnalysisSection />
      
      {/* 3. User Dashboard (Conditional - Only if Logged In) */}
      {isAuthenticated && (
        <UserDashboard 
          currentLeverage={currentLeverage}
          currentLotSize={currentLotSize}
        />
      )}
          
      {/* 4. VIP Trading Section - Scroll animated pinned section */}
      <div className="relative" style={{ overflow: 'visible' }}>
        <VipTradingSection isMember={isMemberUser} />
      </div>
            
      {/* 5. Courses Section - Scroll animated pinned section */}
      <div className="relative" style={{ overflow: 'visible' }}>
        <CoursesSection subscribedToCourses={isMemberUser} />
      </div>
      
      {/* 6. Public CTA Section */}
      <PublicCTASection />
      
      {/* 7. Footer */}
      <Footer />
    </main>
  )
}
