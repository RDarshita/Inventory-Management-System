import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const Inventory = () => {
  const data = [
    { id: 'SKU-001', product: 'Corrugated Box XL', category: 'Boxes', stock: 1200, minStock: 500, warehouse: 'Main Hub', lastUpdated: 'Today, 10:30 AM' },
    { id: 'SKU-002', product: 'Bubble Wrap 50m', category: 'Wraps', stock: 45, minStock: 100, warehouse: 'Main Hub', lastUpdated: 'Today, 11:15 AM' },
    { id: 'SKU-003', product: 'Fragile Label Roll', category: 'Labels', stock: 0, minStock: 50, warehouse: 'Main Hub', lastUpdated: 'Yesterday, 4:20 PM' },
    { id: 'SKU-004', product: 'Packing Tape Clear', category: 'Tapes', stock: 350, minStock: 200, warehouse: 'Warehouse B', lastUpdated: '15 Jul, 09:00 AM' },
  ];

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'Good';
  };

  const columns = [
    { header: 'Product & SKU', render: (row) => (
      <div>
        <p className="font-bold text-white">{row.product}</p>
        <p className="text-xs text-textMuted mt-1">{row.id} | {row.category}</p>
      </div>
    ) },
    { header: 'Current Stock', render: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-white text-lg">{row.stock}</span>
        {row.stock <= row.minStock && row.stock > 0 && <AlertTriangle size={14} className="text-orange-500" />}
        {row.stock === 0 && <AlertTriangle size={14} className="text-danger" />}
      </div>
    ) },
    { header: 'Min Stock', render: (row) => <span className="text-textMuted">{row.minStock}</span> },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Status', render: (row) => <StatusBadge status={getStockStatus(row.stock, row.minStock)} /> },
    { header: 'Last Updated', render: (row) => <span className="text-sm text-textMuted">{row.lastUpdated}</span> },
  ];

  const TableActions = (
    <div className="flex gap-2">
      <button className="bg-surface border border-border hover:bg-white/5 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
        <RefreshCw size={16} />
        Sync Stock
      </button>
      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory Stock</h2>
          <p className="text-sm text-textMuted mt-1">Real-time tracking of product levels across warehouses.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search inventory by product, SKU..."
        actions={TableActions}
      />
    </div>
  );
};

export default Inventory;
