import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorAlert from '../../components/ErrorAlert';
import { Search, Filter, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar transaksi');
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter(t => {
    const matchStatus = filterStatus === 'all' || t.payment_status === filterStatus;
    const matchSearch = (t.invoice_no || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalAmount = filtered.reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);
  const totalPaid = filtered
    .filter(t => t.payment_status === 'paid')
    .reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);
  const totalDue = totalAmount - totalPaid;

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
  const formatDate = (val) => val ? new Date(val).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '-';

  if (loading) return <LoadingSkeleton message="Memuat seluruh data transaksi penjualan..." />;
  if (error) return <ErrorAlert message={error} onRetry={loadTransactions} />;

  return (
    <div className="space-y-5">
      <section className="bg-white border-b border-slate-200 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-6 py-4 mb-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-normal text-slate-800">
              Semua Penjualan <span className="text-xs text-slate-500 font-normal">(All Sales)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola dan pantau seluruh transaksi kasir & distribusi makanan</p>
          </div>
          <div className="text-xs text-slate-400">
            <span>Beranda</span> &gt; <span>Penjualan</span> &gt; <span className="text-slate-600 font-bold">Semua Penjualan</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-slate-400 shadow-xs">
        <header className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Data Penjualan</span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">Pencarian & Status</span>
        </header>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              No. Invoice:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nomor invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-[#3c8dbc]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Status Pembayaran:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-[#3c8dbc]"
            >
              <option value="all">Semua Status</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="due">Belum Lunas (Due)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => { setSearch(''); setFilterStatus('all'); }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-300 font-medium transition"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-xs">
        <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#3c8dbc]" />
            <span>Daftar Transaksi Penjualan</span>
          </h2>
          <Link
            to="/dashboard/pos"
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center space-x-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Penjualan POS</span>
          </Link>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-[#f9f9f9] text-[11px] text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200 w-12 text-center">ID</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200">Tanggal</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200">No. Invoice</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200">Pelanggan / Dapur</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200 text-center">Status Bayar</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200">Metode Bayar</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200 text-right">Total Tagihan</th>
                <th scope="col" className="py-2.5 px-3 border-r border-slate-200 text-right">Total Terbayar</th>
                <th scope="col" className="py-2.5 px-3 text-right">Sisa Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    Tidak ada transaksi yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isPaid = t.payment_status === 'paid';
                  const amount = parseFloat(t.final_total || 0);
                  const paid = isPaid ? amount : 0;
                  const remaining = amount - paid;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono text-[10px] text-slate-400">
                        {t.id}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                        {formatDate(t.created_at)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono font-bold text-[#3c8dbc]">
                        {t.invoice_no || '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-800">
                        Pelanggan Umum (MBG)
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        <span
                          className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${
                            isPaid ? 'bg-[#00a65a]' : 'bg-[#f39c12]'
                          }`}
                        >
                          {isPaid ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 capitalize text-slate-600">
                        {t.payment_status === 'paid' ? 'Midtrans / QRIS' : 'Tunai Kasir'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-right font-bold text-slate-900">
                        {formatRupiah(amount)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-right text-emerald-700 font-semibold">
                        {formatRupiah(paid)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-rose-600">
                        {formatRupiah(remaining)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot className="bg-[#f4f4f4] border-t-2 border-slate-300 font-bold text-xs text-slate-800">
                <tr>
                  <td colSpan="6" className="py-3 px-3 text-right uppercase">
                    Total Halaman Ini:
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900 border-r border-slate-300">
                    {formatRupiah(totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 border-r border-slate-300">
                    {formatRupiah(totalPaid)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-600">
                    {formatRupiah(totalDue)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>
    </div>
  );
}