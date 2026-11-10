import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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


function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuCatalog />} />
          <Route element={<StoreLayout />}>
            <Route path="menu/:id" element={<MenuDetail />} />
            <Route path="checkout" element={<Checkout />} />
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