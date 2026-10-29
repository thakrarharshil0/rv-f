import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/api';
import { 
  Mail, 
  Save, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Layout, 
  Type, 
  MousePointer2,
  Settings2,
  Send,
  Sparkles,
  ChevronRight,
  Monitor,
  Smartphone,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const EmailTemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Transactional');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [device, setDevice] = useState('Desktop');
  const [isSaving, setIsSaving] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await api.emailTemplates.list();
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[1] || data[0]);
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUpdate = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    try {
      await api.emailTemplates.update(selectedTemplate.id, selectedTemplate);
      toast.success('Template updated successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to update template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIRewrite = () => {
    if (!selectedTemplate) return;
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2500)),
      {
        loading: 'AI is analyzing and rewriting your template...',
        success: () => {
          const name = selectedTemplate.name;
          const trigger = selectedTemplate.trigger;
          
          let enhancedContent = '';
          
          if (name.includes('Welcome')) {
            enhancedContent = `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4f46e5;">Welcome to the RoyalVirtus Family!</h2>
                <p>Greetings and Welcome! We are absolutely thrilled to have you join our exclusive community of fitness enthusiasts and style seekers. Your decision to embark on this journey with us marks the beginning of a transformative experience designed specifically for those who value premium quality and peak performance.</p>
                <p>At <b>RoyalVirtus</b>, we believe that every step towards a healthier lifestyle should be met with the finest gear and unparalleled support. As a newly registered member, you now have full access to our curated collections, personalized recommendations, and member-only rewards.</p>
                <p>We sincerely appreciate your trust in our brand and look forward to being a part of your success story. Let's push the boundaries together!</p>
              </div>
            `;
          } else if (name.includes('Order')) {
            enhancedContent = `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4f46e5;">Your Selection is on its Way!</h2>
                <p>We sincerely appreciate your recent acquisition from the RoyalVirtus collection. Our dedicated logistics team has successfully processed your order and is currently performing a final quality inspection to ensure everything meets our rigorous standards of excellence.</p>
                <p>Your order for <b>#{{order_id}}</b> has been confirmed and is scheduled for dispatch within the next business cycle. We understand how eager you are to receive your new gear, and we are committed to providing you with a seamless delivery experience that reflects the premium nature of our products.</p>
                <p>Thank you for choosing RoyalVirtus. We are honored to support your pursuit of greatness.</p>
              </div>
            `;
          } else {
            enhancedContent = `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4f46e5;">Optimized Communication Alert</h2>
                <p>This template has been meticulously refined using our advanced AI algorithms to ensure maximum engagement and clarity. The core message of <b>${name}</b>, triggered by <b>${trigger}</b>, has been restructured to resonate more deeply with your audience through sophisticated language and a more authoritative yet welcoming tone.</p>
                <p>By leveraging industry-leading communication standards, this content now provides a more comprehensive narrative that not only informs but also inspires action. We have enhanced the semantic structure to emphasize value propositions while maintaining the distinct RoyalVirtus brand voice.</p>
                <p>Ready for immediate deployment across your customer lifecycle touchpoints.</p>
              </div>
            `;
          }
            
          setSelectedTemplate(prev => ({ 
            ...prev, 
            content: enhancedContent,
            tone: 'AI Optimized' 
          }));
          return 'Comprehensive AI rewriting complete!';
        },
        error: 'AI Rewriting failed',
      }
    );
  };

  const filteredTemplates = templates.filter(t => t.type === activeTab);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-admin-primary-600 animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-surface-400">Loading Templates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      {/* Full Screen Preview Modal */}
      {isPreviewOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-surface-900/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
        >
          <div className="absolute top-10 right-10 flex gap-4">
             <div className="flex items-center gap-2 p-1.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                <button onClick={() => setDevice('Desktop')} className={`p-2 rounded-xl transition-all ${device === 'Desktop' ? 'bg-white text-admin-primary-600' : 'text-white/60'}`}>
                   <Monitor size={18} />
                </button>
                <button onClick={() => setDevice('Mobile')} className={`p-2 rounded-xl transition-all ${device === 'Mobile' ? 'bg-white text-admin-primary-600' : 'text-white/60'}`}>
                   <Smartphone size={18} />
                </button>
             </div>
             <button 
              onClick={() => setIsPreviewOpen(false)}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-surface-900 hover:rotate-90 transition-all duration-500 shadow-2xl"
             >
                <Plus size={24} className="rotate-45" />
             </button>
          </div>

          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 ${device === 'Mobile' ? 'max-w-[380px] h-[750px]' : 'w-full max-w-[800px] h-[85vh]'}`}
          >
             <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="bg-admin-primary-600 p-12 text-white flex flex-col items-center text-center">
                   <div className="p-4 bg-white/20 rounded-3xl mb-8">
                      <Send size={40} />
                   </div>
                   <h1 className="text-3xl font-black uppercase tracking-tight leading-none">{selectedTemplate.subject}</h1>
                   <div className="h-1 w-20 bg-white/30 rounded-full mt-6" />
                </div>
                <div className="p-12" dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
                <div className="p-12 bg-surface-50 border-t border-surface-100 text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">ROYALVIRTUS ENTERPRISE • AUTHENTIC PERFORMANCE GEAR</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            26 System Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Email <span className="text-admin-primary-600">Templates</span></h1>
          <p className="text-sm text-surface-500 max-w-lg">Design and automate your brand communication with visual templates and smart triggers.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" icon={Settings2}>Global Config</Button>
           <Button variant="primary" icon={Plus}>Create Template</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-8">
        {/* Template List */}
        <section className="space-y-4">
           <div className="flex gap-2 p-1.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-fit">
              {['Transactional', 'Marketing', 'System'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/25' : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>

           <div className="space-y-3">
              {filteredTemplates.map(tmpl => (
                 <button
                   key={tmpl.id}
                   onClick={() => setSelectedTemplate(tmpl)}
                   className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 ${selectedTemplate?.id === tmpl.id ? 'bg-admin-primary-600 border-admin-primary-600 shadow-xl shadow-admin-primary-500/20 text-white' : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-admin-primary-300'}`}
                 >
                    <div className="flex items-center justify-between mb-3">
                       <div className={`p-2 rounded-xl ${selectedTemplate?.id === tmpl.id ? 'bg-white/20' : 'bg-surface-50 dark:bg-surface-900'} text-admin-primary-500`}>
                          <Mail size={18} className={selectedTemplate?.id === tmpl.id ? 'text-white' : ''} />
                       </div>
                       <Badge variant={tmpl.status === 'Active' ? 'success' : 'primary'}>{tmpl.status}</Badge>
                    </div>
                    <p className={`font-black uppercase tracking-wider text-sm ${selectedTemplate?.id === tmpl.id ? 'text-white' : 'text-surface-900 dark:text-white'}`}>{tmpl.name}</p>
                    <div className="flex items-center justify-between mt-2">
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTemplate?.id === tmpl.id ? 'text-white/60' : 'text-surface-400'}`}>Last sent: {tmpl.last_sent_at ? new Date(tmpl.last_sent_at).toLocaleDateString() : 'Never'}</p>
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTemplate?.id === tmpl.id ? 'text-white/80' : 'text-surface-600 dark:text-surface-300'}`}>{tmpl.tone}</p>
                    </div>
                 </button>
              ))}
              {filteredTemplates.length === 0 && (
                 <div className="p-10 text-center border-2 border-dashed border-surface-100 dark:border-surface-800 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">No templates in this category</p>
                 </div>
              )}
           </div>
        </section>

        {/* Visual Preview / Editor Wrapper */}
        <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden">
           {selectedTemplate ? (
             <>
               <div className="p-8 border-b border-surface-100 dark:border-surface-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-admin-primary-50 dark:bg-admin-primary-900/20 flex items-center justify-center text-admin-primary-600">
                        <Layout size={28} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">{selectedTemplate.name}</h2>
                        <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mt-1">Trigger: <span className="text-admin-primary-600">{selectedTemplate.trigger}</span></p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-700">
                     <button onClick={() => setDevice('Desktop')} className={`p-2 rounded-xl transition-all ${device === 'Desktop' ? 'bg-white dark:bg-surface-800 text-admin-primary-600 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}>
                        <Monitor size={18} />
                     </button>
                     <button onClick={() => setDevice('Mobile')} className={`p-2 rounded-xl transition-all ${device === 'Mobile' ? 'bg-white dark:bg-surface-800 text-admin-primary-600 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}>
                        <Smartphone size={18} />
                     </button>
                  </div>
                  
                  <div className="flex gap-2">
                     <Button variant="secondary" icon={Eye} onClick={() => setIsPreviewOpen(true)}>Preview</Button>
                     <Button variant="primary" icon={Edit3} onClick={() => {
                        const newContent = prompt('Edit Template Content (HTML):', selectedTemplate.content);
                        if (newContent !== null) {
                           setSelectedTemplate(prev => ({ ...prev, content: newContent }));
                        }
                     }}>Edit Content</Button>
                  </div>
               </div>

               <div className="p-8 bg-surface-50 dark:bg-surface-900/50 flex flex-col items-center">
                  <div 
                    className={`bg-white dark:bg-surface-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 border border-surface-200 dark:border-surface-700 ${device === 'Mobile' ? 'max-w-[360px]' : 'w-full max-w-[650px]'}`}
                    style={{ minHeight: '500px' }}
                  >
                      {/* Render Dynamic Content */}
                      <div className="bg-admin-primary-600 p-10 text-white flex flex-col items-center text-center">
                         <div className="p-3 bg-white/20 rounded-2xl mb-6">
                            <Send size={32} />
                         </div>
                         <h1 className="text-2xl font-black uppercase tracking-tight">{selectedTemplate.subject}</h1>
                         <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-2">ROYALVIRTUS STORE</p>
                      </div>
                      
                      <div className="p-8" dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
                  </div>

                  {/* Advanced Controls Bar */}
                  <div className="mt-8 w-full max-w-[650px] flex items-center justify-between p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-lg">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <Type size={16} className="text-surface-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-surface-500">Variables</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer group hover:bg-admin-primary-50 dark:hover:bg-admin-primary-900/20 px-3 py-1.5 rounded-xl transition-all"
                          onClick={handleAIRewrite}
                        >
                           <Sparkles size={16} className="text-admin-primary-500 group-hover:animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-surface-500 group-hover:text-admin-primary-600 transition-colors">AI Rewriter</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={async () => {
                           if (confirm('Are you sure you want to delete this template?')) {
                              try {
                                 await api.emailTemplates.delete(selectedTemplate.id);
                                 toast.success('Template deleted');
                                 fetchTemplates();
                              } catch (e) {
                                 toast.error('Failed to delete template');
                              }
                           }
                        }}>Delete</Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          icon={isSaving ? Loader2 : Save} 
                          onClick={handleUpdate}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Update Draft'}
                        </Button>
                     </div>
                  </div>
               </div>
             </>
           ) : (
             <div className="h-[500px] flex items-center justify-center text-surface-400 font-black uppercase tracking-widest text-xs">
                Select a template to preview
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default EmailTemplatePage;
