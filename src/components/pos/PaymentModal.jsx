import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import {
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  totalItemsCount,
  customerType,
  onConfirmPayment
}) {
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'qris' | 'transfer'
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('cash');
      setCashReceived('');
      setIsProcessing(false);
      setError('');
    }
  }, [isOpen, totalAmount]);

  const numCash = Number(cashReceived) || 0;
  const change = Math.max(0, numCash - totalAmount);
  const isCashInsufficient = paymentMethod === 'cash' && numCash < totalAmount;

  // Preset Cash Shortcuts
  const handlePresetCash = (amount) => {
    setCashReceived(String(amount));
    setError('');
  };

  const handleCashChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCashReceived(val);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'cash' && numCash < totalAmount) {
      setError(`Uang tunai yang diterima kurang sebesar Rp ${(totalAmount - numCash).toLocaleString('id-ID')}`);
      return;
    }

    try {
      setIsProcessing(true);
      await onConfirmPayment({
        method: paymentMethod,
        cashReceived: paymentMethod === 'cash' ? numCash : totalAmount,
        change: paymentMethod === 'cash' ? change : 0,
        customerType
      });
    } catch (err) {
      setError(err.message || 'Gagal memproses pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran Transaksi POS Kasir"
      subtitle={`Total belanja ${totalItemsCount} porsi makanan terstandar gizi`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Amount Banner */}
        <div className="p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl text-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Total Tagihan Belanja
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-0.5 block">
              {formatRupiah(totalAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-slate-200 font-semibold block">
              {customerType === 'siswa' ? 'Siswa Program MBG' : 'Pembeli Umum / Staf'}
            </span>
            <span className="text-[11px] text-slate-300 mt-1 block">
              {totalItemsCount} porsi makanan
            </span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Pilih Metode Pembayaran:
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Method 1: Cash */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'border-amber-400 bg-amber-50/50 text-[#0f172a] shadow-2xs font-bold ring-1 ring-amber-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5 text-amber-600" />
              <span className="text-xs">Uang Tunai</span>
            </button>

            {/* Method 2: QRIS */}
            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'qris'
                  ? 'border-sky-400 bg-sky-50/50 text-[#0f172a] shadow-2xs font-bold ring-1 ring-sky-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5 text-sky-600" />
              <span className="text-xs">QRIS MBG</span>
            </button>

            {/* Method 3: Transfer / Kartu */}
            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'transfer'
                  ? 'border-emerald-400 bg-emerald-50/50 text-[#0f172a] shadow-2xs font-bold ring-1 ring-emerald-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span className="text-xs">Transfer / Debit</span>
            </button>
          </div>
        </div>

        {/* Method Content: Cash Mode */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            {/* Preset Cash Shortcuts */}
            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Tombol Nominal Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetCash(totalAmount)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 text-xs font-bold rounded-lg transition shadow-2xs cursor-pointer"
                >
                  Uang Pas ({formatRupiah(totalAmount)})
                </button>
                {[20000, 50000, 100000, 200000]
                  .filter((nom) => nom >= totalAmount)
                  .map((nom) => (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => handlePresetCash(nom)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 text-xs font-semibold rounded-lg transition shadow-2xs cursor-pointer"
                    >
                      {formatRupiah(nom)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Cash Input */}
            <div>
              <label htmlFor="cash-input" className="block text-xs font-bold text-slate-700 mb-1">
                Uang Tunai Diterima:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  Rp
                </span>
                <input
                  id="cash-input"
                  type="text"
                  value={cashReceived ? Number(cashReceived).toLocaleString('id-ID') : ''}
                  onChange={handleCashChange}
                  placeholder={totalAmount.toLocaleString('id-ID')}
                  className={`w-full text-base font-bold pl-11 pr-4 py-2.5 rounded-xl border transition outline-none ${
                    isCashInsufficient && cashReceived !== ''
                      ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                      : 'border-slate-300 bg-white text-[#0f172a] focus:border-[#0f172a]'
                  }`}
                />
              </div>
            </div>

            {/* Change Calculation Box */}
            {numCash >= totalAmount ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Uang Kembalian:</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatRupiah(change)}
                </span>
              </div>
            ) : cashReceived !== '' ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Uang diterima masih kurang Rp {(totalAmount - numCash).toLocaleString('id-ID')}</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Method Content: QRIS Mode */}
        {paymentMethod === 'qris' && (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 mx-auto shadow-2xs flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">QRIS Makan Bergizi Gratis (NMID: ID2026MBG01)</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Buka aplikasi perbankan atau e-wallet untuk scan QRIS
              </span>
            </div>
          </div>
        )}

        {/* Method Content: Transfer Mode */}
        {paymentMethod === 'transfer' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Rekening Bank Dapur Pusat MBG:</span>
            <div className="p-3 bg-white border border-slate-300 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Bank Mandiri / BSI Virtual Account</span>
                <span className="font-mono text-sm font-bold text-slate-800">8870-0812-3456-7890</span>
              </div>
              <Badge variant="cyan" size="xs">Dapur MBG #1</Badge>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isProcessing || isCashInsufficient || (paymentMethod === 'cash' && cashReceived === '')}
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 focus:ring-2 focus:ring-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 cursor-pointer"
          >
            {isProcessing ? (
              <span>Memproses Transaksi...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Konfirmasi Pembayaran ({formatRupiah(totalAmount)})</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

