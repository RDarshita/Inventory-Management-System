import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCard = ({ title, amount, prefix = '₹', suffix = '', change, isCurrency = true }) => {
  const isPositive = change >= 0;
  
  const formattedAmount = isCurrency 
    ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)
    : amount;

  return (
    <div className="bg-surface rounded-2xl p-5 border border-border flex flex-col gap-3 shadow-sm hover:border-border/80 transition-colors">
      <h3 className="text-sm font-medium text-textMuted">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl md:text-3xl font-bold text-white">
          {prefix}{formattedAmount}{suffix}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        {isPositive ? (
          <TrendingUp size={16} className="text-success" />
        ) : (
          <TrendingDown size={16} className="text-danger" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-textMuted ml-1">vs last month</span>
      </div>
    </div>
  );
};

export default KpiCard;
