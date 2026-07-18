import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit, Eye, Trash2, Search, X } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import toast from 'react-hot-toast';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Filter options from DB
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Debounce ref
  const debounceTimer = useRef(null);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [cats, supps] = await Promise.all([
          productService.getCategories(),
          productService.getSuppliers()
        ]);
        setCategories(cats);
        setSuppliers(supps);
      } catch (error) {
        console.error('Failed to load filter options', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Parse price range to min/max
  const parsePriceRange = (range) => {
    switch (range) {
      case '0-500': return { minPrice: 0, maxPrice: 500 };
      case '500-5000': return { minPrice: 500, maxPrice: 5000 };
      case '5000+': return { minPrice: 5000, maxPrice: null };
      default: return { minPrice: null, maxPrice: null };
    }
  };

  // Fetch products with current search + filters
  const fetchProducts = useCallback(async (searchKeyword) => {
    setLoading(true);
    try {
      const { minPrice, maxPrice } = parsePriceRange(priceRange);
      const data = await productService.searchAndFilter({
        keyword: searchKeyword,
        category,
        supplier,
        stockStatus,
        minPrice,
        maxPrice
      });
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [category, supplier, stockStatus, priceRange]);

  // Debounced search input handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setKeyword(value);
    }, 400);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    setKeyword('');
  };

  // Re-fetch when keyword or any filter changes
  useEffect(() => {
    fetchProducts(keyword);
  }, [keyword, fetchProducts]);

  // Refresh filter options after CRUD (categories/suppliers might change)
  const refreshAll = async () => {
    await fetchProducts(keyword);
    try {
      const [cats, supps] = await Promise.all([
        productService.getCategories(),
        productService.getSuppliers()
      ]);
      setCategories(cats);
      setSuppliers(supps);
    } catch (e) { /* silent */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      refreshAll();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'Good';
  };

  const columns = [
    { header: 'Product', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">📦</div>
        <div>
          <p className="font-medium text-white">{row.productName}</p>
          <p className="text-xs text-textMuted">{row.sku}</p>
        </div>
      </div>
    ) },
    { header: 'Category', accessor: 'category' },
    { header: 'Supplier', accessor: 'supplier' },
    { header: 'Cost / Price', render: (row) => (
      <div>
        <p className="text-white">₹{row.sellingPrice}</p>
        <p className="text-xs text-textMuted">₹{row.purchasePrice}</p>
      </div>
    ) },
    { header: 'Stock', render: (row) => (
      <span className="font-medium text-white">{row.openingQuantity}</span>
    ) },
    { header: 'Status', render: (row) => <StatusBadge status={getStockStatus(row.openingQuantity, row.minimumStockLevel)} /> },
    { header: 'Actions', align: 'right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => navigate(`/products/${row.id}`)} className="p-1.5 text-textMuted hover:text-white transition-colors" title="View"><Eye size={16} /></button>
        <button onClick={() => navigate(`/products/edit/${row.id}`)} className="p-1.5 text-textMuted hover:text-primary transition-colors" title="Edit"><Edit size={16} /></button>
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-textMuted hover:text-danger transition-colors" title="Delete"><Trash2 size={16} /></button>
      </div>
    ) },
  ];

  const hasActiveFilters = category || supplier || stockStatus || priceRange;

  const clearAllFilters = () => {
    setCategory('');
    setSupplier('');
    setStockStatus('');
    setPriceRange('');
    setSearchInput('');
    setKeyword('');
  };

  const selectClass = "bg-background border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-w-[130px]";

  const TableActions = (
    <div className="flex gap-2">
      <button 
        onClick={() => navigate('/products/add')}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20"
      >
        <Plus size={16} />
        Add Product
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="text-sm text-textMuted mt-1">Manage your product catalog and pricing.</p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        {/* Search Row */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-textMuted" />
          </div>
          <input
            type="text"
            placeholder="Search by name, SKU, category, supplier..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-9 py-2 text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
          />
          {searchInput && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className={selectClass}>
            <option value="">All Suppliers</option>
            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className={selectClass}>
            <option value="">All Stock Status</option>
            <option value="GOOD">Good</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectClass}>
            <option value="">Any Price</option>
            <option value="0-500">₹0 – ₹500</option>
            <option value="500-5000">₹500 – ₹5,000</option>
            <option value="5000+">₹5,000+</option>
          </select>

          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors ml-1"
            >
              <X size={12} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/5 rounded-lg w-full"></div>
          <div className="h-64 bg-white/5 rounded-lg w-full"></div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={products} 
          searchable={false}
          actions={TableActions}
        />
      )}
    </div>
  );
};

export default Products;
