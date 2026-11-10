import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Utensils, Home, RotateCw, ChevronRight, Leaf, Apple } from 'lucide-react';
import { supabase } from '../../services/supabase';
import './public.css';

const categories = ['Semua', 'Makanan Pokok', 'Sayur', 'Buah'];

function getValue(item, keys, fallback = '') {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') return item[key];
  }
  return fallback;
}

function getCategory(item) {
  const value = String(getValue(item, ['category', 'kategori', 'product_category', 'jenis'], '')).toLowerCase();
  if (value.includes('buah') || value.includes('fruit')) return 'Buah';
  if (value.includes('sayur') || value.includes('vegetable')) return 'Sayur';
  if (value.includes('pokok') || value.includes('makanan') || value.includes('main')) return 'Makanan Pokok';
  return 'Makanan Pokok';
}

function MenuCard({ item }) {
  const name = getValue(item, ['name', 'product_name', 'nama_menu', 'nama', 'title'], 'Menu MBG');
  const image = getValue(item, ['image_url', 'image', 'foto', 'photo_url'], '');
  const description = getValue(item, ['description', 'deskripsi', 'detail'], 'Menu bergizi dengan bahan pilihan untuk mendukung kebutuhan gizi harian.');
  const calories = getValue(item, ['calories', 'kalori', 'energy'], null);
  const protein = getValue(item, ['protein', 'protein_gram'], null);
  const weight = getValue(item, ['weight', 'berat', 'gram'], null);
  const category = getCategory(item);

  return (
    <article className="menu-card">
      <div className="menu-card-image">
        {image ? <img src={image} alt={name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <div className="image-placeholder"><Utensils size={34} /></div>}
        <span className="category-tag">{category}</span>
        {(item.is_popular || item.popular || item.is_favorite) && <span className="popular-tag">POPULER</span>}
        {calories !== null && <span className="calorie-tag">♨ {calories} kkal</span>}
      </div>
      <div className="menu-card-body">
        <h3>{name}</h3>
        <p className="menu-description">{description}</p>
        <div className="menu-card-bottom">
          <span>{protein !== null ? `Protein: ${protein}g` : 'Menu bergizi'}</span>
          <span>{weight !== null ? `Berat: ${weight}g` : 'MBG'}</span>
          <button type="button" className="detail-link" onClick={() => window.alert(`${name}\n\n${description}`)}>Detail <ChevronRight size={13} /></button>
        </div>
      </div>
    </article>
  );
}

function MenuSkeleton() {
  return <div className="menu-grid" aria-label="Memuat menu">{Array.from({ length: 6 }).map((_, i) => <div className="skeleton-card" key={i}><div className="skeleton-image" /><div className="skeleton-line wide" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>;
}

export default function MenuCatalog() {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadMenus() {
    setLoading(true);
    setError('');
    try {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.');
      const { data, error: queryError } = await supabase.from('products').select('*');
      if (queryError) throw queryError;
      setMenus(data || []);
    } catch (err) {
      setError(err.message || 'Menu gagal dimuat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function initLoad() {
      try {
        if (!supabase) {
          setError('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.');
          return;
        }
        const { data, error: queryError } = await supabase.from('products').select('*');
        if (queryError) throw queryError;
        if (!ignore) {
          setMenus(data || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Menu gagal dimuat. Silakan coba lagi.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    initLoad();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredMenus = useMemo(() => menus.filter((item) => {
    const name = String(getValue(item, ['name', 'product_name', 'nama_menu', 'nama', 'title'], '')).toLowerCase();
    const description = String(getValue(item, ['description', 'deskripsi'], '')).toLowerCase();
    const matchSearch = `${name} ${description}`.includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || getCategory(item) === category;
    return matchSearch && matchCategory;
  }), [menus, search, category]);

  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/" className="brand"><span className="brand-icon"><Utensils size={20} /></span><span><strong>SPPG<span>Indonesia</span></strong><small>PROGRAM MAKAN BERGIZI GRATIS</small></span></Link>
        <nav className="public-nav"><Link to="/"><Home size={15} /> Beranda</Link><Link className="active" to="/menu"><Utensils size={15} /> Katalog Menu</Link></nav>
        <Link to="/" className="back-home"><Home size={14} /> Kembali ke Beranda</Link>
      </header>

      <section className="catalog-intro">
        <div className="eyebrow"><Leaf size={13} /> KATALOG PANGAN BERGIZI</div>
        <h1>Katalog Menu MBG</h1>
        <p>Jelajahi daftar makanan pokok bergizi, olahan sayuran kaya serat, dan buah-buahan segar<br className="desktop-break" /> berstandar gizi nasional untuk program Makan Bergizi Gratis.</p>
        <button className="simulate-button" onClick={loadMenus} type="button"><RotateCw size={13} /> Simulasi Loading</button>
      </section>

      <main className="catalog-main">
        <section className="filter-panel">
          <label className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari menu makanan, sayur, buah, atau bahan baku..." /></label>
          <div className="category-filter"><span>KATEGORI:</span>{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={category === item ? 'selected' : ''}>{item}</button>)}</div>
          {!loading && !error && <small className="result-count">Menampilkan {filteredMenus.length} menu</small>}
        </section>

        {loading ? <MenuSkeleton /> : error ? <div className="catalog-message error-message"><strong>Menu belum dapat ditampilkan</strong><p>{error}</p><button type="button" onClick={loadMenus}>Coba Lagi</button></div> : filteredMenus.length === 0 ? <div className="catalog-message"><Apple size={28} /><strong>Menu tidak ditemukan</strong><p>{menus.length === 0 ? 'Belum ada data menu yang tersedia.' : 'Coba gunakan kata kunci lain atau pilih kategori Semua.'}</p><button type="button" onClick={() => { setSearch(''); setCategory('Semua'); }}>Reset Pencarian</button></div> : <div className="menu-grid">{filteredMenus.map((item, index) => <MenuCard key={item.id ?? index} item={item} />)}</div>}
      </main>

      <PublicFooter />
    </div>
  );
}

export function PublicFooter() {
  return <footer className="public-footer"><div className="footer-grid"><div><div className="footer-brand"><span className="brand-icon"><Utensils size={19} /></span><strong>SPPG<span>Indonesia</span></strong></div><p>Platform layanan dapur dan katalog resmi Program Makan Bergizi Gratis (MBG). Memastikan setiap hidangan anak bangsa terpenuhi nilai gizi, halal, dan 100% higienis.</p><small>Cepat · Rapi · Terstandarisasi</small></div><div><h4>NAVIGASI HALAMAN</h4><Link to="/">Beranda</Link><Link to="/menu">Katalog Menu Lengkap</Link><Link to="/menu">Profil Dapur Gizi MBG</Link><Link to="/menu">Menu Terpopuler</Link></div><div><h4>STANDAR LAYANAN MBG</h4><p>Pedoman Gizi Seimbang & AKG Nasional</p><p>Distribusi Masak Segar Harian</p><p>Kemitraan Petani, Peternak, dan UMKM Lokal</p></div><div><h4>SATUAN PELAYANAN DAPUR</h4><p>Sentra Dapur Gizi Nasional SPPG Indonesia</p><p>Melayani koordinasi distribusi makanan bergizi bagi sekolah dasar, madrasah, dan penerima manfaat Program MBG.</p></div></div><div className="footer-bottom"><span>© 2025 - 2026 SPPGIndonesia. Program Makan Bergizi Gratis.</span><span>Pedoman Kebijakan Gizi · Standar Higienitas · Transparansi Publik</span></div></footer>;
}
