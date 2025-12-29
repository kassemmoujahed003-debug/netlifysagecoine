'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

type Mode = 'login' | 'signup'

export default function LoginForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            language: language || 'en',
          }),
        })

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          console.error('Non-JSON response:', text)
          throw new Error('Server error: Received invalid response. Please check if Supabase is configured correctly.')
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        // If we have a session from signup, use it
        if (data.session?.access_token) {
          localStorage.setItem('supabase_token', data.session.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          router.push('/dashboard')
          router.refresh()
        } else {
          // If no session was returned, automatically log in the user
          // This ensures they're authenticated immediately after signup
          try {
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
              }),
            })

            const loginContentType = loginResponse.headers.get('content-type')
            if (!loginContentType || !loginContentType.includes('application/json')) {
              const text = await loginResponse.text()
              console.error('Non-JSON response from login:', text)
              throw new Error('Failed to log in after signup')
            }

            const loginData = await loginResponse.json()

            if (!loginResponse.ok) {
              throw new Error(loginData.error || 'Failed to log in after signup')
            }

            if (loginData.session?.access_token) {
              localStorage.setItem('supabase_token', loginData.session.access_token)
              localStorage.setItem('user', JSON.stringify(loginData.user))
            }

            router.push('/dashboard')
            router.refresh()
          } catch (loginErr) {
            // If auto-login fails, show error but don't redirect to login
            // The user was successfully created, they just need to log in manually
            setError('Account created successfully! Please log in with your email and password.')
            setIsLoading(false)
            // Switch to login mode so they can log in immediately
            setMode('login')
            setPassword('')
            setConfirmPassword('')
          }
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          console.error('Non-JSON response:', text)
          throw new Error('Server error: Received invalid response. Please check if Supabase is configured correctly.')
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        if (data.session?.access_token) {
          localStorage.setItem('supabase_token', data.session.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative group px-4 sm:px-0">
        {/* === THE HUD BRACKETS (Corner Accents) === */}
        <div className="absolute -top-[2px] -left-[2px] w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-accent z-20 opacity-70"></div>
        <div className="absolute -top-[2px] -right-[2px] w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-accent z-20 opacity-70"></div>
        <div className="absolute -bottom-[2px] -left-[2px] w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-accent z-20 opacity-70"></div>
        <div className="absolute -bottom-[2px] -right-[2px] w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-accent z-20 opacity-70"></div>

      {/* Main Login Console Container */}
      <div className="relative bg-primary-dark border border-white/10 p-5 sm:p-6 md:p-8 lg:p-10 text-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]">
        
        {/* Technical Grid Background Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        {/* Ambient Blue Glow */}
        <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-48 sm:w-64 h-48 sm:h-64 bg-accent/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none mix-blend-screen"></div>


        <div className="relative z-10">
            {/* WELCOMING HEADER */}
            <div className="mb-6 sm:mb-8 lg:mb-10 space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2 rounded-full">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                    Secure Terminal
                </div>
                
                {/* Mode Toggle */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('login')
                            setError(null)
                        }}
                        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold text-sm sm:text-base transition-all ${
                            mode === 'login'
                                ? 'bg-accent text-primary-dark'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('signup')
                            setError(null)
                        }}
                        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold text-sm sm:text-base transition-all ${
                            mode === 'signup'
                                ? 'bg-accent text-primary-dark'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-base-white leading-tight">
                {mode === 'login' ? 'Ready to Master the Markets?' : 'Join SageCoin Today'}
                </h1>
                <p className="text-accent/80 text-xs sm:text-sm leading-relaxed font-medium max-w-xs mx-auto">
                {mode === 'login'
                    ? 'Log in to access institutional-grade insights and start your journey to financial success.'
                    : 'Create your account to unlock exclusive trading courses and VIP trading signals.'}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs sm:text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6 text-left">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-accent text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-1.5 sm:mb-2">
                Email Address
                </label>
                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-primary-dark/50 border border-white/10 text-base-white px-3 sm:px-4 py-2.5 sm:py-3 rounded focus:outline-none focus:border-accent transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] placeholder-white/30 text-sm sm:text-base"
                        placeholder="Enter your email"
                        required
                    />
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-accent/50 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-accent/50 pointer-events-none"></div>
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-accent text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-1.5 sm:mb-2">
                Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-primary-dark/50 border border-white/10 text-base-white px-3 sm:px-4 py-2.5 sm:py-3 rounded focus:outline-none focus:border-accent transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] placeholder-white/30 pr-10 sm:pr-12 text-sm sm:text-base"
                        placeholder={mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                        required
                        minLength={mode === 'signup' ? 6 : undefined}
                    />
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-accent/50 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-accent/50 pointer-events-none"></div>

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-accent/50 hover:text-accent focus:outline-none p-1 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirm Password Field (Signup only) */}
            {mode === 'signup' && (
                <div>
                    <label htmlFor="confirmPassword" className="block text-accent text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-1.5 sm:mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-primary-dark/50 border border-white/10 text-base-white px-3 sm:px-4 py-2.5 sm:py-3 rounded focus:outline-none focus:border-accent transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] placeholder-white/30 pr-10 sm:pr-12 text-sm sm:text-base"
                            placeholder="Confirm your password"
                            required
                            minLength={6}
                        />
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-accent/50 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-accent/50 pointer-events-none"></div>

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-accent/50 hover:text-accent focus:outline-none p-1 transition-colors"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 sm:py-3 text-base sm:text-lg font-bold tracking-wide relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="relative z-10">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm sm:text-base">{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                        </span>
                    ) : (
                        mode === 'login' ? 'Initiate Session' : 'Create Account'
                    )}
                </span>
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 pointer-events-none"></div>
            </button>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs font-mono uppercase">
                <span className="px-2 bg-primary-dark text-accent/60">Alternative Access</span>
                </div>
            </div>

            {/* Patreon Login Button */}
            <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 bg-[#FF424D]/10 border border-[#FF424D]/30 text-[#FF424D] hover:bg-[#FF424D]/20 hover:text-white transition-colors rounded font-semibold text-sm sm:text-base"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M15.17 2.17c-3.87 0-7 3.13-7 7 0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm0 11.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
                </svg>
                <span>Log in with Patreon</span>
            </button>

            {/* Forgot Password Link (Login only) */}
            {mode === 'login' && (
                <div className="text-center mt-4 sm:mt-6">
                    <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-accent/70 hover:text-accent transition-colors duration-200 font-mono"
                    >
                    &gt; Reset Credentials
                    </Link>
                </div>
            )}

            {/* Switch Mode Link */}
            <div className="text-center mt-3 sm:mt-4">
                <button
                    type="button"
                    onClick={() => {
                        setMode(mode === 'login' ? 'signup' : 'login')
                        setError(null)
                        setPassword('')
                        setConfirmPassword('')
                    }}
                    className="text-xs sm:text-sm text-accent/70 hover:text-accent transition-colors duration-200 font-mono"
                >
                    {mode === 'login' 
                        ? '> Don\'t have an account? Sign Up'
                        : '> Already have an account? Sign In'}
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  )
}
