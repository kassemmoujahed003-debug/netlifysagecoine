'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'

type UserType = 'admin' | 'user' | 'member'

interface User {
  id: string
  name?: string
  email: string
  user_type?: UserType
  type?: UserType | 'vip' | 'subscriber' | 'regular'
  status?: 'active' | 'inactive'
}

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (userData: Partial<User>) => void
}

export default function EditUserDialog({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserDialogProps) {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    user_type: 'user' as UserType,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        user_type: user.user_type || (user.type as UserType) || 'user',
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!user) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.dialogs.editUser.title')}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-2"
          >
            {t('dashboard.dialogs.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary px-6 py-2"
          >
            {t('dashboard.dialogs.save')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.dialogs.editUser.email')}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        {/* User Type */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.dialogs.editUser.type')}
          </label>
          <select
            value={formData.user_type}
            onChange={(e) => setFormData({ ...formData, user_type: e.target.value as UserType })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="user">{t('dashboard.users.types.user') || 'User'}</option>
            <option value="member">{t('dashboard.users.types.member') || 'Member'}</option>
            <option value="admin">{t('dashboard.users.types.admin') || 'Admin'}</option>
          </select>
        </div>
      </form>
    </Dialog>
  )
}

