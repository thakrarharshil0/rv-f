import React, { useState } from 'react';
import { 
  TrendingUp, 
  Save, 
  Plus, 
  Zap, 
  Settings2, 
  Code2, 
  ShieldCheck, 
  LineChart, 
  MousePointer2, 
  BarChart3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import Button from '../../components/ui/Button';

const MarketingCard = ({ title, subtitle, icon: Icon, active, onToggle, children }) => (
  <div className={`p-8 bg-white dark:bg-surface-800 border rounded-[2.5rem] shadow-card transition-all duration-300 ${active ? 'border-admin-primary-300 dark:border-admin-primary-800' : 'border-surface-200 dark:border-surface-700'}`}>
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600' : 'bg-surface-50 dark:bg-surface-900 text-surface-400'}`}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black text-surface-900 dark:text-white uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] sm:text-xs text-surface-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 ${active ? 'bg-admin-primary-600' : 'bg-surface-200 dark:bg-surface-700'}`}
      >
        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
    
    <div className="space-y-4">
       {children}
    </div>
  </div>
);

const MarketingToolsPage = () => {
  const [tools, setTools] = useState({
    pixel: true,
    ga: true,
    gtm: false,
    hotjar: false
  });

  const toggle = (key) => setTools(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            27 System Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Growth <span className="text-admin-primary-600">Engines</span></h1>
          <p className="text-sm text-surface-500 max-w-lg">Accelerate your brand growth with advanced data tracking and marketing analytics integrations.</p>
        </div>
        <Button variant="primary" icon={Save} className="shadow-lg shadow-admin-primary-500/20 py-4">Sync Marketing Stack</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MarketingCard 
          title="Facebook Pixel" 
          subtitle="Conversion Tracking" 
          icon={Code2} 
          active={tools.pixel} 
          onToggle={() => toggle('pixel')}
        >
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Pixel ID</label>
             <input type="text" placeholder="e.g. 10928374655" className="w-full px-5 py-3.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-2 focus:ring-admin-primary-500/20 font-bold transition-all text-sm dark:text-white" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
             <ShieldCheck size={14} /> Link verified and transmitting data
          </div>
        </MarketingCard>

        <MarketingCard 
          title="Google Analytics 4" 
          subtitle="Performance Insight" 
          icon={BarChart3} 
          active={tools.ga} 
          onToggle={() => toggle('ga')}
        >
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Measurement ID</label>
             <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-5 py-3.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-2 focus:ring-admin-primary-500/20 font-bold transition-all text-sm dark:text-white" />
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-admin-primary-600 hover:text-admin-primary-700 transition-colors">
             View Live Reports <ExternalLink size={14} />
          </button>
        </MarketingCard>

        <MarketingCard 
          title="Tag Manager" 
          subtitle="Container Management" 
          icon={Zap} 
          active={tools.gtm} 
          onToggle={() => toggle('gtm')}
        >
          <div className="space-y-1.5 opacity-60">
             <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">GTM Container ID</label>
             <input type="text" disabled placeholder="GTM-XXXXXXX" className="w-full px-5 py-3.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none font-bold text-sm dark:text-white cursor-not-allowed" />
          </div>
        </MarketingCard>

        <MarketingCard 
          title="User Behavior" 
          subtitle="Heatmaps & Recordings" 
          icon={MousePointer2} 
          active={tools.hotjar} 
          onToggle={() => toggle('hotjar')}
        >
          <div className="space-y-1.5 opacity-60">
             <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Hotjar Site ID</label>
             <input type="text" disabled placeholder="e.g. 5627182" className="w-full px-5 py-3.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none font-bold text-sm dark:text-white cursor-not-allowed" />
          </div>
        </MarketingCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
         <section className="p-10 bg-surface-900 rounded-[3rem] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-admin-primary-600/20 blur-[100px] rounded-full group-hover:bg-admin-primary-500/30 transition-all duration-700" />
            <div className="relative z-10 space-y-10">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-admin-primary-400">
                     <LineChart size={32} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-tight">Data Intelligence</h2>
                     <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Unified analytics propagation</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Sparkles size={16} className="text-amber-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Marketing Hub Recommendation</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">Activate <b>Tag Manager</b> to centralize your script management and improve page load speeds by up to 18%.</p>
                     </div>
                     <Button variant="primary" className="bg-white text-surface-900 hover:bg-surface-100 rounded-2xl py-4">Explore More Tools</Button>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5 flex flex-col justify-center">
                     {[
                       { label: 'Real-time Visitors', value: '1.2k', change: '+14%' },
                       { label: 'Conversion Rate', value: '4.8%', change: '+0.5%' }
                     ].map(stat => (
                        <div key={stat.label} className="flex items-baseline justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
                           <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black">{stat.value}</span>
                              <span className="text-[10px] font-bold text-green-400">{stat.change}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section className="p-10 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[3rem] shadow-card flex flex-col justify-between">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-admin-primary-50 dark:bg-admin-primary-900/20 rounded-2xl text-admin-primary-600">
                     <Settings2 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-surface-900 dark:text-white uppercase tracking-tight">Privacy Center</h3>
               </div>
               <p className="text-sm text-surface-500 leading-relaxed font-medium">Configure cookie consent and tracking transparency settings to comply with global data regulations.</p>
               <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-700">
                  <Info size={16} className="text-surface-400" />
                  <p className="text-xs text-surface-600 dark:text-surface-400 font-bold uppercase tracking-widest">GDPR & CCPA Compliant Mode: Active</p>
               </div>
            </div>
            <button className="mt-8 flex items-center justify-between w-full px-6 py-5 bg-surface-900 rounded-2xl text-white transition-all group">
               <span className="text-[10px] font-black uppercase tracking-widest">Manage Privacy Policy</span>
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </section>
      </div>
    </div>
  );
};

export default MarketingToolsPage;
