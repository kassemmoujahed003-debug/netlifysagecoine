'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Instagram, Send, Phone, MessageSquare, TrendingUp, Globe } from 'lucide-react'

export default function Footer() {
  const { t, isRTL, language } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socials = [
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/sagecoin_community", label: "Instagram", color: "hover:text-pink-500" },
    { icon: <Send size={20} />, href: "https://t.me/sagecoincom", label: "Telegram", color: "hover:text-sky-400" },
    { icon: <MessageSquare size={20} />, href: "https://www.tiktok.com/@sagecoin.comunity", label: "TikTok", color: "hover:text-cyan-400" },
  ]

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="relative bg-[#020617] overflow-hidden border-t border-cyan-500/20">
      {/* 1. TOP TICKER BAR - The "Market Pulse" */}
      <div className="w-full bg-cyan-500/5 border-b border-cyan-500/10 py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-8 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">
              <TrendingUp size={12} />
              SAGE/USD +12.5% • BTC/USD +2.4% • SUCCESS IMMINENT •
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          
          {/* Column 1: The Brand Identity */}
          <div className={`space-y-6 ${isRTL ? 'text-right lg:text-right' : 'text-left'}`}>
            <h3 className="text-2xl font-black italic tracking-tighter text-white">
              SAGE<span className="text-cyan-500">COIN</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {language === 'ar' 
                ? 'نحن لا نتوقع المستقبل، نحن نصنعه من خلال البيانات والرؤية الحكيمة.' 
                : "We don't predict the future; we build it through data and sage-level insight."}
            </p>
            <div className={`flex gap-4 ${isRTL ? 'justify-end lg:justify-start' : 'justify-start'}`}>
              {socials.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href}
                  className={`p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-cyan-500/10 hover:border-cyan-500/50 ${social.color} hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Terminal Links */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6">{t('footer.quick_links') || 'Navigate'}</h4>
            <ul className="space-y-4">
              {['privacy', 'terms', 'contact'].map((link) => (
                <li key={link}>
                  <Link href={`/${link}`} className={`text-slate-500 hover:text-cyan-400 text-sm transition-all flex items-center gap-2 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {isRTL ? (
                      <>
                        <span>{t(`footer.${link}`)}</span>
                        <div className="h-[1px] w-0 bg-cyan-500 transition-all group-hover:w-4" />
                      </>
                    ) : (
                      <>
                        <div className="h-[1px] w-0 bg-cyan-500 transition-all group-hover:w-4" />
                        <span>{t(`footer.${link}`)}</span>
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Technical Support Hub */}
          <div className={`lg:col-span-2 bg-cyan-500/5 p-8 rounded-3xl border border-cyan-500/10 backdrop-blur-sm relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Background Accent */}
            <div className={`absolute top-0 p-4 opacity-10 ${isRTL ? 'left-0' : 'right-0'}`}>
               <Globe size={120} className="text-cyan-500" />
            </div>
            
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6">
              {language === 'ar' ? 'مركز الدعم الفني' : 'Technical Support Hub'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["+961 81 574 142", "+961 76 367 139"].map((num, idx) => (
                <a 
                  key={idx}
                  href={`tel:${num}`}
                  className={`flex flex-col gap-1 group ${isRTL ? 'items-end sm:items-start' : 'items-start'}`}
                >
                  <span className="text-[10px] text-cyan-500/60 font-mono uppercase">Agent 0{idx + 1}</span>
                  <div className={`flex items-center gap-3 text-white font-medium group-hover:text-cyan-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone size={16} />
                    <span dir="ltr">{num}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className={`mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <p className={`text-slate-600 text-[10px] uppercase tracking-widest font-mono ${isRTL ? 'text-right' : 'text-left'}`}>
            © {currentYear} SageCoin Global • All Protocol Rights Reserved
          </p>
          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                <span className="text-slate-500 text-[10px] uppercase tracking-tighter">Nodes Online</span>
             </div>
             <div className="text-slate-500 text-[10px] uppercase tracking-tighter">Latency: 14ms</div>
          </div>
        </div>
      </div>

      {/* Decorative Background Curve */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
    </footer>
  )
}