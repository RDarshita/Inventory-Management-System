import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const DashboardDateTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dateStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const timeStr = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Calendar size={15} className="text-primary" />
        {dateStr}
      </span>
      <span className="flex items-center gap-2 text-xs text-textMuted tabular-nums">
        <Clock size={14} className="text-primary/70" />
        {timeStr.toUpperCase()}
      </span>
    </div>
  );
};

export default DashboardDateTime;
