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
  return <></>;
}
