import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PackagePlus,
  Plus,
  ShoppingCart,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import {
  getProducts,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  resetProductsToDefault
} from '../../services/productService';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorAlert from '../../components/ErrorAlert';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';

export default function Products() {
  const { addToast } = useToast();

  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  // Load Data
  const loadData = async (isManualRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts({ forceRefresh: isManualRefresh }),
        getCategories()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      if (isManualRefresh) {
        addToast('Data menu berhasil diperbarui dari katalog.', 'success');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Gagal memuat katalog produk menu MBG.');
      addToast(err.message || 'Gagal memuat katalog produk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalItems = products.length;
    const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const lowStockCount = products.filter((p) => Number(p.stock) <= (p.min_stock || 10) && Number(p.stock) > 0).length;
    const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;
    const avgPrice = totalItems > 0
      ? Math.round(products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalItems)
      : 0;

    return {
      totalItems,
      totalStock,
      lowStockCount,
      outOfStockCount,
      avgPrice
    };
  }, [products]);

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb - Corporate Style */}
      <section className="bg-white border-b border-slate-200 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-6 py-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center shadow-xs">
                <PackagePlus className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                Kelola Data Menu MBG
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-10">
              Sistem manajemen stok, gizi terstandar, dan penetapan harga menu Makan Bergizi Gratis
            </p>
          </div>

          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
            <Link to="/dashboard" className="hover:text-slate-600 transition">Beranda</Link>
            <span>&gt;</span>
            <span className="text-slate-700 font-semibold">Kelola Menu MBG</span>
          </nav>
        </div>
      </section>

      {/* Main Content View with Loading and Error Guards */}
      {loading ? (
        <LoadingSkeleton message="Memuat seluruh data stok dan katalog menu MBG..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={() => loadData(true)} />
      ) : (
        <div className="space-y-6">
          {/* Quick Metrics Cards - Card Based UI */}
          <section aria-label="Ringkasan Statistik Menu" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Menu */}
            <article className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Varian Menu
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-[#0f172a]">
                    {metrics.totalItems}
                  </span>
                  <span className="text-xs text-slate-500">resep aktif</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0f172a] flex items-center justify-center">
                <Layers className="w-6 h-6 stroke-[1.8]" />
              </div>
            </article>

            {/* Card 2: Total Porsi */}
            <article className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Porsi Tersedia
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-[#0f172a]">
                    {metrics.totalStock.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">siap saji</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
            </article>

            {/* Card 3: Stok Kritis & Habis */}
            <article className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Peringatan Stok
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-amber-600">
                    {metrics.lowStockCount + metrics.outOfStockCount}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({metrics.outOfStockCount} habis)
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
              </div>
            </article>

            {/* Card 4: Rata-Rata Harga */}
            <article className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Rata-rata Harga / Porsi
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-[#0f172a]">
                    {formatRupiah(metrics.avgPrice)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Flame className="w-6 h-6 stroke-[1.8]" />
              </div>
            </article>
          </section>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Aksi Cepat:</span>
              <button
                type="button"
                onClick={() => loadData(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-2xs flex items-center gap-1.5 transition"
                title="Muat ulang data dari server"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Sinkronkan Katalog</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard/pos"
                className="px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Buka Kasir POS Cepat</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
