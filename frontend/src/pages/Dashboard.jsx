import { useState, useEffect } from 'react';
import { Package, Users, Truck, ShoppingCart, Banknote, AlertTriangle, Clock } from 'lucide-react';
import api from '../api/axios';
import KpiCard from '../components/KpiCard';
import Skeleton from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { MonthlySalesChart, InventoryPieChart, TopProductsChart, PurchaseVsSalesChart } from '../components/dashboard/Charts';

const Dashboard = ({ refreshTrigger }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Skeleton className="h-32 w-full" count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="bg-danger/10 text-danger p-6 rounded-2xl max-w-md border border-danger/20 flex flex-col items-center gap-3">
          <AlertTriangle size={32} />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 pb-24 md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-textMuted mt-1">Enterprise Inventory & Financial Summary</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface border border-border hover:bg-white/5 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            Generate Report
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 text-sm">
            Add Product
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KpiCard title="Total Products" amount={data.totalProducts} change={data.productsChange} prefix="" isCurrency={false} />
        <KpiCard title="Today's Sales" amount={data.todaysSales} change={data.todaysSalesChange} />
        <KpiCard title="Inventory Value" amount={data.inventoryValue} change={data.inventoryValueChange} />
        <KpiCard title="Low Stock Products" amount={data.lowStockProducts} change={data.lowStockChange} prefix="" isCurrency={false} />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KpiCard title="Total Customers" amount={data.totalCustomers} change={data.customersChange} prefix="" isCurrency={false} />
        <KpiCard title="Total Suppliers" amount={data.totalSuppliers} change={data.suppliersChange} prefix="" isCurrency={false} />
        <KpiCard title="Pending Orders" amount={data.pendingOrders} change={data.pendingOrdersChange} prefix="" isCurrency={false} />
        <KpiCard title="Monthly Revenue" amount={data.monthlyRevenue} change={data.monthlyRevenueChange} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <MonthlySalesChart data={data.monthlySalesData} />
        <InventoryPieChart data={data.inventoryByCategoryData} />
        <TopProductsChart data={data.topSellingProductsData} />
        <PurchaseVsSalesChart data={data.purchaseVsSalesData} />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">View All</button>
        </div>
        
        <div className="divide-y divide-border">
          {data.recentActivity && data.recentActivity.map((activity) => (
            <div key={activity.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-start sm:items-center gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 bg-white/5 border border-white/10 ${
                activity.status === 'Success' ? 'text-success' : 
                activity.status === 'Warning' ? 'text-orange-500' : 'text-primary'
              }`}>
                {activity.type.includes('Product') ? <Package size={20} /> : 
                 activity.type.includes('Supplier') ? <Truck size={20} /> :
                 activity.type.includes('Customer') ? <Users size={20} /> :
                 activity.type.includes('Purchase') ? <ShoppingCart size={20} /> :
                 activity.type.includes('Alert') ? <AlertTriangle size={20} /> :
                 <Banknote size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-textMuted">
                  <span className="flex items-center gap-1"><Clock size={12} /> {activity.timestamp}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{activity.type}</span>
                </div>
              </div>
              
              <div className="text-right">
                <StatusBadge status={activity.status} />
              </div>
            </div>
          ))}
          {(!data.recentActivity || data.recentActivity.length === 0) && (
            <div className="p-8 text-center text-textMuted">
              No recent activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
