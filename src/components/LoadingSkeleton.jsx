export default function LoadingSkeleton({ message = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}