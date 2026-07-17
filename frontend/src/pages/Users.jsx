import { Plus, Edit, Trash2, Shield, User } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const Users = () => {
  const data = [
    { id: 1, name: 'Admin User', email: 'admin@packerstech.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Manager One', email: 'manager@packerstech.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Sales Rep', email: 'sales@packerstech.com', role: 'Employee', status: 'Active' },
    { id: 4, name: 'Former Employee', email: 'old@packerstech.com', role: 'Employee', status: 'Inactive' },
  ];

  const columns = [
    { header: 'User Info', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textMuted">
          <User size={20} />
        </div>
        <div>
          <p className="font-bold text-white">{row.name}</p>
          <p className="text-xs text-textMuted mt-1">{row.email}</p>
        </div>
      </div>
    ) },
    { header: 'Role & Permissions', render: (row) => (
      <div className="flex items-center gap-2">
        {row.role === 'Admin' && <Shield size={14} className="text-primary" />}
        <span className={row.role === 'Admin' ? 'text-primary font-medium' : 'text-white'}>{row.role}</span>
      </div>
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
      Add New User
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-sm text-textMuted mt-1">Manage system access, roles, and employee accounts.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Search users..."
        actions={TableActions}
      />
    </div>
  );
};

export default Users;
