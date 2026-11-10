# SPPGIndonesia - Frontend Platform ERP Makan Bergizi Gratis (MBG)

Platform Enterprise Resource Planning (ERP) berskala ringan yang dirancang khusus untuk mengelola operasional program **Makan Bergizi Gratis (MBG)** secara transparan, akurat, dan terintegrasi—mulai dari tata kelola menu gizi, stok bahan dapur, kasir POS porsi, hingga pencatatan transaksi audit.

Proyek ini disusun untuk memenuhi evaluasi praktik frontend development pada **Tugas Besar I (UTS) Mata Kuliah Perancangan dan Pemrograman Web (PPW)** — Telkom University.

---

## 🎯 Pemenuhan Spesifikasi UTS (Requirements)

Aplikasi ini telah dikembangkan dengan mematuhi seluruh requirement wajib dari spesifikasi tugas besar:

1. **Terdiri dari minimal 5-7 halaman terkoneksi**:
   Aplikasi memiliki **8 halaman** yang terhubung menggunakan React Router DOM (SPA): Beranda (`/`), Katalog Menu (`/menu`), Detail Menu (`/menu/:id`), Keranjang & Checkout (`/checkout`), Dashboard (`/dashboard`), Riwayat Transaksi (`/dashboard/transactions`), Kasir POS (`/dashboard/pos`), dan Kelola Menu (`/dashboard/products`).
2. **Framework JavaScript Modern & Arsitektur (ES6+)**:
   Dibangun menggunakan **React.js 19** dan **Vite**. Kode mengimplementasikan standar ES6+ (Arrow Functions, Destructuring, Async/Await, Array Methods `.map()`, `.filter()`). Menerapkan *Component Architecture* yang *reusable* (DRY principle) seperti `DashboardSidebar`, `LoadingSkeleton`, `ErrorAlert`, dan `ConfirmDialog`.
3. **Mengkonsumsi API (Data Fetching)**:
   Menggunakan **Fetch API** secara asinkron. Terdapat integrasi *Public API / External Database* menggunakan Supabase (untuk data transaksi & menu) dan *Mock API* menggunakan file JSON lokal (`/data/products.json`) yang dipadukan dengan *LocalStorage* untuk simulasi persistensi stok.
4. **Loading & Error States UI**:
   - **Loading State**: Terdapat komponen *Skeleton UI* interaktif saat menunggu *response* data dari API.
   - **Error Handling**: Dibungkus dengan blok `try-catch`, lengkap dengan komponen `ErrorAlert` yang memiliki fitur *Retry*, serta fallback UI interaktif jika pencarian data tidak ditemukan.
5. **Semantic HTML5 & Accessibility (a11y)**:
   - Penggunaan tag semantik yang tepat (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<table>`, `<form>`) untuk menghindari *div soup*.
   - Menerapkan atribut *Accessibility* (ARIA): `aria-invalid`, `aria-describedby`, `role="alert"`. Mendukung *Keyboard Navigation* (contoh: tombol `Esc` untuk menutup modal).
6. **Modern CSS & Responsive Design**:
   - Menggunakan **Tailwind CSS v4** yang mengombinasikan **Flexbox** dan **CSS Grid**.
   - Responsif di seluruh perangkat (Mobile, Tablet, Desktop) memanfaatkan *Media Queries* bawaan Tailwind (`sm:`, `md:`, `lg:`). Terdapat juga `@media print` khusus untuk cetak struk POS.
7. **Form Validation (Client-Side)**:
   Validasi ketat sebelum *submit* dengan *visual feedback* (pesan error merah, disable button).
   - Checkout: Nama minimal 3 karakter, No WhatsApp 10-13 digit angka.
   - Tambah Menu: Nama wajib isi, Harga wajib angka positif `>0`, Stok wajib `>=0`.
   - POS: Validasi uang bayar tidak boleh kurang dari total tagihan.

---

## 👥 Modul Pengerjaan Individu

Aplikasi ini dibagi menjadi 2 sisi utama: (1) Sisi Toko & Pelanggan, dan (2) Sisi Dashboard & Kasir, yang dikerjakan secara modular oleh anggota kelompok:

### SISI 1: TOKO & PELANGGAN

#### 1. Fatikhah Sukma Arti (`feat/sukma-home-menu`)
* **Halaman Beranda / Home Toko (`/`)**: Hero banner interaktif, profil dapur gizi, dan kartu menu terpopuler (*fetch* dari Supabase).
* **Halaman Katalog Menu Makanan (`/menu`)**: Grid daftar makanan responsif, tab filter kategori, dan *search bar* klien-side.
* *Fokus Teknis*: CSS Grid/Flexbox responsif, implementasi *loading skeleton* katalog, dan *fallback UI* / pesan error pencarian.

#### 2. Abidah Fatimatuzzahrah (`feat/abidah-detail-checkout`)
* **Halaman Detail Menu Nutrisi (`/menu/:id`)**: Visualisasi produk, deskripsi porsi, dan tabel informasi nilai gizi (Kalori, Protein, dll).
* **Halaman Keranjang & Form Checkout (`/checkout`)**: Rincian item pesanan, state kalkulasi total, tombol *adjust* kuantitas, dan Form Data Pembeli.
* *Fokus Teknis*: State keranjang belanja (React State), *Client-side Validation* pada form pembelian dengan UI error teks merah.

### SISI 2: DASHBOARD PENGELOLA & KASIR

#### 3. Najwa Areefa Ghaisani (`feat/najwa-dashboard-overview`)
* **Halaman Dashboard Utama (`/dashboard`)**: Kartu ringkasan agregat harian dan daftar 5 pesanan terbaru secara *real-time*.
* **Halaman Riwayat Semua Transaksi (`/dashboard/transactions`)**: Tabel data riwayat penjualan komprehensif lengkap dengan *filter status* (Paid/Pending/Cancelled).
* *Fokus Teknis*: Layout *dashboard* (sidebar/navbar), *data fetching* Supabase dengan error handling (*try-catch*), dan *skeleton loading state*.

#### 4. Nadia Tambunan (`feat/nadia-pos-products`)
* **Halaman Kasir POS Sederhana (`/dashboard/pos`)**: Layar kasir cepat (*Point of Sale*) dengan perhitungan otomatis subtotal, kembalian, cetak struk (`window.print`), dan pemotongan stok otomatis.
* **Halaman Kelola Data Menu / Tambah Menu (`/dashboard/products`)**: Tabel manajemen stok dan Form Input Tambah Menu (Nama, Kategori, Harga, Stok).
* *Fokus Teknis*: Arsitektur komponen modular (Modal/Dialog aman), *client-side validation* form tambah menu (wajib positif, disable submit), dan mekanisme integrasi Mock API JSON dengan LocalStorage.

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

# Install packages
npm install
```

### 3. Konfigurasi Lingkungan (Environment Setup)
```bash
# Salin file konfigurasi environment
cp .env.example .env
```
*Buka file `.env` dan isi nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sesuai dengan credentials Supabase Anda.*

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat [http://localhost:5173/](http://localhost:5173/). 
*(Gunakan kredensial login sesuai role admin/kasir yang telah disiapkan pada presentasi).*

### 5. Membangun Versi Produksi
```bash
npm run build
```

---
*Laporan & README ini disusun untuk memenuhi kelengkapan submission Tugas Besar 1 (UTS) PPW.*
