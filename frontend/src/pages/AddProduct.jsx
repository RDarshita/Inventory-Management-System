import { useState } from 'react';
import { Save, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    description: '',
    category: '',
    supplier: '',
    purchasePrice: '',
    sellingPrice: '',
    openingQuantity: '',
    minimumStockLevel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productService.createProduct({
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        openingQuantity: parseInt(formData.openingQuantity) || 0,
        minimumStockLevel: parseInt(formData.minimumStockLevel) || 0
      });
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          // Field validation errors
          Object.values(errorData).forEach(err => toast.error(err));
        }
      } else {
        toast.error('Failed to create product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
          <p className="text-sm text-textMuted mt-1">Create a new product for your inventory.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/products')} className="px-4 py-2 text-sm text-textMuted hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl overflow-hidden">
        
        {/* Basic Info */}
        <div className="p-6 md:p-8 border-b border-border space-y-6">
          <h3 className="text-lg font-bold text-white">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Product Name *</label>
              <input required name="productName" value={formData.productName} onChange={handleChange} type="text" placeholder="e.g. Corrugated Box XL" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">SKU Code *</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} type="text" placeholder="e.g. BOX-XL-01" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all uppercase" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Enter product details..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all resize-none"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                <option value="">Select Category</option>
                <option value="Boxes">Boxes</option>
                <option value="Wraps">Wraps</option>
                <option value="Labels">Labels</option>
                <option value="Tapes">Tapes</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Supplier</label>
              <input name="supplier" value={formData.supplier} onChange={handleChange} type="text" placeholder="e.g. Packaging Co." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="p-6 md:p-8 border-b border-border space-y-6">
          <h3 className="text-lg font-bold text-white">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Purchase Price *</label>
              <input required name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Selling Price *</label>
              <input required name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Opening Qty *</label>
              <input required name="openingQuantity" value={formData.openingQuantity} onChange={handleChange} type="number" min="0" placeholder="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Min Stock Level</label>
              <input name="minimumStockLevel" value={formData.minimumStockLevel} onChange={handleChange} type="number" min="0" placeholder="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white/[0.01] flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
