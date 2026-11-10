import { useRef } from 'react';
import Modal from '../common/Modal';
import { Printer, ArrowRight } from 'lucide-react';

export default function ReceiptModal({
  isOpen,
  onClose,
  transaction,
  onNewTransaction
}) {
  const receiptRef = useRef(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

  const formatDate = (isoString) => {
    const d = isoString ? new Date(isoString) : new Date();
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Struk Bukti Transaksi Kasir POS"
      subtitle="Transaksi berhasil diproses & stok menu dapur telah diperbarui"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Printable Receipt Paper Container */}
        <div
          ref={receiptRef}
          className="bg-white p-5 rounded-xl border border-dashed border-slate-300 text-slate-800 text-xs shadow-inner space-y-3 font-mono print:p-0 print:border-none print:shadow-none"
        >
          {/* Receipt Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h3 className="font-extrabold text-sm text-[#0f172a] uppercase tracking-wider">
              SPPG INDONESIA
            </h3>
            <p className="text-[10px] text-slate-500">
              Dapur Makan Bergizi Gratis (MBG) Unit #1
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              No. Invoice: <strong className="text-slate-700">{transaction.invoiceNo}</strong>
            </p>
            <p className="text-[10px] text-slate-400">
              Waktu: {formatDate(transaction.timestamp)}
            </p>
            <p className="text-[10px] text-slate-400">
              Kasir: <strong className="text-slate-700">Nadia</strong> ({transaction.customerType === 'siswa' ? 'Siswa MBG' : 'Umum/Staf'})
            </p>
          </div>

          {/* Items Table */}
          <div className="py-1 space-y-1.5 border-b border-dashed border-slate-300">
            {transaction.items?.map((item) => (
              <div key={item.id} className="flex items-start justify-between text-[11px] leading-tight">
                <div className="flex-1 pr-2">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-slate-500 text-[10px]">
                    {item.quantity} x {formatRupiah(item.price)}
                  </div>
                </div>
                <div className="font-bold text-slate-900 flex-shrink-0">
                  {formatRupiah(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Details */}
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Total Porsi ({transaction.totalItemsCount} porsi):</span>
              <span className="font-bold">{formatRupiah(transaction.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>PPN MBG (0%):</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-extrabold text-xs text-[#0f172a] pt-1 border-t border-slate-200">
              <span>TOTAL BAYAR:</span>
              <span>{formatRupiah(transaction.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Metode:</span>
              <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Uang Diterima:</span>
              <span>{formatRupiah(transaction.cashReceived)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-700 pt-0.5">
              <span>Kembalian:</span>
              <span>{formatRupiah(transaction.change)}</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
            <p className="font-bold text-slate-600">Terima kasih atas partisipasinya!</p>
            <p className="mt-0.5">Mendukung Generasi Emas Anak Indonesia Sehat & Bergizi.</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Struk</span>
          </button>

          <button
            type="button"
            onClick={onNewTransaction}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Transaksi Baru</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

