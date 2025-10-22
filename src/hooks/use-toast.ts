import { useToast as useToastHook } from '@/components/toast'

export function useToast() {
  const { toasts, toast, removeToast } = useToastHook()
  
  return {
    toast,
    toasts,
    removeToast,
    // Convenience methods
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  }
}
