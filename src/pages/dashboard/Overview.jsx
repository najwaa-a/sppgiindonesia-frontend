import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Banknote,
  ShoppingCart,
  AlertTriangle,
  Receipt,
  MinusCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const [stats, setStats] = useState({
    totalSell: 0,
    totalPurchase: 0,
    purchaseDue: 0,
    invoiceDue: 0,
    totalExpense: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [dueOrders, setDueOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');
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
        .order('created_at', { ascending: false });

      if (transErr) throw transErr;

      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .limit(10);

      if (prodErr) throw prodErr;

      const transactions = transData || [];
      const totalSell = transactions.reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);
      
      const dues = transactions.filter(t => t.payment_status === 'due');
      const invoiceDue = dues.reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);

      setStats({
        totalSell,
        totalPurchase: 0,
        purchaseDue: 0,
        invoiceDue,
        totalExpense: 0,
        totalOrders: transactions.length,
        totalProducts: prodData ? prodData.length : 0
      });

      setRecentOrders(transactions.slice(0, 5));
      setDueOrders(dues.slice(0, 5));
      setStockAlerts(prodData || []);

    } catch (err) {
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
  const formatDate = (val) => val ? new Date(val).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '-';

  if (loading) return <LoadingSkeleton message="Memuat metrik dashboard AdminLTE dari Supabase..." />;
  if (error) return <ErrorAlert message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-5">
      <section className="bg-white border-b border-slate-200 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-6 py-4 mb-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-normal text-slate-800">
              Selamat Datang <span className="font-semibold text-slate-900">Admin</span>,
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="font-bold text-slate-700">ID Bisnis:</span> BID-000001 &bull; Dapur Pusat Makan Bergizi Gratis
            </p>
          </div>

          <div className="inline-flex rounded shadow-xs" role="group">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: 'this_week', label: 'Minggu Ini' },
              { id: 'this_month', label: 'Bulan Ini' },
              { id: 'this_fy', label: 'Tahun Buku' },
            ].map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDateFilter(tab.id)}
                className={`text-xs px-3 py-1.5 font-medium transition ${
                  idx === 0 ? 'rounded-l' : ''
                } ${idx === 3 ? 'rounded-r' : ''} ${
                  dateFilter === tab.id
                    ? 'bg-[#00c0ef] text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#00c0ef] flex items-center justify-center text-white flex-shrink-0">
            <Banknote className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pembelian</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{formatRupiah(stats.totalPurchase)}</span>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#00c0ef] flex items-center justify-center text-white flex-shrink-0">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Penjualan</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{formatRupiah(stats.totalSell)}</span>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#f39c12] flex items-center justify-center text-white flex-shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Beli Jatuh Tempo</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{formatRupiah(stats.purchaseDue)}</span>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#f39c12] flex items-center justify-center text-white flex-shrink-0">
            <Receipt className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Invoice Jatuh Tempo</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{formatRupiah(stats.invoiceDue)}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#dd4b39] flex items-center justify-center text-white flex-shrink-0">
            <MinusCircle className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Biaya/Beban</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{formatRupiah(stats.totalExpense)}</span>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#00a65a] flex items-center justify-center text-white flex-shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Transaksi</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{stats.totalOrders} Transaksi</span>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 flex min-h-[85px] shadow-xs overflow-hidden">
          <div className="w-20 bg-[#3c8dbc] flex items-center justify-center text-white flex-shrink-0">
            <Package className="w-8 h-8" />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Menu MBG Aktif</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">{stats.totalProducts} Item</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-xs">
        <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#3c8dbc]" />
            <span>Tren Penjualan 30 Hari Terakhir</span>
          </h2>
          <span className="text-[11px] text-slate-400">Dapur Sentral MBG</span>
        </header>
        <div className="p-5">
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-200">
            {['1 Nov', '2 Nov', '3 Nov', '4 Nov', '5 Nov', '6 Nov', '7 Nov', '8 Nov', '9 Nov', '10 Nov'].map((day, idx) => {
              const heights = [35, 45, 60, 40, 80, 65, 90, 75, 85, 95];
              const h = heights[idx] || 50;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    Rp {h * 10}.000
                  </span>
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] rounded-t transition-all cursor-pointer"
                    title={`Penjualan ${day}: Rp ${h * 10}.000`}
                  ></div>
                  <span className="text-[10px] text-slate-500 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-3 pt-1">
            <span>Rata-rata Penjualan Harian: <strong>Rp 750.000</strong></span>
            <span className="text-emerald-600 font-bold">&uarr; +14.8% dibanding bulan lalu</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#f39c12] shadow-xs">
          <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#f39c12]" />
              <span>Tagihan Pembayaran Penjualan</span>
            </h2>
            <Link to="/dashboard/transactions" className="text-xs text-[#3c8dbc] hover:underline font-semibold">
              Lihat Semua
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f9f9f9] text-[11px] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3">No. Invoice</th>
                  <th scope="col" className="py-2.5 px-3">Tanggal</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Jatuh Tempo</th>
                  <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dueOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      Tidak ada tagihan jatuh tempo saat ini.
                    </td>
                  </tr>
                ) : (
                  dueOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[#3c8dbc] font-bold">{order.invoice_no}</td>
                      <td className="py-2.5 px-3 text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#dd4b39]">{formatRupiah(order.final_total)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-[#f39c12] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Belum Lunas
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-xs">
          <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-[#3c8dbc]" />
              <span>5 Transaksi Penjualan Terkini</span>
            </h2>
            <Link to="/dashboard/transactions" className="text-xs text-[#3c8dbc] hover:underline font-semibold">
              Semua Penjualan
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f9f9f9] text-[11px] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3">No. Invoice</th>
                  <th scope="col" className="py-2.5 px-3">Tanggal</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Total Tagihan</th>
                  <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">Belum ada transaksi.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const isPaid = order.payment_status === 'paid';
                    return (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{order.invoice_no}</td>
                        <td className="py-2.5 px-3 text-slate-500">{formatDate(order.created_at)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">{formatRupiah(order.final_total)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${
                              isPaid ? 'bg-[#00a65a]' : 'bg-[#f39c12]'
                            }`}
                          >
                            {isPaid ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="bg-white rounded border border-slate-200 border-t-[3px] border-t-[#f39c12] shadow-xs">
        <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <Package className="w-4 h-4 text-[#f39c12]" />
            <span>Peringatan Stok Menu & Bahan Makanan MBG</span>
          </h2>
          <span className="text-[11px] text-slate-400">Dapur Sentral MBG #1</span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9f9f9] text-[11px] text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-4">Nama Produk Menu</th>
                <th scope="col" className="py-2.5 px-4">Tipe / Satuan</th>
                <th scope="col" className="py-2.5 px-4">Lokasi Dapur</th>
                <th scope="col" className="py-2.5 px-4 text-center">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockAlerts.slice(0, 5).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800">{prod.name}</td>
                  <td className="py-2.5 px-4 text-slate-500 uppercase text-[10px]">{prod.type || 'single'}</td>
                  <td className="py-2.5 px-4 text-slate-600">Dapur Pusat MBG</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="bg-[#00a65a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                      Tersedia
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}