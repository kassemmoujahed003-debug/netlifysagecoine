'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeroSliderProps {
  images: string[]
  interval?: number // in milliseconds
}

export default function HeroSlider({ images, interval = 3000 }: HeroSliderProps) {
  const { t, isRTL } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsTransitioning(false)
      }, 300) // Half of transition duration
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  const goToSlide = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[1.618/1] bg-gradient-to-br from-secondary-surface to-primary-dark rounded-2xl border border-accent flex items-center justify-center p-8 backdrop-blur-sm bg-opacity-50">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-accent bg-opacity-20 rounded-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
              />
            </svg>
          </div>
          <p className="text-accent text-sm">
            {t('hero.visualLabel')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-[1.618/1] bg-gradient-to-br from-secondary-surface to-primary-dark rounded-2xl overflow-hidden backdrop-blur-sm bg-opacity-50 relative">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out ${
              index === currentIndex && !isTransitioning
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Fallback if image fails to load */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[600ms] ease-in-out ${
            images[currentIndex] ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-accent bg-opacity-20 rounded-full flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-accent" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                />
              </svg>
            </div>
            <p className="text-accent text-sm">
              {t('hero.visualLabel')}
            </p>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-accent bg-opacity-60'
                  : 'w-2 h-2 bg-accent bg-opacity-30 hover:bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  )
}

