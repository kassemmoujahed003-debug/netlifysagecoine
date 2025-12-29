/**
 * Authentication and authorization utilities
 */

export type UserType = 'admin' | 'user' | 'member'

export interface UserRole {
  user_type: UserType
  is_admin: boolean
}

/**
 * Check if user is admin
 */
export function isAdmin(user: { user_type?: UserType; is_admin?: boolean; email?: string } | null): boolean {
  if (!user) return false
  
  // Check user_type first (new system)
  if (user.user_type === 'admin') return true
  
  // Fallback to is_admin field (legacy)
  if (user.is_admin === true) return true
  
  // Special case: admin@sagecoin.com is always admin
  if (user.email === 'admin@sagecoin.com') return true
  
  return false
}

/**
 * Check if user is member (can access member/VIP content)
 */
export function isMember(user: { user_type?: UserType; joined_vip?: boolean; subscribed_to_courses?: boolean } | null): boolean {
  if (!user) return false
  
  // Check user_type (new system)
  if (user.user_type === 'member' || user.user_type === 'admin') return true
  
  // Fallback to legacy fields
  if (user.joined_vip === true || user.subscribed_to_courses === true) return true
  
  return false
}

/**
 * Check if user can access dashboard (admin only)
 */
export function canAccessDashboard(user: { user_type?: UserType; is_admin?: boolean; email?: string } | null): boolean {
  return isAdmin(user)
}

/**
 * Check if user can access member/VIP content
 */
export function canAccessMemberContent(user: { user_type?: UserType; joined_vip?: boolean; subscribed_to_courses?: boolean } | null): boolean {
  return isMember(user)
}

/**
 * Get user type from user object
 */
export function getUserType(user: { user_type?: UserType; is_admin?: boolean; joined_vip?: boolean; subscribed_to_courses?: boolean; email?: string } | null): UserType {
  if (!user) return 'user'
  
  // Check user_type first (new system)
  if (user.user_type && ['admin', 'user', 'member'].includes(user.user_type)) {
    return user.user_type as UserType
  }
  
  // Fallback: determine from legacy fields
  if (isAdmin(user)) return 'admin'
  if (user.joined_vip === true || user.subscribed_to_courses === true) return 'member'
  
  return 'user'
}

