import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-primary-dark flex flex-col">
      {/* Header with back link */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-accent/70 hover:text-accent transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
      
      {/* Login Form centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 safe-area-inset">
        <LoginForm />
      </div>
      
      {/* Footer */}
      <div className="text-center py-4 sm:py-6 text-accent/40 text-xs sm:text-sm">
        © {new Date().getFullYear()} SageCoin Community. All rights reserved.
      </div>
    </main>
  )
} 
