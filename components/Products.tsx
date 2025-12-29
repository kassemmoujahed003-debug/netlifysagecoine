'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Users, Repeat, X } from 'lucide-react'

const products = [
  { 
    id: '01', 
    name: 'Trading Courses', 
    icon: <GraduationCap />, 
    pos: 'top-[15%] left-[55%]', 
    longDesc: 'Master the markets with institutional-grade curriculum and live sessions.' 
  },
  { 
    id: '02', 
    name: 'One-on-One', 
    icon: <Users />, 
    pos: 'top-[38%] left-[60%]', 
    longDesc: 'Direct mentorship to find your psychological edge in the market.' 
  },
  { 
    id: '03', 
    name: 'Copy Trades', 
    icon: <Repeat />, 
    pos: 'top-[61%] left-[65%]', 
    longDesc: 'Automate your wealth by mirroring our professional execution in real-time.' 
  },
]

export default function SageVortex() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isHoveringCard, setIsHoveringCard] = useState(false)

  return (
    <section className="relative w-full h-screen bg-[#010409] overflow-hidden flex items-center">
      
      {/* 1. CINEMATIC BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow focused behind the left-aligned logo */}
        <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-500/5 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-30" />
      </div>

      {/* 2. THE MASSIVE LOGO (LEFT-ALIGNED ENGINE) */}
      <div className="relative z-10 ml-[10%] lg:ml-[15%]">
         <motion.div 
            animate={{ 
              scale: isHoveringCard ? 1.05 : 1,
              filter: isHoveringCard ? 'brightness(1.2)' : 'brightness(1)'
            }}
            transition={{ duration: 0.5 }}
            className="relative"
         >
            {/* Massive Glow Aura */}
            <div className="absolute inset-[-120px] rounded-full bg-cyan-400/10 blur-[120px]" />
            
            <img 
               src="/light.png" 
               alt="Sage Engine" 
               className="w-80 h-80 md:w-[550px] md:h-[550px] object-contain drop-shadow-[0_0_80px_rgba(6,182,212,0.3)]" 
            />

            {/* 3. PARTICLE ACCELERATOR SYSTEM */}
            <div className={`absolute inset-0 transition-all duration-1000 ${isHoveringCard ? 'scale-125' : 'scale-100'}`}>
               {[...Array(isHoveringCard ? 24 : 8)].map((_, i) => (
                  <div 
                    key={i}
                    className={`absolute inset-0 rounded-full border border-transparent`}
                    style={{
                      animation: `spin ${isHoveringCard ? '1s' : '4s'} linear infinite`,
                      animationDelay: `-${i * 0.5}s`,
                      transform: `rotate(${i * (360 / (isHoveringCard ? 24 : 8))}deg)`
                    }}
                  >
                    <div 
                      className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500 ${isHoveringCard ? 'opacity-100' : 'opacity-40'}`} 
                    />
                  </div>
               ))}
            </div>
         </motion.div>
      </div>

      {/* 4. DISORGANIZED LIQUID GLASS CARDS */}
      <div className="absolute inset-0 z-20">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layoutId={`card-${product.id}`}
            onClick={() => setSelectedProduct(product)}
            onMouseEnter={() => setIsHoveringCard(true)}
            onMouseLeave={() => setIsHoveringCard(false)}
            className={`absolute ${product.pos} group cursor-pointer`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + (i * 0.2), duration: 0.8 }}
          >
            {/* Energy Line Tether */}
            <div className="absolute right-full top-1/2 w-[30vw] h-[1px] bg-gradient-to-r from-transparent to-cyan-500/10 origin-right group-hover:to-cyan-400/40 group-hover:scale-x-110 transition-all duration-700 pointer-events-none" />
            
            <div className={`
              relative w-[280px] md:w-[320px] p-4 md:p-6 rounded-2xl border border-white/5 shadow-2xl
              backdrop-blur-xl bg-white/[0.05] transition-all duration-500
              hover:border-cyan-500/40 hover:-translate-y-6 hover:shadow-cyan-500/10
            `}>
               <div className="text-cyan-400 mb-3 bg-cyan-500/10 w-fit p-2.5 rounded-lg border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
                  {product.icon}
               </div>
               <h3 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">
                  {product.name}
               </h3>
               <p className="text-cyan-500/60 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] group-hover:text-cyan-400 transition-colors">
                  Protocol_Active
               </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 5. LIQUID MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[10000]"
            />
            <motion.div 
              layoutId={`card-${selectedProduct.id}`}
              className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit z-[10001] bg-slate-950/80 backdrop-blur-[60px] border border-white/10 rounded-[4rem] p-16 shadow-[0_0_120px_rgba(6,182,212,0.15)]"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors">
                <X size={32} />
              </button>
              
              <div className="space-y-8">
                <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                <p className="text-slate-300 text-xl leading-relaxed font-light">{selectedProduct.longDesc}</p>
                
                <button className="relative w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-2xl uppercase tracking-[0.3em] rounded-3xl hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all group overflow-hidden">
                  <span className="relative z-10">Initialize Connection</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          </>
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