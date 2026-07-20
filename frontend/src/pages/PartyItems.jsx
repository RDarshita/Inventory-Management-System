import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, Package, Trash2, Edit2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import partyService from '../api/partyService';
import itemService from '../api/itemService';
import toast from 'react-hot-toast';

const PartyItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [party, setParty] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Track if editing existing item
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    description: '',
    hsnSacCode: '',
    rate: '',
    gstPercent: '18',
    poNumber: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch party details for the header, and items for the list
      const [partyData, itemsData] = await Promise.all([
        partyService.getPartyById(id),
        itemService.getItemsByParty(id)
      ]);
      setParty(partyData);
      setItems(itemsData);
    } catch (error) {
      toast.error('Failed to load data');
      navigate(`/company-party/${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenEdit = (item) => {
    setFormData({
      description: item.description,
      hsnSacCode: item.hsnSacCode,
      rate: item.rate,
      gstPercent: item.gstPercent,
      poNumber: item.poNumber || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert to proper types
    const payload = {
      ...formData,
      rate: parseFloat(formData.rate),
      gstPercent: parseFloat(formData.gstPercent)
    };

    try {
      if (editingId) {
        await itemService.updateItem(editingId, payload);
        toast.success('Item updated successfully!');
      } else {
        await itemService.createItem(id, payload);
        toast.success('Item added successfully!');
      }
      handleCloseForm();
      // Reload items to show changes
      const updatedItems = await itemService.getItemsByParty(id);
      setItems(updatedItems);
    } catch (error) {
      if (error.response?.data) {
        const d = error.response.data;
        if (d.error) toast.error(d.error);
        else Object.values(d).forEach(err => toast.error(err));
      } else {
        toast.error('Failed to save item');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemService.deleteItem(itemId);
      toast.success('Item deleted');
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all";

  if (loading && !party) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded-lg w-64 mb-6"></div>
          <div className="h-32 bg-white/5 rounded-2xl"></div>
          <div className="h-64 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate(`/company-party/${id}`)} className="mt-1 p-2 rounded-lg bg-surface border border-border text-textMuted hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Items — {party?.companyName}</h2>
            <p className="text-sm text-textMuted mt-1">Items used for invoicing this company.</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20 shrink-0 self-start"
          >
            <Plus size={16} />
            Add new item
          </button>
        )}
      </div>

      {/* Inline Form (Add / Edit) */}
      {showForm && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden animate-in fade-in duration-200">
          <form onSubmit={handleSave}>
            <div className="p-6 md:p-8 border-b border-border space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  {editingId ? 'Edit Item' : 'New Item Details'}
                </h3>
                <button type="button" onClick={handleCloseForm} className="p-1 text-textMuted hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-medium text-white">Description of goods *</label>
                  <input required name="description" value={formData.description} onChange={handleChange} type="text" placeholder="e.g. Cardboard Boxes 10x10x10" className={inputClass} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">HSN/SAC No *</label>
                  <input required name="hsnSacCode" value={formData.hsnSacCode} onChange={handleChange} type="text" placeholder="e.g. 4819" className={inputClass} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Rate (₹) *</label>
                  <input required name="rate" value={formData.rate} onChange={handleChange} type="number" min="0" step="0.01" placeholder="0.00" className={inputClass} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">GST % *</label>
                  <select required name="gstPercent" value={formData.gstPercent} onChange={handleChange} className={inputClass}>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-sm font-medium text-white">PO / Order Number</label>
                  <input name="poNumber" value={formData.poNumber} onChange={handleChange} type="text" placeholder="Optional" className={inputClass} />
                </div>
                
                <div className="md:col-span-2 lg:col-span-4">
                  <p className="text-xs text-textMuted">
                    * PO number auto-fills into invoice lines when this item is selected — can be changed per invoice.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white/[0.01] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm text-textMuted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {saving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Item' : 'Save Item')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      {!loading && (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center">
              <Package size={40} className="mx-auto mb-4 text-textMuted opacity-30" />
              <p className="text-textMuted">No items yet for this company.</p>
              <p className="text-sm text-textMuted mt-1">Add the first item to start invoicing.</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] transition-colors group gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-textMuted">
                    <span>HSN: <span className="font-mono text-white/80">{item.hsnSacCode}</span></span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span>Rate: <span className="font-medium text-white/80">₹{parseFloat(item.rate).toFixed(2)}</span></span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span>GST: <span className="text-white/80">{item.gstPercent}%</span></span>
                    {item.poNumber && (
                      <>
                        <span className="hidden sm:inline text-border">•</span>
                        <span className="text-primary/80">PO: {item.poNumber}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-textMuted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-textMuted hover:text-danger bg-white/5 hover:bg-danger/10 rounded-lg transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PartyItems;
