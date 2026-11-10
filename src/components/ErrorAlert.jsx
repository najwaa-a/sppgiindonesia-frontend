import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorAlert({ message = "Gagal memuat data", onRetry }) {
  return (
    <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm my-4">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}