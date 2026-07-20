import { useState, useEffect } from 'react';
import { Plus, Save, ChevronRight, Building2, Search, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import partyService from '../api/partyService';
import toast from 'react-hot-toast';

const CompanyParty = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const emptyForm = {
    companyName: '', gstin: '', companyAddress: '', pincode: '',
    stateCode: '', phoneNo: '', email: '', paymentPeriodDays: '', notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchParties = async () => {
    setLoading(true);
    try {
      const data = await partyService.getAllParties();
      setParties(data);
    } catch (error) {
      toast.error('Failed to load parties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParties(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await partyService.createParty({
        ...formData,
        paymentPeriodDays: formData.paymentPeriodDays ? parseInt(formData.paymentPeriodDays) : null
      });
      toast.success('Company saved successfully!');
      setFormData(emptyForm);
      setShowForm(false);
      fetchParties();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          Object.values(errorData).forEach(err => toast.error(err));
        }
      } else {
        toast.error('Failed to save company');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await partyService.deleteParty(id);
      toast.success('Company deleted');
      fetchParties();
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const filteredParties = parties.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.companyName?.toLowerCase().includes(q) ||
      p.gstin?.toLowerCase().includes(q) ||
      p.phoneNo?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q);
  });

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all";

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Company / Party</h2>
          <p className="text-sm text-textMuted mt-1">Manage your customers and suppliers.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            Add new party
          </button>
        )}
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <form onSubmit={handleSave}>
            <div className="p-6 md:p-8 border-b border-border space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Company Details</h3>
                <button type="button" onClick={() => { setShowForm(false); setFormData(emptyForm); }} className="text-sm text-textMuted hover:text-white transition-colors">Cancel</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Company Name *</label>
                  <input required name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="e.g. ABC Industries" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">GSTIN *</label>
                  <input required name="gstin" value={formData.gstin} onChange={handleChange} type="text" maxLength={15} placeholder="e.g. 27AABCP1234D1Z5" className={`${inputClass} uppercase`} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">State Code</label>
                  <input name="stateCode" value={formData.stateCode} onChange={handleChange} type="text" placeholder="e.g. 27" className={inputClass} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white">Company Address</label>
                  <input name="companyAddress" value={formData.companyAddress} onChange={handleChange} type="text" placeholder="Full address" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} type="text" placeholder="e.g. 400001" className={inputClass} />
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 border-b border-border space-y-6">
              <h3 className="text-lg font-bold text-white">Contact & Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Phone</label>
                  <input name="phoneNo" value={formData.phoneNo} onChange={handleChange} type="text" placeholder="e.g. 9876543210" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g. info@company.com" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Payment Period (Days)</label>
                  <input name="paymentPeriodDays" value={formData.paymentPeriodDays} onChange={handleChange} type="number" min="1" placeholder="e.g. 30" className={inputClass} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium text-white">Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" placeholder="Additional notes..." className={`${inputClass} resize-none`}></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 bg-white/[0.01] flex justify-end">
              <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Company'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {!showForm && parties.length > 0 && (
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-textMuted" />
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-9 py-2 text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Companies Label */}
      {!showForm && filteredParties.length > 0 && (
        <h3 className="text-sm font-semibold text-white">Companies</h3>
      )}

      {/* Party List */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      ) : filteredParties.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-textMuted opacity-30" />
          <p className="text-textMuted">{searchQuery ? 'No companies match your search.' : 'No parties added yet. Click "+ Add new party" to get started.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredParties.map(party => (
            <div
              key={party.id}
              onClick={() => navigate(`/company-party/${party.id}`)}
              className="bg-surface border border-border rounded-xl px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{party.companyName}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-textMuted font-mono">{party.gstin}</span>
                    {party.companyAddress && (
                      <>
                        <span className="text-xs text-textMuted">·</span>
                        <span className="text-xs text-textMuted truncate max-w-[300px]">{party.companyAddress}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={(e) => handleDelete(party.id, e)}
                  className="p-1.5 text-textMuted hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
                <ChevronRight size={18} className="text-textMuted group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyParty;
