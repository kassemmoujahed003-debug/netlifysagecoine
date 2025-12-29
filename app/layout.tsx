import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import SplashScreen from '@/components/SplashScreen'

export const metadata: Metadata = {
  title: 'SageCoin - Master the Markets with Institutional Precision',
  description: 'SageCoin provides expert analysis and exclusive trading strategies for the serious investor.',
  icons: {
    icon: '/dark.png',
    shortcut: '/dark.png',
    apple: '/dark.png',
  },
  // PWA & Mobile optimization
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SageCoin',
  },
  formatDetection: {
    telephone: true,
    date: false,
    email: true,
    address: false,
  },
}

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#182231' },
    { media: '(prefers-color-scheme: light)', color: '#182231' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to font sources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <SplashScreen />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
