import React, { useState } from 'react';
import { 
  BadgeDollarSign, 
  Save, 
  Plus, 
  Trash2, 
  Globe, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Calculator,
  Percent,
  Edit3,
  Search
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
const initialRules = [
  { id: 1, region: 'Global', type: 'GST', rate: '18%', status: true },
  { id: 2, region: 'India', type: 'Fixed', rate: '5%', status: true },
  { id: 3, region: 'Europe', type: 'VAT', rate: '12%', status: false },
];
const TaxGstPage = () => {
  const [rules, setRules] = useState(initialRules);
  const [newRule, setNewRule] = useState({ region: '', type: 'GST', rate: '18%' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.region) return;

    if (editingId) {
      setRules(rules.map(r => r.id === editingId ? { ...r, ...newRule } : r));
      setSuccessMessage('Rule updated successfully');
      setEditingId(null);
    } else {
      const id = Date.now();
      setRules([{ id, ...newRule, status: true }, ...rules]);
      setSuccessMessage('New rule activated');
    }

    setNewRule({ region: '', type: 'GST', rate: '18%' });
    setShowAddForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const startEdit = (rule) => {
    setNewRule({ region: rule.region, type: rule.type, rate: rule.rate });
    setEditingId(rule.id);
    setShowAddForm(true);
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const toggleStatus = (id) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, status: !rule.status } : rule
    ));
  };
  const filteredRules = rules.filter(r => r.region.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in transition-all duration-500 pb-20">
      {successMessage && (
        <div className="fixed top-24 right-8 z-[100] animate-slide-in-right">
           <div className="flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-500/20">
              <ShieldCheck size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{successMessage}</span>
           </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
             22 System Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-none">Tax & <span className="text-admin-primary-600">GST Compliance</span></h1>
          <p className="text-sm text-surface-500 font-medium">Manage regional taxation rules and global compliance parameters.</p>
        </div>
        <Button variant="primary" icon={editingId ? Edit3 : Plus} onClick={() => {
          if (showAddForm && editingId) {
            setEditingId(null);
            setNewRule({ region: '', type: 'GST', rate: '18%' });
          }
          setShowAddForm(!showAddForm);
        }}>
          {showAddForm ? 'Close Workspace' : editingId ? 'Continue Editing' : 'Configure Rule'}
        </Button>
      </div>
      {showAddForm && (
        <section className="bg-white dark:bg-surface-800 border-2 border-admin-primary-500/20 rounded-[2.5rem] p-10 animate-slide-up shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-admin-primary-100/30 dark:bg-admin-primary-900/10 blur-[100px] rounded-full -mr-32 -mt-32" />
           <form onSubmit={handleAddRule} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Jurisdiction</label>
                 <input 
                    required
                    value={newRule.region}
                    onChange={(e) => setNewRule({...newRule, region: e.target.value})}
                    placeholder="e.g. Maharashtra" 
                    className="w-full px-5 py-4 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm dark:text-white transition-all shadow-sm" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Tax Type</label>
                 <select 
                   value={newRule.type}
                   onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                   className="w-full px-5 py-4 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm dark:text-white transition-all shadow-sm appearance-none"
                 >
                    <option>GST</option>
                    <option>VAT</option>
                    <option>Sales Tax</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Tax Percentage</label>
                 <input 
                    required
                    value={newRule.rate}
                    onChange={(e) => setNewRule({...newRule, rate: e.target.value})}
                    placeholder="e.g. 18%" 
                    className="w-full px-5 py-4 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm dark:text-white transition-all shadow-sm" 
                 />
              </div>
              <Button type="submit" variant="primary" className="py-4 shadow-lg shadow-admin-primary-500/20" icon={editingId ? Save : ShieldCheck}>
                {editingId ? 'Update Jurisdiction' : 'Activate Rule'}
              </Button>
           </form>
        </section>
      )}
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden">
        <div className="p-8 border-b border-surface-100 dark:border-surface-700 flex flex-col md:flex-row justify-between items-center gap-6">
           <h3 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight leading-none">Tax Rule Engine</h3>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
              <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search jurisdictions..." 
                 className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-admin-primary-500/10 text-xs font-bold transition-all shadow-inner"
              />
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50/50 dark:bg-surface-900/30">
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">SL</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Region / Jurisdiction</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Classification</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Percentage</th>
                  <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Enforcement</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
                {filteredRules.map((rule, idx) => (
                  <tr key={rule.id} className="group hover:bg-surface-25 dark:hover:bg-surface-900/10 transition-colors">
                    <td className="px-10 py-7 font-black text-surface-400 text-xs">{idx + 1}</td>
                    <td className="px-6 py-7 font-black text-surface-900 dark:text-white uppercase tracking-wider text-xs">{rule.region}</td>
                    <td className="px-6 py-7">
                       <div className="px-3 py-1 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface-100 dark:border-surface-700 w-fit">
                          <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">{rule.type}</span>
                       </div>
                    </td>
                    <td className="px-6 py-7 font-extrabold text-admin-primary-600 dark:text-admin-primary-400 text-sm">{rule.rate}</td>
                    <td className="px-6 py-7 text-center">
                      <button 
                        onClick={() => toggleStatus(rule.id)}
                        className="relative rounded-full transition-all duration-300 focus:outline-none shadow-sm mx-auto flex items-center justify-center p-0"
                        style={{ width: '50px', height: '28px', backgroundColor: rule.status ? '#4F46E5' : '#D1D5DB' }}
                      >
                        <div 
                          className="absolute bg-white rounded-full shadow-md transition-all duration-300 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; flex items-center justify-center"
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            top: '2px', 
                            left: '2px',
                            position: 'absolute',
                            transform: rule.status ? 'translateX(22px)' : 'translateX(0)' 
                          }}
                        >
                          <div 
                            className="rounded-full transition-all duration-300" 
                            style={{ 
                              width: '6px', 
                              height: '6px', 
                              backgroundColor: rule.status ? '#4F46E5' : 'transparent',
                              transform: rule.status ? 'scale(1)' : 'scale(0)'
                            }} 
                          />
                        </div>
                        {rule.status && (
                          <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] pointer-events-none" />
                        )}
                      </button>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                         <button onClick={() => startEdit(rule)} className="p-3 hover:bg-white dark:hover:bg-surface-700 rounded-2xl text-surface-300 hover:text-admin-primary-600 transition-all border border-transparent shadow-sm">
                            <Edit3 size={18} />
                         </button>
                        <button onClick={() => deleteRule(rule.id)} className="p-3 hover:bg-white dark:hover:bg-surface-700 rounded-2xl text-surface-300 hover:text-red-500 transition-all border border-transparent shadow-sm">
                           <Trash2 size={18} />
                        </button>
                     </div>
                   </td>
                 </tr>
               ))}
               {filteredRules.length === 0 && (
                 <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-black uppercase text-surface-300 tracking-[0.3em]">No tax rules defined for this search scope</td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};
export default TaxGstPage;
