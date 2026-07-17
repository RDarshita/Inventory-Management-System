import { useState } from 'react';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();

  // Dummy Data
  const data = [
    { id: 1, image: '📦', name: 'Corrugated Box XL', sku: 'BOX-XL-01', category: 'Boxes', supplier: 'Packaging Co.', cost: 45, price: 65, qty: 1200, status: 'Good' },
    { id: 2, image: '🗞️', name: 'Bubble Wrap 50m', sku: 'BUB-50M-02', category: 'Wraps', supplier: 'SafePack Ltd.', cost: 350, price: 450, qty: 45, status: 'Low Stock' },
    { id: 3, image: '🏷️', name: 'Fragile Label Roll', sku: 'LBL-FRG-03', category: 'Labels', supplier: 'PrintFast', cost: 120, price: 180, qty: 0, status: 'Out of Stock' },
    { id: 4, image: '🎗️', name: 'Packing Tape Clear', sku: 'TPE-CLR-04', category: 'Tapes', supplier: 'Packaging Co.', cost: 25, price: 40, qty: 350, status: 'Good' },
  ];

  const columns = [
    { header: 'Product', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">{row.image}</div>
        <div>
          <p className="font-medium text-white">{row.name}</p>
          <p className="text-xs text-textMuted">{row.sku}</p>
        </div>
      </div>
    ) },
    { header: 'Category', accessor: 'category' },
    { header: 'Supplier', accessor: 'supplier' },
    { header: 'Cost / Price', render: (row) => (
      <div>
        <p className="text-white">₹{row.price}</p>
        <p className="text-xs text-textMuted">₹{row.cost}</p>
      </div>
    ) },
    { header: 'Stock', render: (row) => (
      <span className="font-medium text-white">{row.qty}</span>
    ) },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', align: 'right', render: () => (
      <div className="flex items-center justify-end gap-2">
        <button className="p-1.5 text-textMuted hover:text-white transition-colors" title="View"><Eye size={16} /></button>
        <button className="p-1.5 text-textMuted hover:text-primary transition-colors" title="Edit"><Edit size={16} /></button>
        <button className="p-1.5 text-textMuted hover:text-danger transition-colors" title="Delete"><Trash2 size={16} /></button>
      </div>
    ) },
  ];

  const TableActions = (
    <div className="flex gap-2">
      <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50">
        <option value="">All Categories</option>
        <option value="boxes">Boxes</option>
        <option value="wraps">Wraps</option>
      </select>
      <button 
        onClick={() => navigate('/products/add')}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
      >
        <Plus size={16} />
        Add Product
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="text-sm text-textMuted mt-1">Manage your product catalog and pricing.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search products by name, SKU..."
        actions={TableActions}
      />
    </div>
  );
};

export default Products;
