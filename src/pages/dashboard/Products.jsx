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

  useEffect(() => {
    loadData();
  }, []);

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
          <p className="text-xs text-slate-500">Memuat modul manajemen produk...</p>
        </div>
      )}
    </div>
  );
}
