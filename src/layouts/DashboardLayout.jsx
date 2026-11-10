import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-base font-bold text-slate-800">Dashboard Operasional</h1>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            Dapur Pusat MBG #1
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}