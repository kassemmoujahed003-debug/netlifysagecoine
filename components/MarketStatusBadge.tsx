'use client'

import { useMarketStatus } from '@/hooks/useMarketStatus'

interface MarketStatusBadgeProps {
  market?: string
}

export default function MarketStatusBadge({ 
  market = 'NYSE'
}: MarketStatusBadgeProps) {
  const { marketStatus, isLoading } = useMarketStatus({ 
    market,
    pollInterval: 60000, // Update every minute
  })

  const isOpen = marketStatus?.isOpen ?? false
  const marketName = marketStatus?.market ?? market

  // Format market name for display
  const getMarketFullName = (market: string) => {
    const marketNames: Record<string, string> = {
      'NYSE': 'New York Stock Exchange',
      'NASDAQ': 'NASDAQ',
      'LSE': 'London Stock Exchange',
      'TSE': 'Tokyo Stock Exchange',
      'HKEX': 'Hong Kong Exchange',
      'SSE': 'Shanghai Stock Exchange',
      'ASX': 'Australian Stock Exchange',
      'BSE': 'Bombay Stock Exchange',
      'NSE': 'National Stock Exchange',
    }
    return marketNames[market] || market
  }

  return (
    <div className="text-center relative z-10">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="relative flex h-3 w-3">
          {isLoading ? (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-50 animate-pulse"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
            </>
          ) : (
            <>
              <span 
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isOpen ? 'bg-green-400' : 'bg-red-400'
                } opacity-75`}
              ></span>
              <span 
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </>
          )}
        </span>
        <span className="text-xs font-bold text-accent tracking-widest uppercase">
          {isLoading ? 'Loading...' : isOpen ? 'Live' : 'Closed'}
        </span>
      </div>
      {/* Market Name */}
      <p className="text-xs text-accent/70 font-semibold mb-0.5">
        {isLoading ? '...' : getMarketFullName(marketName)}
      </p>
      {/* Status */}
      <p className="text-base-white font-bold text-sm lg:text-base">
        {isLoading ? 'Checking...' : isOpen ? 'Market Open' : 'Market Closed'}
      </p>
    </div>
  )
}

