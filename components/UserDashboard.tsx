'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ChangePasswordForm from '@/components/forms/ChangePasswordForm'
import WithdrawalForm from '@/components/forms/WithdrawalForm'
import DepositForm from '@/components/forms/DepositForm'

interface UserDashboardProps {
  currentLeverage: number
  currentLotSize: number
}

export default function UserDashboard({ currentLeverage, currentLotSize }: UserDashboardProps) {
  const { t, isRTL } = useLanguage()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showWithdrawal, setShowWithdrawal] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)

  const handleChangePassword = () => {
    setShowChangePassword(true)
  }

  const handleWithdrawal = () => {
    setShowWithdrawal(true)
  }

  const handleDeposit = () => {
    setShowDeposit(true)
  }

  const actions = [
    {
      label: t('dashboard.changePassword'),
      onClick: handleChangePassword,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    {
      label: 'Withdrawal',
      onClick: handleWithdrawal,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: 'Deposit',
      onClick: handleDeposit,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      {/* Settings Bar */}
      <div className="bg-secondary-surface border border-accent/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-white mb-4 sm:mb-5 lg:mb-6">
          {t('dashboard.settings')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`btn-secondary ${isRTL ? 'text-right' : 'text-left'} px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3 sm:gap-4 justify-between hover:scale-[1.02] active:scale-[0.98] transition-transform group`}
            >
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  {action.icon}
                </div>
                <span className="text-base-white font-semibold text-sm sm:text-base">{action.label}</span>
              </div>
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 text-accent/50 group-hover:text-accent transition-colors ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Form Modals */}
      <ChangePasswordForm
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <WithdrawalForm
        isOpen={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
      />
      <DepositForm
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
      />
    </section>
  )
}
