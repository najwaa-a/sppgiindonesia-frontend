import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, ShoppingCart, PackagePlus, ArrowLeft } from 'lucide-react';

export default function DashboardSidebar() {
  const menuItems = [
    { to: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, end: true },
    { to: "/dashboard/transactions", label: "Riwayat Transaksi", icon: Receipt },
    { to: "/dashboard/pos", label: "Kasir POS", icon: ShoppingCart },
    { to: "/dashboard/products", label: "Kelola Menu", icon: PackagePlus },
  ];

  return (
    <aside aria-label="Sidebar Admin" className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 flex-shrink-0 min-h-screen">
      <div className="space-y-6">
        <div className="px-2 py-2">
          <h2 className="text-white font-extrabold text-lg tracking-wider">POS MBG PANEL</h2>
          <p className="text-[10px] text-slate-400">Dashboard Manajemen Kasir</p>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <Link to="/" className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white p-2.5 rounded-xl hover:bg-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Toko</span>
      </Link>
    </aside>
  );
}