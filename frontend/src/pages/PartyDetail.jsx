import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Printer, X, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import partyService from '../api/partyService';
import toast from 'react-hot-toast';

const PartyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyTxn = {
    transactionType: 'SALE',
    referenceNumber: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  };
  const [txnForm, setTxnForm] = useState(emptyTxn);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, l] = await Promise.all([
        partyService.getPartySummary(id),
        partyService.getPartyLedger(id)
      ]);
      setSummary(s);
      setLedger(l);
    } catch {
      toast.error('Failed to load party details');
      navigate('/company-party');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handlePrintLedger = async () => {
    setPdfLoading(true);
    try {
      const blob = await partyService.downloadLedgerPdf(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ledger-${summary?.party?.companyName || 'party'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Ledger PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleTxnChange = (e) => {
    const { name, value } = e.target;
    setTxnForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTxnSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await partyService.createTransaction(id, {
        ...txnForm,
        amount: parseFloat(txnForm.amount)
      });
      toast.success('Transaction added!');
      setTxnForm(emptyTxn);
      setShowModal(false);
      loadData();
    } catch (error) {
      if (error.response?.data) {
        const d = error.response.data;
        if (d.error) toast.error(d.error);
        else Object.values(d).forEach(msg => toast.error(msg));
      } else {
        toast.error('Failed to save transaction');
      }
    } finally {
      setSaving(false);
    }
  };

  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v || 0);

  const getTypeBadge = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('sale')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (t.includes('payment received')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (t.includes('purchase')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (t.includes('payment sent')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (t.includes('expense')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (t.includes('refund')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-white/5 text-textMuted border-white/10';
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded-lg w-64"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl"></div>)}
          </div>
          <div className="h-64 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!summary) return null;
  const { party } = summary;

  const cards = [
    { title: 'Total Sales', value: summary.totalSales, bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { title: 'Total Received', value: summary.totalReceived, bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400' },
    { title: 'Pending', value: summary.pendingAmount, bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400' },
    { title: 'Due', value: summary.dueAmount, bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', text: 'text-red-400' },
  ];

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all";

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/company-party')} className="mt-1 p-2 rounded-lg bg-surface border border-border text-textMuted hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{party.companyName}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-sm text-textMuted">
              <span className="font-mono">{party.gstin}</span>
              {party.companyAddress && <><span>·</span><span>{party.companyAddress}</span></>}
              {party.phoneNo && <><span>·</span><span>{party.phoneNo}</span></>}
              {party.email && <><span>·</span><span>{party.email}</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/company-party/${id}/items`)} className="bg-surface border border-border hover:bg-white/5 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
            <Package size={16} /> Items
          </button>
          <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm shadow-lg shadow-primary/20">
            <Plus size={16} /> Add Transaction
          </button>
          <button onClick={handlePrintLedger} disabled={pdfLoading} className="bg-surface border border-border hover:bg-white/5 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm disabled:opacity-50">
            <Printer size={16} /> {pdfLoading ? 'Downloading...' : 'Print Ledger'}
          </button>
        </div>
      </div>

      {/* KPI Cards — colored gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.title} className={`bg-gradient-to-br ${c.bg} rounded-2xl p-5 border ${c.border} flex flex-col gap-2`}>
            <h3 className="text-sm font-medium text-textMuted">{c.title}</h3>
            <span className={`text-2xl md:text-3xl font-bold ${c.text}`}>{fmt(c.value)}</span>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-bold text-white">Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                {['Date', 'Type', 'Reference', 'Debit', 'Credit', 'Balance'].map(c => (
                  <th key={c} className="px-6 py-3.5 bg-white/[0.02] text-xs font-semibold text-textMuted uppercase tracking-wider border-b border-border">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ledger.length > 0 ? ledger.map(entry => (
                <tr key={entry.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getTypeBadge(entry.type)}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-textMuted font-mono">{entry.reference}</td>
                  <td className="px-6 py-4 text-sm text-danger font-medium">{entry.debit > 0 ? fmt(entry.debit) : '—'}</td>
                  <td className="px-6 py-4 text-sm text-success font-medium">{entry.credit > 0 ? fmt(entry.credit) : '—'}</td>
                  <td className="px-6 py-4 text-sm text-white font-bold">{fmt(entry.balance)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-textMuted">No transactions yet.</p>
                    <p className="text-xs text-textMuted mt-1">Click "Add Transaction" to create your first transaction.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Transaction</h3>
              <button onClick={() => { setShowModal(false); setTxnForm(emptyTxn); }} className="p-1 text-textMuted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleTxnSave} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Transaction Type *</label>
                <select name="transactionType" value={txnForm.transactionType} onChange={handleTxnChange} className={inputClass}>
                  <option value="SALE">Sale</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="PAYMENT_RECEIVED">Payment Received</option>
                  <option value="PAYMENT_SENT">Payment Sent</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="REFUND">Refund</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Reference Number</label>
                  <input name="referenceNumber" value={txnForm.referenceNumber} onChange={handleTxnChange} type="text" placeholder="e.g. INV-001" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Amount (₹) *</label>
                  <input required name="amount" value={txnForm.amount} onChange={handleTxnChange} type="number" min="1" step="0.01" placeholder="0.00" className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Date *</label>
                <input required name="transactionDate" value={txnForm.transactionDate} onChange={handleTxnChange} type="date" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Description</label>
                <textarea name="description" value={txnForm.description} onChange={handleTxnChange} rows="2" placeholder="Optional notes..." className={`${inputClass} resize-none`}></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setTxnForm(emptyTxn); }} className="px-4 py-2 text-sm text-textMuted hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyDetail;
