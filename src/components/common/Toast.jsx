import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const typeStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-500/50 shadow-emerald-950/20',
    error: 'bg-rose-900/90 text-white border-rose-500/50 shadow-rose-950/20',
    warning: 'bg-amber-900/90 text-amber-50 border-amber-500/50 shadow-amber-950/20',
    info: 'bg-[#0f172a]/95 text-white border-slate-700 shadow-slate-950/30'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container floating in top-right */}
      <aside
        aria-label="Pemberitahuan Sistem"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 ${
              typeStyles[toast.type] || typeStyles.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 text-xs font-medium leading-relaxed pt-0.5">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => console.log('Toast:', msg),
      removeToast: () => {}
    };
  }
  return context;
}

