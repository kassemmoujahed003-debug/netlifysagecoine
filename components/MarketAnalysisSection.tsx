'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { getMarketAnalysisSections } from '@/services/marketAnalysisService'
import { MarketAnalysisSection as MarketAnalysisSectionType } from '@/types/database'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function MarketAnalysisSection() {
  const { language, isRTL } = useLanguage()
  const { isAuthenticated, isMember } = useAuth()
  const [sections, setSections] = useState<MarketAnalysisSectionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const hasAccess = isAuthenticated && isMember

  useEffect(() => {
    if (hasAccess) {
      loadSections()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, isMember])

  const loadSections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedSections = await getMarketAnalysisSections()
      setSections(fetchedSections)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market analysis')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 text-center text-accent animate-pulse">
          {language === 'ar' ? 'جاري تحميل تحليل السوق...' : 'Loading market analysis...'}
        </div>
      </section>
    )
  }

  if (hasAccess && (error || sections.length === 0)) return null

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Glassmorphism Accent */}
        <div className={`mb-8 sm:mb-10 lg:mb-12 border-b border-accent/20 pb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-fluid-2xl sm:text-fluid-3xl lg:text-fluid-4xl font-extrabold text-base-white tracking-tight">
            {language === 'ar' ? 'تحليل السوق' : 'Market Analysis'}
          </h2>
          <p className="text-accent mt-2 opacity-80 text-fluid-sm sm:text-fluid-base">
            {language === 'ar' ? 'آخر التحديثات والاتجاهات' : 'Latest updates and market trends'}
          </p>
        </div>

        {/* Improved Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {hasAccess ? (
            sections.map((section, index) => {
              const title = language === 'ar' ? section.title_ar : section.title_en
              const description = language === 'ar' ? section.description_ar : section.description_en

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-secondary-surface/40 hover:bg-secondary-surface/80 border border-accent/10 hover:border-accent/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col"
                >
                  {/* Image with Overlay */}
                  <div className="relative h-40 sm:h-44 lg:h-48 w-full overflow-hidden">
                    <img
                      src={section.image_url}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 sm:group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-surface to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className={`p-4 sm:p-5 lg:p-6 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-base-white mb-2 sm:mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                      {title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-accent/90 leading-relaxed line-clamp-3 sm:line-clamp-4 flex-1">
                      {description}
                    </p>
                    
                    <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-accent/10 flex items-center gap-2 text-xs sm:text-sm font-semibold text-accent ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{language === 'ar' ? 'اقرأ المزيد' : 'View Full Report'}</span>
                      <span className={`transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1 sm:group-hover:-translate-x-2' : 'group-hover:translate-x-1 sm:group-hover:translate-x-2'}`}>
                        {isRTL ? '←' : '→'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            // Subscription cards for non-VIP users
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-secondary-surface/40 hover:bg-secondary-surface/80 border border-accent/10 hover:border-accent/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-40 sm:h-44 lg:h-48 w-full overflow-hidden bg-gradient-to-br from-accent/20 to-primary-dark flex items-center justify-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl opacity-30">🔒</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-surface to-transparent opacity-60" />
                </div>
                <div className={`p-4 sm:p-5 lg:p-6 flex-1 flex flex-col items-center justify-center text-center`}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-base-white mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                    {language === 'ar' ? 'اشترك للحصول على الوصول' : 'Subscribe to Get Access'}
                  </h3>
                  <p className="text-xs sm:text-sm text-accent/90 leading-relaxed mb-4">
                    {language === 'ar' 
                      ? 'احصل على وصول كامل إلى تحليلات السوق المتقدمة والرؤى الحصرية' 
                      : 'Get full access to advanced market analysis and exclusive insights'}
                  </p>
                  <button className="mt-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-accent text-primary-dark font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base">
                    {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-secondary-surface/40 hover:bg-secondary-surface/80 border border-accent/10 hover:border-accent/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-40 sm:h-44 lg:h-48 w-full overflow-hidden bg-gradient-to-br from-accent/20 to-primary-dark flex items-center justify-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl opacity-30">⭐</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-surface to-transparent opacity-60" />
                </div>
                <div className={`p-4 sm:p-5 lg:p-6 flex-1 flex flex-col items-center justify-center text-center`}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-base-white mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                    {language === 'ar' ? 'انضم إلى VIP' : 'Join VIP Membership'}
                  </h3>
                  <p className="text-xs sm:text-sm text-accent/90 leading-relaxed mb-4">
                    {language === 'ar' 
                      ? 'استمتع بتحليلات السوق في الوقت الفعلي وإشارات التداول الحصرية' 
                      : 'Enjoy real-time market analysis and exclusive trading signals'}
                  </p>
                  <button className="mt-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-accent text-primary-dark font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base">
                    {language === 'ar' ? 'انضم الآن' : 'Join Now'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
