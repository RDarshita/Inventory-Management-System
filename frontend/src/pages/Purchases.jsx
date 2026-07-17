import { useState } from 'react';
import { Plus, Eye, Download, Search } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';

const Purchases = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = [
    { id: 'PO-2026-045', supplier: 'Packaging Co.', product: 'Corrugated Box XL', qty: 500, price: '₹45.00', total: '₹22,500', date: '15 Jul 2026', status: 'Completed' },
    { id: 'PO-2026-046', supplier: 'SafePack Ltd.', product: 'Bubble Wrap 50m', qty: 100, price: '₹350.00', total: '₹35,000', date: '16 Jul 2026', status: 'Pending' },
  ];

  const columns = [
    { header: 'Invoice #', render: (row) => <span className="font-mono text-primary font-medium">{row.id}</span> },
    { header: 'Supplier / Date', render: (row) => (
      <div>
        <p className="font-medium text-white">{row.supplier}</p>
        <p className="text-xs text-textMuted mt-1">{row.date}</p>
      </div>
    ) },
    { header: 'Product & Qty', render: (row) => (
      <div>
        <p className="text-white text-sm">{row.product}</p>
        <p className="text-xs text-textMuted mt-1">Qty: {row.qty} @ {row.price}</p>
      </div>
    ) },
    { header: 'Total Amount', render: (row) => <span className="font-bold text-white">{row.total}</span> },
    { header: 'Payment Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', align: 'right', render: () => (
      <div className="flex items-center justify-end gap-2">
        <button className="p-1.5 text-textMuted hover:text-white transition-colors" title="View Details"><Eye size={16} /></button>
        <button className="p-1.5 text-textMuted hover:text-primary transition-colors" title="Download Invoice"><Download size={16} /></button>
      </div>
    ) },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Purchase entry saved successfully!');
      setLoading(false);
      setShowForm(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Purchases</h2>
          <p className="text-sm text-textMuted mt-1">Manage incoming stock and supplier invoices.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            New Purchase Entry
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Purchase Entry Form</h3>
            <button onClick={() => setShowForm(false)} className="text-textMuted hover:text-white text-sm">Cancel</button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Supplier *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                  <option value="">Select Supplier</option>
                  <option value="1">Packaging Co.</option>
                  <option value="2">SafePack Ltd.</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Product *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                  <option value="">Select Product</option>
                  <option value="1">Corrugated Box XL</option>
                  <option value="2">Bubble Wrap 50m</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Invoice Number *</label>
                <input required type="text" placeholder="INV-0000" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Quantity *</label>
                <input required type="number" min="1" placeholder="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Purchase Price (₹) *</label>
                <input required type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Purchase Date *</label>
                <input required type="date" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Payment Status *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Save Purchase Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Purchase History</h3>
        <DataTable 
          columns={columns} 
          data={data} 
          searchPlaceholder="Search by invoice #, supplier..."
        />
      </div>
    </div>
  );
};

export default Purchases;
