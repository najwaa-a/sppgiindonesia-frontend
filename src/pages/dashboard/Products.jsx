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

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, product: null, isDeleting: false });

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (product) => {
    setDeleteDialogState({ isOpen: true, product, isDeleting: false });
  };

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

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query filter (matches name, description, or id)
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          product.id.toLowerCase().includes(query);

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;

        // Stock status filter
        let matchesStockStatus = true;
        const stock = Number(product.stock) || 0;
        const minStock = product.min_stock || 10;

        if (stockStatusFilter === 'in_stock') {
          matchesStockStatus = stock > minStock;
        } else if (stockStatusFilter === 'low_stock') {
          matchesStockStatus = stock > 0 && stock <= minStock;
        } else if (stockStatusFilter === 'out_of_stock') {
          matchesStockStatus = stock === 0;
        }

        return matchesQuery && matchesCategory && matchesStockStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'id');
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name, 'id');
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'stock-asc') return (a.stock || 0) - (b.stock || 0);
        if (sortBy === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, stockStatusFilter, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || stockStatusFilter !== 'all' || sortBy !== 'name-asc';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStockStatusFilter('all');
    setSortBy('name-asc');
  };

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

          {/* Products Inventory Table - Card Based UI */}
          <section className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Card Header with Golden Yellow CTA */}
            <header className="px-5 py-4 bg-[#0f172a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <PackagePlus className="w-4 h-4 text-amber-400" />
                  <span>Daftar Stok Produk Menu MBG</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Daftar resep aktif, status ketersediaan dapur, dan harga jual porsi siswa
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Tambah Menu Baru</span>
                </button>
              </div>
            </header>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3 px-4 w-24">Kode SKU</th>
                    <th scope="col" className="py-3 px-4">Nama Menu &amp; Gizi MBG</th>
                    <th scope="col" className="py-3 px-4">Kategori</th>
                    <th scope="col" className="py-3 px-4 text-right">Harga Jual</th>
                    <th scope="col" className="py-3 px-4 text-center">Stok Porsi</th>
                    <th scope="col" className="py-3 px-4 text-center">Status</th>
                    <th scope="col" className="py-3 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                            <Search className="w-6 h-6" />
                          </div>
                          <p className="font-semibold text-slate-700 text-sm">Tidak ada menu yang sesuai</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan status stok.
                          </p>
                          {hasActiveFilters && (
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
                            >
                              Reset Semua Filter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedProducts.map((product) => {
                      const stock = Number(product.stock) || 0;
                      const minStock = product.min_stock || 10;
                      const isOutOfStock = stock === 0;
                      const isLowStock = stock > 0 && stock <= minStock;

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* SKU */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-[11px]">
                            {product.id}
                          </td>

                          {/* Name & Nutritional details */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <Flame className="w-3 h-3" />
                                {product.calories || 400} kkal
                              </span>
                              <span>•</span>
                              <span className="text-sky-700 font-medium">
                                Protein: {product.protein || '15g'}
                              </span>
                              {product.description && (
                                <>
                                  <span className="hidden md:inline">•</span>
                                  <span className="hidden md:inline text-slate-400 truncate max-w-xs">
                                    {product.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 px-4">
                            <Badge variant="cyan" size="sm">
                              {product.category}
                            </Badge>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 text-right font-extrabold text-[#0f172a] text-xs sm:text-sm">
                            {formatRupiah(product.price)}
                          </td>

                          {/* Stock Quantity */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-bold text-xs ${
                                isOutOfStock
                                  ? 'text-rose-600'
                                  : isLowStock
                                  ? 'text-amber-600'
                                  : 'text-slate-800'
                              }`}
                            >
                              {stock}
                            </span>
                            <span className="text-[10px] text-slate-400 block">porsi</span>
                          </td>

                          {/* Stock Status Badge */}
                          <td className="py-3.5 px-4 text-center">
                            {isOutOfStock ? (
                              <Badge variant="rose" size="xs" dot>
                                Habis
                              </Badge>
                            ) : isLowStock ? (
                              <Badge variant="amber" size="xs" dot>
                                Stok Kritis
                              </Badge>
                            ) : (
                              <Badge variant="emerald" size="xs" dot>
                                Tersedia
                              </Badge>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(product)}
                                aria-label={`Edit ${product.name}`}
                                className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                                title="Edit Menu"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteDialog(product)}
                                aria-label={`Hapus ${product.name}`}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Hapus Menu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <footer className="px-5 py-3 bg-slate-50/50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                Total <strong>{products.length}</strong> menu terdaftar di sistem MBG.
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Tersedia Aman
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Stok Kritis (&le; 10)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Habis
                </span>
              </div>
            </footer>
          </section>
          <section className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
            <header className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a]">
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Pencarian & Penyaringan Katalog</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Menampilkan <strong className="text-slate-800">{filteredAndSortedProducts.length}</strong> dari {products.length} menu
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filter</span>
                  </button>
                )}
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input */}
              <div>
                <label htmlFor="search-input" className="block text-[11px] font-bold text-slate-600 mb-1">
                  Cari Nama Menu / SKU:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Ayam Bakar, Bayam, PRD-001..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg outline-none focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a] transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      aria-label="Hapus kata kunci pencarian"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label htmlFor="category-filter" className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kategori Menu:
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg outline-none focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a] transition text-slate-700"
                >
                  <option value="all">Semua Kategori</option>
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label htmlFor="stock-status-filter" className="block text-[11px] font-bold text-slate-600 mb-1">
                  Status Ketersediaan:
                </label>
                <select
                  id="stock-status-filter"
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg outline-none focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a] transition text-slate-700"
                >
                  <option value="all">Semua Status Stok</option>
                  <option value="in_stock">Tersedia Aman (&gt; 10 porsi)</option>
                  <option value="low_stock">Stok Kritis / Menipis (1 - 10 porsi)</option>
                  <option value="out_of_stock">Stok Habis (0 porsi)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sort-by" className="block text-[11px] font-bold text-slate-600 mb-1">
                  Urutkan Berdasarkan:
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg outline-none focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a] transition text-slate-700"
                >
                  <option value="name-asc">Nama Menu (A - Z)</option>
                  <option value="name-desc">Nama Menu (Z - A)</option>
                  <option value="price-asc">Harga Termurah</option>
                  <option value="price-desc">Harga Termahal</option>
                  <option value="stock-desc">Stok Terbanyak</option>
                  <option value="stock-asc">Stok Tersedikit</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
