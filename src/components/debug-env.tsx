'use client'

import { useEffect, useState } from 'react'

export function DebugEnv() {
  const [envStatus, setEnvStatus] = useState<{
    hasBlobToken: boolean
    nodeEnv: string
    vercelEnv: string
  } | null>(null)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setEnvStatus({
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        nodeEnv: process.env.NODE_ENV || 'unknown',
        vercelEnv: process.env.VERCEL_ENV || 'unknown',
      })
    }
  }, [])

  if (!envStatus) return null

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm z-50">
      <div className="font-bold">Environment Debug:</div>
      <div>Blob Token: {envStatus.hasBlobToken ? '✅' : '❌'}</div>
      <div>Node Env: {envStatus.nodeEnv}</div>
      <div>Vercel Env: {envStatus.vercelEnv}</div>
    </div>
  )
}
