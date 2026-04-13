import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

// ─── Toast Container Component ───
export function ToastContainer({ toasts, onDismiss }) {
    return createPortal(
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast--${t.type}`}>
                    <span className="toast-icon">
                        {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span className="toast-msg">{t.message}</span>
                    <button className="toast-close" onClick={() => onDismiss(t.id)}>✕</button>
                </div>
            ))}
        </div>,
        document.body
    );
}

// ─── useToast Hook ───
export function useToast() {
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((type, message, duration = 4000) => {
        const id = ++toastIdRef.current;
        setToasts((prev) => [...prev, { id, type, message }]);
        if (duration > 0) {
            setTimeout(() => dismissToast(id), duration);
        }
    }, [dismissToast]);

    return { toasts, addToast, dismissToast };
}
