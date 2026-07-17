import { useState } from 'react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Product saved successfully!');
      navigate('/products');
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 rounded-lg hover:bg-white/5 text-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
          <p className="text-sm text-textMuted mt-1">Fill in the details to add a product to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* Image Upload Section */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Product Image</h3>
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-textMuted group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-3">
              <Upload size={24} />
            </div>
            <p className="text-sm font-medium text-white">Click to upload or drag and drop</p>
            <p className="text-xs text-textMuted mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Product Name *</label>
            <input required type="text" placeholder="e.g. Corrugated Box XL" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">SKU *</label>
            <input required type="text" placeholder="e.g. BOX-XL-01" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-white">Description</label>
            <textarea rows="3" placeholder="Enter product description..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Category</label>
            <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
              <option value="">Select a category</option>
              <option value="boxes">Boxes</option>
              <option value="tapes">Tapes</option>
              <option value="wraps">Wraps</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Supplier</label>
            <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
              <option value="">Select a supplier</option>
              <option value="s1">Packaging Co.</option>
              <option value="s2">SafePack Ltd.</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Purchase Price (₹) *</label>
            <input required type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Selling Price (₹) *</label>
            <input required type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Opening Quantity *</label>
            <input required type="number" min="0" placeholder="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Minimum Stock Level</label>
            <input type="number" min="0" placeholder="e.g. 50" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <button 
            type="button" 
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 rounded-lg font-medium text-white border border-border hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
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
