import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastVariant } from '@/src/components/ui/Toast';

interface ToastState {
  message: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    setToast({ message, variant });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        {toast && (
            <Toast
                message={toast.message}
                variant={toast.variant}
                onClose={hideToast}
            />
        )}
      </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}
