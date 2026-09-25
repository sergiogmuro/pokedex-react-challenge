import {createContext, useState, useCallback} from 'react';
import {Toast} from '@/src/components/ui/Toast';

export const ToastContext = createContext(undefined);

export function ToastProvider({children}) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, variant = 'info') => {
        setToast({
            message,
            variant
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return <ToastContext.Provider value={{showToast}}>
        {children}

        {toast && <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={hideToast}
        />}
    </ToastContext.Provider>;
}
