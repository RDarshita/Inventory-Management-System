import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';

// Custom Tooltip for dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.toLowerCase().includes('sales') || entry.name.toLowerCase().includes('purchase') || entry.name.toLowerCase().includes('revenue') ? '₹' : ''}
            {new Intl.NumberFormat('en-IN').format(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export const MonthlySalesChart = ({ data }) => (
  <div className="bg-surface p-5 rounded-2xl border border-border h-[350px]">
    <h3 className="text-lg font-bold text-white mb-4">Monthly Sales</h3>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" name="Sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const InventoryPieChart = ({ data }) => (
  <div className="bg-surface p-5 rounded-2xl border border-border h-[350px] flex flex-col">
    <h3 className="text-lg font-bold text-white mb-4">Inventory by Category</h3>
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const TopProductsChart = ({ data }) => (
  <div className="bg-surface p-5 rounded-2xl border border-border h-[350px]">
    <h3 className="text-lg font-bold text-white mb-4">Top Selling Products</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" horizontal={false} />
        <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={120} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Units Sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PurchaseVsSalesChart = ({ data }) => (
  <div className="bg-surface p-5 rounded-2xl border border-border h-[350px]">
    <h3 className="text-lg font-bold text-white mb-4">Purchase vs Sales</h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        <Line type="monotone" dataKey="value" name="Sales" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="value2" name="Purchases" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
