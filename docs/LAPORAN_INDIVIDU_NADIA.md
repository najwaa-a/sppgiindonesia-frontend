# LAPORAN INDIVIDU TUGAS BESAR I (UTS)
## PERANCANGAN DAN PEMROGRAMAN WEB (PPW)
### School of Computing - Telkom University

---

* **Nama Anggota**: Nadia
* **Akun Git / GitHub**: `nadia2622` (`nadiatmbunan@gmail.com`)
* **Git Branch**: `feat/nadia-pos-products`
* **Halaman yang Dibuat**:
  1. Halaman Kasir POS Sederhana (`/dashboard/pos`)
  2. Halaman Kelola Data Menu / Tambah Menu (`/dashboard/products`)
* **Fokus Penilaian**: Validasi Form Client-side pada Form Tambah Produk & Tombol Reset/Submit yang Aman.

---

## 1. Deskripsi Modul & Arsitektur Fitur

### 1.1. Halaman Kasir POS Sederhana (`/dashboard/pos`)
Halaman ini adalah modul kasir cepat (*Point of Sale*) yang dirancang khusus untuk memproses pemilihan dan distribusi makanan Program Makan Bergizi Gratis (MBG):
* **Katalog Menu Cepat**: Pengguna dapat mencari menu secara instan melalui kolom pencarian atau filter kategori *pill* (Semua, Paket Lengkap, Lauk Utama, Sayuran & Sup, Buah & Penutup, Minuman Sehat).
* **Kartu Menu Interaktif**: Menampilkan kode SKU, nama menu, informasi nilai gizi (Kalori dalam kkal & Protein dalam gram), harga satuan, dan status ketersediaan stok (*Tersedia*, *Stok Kritis*, atau *Habis*).
* **Keranjang Belanja (*Order Cart*)**:
  - Pilihan segmen pemesan: *Siswa Program MBG* vs *Umum / Staf*.
  - Menampilkan daftar porsi yang dipilih dengan kontrol kuantitas (*stepper* +/-) dan tombol hapus item.
  - Perhitungan otomatis subtotal belanja, kuota porsi, dan pembebasan PPN (0% fasilitas program pangan bergizi pemerintah).
  - Tombol *Kosongkan Keranjang* dilindungi oleh modal konfirmasi (*safe clear*).
* **Modal Pembayaran Cepat (*Payment Modal*)**:
  - Mendukung 3 metode pembayaran: **Uang Tunai (Cash)**, **QRIS Dinamis MBG**, dan **Transfer Bank / Virtual Account**.
  - Dilengkapi tombol nominal cepat (*Uang Pas*, Rp 20.000, Rp 50.000, Rp 100.000, Rp 200.000).
  - Validasi *real-time* uang diterima: sistem mencegah transaksi jika nominal uang kurang dari total belanja, dan otomatis menghitung **Uang Kembalian** saat nominal valid.
* **Modal Struk Transaksi (*Receipt Modal*)**:
  - Menampilkan format struk kasir termal dengan nomor invoice unik (`INV-MBG-...`), rincian menu, metode pembayaran, kasir bertugas (Nadia), dan uang kembalian.
  - Terintegrasi fitur cetak fisik (`window.print()`) dan tombol *Transaksi Baru*.
  - Otomatis memotong sisa stok produk secara *real-time* via service layer.

---

### 1.2. Halaman Kelola Data Menu / Tambah Menu (`/dashboard/products`)
Halaman ini adalah pusat administrasi stok dapur dan katalog menu MBG:
* **Kartu Ringkasan Metrik**:
  - *Total Varian Menu Aktif*, *Total Porsi Tersedia*, *Peringatan Stok Kritis & Habis*, dan *Rata-rata Harga Porsi*.
* **Tabel Stok Inventori Interaktif**:
  - Format tabel data semantik lengkap dengan kode SKU, nama menu & gizi, kategori badge, harga jual terformat Rupiah, sisa stok porsi, status ketersediaan (*Tersedia Aman*, *Stok Kritis*, *Habis*), serta tombol aksi *Edit* dan *Hapus*.
  - Filter pencarian teks ganda, dropdown kategori, status ketersediaan stok, dan fitur *sorting* (berdasarkan nama A-Z, Z-A, harga, dan stok).
* **Fokus Penilaian — Validasi Form Client-Side (Form Tambah Menu Baru)**:
  - **Nama Menu**: Wajib diisi, minimal 3 karakter, maksimal 80 karakter, pembersihan spasi (*trim*), pesan error *inline*, dan atribut aksesibilitas `aria-invalid`.
  - **Kategori Menu**: Wajib dipilih dari daftar kategori menu yang tersedia.
  - **Harga Jual (Rp)**: Wajib berupa angka positif (`> Rp 0`), bilangan bulat rupiah, dilengkapi pratinjau format Rupiah.
  - **Stok Porsi Awal**: Wajib berupa bilangan bulat non-negatif (`>= 0 porsi`).
  - **Nutrisi (Kalori & Protein)**: Validasi angka non-negatif untuk kelayakan standar gizi anak MBG.
  - Umpan balik visual langsung: border merah + ikon peringatan saat tidak valid, dan border hijau + ikon centang saat valid.
* **Tombol Reset & Submit yang Aman**:
  - **Tombol Reset Aman**: Dilengkapi *dirty-check* dan konfirmasi dialog pencegahan kehilangan data jika pengguna telah mengetik sebagian formulir.
  - **Tombol Submit Aman**: Memiliki *loading/saving state* dan *disabled state* saat input belum valid atau sedang memproses untuk mencegah pengiriman data ganda (*duplicate submission*).
* **Modal Edit Menu & Dialog Konfirmasi Hapus**:
  - Memungkinkan penyesuaian harga dan penambahan stok (*restock*) secara cepat.
  - Dialog konfirmasi hapus menu dengan warna aksen bahaya (*danger*) agar terhindar dari salah klik.

---

## 2. Penjelasan Teknis Implementasi (Rubrik Penilaian)

### 2.1. HTML Semantics & Accessibility (WCAG Compliance)
* **Tag Semantik HTML5**:
  - Menggunakan `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`, `<nav>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<form>`, dan `<label>` untuk memberikan struktur hierarki yang bermakna bagi *screen reader* dan search engine.
* **Aksesibilitas Formulir & ARIA Attributes**:
  - Seluruh elemen input memiliki label eksplisit yang dihubungkan dengan atribut `htmlFor` dan `id`.
  - Input form dilengkapi `aria-required="true"`, `aria-invalid={...}`, `aria-describedby="...-error"`, dan `role="alert"` untuk pengguna pembaca layar.
* **Navigasi Keyboard**:
  - Modal dialog dapat ditutup menggunakan tombol <kbd>Esc</kbd>.
  - Urutan tabulasi (*tab order*) berurutan dan fokus elemen interaktif jelas terlihat (*focus ring*).

### 2.2. Modern CSS & Responsive Design
* **Layout Flexbox & CSS Grid**:
  - Katalog kasir POS memanfaatkan CSS Grid responsif (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`) berdampingan dengan aside keranjang kasir (`lg:col-span-4 lg:sticky lg:top-18`).
  - Tabel produk dibungkus kontainer responsif `overflow-x-auto` sehingga nyaman dibuka pada perangkat *mobile*, *tablet*, maupun *desktop*.
* **Palet Warna Resmi Corporate B2B ERP**:
  - **Deep Navy (`#0F172A`)**: Memberikan kesan stabil, formal, dan tepercaya pada area header kartu dan navigasi.
  - **Golden Yellow (`#F59E0B`)**: Kontras tinggi khusus untuk tombol *Call to Action (CTA)* seperti `+ Tambah Menu Baru` dan `Bayar Sekarang`.
  - **Pure White (`#FFFFFF`)**: Latar belakang kartu konten tengah untuk memastikan *white space* lega dan keterbacaan tinggi.
  - **Light Gray (`#F8FAFC`)**: Latar belakang kontras lembut untuk kontainer dan kartu sekunder.
  - **Soft Cyan (`#0EA5E9`)**: Badge status dan indikator sekunder.

### 2.3. JavaScript (ES6+) & Framework Implementation
* **React 19 & Component Architecture**:
  - Kode dipecah secara modular menjadi komponen yang dapat digunakan kembali (*reusable*): `<Modal />`, `<ConfirmDialog />`, `<Badge />`, `<Toast />`, `<AddProductModal />`, `<EditProductModal />`, `<PaymentModal />`, dan `<ReceiptModal />`.
* **State Management & React Hooks**:
  - Menggunakan `useState` untuk reaktivitas lokal (keranjang belanja, filter, status modal).
  - Menggunakan `useMemo` untuk efisiensi komputasi *filtering*, *sorting*, dan kalkulasi total belanja tanpa membebani render.
  - Menggunakan `useEffect` untuk inisialisasi pemanggilan data saat komponen pertama kali di-*mount*.
  - Menggunakan `useContext` melalui custom hook `useToast()` untuk notifikasi non-intrusif di seluruh aplikasi.

### 2.4. Data Fetching & API Integration
* **Pemanfaatan Fetch API**:
  - Implementasi fungsi `getProducts()` dan `getCategories()` di `src/services/productService.js` yang memanggil `fetch('/data/products.json')` dan `fetch('/data/categories.json')`.
* **Persistensi Data & Sinkronisasi Real-Time**:
  - Data disinkronkan ke `localStorage` (`mbg_products_data_v1` dan `mbg_pos_transactions_v1`), sehingga penambahan menu baru, pengubahan harga/stok, dan pemotongan kuota kasir POS bertahan saat berpindah halaman maupun di-*refresh*.
* **Penanganan Error & Loading State**:
  - Menampilkan `<LoadingSkeleton />` interaktif saat proses *fetching* berlangsung.
  - Menampilkan `<ErrorAlert />` dilengkapi tombol *Retry* jika terjadi gangguan jaringan (*try-catch block* komprehensif).
  - Inisialisasi Supabase client dilengkapi *safe resilient fallback* sehingga aplikasi tidak pernah mengalami *blank screen*.

---

## 3. Panduan Pengambilan Screenshot untuk Laporan

Untuk melengkapi laporan di LMS, berikut panduan bagian halaman yang dapat diambil screenshot-nya:
1. **Halaman Kasir POS Sederhana (`/dashboard/pos`)**:
   - Tampilan katalog menu lengkap dengan filter kategori *pill* dan status stok.
   - Tampilan keranjang kasir (*Order Cart*) dengan beberapa item porsi terpilih dan kalkulasi otomatis.
   - Tampilan modal pembayaran tunai dengan kalkulasi kembalian otomatis.
   - Tampilan modal cetak struk kasir (*receipt modal*).
2. **Halaman Kelola Data Menu (`/dashboard/products`)**:
   - Tampilan ringkasan metrik inventori dan tabel stok menu.
   - Tampilan formulir tambah produk saat validasi error aktif (border merah & pesan inline).
   - Tampilan dialog konfirmasi tombol reset (*safe reset confirm dialog*).
   - Tampilan modal edit produk atau dialog konfirmasi hapus menu.
