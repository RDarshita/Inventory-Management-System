import { useState, useEffect, useMemo } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import partyService from '../api/partyService';
import itemService from '../api/itemService';
import purchaseService from '../api/purchaseService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPurchaseForm = ({ onClose, onSave, initialData }) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [parties, setParties] = useState([]);
  const [partyItems, setPartyItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const emptyLineItem = {
    itemId: '',
    description: '',
    hsnSac: '',
    poNumber: '',
    qty: 1,
    rate: 0,
    gstPercent: 18,
    lineTotal: 0
  };

  const [formData, setFormData] = useState({
    partyId: '',
    voucherNo: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    gstin: '',
    paymentPeriodDays: 0,
    lineItems: [{ ...emptyLineItem }]
  });

  useEffect(() => {
    const init = async () => {
      try {
        const pList = await partyService.getAllParties();
        setParties(pList);
        
        if (isEditing) {
          // fetch items for the party
          const items = await itemService.getItemsByParty(initialData.partyId);
          setPartyItems(items);
          
          setFormData({
            partyId: initialData.partyId,
            voucherNo: initialData.voucherNo,
            purchaseDate: initialData.purchaseDate,
            gstin: initialData.gstin,
            paymentPeriodDays: pList.find(p => p.id === initialData.partyId)?.paymentPeriodDays || 0,
            lineItems: initialData.lineItems.map(li => ({
              ...li,
              itemId: li.itemId || ''
            }))
          });
        }
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, [initialData, isEditing]);

  const handlePartyChange = async (e) => {
    const pId = e.target.value;
    const selectedParty = parties.find(p => p.id.toString() === pId);
    
    setFormData(prev => ({
      ...prev,
      partyId: pId,
      gstin: selectedParty ? selectedParty.gstin : '',
      paymentPeriodDays: selectedParty ? selectedParty.paymentPeriodDays : 0,
      lineItems: [{ ...emptyLineItem }]
    }));

    if (pId) {
      try {
        const items = await itemService.getItemsByParty(pId);
        setPartyItems(items);
      } catch {
        toast.error('Failed to load items for this party');
        setPartyItems([]);
      }
    } else {
      setPartyItems([]);
    }
  };

  const handleItemSelect = (index, itemId) => {
    const item = partyItems.find(i => i.id.toString() === itemId);
    const newLineItems = [...formData.lineItems];
    
    if (item) {
      newLineItems[index] = {
        ...newLineItems[index],
        itemId: item.id,
        description: item.description,
        hsnSac: item.hsnSacCode,
        poNumber: item.poNumber || '',
        rate: item.rate,
        gstPercent: item.gstPercent,
      };
    } else {
      newLineItems[index] = { ...emptyLineItem };
    }
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index][field] = value;
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...emptyLineItem }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length === 1) return;
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  // Compute live totals
  const totals = useMemo(() => {
    let taxable = 0;
    let gst = 0;
    
    formData.lineItems.forEach(line => {
      const q = parseFloat(line.qty) || 0;
      const r = parseFloat(line.rate) || 0;
      const g = parseFloat(line.gstPercent) || 0;
      
      const lineTaxable = q * r;
      const lineGst = lineTaxable * (g / 100);
      
      taxable += lineTaxable;
      gst += lineGst;
    });

    return {
      taxable,
      gst,
      total: taxable + gst
    };
  }, [formData.lineItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partyId) return toast.error('Please select a party');
    if (!formData.voucherNo.trim()) return toast.error('Voucher Number is required');
    if (formData.lineItems.length === 0) return toast.error('Add at least one line item');
    
    // Check for valid line items
    for (let i = 0; i < formData.lineItems.length; i++) {
      const li = formData.lineItems[i];
      if (!li.description) return toast.error(`Line ${i+1}: Description is required`);
      if (parseFloat(li.qty) <= 0) return toast.error(`Line ${i+1}: Qty must be > 0`);
      if (parseFloat(li.rate) <= 0) return toast.error(`Line ${i+1}: Rate must be > 0`);
    }

    setSaving(true);
    try {
      const payload = {
        partyId: parseInt(formData.partyId),
        voucherNo: formData.voucherNo,
        purchaseDate: formData.purchaseDate,
        gstin: formData.gstin,
        lineItems: formData.lineItems.map(li => ({
          itemId: li.itemId || null,
          description: li.description,
          hsnSac: li.hsnSac,
          poNumber: li.poNumber,
          qty: parseFloat(li.qty),
          rate: parseFloat(li.rate),
          gstPercent: parseFloat(li.gstPercent)
        }))
      };

      if (isEditing) {
        await purchaseService.updatePurchase(initialData.id, payload);
        toast.success('Purchase updated successfully');
      } else {
        await purchaseService.createPurchase(payload);
        toast.success('Purchase created successfully');
      }
      onSave();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data) {
        Object.values(error.response.data).forEach(msg => toast.error(msg));
      } else {
        toast.error('Failed to save purchase');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all";
  const labelClass = "text-sm font-medium text-white mb-1.5 block";
  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(v || 0);

  if (loadingInitial) {
    return <div className="p-8 text-center text-textMuted bg-surface rounded-2xl border border-border animate-pulse">Loading form data...</div>;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden animate-in fade-in duration-200">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-border flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? 'Edit Purchase Voucher' : 'New Purchase Voucher'}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 text-textMuted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Top Section */}
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1 lg:col-span-2">
            <label className={labelClass}>Party *</label>
            <select required value={formData.partyId} onChange={handlePartyChange} className={inputClass}>
              <option value="">-- Select Party --</option>
              {parties.map(p => (
                <option key={p.id} value={p.id}>{p.companyName} {p.gstin ? `(${p.gstin})` : ''}</option>
              ))}
            </select>
            <div className="mt-1">
              <button type="button" onClick={() => navigate('/company-party')} className="text-xs text-primary hover:text-primary/80">
                + Add new party instead
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Voucher / Invoice No *</label>
            <input required type="text" value={formData.voucherNo} onChange={e => setFormData(p => ({...p, voucherNo: e.target.value}))} placeholder="e.g. PUR-001" className={inputClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Purchase Date *</label>
            <input required type="date" value={formData.purchaseDate} onChange={e => setFormData(p => ({...p, purchaseDate: e.target.value}))} className={inputClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Party GSTIN</label>
            <input type="text" readOnly value={formData.gstin} className={`${inputClass} opacity-70 bg-white/5 cursor-not-allowed`} placeholder="Auto-filled" />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Payment Period (Days)</label>
            <input type="text" readOnly value={formData.paymentPeriodDays} className={`${inputClass} opacity-70 bg-white/5 cursor-not-allowed`} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Status</label>
            <input type="text" readOnly value={isEditing ? initialData.status : "Unpaid — new entry"} className={`${inputClass} opacity-70 bg-white/5 cursor-not-allowed font-medium ${!isEditing ? 'text-red-400' : ''}`} />
          </div>
        </div>

        {/* Line Items Section */}
        <div className="p-5 md:p-6 border-t border-border space-y-4">
          <h4 className="text-base font-bold text-white mb-2">Line Items</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[25%]">Item Details</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[12%]">HSN/SAC</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[12%]">PO Number</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[10%]">Qty</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[12%]">Rate</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border w-[10%]">GST %</th>
                  <th className="px-3 py-2 text-xs font-semibold text-textMuted uppercase border-b border-border text-right w-[15%]">Total</th>
                  <th className="px-3 py-2 border-b border-border w-[4%]"></th>
                </tr>
              </thead>
              <tbody>
                {formData.lineItems.map((line, idx) => (
                  <tr key={idx} className="group">
                    <td className="p-2 align-top">
                      <div className="space-y-2">
                        {formData.partyId && partyItems.length > 0 && (
                          <select 
                            value={line.itemId} 
                            onChange={(e) => handleItemSelect(idx, e.target.value)} 
                            className={`${inputClass} py-1.5`}
                          >
                            <option value="">-- Custom Item --</option>
                            {partyItems.map(item => (
                              <option key={item.id} value={item.id}>{item.description}</option>
                            ))}
                          </select>
                        )}
                        <textarea 
                          required 
                          rows="1" 
                          placeholder="Item Description" 
                          value={line.description} 
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className={`${inputClass} resize-none py-1.5 min-h-[36px]`}
                        />
                      </div>
                    </td>
                    <td className="p-2 align-top">
                      <input type="text" value={line.hsnSac} onChange={(e) => handleLineItemChange(idx, 'hsnSac', e.target.value)} className={`${inputClass} py-1.5`} placeholder="HSN/SAC" />
                    </td>
                    <td className="p-2 align-top">
                      <input type="text" value={line.poNumber} onChange={(e) => handleLineItemChange(idx, 'poNumber', e.target.value)} className={`${inputClass} py-1.5`} placeholder="PO Num" />
                    </td>
                    <td className="p-2 align-top">
                      <input required type="number" min="0.01" step="0.01" value={line.qty} onChange={(e) => handleLineItemChange(idx, 'qty', e.target.value)} className={`${inputClass} py-1.5`} />
                    </td>
                    <td className="p-2 align-top">
                      <input required type="number" min="0.01" step="0.01" value={line.rate} onChange={(e) => handleLineItemChange(idx, 'rate', e.target.value)} className={`${inputClass} py-1.5`} />
                    </td>
                    <td className="p-2 align-top">
                      <select required value={line.gstPercent} onChange={(e) => handleLineItemChange(idx, 'gstPercent', e.target.value)} className={`${inputClass} py-1.5`}>
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>
                    <td className="p-2 align-top text-right font-medium text-white">
                      {fmt((parseFloat(line.qty) || 0) * (parseFloat(line.rate) || 0) * (1 + (parseFloat(line.gstPercent) || 0) / 100))}
                    </td>
                    <td className="p-2 align-top text-center">
                      {formData.lineItems.length > 1 && (
                        <button type="button" onClick={() => removeLineItem(idx)} className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded transition-colors mt-0.5">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-2 border-t border-border/50 pt-4">
            <button type="button" onClick={addLineItem} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-primary/10 transition-colors">
              <Plus size={16} /> Add line item
            </button>
            
            <div className="text-right space-y-1 text-sm bg-white/[0.02] p-4 rounded-xl border border-border min-w-[250px]">
              <div className="flex justify-between text-textMuted">
                <span>Taxable Value:</span>
                <span>{fmt(totals.taxable)}</span>
              </div>
              <div className="flex justify-between text-textMuted">
                <span>GST Total:</span>
                <span>{fmt(totals.gst)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-white border-t border-border pt-2 mt-2">
                <span>Grand Total:</span>
                <span>{fmt(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-6 bg-white/[0.01] border-t border-border flex justify-between items-center">
          <button type="button" onClick={() => navigate('/company-party')} className="px-4 py-2 text-sm text-textMuted hover:text-white bg-surface border border-border hover:bg-white/5 rounded-lg transition-colors">
            + Add New Party
          </button>
          
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-textMuted hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2">
              <Save size={16} />
              {saving ? 'Saving...' : (isEditing ? 'Update Purchase' : 'Save Purchase')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPurchaseForm;
