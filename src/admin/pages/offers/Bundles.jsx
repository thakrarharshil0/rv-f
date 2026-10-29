import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Gift, 
  Truck, 
  Percent, 
  Package, 
  Edit 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import api from '../../../lib/api';

const iconOptions = [
  { value: 'Gift', icon: Gift },
  { value: 'Truck', icon: Truck },
  { value: 'Percent', icon: Percent },
  { value: 'Package', icon: Package },
];

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_text: '',
    original_price: '',
    sale_price: '',
    icon: 'Gift',
    is_active: true
  });

  const fetchBundles = async () => {
    setIsLoading(true);
    try {
      const data = await api.bundles.adminList();
      setBundles(data || []);
    } catch (error) {
      toast.error("Failed to load bundles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleEdit = (bundle) => {
    setEditingId(bundle.id);
    setForm({
      title: bundle.title,
      description: bundle.description || '',
      discount_text: bundle.discount_text || '',
      original_price: bundle.original_price,
      sale_price: bundle.sale_price,
      icon: bundle.icon || 'Gift',
      is_active: bundle.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      discount_text: '',
      original_price: '',
      sale_price: '',
      icon: 'Gift',
      is_active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.bundles.update(editingId, form);
        toast.success("Bundle updated successfully");
      } else {
        await api.bundles.create(form);
        toast.success("Bundle created successfully");
      }
      handleReset();
      fetchBundles();
    } catch (error) {
      toast.error(error.message || "Failed to save bundle");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await api.bundles.delete(id);
      toast.success("Bundle deleted");
      fetchBundles();
    } catch (error) {
      toast.error("Failed to delete bundle");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">
            {editingId ? 'Edit' : 'Create'} <span className="text-[#C41230]">Bundle</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage "Bundle & Save" offers for the home page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <section className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-6 space-y-4 sticky top-8">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-4">
              Bundle Details
            </h2>
            
            <div className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest">Title</span>
                <input 
                  required 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. The Essentials Bundle"
                  className="w-full px-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-colors font-medium"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest">Description</span>
                <input 
                  required 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="e.g. 2 Shorts + 1 Track"
                  className="w-full px-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-colors font-medium"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest">Discount Text</span>
                <input 
                  value={form.discount_text} 
                  onChange={e => setForm({...form, discount_text: e.target.value})}
                  placeholder="e.g. 15% OFF"
                  className="w-full px-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-colors font-medium"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest">Original Price</span>
                  <input 
                    required 
                    type="number"
                    value={form.original_price} 
                    onChange={e => setForm({...form, original_price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-colors font-medium"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest">Sale Price</span>
                  <input 
                    required 
                    type="number"
                    value={form.sale_price} 
                    onChange={e => setForm({...form, sale_price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-colors font-medium"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest block">Icon</span>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({...form, icon: opt.value})}
                      className={`p-3 border-2 flex items-center justify-center transition-all ${form.icon === opt.value ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <opt.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={form.is_active} 
                  onChange={e => setForm({...form, is_active: e.target.checked})}
                  className="w-5 h-5 accent-black"
                />
                <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Active on Website</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-black text-white rounded-none h-12 font-bold uppercase tracking-widest"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : (editingId ? 'Update' : 'Create')}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  className="rounded-none h-12 px-6 border-2 border-black font-bold uppercase tracking-widest"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* List Section */}
        <section className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#C41230]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bundles.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 text-center">
                  <Package className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">No bundles found. Create your first one!</p>
                </div>
              ) : (
                bundles.map(bundle => (
                  <div key={bundle.id} className="bg-white border-2 border-gray-100 p-6 flex items-center justify-between hover:border-black transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-black">
                        {(() => {
                          const Icon = iconOptions.find(o => o.value === bundle.icon)?.icon || Package;
                          return <Icon size={32} />;
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold uppercase tracking-tight text-lg">{bundle.title}</h3>
                          {!bundle.is_active && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 italic font-light">{bundle.description}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-[#C41230] font-bold">₹{bundle.sale_price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{bundle.original_price}</span>
                          <span className="text-[10px] font-bold text-black uppercase tracking-widest ml-2 bg-gray-50 px-2 py-0.5">{bundle.discount_text}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(bundle)}
                        className="p-3 bg-black text-white hover:bg-gray-800 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(bundle.id)}
                        className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Bundles;
