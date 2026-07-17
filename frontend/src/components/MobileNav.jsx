import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Banknote, Menu } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={24} /> },
    { name: 'Products', path: '/products', icon: <Package size={24} /> },
    { name: 'Purchases', path: '/purchases', icon: <ShoppingCart size={24} /> },
    { name: 'Sales', path: '/sales', icon: <Banknote size={24} /> },
    { name: 'More', path: '#', icon: <Menu size={24} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 pb-safe">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive && item.name !== 'More' ? 'text-primary' : 'text-textMuted hover:text-text'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
