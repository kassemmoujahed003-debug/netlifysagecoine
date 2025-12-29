'use client'

import { useEffect, useState } from 'react'
import AboutJourney from '@/components/AboutJourney'

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className={`about-page-entrance ${isMounted ? 'entered' : ''}`}>
      <AboutJourney />
    </div>
  )
}

