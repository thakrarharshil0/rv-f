import React, { useState } from 'react';
import { 
  Share2, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Info,
  ChevronRight,
  TrendingUp,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const initialSocials = [
  { id: 1, name: 'facebook', link: 'https://facebook.com', status: true },
  { id: 2, name: 'instagram', link: 'https://www.instagram.com', status: true },
  { id: 3, name: 'pinterest', link: 'https://www.pinterest.com', status: true },
  { id: 4, name: 'linkedin', link: 'https://www.linkedin.com', status: true },
  { id: 5, name: 'twitter', link: 'https://www.twitter.com', status: true },
];

const SocialMediaLinksPage = () => {
  const [socials, setSocials] = useState(initialSocials);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPlatform || !socialLink) return;
    const id = Date.now();
    setSocials([{ id, name: selectedPlatform, link: socialLink, status: true }, ...socials]);
    setSelectedPlatform('');
    setSocialLink('');
  };

  const deleteSocial = (id) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const toggleStatus = (id) => {
    setSocials(prev => prev.map(social => 
      social.id === id ? { ...social, status: !social.status } : social
    ));
  };

  const filteredSocials = socials.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
             Pages & Media Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-none">Social <span className="text-admin-primary-600">Connectivity</span></h1>
          <p className="text-sm text-surface-500 font-medium">Link your platform to global social networks.</p>
        </div>
      </div>

      {/* Setup Form */}
      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card p-10 group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-admin-primary-100/30 dark:bg-admin-primary-900/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
           <div className="mb-10">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">Configure New Integration</h2>
              <p className="text-xs text-surface-500 font-black mt-2 uppercase tracking-widest leading-loose">Establish a direct link between your customer base and your brand's social identity.</p>
           </div>

           <form onSubmit={handleSave} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] pl-1">
                   Platform Identity
                 </label>
                 <select 
                   required
                   value={selectedPlatform}
                   onChange={(e) => setSelectedPlatform(e.target.value)}
                   className="w-full px-6 py-5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm dark:text-white cursor-pointer transition-all appearance-none shadow-sm"
                 >
                   <option value="">Select social media</option>
                   <option value="facebook">Facebook</option>
                   <option value="instagram">Instagram</option>
                   <option value="twitter">Twitter</option>
                   <option value="linkedin">LinkedIn</option>
                   <option value="pinterest">Pinterest</option>
                   <option value="youtube">YouTube</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] pl-1">
                   Target URL Location
                 </label>
                 <div className="relative group">
                   <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
                   <input 
                     required
                     type="url" 
                     value={socialLink}
                     onChange={(e) => setSocialLink(e.target.value)}
                     placeholder="https://platform.com/brand" 
                     className="w-full pl-14 pr-6 py-5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-admin-primary-500/10 font-bold text-sm dark:text-white transition-all shadow-sm"
                   />
                 </div>
               </div>
             </div>

             <div className="flex justify-end gap-3 pt-6">
               <Button type="button" variant="secondary" icon={RotateCcw} onClick={() => { setSelectedPlatform(''); setSocialLink(''); }}>Reset Form</Button>
               <Button type="submit" variant="primary" icon={Save} className="px-12 py-5 shadow-2xl shadow-admin-primary-500/20">Sync Integration</Button>
             </div>
           </form>
        </div>
      </section>

      {/* Social Media Link List */}
      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden transition-all duration-500">
        <div className="p-10 border-b border-surface-100 dark:border-surface-700 flex flex-col md:flex-row justify-between items-center gap-6">
           <h2 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight leading-none">Global Connectivity Matrix</h2>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
              <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search endpoints..." 
                 className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-admin-primary-500/10 text-xs font-bold transition-all shadow-inner"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead>
               <tr className="bg-surface-50/50 dark:bg-surface-900/30">
                 <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">SI</th>
                 <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Network Name</th>
                 <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Resolution Endpoint</th>
                 <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Transmission Status</th>
                 <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
               {filteredSocials.map((social, idx) => (
                 <tr key={social.id} className="group hover:bg-surface-25 dark:hover:bg-surface-900/10 transition-colors">
                   <td className="px-10 py-7 font-black text-surface-400 text-xs">{idx + 1}</td>
                   <td className="px-6 py-7">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-admin-primary-50 dark:bg-admin-primary-900/20 flex items-center justify-center text-admin-primary-600 font-black uppercase transition-transform group-hover:scale-110">
                            {social.name.charAt(0)}
                         </div>
                         <span className="font-black text-surface-900 dark:text-white uppercase tracking-wider text-xs">{social.name}</span>
                      </div>
                   </td>
                   <td className="px-6 py-7 text-surface-500 dark:text-surface-400 font-black tracking-tight text-xs">{social.link}</td>
                   <td className="px-6 py-7 text-center">
                     <button 
                       onClick={() => toggleStatus(social.id)}
                       className={`relative w-[64px] h-[34px] mx-auto rounded-full transition-all duration-500 flex items-center px-1.5 focus:outline-none ${social.status ? 'bg-[#5D8BF4] shadow-[0_0_20px_rgba(93,139,244,0.3)]' : 'bg-[#4B5563] dark:bg-surface-700 opacity-60'}`}
                     >
                       <div className={`w-[22px] h-[22px] rounded-full bg-white shadow-xl transform transition-transform duration-500 ease-&lsqb;cubic-bezier(0.34,1.56,0.64,1)&rsqb; ${social.status ? 'translate-x-[28px]' : 'translate-x-0'}`} />
                     </button>
                   </td>
                   <td className="px-10 py-7 text-right">
                     <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button className="p-3 hover:bg-white dark:hover:bg-surface-700 rounded-2xl text-surface-300 hover:text-admin-primary-600 transition-all border border-transparent shadow-sm hover:shadow-md">
                           <Edit3 size={18} />
                        </button>
                        <button onClick={() => deleteSocial(social.id)} className="p-3 hover:bg-white dark:hover:bg-surface-700 rounded-2xl text-surface-300 hover:text-red-500 transition-all border border-transparent shadow-sm hover:shadow-md">
                           <Trash2 size={18} />
                        </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaLinksPage;
