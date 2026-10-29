import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Info,
  FileText,
  Trash2,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { businessPages } from '../../../lib/api';
import { toast } from 'sonner';

const BusinessPages = () => {
  const [activeTab, setActiveTab] = useState('Page Setup');
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await businessPages.list();
      console.log('Fetched Data:', data);
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Pages Error:', error);
      toast.error(error.message || 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleAddPage = async (e) => {
    e.preventDefault();
    if (!newPageName) return;
    setIsCreating(true);
    try {
      await businessPages.create({ title: newPageName });
      toast.success('Page created successfully');
      setNewPageName('');
      setShowAddForm(false);
      fetchPages();
    } catch (error) {
      toast.error('Failed to create page');
    } finally {
      setIsCreating(false);
    }
  };

  const deletePage = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await businessPages.delete(id);
      toast.success('Page deleted');
      fetchPages();
    } catch (error) {
      toast.error(error.message || 'Failed to delete page');
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await businessPages.update(id, { is_active: !currentStatus });
      toast.success('Status updated');
      fetchPages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
             Pages & Media Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-none">Business <span className="text-admin-primary-600">Pages</span></h1>
          <p className="text-sm text-surface-500 font-medium">Manage your legal documentations and brand stories.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAddForm(!showAddForm)}>Add New Page</Button>
      </div>

      {showAddForm && (
        <section className="bg-white dark:bg-surface-800 border-2 border-admin-primary-500/20 rounded-[2.5rem] p-8 animate-slide-up shadow-xl">
           <form onSubmit={handleAddPage} className="flex gap-4 items-center">
              <div className="flex-1 relative">
                 <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                 <input 
                    required
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Page Name (e.g. Terms of Service)" 
                    className="w-full pl-12 pr-6 py-4 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm" 
                 />
              </div>
               <Button type="submit" variant="primary" className="py-4 px-10" disabled={isCreating}>
                  {isCreating ? <Loader2 className="animate-spin" /> : 'Create Page'}
               </Button>
            </form>
         </section>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[1.25rem] w-fit shadow-sm">
        {['Page Setup', 'FAQ', 'Our Commitments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/25' : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-admin-primary-50 to-white dark:from-admin-primary-900/10 dark:to-surface-800 border border-admin-primary-100 dark:border-admin-primary-900/20 rounded-[2rem]">
         <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-900 text-admin-primary-600 shadow-sm">
            <Info size={20} />
         </div>
         <p className="text-xs font-black text-admin-primary-900 dark:text-admin-primary-100 uppercase tracking-widest leading-loose">Central Management Console: Control the visibility and content of your business policy architecture.</p>
      </div>

      {/* Page List Section */}
      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-surface-100 dark:border-surface-700 flex flex-col md:flex-row gap-6 items-center justify-between">
           <h2 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight leading-none">Business Document List</h2>
           
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
              <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search documents..." 
                 className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-admin-primary-500/10 text-xs font-bold transition-all shadow-inner"
              />
           </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
           {loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="w-10 h-10 text-admin-primary-600 animate-spin" />
                 <p className="text-sm font-black uppercase tracking-widest text-surface-400">Syncing with Cloud...</p>
              </div>
           )}
           <table className="w-full text-sm">
             <thead>
               <tr className="bg-surface-50/50 dark:bg-surface-900/30">
                 <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">SL</th>
                 <th className="px-4 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Policy Name</th>
                 <th className="px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Status</th>
                 <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Operations</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
               {filteredPages.map((page, idx) => (
                 <tr key={page.id} className="group hover:bg-surface-25 dark:hover:bg-surface-900/10 transition-colors">
                   <td className="px-8 py-6 font-bold text-surface-400">{idx + 1}</td>
                   <td className="px-4 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center text-admin-primary-600 transition-transform group-hover:scale-110">
                           <FileText size={18} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-surface-900 dark:text-white uppercase tracking-wider text-xs">{page.title}</span>
                          {page.is_default && (
                            <span className="px-2 py-0.5 rounded-lg bg-admin-primary-50 dark:bg-admin-primary-900/20 text-[8px] font-black text-admin-primary-600 uppercase tracking-[0.2em]">Default</span>
                          )}
                        </div>
                      </div>
                   </td>
                   <td className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <button 
                          onClick={() => toggleAvailability(page.id, page.is_active)}
                          className={`relative w-[52px] h-[28px] mx-auto rounded-full transition-all duration-500 flex items-center px-1 ${page.is_active ? 'bg-[#5D8BF4] shadow-[0_0_15px_rgba(93,139,244,0.3)]' : 'bg-surface-300 dark:bg-surface-700 opacity-60'}`}
                        >
                          <div className={`w-[20px] h-[20px] rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-&lsqb;cubic-bezier(0.34,1.56,0.64,1)&rsqb; ${page.is_active ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${page.is_active ? 'text-[#5D8BF4]' : 'text-surface-400'}`}>
                           {page.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                     <div className="flex justify-end gap-2">
                        <button className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-300 hover:text-admin-primary-600 transition-all border border-transparent hover:border-surface-100 dark:hover:border-surface-700">
                           <Eye size={16} />
                        </button>
                        {!page.is_default && (
                          <button onClick={() => deletePage(page.id)} className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-300 hover:text-red-500 transition-all border border-transparent hover:border-surface-100 dark:hover:border-surface-700">
                             <Trash2 size={16} />
                          </button>
                        )}
                        <button className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-300 hover:text-admin-primary-600 transition-all border border-transparent hover:border-surface-100 dark:hover:border-surface-700">
                           <Edit3 size={16} />
                        </button>
                     </div>
                   </td>
                 </tr>
               ))}
               {!loading && filteredPages.length === 0 && (
                  <tr>
                     <td colSpan={4} className="px-8 py-10 text-center text-surface-400 font-bold uppercase tracking-widest text-[10px]">
                        No documents found
                     </td>
                  </tr>
               )}
             </tbody>
           </table>
        </div>
      </section>
    </div>
  );
};

export default BusinessPages;
