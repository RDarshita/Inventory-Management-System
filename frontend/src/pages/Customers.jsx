import { Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const Customers = () => {
  const data = [
    { id: 1, name: 'ABC Corp', contact: 'Priya Singh', phone: '+91 99999 88888', email: 'purchase@abccorp.in', totalPurchases: '₹1,25,000', lastPurchase: '12 Jul 2026', status: 'Active' },
    { id: 2, name: 'XYZ Logistics', contact: 'Ramesh Rao', phone: '+91 88888 77777', email: 'ramesh@xyzlogistics.com', totalPurchases: '₹45,500', lastPurchase: '05 Jul 2026', status: 'Active' },
    { id: 3, name: 'Global Exports', contact: 'Anita Desai', phone: '+91 77777 66666', email: 'info@globalexports.in', totalPurchases: '₹3,50,000', lastPurchase: '16 Jun 2026', status: 'Inactive' },
  ];

  const columns = [
    { header: 'Customer Info', render: (row) => (
      <div>
        <p className="font-bold text-white">{row.name}</p>
        <p className="text-xs text-textMuted mt-1">{row.contact}</p>
      </div>
    ) },
    { header: 'Contact', render: (row) => (
      <div className="flex flex-col gap-1 text-xs text-textMuted">
        <span className="flex items-center gap-1"><Phone size={12}/> {row.phone}</span>
        <span className="flex items-center gap-1"><Mail size={12}/> {row.email}</span>
      </div>
    ) },
    { header: 'Total Purchases', render: (row) => <span className="font-medium text-white">{row.totalPurchases}</span> },
    { header: 'Last Purchase', render: (row) => (
      <span className="flex items-center gap-1 text-sm text-text"><Calendar size={14} className="text-primary"/> {row.lastPurchase}</span>
    ) },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', align: 'right', render: () => (
      <div className="flex items-center justify-end gap-2">
        <button className="p-1.5 text-textMuted hover:text-primary transition-colors" title="Edit"><Edit size={16} /></button>
        <button className="p-1.5 text-textMuted hover:text-danger transition-colors" title="Delete"><Trash2 size={16} /></button>
      </div>
    ) },
  ];

  const TableActions = (
    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
      <Plus size={16} />
      Add Customer
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Customers</h2>
          <p className="text-sm text-textMuted mt-1">Manage your clients and view their purchase history.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search customers by name, phone, email..."
        actions={TableActions}
      />
    </div>
  );
};

export default Customers;
