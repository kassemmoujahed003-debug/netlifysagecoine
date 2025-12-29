'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import EditUserDialog from './EditUserDialog'
import DeleteUserDialog from './DeleteUserDialog'
import ChangeUserTypeDialog from './ChangeUserTypeDialog'
import UserActionsMenu from './UserActionsMenu'
import { getAllUsers, updateUser, type User } from '@/services/userService'

type FilterType = 'all' | 'admin' | 'user' | 'member'

export default function UserList() {
  const { t, isRTL } = useLanguage()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [changeTypeDialogOpen, setChangeTypeDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load users from API
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const userType = user.user_type || user.type || 'user'
    const matchesType = filter === 'all' || userType === filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500 border-opacity-30'
      case 'member':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500 border-opacity-30'
      case 'user':
        return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500 border-opacity-30'
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500 border-opacity-30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={t('dashboard.users.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-secondary-surface border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
            }`}
          >
            {t('dashboard.users.filters.all')}
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'admin'
                ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
            }`}
          >
            {t('dashboard.users.filters.admin')}
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'user'
                ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
            }`}
          >
            {t('dashboard.users.filters.user')}
          </button>
          <button
            onClick={() => setFilter('member')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'member'
                ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
            }`}
          >
            {t('dashboard.users.filters.member')}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-accent/60">
          <p>Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">
          <p>{error}</p>
          <button
            onClick={loadUsers}
            className="mt-2 text-sm underline hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-surface border border-accent rounded-lg p-4">
            <div className="text-accent text-sm mb-1">{t('dashboard.users.stats.total')}</div>
            <div className="text-2xl font-bold text-base-white">{users.length}</div>
          </div>
          <div className="bg-secondary-surface border border-accent rounded-lg p-4">
            <div className="text-accent text-sm mb-1">{t('dashboard.users.stats.admin')}</div>
            <div className="text-2xl font-bold text-base-white">
              {users.filter((u) => (u.user_type || u.type) === 'admin').length}
            </div>
          </div>
          <div className="bg-secondary-surface border border-accent rounded-lg p-4">
            <div className="text-accent text-sm mb-1">{t('dashboard.users.stats.member')}</div>
            <div className="text-2xl font-bold text-base-white">
              {users.filter((u) => (u.user_type || u.type) === 'member').length}
            </div>
          </div>
          <div className="bg-secondary-surface border border-accent rounded-lg p-4">
            <div className="text-accent text-sm mb-1">{t('dashboard.users.stats.user')}</div>
            <div className="text-2xl font-bold text-base-white">
              {users.filter((u) => (u.user_type || u.type) === 'user').length}
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      {!isLoading && !error && (
      <div className="bg-secondary-surface border border-accent rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-dark border-b border-accent">
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.name')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.email')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.type')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.joinedDate')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.status')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.users.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent divide-opacity-20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary-dark transition-colors">
                  <td className={`px-6 py-4 text-base-white ${isRTL ? 'text-right' : 'text-left'}`}>
                    {user.name}
                  </td>
                  <td className={`px-6 py-4 text-accent ${isRTL ? 'text-right' : 'text-left'}`}>
                    {user.email}
                  </td>
                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(user.user_type || user.type || 'user')}`}
                    >
                      {t(`dashboard.users.types.${user.user_type || user.type || 'user'}`)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-accent ${isRTL ? 'text-right' : 'text-left'}`}>
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : 'bg-red-500 bg-opacity-20 text-red-400'
                      }`}
                    >
                      {t(`dashboard.users.status.${user.status}`)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <UserActionsMenu
                      user={user}
                      onEdit={() => {
                        setSelectedUser(user)
                        setEditDialogOpen(true)
                      }}
                      onChangeType={() => {
                        setSelectedUser(user)
                        setChangeTypeDialogOpen(true)
                      }}
                      onDelete={() => {
                        setSelectedUser(user)
                        setDeleteDialogOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-accent">
            {t('dashboard.users.noUsers')}
          </div>
        )}
        </div>
      )}

      {/* Dialogs */}
      <EditUserDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={async (userData) => {
          if (!selectedUser) return
          
          try {
            await updateUser(selectedUser.id, userData as any)
            // Refresh users list after update
            await loadUsers()
            setEditDialogOpen(false)
          } catch (error) {
            console.error('Error updating user:', error)
            alert(error instanceof Error ? error.message : 'Failed to update user')
          }
        }}
      />

      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirm={async () => {
          if (!selectedUser) return
          
          try {
            // TODO: Implement delete API endpoint
            console.log('Delete user:', selectedUser.id)
            alert('Delete functionality will be implemented soon')
            // await deleteUser(selectedUser.id)
            // await loadUsers()
            setDeleteDialogOpen(false)
          } catch (error) {
            console.error('Error deleting user:', error)
            alert(error instanceof Error ? error.message : 'Failed to delete user')
          }
        }}
      />

      <ChangeUserTypeDialog
        isOpen={changeTypeDialogOpen}
        onClose={() => {
          setChangeTypeDialogOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirm={async (newType) => {
          if (!selectedUser) return
          
          try {
            await updateUser(selectedUser.id, { user_type: newType })
            // Refresh users list after update
            await loadUsers()
            setChangeTypeDialogOpen(false)
          } catch (error) {
            console.error('Error changing user type:', error)
            alert(error instanceof Error ? error.message : 'Failed to change user type')
          }
        }}
      />
    </div>
  )
}

