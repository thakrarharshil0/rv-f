import React from 'react';
import { 
  Files, 
  Globe, 
  MessageSquare, 
  Image as ImageIcon, 
  Share2, 
  ExternalLink, 
  ChevronRight,
  Shield,
  Layout,
  MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const HubCard = ({ title, subtitle, icon: Icon, path, count, color }) => (
  <Link to={path} className="group p-8 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card hover:shadow-2xl hover:shadow-admin-primary-500/10 transition-all duration-500 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-8">
      <div className={`w-16 h-16 rounded-[2rem] bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-2xl font-black text-surface-900 dark:text-white tracking-tighter">{count}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Total Entries</span>
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black text-surface-900 dark:text-white uppercase tracking-tight group-hover:text-admin-primary-600 transition-colors">{title}</h3>
      <p className="text-sm text-surface-500 leading-relaxed font-medium">{subtitle}</p>
    </div>
    <div className="mt-8 flex items-center justify-between">
      <div className="flex -space-x-2">
         {[1,2,3].map(i => (
           <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-800 bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-[10px] font-bold text-surface-400">
             {i}
           </div>
         ))}
      </div>
      <div className="w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center text-surface-400 group-hover:bg-admin-primary-600 group-hover:text-white transition-all duration-300">
         <ChevronRight size={20} />
      </div>
    </div>
  </Link>
);

const PagesMediaPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            24 Pages & Media
          </div>
          <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tight">Content <span className="text-admin-primary-600">Architecture</span></h1>
          <p className="text-base text-surface-500 max-w-xl">Manage your brand's digital presence across business documentation and social connection points.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HubCard 
          title="Business Pages" 
          subtitle="Configure Terms & Conditions, Privacy Policies, About Us, and more." 
          icon={Files} 
          path="/modules/business-pages"
          count="12"
          color="primary"
        />
        <HubCard 
          title="Social Connections" 
          subtitle="Sync your Facebook, Instagram, Twitter and other social growth channels." 
          icon={Share2} 
          path="/modules/social-media-links"
          count="6"
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <section className="lg:col-span-2 p-10 bg-surface-900 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-admin-primary-600/20 blur-[120px] rounded-full group-hover:bg-admin-primary-500/30 transition-all duration-700" />
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-admin-primary-400">
                     <Layout size={28} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-tight">Media Standards</h2>
                     <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Optimization & Security Guidelines</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-start gap-4">
                        <div className="mt-1 w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 shrink-0"><Shield size={14} /></div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-wider mb-1">Secure Hosting</h4>
                           <p className="text-xs text-white/50 leading-relaxed">All media assets are served via a global CDN with SSL propagation.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="mt-1 w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><ImageIcon size={14} /></div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-wider mb-1">Auto Compression</h4>
                           <p className="text-xs text-white/50 leading-relaxed">Smart algorithms optimize image sizes without losing 4K premium quality.</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 self-center">
                     <p className="text-xs text-white/70 leading-relaxed italic font-medium">"Consistent brand messaging across all digital touchpoints increases conversion rates by up to 23%."</p>
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-px bg-admin-primary-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-admin-primary-400">Marketing Insight</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[3rem] p-10 shadow-card flex flex-col justify-between group">
            <div className="space-y-4">
               <div className="p-3 bg-surface-50 dark:bg-surface-900 rounded-2xl w-fit">
                  <MousePointer2 size={24} className="text-admin-primary-600" />
               </div>
               <h3 className="text-xl font-black text-surface-900 dark:text-white uppercase tracking-tight">Quick Actions</h3>
               <div className="space-y-2">
                  {[
                    { label: 'Edit Privacy Policy', icon: Files },
                    { label: 'Update Instagram', icon: Share2 },
                    { label: 'Internal Links', icon: ExternalLink }
                  ].map((action, i) => (
                    <button key={i} className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-900 transition-all border border-transparent hover:border-surface-100 dark:hover:border-surface-700">
                       <div className="flex items-center gap-3">
                          <action.icon size={16} className="text-surface-400" />
                          <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-widest">{action.label}</span>
                       </div>
                       <ChevronRight size={14} className="text-surface-300" />
                    </button>
                  ))}
               </div>
            </div>
            <Button variant="outline" className="mt-8 border-dashed rounded-2xl py-6">
               Advanced Settings
            </Button>
         </section>
      </div>
    </div>
  );
};

export default PagesMediaPage;
