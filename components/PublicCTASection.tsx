'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  MessageCircle, 
  Clock, 
  User, 
  ArrowRight,
  ChevronRight,
  Phone
} from 'lucide-react'
import { submitCallbackRequest } from '@/app/actions/form-actions'

// Helper function to convert phone number to WhatsApp URL
function getWhatsAppUrl(phoneNumber: string): string {
  // Remove all spaces, dashes, and the + sign, then format for WhatsApp
  const cleaned = phoneNumber.replace(/[\s+\-]/g, '')
  return `https://wa.me/${cleaned}`
}

export default function PublicCTASection() {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await submitCallbackRequest(fullName, email, phoneNumber)
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message })
        // Reset form
        setFullName('')
        setEmail('')
        setPhoneNumber('')
        // Hide form after 3 seconds
        setTimeout(() => {
          setShowForm(false)
          setSubmitMessage(null)
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-primary-dark min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Grid: 1 Col on Mobile, 2 Col on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT POD: INFORMATION */}
          <div className="relative group rounded-[2.5rem] border border-accent/10 bg-secondary-surface/40 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-hidden backdrop-blur-sm">
             {/* Subtle Outer Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/20 rounded-[2.5rem] transition-all duration-700 shadow-[inset_0_0_40px_rgba(207,226,243,0.05)]" />
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-dark/80 rounded-full border border-accent/20 shadow-xl">
                <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(207,226,243,0.6)]" />
                <span className="text-base-white text-sm font-bold tracking-wide">Direct Support</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-extrabold text-base-white tracking-tight leading-[1.1]">
                Secure Your <br />
                <span className="text-accent/90">Future</span>
              </h2>

              <p className="text-accent/80 text-lg leading-relaxed max-w-md">
                Test our platform experienced with our expert. Our team typically reaches within 15 minutes during business hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-accent/90">
                  <div className="p-2 bg-primary-dark/60 rounded-lg border border-accent/10"><Send size={18} className="text-accent"/></div>
                  <span className="font-medium">Avg. Response: 15m</span>
                </div>
                <div className="flex items-center gap-4 text-accent/90">
                  <div className="p-2 bg-primary-dark/60 rounded-lg border border-accent/10"><User size={18} className="text-accent"/></div>
                  <span className="font-medium">5,000+ Active Clients</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT POD: INTERACTIVE CHANNELS */}
          <div className="relative rounded-[2.5rem] border border-accent/10 bg-secondary-surface/40 p-8 md:p-10 overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="relative z-10 h-full flex flex-col">
              
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2 text-accent/60 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-accent/30" /> step 01
                 </div>
                 <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(207,226,243,0.5)]">
                    <CheckIcon />
                 </div>
              </div>

              <h3 className="text-base-white font-bold text-xl mb-6">options</h3>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* WhatsApp Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactCard 
                    icon={<MessageCircle className="text-green-400"/>} 
                    title="WhatsApp" 
                    sub="+961 81 574 142" 
                    href={getWhatsAppUrl('+961 81 574 142')}
                  />
                  <ContactCard 
                    icon={<MessageCircle className="text-green-400"/>} 
                    title="WhatsApp" 
                    sub="+961 76 367 139" 
                    href={getWhatsAppUrl('+961 76 367 139')}
                  />
                </div>
                
                {/* Telegram Option */}
                <ContactCard 
                  icon={<Send className="text-accent"/>} 
                  title="Telegram Channel" 
                  sub="@sagecoincom" 
                  href="https://t.me/sagecoincom"
                />
              </div>

              {/* Action Button / Form Area */}
              <div className="mt-auto">
                <AnimatePresence mode="wait">
                  {!showForm ? (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setShowForm(true)}
                      className="w-full bg-gradient-to-r from-accent/80 to-accent p-[1px] rounded-full group shadow-lg shadow-accent/20"
                    >
                      <div className="bg-secondary-surface/60 group-hover:bg-transparent transition-all rounded-full py-5 px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-accent p-2 rounded-full"><ArrowRight size={20} className="text-primary-dark" /></div>
                          <span className="text-base-white font-bold text-lg">Request a Call Back</span>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                           <CheckIcon />
                        </div>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-primary-dark/80 border border-accent/20 p-6 rounded-3xl backdrop-blur-sm"
                    >
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Full Name" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-secondary-surface/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                          required
                        />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-secondary-surface/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                          required
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-secondary-surface/40 border border-accent/20 rounded-xl p-4 text-base-white outline-none focus:border-accent transition-colors placeholder:text-accent/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                          required
                        />
                        
                        {submitMessage && (
                          <div className={`p-3 rounded-xl text-sm font-medium ${
                            submitMessage.type === 'success' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {submitMessage.text}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button 
                            type="button"
                            onClick={() => {
                              setShowForm(false)
                              setSubmitMessage(null)
                              setFullName('')
                              setEmail('')
                              setPhoneNumber('')
                            }}
                            disabled={isSubmitting}
                            className="flex-1 bg-secondary-surface/60 text-base-white font-bold py-4 rounded-xl hover:bg-secondary-surface/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-accent/20"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-accent text-primary-dark font-bold py-4 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ContactCard({ icon, title, sub, href }: any) {
  return (
    <a href={href || "#"} className="flex items-center gap-4 p-5 bg-primary-dark/80 border border-accent/10 rounded-[1.5rem] hover:border-accent/50 transition-all group backdrop-blur-sm">
      <div className="bg-secondary-surface/60 p-3 rounded-2xl group-hover:scale-110 transition-transform border border-accent/10">
        {icon}
      </div>
      <div>
        <p className="text-base-white font-bold text-sm">{title}</p>
        <p className="text-accent/70 text-xs mt-0.5">{sub}</p>
      </div>
    </a>
  )
}

function CheckIcon() {
  return (
    <div className="text-primary-dark">
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5.2L4.2 8.4L11 1.6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}