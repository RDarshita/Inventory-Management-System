import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import incomingService from '../api/incomingService';
import IncomingStatsCards from '../components/IncomingStatsCards';
import AddPaymentForm from '../components/AddPaymentForm';
import IncomingTable from '../components/IncomingTable';
import toast from 'react-hot-toast';

const IncomingPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track if we are editing an existing payment
  const [editingPayment, setEditingPayment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsData, statsData] = await Promise.all([
        incomingService.getAllPayments(),
        incomingService.getStats()
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load incoming payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleSaveSuccess = () => {
    handleCloseForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    try {
      await incomingService.deletePayment(id);
      toast.success('Payment deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete payment');
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded-lg w-64 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl"></div>)}
          </div>
          <div className="h-64 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6 pb-24 md:pb-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-1">
        <button onClick={() => navigate('/')} className="text-xs text-textMuted hover:text-white transition-colors flex items-center gap-1 self-start mb-2">
          ← Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Incoming Payments</h2>
            <p className="text-sm text-textMuted mt-1">Payments received from parties.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20"
            >
              + Add Payment
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <IncomingStatsCards stats={stats} />

      {/* Inline Add/Edit Form */}
      {showForm && (
        <AddPaymentForm 
          onClose={handleCloseForm} 
          onSave={handleSaveSuccess}
          initialData={editingPayment}
        />
      )}

      {/* Main Content Layout */}
      <div className="space-y-6">
        <IncomingTable 
          payments={payments} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default IncomingPage;
