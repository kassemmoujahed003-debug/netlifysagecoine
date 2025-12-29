'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'
import { 
  getAllMarketIntelligenceItems, 
  createMarketIntelligenceItem, 
  updateMarketIntelligenceItem, 
  deleteMarketIntelligenceItem
} from '@/services/marketIntelligenceService'
import { MarketIntelligence } from '@/types/database'
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Plus, 
  Activity, 
  Calendar, 
  Layers,
  X 
} from 'lucide-react'

export default function MarketIntelligenceList() {
  const { t, isRTL } = useLanguage()
  const [items, setItems] = useState<MarketIntelligence[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MarketIntelligence | null>(null)
  const [deletingItem, setDeletingItem] = useState<MarketIntelligence | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    impact: 'Medium' as 'High' | 'Medium' | 'Low',
    date: new Date().toISOString().split('T')[0],
    description: '',
    explanation: '',
    display_order: 0,
    is_active: true,
  })

  // Load items from database
  const loadItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedItems = await getAllMarketIntelligenceItems()
      // Sort by display order
      setItems(fetchedItems.sort((a, b) => a.display_order - b.display_order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Navigation Logic
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % items.length)
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)

  // Form Management
  const handleOpenForm = (item?: MarketIntelligence) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        impact: item.impact,
        date: item.date,
        description: item.description,
        explanation: item.explanation,
        display_order: item.display_order,
        is_active: item.is_active,
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        impact: 'Medium',
        date: new Date().toISOString().split('T')[0],
        description: '',
        explanation: '',
        display_order: items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 0,
        is_active: true,
      })
    }
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await updateMarketIntelligenceItem(editingItem.id, formData)
      } else {
        await createMarketIntelligenceItem(formData)
      }
      await loadItems()
      setIsFormOpen(false)
    } catch (err) {
      setError('Failed to save protocol data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setIsSubmitting(true)
    try {
      await deleteMarketIntelligenceItem(deletingItem.id)
      await loadItems()
      setIsDeleteDialogOpen(false)
      if (currentIndex >= items.length - 1) setCurrentIndex(0)
    } catch (err) {
      setError('Failed to terminate item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getImpactStyles = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'Medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      default: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <p className="text-cyan-500 font-mono text-xs tracking-widest animate-pulse">SYNCING_INTELLIGENCE_BASE</p>
    </div>
  )

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-6">
      
      {/* 1. HEADER CONTROL BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-[.4em] uppercase">
            <Activity size={14} className="animate-pulse" /> Live Market Feed
          </div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Market <span className="text-cyan-500">Sage</span>
          </h2>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="group relative px-6 py-3 bg-cyan-500 text-black font-black uppercase tracking-tighter rounded-xl overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2 text-sm"><Plus size={18} /> New Entry</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      {/* 2. THE 3D CAROUSEL */}
      <div className="relative h-[500px] flex items-center justify-center perspective-[1500px]">
        {items.length === 0 ? (
          <div className="text-center text-slate-500 font-mono uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[3rem] p-20">
            Awaiting Deployment...
          </div>
        ) : (
          <div className="relative w-full max-w-3xl h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotateY: 30, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -30, x: -100, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 80 }}
                className="w-full"
              >
                {/* THE LIQUID GLASS CARD */}
                <div className="relative p-10 md:p-14 rounded-[3.5rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/10 shadow-2xl group overflow-hidden">
                  
                  {/* Glowing Ornament */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/5 blur-[80px] rounded-full group-hover:bg-cyan-500/10 transition-colors" />

                  <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase ${getImpactStyles(items[currentIndex].impact)}`}>
                        {items[currentIndex].impact} IMPACT
                      </span>
                      <div className="flex gap-4">
                        <button onClick={() => handleOpenForm(items[currentIndex])} className="text-white/30 hover:text-cyan-400 transition-colors"><Edit3 size={18}/></button>
                        <button onClick={() => { setDeletingItem(items[currentIndex]); setIsDeleteDialogOpen(true); }} className="text-white/30 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </div>

                    <div>
                      <span className="text-cyan-500/60 font-mono text-xs tracking-[0.5em] mb-4 block">{items[currentIndex].date}</span>
                      <h3 className="text-4xl md:text-6xl font-black text-white italic leading-none uppercase tracking-tighter mb-6">
                        {items[currentIndex].title}
                      </h3>
                      <p className="text-slate-400 text-lg md:text-xl leading-relaxed line-clamp-3 font-light">
                        {items[currentIndex].description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                       <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          <Layers size={14} /> Sequence: {items[currentIndex].display_order}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          <Activity size={14} /> Status: {items[currentIndex].is_active ? 'Online' : 'Offline'}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAV OVERLAYS */}
            <button onClick={handlePrev} className="absolute -left-12 lg:-left-24 p-5 rounded-full border border-white/5 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
              <ChevronLeft size={32} />
            </button>
            <button onClick={handleNext} className="absolute -right-12 lg:-right-24 p-5 rounded-full border border-white/5 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </div>

      {/* 3. PAGINATION TABS */}
      <div className="flex justify-center gap-3 mt-12">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-16 bg-cyan-500 shadow-[0_0_15px_#22d3ee]' : 'w-4 bg-white/10 hover:bg-white/20'}`}
          />
        ))}
      </div>

      {/* 4. CRUD FORM DIALOG */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? 'RECALIBRATE PROTOCOL' : 'DEPLOY NEW INTEL'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Headline</label>
            <input
              type="text" value={formData.title} required
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact Level</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value as any })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deployment Date</label>
              <input
                type="date" value={formData.date} required
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Description</label>
            <textarea
              value={formData.description} required rows={3}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white resize-none focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Impact Analysis (Explanation)</label>
            <textarea
              value={formData.explanation} required rows={6}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white resize-none focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <label className="flex items-center gap-3 cursor-pointer h-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-white text-sm">{formData.is_active ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit" disabled={isSubmitting}
              className="flex-1 py-5 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'PROCESSING...' : editingItem ? 'UPDATE_INTEL' : 'DEPLOY_INTEL'}
            </button>
          </div>
        </form>
      </Dialog>

      {/* 5. DELETE CONFIRMATION */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="TERMINATE INTEL"
      >
        <div className="space-y-8 pt-4 text-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-300 text-lg">Are you sure you want to terminate <span className="text-white font-bold italic">"{deletingItem?.title}"</span>? This action is permanent.</p>
          <div className="flex gap-4">
            <button onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 py-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all">ABORT</button>
            <button onClick={handleDeleteConfirm} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all uppercase tracking-widest">TERMINATE</button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}