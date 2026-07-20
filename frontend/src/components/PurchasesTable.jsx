import { Edit2, Trash2, Calendar, Hash } from 'lucide-react';

const PurchasesTable = ({ purchases, onEdit, onDelete }) => {
  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(v || 0);

  const getStatusPill = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Paid</span>;
      case 'PARTIAL':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Partial</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Unpaid</span>;
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-lg font-bold text-white">Purchase History</h3>
        <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {purchases.length} Vouchers
        </span>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-32">Date</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-32">Voucher No</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border">Party Details</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-32 text-right">Amount</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-32 text-right">Paid</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-24 text-center">Status</th>
              <th className="px-5 py-3.5 bg-white/[0.01] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {purchases.length > 0 ? purchases.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 text-sm text-textMuted">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="opacity-50" />
                    {new Date(p.purchaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm font-mono text-white/90">
                    <Hash size={14} className="text-textMuted" />
                    {p.voucherNo}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-white">{p.partyName}</p>
                  <p className="text-xs text-textMuted font-mono mt-0.5">GSTIN: {p.gstin}</p>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-white text-right">
                  {fmt(p.totalAmount)}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-emerald-400 text-right">
                  {fmt(p.paidAmount)}
                </td>
                <td className="px-5 py-4 text-center">
                  {getStatusPill(p.status)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(p)} className="p-1.5 text-textMuted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Purchase">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Delete Purchase">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-textMuted">
                  No purchases found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesTable;
