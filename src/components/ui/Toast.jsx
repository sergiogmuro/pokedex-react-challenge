import {useEffect} from 'react';

import styles from './Toast.module.css';

export function Toast({message, variant = 'info', onClose, duration = 2500}) {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, duration);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [onClose, duration]);

    return <div className={`${styles.toast} ${styles[variant]}`}
                role="status"
                aria-live="polite">
        <span>{message}</span>

        <button type="button"
                onClick={onClose}
                className={styles.close}
                aria-label="Close notification"
        >×</button>
    </div>
}
