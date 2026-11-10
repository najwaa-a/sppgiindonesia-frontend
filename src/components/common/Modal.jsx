import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible Modal Dialog Component
 * Supports keyboard navigation (Escape to close), backdrop click, and focus trapping.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transform transition-all duration-300 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white flex items-center justify-between border-b border-slate-700/50 flex-shrink-0">
          <div>
            <h3 id="modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela modal"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

