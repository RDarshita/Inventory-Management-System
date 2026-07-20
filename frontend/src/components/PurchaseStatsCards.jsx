const PurchaseStatsCards = ({ stats }) => {
  if (!stats) return null;

  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v || 0);

  const cards = [
    { title: 'Total Purchase', value: fmt(stats.totalPurchase), bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400' },
    { title: 'Amount Paid', value: fmt(stats.amountPaid), bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { title: 'Outstanding', value: fmt(stats.outstanding), bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400' },
    { title: 'Top Item Spend', value: stats.topItemSpend || '—', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.title} className={`bg-gradient-to-br ${c.bg} rounded-2xl p-5 border ${c.border} flex flex-col gap-2`}>
          <h3 className="text-sm font-medium text-textMuted">{c.title}</h3>
          <span className={`text-xl md:text-2xl font-bold ${c.text} truncate`}>{c.value}</span>
        </div>
      ))}
    </div>
  );
};

export default PurchaseStatsCards;
