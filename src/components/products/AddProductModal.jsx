import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import {
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Save
} from 'lucide-react';

const INITIAL_FORM_STATE = {
  name: '',
  category: '',
  price: '',
  stock: '',
  min_stock: '10',
  calories: '450',
  protein: '18',
  description: ''
};

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories = []
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filter out 'all' category for the dropdown
  const categoryOptions = categories.filter((c) => c.id !== 'all');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
      setShowResetConfirm(false);
    }
  }, [isOpen]);

  // Client-Side Validation Logic
  const validate = (values) => {
    const errs = {};

    // 1. Validasi Nama Menu (Tidak boleh kosong, min 3 karakter)
    if (!values.name || values.name.trim() === '') {
      errs.name = 'Nama menu wajib diisi dan tidak boleh hanya spasi.';
    } else if (values.name.trim().length < 3) {
      errs.name = 'Nama menu minimal harus terdiri dari 3 karakter.';
    } else if (values.name.trim().length > 80) {
      errs.name = 'Nama menu maksimal 80 karakter.';
    }

    // 2. Validasi Kategori (Wajib dipilih)
    if (!values.category || values.category === '') {
      errs.category = 'Silakan pilih kategori menu yang sesuai.';
    }

    // 3. Validasi Harga Jual (Harus angka positif > 0)
    if (values.price === '' || values.price === null || values.price === undefined) {
      errs.price = 'Harga jual wajib diisi.';
    } else {
      const numPrice = Number(values.price);
      if (isNaN(numPrice)) {
        errs.price = 'Harga jual harus berupa angka valid.';
      } else if (numPrice <= 0) {
        errs.price = 'Harga jual harus berupa angka positif (lebih dari Rp 0).';
      } else if (!Number.isInteger(numPrice)) {
        errs.price = 'Harga jual harus berupa bilangan bulat rupiah.';
      }
    }

    // 4. Validasi Stok (Harus bilangan bulat non-negatif >= 0)
    if (values.stock === '' || values.stock === null || values.stock === undefined) {
      errs.stock = 'Jumlah stok porsi awal wajib diisi.';
    } else {
      const numStock = Number(values.stock);
      if (isNaN(numStock)) {
        errs.stock = 'Stok porsi harus berupa angka.';
      } else if (numStock < 0) {
        errs.stock = 'Stok porsi tidak boleh bernilai negatif.';
      } else if (!Number.isInteger(numStock)) {
        errs.stock = 'Stok porsi harus berupa bilangan bulat (tanpa desimal).';
      }
    }

    // 5. Validasi Kalori & Protein (Opsional tetapi harus positif jika diisi)
    if (values.calories) {
      const numCal = Number(values.calories);
      if (isNaN(numCal) || numCal <= 0) {
        errs.calories = 'Estimasi kalori harus angka positif.';
      }
    }

    return errs;
  };

  // Check if form is dirty (user has typed something)
  const isDirty = () => {
    return (
      formData.name.trim() !== '' ||
      formData.category !== '' ||
      formData.price !== '' ||
      formData.stock !== '' ||
      formData.description.trim() !== ''
    );
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // If field was already touched, validate in real time
    if (touched[name]) {
      const currentErrors = validate(updatedForm);
      setErrors((prev) => ({
        ...prev,
        [name]: currentErrors[name] || undefined
      }));
    }
  };

  // Handle Blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: currentErrors[name] || undefined
    }));
  };

  // Safe Reset Handler with Dirty-Check Confirmation
  const handleSafeResetClick = () => {
    if (isDirty()) {
      setShowResetConfirm(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setShowResetConfirm(false);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({
      name: true,
      category: true,
      price: true,
      stock: true
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Gagal menyimpan data menu. Silakan coba lagi.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Close Handler
  const handleSafeClose = () => {
    if (isDirty() && !isSubmitting) {
      setShowResetConfirm(true);
    } else {
      onClose();
    }
  };

  const isFormValid = Object.keys(validate(formData)).length === 0 && isDirty();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleSafeClose}
        title="Tambah Menu Makan Bergizi Gratis (MBG)"
        subtitle="Form registrasi varian menu baru dengan verifikasi kelayakan gizi dan harga"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Global Submit Error if any */}
          {errors.submit && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Field 1: Nama Menu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="menu-name" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>Nama Menu Makanan</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.name.length}/80 karakter
              </span>
            </div>
            <div className="relative">
              <input
                id="menu-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contoh: Paket Nasi Ayam Woku & Sayur Lodeh"
                aria-required="true"
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition outline-none ${
                  touched.name && errors.name
                    ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-400'
                    : touched.name && !errors.name && formData.name.trim() !== ''
                    ? 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]'
                }`}
              />
              {touched.name && !errors.name && formData.name.trim() !== '' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
            {touched.name && errors.name && (
              <p id="name-error" role="alert" className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Row 2: Kategori & Harga Jual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 2: Kategori */}
            <div>
              <label htmlFor="menu-category" className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Menu <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <select
                id="menu-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.category && !!errors.category}
                aria-describedby={errors.category ? 'category-error' : undefined}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition outline-none bg-white ${
                  touched.category && errors.category
                    ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                    : 'border-slate-300 text-slate-700 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]'
                }`}
              >
                <option value="">-- Pilih Kategori Menu --</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <p id="category-error" role="alert" className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            {/* Field 3: Harga Jual */}
            <div>
              <label htmlFor="menu-price" className="block text-xs font-bold text-slate-700 mb-1">
                Harga Jual Satuan (Rp) <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                  Rp
                </span>
                <input
                  id="menu-price"
                  name="price"
                  type="number"
                  min="1"
                  step="500"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="15000"
                  aria-required="true"
                  aria-invalid={touched.price && !!errors.price}
                  aria-describedby={errors.price ? 'price-error' : undefined}
                  className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border transition outline-none ${
                    touched.price && errors.price
                      ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                      : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]'
                  }`}
                />
              </div>
              {touched.price && errors.price ? (
                <p id="price-error" role="alert" className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.price}</span>
                </p>
              ) : formData.price && Number(formData.price) > 0 ? (
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Setara: Rp {Number(formData.price).toLocaleString('id-ID')} / porsi
                </p>
              ) : null}
            </div>
          </div>

          {/* Row 3: Stok Porsi & Nutrisi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Field 4: Stok Awal */}
            <div>
              <label htmlFor="menu-stock" className="block text-xs font-bold text-slate-700 mb-1">
                Stok Porsi Awal <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="menu-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="40"
                aria-required="true"
                aria-invalid={touched.stock && !!errors.stock}
                aria-describedby={errors.stock ? 'stock-error' : undefined}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition outline-none ${
                  touched.stock && errors.stock
                    ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                    : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]'
                }`}
              />
              {touched.stock && errors.stock && (
                <p id="stock-error" role="alert" className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.stock}</span>
                </p>
              )}
            </div>

            {/* Field 5: Kalori (MBG) */}
            <div>
              <label htmlFor="menu-calories" className="block text-xs font-bold text-slate-700 mb-1">
                Energi (Kalori/kkal)
              </label>
              <div className="relative">
                <input
                  id="menu-calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">
                  kkal
                </span>
              </div>
            </div>

            {/* Field 6: Protein (MBG) */}
            <div>
              <label htmlFor="menu-protein" className="block text-xs font-bold text-slate-700 mb-1">
                Kandungan Protein (g)
              </label>
              <div className="relative">
                <input
                  id="menu-protein"
                  name="protein"
                  type="number"
                  min="0"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">
                  gram
                </span>
              </div>
            </div>
          </div>

          {/* Field 7: Deskripsi Menu */}
          <div>
            <label htmlFor="menu-description" className="block text-xs font-bold text-slate-700 mb-1">
              Komposisi &amp; Deskripsi Singkat
            </label>
            <textarea
              id="menu-description"
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan lauk pauk, sayur, buah, atau sertifikasi gizi yang terkandung dalam paket ini..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a] outline-none"
            ></textarea>
          </div>

          {/* Form Actions: Safe Reset and Submit Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {/* Safe Reset Button with Icon */}
            <button
              type="button"
              onClick={handleSafeResetClick}
              disabled={isSubmitting || !isDirty()}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Kembalikan formulir ke isian kosong semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Formulir</span>
            </button>

            {/* Action Group: Batal & Simpan Produk */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSafeClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
              >
                Batal
              </button>

              {/* Submit Button - Golden Yellow Accent CTA */}
              <button
                type="submit"
                disabled={isSubmitting || (touched.name && Object.keys(validate(formData)).length > 0)}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin"></span>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Menu Baru</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Safe Reset / Unsaved Changes */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={executeReset}
        title="Reset Formulir Produk?"
        message="Anda telah memasukkan beberapa data menu. Jika direset, seluruh isian yang belum tersimpan akan dikosongkan. Lanjutkan?"
        confirmText="Ya, Kosongkan Form"
        cancelText="Kembali Mengisi"
        type="warning"
      />
    </>
  );
}

