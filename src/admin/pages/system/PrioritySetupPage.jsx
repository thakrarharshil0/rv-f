import React, { useState } from 'react';
import { 
  Pin, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  RotateCcw, 
  Info,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';

const initialItems = [
  { id: 1, name: 'Eco-Friendly Yoga Mats', category: 'Categories', currentRank: 1, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Premium Dumbbells', category: 'Products', currentRank: 2, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Resistance Bands', category: 'Flash Deals', currentRank: 3, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Fitness Apparel', category: 'Featured', currentRank: 4, image: 'https://images.unsplash.com/photo-1548330750-612b5d0f5028?auto=format&fit=crop&q=80&w=100' },
];

const PrioritySetupPage = () => {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState('All');
  const [isPublishing, setIsPublishing] = useState(false);

  const move = (id, direction) => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.category === activeTab);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => setIsPublishing(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            23 Priority Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Display <span className="text-admin-primary-600">Priorities</span></h1>
          <p className="text-sm text-surface-500 max-w-lg">Control the visual hierarchy of your catalog. Items at the top receive maximum user exposure.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={RotateCcw} onClick={() => setItems(initialItems)}>Reset Order</Button>
          <Button variant="primary" icon={isPublishing ? CheckCircle2 : Save} onClick={handlePublish} className={isPublishing ? 'bg-green-600 h-auto' : ''}>
            {isPublishing ? 'Priorities Updated' : 'Publish Priority'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 w-fit">
        {['All', 'Categories', 'Brands', 'Services', 'Products'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/25' : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.4fr] gap-8">
        <section className="space-y-3">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="group bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-4 transition-all hover:shadow-xl hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50"
            >
              <div className="flex items-center gap-3">
                 <button className="text-surface-300 dark:text-surface-600 cursor-grab active:cursor-grabbing hover:text-admin-primary-500 transition-colors">
                   <GripVertical size={20} />
                 </button>
                 <div className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-700 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className="text-sm sm:text-base font-black text-surface-900 dark:text-white uppercase tracking-tight truncate">{item.name}</h3>
                   <span className="shrink-0 px-2 py-0.5 rounded-lg bg-surface-100 dark:bg-surface-900 text-[10px] font-black uppercase tracking-widest text-surface-500">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className={`p-1 rounded bg-green-50 dark:bg-green-900/20 text-green-600`}>
                      <TrendingUp size={10} />
                   </div>
                   <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Efficiency index: 94%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => move(item.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-400 hover:text-admin-primary-600 transition-colors disabled:opacity-20"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => move(item.id, 'down')}
                    disabled={index === filteredItems.length - 1}
                    className="p-1.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-400 hover:text-admin-primary-600 transition-colors disabled:opacity-20"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center font-black text-admin-primary-600 shadow-inner">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-20 text-center space-y-4 bg-surface-50 dark:bg-surface-900/50 rounded-[3rem] border border-dashed border-surface-200 dark:border-surface-700">
               <div className="p-4 bg-white dark:bg-surface-800 rounded-2xl w-fit mx-auto shadow-sm text-surface-400">
                  <Info size={32} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-surface-900 dark:text-white uppercase tracking-tight">No Items Found</h3>
                  <p className="text-xs text-surface-500 uppercase tracking-widest font-bold">Try selecting a different category filter</p>
               </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
           <div className="p-8 bg-surface-900 rounded-[2rem] text-white shadow-2xl shadow-admin-primary-500/10">
              <div className="flex items-center gap-3 mb-5">
                 <div className="w-12 h-12 rounded-2xl bg-admin-primary-600 flex items-center justify-center text-white shadow-lg shadow-admin-primary-500/30 font-bold">
                    <Pin size={22} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">Pin Priorities</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Surface management</p>
                 </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-medium mb-6">Dragging and reordering items will immediately change their sequence on the customer-facing frontend once you hit <b>Publish</b>.</p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                 <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">AI Suggestion</span>
                 </div>
                 <p className="text-[10px] text-white/50 leading-loose">Move <b>Eco-Friendly Yoga Mats</b> to Rank #1 based on this week's search surge.</p>
              </div>
           </div>

           <div className="p-8 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2rem] shadow-card">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 rounded-xl bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600">
                    <Info size={18} />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-surface-900 dark:text-white">Helpful Docs</h3>
              </div>
              <ul className="space-y-4">
                 {['How rank affects CTR', 'Pinned vs Dynamic sorting', 'Regional priority rules'].map(topic => (
                    <li key={topic}>
                       <button className="flex items-center justify-between w-full group">
                          <span className="text-xs font-bold text-surface-500 group-hover:text-admin-primary-600 transition-colors uppercase tracking-widest">{topic}</span>
                          <ChevronRight size={14} className="text-surface-300 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </li>
                 ))}
              </ul>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PrioritySetupPage;
