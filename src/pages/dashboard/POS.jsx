import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Filter,
  Package,
  Layers,
  Utensils,
  Box,
  Drumstick,
  Soup,
  Apple,
  Milk,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  Printer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Receipt,
  UserCheck
} from 'lucide-react';
import { getProducts, getCategories, processOrderStockDeduction } from '../../services/productService';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorAlert from '../../components/ErrorAlert';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';

export default function POS() {
  const { addToast } = useToast();

  // Products & Categories Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load Data
  const loadKatalogData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('POS data load error:', err);
      setError(err.message || 'Gagal memuat katalog kasir POS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKatalogData();
  }, []);

  // Category Icon Resolver
  const getCategoryIcon = (categoryName) => {
    const lower = (categoryName || '').toLowerCase();
    if (lower.includes('paket')) return <Box className="w-3.5 h-3.5" />;
    if (lower.includes('lauk')) return <Drumstick className="w-3.5 h-3.5" />;
    if (lower.includes('sayur') || lower.includes('sup')) return <Soup className="w-3.5 h-3.5" />;
    if (lower.includes('buah') || lower.includes('tutup')) return <Apple className="w-3.5 h-3.5" />;
    if (lower.includes('minum')) return <Milk className="w-3.5 h-3.5" />;
    return <Utensils className="w-3.5 h-3.5" />;
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5">
      {/* Top Header - Corporate Deep Navy Style */}
      <section className="bg-white border-b border-slate-200 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-6 py-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-amber-400 flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                  Kasir POS Makan Bergizi Gratis
                </h1>
                <Badge variant="emerald" size="xs" dot>
                  Kasir Aktif: Nadia
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Layar kasir cepat pemilihan menu, kalkulasi otomatis porsi, dan pemrosesan transaksi dapur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link
              to="/dashboard/products"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Kelola Stok Menu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Layout Area */}
      {loading ? (
        <LoadingSkeleton message="Menyiapkan layar kasir cepat POS MBG..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={loadKatalogData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Menu Catalog (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search & Category Filter Card */}
            <section className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama menu, jenis lauk, atau SKU untuk mencari..."
                  className="w-full text-xs pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    aria-label="Bersihkan pencarian"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Pills (Horizontal Navigation) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Semua Menu</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {products.length}
                  </span>
                </button>

                {categories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f172a] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {getCategoryIcon(cat.name)}
                        <span>{cat.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </section>

            {/* Menu Grid Placeholder */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs">
              Katalog Menu Siap Dimuat ({filteredProducts.length} varian)
            </div>
          </div>

          {/* Right Column: Order Cart (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs text-xs text-slate-500">
              Keranjang Kasir MBG
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
