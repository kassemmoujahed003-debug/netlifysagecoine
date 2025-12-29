/**
 * User service for admin operations
 */

export type UserType = 'admin' | 'user' | 'member'

export interface User {
  id: string
  name: string
  email: string
  user_type: UserType
  type: UserType // For backward compatibility
  joinedDate: string
  status: 'active' | 'inactive'
  language?: string
  subscribed_to_courses?: boolean
  joined_vip?: boolean
  current_leverage?: number
  current_lot_size?: number
  is_admin?: boolean
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      // Try to redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch users')
    }

    const data = await response.json()
    return data.users || []

  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Update a user (admin only)
 */
export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  try {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      // Try to redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('No authentication token found. Please log in.')
    }

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update user')
    }

    const data = await response.json()
    return data.user

  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

