import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';  
import Transactions from './pages/dashboard/Transactions';
import Products from './pages/dashboard/Products';
import POS from './pages/dashboard/POS';
import { ToastProvider } from './components/common/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
