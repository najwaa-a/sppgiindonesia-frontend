import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, ShoppingCart, PackagePlus, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function DashboardSidebar({ isOpen = true }) {
  const menuItems = [
    { to: "/dashboard", label: "Dashboard (Beranda)", icon: LayoutDashboard, end: true },
    { to: "/dashboard/transactions", label: "Semua Penjualan", icon: Receipt },
    { to: "/dashboard/pos", label: "Kasir POS Cepat", icon: ShoppingCart },
    { to: "/dashboard/products", label: "Daftar Menu MBG", icon: PackagePlus },
  ];

  if (!isOpen) {
    return (
      <aside aria-label="Sidebar Admin Ringkas" className="w-16 bg-[#222d32] text-[#b8c7ce] flex flex-col justify-between py-4 flex-shrink-0 min-h-[calc(100vh-50px)] select-none transition-all duration-300">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#1a2226] flex items-center justify-center text-white text-xs font-bold border border-slate-700">
              N
            </div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#1e282c] text-white border-l-4 border-[#3c8dbc]"
                      : "text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex justify-center border-t border-[#1a2226] pt-3">
          <Link
            to="/"
            title="Kembali ke Toko Depan"
            className="p-2 text-[#b8c7ce] hover:text-white hover:bg-[#1e282c] rounded transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Sidebar Admin Lengkap" className="w-64 bg-[#222d32] text-[#b8c7ce] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-50px)] select-none transition-all duration-300 shadow-md">
      <div>
        <div className="p-4 bg-[#1a2226] flex items-center space-x-3 border-b border-[#141a1d]">
          <div className="w-10 h-10 rounded-full bg-[#2c3b41] flex items-center justify-center text-white font-bold text-sm border-2 border-[#3c8dbc] shadow-xs">
            N
          </div>
          <div className="leading-tight">
            <h4 className="text-white text-xs font-bold">Najwa</h4>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-slate-300">Online â€¢ Admin</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#4b646f] bg-[#1a2226]/50">
          NAVIGASI UTAMA
        </div>

        <nav className="mt-1 space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#1e282c] text-white border-l-4 border-[#3c8dbc]"
                    : "text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white"
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-[#1a2226] space-y-2">
        <div className="px-2 py-1.5 bg-[#1a2226] rounded text-[11px] text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Dapur Pusat MBG #1</span>
        </div>
        <Link
          to="/"
          className="flex items-center space-x-2 w-full text-xs text-[#b8c7ce] hover:text-white p-2 rounded hover:bg-[#1e282c] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Toko Depan</span>
        </Link>
      </div>
    </aside>
  );
}