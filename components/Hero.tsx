'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Trophy, Shield, Activity, X, ChevronRight, Globe } from 'lucide-react'
import MarketStatusBadge from './MarketStatusBadge'
import { submitCallbackRequest } from '@/app/actions/form-actions'

export default function Hero() {
  const { t, isRTL } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => setIsClient(true), [])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      const result = await submitCallbackRequest(fullName, email, phoneNumber)
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message })
        // Reset form fields
        setFullName('')
        setEmail('')
        setPhoneNumber('')
        setTimeout(() => { 
          setShowContactForm(false)
          setSubmitMessage(null)
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: t('hero.form.errorOccurred') })
    } finally { setIsSubmitting(false) }
  }

  if (!isClient) return null

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#71717a_1px,transparent_1px),linear-gradient(to_bottom,#71717a_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className={`container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
        
        {/* LEFT: CONTENT */}
        <div className="lg:col-span-7 space-y-10 self-center">
          <div className={`flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-accent/80 ${isRTL ? 'justify-end' : ''}`}>
            <Activity className="w-3 h-3 animate-pulse" />
            <span>INSTITUTIONAL_UPLINK</span>
          </div>

          <h1 className="relative text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase italic">
            <span className="relative inline-block">
                {/* Background Dull Text */}
                <span className="text-zinc-800/40">ULTIMATE</span>
                {/* Smooth Sliding Gold Overlay */}
                <span className="absolute inset-0 text-accent overflow-hidden animate-[smoothReveal_2.5s_cubic-bezier(.65,0,.35,1)_forwards] border-r-2 border-accent/50">
                    ULTIMATE
                </span>
            </span>
            <br />
            <span className="text-base-white">SUCCESS</span>
          </h1>

          <p className="text-accent/60 max-w-lg text-lg font-light leading-relaxed border-l border-zinc-800/50 pl-8">
            {t('hero.description')}
          </p>

          <div className={`flex flex-wrap gap-6 ${isRTL ? 'justify-end' : ''}`}>
            <button 
              onClick={() => setShowContactForm(true)}
              className="group px-10 py-5 bg-accent text-primary-dark font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:scale-[1.02] shadow-[0_10px_40px_-10px_rgba(var(--accent-rgb),0.3)]"
            >
              <span>{t('hero.ctaButton')}</span>
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* RIGHT: 3D STACK */}
        <div className="lg:col-span-5 relative h-[500px] [perspective:2000px] flex items-center justify-center">
          <div className="absolute w-72 h-80 bg-secondary-surface/60 backdrop-blur-2xl border border-white/10 [transform:rotateY(-20deg)_rotateX(10deg)] shadow-2xl flex flex-col items-center justify-between p-8 z-20">
            <Trophy className="w-14 h-14 text-accent drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.4)]" />
            <div className="text-center">
              <div className="text-[9px] text-zinc-500 font-bold tracking-[0.3em] uppercase mb-2 italic">Portfolio Yield</div>
              <div className="text-5xl font-mono text-base-white tracking-tighter tabular-nums">+24.8<span className="text-accent text-lg">%</span></div>
            </div>
            <div className="text-[9px] text-accent/40 font-bold uppercase tracking-[0.2em]">Verified_Result</div>
          </div>

          <div className="absolute w-52 h-28 bg-secondary-surface/90 border border-white/5 [transform:rotateY(-20deg)_rotateX(10deg)_translateZ(100px)_translateX(-130px)_translateY(130px)] shadow-2xl z-30 p-5 flex flex-col justify-between backdrop-blur-md">
            <Shield className="w-5 h-5 text-accent/70" />
            <div>
              <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Protocol</div>
              <div className="text-xs font-bold text-base-white uppercase tracking-tighter">Tier-1 Security</div>
            </div>
          </div>

          <div className="absolute w-60 h-28 bg-white/5 border border-white/5 [transform:rotateY(-20deg)_rotateX(10deg)_translateZ(-120px)_translateX(140px)_translateY(-100px)] z-10 p-6 backdrop-blur-sm">
             <MarketStatusBadge market="NYSE" />
             <div className="mt-4 flex items-center gap-2 text-zinc-500">
                <Globe className="w-3 h-3" />
                <span className="text-[8px] uppercase font-mono tracking-widest">Global: Online</span>
             </div>
          </div>
        </div>
      </div>

      {/* FORM: HIGH CONTRAST */}
      {showContactForm && (
        <div className="fixed inset-0 z-[100] bg-primary-dark/95 backdrop-blur-md flex items-center justify-end" onClick={() => { setShowContactForm(false); setFullName(''); setEmail(''); setPhoneNumber(''); setSubmitMessage(null); }}>
          <div className={`h-full w-full max-w-xl bg-secondary-surface ${isRTL ? 'border-r' : 'border-l'} border-white/10 p-12 md:p-20 flex flex-col justify-center relative shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`} onClick={(e)=>e.stopPropagation()}>
            <button onClick={() => { setShowContactForm(false); setFullName(''); setEmail(''); setPhoneNumber(''); setSubmitMessage(null); }} className={`absolute top-10 ${isRTL ? 'left-10' : 'right-10'} text-white hover:text-accent transition-all`}>
              <X className="w-8 h-8 font-light" />
            </button>
            
            <div className="mb-16">
              <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-accent font-bold">{t('hero.form.secureUplink')}</span>
              <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mt-2">{t('hero.form.requestAccess')}</h2>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-12">
              <div className="space-y-2">
                <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">{t('hero.form.fullIdentity')}</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-zinc-800 py-3 text-2xl text-white outline-none focus:border-accent transition-all placeholder:text-zinc-800"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">{t('hero.form.communicationPoint')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-zinc-800 py-3 text-2xl text-white outline-none focus:border-accent transition-all placeholder:text-zinc-800"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">{t('hero.form.directPhone')}</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-zinc-800 py-3 text-2xl text-white outline-none focus:border-accent transition-all placeholder:text-zinc-800"
                  required 
                />
              </div>

              {submitMessage && (
                <div className={`p-4 font-mono text-sm font-bold border ${submitMessage.type === 'success' ? 'text-green-400 border-green-400/20' : 'text-red-400 border-red-400/20'}`}>
                  {`> ${submitMessage.text.toUpperCase()}`}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-primary-dark py-6 font-black uppercase tracking-[0.3em] hover:bg-accent transition-all disabled:opacity-50">
                {isSubmitting ? t('hero.form.processing') : t('hero.form.establishLink')}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes smoothReveal {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </section>
  )
}