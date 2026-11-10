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
    </section>
  );
}
