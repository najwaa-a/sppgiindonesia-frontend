import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorAlert from '../../components/ErrorAlert';
import { Search } from 'lucide-react';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar transaksi');
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter(t => {
    const matchStatus = filterStatus === 'all' || t.payment_status === filterStatus;
    const matchSearch = (t.invoice_no || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return <LoadingSkeleton message="Memuat seluruh data transaksi penjualan..." />;
  if (error) return <ErrorAlert message={error} onRetry={loadTransactions} />;

  return (
    <section className="space-y-6">
     
    </section>
  );

}