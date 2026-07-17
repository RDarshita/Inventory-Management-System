import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/ui/DataTable';

const Categories = () => {
  const data = [
    { id: 1, name: 'Boxes', description: 'All types of corrugated and shipping boxes', productsCount: 45, date: '12 Jan 2023' },
    { id: 2, name: 'Tapes', description: 'Packing tapes, masking tapes, fragile tapes', productsCount: 12, date: '15 Jan 2023' },
    { id: 3, name: 'Wraps', description: 'Bubble wraps, stretch films, shrink wraps', productsCount: 28, date: '20 Jan 2023' },
    { id: 4, name: 'Labels', description: 'Shipping labels, fragile stickers', productsCount: 8, date: '05 Feb 2023' },
  ];

  const columns = [
    { header: 'Category Name', render: (row) => <span className="font-medium text-white">{row.name}</span> },
    { header: 'Description', accessor: 'description' },
    { header: 'No of Products', render: (row) => <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium text-white border border-border">{row.productsCount} items</span> },
    { header: 'Created Date', accessor: 'date' },
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
      Add Category
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <p className="text-sm text-textMuted mt-1">Manage product categories to keep inventory organized.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search categories..."
        actions={TableActions}
      />
    </div>
  );
};

export default Categories;
