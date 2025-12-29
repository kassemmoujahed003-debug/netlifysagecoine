'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from '@/components/dashboard/Dialog'
import { submitWithdrawal } from '@/app/actions/form-actions'

interface WithdrawalFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function WithdrawalForm({ isOpen, onClose }: WithdrawalFormProps) {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    note: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, amount: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Get token from localStorage for authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null
      
      const result = await submitWithdrawal(
        formData.amount,
        formData.accountNumber,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.note || undefined,
        token || undefined
      )

      if (result.success) {
        setSuccess(true)
        setFormData({
          amount: '',
          accountNumber: '',
          password: '',
          fullName: '',
          phoneNumber: '',
          note: '',
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
      amount: '',
      accountNumber: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      note: '',
    })
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Withdrawal Request"
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
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
            Withdrawal request submitted successfully!
          </div>
        )}

        {/* Amount */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Amount <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={formData.amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="0.00"
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

        {/* Password */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Full Name */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your full name"
            required
            disabled={isSubmitting}
          />
          <p className={`text-accent text-xs mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            The name should be exactly like the name in your Wish account
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your phone number"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Note (Optional) */}
        <div>
          <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  )
}

