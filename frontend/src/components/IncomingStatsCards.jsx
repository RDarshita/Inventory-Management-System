import React from 'react';

const IncomingStatsCards = ({ stats }) => {
  if (!stats) return null;

  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {/* Total Received */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
        <span className="text-xs text-textMuted mb-1 font-medium">Total Received</span>
        <span className="text-2xl font-bold text-emerald-400 mb-1">{formatMoney(stats.totalReceived)}</span>
        <span className="text-[11px] text-textMuted">142 payments logged</span>
      </div>

      {/* Received This Month */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
        <span className="text-xs text-textMuted mb-1 font-medium">Received This Month</span>
        <span className="text-2xl font-bold text-white mb-1">{formatMoney(stats.receivedThisMonth)}</span>
        <span className="text-[11px] text-textMuted"><span className="text-emerald-400 font-medium">18 payments</span> in Jul 2026</span>
      </div>

      {/* Pending Amount */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
        <span className="text-xs text-textMuted mb-1 font-medium">Pending Amount</span>
        <span className="text-2xl font-bold text-white mb-1">{formatMoney(stats.pendingAmount)}</span>
        <span className="text-[11px] text-textMuted">Within payment period</span>
      </div>

      {/* Due Amount */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
        <span className="text-xs text-textMuted mb-1 font-medium">Due Amount</span>
        <span className="text-2xl font-bold text-red-400 mb-1">{formatMoney(stats.dueAmount)}</span>
        <span className="text-[11px] text-textMuted">Overdue across 12 parties</span>
      </div>
    </div>
  );
};

export default IncomingStatsCards;
