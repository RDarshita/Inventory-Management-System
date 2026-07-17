import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Settings updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-sm text-textMuted mt-1">Configure your company profile and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl overflow-hidden">
        
        <div className="p-6 md:p-8 border-b border-border space-y-6">
          <h3 className="text-lg font-bold text-white">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Business Name</label>
              <input type="text" defaultValue="Morya Packers Tech" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">GST Number</label>
              <input type="text" defaultValue="27AABCP1234D1Z5" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white">Full Address</label>
              <textarea rows="2" defaultValue="123 Industrial Area, Phase 1&#10;Mumbai, Maharashtra 400001" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-b border-border space-y-6">
          <h3 className="text-lg font-bold text-white">Financial Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Base Currency</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all">
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Default Tax Percentage (%)</label>
              <input type="number" step="0.1" defaultValue="18.0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white/[0.01] flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
