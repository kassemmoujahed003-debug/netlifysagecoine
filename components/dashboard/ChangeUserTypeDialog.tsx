'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'

interface User {
  id: string
  name: string
  user_type?: 'admin' | 'user' | 'member'
  type?: 'admin' | 'user' | 'member' // For backward compatibility
}

type UserType = 'admin' | 'user' | 'member'

interface ChangeUserTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onConfirm: (newType: UserType) => void
}

export default function ChangeUserTypeDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
}: ChangeUserTypeDialogProps) {
  const { t, isRTL } = useLanguage()
  const [newType, setNewType] = useState<UserType>('user')

  useEffect(() => {
    if (user) {
      setNewType((user.user_type || user.type || 'user') as UserType)
    }
  }, [user])

  const handleConfirm = () => {
    onConfirm(newType)
    onClose()
  }

  if (!user) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.dialogs.changeUserType.title')}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-2"
          >
            {t('dashboard.dialogs.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary px-6 py-2"
          >
            {t('dashboard.dialogs.confirm')}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-accent">
          {t('dashboard.dialogs.changeUserType.message').replace('{{name}}', user.name)}
        </p>
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.dialogs.changeUserType.newType')}
          </label>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as UserType)}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="admin">{t('dashboard.users.types.admin')}</option>
            <option value="user">{t('dashboard.users.types.user')}</option>
            <option value="member">{t('dashboard.users.types.member')}</option>
          </select>
        </div>
      </div>
    </Dialog>
  )
}

