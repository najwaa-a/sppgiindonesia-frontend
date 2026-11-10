import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import StoreLayout from './layouts/StoreLayout';
import Overview from './pages/dashboard/Overview';  
import Transactions from './pages/dashboard/Transactions';
import MenuDetail from './pages/store/MenuDetail';
import Checkout from './pages/store/Checkout';
import Products from './pages/dashboard/Products';
import POS from './pages/dashboard/POS';
import Home from './pages/public/Home';
import MenuCatalog from './pages/public/MenuCatalog';
import { ToastProvider } from './components/common/Toast';

function Placeholder({ title }) {
  return (
    <section className="card empty">
      <h1>{title}</h1>
      <p className="sub">Halaman ini dikerjakan anggota kelompok lain.</p>
      <Link className="btn" to="/menu/1">Lihat contoh detail menu</Link>
    </section>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuCatalog />} />
          <Route element={<StoreLayout />}>
            <Route index element={<Navigate to="/menu" replace />} />
            <Route path="menu" element={<Placeholder title="Katalog Menu" />} />
            <Route path="menu/:id" element={<MenuDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="*" element={<Placeholder title="Halaman tidak ditemukan" />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} /> 
            <Route path="transactions" element={<Transactions />} />
            <Route path="products" element={<Products />} />
            <Route path="pos" element={<POS />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;