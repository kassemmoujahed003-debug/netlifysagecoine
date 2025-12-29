/**
 * Market Intelligence service
 */

import { MarketIntelligence } from '@/types/database'

/**
 * Get all active market intelligence items (public)
 */
export async function getMarketIntelligenceItems(): Promise<MarketIntelligence[]> {
  try {
    const response = await fetch('/api/market-intelligence', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch market intelligence items')
    }

    const data = await response.json()
    return data.items || []

  } catch (error) {
    console.error('Error fetching market intelligence items:', error)
    throw error
  }
}

/**
 * Get all market intelligence items (admin only)
 */
export async function getAllMarketIntelligenceItems(): Promise<MarketIntelligence[]> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/market-intelligence', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch market intelligence items')
    }

    const data = await response.json()
    return data.items || []

  } catch (error) {
    console.error('Error fetching market intelligence items:', error)
    throw error
  }
}

/**
 * Create a new market intelligence item (admin only)
 */
export async function createMarketIntelligenceItem(
  itemData: Omit<MarketIntelligence, 'id' | 'created_at' | 'updated_at'>
): Promise<MarketIntelligence> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/market-intelligence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create market intelligence item')
    }

    const data = await response.json()
    return data.item

  } catch (error) {
    console.error('Error creating market intelligence item:', error)
    throw error
  }
}

/**
 * Update a market intelligence item (admin only)
 */
export async function updateMarketIntelligenceItem(
  itemId: string,
  itemData: Partial<Omit<MarketIntelligence, 'id' | 'created_at' | 'updated_at'>>
): Promise<MarketIntelligence> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/market-intelligence/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update market intelligence item')
    }

    const data = await response.json()
    return data.item

  } catch (error) {
    console.error('Error updating market intelligence item:', error)
    throw error
  }
}

/**
 * Delete a market intelligence item (admin only)
 */
export async function deleteMarketIntelligenceItem(itemId: string): Promise<void> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/market-intelligence/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to delete market intelligence item')
    }

  } catch (error) {
    console.error('Error deleting market intelligence item:', error)
    throw error
  }
}

