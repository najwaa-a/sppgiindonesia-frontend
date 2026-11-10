import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ErrorAlert from "../../components/ErrorAlert";
import { Search } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
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
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar transaksi");
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter((t) => {
    const matchStatus =
      filterStatus === "all" || t.payment_status === filterStatus;
    const matchSearch = (t.invoice_no || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading)
    return (
      <LoadingSkeleton message="Memuat seluruh data transaksi penjualan..." />
    );
  if (error) return <ErrorAlert message={error} onRetry={loadTransactions} />;

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Riwayat Transaksi Penjualan
          </h1>
          <p className="text-xs text-slate-500">
            Daftar transaksi dan verifikasi pembayaran kasir
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="due">Belum Lunas (Due)</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari No. Invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-semibold border-b">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">No. Invoice</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">Status Pesanan</th>
                <th className="px-5 py-3.5">Status Bayar</th>
                <th className="px-5 py-3.5 text-right">Total Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">Tidak ada transaksi yang cocok</td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[10px]">{t.id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{t.invoice_no || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(t.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        {t.status || 'ordered'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${t.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.payment_status || 'due'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-slate-800">
                      Rp {Number(t.final_total || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}