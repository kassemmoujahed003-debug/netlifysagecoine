'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from '@/components/dashboard/Dialog'
import { submitChangePassword } from '@/app/actions/form-actions'

interface ChangePasswordFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordForm({ isOpen, onClose }: ChangePasswordFormProps) {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    accountNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Get token from localStorage for authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null
      
      const result = await submitChangePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.accountNumber,
        token || undefined
      )

      if (result.success) {
        setSuccess(true)
        setFormData({
          currentPassword: '',
          newPassword: '',
          accountNumber: '',
        })
        // Close after 2 seconds
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      accountNumber: '',
    })
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t('dashboard.changePassword')}
      size="md"
      footer={
        <>
          <button
            onClick={handleClose}
            className="btn-secondary px-6 py-2"
            disabled={isSubmitting}
          >
            {t('dashboard.dialogs.cancel') || 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary px-6 py-2"
          >
            {isSubmitting ? 'Submitting...' : (t('dashboard.dialogs.submit') || 'Submit')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 text-green-400 text-sm">
            Password change request submitted successfully!
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Current Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* New Password */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            New Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Account Number */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Account Number <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  )
}

