'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { submitCallbackRequest } from '@/app/actions/form-actions'

interface StepContent {
  heading: string
  content: React.ReactNode
}

export default function AboutJourney() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [contentKey, setContentKey] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const totalSteps = 4

  const handleClose = useCallback(() => {
    router.push('/')
  }, [router])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await submitCallbackRequest(fullName, email, phoneNumber)
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message })
        // Reset form
        setFullName('')
        setEmail('')
        setPhoneNumber('')
        // Close form and navigate home after 3 seconds
        setTimeout(() => {
          setShowContactForm(false)
          setSubmitMessage(null)
          router.push('/')
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = useCallback(() => {
    if (activeStep < totalSteps - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveStep(prev => prev + 1)
        setContentKey(prev => prev + 1)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 300)
    }
  }, [activeStep, isTransitioning])

  const handleBack = useCallback(() => {
    if (activeStep > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveStep(prev => prev - 1)
        setContentKey(prev => prev + 1)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 300)
    }
  }, [activeStep, isTransitioning])

  // Click anywhere to advance (except on buttons/arrows)
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      !target.closest('.nav-arrow') &&
      !target.closest('.action-button') &&
      activeStep < totalSteps - 1 &&
      !isTransitioning
    ) {
      handleNext()
    }
  }, [activeStep, isTransitioning, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handleBack()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleNext, handleBack])

  // Scroll-based navigation
  useEffect(() => {
    let lastScrollTime = 0
    let scrollTimeout: NodeJS.Timeout | null = null
    const scrollCooldown = 800 // Minimum time between scroll-triggered step changes (ms)

    const handleWheel = (e: WheelEvent) => {
      // Don't interfere with form interactions
      const target = e.target as HTMLElement
      if (target.closest('input') || target.closest('textarea') || target.closest('form')) {
        return
      }

      // Prevent default scrolling
      e.preventDefault()

      const now = Date.now()
      
      // Throttle scroll events
      if (now - lastScrollTime < scrollCooldown) {
        return
      }

      // Clear any pending scroll timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Debounce to handle rapid scrolls
      scrollTimeout = setTimeout(() => {
        const deltaY = e.deltaY

        if (deltaY > 0 && activeStep < totalSteps - 1 && !isTransitioning) {
          // Scrolling down - go to next step
          lastScrollTime = now
          handleNext()
        } else if (deltaY < 0 && activeStep > 0 && !isTransitioning) {
          // Scrolling up - go to previous step
          lastScrollTime = now
          handleBack()
        }
      }, 100)
    }

    // Also handle touchpad/mouse wheel
    const handleTouchStart = (e: TouchEvent) => {
      // Store initial touch position for swipe detection
      const touch = e.touches[0]
      let startY = touch.clientY

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        const deltaY = startY - touch.clientY

        if (Math.abs(deltaY) > 50) {
          const now = Date.now()
          if (now - lastScrollTime < scrollCooldown) {
            return
          }

          if (deltaY > 0 && activeStep < totalSteps - 1 && !isTransitioning) {
            // Swipe up - go to next step
            lastScrollTime = now
            handleNext()
          } else if (deltaY < 0 && activeStep > 0 && !isTransitioning) {
            // Swipe down - go to previous step
            lastScrollTime = now
            handleBack()
          }

          document.removeEventListener('touchmove', handleTouchMove)
          document.removeEventListener('touchend', handleTouchEnd)
        }
      }

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [activeStep, isTransitioning, handleNext, handleBack, totalSteps])

  const progress = ((activeStep + 1) / totalSteps) * 100

  const stepContents: StepContent[] = [
    {
      heading: 'WE SAW THE CHAOS.',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
            The market isn't designed for you to win. It's a system built on asymmetry—where institutions have the edge, 
            the data, and the algorithms. Retail traders are left navigating a battlefield without a map.
          </p>
          <p className="text-base md:text-lg text-white/60 leading-relaxed">
            We watched millions lose their savings, their dreams, their futures—not because they lacked ambition, 
            but because they lacked the tools that the 1% have always kept for themselves.
          </p>
        </div>
      )
    },
    {
      heading: 'WE FOUND THE EDGE.',
      content: (
        <div className="space-y-8 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
            Through years of institutional analysis, we've reverse-engineered the strategies that move markets. 
            We've built the systems that predict trends before they become trends.
          </p>
          <div className="relative h-64 bg-black/20 rounded-lg border border-cyan-500/20 p-6 backdrop-blur-sm">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Grid */}
              <g opacity="0.2">
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={`y-${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                ))}
                {[0, 100, 200, 300, 400].map((x) => (
                  <line key={`x-${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                ))}
              </g>
              {/* Trading line */}
              <path
                d="M 0 150 Q 100 120 200 90 T 400 30"
                fill="none"
                stroke="url(#journeyGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-draw-path"
                filter="url(#glow)"
              />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      )
    },
    {
      heading: 'BEYOND THE NUMBERS.',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
            This isn't just about profits. It's about transformation. Every signal, every analysis, every trade 
            represents a life changed—a family secured, a dream realized, a future rewritten.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { label: 'Lives Changed', value: '10,000+' },
              { label: 'Success Rate', value: '94%' },
              { label: 'Avg. Returns', value: '3.2x' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-black/20 rounded-lg border border-cyan-500/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-white/60 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      heading: 'THE MOMENT OF TRUTH.',
      content: (
        <div className="space-y-12 max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Are you ready to join the 1%?
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                setShowContactForm(true)
              }}
              className="action-button group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg uppercase tracking-wider rounded-lg overflow-visible transition-all duration-300 hover:scale-105"
            >
              {/* Blue Fire Effect Layers - Around entire border */}
              {isButtonHovered && (
                <>
                  {/* Outer Blue Fire Glow - Reduced Intensity */}
                  <div className="absolute inset-[-20px] rounded-lg animate-fire-glow pointer-events-none z-[-1]">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/40 via-blue-400/40 to-cyan-400/40 blur-lg animate-fire-flicker" />
                    <div className="absolute inset-[-5px] rounded-lg bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 blur-lg animate-fire-flicker-delayed" />
                  </div>
                  
                  {/* Blue Fire Particles Around Border - Reduced Count */}
                  {[...Array(16)].map((_, i) => {
                    // Distribute particles around the entire border perimeter
                    const angle = (i / 16) * 360 // Full circle
                    const radius = 50 // Distance from center
                    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius
                    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius
                    return (
                      <div
                        key={`blue-fire-${i}`}
                        className="absolute w-2 h-2 rounded-full animate-fire-particle pointer-events-none z-[-1]"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          animationDelay: `${i * 0.1}s`,
                          background: `radial-gradient(circle, rgba(6, 182, 212, ${0.6 - i * 0.03}), rgba(59, 130, 246, ${0.4 - i * 0.03}), transparent)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )
                  })}
                  
                  {/* Blue Fire Flames Around Entire Border - Reduced Count */}
                  {[...Array(12)].map((_, i) => {
                    // Distribute flames around the entire border
                    const angle = (i / 12) * 360 // Full circle
                    const radius = 48 // Distance from center
                    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius
                    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius
                    const rotation = angle + 90 // Point outward
                    return (
                      <div
                        key={`blue-flame-${i}`}
                        className="absolute w-4 h-8 pointer-events-none z-[-1]"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                          background: `linear-gradient(to top, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.3), transparent)`,
                          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                          filter: 'blur(1.5px)',
                          animation: `fire-flame-rotate 0.4s ease-in-out infinite`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    )
                  })}
                  
                  {/* Inner Blue Fire Glow on Button Surface - Reduced */}
                  <div className="absolute inset-0 rounded-lg pointer-events-none z-0">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/15 via-blue-400/15 to-cyan-400/15 blur-sm animate-fire-surface" />
                  </div>
                </>
              )}
              {/* Button Background Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl z-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              {/* Button Text - On Top */}
              <span className="relative z-10">YES, I'M READY</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push('/')
              }}
              className="action-button px-12 py-4 bg-black/40 backdrop-blur-sm border border-white/20 text-white font-bold text-lg uppercase tracking-wider rounded-lg transition-all duration-300 hover:border-cyan-500/50 hover:bg-black/60"
            >
              NOT YET
            </button>
          </div>
        </div>
      )
    }
  ]

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Stable random positions for background elements
  const tickerPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      top: Math.random() * 80,
      left: Math.random() * 100
    }))
  }, [])

  const candlePositions = useMemo(() => {
    return Array.from({ length: 32 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      height: 20 + Math.random() * 40
    }))
  }, [])

  return (
    <div
      className={`relative min-h-screen bg-[#010409] overflow-hidden cursor-pointer about-page-content ${
        isMounted ? 'about-entered' : 'about-entering'
      }`}
      onClick={handleClick}
      style={{ overflow: 'hidden', height: '100vh' }}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full hover:border-cyan-500/50 hover:bg-black/60 transition-all duration-300 group"
        aria-label="Close"
      >
        <svg className="w-6 h-6 text-white/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-black/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Background Elements */}
      {/* Market Heatmap Glow */}
      <div className={`absolute inset-0 transition-all duration-500 ${isButtonHovered ? 'opacity-60' : 'opacity-30'}`}>
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] transition-all duration-500 ${isButtonHovered ? 'animate-pulse-fast' : 'animate-pulse'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] transition-all duration-500 ${isButtonHovered ? 'animate-pulse-fast' : ''}`} />
      </div>

       {/* Floating Tickers */}
       <div className="absolute inset-0 opacity-100 pointer-events-none">
         {['BTC', 'ETH', 'SAGE', 'GOLD', 'NY', ...(isButtonHovered ? ['XAU', 'SPX', 'NDX', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'NZD', 'BTC', 'ETH', 'LTC', 'XRP', 'ADA'] : [])].map((ticker, i) => {
           const pos = tickerPositions[i % tickerPositions.length]
           return (
             <div
               key={`ticker-${i}`}
               className={`absolute text-[10px] font-mono font-bold text-white/10 select-none ${isButtonHovered ? 'animate-float-fast' : 'animate-float-slow'}`}
               style={{
                 left: `${pos.left}%`,
                 top: `${pos.top}%`,
                 animationDelay: `${i * (isButtonHovered ? 0.2 : 1.5)}s`,
                 opacity: isButtonHovered ? 0.3 : 0.1,
                 transition: 'opacity 0.5s ease'
               }}
             >
               {ticker} <span className="text-cyan-400/40">▲</span>
             </div>
           )
         })}
         {/* Floating Candlesticks */}
         {[...Array(isButtonHovered ? 32 : 8)].map((_, i) => {
           const pos = candlePositions[i % candlePositions.length]
           return (
             <div
               key={`candle-${i}`}
               className={`absolute w-[2px] bg-cyan-500/20 pointer-events-none ${isButtonHovered ? 'animate-candle-drift-fast' : 'animate-candle-drift'}`}
               style={{
                 height: `${pos.height}px`,
                 left: `${pos.left}%`,
                 top: `${pos.top}%`,
                 animationDelay: `${i * (isButtonHovered ? 0.15 : 0.8)}s`,
                 opacity: isButtonHovered ? 0.5 : 0.2,
                 transition: 'opacity 0.5s ease'
               }}
             >
               <div className="absolute top-1/4 left-[-2px] w-[6px] h-[50%] bg-cyan-500/40 rounded-sm" />
             </div>
           )
         })}
       </div>


      {/* Navigation Arrows */}
      {activeStep > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleBack()
          }}
          className="nav-arrow fixed left-8 top-1/2 -translate-y-1/2 z-40 w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full hover:border-cyan-500/50 hover:bg-black/60 transition-all duration-300 group"
          aria-label="Previous step"
        >
          <svg className="w-8 h-8 text-white/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {activeStep < totalSteps - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="nav-arrow fixed right-8 top-1/2 -translate-y-1/2 z-40 w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full hover:border-cyan-500/50 hover:bg-black/60 transition-all duration-300 group"
          aria-label="Next step"
        >
          <svg className="w-8 h-8 text-white/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl">
          <div
            key={contentKey}
            className={`journey-content transition-all duration-500 ${
              isTransitioning
                ? 'opacity-0 blur-xl scale-95 translate-y-10'
                : 'opacity-100 blur-0 scale-100 translate-y-0'
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-12 text-center tracking-tight">
              {stepContents[activeStep].heading}
            </h1>
            <div className="mt-8">
              {stepContents[activeStep].content}
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              if (!isTransitioning) {
                setIsTransitioning(true)
                setTimeout(() => {
                  setActiveStep(i)
                  setContentKey(prev => prev + 1)
                  setTimeout(() => setIsTransitioning(false), 50)
                }, 300)
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeStep
                ? 'w-8 bg-cyan-500'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContactForm(false)
              setSubmitMessage(null)
            }
          }}
        >
          <div className="relative w-full max-w-md bg-[#010409] border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Close button for modal */}
            <button
              onClick={() => {
                setShowContactForm(false)
                setSubmitMessage(null)
                setFullName('')
                setEmail('')
                setPhoneNumber('')
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-colors"
              aria-label="Close form"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
            <p className="text-white/60 mb-6">Fill out the form and we'll contact you soon.</p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-white/40 disabled:opacity-50 disabled:cursor-not-allowed" 
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-white/40 disabled:opacity-50 disabled:cursor-not-allowed" 
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-white/40 disabled:opacity-50 disabled:cursor-not-allowed" 
                required
                onClick={(e) => e.stopPropagation()}
              />
              
              {submitMessage && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowContactForm(false)
                    setSubmitMessage(null)
                    setFullName('')
                    setEmail('')
                    setPhoneNumber('')
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-black/40 text-white font-bold py-4 rounded-xl hover:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

