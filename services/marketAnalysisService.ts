/**
 * Market Analysis service for admin operations
 */

import { MarketAnalysisSection } from '@/types/database'

/**
 * Get all market analysis sections (public)
 */
export async function getMarketAnalysisSections(): Promise<MarketAnalysisSection[]> {
  try {
    const response = await fetch('/api/market-analysis', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch market analysis sections')
    }

    const data = await response.json()
    return data.sections || []

  } catch (error) {
    console.error('Error fetching market analysis sections:', error)
    throw error
  }
}

/**
 * Get all market analysis sections (admin only)
 */
export async function getAllMarketAnalysisSections(): Promise<MarketAnalysisSection[]> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/market-analysis', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch market analysis sections')
    }

    const data = await response.json()
    return data.sections || []

  } catch (error) {
    console.error('Error fetching market analysis sections:', error)
    throw error
  }
}

/**
 * Create a new market analysis section (admin only)
 */
export async function createMarketAnalysisSection(
  sectionData: Omit<MarketAnalysisSection, 'id' | 'created_at' | 'updated_at'>
): Promise<MarketAnalysisSection> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/market-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sectionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create market analysis section')
    }

    const data = await response.json()
    return data.section

  } catch (error) {
    console.error('Error creating market analysis section:', error)
    throw error
  }
}

/**
 * Update a market analysis section (admin only)
 */
export async function updateMarketAnalysisSection(
  sectionId: string,
  sectionData: Partial<Omit<MarketAnalysisSection, 'id' | 'created_at' | 'updated_at'>>
): Promise<MarketAnalysisSection> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/market-analysis/${sectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sectionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update market analysis section')
    }

    const data = await response.json()
    return data.section

  } catch (error) {
    console.error('Error updating market analysis section:', error)
    throw error
  }
}

/**
 * Delete a market analysis section (admin only)
 */
export async function deleteMarketAnalysisSection(sectionId: string): Promise<void> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/market-analysis/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to delete market analysis section')
    }

  } catch (error) {
    console.error('Error deleting market analysis section:', error)
    throw error
  }
}

/**
 * Upload an image for market analysis section (admin only)
 */
export async function uploadMarketAnalysisImage(file: File): Promise<{ url: string; path: string }> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/market-analysis/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to upload image')
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

