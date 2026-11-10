import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';  
import Transactions from './pages/dashboard/Transactions'

function App() {
  return (
    <Router>
      <Routes>
    <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} /> 
          <Route path="transactions" element={<Transactions />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
