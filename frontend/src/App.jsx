import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import ProductDetails from './pages/ProductDetails';

// Placeholder function to simulate new pages until we build them
const Placeholder = ({ title }) => (
  <div className="p-8 flex items-center justify-center h-[calc(100vh-100px)]">
    <div className="bg-surface border border-border p-8 rounded-2xl flex flex-col items-center gap-4 text-center max-w-md">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-textMuted text-sm">This module is currently being built. Check back soon for the new Enterprise UI!</p>
    </div>
  </div>
);

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-text selection:bg-primary/30">
        <Sidebar />
        
        <div className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
          <TopBar onRefresh={handleRefresh} />
          
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard refreshTrigger={refreshTrigger} />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/products/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          
          <MobileNav />
        </div>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              color: '#f3f4f6',
              border: '1px solid #2d2d2d',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#1c1c1c',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
