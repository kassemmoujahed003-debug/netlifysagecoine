'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import HeroSlider from './HeroSlider'
import dynamic from 'next/dynamic'
import DiamondIcon from './DiamondIcon'
import MarketStatusBadge from './MarketStatusBadge'
import { submitCallbackRequest } from '@/app/actions/form-actions'

// Dynamically import 3D background - only load on desktop for performance
const DiamondBackground3D = dynamic(() => import('./DiamondBackground3D'), {
  ssr: false,
  loading: () => null
})

// Dynamically import Canvas - only when needed
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
)

export default function Hero() {
  const { t, isRTL } = useLanguage()
  const [webglAvailable, setWebglAvailable] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Check if WebGL is available
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglAvailable(false)
      }
    } catch (error) {
      setWebglAvailable(false)
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const coursesSection = document.getElementById('courses')
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
        // Close form after 3 seconds
        setTimeout(() => {
          setShowContactForm(false)
          setSubmitMessage(null)
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Static diamond fallback for mobile/no WebGL
  const DiamondFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-4 h-4 bg-accent/60 rotate-45 animate-pulse"></div>
    </div>
  )

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32 overflow-visible">
      
      {/* 3D Background with Floating Diamond Crystals - Only on desktop */}
      {isClient && !isMobile && <DiamondBackground3D />}
      
      {/* Legacy Background Ambience (fallback + mobile) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[400px] sm:h-[600px] lg:h-[800px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none"></div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center ${
        isRTL ? 'lg:grid-flow-dense' : ''
      }`}>
        
        {/* ============================================
            LEFT COLUMN: TEXT CONTENT
           ============================================ */}
        <div className={`relative z-20 flex flex-col text-center lg:text-left ${isRTL ? 'lg:col-start-2 lg:text-right' : ''}`}>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Institutional Grade Badge with Rotating Diamond */}
            <div className={`flex items-center gap-2 sm:gap-3 justify-center lg:justify-start ${isRTL ? 'lg:justify-end flex-row-reverse' : ''}`}>
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                {isClient && webglAvailable && !isMobile ? (
                  <Canvas 
                    camera={{ position: [0, 0, 5], fov: 50 }} 
                    className="w-full h-full"
                    gl={{ 
                      alpha: true, 
                      antialias: true,
                      powerPreference: 'high-performance',
                      failIfMajorPerformanceCaveat: false
                    }}
                    onError={() => setWebglAvailable(false)}
                  >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[2, 2, 2]} intensity={0.8} />
                    <DiamondIcon size={0.8} />
                  </Canvas>
                ) : (
                  <DiamondFallback />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-accent/80 tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                INSTITUTIONAL GRADE
              </span>
            </div>

            {/* Headline with Metallic Shine Animation */}
            <div className="relative">
              <h1 className="relative text-fluid-4xl sm:text-fluid-5xl lg:text-fluid-6xl font-extrabold text-base-white leading-tight overflow-hidden">
                <span className="relative inline-block">
                  <span className="metallic-shine">{t('hero.headline')}</span>
                </span>
              </h1>
            </div>

            <p className="text-fluid-base sm:text-fluid-lg md:text-fluid-xl text-accent/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('hero.description')}
            </p>

            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowContactForm(true)
                }}
                className="btn-primary inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)] transition-all w-full sm:w-auto"
              >
                {t('hero.ctaButton')}
              </button>
            </div>
          </div>
        </div>

        <div className={`relative flex items-center justify-center py-6 sm:py-10 ${isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
           
           <div className="relative w-[16rem] h-[16rem] xs:w-[18rem] xs:h-[18rem] sm:w-[22rem] sm:h-[22rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem]">

              <div className="absolute inset-0 rotate-45 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-[2px] sm:border-[3px] border-accent/70 shadow-[0_0_40px_-10px_rgba(var(--accent-rgb),0.4)] sm:shadow-[0_0_80px_-15px_rgba(var(--accent-rgb),0.5)] z-10 bg-primary-dark diamond-main-glow">
                  
                  {/* Outer glow ring */}
                  <div className="absolute -inset-1 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-accent/20 via-accent/10 to-transparent blur-lg sm:blur-xl pointer-events-none"></div>
                  
                  {/* COUNTER-ROTATION WRAPPER */}
                  <div className="-rotate-45 scale-[1.45] w-full h-full relative z-10">
                      <HeroSlider
                        images={[
                          '/1.png',
                          '/2.png',
                          '/3.png',
                        ]}
                        interval={4000}
                      />
                  </div>
                  
                  {/* Inner Border Ring for depth and polish effect */}
                  <div className="absolute inset-[2px] border-[1px] sm:border-[2px] border-accent/30 rounded-[1.3rem] sm:rounded-[1.8rem] lg:rounded-[2.3rem] pointer-events-none z-20"></div>
                  
                  {/* Highlight edge for glass effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-[1.5rem] sm:rounded-t-[2rem] lg:rounded-t-[2.5rem] pointer-events-none z-20"></div>
              </div>


              {/* --- DIAMOND 2: TOP SATELLITE (Decorative/Glow) --- */}
              {/* Hidden on very small screens, smaller on mobile */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 rotate-45 z-0 hidden xs:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-surface to-primary-dark border border-accent/30 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl animate-pulse-subtle diamond-float">
                      {/* Inner glow effect */}
                      <div className="absolute inset-2 bg-accent/10 rounded-lg sm:rounded-xl animate-pulse"></div>
                  </div>
              </div>


              {/* --- DIAMOND 3: BOTTOM SATELLITE (Stat/Market Status) --- */}
              {/* Responsive sizing and positioning */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-6 lg:-left-10 w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rotate-45 z-20 diamond-float-slow">
                  <div className="absolute inset-0 bg-secondary-surface/95 border border-accent/60 sm:border-2 rounded-xl sm:rounded-2xl shadow-[0_5px_20px_-5px_rgba(var(--accent-rgb),0.3)] sm:shadow-[0_10px_40px_-10px_rgba(var(--accent-rgb),0.4)] backdrop-blur-md flex items-center justify-center diamond-glow">
                      {/* Enhanced border glow */}
                      <div className="absolute inset-0 border border-accent/40 rounded-xl sm:rounded-2xl animate-pulse"></div>
                      
                      {/* Counter-rotate content so text is straight */}
                      <div className="-rotate-45 relative z-10 scale-75 sm:scale-90 lg:scale-100">
                          <MarketStatusBadge market="NYSE" />
                      </div>

                  </div>
              </div>

           </div>
        </div>

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
          <div className={`relative w-full max-w-md bg-secondary-surface border border-accent/20 rounded-2xl p-8 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Close button for modal */}
            <button
              onClick={() => {
                setShowContactForm(false)
                setSubmitMessage(null)
                setFullName('')
                setEmail('')
                setPhoneNumber('')
              }}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-8 h-8 flex items-center justify-center text-accent/60 hover:text-accent transition-colors`}
              aria-label="Close form"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold text-base-white mb-2">Contact Us</h2>
            <p className="text-accent/60 mb-6">Fill in your details and we'll get back to you soon.</p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-primary-dark/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/40 disabled:opacity-50 disabled:cursor-not-allowed" 
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-primary-dark/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/40 disabled:opacity-50 disabled:cursor-not-allowed" 
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-primary-dark/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/40 disabled:opacity-50 disabled:cursor-not-allowed" 
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

              <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                  className="flex-1 bg-primary-dark/40 text-base-white font-bold py-4 rounded-xl hover:bg-primary-dark/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-accent/20"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
