import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ErrorAlert from "../../components/ErrorAlert";

export default function Overview() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadDashboardData();
  }, []);
  async function loadDashboardData() {
    try {
        setLoading(true);
      setError(null);

      const { data: transData, error: transErr } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (transErr) throw transErr;
      const { count: productCount, error: prodErr } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (prodErr) throw prodErr;
      const income = (transData || []).reduce((acc, curr) => acc + parseFloat(curr.final_total || 0), 0);

      setStats({
        totalIncome: income,
        totalOrders: (transData || []).length,
        totalProducts: productCount || 0
      });
      setRecentOrders(transData || []);
     } catch (err) {
        setError(err.message || 'Gagal memuat data dashboard');
    } finally {
        setLoading(false);
    }
  }
  return <></>;
}
