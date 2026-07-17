import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import { MonthlySalesChart, PurchaseVsSalesChart } from '../components/dashboard/Charts';

const Reports = () => {
  // Dummy data similar to dashboard for charts
  const monthlySales = [
    { name: 'Jan', value: 45000 }, { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 }, { name: 'Apr', value: 61000 },
    { name: 'May', value: 59000 }, { name: 'Jun', value: 75000 },
  ];

  const purchaseVsSales = [
    { name: 'Jan', value: 45000, value2: 30000 },
    { name: 'Feb', value: 52000, value2: 35000 },
    { name: 'Mar', value: 48000, value2: 28000 },
    { name: 'Apr', value: 61000, value2: 42000 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial & Inventory Reports</h2>
          <p className="text-sm text-textMuted mt-1">Analytics, trends, and data exports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface border border-border hover:bg-white/5 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
            <FileSpreadsheet size={16} className="text-green-500" />
            Export Excel
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20">
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <KpiCard title="Total Revenue" amount={1250000} change={12.5} />
        <KpiCard title="Total Profit" amount={350000} change={8.2} />
        <KpiCard title="Purchases" amount={850000} change={-2.4} />
        <KpiCard title="Sales" amount={1250000} change={12.5} />
        <KpiCard title="Inventory Value" amount={450000} change={5.0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <MonthlySalesChart data={monthlySales} />
        <PurchaseVsSalesChart data={purchaseVsSales} />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-6">Generated Reports History</h3>
        <div className="text-center text-textMuted py-8">
          <Download size={32} className="mx-auto mb-3 opacity-20" />
          <p>No reports generated recently.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
