'use client'

import { useRef, useState, useEffect, useCallback, RefObject } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface CoursesSectionProps {
  subscribedToCourses: boolean
}

// Breakpoint thresholds
const MOBILE_MAX = 768
const TABLET_MAX = 1024

// Mobile-optimized content (no scroll animation)
function MobileCoursesContent({
  features,
  t,
  isRTL
}: {
  features: Array<{ id: number; title: string; subtitle: string; description: string }>
  t: (key: string) => string
  isRTL: boolean
}) {
  return (
    <div className="py-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-accent font-mono text-xs tracking-widest uppercase mb-4">
          <span className="w-2 h-2 bg-accent rounded-full"></span> {t('courses.sectionBadge') || 'Our Courses'}
        </div>
        <h2 className="text-fluid-3xl font-bold text-white mb-4">
          {t('courses.sectionTitle') || 'Master the Markets'}
        </h2>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-10">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="bg-secondary-surface/40 border border-accent/20 rounded-2xl p-5 md:p-6">
              {/* Step indicator */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center rotate-45">
                  <span className="text-accent font-bold text-sm -rotate-45">{String(feature.id).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-accent font-mono text-xs uppercase tracking-widest mb-1">
                    {feature.subtitle}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-accent/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Connector line between items */}
            {index < features.length - 1 && (
              <div className={`absolute ${isRTL ? 'right-9' : 'left-9'} top-full h-4 w-0.5 bg-accent/30`}></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h3 className="text-fluid-2xl font-bold text-white mb-4">
          {t('courses.readyToStart')}
        </h3>
        <p className="text-fluid-sm text-accent/80 mb-6 max-w-md mx-auto">
          {t('courses.finalDescription')}
        </p>
        <button className="btn-primary text-lg font-bold px-8 py-4 shadow-[0_0_40px_rgba(var(--accent-rgb),0.4)] w-full sm:w-auto rounded-xl">
          {t('courses.subscribeNow')}
        </button>
      </motion.div>
    </div>
  )
}

// Desktop/Tablet scroll-animated content with responsive pinning
function ScrollAnimatedCourses({ 
  containerRef, 
  features,
  t,
  isRTL,
  breakpoint
}: { 
  containerRef: RefObject<HTMLElement>
  features: Array<{ id: number; title: string; subtitle: string; description: string }>
  t: (key: string) => string
  isRTL: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Adjust spring physics based on breakpoint
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: breakpoint === 'tablet' ? 80 : 100, 
    damping: breakpoint === 'tablet' ? 25 : 30, 
    restDelta: 0.001 
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const totalSteps = features.length + 1
      const newIndex = Math.min(
        Math.floor(latest * totalSteps), 
        totalSteps - 1
      )
      setActiveIndex(newIndex)
    })
  }, [scrollYProgress, features.length])

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"])

  // Responsive sizes based on breakpoint
  const timelineHeight = breakpoint === 'tablet' 
    ? 'h-[300px] md:h-[400px]' 
    : 'h-[350px] md:h-[450px] lg:h-[500px]'
  
  const contentHeight = breakpoint === 'tablet'
    ? 'h-[250px] md:h-[320px]'
    : 'h-[300px] md:h-[350px] lg:h-[400px]'

  return (
    <div 
      className="sticky top-0 h-screen flex flex-col justify-center will-change-transform"
      style={{ 
        contain: 'layout style paint',
      }}
    >
      
      {/* Background Ambience */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:w-[700px] h-[300px] md:h-[500px] lg:h-[700px] bg-accent/5 blur-[60px] md:blur-[80px] lg:blur-[100px] rounded-full pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`}></div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-3 md:gap-5 lg:gap-8 items-center relative z-10">
         
         {/* === LEFT COLUMN: THE TIMELINE === */}
         <div className={`col-span-2 md:col-span-2 flex flex-col items-center relative ${timelineHeight} ${isRTL ? 'order-2' : ''}`}>
             
             {/* Vertical Line (Background) */}
             <div className="absolute top-0 bottom-0 w-[1px] bg-white/5"></div>
             
             {/* Vertical Line (Foreground) */}
             <motion.div 
               style={{ height: progressHeight }}
               className="absolute top-0 w-[2px] bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.8)] md:shadow-[0_0_20px_rgba(var(--accent-rgb),1)] origin-top z-0"
             ></motion.div>

             {/* The Diamonds */}
             <div className="flex flex-col justify-between h-full w-full relative z-10">
                 {features.map((feature, index) => (
                     <TimelineNode 
                        key={feature.id} 
                        index={index} 
                        activeIndex={activeIndex} 
                        isRTL={isRTL}
                        breakpoint={breakpoint}
                     />
                 ))}
             </div>
         </div>


         {/* === RIGHT COLUMN: THE CONTENT === */}
         <div className={`col-span-10 md:col-span-10 ${isRTL ? 'order-1 pr-3 md:pr-6 lg:pr-10 text-right' : 'pl-3 md:pl-6 lg:pl-10'} flex flex-col justify-center ${contentHeight}`}>
             
             <div className="relative w-full h-full flex flex-col justify-center">
                 
                 {/* ANIMATED TEXT BLOCKS */}
                 {features.map((feature, index) => (
                     <ContentCard 
                        key={feature.id} 
                        feature={feature} 
                        isActive={activeIndex === index}
                        breakpoint={breakpoint}
                     />
                 ))}

                 {/* FINAL CTA BUTTON */}
                 <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                          opacity: activeIndex === features.length ? 1 : 0,
                          scale: activeIndex === features.length ? 1 : 0.9,
                          pointerEvents: activeIndex === features.length ? 'auto' : 'none'
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`absolute inset-0 flex flex-col ${isRTL ? 'items-end' : 'items-start'} justify-center`}
                 >
                      <h3 className="text-fluid-2xl md:text-fluid-3xl lg:text-fluid-4xl font-bold text-white mb-3 md:mb-5 lg:mb-6">
                          {t('courses.readyToStart')}
                      </h3>
                      <p className="text-fluid-sm md:text-fluid-base lg:text-fluid-lg text-accent/80 mb-4 md:mb-6 lg:mb-8 max-w-xl">
                          {t('courses.finalDescription')}
                      </p>
                      <button className="btn-primary text-sm md:text-base lg:text-lg font-bold px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] md:shadow-[0_0_40px_rgba(var(--accent-rgb),0.4)] hover:scale-105 transition-transform rounded-xl">
                          {t('courses.subscribeNow')}
                      </button>
                 </motion.div>

             </div>
         </div>

      </div>
    </div>
  )
}

// Main component
export default function CoursesSection({ subscribedToCourses }: CoursesSectionProps) {
  const { t, isRTL } = useLanguage()
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isReady, setIsReady] = useState(false)
  
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
        return 'min-h-[250vh]' // Shorter scroll for tablet
      default:
        return 'min-h-[320vh] lg:min-h-[380vh]' // Full scroll for desktop
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
  
  // === CONTENT DATA ===
  const features = [
    {
      id: 1,
      title: t('courses.feature1.title'),
      subtitle: t('courses.feature1.subtitle'),
      description: t('courses.feature1.description'),
    },
    {
      id: 2,
      title: t('courses.feature2.title'),
      subtitle: t('courses.feature2.subtitle'),
      description: t('courses.feature2.description'),
    },
    {
      id: 3,
      title: t('courses.feature3.title'),
      subtitle: t('courses.feature3.subtitle'),
      description: t('courses.feature3.description'),
    },
    {
      id: 4,
      title: t('courses.feature4.title'),
      subtitle: t('courses.feature4.subtitle'),
      description: t('courses.feature4.description'),
    }
  ]

  // Don't render scroll animation content until we know the breakpoint
  if (!isReady && !subscribedToCourses) {
    return (
      <section id="courses" className="py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-accent/50 animate-pulse">Loading...</div>
      </section>
    )
  }

  return (
    <section 
      ref={setRef} 
      id="courses" 
      className={subscribedToCourses ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" : `relative ${getScrollHeight()}`}
      style={{
        // Ensure no overflow issues that break sticky positioning
        overflow: subscribedToCourses ? 'visible' : 'visible',
      }}
    >
      {subscribedToCourses ? (
        // SUBSCRIBED VIEW
        <>
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-fluid-2xl md:text-fluid-3xl font-bold text-base-white">{t('courses.title')}</h2>
          </div>
          <div className="relative group w-full max-w-5xl mx-auto border border-white/10 bg-primary-dark p-1 rounded-xl md:rounded-2xl overflow-hidden">
            <div className="aspect-video bg-black/40 flex items-center justify-center text-accent rounded-lg md:rounded-xl">
              {t('courses.patreonPlaceholder')}
            </div>
          </div>
        </>
      ) : (
        // NON-SUBSCRIBED VIEW - Mobile gets static cards, tablet/desktop gets scroll animation
        breakpoint === 'mobile' ? (
          <MobileCoursesContent features={features} t={t} isRTL={isRTL} />
        ) : (
          containerElement ? (
            <ScrollAnimatedCourses 
              containerRef={containerRef as RefObject<HTMLElement>} 
              features={features}
              t={t} 
              isRTL={isRTL}
              breakpoint={breakpoint}
            />
          ) : (
            <div className="sticky top-0 h-screen flex items-center justify-center">
              <div className="text-accent/50 animate-pulse">Loading...</div>
            </div>
          )
        )
      )}
    </section>
  )
}


// === SUB-COMPONENT: TIMELINE NODE ===
function TimelineNode({ 
  index, 
  activeIndex, 
  isRTL,
  breakpoint 
}: { 
  index: number
  activeIndex: number
  isRTL: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
}) {
    const isActive = index === activeIndex
    const isPast = index < activeIndex
    
    // Reduce animation intensity on tablet
    const scaleActive = breakpoint === 'tablet' ? 1.3 : 1.5
    const connectorWidth = breakpoint === 'tablet' ? 20 : 30

    return (
        <div className="relative flex items-center justify-center w-full">
            
            {/* The Diamond Shape */}
            <motion.div 
                animate={{ 
                    scale: isActive ? scaleActive : 1, 
                    borderColor: (isActive || isPast) ? 'rgba(var(--accent-rgb), 1)' : 'rgba(255,255,255, 0.1)',
                    backgroundColor: (isActive || isPast) ? 'rgba(var(--accent-rgb), 1)' : 'rgba(15, 23, 42, 1)', 
                    boxShadow: isActive 
                      ? breakpoint === 'tablet' 
                        ? '0 0 20px rgba(var(--accent-rgb), 0.5)' 
                        : '0 0 30px rgba(var(--accent-rgb), 0.6)' 
                      : 'none'
                }}
                transition={{ duration: 0.35 }}
                className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rotate-45 border-2 z-10 flex items-center justify-center backdrop-blur-sm will-change-transform"
            >
                <motion.div 
                    animate={{ opacity: isActive ? 1 : 0 }}
                    className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-white" 
                ></motion.div>
            </motion.div>
            
            {/* Connector Line */}
             <motion.div 
                animate={{ 
                    width: isActive ? connectorWidth : 0, 
                    opacity: isActive ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className={`absolute top-1/2 -translate-y-1/2 h-[1px] bg-accent ${isRTL ? 'right-full' : 'left-full'}`}
             ></motion.div>

        </div>
    )
}


// === SUB-COMPONENT: CONTENT CARD ===
function ContentCard({ 
  feature, 
  isActive,
  breakpoint 
}: { 
  feature: { id: number; title: string; subtitle: string; description: string }
  isActive: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
}) {
    // Reduce Y-travel distance on tablet
    const yOffset = breakpoint === 'tablet' ? 20 : 30
    
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            animate={{ 
                opacity: isActive ? 1 : 0, 
                y: isActive ? 0 : yOffset,
                pointerEvents: isActive ? 'auto' : 'none'
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-center will-change-transform"
        >
            <h4 className="text-accent font-mono text-xs md:text-sm lg:text-base uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-2 md:mb-3 lg:mb-4 font-bold">
                {feature.subtitle}
            </h4>
            
            <h3 className="text-fluid-2xl md:text-fluid-4xl lg:text-fluid-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent/50 mb-3 md:mb-5 lg:mb-8 leading-tight tracking-tight">
                {feature.title}
            </h3>
            
            <div className="w-12 md:w-16 lg:w-20 h-0.5 md:h-1 bg-accent mb-3 md:mb-5 lg:mb-8"></div>
            
            <p className="text-fluid-sm md:text-fluid-lg lg:text-fluid-xl text-accent/80 leading-relaxed font-light max-w-2xl lg:max-w-3xl">
                {feature.description}
            </p>
        </motion.div>
    )
}
