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
import PaymentModal from '../../components/pos/PaymentModal';
import ReceiptModal from '../../components/pos/ReceiptModal';

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

  // Cart State
  const [cart, setCart] = useState([]);
  const [customerType, setCustomerType] = useState('siswa'); // 'siswa' | 'umum'
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Payment Confirmation & Stock Decrement
  const handleConfirmPayment = async ({ method, cashReceived, change, customerType }) => {
    try {
      // 1. Process order stock decrement in service
      const updatedProducts = await processOrderStockDeduction(cart);
      setProducts(updatedProducts);

      // 2. Build transaction record
      const invoiceNo = `INV-MBG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTransaction = {
        invoiceNo,
        timestamp: new Date().toISOString(),
        items: [...cart],
        totalAmount: cartSummary.finalTotal,
        totalItemsCount: cartSummary.totalItemsCount,
        customerType,
        paymentMethod: method,
        cashReceived,
        change
      };

      // 3. Store in local transactions history
      try {
        const transHistory = JSON.parse(localStorage.getItem('mbg_pos_transactions_v1') || '[]');
        localStorage.setItem('mbg_pos_transactions_v1', JSON.stringify([newTransaction, ...transHistory]));
      } catch (e) {
        console.warn('Gagal menyimpan riwayat transaksi lokal:', e);
      }

      // 4. Open receipt modal and reset cart
      setCompletedTransaction(newTransaction);
      setIsPaymentModalOpen(false);
      setIsReceiptModalOpen(true);
      setCart([]);
      addToast(`Transaksi ${invoiceNo} berhasil diselesaikan!`, 'success');
    } catch (err) {
      addToast(err.message || 'Gagal memproses transaksi.', 'error');
      throw err;
    }
  };

  const handleStartNewTransaction = () => {
    setIsReceiptModalOpen(false);
    setCompletedTransaction(null);
    setCart([]);
  };

  // Cart Calculations (Subtotal, Diskon, Total Akhir)
  const cartSummary = useMemo(() => {
    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Subsidi MBG jika pemesan adalah Siswa Program MBG (opsional potongan atau diskon)
    const discount = customerType === 'siswa' ? 0 : 0; // Porsi normal terstandar
    const tax = 0; // PPN 0% untuk program pangan pemerintah
    const finalTotal = Math.max(0, subtotal - discount + tax);

    return {
      totalItemsCount,
      subtotal,
      discount,
      tax,
      finalTotal
    };
  }, [cart, customerType]);

  // Cart Actions
  const addToCart = (product) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      addToast(`Maaf, stok ${product.name} telah habis.`, 'warning');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= stock) {
          addToast(`Maksimal ${stock} porsi tersedia untuk ${product.name}.`, 'warning');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            stock: stock,
            calories: product.calories,
            protein: product.protein,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.stock) {
              addToast(`Hanya tersedia ${item.stock} porsi untuk ${item.name}.`, 'warning');
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setShowClearConfirm(false);
    addToast('Keranjang kasir telah dikosongkan.', 'info');
  };

  const getItemCartQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

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

            {/* Menu Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Menu tidak ditemukan</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Tidak ada menu makanan yang sesuai dengan kata kunci "{searchQuery}" pada kategori {selectedCategory}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Tampilkan Semua Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {filteredProducts.map((product) => {
                  const stock = Number(product.stock) || 0;
                  const isOutOfStock = stock <= 0;
                  const isLowStock = stock > 0 && stock <= (product.min_stock || 10);
                  const cartQty = getItemCartQty(product.id);

                  return (
                    <article
                      key={product.id}
                      className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-md ${
                        isOutOfStock
                          ? 'border-slate-200 opacity-60 bg-slate-50/50'
                          : cartQty > 0
                          ? 'border-amber-400 ring-1 ring-amber-400'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Bar on Card: SKU & Stock Tag */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {product.id}
                          </span>
                          <div>
                            {isOutOfStock ? (
                              <Badge variant="rose" size="xs" dot>
                                Habis
                              </Badge>
                            ) : isLowStock ? (
                              <Badge variant="amber" size="xs" dot>
                                Sisa {stock}
                              </Badge>
                            ) : (
                              <Badge variant="emerald" size="xs" dot>
                                Stok: {stock}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>

                        {/* Category & Nutritional Info */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {product.category}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" />
                            {product.calories || 400} kkal
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-medium">
                            {product.protein || '15g'} protein
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom: Price & Quick Add Button */}
                      <div className="px-3.5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-normal">Harga</span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                            {formatRupiah(product.price)}
                          </span>
                        </div>

                        {isOutOfStock ? (
                          <span className="text-[11px] font-semibold text-rose-500 py-1 px-2.5 bg-rose-50 rounded-lg">
                            Kosong
                          </span>
                        ) : cartQty > 0 ? (
                          /* Stepper Controls on Card when item is in cart */
                          <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-lg p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, -1)}
                              aria-label={`Kurangi ${product.name}`}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#0f172a]">
                              {cartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, 1)}
                              aria-label={`Tambah ${product.name}`}
                              className="w-6 h-6 rounded flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          /* Initial Add Button with Golden Yellow Accent */
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Pilih</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Order Cart (Cols 9-12) */}
          <aside aria-label="Keranjang Kasir MBG" className="lg:col-span-4 lg:sticky lg:top-18 space-y-4">
            <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              {/* Cart Header */}
              <header className="px-4 py-3 bg-[#0f172a] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white">
                    Keranjang Kasir MBG
                  </h2>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[11px] text-rose-300 hover:text-rose-100 flex items-center gap-1 transition cursor-pointer"
                    title="Kosongkan seluruh isi keranjang"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Kosongkan</span>
                  </button>
                )}
              </header>

              {/* Customer Category Selector */}
              <div className="p-3 bg-slate-50/80 border-b border-slate-100">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kategori Pemesan:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerType('siswa')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition cursor-pointer ${
                      customerType === 'siswa'
                        ? 'bg-[#0f172a] text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Siswa MBG
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerType('umum')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition cursor-pointer ${
                      customerType === 'umum'
                        ? 'bg-[#0f172a] text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Umum / Staf
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="p-3 max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                      <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="font-semibold text-slate-700 text-xs">Keranjang masih kosong</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Klik menu makanan pada katalog untuk menambah porsi belanja.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 text-xs truncate">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{formatRupiah(item.price)}</span>
                          <span>×</span>
                          <span className="font-bold text-slate-700">{item.quantity}</span>
                        </div>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded transition cursor-pointer"
                            aria-label={`Kurangi ${item.name}`}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center bg-white shadow-2xs text-slate-800 rounded font-bold hover:bg-slate-100 transition cursor-pointer"
                            aria-label={`Tambah ${item.name}`}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="w-16 text-right font-extrabold text-[#0f172a] text-xs">
                          {formatRupiah(item.price * item.quantity)}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                          aria-label={`Hapus ${item.name} dari pesanan`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Automatic Order Calculation Section */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Porsi ({cartSummary.totalItemsCount} porsi):</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(cartSummary.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Pajak Resto / PPN:</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">0% MBG</span>
                  </span>
                  <span className="font-semibold text-emerald-600">Rp 0</span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Subtotal Belanja:</span>
                  <span className="text-base font-extrabold text-[#0f172a]">
                    {formatRupiah(cartSummary.finalTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Button - Golden Yellow CTA */}
              <div className="p-3 bg-white border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={cart.length === 0}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-98 cursor-pointer"
                >
                  <Banknote className="w-4 h-4 stroke-[2.5]" />
                  <span>Bayar Sekarang ({formatRupiah(cartSummary.finalTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Kosongkan Keranjang Belanja?"
        message="Seluruh pilihan menu yang ada di keranjang kasir saat ini akan dihapus. Apakah Anda yakin?"
        confirmText="Ya, Kosongkan"
        cancelText="Batal"
        type="warning"
      />

      {/* POS Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={cartSummary.finalTotal}
        totalItemsCount={cartSummary.totalItemsCount}
        customerType={customerType}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* POS Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={completedTransaction}
        onNewTransaction={handleStartNewTransaction}
      />
    </div>
  );
}
