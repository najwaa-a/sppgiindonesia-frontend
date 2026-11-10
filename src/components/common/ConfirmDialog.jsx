import React from 'react';
import Modal from './Modal';
import { AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Confirmation Dialog
 * Used for safe reset confirmation, delete confirmation, and order checkout confirmations.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  isLoading = false
}) {
  const iconConfig = {
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    danger: {
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    info: {
      icon: HelpCircle,
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  };

  const currentIcon = iconConfig[type] || iconConfig.warning;
  const IconComponent = currentIcon.icon;

  const confirmBtnStyles = {
    warning: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold focus:ring-amber-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-bold focus:ring-rose-400',
    info: 'bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold focus:ring-slate-400',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold focus:ring-emerald-400'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 ${currentIcon.color}`}>
          <IconComponent className="w-7 h-7 stroke-[2.2]" />
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-xs rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 ${confirmBtnStyles[type]}`}
          >
            {isLoading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
