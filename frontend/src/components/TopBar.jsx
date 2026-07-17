import { Search, Bell, RefreshCw, User, Lock, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const TopBar = ({ onRefresh }) => {
  return (
    <header className="h-16 md:h-16 bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
      <div className="md:hidden">
        <h1 className="text-lg font-bold text-white tracking-wide">Packers Tech</h1>
      </div>
      
      <div className="hidden md:flex items-center flex-1 max-w-md bg-surface border border-border rounded-full px-4 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <Search size={18} className="text-textMuted mr-2" />
        <input 
          type="text" 
          placeholder="Search products, suppliers, customers..." 
          className="bg-transparent border-none outline-none text-sm w-full text-text placeholder-textMuted"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <button onClick={onRefresh} className="p-2 rounded-full hover:bg-surface text-textMuted hover:text-text transition-colors">
          <RefreshCw size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-surface text-textMuted hover:text-text transition-colors relative mr-2 md:mr-0">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        {/* Profile Dropdown */}
        <Menu as="div" className="relative inline-block text-left hidden md:block">
          <div>
            <Menu.Button className="flex items-center focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"></div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-border rounded-xl bg-surface shadow-lg ring-1 ring-black/5 border border-border focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-primary/10 text-primary' : 'text-text'} group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}>
                      <User size={16} className="mr-3" />
                      My Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-primary/10 text-primary' : 'text-text'} group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}>
                      <Lock size={16} className="mr-3" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-danger/10 text-danger' : 'text-text'} group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}>
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default TopBar;
