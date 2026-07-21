import { useState, useEffect, useMemo } from 'react';
import { Save, X } from 'lucide-react';
import partyService from '../api/partyService';
import incomingService from '../api/incomingService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const AddPaymentForm = ({ onClose, onSave, initialData }) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [parties, setParties] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [allocations, setAllocations] = useState({});

  // Flag for Sales Module Implementation
  const isSalesModuleImplemented = false;

  const [formData, setFormData] = useState({
    partyId: '',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amountReceived: '',
    notes: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const pList = await partyService.getAllParties();
        setParties(pList);
        
        if (isEditing) {
          setFormData({
            partyId: initialData.partyId,
            transactionId: initialData.transactionId || '',
            paymentDate: initialData.paymentDate,
            amountReceived: initialData.amountReceived || '',
            notes: initialData.notes || ''
          });
          
          if (initialData.partyId && isSalesModuleImplemented) {
             setLoadingInvoices(true);
             try {
               const invs = await partyService.getOutstandingInvoices(initialData.partyId);
               setOutstandingInvoices(invs || []);
             } catch (err) {
               console.error(err);
             } finally {
               setLoadingInvoices(false);
             }
          }
        }
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, [initialData, isEditing, isSalesModuleImplemented]);

  const handlePartyChange = async (e) => {
    const newPartyId = e.target.value;
    setFormData(prev => ({ ...prev, partyId: newPartyId }));
    
    if (newPartyId && isSalesModuleImplemented) {
      setLoadingInvoices(true);
      try {
        const invoices = await partyService.getOutstandingInvoices(newPartyId);
        setOutstandingInvoices(invoices || []);
      } catch (err) {
        toast.error('Failed to load outstanding invoices');
      } finally {
        setLoadingInvoices(false);
      }
    } else {
      setOutstandingInvoices([]);
    }
  };

  // Auto-allocate logic
  useEffect(() => {
    if (!isSalesModuleImplemented || outstandingInvoices.length === 0) return;
    
    const amount = parseFloat(formData.amountReceived) || 0;
    if (amount <= 0) {
      setAllocations({});
      return;
    }
    
    let remaining = amount;
    const newAllocations = {};
    
    // Sort oldest first
    const sorted = [...outstandingInvoices].sort((a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate));
    
    sorted.forEach(inv => {
      if (remaining > 0) {
        const allocate = Math.min(remaining, inv.outstandingAmount);
        newAllocations[inv.invoiceNumber] = allocate;
        remaining -= allocate;
      }
    });
    
    setAllocations(newAllocations);
  }, [formData.amountReceived, outstandingInvoices, isSalesModuleImplemented]);

  const handleAllocationChange = (invoiceNumber, value) => {
    const val = parseFloat(value) || 0;
    setAllocations(prev => ({
      ...prev,
      [invoiceNumber]: val
    }));
  };

  const allocationSummary = useMemo(() => {
    const received = parseFloat(formData.amountReceived) || 0;
    let allocated = 0;
    Object.values(allocations).forEach(val => allocated += (parseFloat(val) || 0));
    return {
      received,
      allocated,
      remaining: received - allocated
    };
  }, [formData.amountReceived, allocations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partyId) return toast.error('Please select a party');
    if (!formData.transactionId.trim()) return toast.error('Transaction ID is required');
    if (!formData.amountReceived || parseFloat(formData.amountReceived) <= 0) return toast.error('Amount Received must be > 0');

    if (isSalesModuleImplemented && outstandingInvoices.length > 0) {
      if (allocationSummary.allocated > allocationSummary.received) {
        return toast.error('Total allocation cannot exceed payment amount.');
      }
      for (const inv of outstandingInvoices) {
        const alloc = allocations[inv.invoiceNumber] || 0;
        if (alloc > inv.outstandingAmount) {
          return toast.error(`Allocated amount cannot exceed outstanding for ${inv.invoiceNumber}`);
        }
      }
    }

    setSaving(true);
    try {
      const payload = {
        partyId: parseInt(formData.partyId),
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate,
        amountReceived: parseFloat(formData.amountReceived),
        notes: formData.notes
        // allocations could be sent here in the future
      };

      if (isEditing) {
        await incomingService.updatePayment(initialData.id, payload);
        toast.success('Payment updated successfully');
      } else {
        await incomingService.createPayment(payload);
        toast.success('Payment recorded successfully');
      }
      onSave();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data) {
        Object.values(error.response.data).forEach(msg => toast.error(msg));
      } else {
        toast.error('Failed to save payment');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all";
  const labelClass = "text-xs text-textMuted mb-1.5 block";

  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loadingInitial) {
    return <div className="p-8 text-center text-textMuted bg-surface rounded-2xl border border-border animate-pulse">Loading form data...</div>;
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-in fade-in duration-200">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">
            {isEditing ? 'Edit payment' : 'Add new payment'}
          </h3>
          <button type="button" onClick={onClose} className="text-textMuted hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Top Section */}
        <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1 col-span-1">
            <label className={labelClass}>Company / Party</label>
            <select required value={formData.partyId} onChange={handlePartyChange} className={inputClass}>
              <option value="">-- Select Party --</option>
              {parties.map(p => (
                <option key={p.id} value={p.id}>{p.companyName}</option>
              ))}
            </select>
            <div className="pt-1">
              <button type="button" onClick={() => navigate('/company-party')} className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1">
                + Add new party instead
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Payment Date</label>
            <input required type="date" value={formData.paymentDate} onChange={e => setFormData(p => ({...p, paymentDate: e.target.value}))} className={inputClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Transaction ID</label>
            <input required type="text" value={formData.transactionId} onChange={e => setFormData(p => ({...p, transactionId: e.target.value}))} placeholder="UTR2607261847" className={inputClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Amount Received</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted text-sm">₹</span>
              <input required type="number" min="0.01" step="0.01" value={formData.amountReceived} onChange={e => setFormData(p => ({...p, amountReceived: e.target.value}))} placeholder="85000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>

        {/* Invoice Allocation */}
        <div className="px-5 py-4 border-t border-border bg-white/[0.01]">
          <h4 className="text-sm font-medium text-white mb-4">Invoice Allocation</h4>
          
          {!isSalesModuleImplemented ? (
            <div className="border border-border rounded-lg p-8 text-center bg-surface">
              <p className="text-sm text-textMuted">Invoice allocation will be available after Sales module implementation.</p>
            </div>
          ) : !formData.partyId ? (
            <div className="border border-border rounded-lg p-8 text-center bg-surface">
              <p className="text-sm text-textMuted">Select a company to view outstanding invoices.</p>
            </div>
          ) : loadingInvoices ? (
             <div className="border border-border rounded-lg p-8 text-center bg-surface">
              <p className="text-sm text-textMuted">Loading invoices...</p>
            </div>
          ) : outstandingInvoices.length === 0 ? (
            <div className="border border-border rounded-lg p-8 text-center bg-surface">
              <p className="text-sm text-emerald-400 font-medium mb-1">✅ All invoices are fully paid.</p>
              <p className="text-xs text-textMuted">No outstanding invoices.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-background/50 border-b border-border">
                      <th className="px-4 py-2 font-semibold text-textMuted uppercase tracking-wider">Invoice Number</th>
                      <th className="px-4 py-2 font-semibold text-textMuted uppercase tracking-wider">Invoice Date</th>
                      <th className="px-4 py-2 font-semibold text-textMuted uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-2 font-semibold text-textMuted uppercase tracking-wider text-right">Outstanding Amount</th>
                      <th className="px-4 py-2 font-semibold text-textMuted uppercase tracking-wider text-right w-32">Allocate Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {outstandingInvoices.map((inv, idx) => {
                      const allocAmount = allocations[inv.invoiceNumber] || '';
                      const isOverAllocated = parseFloat(allocAmount) > inv.outstandingAmount;
                      
                      return (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-medium text-white">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3 text-textMuted">{dayjs(inv.invoiceDate).format('DD MMM YYYY')}</td>
                          <td className="px-4 py-3 text-textMuted">{dayjs(inv.dueDate || inv.invoiceDate).format('DD MMM YYYY')}</td>
                          <td className="px-4 py-3 text-right text-white">{formatMoney(inv.outstandingAmount)}</td>
                          <td className="px-4 py-2">
                            <input 
                              type="number" 
                              value={allocAmount}
                              onChange={(e) => handleAllocationChange(inv.invoiceNumber, e.target.value)}
                              className={`w-full bg-background border ${isOverAllocated ? 'border-red-500' : 'border-border'} rounded text-right px-2 py-1.5 text-xs text-white focus:border-primary outline-none transition-colors`} 
                              placeholder="0" 
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-background border border-border rounded-lg p-4 text-xs space-y-2 min-w-[250px]">
                  <div className="flex justify-between text-textMuted">
                    <span>Amount Received:</span>
                    <span className="font-medium text-white">{formatMoney(allocationSummary.received)}</span>
                  </div>
                  <div className="flex justify-between text-textMuted">
                    <span>Allocated:</span>
                    <span className="font-medium text-emerald-400">{formatMoney(allocationSummary.allocated)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-2 mt-1">
                    <span className="text-textMuted">Remaining:</span>
                    <span className={allocationSummary.remaining < 0 ? 'text-red-400' : 'text-white'}>
                      {formatMoney(allocationSummary.remaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 flex justify-between items-center bg-white/[0.02] border-t border-border">
          <button type="button" onClick={() => navigate('/company-party')} className="px-4 py-1.5 text-xs text-textMuted hover:text-white bg-transparent border border-border hover:bg-white/5 rounded transition-colors">
            + Add New Party
          </button>
          
          <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5">
            ✓ {isEditing ? 'Update Payment' : 'Add Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;
