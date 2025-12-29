'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SplashScreen() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)

  // Hide splash screen on products page
  useEffect(() => {
    if (pathname === '/products') {
      setIsVisible(false)
      setIsAnimating(false)
    }
  }, [pathname])

  // Stable random positions for tickers and candles
  const tickerPositions = useMemo(() => {
    return ['BTC', 'ETH', 'SAGE', 'USDT', 'SOL'].map((_, i) => ({
      left: 20 * i,
      top: 20 + Math.random() * 60
    }))
  }, [])

  const candlePositions = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      height: 30 + Math.random() * 50,
      left: Math.random() * 100,
      top: Math.random() * 100
    }))
  }, [])

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsPageLoaded(true)
    } else {
      const handleLoad = () => setIsPageLoaded(true)
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    const stageTimings = [600, 900] 
    if (currentStage < 2) {
      const timer = setTimeout(() => setCurrentStage(prev => prev + 1), stageTimings[currentStage])
      return () => clearTimeout(timer)
    }
  }, [currentStage])

  const handleInteraction = useCallback(() => {
    if (currentStage !== 2 || !isPageLoaded || isAnimating || !isVisible) return
    setIsAnimating(true)
    setTimeout(() => setIsVisible(false), 1000)
  }, [currentStage, isPageLoaded, isAnimating, isVisible])

  // Attach event listeners when ready for interaction
  useEffect(() => {
    if (isVisible && !isAnimating && currentStage === 2 && isPageLoaded) {
      const events = ['mousemove', 'click', 'keydown', 'touchstart']
      events.forEach(e => window.addEventListener(e, handleInteraction, { once: true }))
      return () => events.forEach(e => window.removeEventListener(e, handleInteraction))
    }
  }, [isVisible, isAnimating, handleInteraction, currentStage, isPageLoaded])

  // Auto-dismiss after timeout as fallback
  useEffect(() => {
    if (isVisible && !isAnimating && currentStage === 2 && isPageLoaded) {
      const autoDismissTimer = setTimeout(() => {
        if (isVisible && !isAnimating) {
          setIsAnimating(true)
          setTimeout(() => setIsVisible(false), 1000)
        }
      }, 5000) // Auto-dismiss after 5 seconds if no interaction
      return () => clearTimeout(autoDismissTimer)
    }
  }, [isVisible, isAnimating, currentStage, isPageLoaded])

  if (!isVisible) return null

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#010409] transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1)
      ${isAnimating ? 'opacity-0 scale-125 blur-2xl' : 'opacity-100 scale-100'}`}
    >
      {/* 1. ELECTRIC CYAN HEATMAP */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${currentStage >= 1 ? 'opacity-40' : 'opacity-0'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px]" />
      </div>

      {/* 2. TRADING ELEMENTS (Tickers & Candles) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${currentStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        {['BTC', 'ETH', 'SAGE', 'USDT', 'SOL'].map((ticker, i) => {
          const pos = tickerPositions[i]
          return (
            <div 
              key={i} 
              className="absolute text-[10px] font-mono font-bold text-cyan-500/20 select-none animate-float-slow"
              style={{ 
                left: `${pos.left}%`, 
                top: `${pos.top}%`, 
                animationDelay: `${i * 1.2}s` 
              }}
            >
              {ticker} <span className="text-cyan-400">▲</span>
            </div>
          )
        })}
        
        {/* Abstract Cyan Candlesticks */}
        {[...Array(12)].map((_, i) => {
          const pos = candlePositions[i]
          return (
            <div 
              key={`candle-${i}`}
              className="absolute w-[1px] bg-cyan-500/10 animate-candle-drift"
              style={{
                height: `${pos.height}px`,
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div className="absolute top-1/4 left-[-2.5px] w-[6px] h-[40%] bg-cyan-400/30 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]" />
            </div>
          )
        })}
      </div>

      {/* 3. LOGO & ICONOGRAPHY */}
      <div className="relative z-10 flex flex-col items-center">
        <div className={`relative transition-all duration-[750ms] ease-out ${currentStage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          {/* Pulsing Cyan Halo */}
          <div className="absolute inset-[-20px] rounded-full border border-cyan-500/30 animate-ping opacity-20" />
          <div className="absolute inset-[-10px] rounded-full border border-cyan-400/20 animate-spin-slow" />
          
          {/* Main Logo Shield */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-slate-950/40 backdrop-blur-3xl border border-cyan-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.2)]">
            <img
              src="/light.png"
              alt="SageCoin Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg' }}
            />
          </div>
        </div>

        {/* 4. TYPOGRAPHY */}
        <div className={`mt-12 text-center transition-all duration-500 delay-150 ${currentStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            TIME TO CHANGE YOUR LIFE
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 overflow-hidden">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <p className="text-cyan-400 font-bold text-sm tracking-[0.5em] uppercase">
              Financial Freedom
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>

        {/* 5. INTERACTION CALL */}
        <div className={`mt-24 transition-all duration-500 delay-350 ${currentStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
           <div className="px-6 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md animate-pulse">
             <p className="text-[11px] text-cyan-300 font-bold uppercase tracking-[0.4em]">
               Interact to Enter
             </p>
           </div>
        </div>
      </div>

      {/* 6. GROWTH CHART - Upward Trending Line */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          {/* Grid lines for chart context */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Subtle grid lines */}
          <line x1="0" y1="280" x2="1440" y2="280" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="0" y1="240" x2="1440" y2="240" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="0" y1="200" x2="1440" y2="200" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.1" />
          
          {/* Main growth line - smooth upward curve */}
          <motion.path
            d="M0,280 Q360,260 720,200 T1440,120"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: currentStage >= 1 ? 1 : 0,
              opacity: currentStage >= 1 ? 1 : 0
            }}
            transition={{ 
              duration: 1.5, 
              delay: 0.2, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Filled area under the line for depth */}
          <motion.path
            d="M0,280 Q360,260 720,200 T1440,120 L1440,280 Z"
            fill="url(#lineGradient)"
            fillOpacity="0.1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: currentStage >= 1 ? 1 : 0,
              opacity: currentStage >= 1 ? 1 : 0
            }}
            transition={{ 
              duration: 1.5, 
              delay: 0.2, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Animated data points along the line */}
          {[0, 360, 720, 1080, 1440].map((x, i) => {
            const y = 280 - (i * 40) - (i * 5)
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#22d3ee"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: currentStage >= 1 ? 1 : 0,
                  opacity: currentStage >= 1 ? 0.8 : 0
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.4 + (i * 0.2),
                  ease: "easeOut"
                }}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}