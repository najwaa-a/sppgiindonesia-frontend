import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';

export default function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    min_stock: '10',
    calories: '450',
    protein: '18',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = categories.filter((c) => c.id !== 'all');

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined ? String(product.price) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        min_stock: product.min_stock !== undefined ? String(product.min_stock) : '10',
        calories: product.calories !== undefined ? String(product.calories) : '450',
        protein: product.protein ? String(product.protein).replace(/[^0-9]/g, '') : '18',
        description: product.description || ''
      });
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [product, isOpen]);

  // Validation Logic
  const validate = (values) => {
    const errs = {};

    if (!values.name || values.name.trim() === '') {
      errs.name = 'Nama menu wajib diisi.';
    } else if (values.name.trim().length < 3) {
      errs.name = 'Nama menu minimal 3 karakter.';
    }

    if (!values.category) {
      errs.category = 'Kategori wajib dipilih.';
    }

    if (values.price === '' || isNaN(Number(values.price))) {
      errs.price = 'Harga jual harus berupa angka valid.';
    } else if (Number(values.price) <= 0) {
      errs.price = 'Harga jual harus berupa angka positif (> Rp 0).';
    }

    if (values.stock === '' || isNaN(Number(values.stock))) {
      errs.stock = 'Stok porsi harus berupa angka.';
    } else if (Number(values.stock) < 0) {
      errs.stock = 'Stok porsi tidak boleh negatif.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const currentErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, category: true, price: true, stock: true });
    const errs = validate(formData);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(product.id, formData);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Gagal memperbarui menu.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Menu: ${product.name}`}
      subtitle={`Perbarui harga, kuota stok, atau detail nutrisi untuk SKU ${product.id}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.submit && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <div>
          <label htmlFor="edit-name" className="block text-xs font-bold text-slate-700 mb-1">
            Nama Menu Makanan <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.name && !!errors.name}
            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition outline-none ${
              touched.name && errors.name
                ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]'
            }`}
          />
          {touched.name && errors.name && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-category" className="block text-xs font-bold text-slate-700 mb-1">
              Kategori Menu <span className="text-rose-500">*</span>
            </label>
            <select
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:border-[#0f172a]"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-price" className="block text-xs font-bold text-slate-700 mb-1">
              Harga Jual Satuan (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                id="edit-price"
                name="price"
                type="number"
                min="1"
                step="500"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border transition outline-none ${
                  touched.price && errors.price
                    ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                    : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]'
                }`}
              />
            </div>
            {touched.price && errors.price && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.price}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="edit-stock" className="block text-xs font-bold text-slate-700 mb-1">
              Stok Porsi Saat Ini <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition outline-none ${
                touched.stock && errors.stock
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                  : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]'
              }`}
            />
            {touched.stock && errors.stock && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.stock}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-calories" className="block text-xs font-bold text-slate-700 mb-1">
              Kalori (kkal)
            </label>
            <input
              id="edit-calories"
              name="calories"
              type="number"
              value={formData.calories}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]"
            />
          </div>

          <div>
            <label htmlFor="edit-protein" className="block text-xs font-bold text-slate-700 mb-1">
              Protein (g)
            </label>
            <input
              id="edit-protein"
              name="protein"
              type="number"
              value={formData.protein}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-xs font-bold text-slate-700 mb-1">
            Deskripsi / Komposisi
          </label>
          <textarea
            id="edit-description"
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#0f172a]"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            {isSubmitting ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
