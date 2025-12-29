/**
 * VIP Dashboard Preview service for admin operations
 */

import { VipDashboardPreview } from '@/types/database'

/**
 * Get all VIP dashboard previews (public - active only)
 */
export async function getVipDashboardPreviews(): Promise<VipDashboardPreview[]> {
  try {
    const response = await fetch('/api/vip-dashboard-previews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch VIP dashboard previews')
    }

    const data = await response.json()
    return data.previews || []

  } catch (error) {
    console.error('Error fetching VIP dashboard previews:', error)
    throw error
  }
}

/**
 * Get all VIP dashboard previews (admin only)
 */
export async function getAllVipDashboardPreviews(): Promise<VipDashboardPreview[]> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/vip-dashboard-previews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch VIP dashboard previews')
    }

    const data = await response.json()
    return data.previews || []

  } catch (error) {
    console.error('Error fetching VIP dashboard previews:', error)
    throw error
  }
}

/**
 * Create a new VIP dashboard preview (admin only)
 */
export async function createVipDashboardPreview(
  previewData: Omit<VipDashboardPreview, 'id' | 'created_at' | 'updated_at'>
): Promise<VipDashboardPreview> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/vip-dashboard-previews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(previewData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create VIP dashboard preview')
    }

    const data = await response.json()
    return data.preview

  } catch (error) {
    console.error('Error creating VIP dashboard preview:', error)
    throw error
  }
}

/**
 * Update a VIP dashboard preview (admin only)
 */
export async function updateVipDashboardPreview(
  previewId: string,
  previewData: Partial<Omit<VipDashboardPreview, 'id' | 'created_at' | 'updated_at'>>
): Promise<VipDashboardPreview> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/vip-dashboard-previews/${previewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(previewData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update VIP dashboard preview')
    }

    const data = await response.json()
    return data.preview

  } catch (error) {
    console.error('Error updating VIP dashboard preview:', error)
    throw error
  }
}

/**
 * Delete a VIP dashboard preview (admin only)
 */
export async function deleteVipDashboardPreview(previewId: string): Promise<void> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/vip-dashboard-previews/${previewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to delete VIP dashboard preview')
    }

  } catch (error) {
    console.error('Error deleting VIP dashboard preview:', error)
    throw error
  }
}

