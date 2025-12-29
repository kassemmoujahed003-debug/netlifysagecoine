/**
 * Market Status Service
 * Uses static stock exchange data to calculate market status
 */

import stockExchangesData from '@/data/stockExchanges.json'

interface StockExchange {
  name: string
  code: string
  timezone: string
  regular_hours: {
    open: string
    close: string
  }
  breaks?: Array<{
    start: string
    end: string
  }>
  notes?: string
}

export interface MarketStatus {
  isOpen: boolean
  market: string
  timezone: string
  currentTime: string
  nextOpen?: string
  nextClose?: string
}

export interface MarketStatusResponse {
  isOpen: boolean
  market: string
  timezone: string
  currentTime: string
  nextOpen?: string
  nextClose?: string
  error?: string
}

/**
 * Get stock exchange data by code
 */
function getStockExchangeByCode(code: string): StockExchange | null {
  const exchanges = stockExchangesData.stock_exchanges as StockExchange[]
  return exchanges.find(ex => ex.code.toUpperCase() === code.toUpperCase()) || null
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Get current time information in a specific timezone
 */
function getCurrentTimeInTimezone(timezone: string): { date: Date; hour: number; minute: number; dayOfWeek: number } {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    hour12: false
  })
  
  const parts = formatter.formatToParts(now)
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0')
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0')
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const weekday = parts.find(p => p.type === 'weekday')?.value || 'Monday'
  
  // Convert weekday name to day of week (0 = Sunday, 1 = Monday, etc.)
  const weekdayMap: Record<string, number> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
  }
  const dayOfWeek = weekdayMap[weekday] || 1
  
  // Create a date object in the target timezone (for reference)
  const date = new Date()
  
  return { date, hour, minute, dayOfWeek }
}

/**
 * Calculate if market is currently open
 */
function calculateMarketStatus(exchange: StockExchange): { isOpen: boolean; currentTime: Date; hour: number; minute: number; dayOfWeek: number } {
  const timeInfo = getCurrentTimeInTimezone(exchange.timezone)
  const { date: currentTime, hour, minute, dayOfWeek } = timeInfo
  
  // Markets are only open on weekdays (Monday = 1 to Friday = 5)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { isOpen: false, currentTime, hour, minute, dayOfWeek }
  }
  
  const currentMinutes = hour * 60 + minute
  const openMinutes = timeToMinutes(exchange.regular_hours.open)
  const closeMinutes = timeToMinutes(exchange.regular_hours.close)
  
  // Check if current time is within trading hours
  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
    return { isOpen: false, currentTime, hour, minute, dayOfWeek }
  }
  
  // Check if current time is during a break
  if (exchange.breaks && exchange.breaks.length > 0) {
    for (const breakPeriod of exchange.breaks) {
      const breakStart = timeToMinutes(breakPeriod.start)
      const breakEnd = timeToMinutes(breakPeriod.end)
      
      if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
        return { isOpen: false, currentTime, hour, minute, dayOfWeek }
      }
    }
  }
  
  return { isOpen: true, currentTime, hour, minute, dayOfWeek }
}

/**
 * Calculate next open and close times
 */
function calculateNextOpenClose(exchange: StockExchange, hour: number, minute: number, dayOfWeek: number, timezone: string): { nextOpen?: string; nextClose?: string } {
  const currentMinutes = hour * 60 + minute
  const now = new Date()
  
  const openMinutes = timeToMinutes(exchange.regular_hours.open)
  const closeMinutes = timeToMinutes(exchange.regular_hours.close)
  
  // Get the current date in the market's timezone to calculate next open/close
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  const parts = formatter.formatToParts(now)
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0')
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0')
  
  // Create a date object for today in the market's timezone
  // We'll create it in UTC first, then adjust
  const today = new Date(Date.UTC(year, month, day))
  
  let nextOpen: Date | null = null
  let nextClose: Date | null = null
  
  // If it's a weekday
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // If before open time today
    if (currentMinutes < openMinutes) {
      const [openHour, openMin] = exchange.regular_hours.open.split(':').map(Number)
      nextOpen = new Date(Date.UTC(year, month, day, openHour, openMin))
      
      const [closeHour, closeMin] = exchange.regular_hours.close.split(':').map(Number)
      nextClose = new Date(Date.UTC(year, month, day, closeHour, closeMin))
    }
    // If after close time today
    else if (currentMinutes >= closeMinutes) {
      // Next open is tomorrow (or Monday if it's Friday)
      const daysToAdd = dayOfWeek === 5 ? 3 : 1 // Friday -> Monday, otherwise next day
      const nextDay = new Date(Date.UTC(year, month, day))
      nextDay.setUTCDate(nextDay.getUTCDate() + daysToAdd)
      
      const [openHour, openMin] = exchange.regular_hours.open.split(':').map(Number)
      nextOpen = new Date(Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate(), openHour, openMin))
      
      const [closeHour, closeMin] = exchange.regular_hours.close.split(':').map(Number)
      nextClose = new Date(Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate(), closeHour, closeMin))
    }
    // If currently open, next close is today
    else {
      const [closeHour, closeMin] = exchange.regular_hours.close.split(':').map(Number)
      nextClose = new Date(Date.UTC(year, month, day, closeHour, closeMin))
      
      // Next open is tomorrow (or Monday if it's Friday)
      const daysToAdd = dayOfWeek === 5 ? 3 : 1
      const nextDay = new Date(Date.UTC(year, month, day))
      nextDay.setUTCDate(nextDay.getUTCDate() + daysToAdd)
      
      const [openHour, openMin] = exchange.regular_hours.open.split(':').map(Number)
      nextOpen = new Date(Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate(), openHour, openMin))
    }
  }
  // If it's a weekend
  else {
    // Next open is Monday
    const daysToMonday = dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1
    const nextDay = new Date(Date.UTC(year, month, day))
    nextDay.setUTCDate(nextDay.getUTCDate() + daysToMonday)
    
    const [openHour, openMin] = exchange.regular_hours.open.split(':').map(Number)
    nextOpen = new Date(Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate(), openHour, openMin))
    
    const [closeHour, closeMin] = exchange.regular_hours.close.split(':').map(Number)
    nextClose = new Date(Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate(), closeHour, closeMin))
  }
  
  return {
    nextOpen: nextOpen?.toISOString(),
    nextClose: nextClose?.toISOString()
  }
}

/**
 * Get market status using static data
 * @param market - Market identifier (e.g., 'NYSE', 'NASDAQ', 'LSE', 'TSE')
 * @returns Promise with market status data
 */
export async function getMarketStatus(market: string = 'NYSE'): Promise<MarketStatusResponse> {
  try {
    const exchange = getStockExchangeByCode(market)
    
    if (!exchange) {
      return {
        isOpen: false,
        market: market.toUpperCase(),
        timezone: 'America/New_York',
        currentTime: new Date().toISOString(),
        error: `Market ${market} not found`
      }
    }
    
    const { isOpen, currentTime, hour, minute, dayOfWeek } = calculateMarketStatus(exchange)
    const { nextOpen, nextClose } = calculateNextOpenClose(exchange, hour, minute, dayOfWeek, exchange.timezone)
    
    return {
      isOpen,
      market: exchange.code.toUpperCase(),
      timezone: exchange.timezone,
      currentTime: currentTime.toISOString(),
      nextOpen,
      nextClose,
    }
  } catch (error) {
    console.error('Error calculating market status:', error)
    return {
      isOpen: false,
      market: market.toUpperCase(),
      timezone: 'America/New_York',
      currentTime: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get multiple market statuses at once
 * @param markets - Array of market identifiers
 * @returns Promise with array of market statuses
 */
export async function getMultipleMarketStatuses(
  markets: string[] = ['NYSE', 'NASDAQ']
): Promise<MarketStatusResponse[]> {
  try {
    const promises = markets.map(market => getMarketStatus(market))
    return await Promise.all(promises)
  } catch (error) {
    console.error('Error fetching multiple market statuses:', error)
    return []
  }
}
