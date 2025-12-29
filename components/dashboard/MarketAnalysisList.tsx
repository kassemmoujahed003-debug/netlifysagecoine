'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Dialog from './Dialog'
import { 
  getAllMarketAnalysisSections, 
  createMarketAnalysisSection, 
  updateMarketAnalysisSection, 
  deleteMarketAnalysisSection,
  uploadMarketAnalysisImage
} from '@/services/marketAnalysisService'
import { MarketAnalysisSection } from '@/types/database'

export default function MarketAnalysisList() {
  const { t, isRTL } = useLanguage()
  const [sections, setSections] = useState<MarketAnalysisSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<MarketAnalysisSection | null>(null)
  const [deletingSection, setDeletingSection] = useState<MarketAnalysisSection | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    image_url: '',
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    display_order: 0,
    is_active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Load sections
  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedSections = await getAllMarketAnalysisSections()
      setSections(fetchedSections)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sections')
      console.error('Error loading sections:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form open/close
  const handleOpenForm = (section?: MarketAnalysisSection) => {
    if (section) {
      setEditingSection(section)
      setFormData({
        image_url: section.image_url,
        title_en: section.title_en,
        title_ar: section.title_ar,
        description_en: section.description_en,
        description_ar: section.description_ar,
        display_order: section.display_order,
        is_active: section.is_active,
      })
      setImagePreview(section.image_url)
      setImageFile(null)
    } else {
      setEditingSection(null)
      setFormData({
        image_url: '',
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        display_order: sections.length > 0 ? Math.max(...sections.map(s => s.display_order)) + 1 : 0,
        is_active: true,
      })
      setImagePreview('')
      setImageFile(null)
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingSection(null)
    setFormData({
      image_url: '',
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      display_order: 0,
      is_active: true,
    })
    setImagePreview('')
    setImageFile(null)
    setImageError(null)
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(null) // Clear previous errors
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setImageError('Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.')
        setImageFile(null)
        setImagePreview('')
        return
      }

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setImageError('File size too large. Maximum size is 5MB.')
        setImageFile(null)
        setImagePreview('')
        return
      }

      setImageFile(file)
      setImageError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent submission if there's an image error
    if (imageError) {
      return
    }
    
    // Validate required fields
    if (!formData.title_en || !formData.title_ar || !formData.description_en || !formData.description_ar) {
      setError('Please fill in all required fields (titles and descriptions in both languages)')
      return
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      let imageUrl = formData.image_url

      // Upload image if a new file is selected
      if (imageFile) {
        setUploadingImage(true)
        const uploadResult = await uploadMarketAnalysisImage(imageFile)
        imageUrl = uploadResult.url
        setUploadingImage(false)
      }

      // Ensure we have an image URL
      if (!imageUrl) {
        setError('Please upload an image or provide an image URL')
        setIsSubmitting(false)
        setUploadingImage(false)
        return
      }

      const sectionData = {
        image_url: imageUrl,
        title_en: formData.title_en.trim(),
        title_ar: formData.title_ar.trim(),
        description_en: formData.description_en.trim(),
        description_ar: formData.description_ar.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingSection) {
        // Update existing section
        await updateMarketAnalysisSection(editingSection.id, sectionData)
      } else {
        // Create new section
        await createMarketAnalysisSection(sectionData)
      }

      await loadSections()
      handleCloseForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section')
      console.error('Error saving section:', err)
    } finally {
      setIsSubmitting(false)
      setUploadingImage(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingSection) return

    setIsSubmitting(true)
    setError(null)

    try {
      await deleteMarketAnalysisSection(deletingSection.id)
      await loadSections()
      setIsDeleteDialogOpen(false)
      setDeletingSection(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete section')
      console.error('Error deleting section:', err)
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
          {t('dashboard.marketAnalysis.title')}
        </h2>
        <button
          onClick={() => handleOpenForm()}
          className="px-6 py-2 bg-accent text-primary-dark rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          {t('dashboard.marketAnalysis.addSection')}
        </button>
      </div>

      {/* Sections list */}
      {sections.length === 0 ? (
        <div className="text-center py-12 text-accent">
          {t('dashboard.marketAnalysis.noSections')}
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-secondary-surface border border-accent border-opacity-30 rounded-lg p-6"
            >
              <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={section.image_url}
                    alt={section.title_en}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-lg font-semibold text-base-white mb-1">
                        {section.title_en}
                      </h3>
                      <p className="text-sm text-accent mb-2">
                        {section.title_ar}
                      </p>
                    </div>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => handleOpenForm(section)}
                        className="px-4 py-1 bg-accent bg-opacity-20 text-accent rounded hover:bg-opacity-30 transition-colors text-sm"
                      >
                        {t('dashboard.marketAnalysis.edit')}
                      </button>
                      <button
                        onClick={() => {
                          setDeletingSection(section)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="px-4 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition-colors text-sm"
                      >
                        {t('dashboard.marketAnalysis.delete')}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-base-white opacity-80 line-clamp-2 mb-1">
                    {section.description_en}
                  </p>
                  <p className="text-sm text-accent opacity-80 line-clamp-2">
                    {section.description_ar}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs text-accent">
                    <span>Order: {section.display_order}</span>
                    <span className={section.is_active ? 'text-green-400' : 'text-red-400'}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingSection ? t('dashboard.marketAnalysis.editSection') : t('dashboard.marketAnalysis.addSection')}
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
              disabled={isSubmitting || uploadingImage || !!imageError}
            >
              {isSubmitting || uploadingImage ? t('dashboard.marketAnalysis.saving') : t('dashboard.dialogs.save')}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.image')}
            </label>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-accent border-opacity-30"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 bg-primary-dark border rounded-lg text-base-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-accent file:text-primary-dark file:cursor-pointer hover:file:bg-opacity-90 ${
                imageError ? 'border-red-500' : 'border-accent'
              }`}
            />
            {imageError && (
              <p className="mt-1 text-sm text-red-400">{imageError}</p>
            )}
            {!imageFile && formData.image_url && !imageError && (
              <p className="mt-1 text-xs text-accent">Current image URL: {formData.image_url}</p>
            )}
          </div>

          {/* Title English */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.titleEn')}
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Title Arabic */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.titleAr')}
            </label>
            <input
              type="text"
              value={formData.title_ar}
              onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
              dir="rtl"
              required
            />
          </div>

          {/* Description English */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.descriptionEn')}
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              required
            />
          </div>

          {/* Description Arabic */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.descriptionAr')}
            </label>
            <textarea
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              dir="rtl"
              required
            />
          </div>

          {/* Display Order */}
          <div>
            <label className={`block text-sm font-medium text-base-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('dashboard.marketAnalysis.displayOrder')}
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-primary-dark border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
              min="0"
            />
          </div>

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
              {t('dashboard.marketAnalysis.isActive')}
            </label>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingSection(null)
        }}
        title={t('dashboard.marketAnalysis.deleteSection')}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setDeletingSection(null)
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
              {isSubmitting ? t('dashboard.marketAnalysis.deleting') : t('dashboard.marketAnalysis.delete')}
            </button>
          </>
        }
      >
        <p className="text-base-white">
          {t('dashboard.marketAnalysis.deleteConfirm').replace('{{title}}', deletingSection?.title_en || '')}
        </p>
      </Dialog>
    </div>
  )
}

