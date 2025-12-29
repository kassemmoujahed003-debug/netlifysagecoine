'use client'

import React, { useRef, useState, useEffect, RefObject, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { getVipDashboardPreviews } from '@/services/vipDashboardPreviewService'
import { VipDashboardPreview } from '@/types/database'

interface VipTradingSectionProps {
  isMember: boolean
  joinedVip?: boolean
}

// Breakpoint thresholds
const MOBILE_MAX = 768
const TABLET_MAX = 1024

// Helper component for Diamond Look
const DiamondLayers = ({ heroOpacity, children, breakpoint }: { 
  heroOpacity: MotionValue<number>, 
  children: React.ReactNode, 
  breakpoint: 'mobile' | 'tablet' | 'desktop' 
}) => {
  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet'
  
  return (
    <div className="relative w-full h-full will-change-transform">
      <div className={`absolute inset-0 rotate-45 bg-secondary-surface/90 border border-accent/30 ${
        isMobileOrTablet ? 'rounded-2xl' : 'rounded-[3rem]'
      } shadow-xl backdrop-blur-md flex items-center justify-center overflow-hidden transition-all duration-300`}>
        <div className="-rotate-45 w-full h-full flex items-center justify-center relative">
          {children}
        </div>
      </div>
      <motion.div
        style={{ opacity: heroOpacity }}
        className={`absolute inset-0 rotate-45 bg-gradient-to-br from-secondary-surface via-primary-dark to-primary-dark border-2 border-accent ${
          isMobileOrTablet 
            ? 'rounded-2xl shadow-[0_0_30px_-5px_rgba(var(--accent-rgb),0.4)]' 
            : 'rounded-[3rem] shadow-[0_0_60px_-10px_rgba(var(--accent-rgb),0.6)]'
        } flex items-center justify-center overflow-hidden z-10`}
      >
        <div className={`absolute ${isMobileOrTablet ? 'inset-2' : 'inset-4'} border border-accent/20 ${
          isMobileOrTablet ? 'rounded-xl' : 'rounded-[2.5rem]'
        } pointer-events-none`}></div>
        <div className="-rotate-45 w-full h-full flex items-center justify-center relative">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Payment Dialog Component
function PaymentDialog({ 
  isOpen, 
  onClose, 
  t, 
  isRTL 
}: { 
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
  isRTL: boolean
}) {
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

  const handlePaymentMethod = (method: 'wish' | 'usdt') => {
    // TODO: Implement payment logic
    console.log(`Selected payment method: ${method}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`relative bg-gradient-to-br from-secondary-surface via-primary-dark to-primary-dark border-2 border-accent/30 rounded-3xl shadow-[0_0_60px_-10px_rgba(var(--accent-rgb),0.6)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-white">
                    Choose Payment Method
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-accent hover:text-white transition-colors p-2 rounded-xl hover:bg-accent/10"
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
                <p className="text-accent/80 mb-6 text-center">
                  Select your preferred payment method to subscribe to VIP Trading
                </p>

                {/* Payment Options */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Wish Payment Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethod('wish')}
                    className="relative group bg-gradient-to-br from-secondary-surface/80 to-primary-dark/80 border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Inner border */}
                    <div className="absolute inset-2 border border-accent/20 rounded-xl pointer-events-none"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Icon/Logo placeholder */}
                        <div className="w-16 h-16 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Pay with Wish</h3>
                          <p className="text-sm text-accent/70">Use your Wish balance</p>
                        </div>
                      </div>
                      <div className="text-accent group-hover:translate-x-1 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>

                  {/* USDT Payment Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethod('usdt')}
                    className="relative group bg-gradient-to-br from-secondary-surface/80 to-primary-dark/80 border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Inner border */}
                    <div className="absolute inset-2 border border-accent/20 rounded-xl pointer-events-none"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Icon/Logo placeholder */}
                        <div className="w-16 h-16 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Pay with USDT</h3>
                          <p className="text-sm text-accent/70">Cryptocurrency payment</p>
                        </div>
                      </div>
                      <div className="text-accent group-hover:translate-x-1 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} justify-end gap-4 p-6 border-t border-accent/20`}>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-secondary-surface/50 border border-accent/20 text-white font-semibold rounded-xl hover:bg-secondary-surface/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Mobile-optimized static content (no scroll animation)
function MobileVipContent({ t, isRTL, onSubscribeClick }: { t: (key: string) => string, isRTL: boolean, onSubscribeClick: () => void }) {
  const steps = [
    { 
      step: '01', 
      color: 'accent',
      title: t('vip.unlockTitle'),
      description: t('vip.unlockDescription'),
      diamond: 'VIP ACCESS'
    },
    { 
      step: '02', 
      color: 'green-400',
      title: t('vip.realTimePrecision'),
      description: t('vip.realTimePrecisionDescription'),
      diamond: t('vip.liveSignals')
    },
    { 
      step: '03', 
      color: 'blue-400',
      title: t('vip.expertIntelligence'),
      description: t('vip.expertIntelligenceDescription'),
      diamond: t('vip.expertAnalysis')
    },
  ]

  return (
    <div className="py-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-accent font-mono text-xs tracking-widest uppercase mb-4">
          <span className="w-2 h-2 bg-accent rounded-full"></span> VIP Trading
        </div>
        <h2 className="text-fluid-3xl font-bold text-white mb-4">
          {t('vip.unlockTitle')}
        </h2>
        <p className="text-fluid-base text-accent/80 max-w-md mx-auto">
          {t('vip.unlockDescription')}
        </p>
      </div>

      {/* Steps Carousel */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary-surface/40 border border-accent/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              {/* Step Number */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${step.color}/20 flex items-center justify-center`}>
                <span className={`text-${step.color} font-mono font-bold text-sm`}>{step.step}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-accent/70">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <button 
          onClick={onSubscribeClick}
          className="btn-primary text-lg font-bold px-8 py-4 shadow-xl w-full sm:w-auto rounded-xl"
        >
          {t('vip.subscribe')}
        </button>
      </motion.div>
    </div>
  )
}

// Desktop/Tablet scroll-animated content with responsive pinning
function ScrollAnimatedContent({
  containerRef,
  t,
  isRTL,
  breakpoint,
  onSubscribeClick
}: {
  containerRef: RefObject<HTMLElement>
  t: (key: string) => string
  isRTL: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
  onSubscribeClick: () => void
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: breakpoint === 'tablet' ? 80 : 100,
    damping: breakpoint === 'tablet' ? 25 : 30,
    restDelta: 0.001
  })

  // Scale movement intensity based on breakpoint
  const movementScale = breakpoint === 'tablet' ? 0.75 : 1.0
  
  // Position transforms with scaled movement
  // Aligned with text opacity ranges: 0-0.25, 0.25-0.50, 0.50-0.75, 0.75-1.0
  const mainTop = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    "20%", 
    `${20 + (50 * movementScale)}%`, 
    `${20 + (50 * movementScale)}%`, 
    `${20 + (50 * movementScale)}%`,
    "20%"
  ])
  const mainLeft = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    "50%", 
    `${50 + (30 * movementScale)}%`, 
    `${50 + (30 * movementScale)}%`,
    `${50 - (30 * movementScale)}%`, 
    "50%"
  ])
  const mainScale = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    1.2 * (breakpoint === 'tablet' ? 0.9 : 1), 
    0.7, 
    0.7,
    0.7, 
    1.2 * (breakpoint === 'tablet' ? 0.9 : 1)
  ])
  const mainOpacity = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [1, 0.5, 0.5, 0.5, 1])
  const mainZIndex = useTransform(smoothProgress, [0, 0.20, 0.80, 1], [20, 10, 10, 20])
  const mainHeroOpacity = useTransform(smoothProgress, [0, 0.20, 0.25, 0.75, 0.80, 1], [1, 1, 0, 0, 1, 1])

  const leftTop = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    `${20 + (50 * movementScale)}%`, 
    "20%", 
    `${20 + (50 * movementScale)}%`, 
    `${20 + (50 * movementScale)}%`,
    `${20 + (50 * movementScale)}%`
  ])
  const leftLeft = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    `${50 - (30 * movementScale)}%`, 
    "50%", 
    `${50 + (30 * movementScale)}%`, 
    `${50 + (30 * movementScale)}%`,
    `${50 - (30 * movementScale)}%`
  ])
  const leftScale = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    0.7, 
    1.2 * (breakpoint === 'tablet' ? 0.9 : 1), 
    0.7, 
    0.7,
    0.7
  ])
  const leftOpacity = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [0.5, 1, 0.5, 0.5, 0.5])
  const leftZIndex = useTransform(smoothProgress, [0.20, 0.25, 0.45], [10, 20, 10])
  const leftHeroOpacity = useTransform(smoothProgress, [0.20, 0.25, 0.45], [0, 1, 0])

  const rightTop = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    `${20 + (50 * movementScale)}%`, 
    `${20 + (50 * movementScale)}%`, 
    "20%", 
    `${20 + (50 * movementScale)}%`,
    `${20 + (50 * movementScale)}%`
  ])
  const rightLeft = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    `${50 + (30 * movementScale)}%`, 
    `${50 - (30 * movementScale)}%`, 
    "50%", 
    `${50 + (30 * movementScale)}%`,
    `${50 + (30 * movementScale)}%`
  ])
  const rightScale = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [
    0.7, 
    0.7, 
    1.2 * (breakpoint === 'tablet' ? 0.9 : 1), 
    0.7,
    0.7
  ])
  const rightOpacity = useTransform(smoothProgress, [0, 0.25, 0.50, 0.75, 1], [0.5, 0.5, 1, 0.5, 0.5])
  const rightZIndex = useTransform(smoothProgress, [0.45, 0.50, 0.70], [10, 20, 10])
  const rightHeroOpacity = useTransform(smoothProgress, [0.45, 0.50, 0.70], [0, 1, 0])

  // Adjusted opacity ranges to eliminate blank screen gaps
  // Each step overlaps with the next for smooth crossfade transitions
  // Step 1: 0-25% visible (fade out from 22-25%)
  // Step 2: 22-50% visible (fade in 22-25%, hold, fade out 47-50%)
  // Step 3: 47-75% visible (fade in 47-50%, hold, fade out 72-75%)  
  // Step 4: 72-100% visible (fade in 72-75%, hold to end)
  const textOpacity1 = useTransform(smoothProgress, [0, 0.22, 0.25], [1, 1, 0])
  const textOpacity2 = useTransform(smoothProgress, [0.22, 0.25, 0.47, 0.50], [0, 1, 1, 0])
  const textOpacity3 = useTransform(smoothProgress, [0.47, 0.50, 0.72, 0.75], [0, 1, 1, 0])
  const textOpacity4 = useTransform(smoothProgress, [0.72, 0.75, 1.0], [0, 1, 1])

  const pointerEvents = useTransform(smoothProgress, (pos) => pos > 0.9 ? 'auto' : 'none')

  // Diamond and text sizes based on breakpoint
  const diamondSize = breakpoint === 'tablet' 
    ? 'w-40 h-40 md:w-48 md:h-48' 
    : 'w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64'
  
  const containerSize = breakpoint === 'tablet'
    ? 'w-[16rem] h-[16rem] md:w-[20rem] md:h-[20rem]'
    : 'w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem]'

  return (
    <div 
      className="sticky top-0 h-screen flex items-center justify-center will-change-transform"
      style={{ 
        // Prevent overflow issues with pinned content
        contain: 'layout style paint',
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-accent/5 rounded-full blur-[40px] md:blur-[60px] lg:blur-[80px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 lg:pt-24 pb-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center h-full ${isRTL ? 'lg:flex-row-reverse' : ''}`}>

          {/* === LEFT COLUMN: THE DIAMOND CLUSTER === */}
          <div className="relative flex items-center justify-center h-[300px] md:h-[400px] lg:h-[500px]">
            <div className={`relative ${containerSize}`}>

              {/* 1. MAIN DIAMOND */}
              <motion.div
                style={{ 
                  top: mainTop, 
                  left: mainLeft, 
                  scale: mainScale, 
                  zIndex: mainZIndex, 
                  opacity: mainOpacity, 
                  translateX: '-50%', 
                  translateY: '-50%' 
                }}
                className={`absolute ${diamondSize} will-change-transform`}
              >
                <DiamondLayers heroOpacity={mainHeroOpacity} breakpoint={breakpoint}>
                  <div className="flex flex-col items-center justify-center p-2 md:p-4 text-center">
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-white mb-1 md:mb-2 leading-none">VIP<br />ACCESS</h2>
                  </div>
                </DiamondLayers>
              </motion.div>

              {/* 2. LEFT DIAMOND */}
              <motion.div
                style={{ 
                  top: leftTop, 
                  left: leftLeft, 
                  scale: leftScale, 
                  zIndex: leftZIndex, 
                  opacity: leftOpacity, 
                  translateX: '-50%', 
                  translateY: '-50%' 
                }}
                className={`absolute ${diamondSize} will-change-transform`}
              >
                <DiamondLayers heroOpacity={leftHeroOpacity} breakpoint={breakpoint}>
                  <div className="flex flex-col items-center justify-center text-center p-2 md:p-4">
                    <h3 className="text-base md:text-2xl lg:text-3xl font-bold text-white leading-none mb-1 md:mb-2">{t('vip.liveSignals')}</h3>
                  </div>
                </DiamondLayers>
              </motion.div>

              {/* 3. RIGHT DIAMOND */}
              <motion.div
                style={{ 
                  top: rightTop, 
                  left: rightLeft, 
                  scale: rightScale, 
                  zIndex: rightZIndex, 
                  opacity: rightOpacity, 
                  translateX: '-50%', 
                  translateY: '-50%' 
                }}
                className={`absolute ${diamondSize} will-change-transform`}
              >
                <DiamondLayers heroOpacity={rightHeroOpacity} breakpoint={breakpoint}>
                  <div className="flex flex-col items-center justify-center text-center p-2 md:p-4">
                    <h3 className="text-base md:text-2xl lg:text-3xl font-bold text-white leading-none mb-1 md:mb-2">{t('vip.expertAnalysis')}</h3>
                  </div>
                </DiamondLayers>
              </motion.div>

            </div>
          </div>

          {/* === RIGHT COLUMN: THE CHANGING TEXT === */}
          <div className="relative h-[200px] md:h-[280px] lg:h-[300px] flex items-center justify-center lg:justify-start">

            {/* TEXT 1: INTRO */}
            <motion.div style={{ opacity: textOpacity1 }} className="absolute inset-0 flex flex-col justify-center space-y-2 md:space-y-3 lg:space-y-4 text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 text-accent font-mono text-xs md:text-sm tracking-widest uppercase mb-1 md:mb-2 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <span className="w-2 h-2 bg-accent rounded-full"></span> Step 01
              </div>
              <h2 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-5xl font-bold text-white leading-tight">
                {t('vip.unlockTitle')}
              </h2>
              <p className="text-fluid-sm md:text-fluid-base lg:text-fluid-lg text-accent/80 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {t('vip.unlockDescription')}
              </p>
            </motion.div>

            {/* TEXT 2: SIGNALS */}
            <motion.div style={{ opacity: textOpacity2 }} className="absolute inset-0 flex flex-col justify-center space-y-2 md:space-y-3 lg:space-y-4 pointer-events-none text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 text-green-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-1 md:mb-2 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span> Step 02
              </div>
              <h2 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-5xl font-bold text-white leading-tight">
                {t('vip.realTimePrecision')}
              </h2>
              <p className="text-fluid-sm md:text-fluid-base lg:text-fluid-lg text-accent/80 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {t('vip.realTimePrecisionDescription')}
              </p>
            </motion.div>

            {/* TEXT 3: ANALYSIS */}
            <motion.div style={{ opacity: textOpacity3 }} className="absolute inset-0 flex flex-col justify-center space-y-2 md:space-y-3 lg:space-y-4 pointer-events-none text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 text-blue-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-1 md:mb-2 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Step 03
              </div>
              <h2 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-5xl font-bold text-white leading-tight">
                {t('vip.expertIntelligence')}
              </h2>
              <p className="text-fluid-sm md:text-fluid-base lg:text-fluid-lg text-accent/80 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {t('vip.expertIntelligenceDescription')}
              </p>
            </motion.div>

            {/* TEXT 4: CTA */}
            <motion.div style={{ opacity: textOpacity4 }} className="absolute inset-0 flex flex-col justify-center space-y-2 md:space-y-3 lg:space-y-4 pointer-events-none text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 text-accent font-mono text-xs md:text-sm tracking-widest uppercase mb-1 md:mb-2 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <span className="w-2 h-2 bg-accent rounded-full"></span> Final Step
              </div>
              <h2 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-5xl font-bold text-white leading-tight">
                {t('vip.startJourney')}
              </h2>
              <p className="text-fluid-sm md:text-fluid-base lg:text-fluid-lg text-accent/80 leading-relaxed font-light mb-2 md:mb-4 lg:mb-6 max-w-xl mx-auto lg:mx-0">
                {t('vip.startJourneyDescription')}
              </p>
              <motion.div style={{ pointerEvents }} className={`pt-2 md:pt-4 flex justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <button 
                  onClick={onSubscribeClick}
                  className="btn-primary text-sm md:text-base lg:text-lg font-bold px-6 md:px-8 lg:px-10 py-3 md:py-4 shadow-xl hover:scale-105 transition-transform rounded-xl w-full sm:w-auto"
                >
                  {t('vip.subscribe')}
                </button>
              </motion.div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  )
}

// Main component
export default function VipTradingSection({ isMember, joinedVip }: VipTradingSectionProps) {
  const hasAccess = isMember || joinedVip || false
  const { t, isRTL } = useLanguage()
  const [latestSignal, setLatestSignal] = useState<VipDashboardPreview | null>(null)
  const [expertInsight, setExpertInsight] = useState<VipDashboardPreview | null>(null)
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(true)
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isReady, setIsReady] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  
  const setRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node
    setContainerElement(node)
  }, [])

  // Dynamic scroll height based on breakpoint
  const getScrollHeight = useCallback(() => {
    switch (breakpoint) {
      case 'mobile':
        return 'auto' // Mobile uses static layout
      case 'tablet':
        return 'min-h-[280vh]' // Shorter scroll for tablet
      default:
        return 'min-h-[350vh] lg:min-h-[400vh]' // Full scroll for desktop
    }
  }, [breakpoint])

  // Check breakpoint and handle resize/orientation changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    let resizeTimeout: NodeJS.Timeout | null = null
    let orientationTimeout: NodeJS.Timeout | null = null

    const calculateBreakpoint = () => {
      const width = window.innerWidth
      if (width < MOBILE_MAX) {
        setBreakpoint('mobile')
      } else if (width < TABLET_MAX) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
      setIsReady(true)
    }

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculateBreakpoint, 150)
    }

    const handleOrientationChange = () => {
      if (orientationTimeout) clearTimeout(orientationTimeout)
      orientationTimeout = setTimeout(calculateBreakpoint, 300)
    }

    // Initial calculation
    calculateBreakpoint()

    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange)

    // Visual viewport for better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (orientationTimeout) clearTimeout(orientationTimeout)
    }
  }, [])

  // Load VIP dashboard previews
  useEffect(() => {
    if (hasAccess) {
      loadPreviews()
    }
  }, [hasAccess])

  const loadPreviews = async () => {
    setIsLoadingPreviews(true)
    try {
      const previews = await getVipDashboardPreviews()
      const signal = previews.find(p => p.type === 'latest_signal' && p.is_active)
      const insight = previews.find(p => p.type === 'expert_insight' && p.is_active)
      setLatestSignal(signal || null)
      setExpertInsight(insight || null)
    } catch (error) {
      console.error('Error loading VIP dashboard previews:', error)
    } finally {
      setIsLoadingPreviews(false)
    }
  }

  // Don't render scroll animation content until we know the breakpoint
  if (!isReady && !hasAccess) {
    return (
      <section className="py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-accent/50 animate-pulse">Loading...</div>
      </section>
    )
  }

  const handleSubscribeClick = () => {
    setIsPaymentDialogOpen(true)
  }

  return (
    <>
      <section
        ref={setRef}
        className={hasAccess ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" : `relative ${getScrollHeight()}`}
        style={{
          // Ensure no overflow issues that break sticky positioning
          overflow: hasAccess ? 'visible' : 'visible',
        }}
      >
      {hasAccess ? (
        // VIP MEMBER VIEW
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary-surface to-primary-dark p-6 md:p-8 lg:p-12 border border-accent/30 rounded-2xl md:rounded-3xl shadow-2xl">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -mt-10 md:-mt-20 -mr-10 md:-mr-20 w-32 md:w-64 h-32 md:h-64 bg-accent/10 rounded-full blur-2xl md:blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 md:gap-10 items-center">

            {/* Left: Quick Stats / Welcome */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                {t('vip.liveAccessActive')}
              </div>
              <h2 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-5xl font-bold text-white mb-3 md:mb-4">
                {t('vip.welcomeBack')}, <span className="text-accent">{t('vip.trader')}</span>
              </h2>
              <p className="text-accent/70 text-fluid-sm md:text-fluid-base lg:text-fluid-lg max-w-xl mx-auto lg:mx-0 mb-6 md:mb-8">
                {t('vip.dashboardIntro')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <button className="bg-accent text-primary-dark font-bold px-6 md:px-8 py-3 rounded-xl hover:bg-white transition-colors text-sm md:text-base">
                  {t('vip.viewSignals')}
                </button>
                <button className="bg-secondary-surface border border-accent/30 text-white font-bold px-6 md:px-8 py-3 rounded-xl hover:bg-accent/10 transition-colors text-sm md:text-base">
                  {t('vip.marketAnalysis')}
                </button>
              </div>
            </div>

            {/* Right: Feature Preview Cards */}
            <div className="w-full lg:w-1/3 grid grid-cols-1 gap-3 md:gap-4">
              {/* Latest Signal Card */}
              {isLoadingPreviews ? (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <div className="text-accent/50 text-sm">Loading...</div>
                </div>
              ) : latestSignal ? (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <p className="text-xs text-accent/50 uppercase mb-1 font-mono">{t('vip.latestSignal')}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-base md:text-lg">{latestSignal.symbol}</span>
                    <span className={`font-mono font-bold text-sm md:text-base ${latestSignal.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                      {latestSignal.action} @ {latestSignal.price}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <p className="text-xs text-accent/50 uppercase mb-1 font-mono">{t('vip.latestSignal')}</p>
                  <p className="text-accent/50 text-sm">No signal available</p>
                </div>
              )}

              {/* Expert Insight Card */}
              {isLoadingPreviews ? (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <div className="text-accent/50 text-sm">Loading...</div>
                </div>
              ) : expertInsight ? (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <p className="text-xs text-accent/50 uppercase mb-1 font-mono">{t('vip.expertInsight')}</p>
                  <p className="text-white text-sm line-clamp-2">
                    {isRTL ? expertInsight.text_ar : expertInsight.text_en}
                  </p>
                </div>
              ) : (
                <div className="bg-primary-dark/50 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <p className="text-xs text-accent/50 uppercase mb-1 font-mono">{t('vip.expertInsight')}</p>
                  <p className="text-accent/50 text-sm">No insight available</p>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        // NON-VIP VIEW - Mobile gets static cards, tablet/desktop gets scroll animation
        breakpoint === 'mobile' ? (
          <MobileVipContent t={t} isRTL={isRTL} onSubscribeClick={handleSubscribeClick} />
        ) : (
          containerElement ? (
            <ScrollAnimatedContent
              containerRef={containerRef as RefObject<HTMLElement>}
              t={t}
              isRTL={isRTL}
              breakpoint={breakpoint}
              onSubscribeClick={handleSubscribeClick}
            />
          ) : (
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
              <div className="text-accent/50 animate-pulse">Loading...</div>
            </div>
          )
        )
      )}
    </section>

    {/* Payment Dialog */}
    <PaymentDialog
      isOpen={isPaymentDialogOpen}
      onClose={() => setIsPaymentDialogOpen(false)}
      t={t}
      isRTL={isRTL}
    />
    </>
  )
}
