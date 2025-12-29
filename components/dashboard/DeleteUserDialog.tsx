'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'

interface User {
  id: string
  name: string
  email: string
}

interface DeleteUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onConfirm: () => void
}

export default function DeleteUserDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
}: DeleteUserDialogProps) {
  const { t } = useLanguage()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!user) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.dialogs.deleteUser.title')}
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
            className="px-6 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors font-medium border border-red-500 border-opacity-30"
          >
            {t('dashboard.dialogs.delete')}
          </button>
        </>
      }
    >
      <p className="text-accent">
        {t('dashboard.dialogs.deleteUser.message').replace('{{name}}', user.name).replace('{{email}}', user.email)}
      </p>
    </Dialog>
  )
}

