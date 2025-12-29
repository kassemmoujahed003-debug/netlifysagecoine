'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'
import { 
  getAllVipDashboardPreviews, 
  createVipDashboardPreview, 
  updateVipDashboardPreview, 
  deleteVipDashboardPreview
} from '@/services/vipDashboardPreviewService'
import { VipDashboardPreview } from '@/types/database'

export default function VipDashboardPreviewList() {
  const { t, isRTL } = useLanguage()
  const [previews, setPreviews] = useState<VipDashboardPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPreview, setEditingPreview] = useState<VipDashboardPreview | null>(null)
  const [deletingPreview, setDeletingPreview] = useState<VipDashboardPreview | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    type: 'latest_signal' as 'latest_signal' | 'expert_insight',
    symbol: '',
    action: 'BUY' as 'BUY' | 'SELL',
    price: '',
    text_en: '',
    text_ar: '',
    is_active: true,
  })

  // Load previews
  useEffect(() => {
    loadPreviews()
  }, [])

  const loadPreviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedPreviews = await getAllVipDashboardPreviews()
      setPreviews(fetchedPreviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load previews')
      console.error('Error loading previews:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form open/close
  const handleOpenForm = (preview?: VipDashboardPreview) => {
    if (preview) {
      setEditingPreview(preview)
      setFormData({
        type: preview.type,
        symbol: preview.symbol || '',
        action: preview.action || 'BUY',
        price: preview.price || '',
        text_en: preview.text_en || '',
        text_ar: preview.text_ar || '',
        is_active: preview.is_active,
      })
    } else {
      setEditingPreview(null)
      setFormData({
        type: 'latest_signal',
        symbol: '',
        action: 'BUY',
        price: '',
        text_en: '',
        text_ar: '',
        is_active: true,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPreview(null)
    setFormData({
      type: 'latest_signal',
      symbol: '',
      action: 'BUY',
      price: '',
      text_en: '',
      text_ar: '',
      is_active: true,
    })
    setError(null)
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields based on type
    if (formData.type === 'latest_signal') {
      if (!formData.symbol || !formData.action || !formData.price) {
        setError('Please fill in all required fields for Latest Signal (symbol, action, price)')
        return
      }
    } else if (formData.type === 'expert_insight') {
      if (!formData.text_en || !formData.text_ar) {
        setError('Please fill in all required fields for Expert Insight (text in both languages)')
        return
      }
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      const previewData = {
        type: formData.type,
        symbol: formData.type === 'latest_signal' ? formData.symbol.trim() : null,
        action: formData.type === 'latest_signal' ? formData.action : null,
        price: formData.type === 'latest_signal' ? formData.price.trim() : null,
        text_en: formData.type === 'expert_insight' ? formData.text_en.trim() : null,
        text_ar: formData.type === 'expert_insight' ? formData.text_ar.trim() : null,
        is_active: formData.is_active,
      }

      if (editingPreview) {
        // Update existing preview
        await updateVipDashboardPreview(editingPreview.id, previewData)
      } else {
        // Create new preview
        await createVipDashboardPreview(previewData)
      }

      await loadPreviews()
      handleCloseForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preview')
      console.error('Error saving preview:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPreview) return

    setIsSubmitting(true)
    setError(null)

    try {
      await deleteVipDashboardPreview(deletingPreview.id)
      await loadPreviews()
      setIsDeleteDialogOpen(false)
      setDeletingPreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preview')
      console.error('Error deleting preview:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-accent">Loading...</div>
      </div>
    )
  }

  // Group previews by type
  const latestSignals = previews.filter(p => p.type === 'latest_signal')
  const expertInsights = previews.filter(p => p.type === 'expert_insight')

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Header with Add button */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-2xl font-bold text-base-white">
          {t('dashboard.vipPreviews.title')}
        </h2>
        <button
          onClick={() => handleOpenForm()}
          className="px-6 py-2 bg-accent text-primary-dark rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          {t('dashboard.vipPreviews.addPreview')}
        </button>
      </div>

      {/* Latest Signals Section */}
      <div>
        <h3 className="text-xl font-semibold text-base-white mb-4">
          {t('dashboard.vipPreviews.latestSignals')}
        </h3>
        {latestSignals.length === 0 ? (
          <div className="text-center py-8 text-accent">
            {t('dashboard.vipPreviews.noLatestSignals')}
          </div>
        ) : (
          <div className="space-y-4">
            {latestSignals.map((preview) => (
              <div
                key={preview.id}
                className="bg-secondary-surface border border-accent border-opacity-30 rounded-lg p-6"
              >
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-white font-bold text-lg">{preview.symbol}</span>
                      <span className={`font-mono font-bold ${preview.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {preview.action} @ {preview.price}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-accent">
                      <span className={preview.is_active ? 'text-green-400' : 'text-red-400'}>
                        {preview.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => handleOpenForm(preview)}
                      className="px-4 py-1 bg-accent bg-opacity-20 text-accent rounded hover:bg-opacity-30 transition-colors text-sm"
                    >
                      {t('dashboard.vipPreviews.edit')}
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPreview(preview)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="px-4 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition-colors text-sm"
                    >
                      {t('dashboard.vipPreviews.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expert Insights Section */}
      <div>
        <h3 className="text-xl font-semibold text-base-white mb-4">
          {t('dashboard.vipPreviews.expertInsights')}
        </h3>
        {expertInsights.length === 0 ? (
          <div className="text-center py-8 text-accent">
            {t('dashboard.vipPreviews.noExpertInsights')}
          </div>
        ) : (
          <div className="space-y-4">
            {expertInsights.map((preview) => (
              <div
                key={preview.id}
                className="bg-secondary-surface border border-accent border-opacity-30 rounded-lg p-6"
              >
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <p className="text-sm text-base-white opacity-80 mb-1 line-clamp-2">
                      {preview.text_en}
                    </p>
                    <p className="text-sm text-accent opacity-80 mb-2 line-clamp-2">
                      {preview.text_ar}
                    </p>
                    <div className="flex gap-4 text-xs text-accent">
                      <span className={preview.is_active ? 'text-green-400' : 'text-red-400'}>
                        {preview.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => handleOpenForm(preview)}
                      className="px-4 py-1 bg-accent bg-opacity-20 text-accent rounded hover:bg-opacity-30 transition-colors text-sm"
                    >
                      {t('dashboard.vipPreviews.edit')}
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPreview(preview)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="px-4 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition-colors text-sm"
                    >
                      {t('dashboard.vipPreviews.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingPreview ? t('dashboard.vipPreviews.editPreview') : t('dashboard.vipPreviews.addPreview')}
        size="lg"
        footer={
          <>
            <button
              onClick={handleCloseForm}
              className="px-6 py-2 bg-secondary-surface text-accent rounded-lg hover:bg-opacity-70 transition-colors"
              disabled={isSubmitting}
            >
              {t('dashboard.dialogs.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-accent text-primary-dark rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('dashboard.vipPreviews.saving') : t('dashboard.dialogs.save')}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.vipPreviews.type')}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'latest_signal' | 'expert_insight' })}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={!!editingPreview} // Don't allow changing type when editing
            >
              <option value="latest_signal">{t('dashboard.vipPreviews.typeLatestSignal')}</option>
              <option value="expert_insight">{t('dashboard.vipPreviews.typeExpertInsight')}</option>
            </select>
          </div>

          {/* Latest Signal Fields */}
          {formData.type === 'latest_signal' && (
            <>
              <div>
                <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.vipPreviews.symbol')}
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="XAUUSD / Gold"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.vipPreviews.action')}
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value as 'BUY' | 'SELL' })}
                  className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.vipPreviews.price')}
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="2034.50"
                  required
                />
              </div>
            </>
          )}

          {/* Expert Insight Fields */}
          {formData.type === 'expert_insight' && (
            <>
              <div>
                <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.vipPreviews.textEn')}
                </label>
                <textarea
                  value={formData.text_en}
                  onChange={(e) => setFormData({ ...formData, text_en: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.vipPreviews.textAr')}
                </label>
                <textarea
                  value={formData.text_ar}
                  onChange={(e) => setFormData({ ...formData, text_ar: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  dir="rtl"
                  required
                />
              </div>
            </>
          )}

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-accent bg-primary-dark border-accent rounded focus:ring-accent"
            />
            <label htmlFor="is_active" className="text-sm text-base-white">
              {t('dashboard.vipPreviews.isActive')}
            </label>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingPreview(null)
        }}
        title={t('dashboard.vipPreviews.deletePreview')}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setDeletingPreview(null)
              }}
              className="px-6 py-2 bg-secondary-surface text-accent rounded-lg hover:bg-opacity-70 transition-colors"
              disabled={isSubmitting}
            >
              {t('dashboard.dialogs.cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('dashboard.vipPreviews.deleting') : t('dashboard.vipPreviews.delete')}
            </button>
          </>
        }
      >
        <p className="text-base-white">
          {t('dashboard.vipPreviews.deleteConfirm')}
        </p>
      </Dialog>
    </div>
  )
}

