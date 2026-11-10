import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Heart, Utensils, Users,
  Clock3, Handshake, Award, CheckCircle2, Soup
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { PublicFooter } from './MenuCatalog';
import './public.css';

const heroImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1100&auto=format&fit=crop&q=85';

function getMenuName(item) {
  return item.name || item.product_name || item.nama_menu || item.nama || 'Menu MBG';
}

export default function Home() {
  const [popularMenus, setPopularMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopularMenus() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase.from('products').select('*').limit(8);
        if (error) throw error;
        const rows = data || [];
        const popular = rows.filter((item) => item.is_popular || item.popular || item.is_favorite);
        setPopularMenus((popular.length ? popular : rows).slice(0, 4));
      } catch (error) {
        console.error('Gagal mengambil menu populer:', error.message);
      } finally {
        setLoading(false);
      }
    }
    loadPopularMenus();
  }, []);

  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/" className="brand">
          <span className="brand-icon"><Utensils size={20} /></span>
          <span><strong>SPPG<span>Indonesia</span></strong><small>PROGRAM MAKAN BERGIZI GRATIS</small></span>
        </Link>
        <nav className="public-nav">
          <Link className="active" to="/">Beranda</Link>
          <Link to="/menu">Katalog Menu</Link>
        </nav>
        <Link to="/menu" className="back-home">Lihat Katalog Menu <ArrowRight size={14} /></Link>
      </header>

      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><Heart size={13} /> PROGRAM STRATEGIS NASIONAL PEMENUHAN NUTRISI ANAK BANGSA</div>
            <h1>Satu Komitmen untuk Makan Bergizi Gratis Berkualitas</h1>
            <p>Menghadirkan sajian pangan bergizi seimbang, higienis, dan tersertifikasi dari Satuan Pelayanan Pemenuhan Gizi untuk menyongsong Generasi Emas Indonesia yang sehat dan cerdas.</p>
            <div className="hero-actions">
              <Link to="/menu" className="primary-button"><Utensils size={15} /> Lihat Katalog Menu <ArrowRight size={15} /></Link>
              <a href="#profil-dapur" className="secondary-button">Profil Dapur Gizi</a>
            </div>
            <div className="hero-trust"><span>Sehat & Lezat</span><b>•</b><span>100% Higienis</span><b>•</b><span>Tepat Waktu</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo"><img src={heroImage} alt="Contoh sajian makanan bergizi seimbang" /></div>
            <div className="hero-photo-caption"><span className="caption-icon"><ShieldCheck size={18} /></span><div><strong>Standar Gizi BGN Terpenuhi</strong><small>Menu bergizi, higienis, dan aman dikonsumsi</small></div><span className="caption-status">HIGIENIS</span></div>
          </div>
          <div className="hero-benefits">
            <article><span className="benefit-icon gold"><ShieldCheck /></span><h3>100% Higienis & Halal</h3><p>Standarisasi proses masak dan distribusi makanan yang berkualitas.</p></article>
            <article><span className="benefit-icon cyan"><Utensils /></span><h3>Gizi Terukur Sesuai AKG</h3><p>Porsi, protein, vitamin, dan mineral dirancang untuk anak dan pelajar.</p></article>
            <article><span className="benefit-icon orange"><Handshake /></span><h3>Bahan Segar Petani Lokal</h3><p>Menyerap hasil panen petani, peternak, dan produsen UMKM lokal.</p></article>
            <article><span className="benefit-icon blue"><Clock3 /></span><h3>Distribusi Tepat Waktu</h3><p>Makanan tiba di sekolah dalam kondisi segar sesuai jadwal.</p></article>
          </div>
        </section>

        <section className="profile-section home-profile" id="profil-dapur">
          <div className="section-heading">
            <div className="eyebrow">SATUAN PELAYANAN DAPUR MBG (SPPG)</div>
            <h2>Pelayanan Gizi Terstandarisasi & Profesional</h2>
            <p>Dapur MBG beroperasi layaknya fasilitas produksi pangan modern dengan protokol sanitasi ketat, jalur masak terlatih, dan formulasi menu berbasis sains nutrisi.</p>
          </div>
          <div className="profile-cards">
            <article><span className="profile-icon purple"><ShieldCheck /></span><h3>Sanitasi & Higienitas Dapur</h3><p>Setiap sudut dapur menerapkan zonasi ketat demi bahan mentah, pengolahan, pemorsian, dan sterilisasi wadah stainless untuk menjaga keamanan siswa.</p><small><CheckCircle2 size={12} /> SOP & Standar Kebersihan Harian</small></article>
            <article><span className="profile-icon yellow"><Award /></span><h3>Formulasi Ahli Gizi BGN</h3><p>Menu dikurasi langsung oleh tenaga nutrisionis bersertifikat untuk memenuhi kebutuhan gizi harian anak Indonesia.</p><small><CheckCircle2 size={12} /> Rotasi Menu Beragam Setiap Hari</small></article>
            <article><span className="profile-icon green"><Users /></span><h3>Kemitraan Petani Lokal</h3><p>Mendorong perputaran ekonomi masyarakat dengan memberdayakan bahan pangan segar harian langsung dari kelompok tani dan koperasi setempat.</p><small><CheckCircle2 size={12} /> Rantai Pasok Cepat & Bahan Segar</small></article>
          </div>

          <div className="nutrition-panel">
            <div className="nutrition-heading"><div><div className="eyebrow">PEDOMAN GIZI SEIMBANG</div><h2>Standar Komposisi "Isi Piringku MBG"</h2><p>Setiap porsi makanan yang disajikan memenuhi kebutuhan proporsional gizi seimbang.</p></div><span className="nutrition-label">Pedoman Gizi Seimbang</span></div>
            <div className="nutrition-content">
              <div className="nutrition-plate"><div className="plate-symbol"><Soup size={25} /></div><strong>Makanan Pokok (35% Piring)</strong><p>Nasi putih, kentang, ubi, atau jagung sebagai sumber energi utama untuk aktivitas harian.</p></div>
              <div className="nutrition-rules"><strong>STANDAR PENGOLAHAN & PENGAWASAN DI DAPUR:</strong><p><CheckCircle2 /> Bahan organik berkualitas dengan proses cuci higienis 3 tahap</p><p><CheckCircle2 /> Kadar glukosa seimbang untuk konsentrasi belajar stabil</p><p><CheckCircle2 /> Porsi kalori dihitung cermat oleh nutrisionis tersertifikat</p></div>
            </div>
          </div>
        </section>

        <section className="popular-section home-popular">
          <div className="section-title-row"><div><div className="eyebrow">PILIHAN FAVORIT SISWA</div><h2>Menu Terpopuler Pekan Ini</h2><p>Sajian lezat dengan tingkat penerimaan siswa terbaik, kaya makro dan mikro untuk energi belajar penuh semangat.</p></div><Link to="/menu" className="text-link">Buka Katalog Lengkap <ArrowRight size={15} /></Link></div>
          {loading ? <div className="menu-grid">{[1, 2, 3, 4].map((n) => <div className="skeleton-card" key={n}><div className="skeleton-image" /><div className="skeleton-line wide" /><div className="skeleton-line" /></div>)}</div> : popularMenus.length ? <div className="menu-grid home-menu-grid">{popularMenus.map((item, index) => <article className="menu-card" key={item.id ?? index}><div className="menu-card-image">{item.image_url || item.image ? <img src={item.image_url || item.image} alt={getMenuName(item)} loading="lazy" /> : <div className="image-placeholder"><Utensils size={34} /></div>}<span className="category-tag">{item.category || item.kategori || 'Menu MBG'}</span></div><div className="menu-card-body"><h3>{getMenuName(item)}</h3><p className="menu-description">{item.description || item.deskripsi || 'Pilihan hidangan bergizi untuk mendukung kebutuhan gizi harian.'}</p><div className="menu-card-bottom"><span>Menu bergizi</span><Link to="/menu" className="detail-link">Detail <ArrowRight size={13} /></Link></div></div></article>)}</div> : <div className="empty-popular">Menu terpopuler akan ditampilkan setelah data tersedia. <Link to="/menu">Lihat katalog menu</Link></div>}
        </section>

        <section className="home-cta"><div><h2>Ingin Mengetahui Seluruh Pilihan Menu Dapur?</h2><p>Cari dan filter menu pilihanmu, mulai dari makanan pokok, sayuran hijau, dan buah-buahan segar.</p></div><Link to="/menu" className="primary-button">Jelajahi Katalog Menu <ArrowRight size={15} /></Link></section>
      </main>
      <PublicFooter />
    </div>
  );
}
