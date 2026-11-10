import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import StoreLayout from './layouts/StoreLayout';
import Overview from './pages/dashboard/Overview';
import Transactions from './pages/dashboard/Transactions';
import MenuDetail from './pages/store/MenuDetail';
import Checkout from './pages/store/Checkout';

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
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route element={<StoreLayout />}>
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<Placeholder title="Katalog Menu" />} />
          <Route path="menu/:id" element={<MenuDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="*" element={<Placeholder title="Halaman tidak ditemukan" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
