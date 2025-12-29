'use client'

import { useState, useEffect } from 'react'
import { isAdmin, isMember, getUserType, type UserType } from '@/lib/auth-utils'

export interface AuthUser {
  id: string
  email: string
  user_type?: UserType
  is_admin?: boolean
  subscribed_to_courses?: boolean
  joined_vip?: boolean
  current_leverage?: number
  current_lot_size?: number
  language?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Only access localStorage in browser (client-side)
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Load auth state from localStorage
    try {
      const storedToken = localStorage.getItem('supabase_token')
      const userStr = localStorage.getItem('user')
      
      if (storedToken && userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setToken(storedToken)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('supabase_token')
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
    
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    window.location.href = '/login'
  }

  // Compute derived auth state
  const userType = getUserType(user)
  const userIsAdmin = isAdmin(user)
  const userIsMember = isMember(user)

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    logout,
    // Role-based access helpers
    userType,
    isAdmin: userIsAdmin,
    isMember: userIsMember,
  }
}

