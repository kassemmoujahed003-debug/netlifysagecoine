'use server'

import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  message?: string
}

interface RateLimitConfig {
  maxRequests: number // Maximum requests allowed
  windowMs: number // Time window in milliseconds (e.g., 3600000 for 1 hour)
  actionType: 'password_change' | 'withdrawal' | 'deposit'
}

/**
 * Check rate limit for form submissions
 * Returns whether the request is allowed and remaining requests
 */
export async function checkRateLimit(
  config: RateLimitConfig,
  token?: string
): Promise<RateLimitResult> {
  try {
    const supabase = createServerClient()
    
    // Get user ID using token parameter or cookies
    const userId = await getAuthenticatedUserId(token)

    // Require authentication
    if (!userId) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + config.windowMs),
        message: 'Authentication required. Please log in to submit forms.'
      }
    }

    // Calculate time window
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    // Count recent transactions of this type by this user
    const { data: recentTransactions, error } = await supabase
      .from('transactions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('type', config.actionType)
      .gte('created_at', windowStart.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error checking rate limit:', error)
      // On error, allow the request but log it
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(now.getTime() + config.windowMs)
      }
    }

    const requestCount = recentTransactions?.length || 0
    const remaining = Math.max(0, config.maxRequests - requestCount)
    const allowed = requestCount < config.maxRequests

    // Calculate reset time (oldest request in window + window duration)
    let resetAt = new Date(now.getTime() + config.windowMs)
    if (recentTransactions && recentTransactions.length > 0) {
      const oldestRequest = new Date(recentTransactions[recentTransactions.length - 1].created_at)
      resetAt = new Date(oldestRequest.getTime() + config.windowMs)
    }

    if (!allowed) {
      const minutesUntilReset = Math.ceil((resetAt.getTime() - now.getTime()) / 60000)
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        message: `Rate limit exceeded. You can submit ${config.maxRequests} ${config.actionType} request(s) per ${Math.floor(config.windowMs / 3600000)} hour(s). Please try again in ${minutesUntilReset} minute(s).`
      }
    }

    return {
      allowed: true,
      remaining: remaining - 1, // Subtract 1 for current request
      resetAt
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On unexpected error, allow the request but log it
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(Date.now() + config.windowMs)
    }
  }
}

/**
 * Get authenticated user ID from cookies or token parameter
 * Returns null if not authenticated
 */
export async function getAuthenticatedUserId(token?: string): Promise<string | null> {
  try {
    const supabase = createServerClient()
    let accessToken = token
    
    // Try to get token from cookies if not provided
    if (!accessToken) {
      try {
        const cookieStore = cookies()
        accessToken = cookieStore.get('sb-access-token')?.value || 
                     cookieStore.get('supabase-auth-token')?.value ||
                     cookieStore.get('supabase_token')?.value
      } catch (cookieError) {
        // Cookies not available, use provided token
      }
    }
    
    if (!accessToken) {
      return null
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken)
    return user?.id || null
  } catch (error) {
    console.debug('Could not get authenticated user:', error)
    return null
  }
}

