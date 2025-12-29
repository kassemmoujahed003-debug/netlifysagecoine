'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import RequestActionDialog from './RequestActionDialog'

type RequestType = 'all' | 'password' | 'withdraw' | 'deposit'
type RequestStatus = 'all' | 'pending' | 'done' | 'rejected'

interface Transaction {
  id: string
  type: 'password_change' | 'withdrawal' | 'deposit'
  status: 'pending' | 'done' | 'rejected'
  data: any
  createdAt: string
  updatedAt: string
  userId: string | null
  userEmail: string
}

interface Request {
  id: string
  userId: string | null
  userEmail: string
  userName?: string // Optional since we might not have it
  type: 'password' | 'withdraw' | 'deposit'
  status: 'pending' | 'done' | 'rejected'
  details: string
  amount?: number
  accountNumber?: string
  createdAt: string
}

export default function RequestList() {
  const { t, isRTL } = useLanguage()
  const { token } = useAuth()
  const [typeFilter, setTypeFilter] = useState<RequestType>('all')
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [actionType, setActionType] = useState<'done' | 'reject' | 'pending'>('done')
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load transactions from API
  useEffect(() => {
    if (token) {
      loadTransactions()
    }
  }, [typeFilter, statusFilter, token])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!token) {
        setError('Not authenticated')
        setIsLoading(false)
        return
      }

      // Build query params
      const params = new URLSearchParams()
      if (typeFilter !== 'all') {
        // Map UI types to API types
        const typeMap: Record<string, string> = {
          'password': 'password_change',
          'withdraw': 'withdrawal',
          'deposit': 'deposit',
        }
        params.append('type', typeMap[typeFilter] || typeFilter)
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/transactions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to load transactions'
        const hint = errorData.hint || ''
        throw new Error(`${errorMessage}${hint ? ` - ${hint}` : ''}`)
      }

      const { transactions } = await response.json()
      
      // Transform transactions to requests format
      const formattedRequests: Request[] = transactions.map((tx: Transaction) => {
        let type: 'password' | 'withdraw' | 'deposit' = 'password'
        if (tx.type === 'withdrawal') type = 'withdraw'
        if (tx.type === 'deposit') type = 'deposit'
        if (tx.type === 'password_change') type = 'password'

        let details = ''
        let amount: number | undefined
        let accountNumber: string | undefined

        if (tx.type === 'password_change') {
          details = `Password change request`
          accountNumber = tx.data?.accountNumber
        } else if (tx.type === 'withdrawal' || tx.type === 'deposit') {
          amount = tx.data?.amount
          accountNumber = tx.data?.accountNumber
          details = `${tx.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'} request`
          if (tx.data?.note) {
            details += ` - ${tx.data.note}`
          }
        }

        return {
          id: tx.id,
          userId: tx.userId,
          userEmail: tx.userEmail,
          type,
          status: tx.status,
          details,
          amount,
          accountNumber,
          createdAt: tx.createdAt,
        }
      })

      setRequests(formattedRequests)
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesType = typeFilter === 'all' || request.type === typeFilter
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    // Safe search - handle undefined values
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' || (
      (request.userName?.toLowerCase() || '').includes(searchLower) ||
      (request.userEmail?.toLowerCase() || '').includes(searchLower) ||
      (request.details?.toLowerCase() || '').includes(searchLower) ||
      (request.accountNumber?.toLowerCase() || '').includes(searchLower)
    )
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getTypeColor = (type: Request['type']) => {
    switch (type) {
      case 'password':
        return 'bg-purple-500 bg-opacity-20 text-purple-400 border-purple-500 border-opacity-30'
      case 'withdraw':
        return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500 border-opacity-30'
      case 'deposit':
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30'
      default:
        return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500 border-opacity-30'
    }
  }

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400'
      case 'done':
        return 'bg-green-500 bg-opacity-20 text-green-400'
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-400'
    }
  }

  const handleAction = (request: Request, action: 'done' | 'reject' | 'pending') => {
    setSelectedRequest(request)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const handleConfirmAction = async (action: 'done' | 'reject' | 'pending', notes?: string) => {
    if (!selectedRequest || !token) {
      setError('Not authenticated')
      return
    }

    try {

      // Map action to status
      const statusMap: Record<string, string> = {
        'done': 'done',
        'reject': 'rejected',
        'pending': 'pending',
      }
      const status = statusMap[action] || action

      const response = await fetch(`/api/admin/transactions/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }

      // Refresh list
      await loadTransactions()
      setActionDialogOpen(false)
      setSelectedRequest(null)
    } catch (err) {
      console.error('Error updating transaction:', err)
      setError(err instanceof Error ? err.message : 'Failed to update transaction')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder={t('dashboard.requests.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-secondary-surface border border-accent rounded-lg text-base-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Filters */}
        <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-accent text-sm mb-2">
              {t('dashboard.requests.filters.type')}
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'password', 'withdraw', 'deposit'] as RequestType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      typeFilter === type
                        ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                        : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
                    }`}
                  >
                    {t(`dashboard.requests.types.${type}`)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-accent text-sm mb-2">
              {t('dashboard.requests.filters.status')}
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'done', 'rejected'] as RequestStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    statusFilter === status
                      ? 'bg-accent bg-opacity-20 text-base-white border border-accent'
                      : 'bg-secondary-surface text-accent hover:bg-opacity-70 border border-accent border-opacity-30'
                  }`}
                >
                  {t(`dashboard.requests.status.${status}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-secondary-surface border border-accent rounded-lg p-4">
          <div className="text-accent text-sm mb-1">{t('dashboard.requests.stats.total')}</div>
          <div className="text-2xl font-bold text-base-white">{requests.length}</div>
        </div>
        <div className="bg-secondary-surface border border-accent rounded-lg p-4">
          <div className="text-accent text-sm mb-1">{t('dashboard.requests.stats.pending')}</div>
          <div className="text-2xl font-bold text-yellow-400">
            {requests.filter((r) => r.status === 'pending').length}
          </div>
        </div>
        <div className="bg-secondary-surface border border-accent rounded-lg p-4">
          <div className="text-accent text-sm mb-1">{t('dashboard.requests.stats.done') || 'Done'}</div>
          <div className="text-2xl font-bold text-green-400">
            {requests.filter((r) => r.status === 'done').length}
          </div>
        </div>
        <div className="bg-secondary-surface border border-accent rounded-lg p-4">
          <div className="text-accent text-sm mb-1">{t('dashboard.requests.stats.rejected')}</div>
          <div className="text-2xl font-bold text-red-400">
            {requests.filter((r) => r.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-secondary-surface border border-accent rounded-xl p-8 text-center text-accent">
          Loading transactions...
        </div>
      )}

      {/* Requests List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-secondary-surface border border-accent rounded-xl p-6 hover:bg-opacity-80 transition-all"
          >
            <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} justify-between items-start gap-4`}>
              {/* Left Side - Request Info */}
              <div className="flex-1 space-y-3">
                <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(request.type)}`}
                  >
                    {t(`dashboard.requests.types.${request.type}`)}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}
                  >
                    {t(`dashboard.requests.status.${request.status}`)}
                  </span>
                </div>

                <div>
                  <div className="text-base-white font-semibold mb-1">{request.userName}</div>
                  <div className="text-accent text-sm">{request.userEmail}</div>
                </div>

                <div className="text-accent text-sm">
                  {request.details}
                  {request.amount && (
                    <span className="text-base-white font-semibold ml-2">
                      ${request.amount.toLocaleString()}
                    </span>
                  )}
                  {request.accountNumber && (
                    <span className="text-accent ml-2">
                      (Account: {request.accountNumber})
                    </span>
                  )}
                </div>

                <div className="text-accent text-xs">
                  {new Date(request.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className={`flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                {request.status !== 'done' && (
                  <button
                    onClick={() => handleAction(request, 'done')}
                    className="px-4 py-2 bg-green-500 bg-opacity-20 text-green-400 rounded-lg hover:bg-opacity-30 transition-colors font-medium text-sm border border-green-500 border-opacity-30"
                  >
                    {t('dashboard.requests.approve') || 'Mark as Done'}
                  </button>
                )}
                {request.status !== 'rejected' && (
                  <button
                    onClick={() => handleAction(request, 'reject')}
                    className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors font-medium text-sm border border-red-500 border-opacity-30"
                  >
                    {t('dashboard.requests.reject') || 'Reject'}
                  </button>
                )}
                {request.status !== 'pending' && (
                  <button
                    onClick={() => handleAction(request, 'pending')}
                    className="px-4 py-2 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors font-medium text-sm border border-yellow-500 border-opacity-30"
                  >
                    {t('dashboard.requests.setPending') || 'Set Pending'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

          {filteredRequests.length === 0 && (
            <div className="bg-secondary-surface border border-accent rounded-xl p-8 text-center text-accent">
              {t('dashboard.requests.noRequests') || 'No requests found'}
            </div>
          )}
        </div>
      )}

      {/* Action Dialog */}
      <RequestActionDialog
        isOpen={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false)
          setSelectedRequest(null)
        }}
        request={selectedRequest}
        action={actionType}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}

