'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductGrid from '@/components/Products'

export default function ProductsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <main 
      className={`min-h-screen bg-primary-dark ${isMounted ? 'products-page-entered' : ''}`}
      style={{
        overflowX: 'clip',
      }}
    >
      <Navbar />
      <ProductGrid />
      <Footer />
    </main>
  )
}

