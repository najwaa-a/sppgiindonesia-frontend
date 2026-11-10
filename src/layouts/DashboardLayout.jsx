import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { ShoppingCart, Home, Menu as MenuIcon } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const todayDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-slate-800 flex flex-col font-sans antialiased">
      <header className="h-[50px] bg-[#3c8dbc] text-white flex items-center justify-between sticky top-0 z-40 shadow-xs select-none">

        <div className={`h-[50px] bg-[#367fa9] flex items-center justify-center font-bold px-4 text-base tracking-wide flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          <Link to="/dashboard" className="flex items-center space-x-2 text-white">
            <span className="font-extrabold tracking-wider">{sidebarOpen ? 'POS MBG' : 'MBG'}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Sistem Online"></span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-between px-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#367fa9] rounded text-white transition focus:outline-none"
            title="Toggle Navigasi"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
            <Link
              to="/dashboard/pos"
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold px-3 py-1.5 rounded flex items-center space-x-1.5 shadow-xs transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">POS Kasir</span>
            </Link>

            <div className="hidden md:flex items-center text-white/90 font-medium px-2">
              <span>{todayDate}</span>
            </div>

            <Link
              to="/"
              className="hover:bg-[#367fa9] px-2.5 py-1.5 rounded flex items-center space-x-1.5 text-white/90 hover:text-white transition"
              title="Lihat Toko Depan"
            >
              <Home className="w-4 h-4" />
              <span className="hidden lg:inline">Halaman Depan</span>
            </Link>

            <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
              <div className="w-7 h-7 rounded-full bg-[#222d32] flex items-center justify-center text-white font-bold text-[11px] border border-white/30">
                N
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block font-semibold text-white">Najwa</span>
                <span className="block text-[10px] text-emerald-200">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 bg-[#ecf0f5]">
          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          <footer className="bg-white border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <strong>Copyright &copy; 2026 <a href="#" className="text-[#3c8dbc] hover:underline font-bold">POS MBG - Makan Bergizi Gratis</a>.</strong> All rights reserved.
            </div>
            <div className="text-slate-400">
              <b>Versi</b> 1.0.0 (PPW UTS)
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}