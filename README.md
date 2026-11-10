# SPPGIndonesia - Frontend Platform ERP Makan Bergizi Gratis (MBG)

Platform Enterprise Resource Planning (ERP) berskala ringan yang dirancang khusus untuk mengelola operasional program **Makan Bergizi Gratis (MBG)** secara transparan, akurat, dan terintegrasi—mulai dari tata kelola menu gizi, stok bahan dapur, kasir POS porsi, hingga pencatatan transaksi audit.

Tugas Besar I (UTS) Mata Kuliah Perancangan dan Pemrograman Web (PPW) — Telkom University.

---

## 👥 Modul Pengerjaan Individu

### Nadia (`feat/nadia-pos-products`)
* **Halaman Kasir POS Sederhana (`/dashboard/pos`)**:
  - Layar kasir cepat untuk pemilihan varian menu MBG dengan filter kategori pill (Semua, Paket Lengkap, Lauk Utama, Sayuran & Sup, Buah & Penutup, Minuman Sehat).
  - Pencarian menu makanan secara real-time berdasarkan nama, kategori, atau kode SKU.
  - Kartu katalog menu interaktif dengan informasi kandungan nutrisi (Kalori & Protein), label status stok realtime (*Tersedia*, *Stok Kritis*, *Habis*), dan tombol penambahan porsi langsung.
  - Panel Keranjang Kasir (*Order Cart*) dengan kalkulasi otomatis subtotal belanja, pembedaan kategori pemesan (Siswa MBG vs Umum/Staf), kuota stok check, dan tombol kosongkan keranjang dengan konfirmasi aman.
  - Dialog Pembayaran Cepat (*Payment Modal*) dengan dukungan Uang Tunai (tombol nominal instan, validasi kecukupan uang, dan kalkulator uang kembalian otomatis), QRIS Dinamis MBG, serta Transfer Bank/VA.
  - Dialog Cetak Struk Transaksi (*Receipt Modal*) standar thermal dengan opsi cetak fisik (`window.print()`), pencatatan nomor invoice unik, dan pemotongan stok otomatis.

* **Halaman Kelola Data Menu / Tambah Menu (`/dashboard/products`)**:
  - Kartu Ringkasan Metrik Inventori (*Total Varian Menu*, *Total Porsi Tersedia*, *Peringatan Stok Kritis*, *Rata-rata Harga Porsi*).
  - Tabel interaktif daftar stok menu lengkap dengan kode SKU, nama menu, indikator nutrisi, kategori badge, harga jual satuan, jumlah stok, status ketersediaan, serta aksi Edit dan Hapus.
  - Modul Pencarian dan Filter ganda (kategori menu, status stok ketersediaan, dan pengurutan harga/stok/nama).
  - **Fokus Penilaian - Validasi Form Client-side pada Form Tambah Menu Baru**:
    - **Nama Menu**: Wajib diisi, minimal 3 karakter, maksimal 80 karakter, pembersihan spasi (*trim*), pesan error real-time, dan `aria-invalid`.
    - **Kategori Menu**: Wajib dipilih dari daftar kategori aktif.
    - **Harga Jual (Rp)**: Wajib berupa angka positif (`> Rp 0`), bilangan bulat rupiah, dengan pratinjau nominal terformat rupiah.
    - **Stok Porsi Awal**: Wajib berupa bilangan bulat non-negatif (`>= 0 porsi`).
    - **Nutrisi (Kalori & Protein)**: Validasi angka positif untuk standar gizi anak MBG.
  - **Tombol Reset & Submit yang Aman**:
    - Tombol Reset dilengkapi *dirty-check* dan konfirmasi dialog pencegahan kehilangan data jika pengguna telah mengisi formulir.
    - Tombol Submit dilindungi dengan *loading/saving state* dan *disabled state* saat input belum valid atau sedang memproses untuk mencegah pengiriman data ganda (*duplicate submission*).
  - Modal Edit Menu dan Dialog Konfirmasi Hapus Menu untuk mencegah penghapusan data secara tidak sengaja.

---

## 🎨 Panduan Desain & Antarmuka (Corporate ERP)

Sesuai dengan spesifikasi desain SPPGIndonesia:
* **Clean & Minimalist**: Pemanfaatan ruang kosong (*white space*) pada area konten tengah untuk mencegah tampilan sesak dan meningkatkan fokus kerja operator kasir dan dapur.
* **Card-Based UI**: Semua data penting, statistik, katalog menu, dan formulir dibungkus di dalam kartu putih dengan bayangan halus (*soft drop shadow*) dan sudut membulat (*rounded corners*).
* **Palet Warna Resmi**:
  - **Deep Navy (`#0F172A` / `#1E293B`)**: Warna primer pada hero bar, header tabel, tombol navigasi utama, dan modal header.
  - **Golden Yellow (`#F59E0B` / `#FBBF24`)**: Warna aksen utama khusus untuk tombol *Call to Action (CTA)* seperti `+ Tambah Menu Baru` dan `Bayar Sekarang`.
  - **Pure White (`#FFFFFF`)**: Latar belakang utama pada card konten tengah untuk memaksimalkan keterbacaan (*readability*).
  - **Light Gray (`#F8FAFC` / `#F1F5F9`)**: Latar belakang kontras lembut untuk kontainer dan kartu sekunder.
  - **Dark Charcoal (`#1E293B` / `#334155`)**: Tipografi tajam dan nyaman dibaca untuk jam kerja panjang di dapur.
  - **Soft Cyan / Light Blue (`#0EA5E9` / `#E0F2FE`)**: Badge kategori dan status sekunder.

---

## 🛠️ Tech Stack & Arsitektur

* **Framework**: React 19 + Vite 8
* **Routing**: React Router DOM v7
* **Styling**: Tailwind CSS v4 + Flexbox & Grid CSS Modern
* **Icons**: Lucide React
* **Data Fetching Layer**:
  - Mengonsumsi Fetch API dari Mock API Endpoint (`/data/products.json` dan `/data/categories.json`)
  - Sinkronisasi *LocalStorage* untuk persistensi perubahan data CRUD dan pemotongan stok kasir POS
  - Loading State menggunakan *Skeleton UI* (`<LoadingSkeleton />`)
  - Error State UI dengan tombol *Retry* (`<ErrorAlert />`)
  - Aksesibilitas WCAG (ARIA labels, keyboard navigation Escape/Tab, semantic HTML5)

---

## 🚀 Panduan Menjalankan Proyek (Setup Instructions)

### 1. Prasyarat
* Node.js versi 18 ke atas
* npm atau yarn / pnpm

### 2. Instalasi Dependensi
```bash
# Clone repository
git clone https://github.com/najwaa-a/sppgiindonesia-frontend.git
cd sppgiindonesia-frontend

# Checkout ke branch pengerjaan Nadia
git checkout feat/nadia-pos-products

# Install packages
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Salin contoh environment file jika ingin menghubungkan dengan backend Supabase:
```bash
cp .env.example .env
```
*(Catatan: Aplikasi telah dilengkapi Mock API mandiri via Fetch API sehingga berjalan 100% sempurna tanpa memerlukan setup Supabase eksternal)*.

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat [http://localhost:5173/](http://localhost:5173/).

### 5. Membangun Versi Produksi
```bash
npm run build
```
Hasil build siap disajikan di folder `dist/`.

---

## 📁 Struktur Direktori Fitur

```
src/
├── components/
│   ├── common/
│   │   ├── Badge.jsx            # Reusable Badge dengan varian warna ERP
│   │   ├── ConfirmDialog.jsx    # Modal konfirmasi aman (reset/hapus/order)
│   │   ├── Modal.jsx            # Accessible Modal Dialog dengan ESC trap
│   │   └── Toast.jsx            # Sistem notifikasi toast non-intrusif
│   ├── pos/
│   │   ├── PaymentModal.jsx     # Dialog kasir tunai, QRIS, & kalkulator kembalian
│   │   └── ReceiptModal.jsx     # Struk bukti pembayaran kasir POS siap cetak
│   ├── products/
│   │   ├── AddProductModal.jsx  # Form tambah produk dengan validasi client-side
│   │   └── EditProductModal.jsx # Form edit & update stok menu
│   ├── DashboardSidebar.jsx     # Navigasi sidebar dashboard
│   ├── ErrorAlert.jsx           # State error dengan tombol Retry
│   └── LoadingSkeleton.jsx      # State loading skeleton interaktif
├── pages/
│   └── dashboard/
│       ├── POS.jsx              # Halaman Kasir POS Sederhana (/dashboard/pos)
│       ├── Products.jsx         # Halaman Kelola Data Menu (/dashboard/products)
│       ├── Overview.jsx         # Beranda metrik operasional
│       └── Transactions.jsx     # Log transaksi penjualan
└── services/
    ├── productService.js        # Fetch API, stok decrement, & localStorage persistence
    └── supabase.js              # Supabase client connector
```

---

*Dikembangkan oleh Nadia untuk Tugas Besar I (UTS) Perancangan dan Pemrograman Web 2026.*
