'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Users, Repeat, X, MessageCircle } from 'lucide-react'

function getWhatsAppUrl(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[\s+\-]/g, '')
  return `https://wa.me/${cleaned}`
}

const products = [
  { 
    id: '01', 
    name: 'Trading Courses', 
    icon: <GraduationCap />, 
    pos: 'md:top-[10%] md:left-[50%]', 
    longDesc: 'Master the markets with institutional-grade curriculum and live sessions.' 
  },
  { 
    id: '02', 
    name: 'One-on-One', 
    icon: <Users />, 
    pos: 'md:top-[calc(10%+280px)] md:left-[55%]', 
    longDesc: 'Direct mentorship to find your psychological edge in the market.' 
  },
  { 
    id: '03', 
    name: 'Copy Trades', 
    icon: <Repeat />, 
    pos: 'md:top-[calc(10%+560px)] md:left-[50%]', 
    longDesc: 'Automate your wealth by mirroring our professional execution in real-time.' 
  },
]

export default function SageVortex() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isHoveringCard, setIsHoveringCard] = useState(false)

  return (
    // min-h-screen and overflow-y-auto ensures mobile users can scroll the list
    <section className="relative w-full min-h-screen bg-[#010409] overflow-x-hidden overflow-y-auto flex flex-col md:block">
      
      {/* 1. BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] md:top-1/2 left-1/2 md:left-[20%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[1000px] md:h-[1000px] bg-cyan-500/10 blur-[80px] md:blur-[180px] rounded-full animate-pulse" />
      </div>

      {/* 2. THE LOGO - Switched to relative on mobile to lead the content */}
      <div className="relative md:absolute z-10 pt-12 md:pt-0 md:top-1/2 md:left-[15%] md:-translate-y-1/2 flex justify-center items-center pointer-events-none">
         <motion.div 
            animate={{ 
              scale: isHoveringCard ? 1.05 : 1,
              filter: isHoveringCard ? 'brightness(1.2)' : 'brightness(1)'
            }}
            className="relative"
         >
            <div className="absolute inset-[-60px] md:inset-[-120px] rounded-full bg-cyan-400/10 blur-[60px] md:blur-[120px]" />
            <img 
               src="/light.png" 
               alt="Sage Engine" 
               className="w-48 h-48 sm:w-64 sm:h-64 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
            />

            {/* PARTICLE SYSTEM */}
            <div className={`absolute inset-0 transition-all duration-1000 ${isHoveringCard ? 'scale-125' : 'scale-100'}`}>
               {[...Array(isHoveringCard ? 24 : 8)].map((_, i) => (
                  <div key={i} className="absolute inset-0 rounded-full"
                    style={{
                      animation: `spin ${isHoveringCard ? '1s' : '4s'} linear infinite`,
                      animationDelay: `-${i * 0.5}s`,
                      transform: `rotate(${i * (360 / (isHoveringCard ? 24 : 8))}deg)`
                    }}>
                    <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] absolute top-0 left-1/2 -translate-x-1/2" />
                  </div>
               ))}
            </div>
         </motion.div>
      </div>

      {/* 3. PRODUCTS - Dynamic Layout */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-6 pb-20 mt-12 md:mt-0 md:block md:px-0 md:pb-0">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layoutId={`card-${product.id}`}
            onClick={() => setSelectedProduct(product)}
            onMouseEnter={() => setIsHoveringCard(true)}
            onMouseLeave={() => setIsHoveringCard(false)}
            // Here is the magic: relative on mobile, absolute on desktop
            className={`relative md:absolute ${product.pos} w-full max-w-[340px] md:max-w-none group cursor-pointer`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
          >
            {/* Energy Line - Only Desktop */}
            <div className="hidden md:block absolute right-full top-1/2 w-[25vw] h-[1px] bg-gradient-to-r from-transparent to-cyan-500/20 origin-right group-hover:to-cyan-400 group-hover:scale-x-110 transition-all duration-700" />
            
            <div className="relative p-6 md:p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-500/50 hover:-translate-y-2 md:w-[400px]">
               <div className="text-cyan-400 mb-4 bg-cyan-500/10 w-fit p-3 rounded-xl border border-cyan-500/20">
                  {product.icon}
               </div>
               <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">
                  {product.name}
               </h3>
               <p className="text-cyan-500/60 text-[10px] font-mono uppercase tracking-[0.4em]">
                  Protocol_Active
               </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. MODAL DIALOG */}
{/* 4. MODAL DIALOG - Reimagined for Trust & Safety */}
<AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop with a more sophisticated blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#010409]/80 backdrop-blur-md"
            />
            
            <motion.div 
              layoutId={`card-${selectedProduct.id}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#0d1117] border border-cyan-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              {/* Top Safety Banner */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Secure_Connection_Established</span>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="text-cyan-400 mb-4 scale-125 origin-left">
                      {selectedProduct.icon}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                      {selectedProduct.name}
                    </h2>
                    <div className="h-[1px] w-24 bg-cyan-500/50 mb-6" />
                    <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                      {selectedProduct.longDesc}
                    </p>
                  </div>

                  {/* Trust Features Grid */}
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-cyan-500/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Institutional Grade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-cyan-500/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Verified Performance</span>
                    </div>
                  </div>
                  
                  <a
                    href={getWhatsAppUrl('+961 81 574 142')}
                    target="_blank"
                    className="group relative flex items-center justify-center gap-3 w-full py-6 bg-white text-black font-black text-xl uppercase tracking-widest rounded-xl overflow-hidden transition-all hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                  >
                    <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                    <span>Initialize Consultation</span>
                    
                    {/* Subtle shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full"
                      animate={{ translateX: ['100%', '-100%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  </a>

                  <p className="text-center text-slate-600 text-[10px] font-mono uppercase">
                    By clicking, you agree to our professional code of conduct.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}