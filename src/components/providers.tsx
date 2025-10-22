'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import superjson from 'superjson'
import { useToast, ToastContainer } from '@/components/toast'
import { shouldRetryQuery, shouldRetryMutation, logError } from '@/lib/error-utils'

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error: unknown) => {
          // Log error for debugging
          logError(error, 'Query retry')
          
          // Use safe retry logic
          return shouldRetryQuery(failureCount, error)
        }
      },
      mutations: {
        retry: (failureCount, error: unknown) => {
          // Log error for debugging
          logError(error, 'Mutation retry')
          
          // Use safe retry logic
          return shouldRetryMutation(failureCount, error)
        }
      },
    },
  }))

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
