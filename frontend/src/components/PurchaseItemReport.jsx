import { Package } from 'lucide-react';

const PurchaseItemReport = ({ report }) => {
  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v || 0);

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-border bg-white/[0.02]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Package size={18} className="text-primary" /> Item-wise Spend
        </h3>
        <p className="text-xs text-textMuted mt-1">Aggregate purchase metrics per item.</p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[600px] xl:max-h-none">
        {report && report.length > 0 ? (
          <div className="divide-y divide-border/30">
            {report.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-white truncate pr-4">{item.description}</h4>
                  <span className="text-sm font-bold text-white shrink-0">{fmt(item.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-textMuted mt-2">
                  <div className="flex gap-3">
                    <span>HSN: <span className="font-mono text-white/60">{item.hsnSac || '—'}</span></span>
                    <span>Qty: <span className="font-medium text-white/80">{item.totalQty}</span></span>
                  </div>
                  <span className="text-white/40">
                    {item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }) : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-textMuted text-sm">
            No item data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseItemReport;
