'use client'

import { useState, useEffect } from 'react'
import { getMarketStatus, MarketStatusResponse } from '@/services/marketStatusService'

interface UseMarketStatusOptions {
  market?: string
  pollInterval?: number // in milliseconds, set to 0 to disable polling
  autoFetch?: boolean
}

interface UseMarketStatusReturn {
  marketStatus: MarketStatusResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * React hook to fetch and manage market status
 * Automatically polls for updates if pollInterval is set
 * 
 * @param options - Configuration options
 * @returns Market status data, loading state, error, and refetch function
 */
export function useMarketStatus(options: UseMarketStatusOptions = {}): UseMarketStatusReturn {
  const {
    market = 'NYSE',
    pollInterval = 60000, // Default: poll every 60 seconds
    autoFetch = true,
  } = options

  const [marketStatus, setMarketStatus] = useState<MarketStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketStatus = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const status = await getMarketStatus(market)
      setMarketStatus(status)
      
      if (status.error) {
        setError(status.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market status'
      setError(errorMessage)
      console.error('Error in useMarketStatus:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      // Initial fetch
      fetchMarketStatus()

      // Set up polling if interval is provided and > 0
      if (pollInterval > 0) {
        const intervalId = setInterval(() => {
          fetchMarketStatus()
        }, pollInterval)

        return () => clearInterval(intervalId)
      }
    }
  }, [market, pollInterval, autoFetch])

  return {
    marketStatus,
    isLoading,
    error,
    refetch: fetchMarketStatus,
  }
}

