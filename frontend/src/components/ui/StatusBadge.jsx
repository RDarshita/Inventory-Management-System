const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    const s = status?.toLowerCase() || '';
    
    // Green = Good / Success
    if (['good', 'active', 'success', 'paid', 'delivered', 'completed'].includes(s)) {
      return 'bg-success/10 text-success border-success/20';
    }
    // Orange = Warning / Low Stock
    if (['low stock', 'pending', 'processing', 'warning'].includes(s)) {
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
    // Red = Danger / Out of Stock
    if (['out of stock', 'inactive', 'failed', 'overdue', 'cancelled'].includes(s)) {
      return 'bg-danger/10 text-danger border-danger/20';
    }
    // Default / Info
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyles()} capitalize`}>
      {status}
    </span>
  );
};

export default StatusBadge;
