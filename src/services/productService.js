/**
 * Service Layer for Product & Menu Management
 * Implements Fetch API for dynamic mock data with LocalStorage persistence and Supabase fallback.
 * Adheres to UTS Web Programming specifications for clean, reusable data fetching.
 */

const STORAGE_KEY = 'mbg_products_data_v1';
const CATEGORIES_KEY = 'mbg_categories_data_v1';
const PRODUCTS_JSON_URL = '/data/products.json';
const CATEGORIES_JSON_URL = '/data/categories.json';

// Simulated network latency helper to demonstrate professional loading states (Skeleton UI)
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all products
 * @param {Object} options
 * @param {boolean} options.forceRefresh - Force re-fetching from mock API endpoint
 * @returns {Promise<Array>} List of menu items
 */
export async function getProducts({ forceRefresh = false } = {}) {
  await delay(350);

  // 1. Check if cached data exists in LocalStorage
  if (!forceRefresh) {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn('Gagal membaca cache lokal produk:', err);
      }
    }
  }

  // 2. Fetch from Mock API Endpoint using Fetch API
  try {
    const response = await fetch(PRODUCTS_JSON_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal memuat data menu dari server (HTTP ${response.status})`);
    }

    const data = await response.json();

    // Save to LocalStorage for persistence during user interactions (add/edit/delete/checkout)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    // If offline or fetch failed, fallback to any existing cache
    const fallback = localStorage.getItem(STORAGE_KEY);
    if (fallback) {
      return JSON.parse(fallback);
    }
    throw new Error(error.message || 'Terjadi kesalahan saat mengambil katalog produk menu.');
  }
}

/**
 * Fetch all categories
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories() {
  const cached = localStorage.getItem(CATEGORIES_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // continue to fetch
    }
  }

  try {
    const response = await fetch(CATEGORIES_JSON_URL);
    if (!response.ok) throw new Error('Gagal memuat kategori menu');
    const data = await response.json();
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data));
    return data;
  } catch {
    // Fallback static categories if fetch fails
    return [
      { id: 'all', name: 'Semua Kategori', icon: 'Utensils' },
      { id: 'Paket Lengkap MBG', name: 'Paket Lengkap MBG', icon: 'Box' },
      { id: 'Lauk Utama', name: 'Lauk Utama', icon: 'Drumstick' },
      { id: 'Sayuran & Sup', name: 'Sayuran & Sup', icon: 'Soup' },
      { id: 'Buah & Penutup', name: 'Buah & Penutup', icon: 'Apple' },
      { id: 'Minuman Sehat', name: 'Minuman Sehat', icon: 'Milk' }
    ];
  }
}

/**
 * Add a new product
 * @param {Object} product
 * @returns {Promise<Object>} Added product
 */
export async function addProduct(product) {
  await delay(300);

  const products = await getProducts();

  // Generate SKU / ID (e.g., PRD-013)
  const nextNum = products.length + 1;
  const generatedId = `PRD-${String(nextNum).padStart(3, '0')}`;

  const newProduct = {
    id: generatedId,
    name: product.name.trim(),
    category: product.category,
    price: Number(product.price),
    stock: Number(product.stock),
    min_stock: Number(product.min_stock || 10),
    calories: Number(product.calories || 350),
    protein: product.protein ? `${product.protein.toString().replace(/[^0-9]/g, '')}g` : '15g',
    description: (product.description || 'Menu gizi seimbang terstandar MBG').trim(),
    is_active: product.is_active !== undefined ? product.is_active : true,
    created_at: new Date().toISOString()
  };

  const updatedProducts = [newProduct, ...products];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return newProduct;
}

/**
 * Update an existing product
 * @param {string} id
 * @param {Object} productData
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(id, productData) {
  await delay(300);

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
  }

  const updatedItem = {
    ...products[index],
    name: productData.name ? productData.name.trim() : products[index].name,
    category: productData.category || products[index].category,
    price: productData.price !== undefined ? Number(productData.price) : products[index].price,
    stock: productData.stock !== undefined ? Number(productData.stock) : products[index].stock,
    min_stock: productData.min_stock !== undefined ? Number(productData.min_stock) : products[index].min_stock,
    calories: productData.calories !== undefined ? Number(productData.calories) : products[index].calories,
    protein: productData.protein ? `${productData.protein.toString().replace(/[^0-9]/g, '')}g` : products[index].protein,
    description: productData.description !== undefined ? productData.description.trim() : products[index].description,
    is_active: productData.is_active !== undefined ? productData.is_active : products[index].is_active,
    updated_at: new Date().toISOString()
  };

  products[index] = updatedItem;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return updatedItem;
}

/**
 * Delete a product by ID
 * @param {string} id
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProduct(id) {
  await delay(250);

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Decrement stock for POS orders
 * @param {Array<{id: string, quantity: number}>} cartItems
 * @returns {Promise<Array>} Updated products list
 */
export async function processOrderStockDeduction(cartItems) {
  await delay(200);

  const products = await getProducts();

  // Validate stock sufficiency for all items first
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      throw new Error(`Produk ${item.name || item.id} tidak ditemukan.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Stok ${product.name} tidak mencukupi (sisa ${product.stock}, diminta ${item.quantity}).`);
    }
  }

  // Deduct stock
  const updatedProducts = products.map((product) => {
    const ordered = cartItems.find((item) => item.id === product.id);
    if (ordered) {
      return {
        ...product,
        stock: Math.max(0, product.stock - ordered.quantity)
      };
    }
    return product;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  return updatedProducts;
}

/**
 * Reset local storage data back to mock file defaults
 * @returns {Promise<Array>} Default products
 */
export async function resetProductsToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  return await getProducts({ forceRefresh: true });
}
