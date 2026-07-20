import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  ShoppingBag,
  ArrowDownCircle,
  ArrowUpCircle,
  BookOpen,
  Settings,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Company/Party', path: '/company-party', icon: Building2 },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
    { name: 'Purchases', path: '/purchases', icon: ShoppingBag },
    { name: 'Incoming', path: '/incoming', icon: ArrowDownCircle },
    { name: 'Outgoing', path: '/outgoing', icon: ArrowUpCircle },
    { name: 'Ledger', path: '/ledger', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isItemActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex flex-col w-[248px] h-screen bg-[#111827] fixed left-0 top-0 z-50 border-r border-white/[0.06]">
      {/* Brand */}
      <div className="px-6 pt-8 pb-7">
        <h1 className="text-[20px] font-bold text-white tracking-tight">Packers Tech</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={() =>
                    `group flex items-center gap-3 px-3 py-[10px] rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-[#9ca3af] hover:bg-white/[0.06] hover:text-white'
                    }`
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.75}
                    className={`transition-colors duration-200 flex-shrink-0 ${
                      active ? 'text-white' : 'text-[#6b7280] group-hover:text-white'
                    }`}
                  />
                  <span className={`text-[14px] transition-colors duration-200 ${
                    active ? 'font-semibold' : 'font-medium'
                  }`}>
                    {item.name}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
