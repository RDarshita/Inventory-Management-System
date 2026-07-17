import { useState } from 'react';
import { Plus, Eye, Download } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';

const Sales = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = [
    { id: 'INV-2026-1001', customer: 'ABC Corp', product: 'Corrugated Box XL', qty: 200, discount: '5%', tax: '18%', total: '₹14,500', date: '16 Jul 2026', status: 'Paid' },
    { id: 'INV-2026-1002', customer: 'XYZ Logistics', product: 'Bubble Wrap 50m', qty: 15, discount: '0%', tax: '18%', total: '₹7,965', date: '17 Jul 2026', status: 'Pending' },
  ];

  const columns = [
    { header: 'Invoice #', render: (row) => <span className="font-mono text-primary font-medium">{row.id}</span> },
    { header: 'Customer / Date', render: (row) => (
      <div>
        <p className="font-medium text-white">{row.customer}</p>
        <p className="text-xs text-textMuted mt-1">{row.date}</p>
      </div>
    ) },
    { header: 'Product & Qty', render: (row) => (
      <div>
        <p className="text-white text-sm">{row.product}</p>
        <p className="text-xs text-textMuted mt-1">Qty: {row.qty}</p>
      </div>
    ) },
    { header: 'Amount Details', render: (row) => (
      <div>
        <p className="font-bold text-white">{row.total}</p>
        <p className="text-xs text-textMuted mt-1">Tax: {row.tax} | Disc: {row.discount}</p>
      </div>
    ) },
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
      toast.success('Sales invoice generated successfully!');
      setLoading(false);
      setShowForm(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales</h2>
          <p className="text-sm text-textMuted mt-1">Manage outbound sales and generate customer invoices.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            Generate New Invoice
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Sales Entry Form</h3>
            <button onClick={() => setShowForm(false)} className="text-textMuted hover:text-white text-sm">Cancel</button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Customer *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                  <option value="">Select Customer</option>
                  <option value="1">ABC Corp</option>
                  <option value="2">XYZ Logistics</option>
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
                <label className="text-sm font-medium text-white">Quantity *</label>
                <input required type="number" min="1" placeholder="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Discount (%)</label>
                <input type="number" step="0.01" min="0" max="100" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Tax (%) *</label>
                <input required type="number" step="0.01" min="0" max="100" placeholder="18.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Payment Method *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit Card</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Generate Invoice'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Sales History</h3>
        <DataTable 
          columns={columns} 
          data={data} 
          searchPlaceholder="Search by invoice #, customer..."
        />
      </div>
    </div>
  );
};

export default Sales;
