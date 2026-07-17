import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import DataTable from '../components/ui/DataTable';

const Suppliers = () => {
  const data = [
    { id: 1, name: 'Packaging Co.', contact: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@packagingco.in', location: 'Mumbai, MH', gst: '27AABCP1234D1Z5', products: 'Boxes, Tapes', status: 'Active' },
    { id: 2, name: 'SafePack Ltd.', contact: 'Amit Patel', phone: '+91 98765 11111', email: 'amit@safepack.com', location: 'Ahmedabad, GJ', gst: '24BBCCP5566E2Z1', products: 'Bubble Wraps', status: 'Active' },
    { id: 3, name: 'PrintFast Labels', contact: 'Neha Gupta', phone: '+91 91234 56789', email: 'sales@printfast.in', location: 'Delhi, DL', gst: '07AAECP9999F1Z3', products: 'Labels, Stickers', status: 'Inactive' },
  ];

  const columns = [
    { header: 'Supplier Info', render: (row) => (
      <div>
        <p className="font-bold text-white">{row.name}</p>
        <p className="text-xs text-textMuted mt-1">GST: <span className="font-mono text-white/80">{row.gst}</span></p>
      </div>
    ) },
    { header: 'Contact Person', render: (row) => (
      <div>
        <p className="font-medium text-white">{row.contact}</p>
        <div className="flex flex-col gap-1 mt-1 text-xs text-textMuted">
          <span className="flex items-center gap-1"><Phone size={12}/> {row.phone}</span>
          <span className="flex items-center gap-1"><Mail size={12}/> {row.email}</span>
        </div>
      </div>
    ) },
    { header: 'Location', render: (row) => (
      <span className="flex items-center gap-1 text-sm text-text"><MapPin size={14} className="text-primary"/> {row.location}</span>
    ) },
    { header: 'Products Supplied', accessor: 'products' },
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
      Add Supplier
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Suppliers</h2>
          <p className="text-sm text-textMuted mt-1">Manage your vendors and supply chain contacts.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search suppliers by name, GST, contact..."
        actions={TableActions}
      />
    </div>
  );
};

export default Suppliers;
