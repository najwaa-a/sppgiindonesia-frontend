import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ErrorAlert from "../../components/ErrorAlert";

export default function Overview() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadDashboardData();
  }, []);
  async function loadDashboardData() {
    try {
        setLoading(true);
      setError(null);

      const { data: transData, error: transErr } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (transErr) throw transErr;
      const { count: productCount, error: prodErr } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (prodErr) throw prodErr;
      const income = (transData || []).reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);

      setStats({
        totalIncome: income,
        totalOrders: (transData || []).length,
        totalProducts: productCount || 0
      });
      setRecentOrders(transData || []);
     } catch (err) {
        setError(err.message || 'Gagal memuat data dashboard');
    } finally {
        setLoading(false);
    }
  }
  
  if (loading) return <LoadingSkeleton message="Memuat metrik dashboard dari Supabase..." />;
  if (error) return <ErrorAlert message={error} onRetry={loadDashboardData} />;
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Penjualan</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            Rp {stats.totalIncome.toLocaleString('id-ID')}
          </p>
        </article>

        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pesanan</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats.totalOrders} Transaksi</p>
        </article>

        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Tersedia</span>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{stats.totalProducts} Pilihan</p>
        </article>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-base">5 Pesanan Penjualan Terkini</h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-semibold border-b">
              <tr>
                <th className="px-6 py-3">No. Invoice</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Status Bayar</th>
                <th className="px-6 py-3 text-right">Total Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">Belum ada transaksi</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{order.invoice_no}</td>
                    <td className="px-6 py-4 text-xs">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {order.payment_status || 'due'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      Rp {Number(order.final_total || 0).toLocaleString('id-ID')}
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
