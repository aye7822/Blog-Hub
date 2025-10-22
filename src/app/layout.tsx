import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { DebugEnv } from '@/components/debug-env'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlogHub',
  description: 'A modern full-stack BlogHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <ErrorBoundary>
            <Providers>
              {children}
            </Providers>
          </ErrorBoundary>
          <DebugEnv />
        </body>
    </html>
  )
}
