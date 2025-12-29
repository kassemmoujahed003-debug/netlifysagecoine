'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageSwitchProps {
  isScrolled?: boolean
}

export default function LanguageSwitch({ isScrolled = false }: LanguageSwitchProps) {
  const { language, setLanguage } = useLanguage()
  const [displayLanguage, setDisplayLanguage] = useState(language)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Sync display language when context language changes
  useEffect(() => {
    if (displayLanguage !== language) {
      setIsTransitioning(false)
      setDisplayLanguage(language)
    }
  }, [language, displayLanguage])

  const toggleLanguage = () => {
    if (isTransitioning) return // Prevent double clicks
    
    setIsTransitioning(true)
    const newLanguage = language === 'en' ? 'ar' : 'en'
    
    // Fade out current language
    setTimeout(() => {
      setLanguage(newLanguage)
      // Fade in new language
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 200)
  }

  return (
    <button
      onClick={toggleLanguage}
      disabled={isTransitioning}
      className={`
        inline-flex h-10 items-center justify-center px-4 rounded-lg
        transition-all duration-300 ease-in-out border
        ${isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-xl hover:border-white/20' 
          : 'bg-black/20 border-white/10 hover:border-emerald-500/30'}
        ${isTransitioning ? 'cursor-wait' : 'cursor-pointer'}
        overflow-hidden
      `}
      aria-label="Toggle language"
    >
      <span 
        className={`
          text-sm font-bold tracking-wider text-white
          transition-all duration-300 ease-in-out
          ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
        `}
      >
        {displayLanguage.toUpperCase()}
      </span>
    </button>
  )
}