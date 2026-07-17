import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Truck, Users, ShoppingCart, Banknote, ClipboardList, BarChart2, UserCog, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Purchases', path: '/purchases', icon: <ShoppingCart size={20} /> },
    { name: 'Sales', path: '/sales', icon: <Banknote size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <ClipboardList size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
    { name: 'Users', path: '/users', icon: <UserCog size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-border fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-white tracking-wide">Packers Tech</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-textMuted hover:bg-white/5 hover:text-text border border-transparent'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
