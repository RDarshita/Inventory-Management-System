import { Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

const IncomingTable = ({ payments, onEdit, onDelete }) => {
  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="bg-transparent overflow-hidden flex flex-col mt-4">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h3 className="text-base font-bold text-white leading-tight">Incoming Payments</h3>
          <p className="text-xs text-textMuted mt-0.5">{payments.length} payments</p>
        </div>
        <div className="text-xs text-textMuted">
          Sorted by date : most recent first
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px] text-xs">
          <thead>
            <tr className="border-b border-border/50 text-textMuted">
              <th className="px-2 py-3 font-medium tracking-wide">Date</th>
              <th className="px-2 py-3 font-medium tracking-wide">Party</th>
              <th className="px-2 py-3 font-medium tracking-wide">Transaction ID</th>
              <th className="px-2 py-3 font-medium tracking-wide text-right">Amount Received</th>
              <th className="px-2 py-3 font-medium tracking-wide text-center w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-2 py-8 text-center text-textMuted">
                  No incoming payments found. Click "+ Add Payment" to record one.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-2 py-3">
                    <span className="text-textMuted">{dayjs(p.paymentDate).format('DD MMM YYYY')}</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="font-medium text-white">{p.partyName}</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-textMuted">{p.transactionId}</span>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <span className="font-medium text-white">{formatMoney(p.amountReceived)}</span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(p)}
                        className="p-1 text-textMuted hover:text-white transition-colors"
                        title="Edit payment"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => onDelete(p.id)}
                        className="p-1 text-textMuted hover:text-white transition-colors"
                        title="Delete payment"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingTable;
