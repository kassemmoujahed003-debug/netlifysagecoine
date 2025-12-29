'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'

interface Request {
  id: string
  type: 'password' | 'leverage' | 'withdraw' | 'deposit'
  userName?: string
  userEmail?: string
  details: string
}

interface RequestActionDialogProps {
  isOpen: boolean
  onClose: () => void
  request: Request | null
  action: 'done' | 'reject' | 'pending'
  onConfirm: (action: 'done' | 'reject' | 'pending', notes?: string) => void
}

export default function RequestActionDialog({
  isOpen,
  onClose,
  request,
  action,
  onConfirm,
}: RequestActionDialogProps) {
  const { t, isRTL } = useLanguage()
  const [notes, setNotes] = useState('')

  const handleConfirm = () => {
    onConfirm(action, notes)
    setNotes('')
    onClose()
  }

  if (!request) return null

  const actionLabels = {
    done: t('dashboard.dialogs.requestAction.approve') || 'Mark as Done',
    reject: t('dashboard.dialogs.requestAction.reject') || 'Reject',
    pending: t('dashboard.dialogs.requestAction.setPending') || 'Set Pending',
  }

  const actionColors = {
    done: 'bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30',
    reject: 'bg-red-500 bg-opacity-20 text-red-400 border-red-500 border-opacity-30',
    pending: 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500 border-opacity-30',
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={actionLabels[action]}
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
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-lg hover:opacity-80 transition-colors font-medium border ${
              action === 'done' ? actionColors.done :
              action === 'reject' ? actionColors.reject :
              actionColors.pending
            }`}
          >
            {actionLabels[action]}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-accent text-sm mb-2">
            {t('dashboard.dialogs.requestAction.user')}
          </p>
          <p className="text-base-white font-medium">{request.userEmail || request.userName}</p>
        </div>

        <div>
          <p className="text-accent text-sm mb-2">
            {t('dashboard.dialogs.requestAction.type')}
          </p>
          <p className="text-base-white font-medium">
            {t(`dashboard.requests.types.${request.type}`)}
          </p>
        </div>

        <div>
          <p className="text-accent text-sm mb-2">
            {t('dashboard.dialogs.requestAction.details')}
          </p>
          <p className="text-base-white">{request.details}</p>
        </div>

        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.dialogs.requestAction.notes')} ({t('dashboard.dialogs.requestAction.optional')})
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder={t('dashboard.dialogs.requestAction.notesPlaceholder')}
          />
        </div>
      </div>
    </Dialog>
  )
}

