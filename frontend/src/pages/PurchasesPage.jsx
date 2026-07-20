import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import purchaseService from '../api/purchaseService';
import PurchaseStatsCards from '../components/PurchaseStatsCards';
import AddPurchaseForm from '../components/AddPurchaseForm';
import PurchasesTable from '../components/PurchasesTable';
import PurchaseItemReport from '../components/PurchaseItemReport';
import toast from 'react-hot-toast';

const PurchasesPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState(null);
  const [itemReport, setItemReport] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track if we are editing an existing purchase
  const [editingPurchase, setEditingPurchase] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [purchasesData, statsData, reportData] = await Promise.all([
        purchaseService.getAllPurchases(),
        purchaseService.getStats(),
        purchaseService.getItemReport()
      ]);
      setPurchases(purchasesData);
      setStats(statsData);
      setItemReport(reportData);
    } catch (error) {
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (purchase) => {
    setEditingPurchase(purchase);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  const handleSaveSuccess = () => {
    handleCloseForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase? This will cascade and delete its line items.')) return;
    try {
      await purchaseService.deletePurchase(id);
      toast.success('Purchase deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete purchase');
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
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 pb-24 md:pb-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/')} className="mt-1 p-2 rounded-lg bg-surface border border-border text-textMuted hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Purchases</h2>
            <p className="text-sm text-textMuted mt-1">All purchase vouchers, across every party.</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20 shrink-0 self-start"
          >
            <Plus size={16} />
            Add Purchase
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <PurchaseStatsCards stats={stats} />

      {/* Inline Add/Edit Form */}
      {showForm && (
        <AddPurchaseForm 
          onClose={handleCloseForm} 
          onSave={handleSaveSuccess}
          initialData={editingPurchase}
        />
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <PurchasesTable 
            purchases={purchases} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <PurchaseItemReport report={itemReport} />
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
