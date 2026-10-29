import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, ImagePlus, Plus, Save, UploadCloud, WandSparkles, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../lib/api';

const defaultForm = {
  name: '',
  sku: '',
  category: 'Apparel',
  subCategory: 'T-Shirts',
  unit: 'pcs',
  brand: 'RoyalVirtus',
  shortDescription: '',
  description: '',
  listPrice: '',
  sellingPrice: '',
  discountType: 'Flat',
  discountValue: '',
  taxType: 'Tax Free',
  taxValue: '0',
  stock: '0',
  status: 'Published',
  tags: '',
  image: null,
  is_featured: false,
  is_new: false,
  is_limited: false,
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.getById(id);
        const p = data.item;
        setFormData({
          name: p.name || '',
          sku: p.sku || '',
          category: p.category || 'Apparel',
          subCategory: p.subCategory || 'T-Shirts',
          unit: p.unit || 'pcs',
          brand: p.brand || 'RoyalVirtus',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          listPrice: p.price || '',
          sellingPrice: p.price || '',
          discountType: 'Flat',
          discountValue: '0',
          taxType: 'Tax Free',
          taxValue: '0',
          stock: p.stock || '0',
          status: 'Published',
          tags: (p.tags || []).join(', '),
          image: null,
          is_featured: p.isFeatured || false,
          is_new: p.isNew || false,
          is_limited: p.isLimited || false,
        });
        if (p.image) setPreviewImage(p.image);
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInput = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInput('image', file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });
      // Laravel PATCH doesn't support FormData well sometimes, but we use POST with _method
      payload.append('_method', 'PATCH');
      
      await api.request(`/products/${id}`, {
        method: 'POST',
        body: payload,
        auth: true
      });
      
      toast.success("Product updated successfully");
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-admin-primary-600 mb-4" />
        <p className="text-surface-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 hover:bg-surface-100 rounded-lg text-surface-500"><ArrowLeft size={20}/></Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit <span className="text-admin-primary-600">Product</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button variant="primary" icon={Save} onClick={handleSubmit} isLoading={isSaving}>Save Changes</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
            <h3 className="text-lg font-bold">General Information</h3>
            <div className="space-y-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Product Name</span>
                <input required value={formData.name} onChange={e => handleInput('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900" />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Description</span>
                <textarea rows={4} value={formData.description} onChange={e => handleInput('description', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900" />
              </label>
            </div>
          </section>

          <section className="p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
            <h3 className="text-lg font-bold">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Selling Price (₹)</span>
                <input required type="number" value={formData.sellingPrice} onChange={e => handleInput('sellingPrice', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900" />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">In Stock</span>
                <input required type="number" value={formData.stock} onChange={e => handleInput('stock', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
            <h3 className="text-lg font-bold">Product Image</h3>
            <div className="aspect-square rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 overflow-hidden relative group">
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="p-3 bg-white rounded-full cursor-pointer text-admin-primary-600 shadow-lg"><Plus size={24}/><input type="file" className="hidden" onChange={handleImageChange} /></label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-surface-50">
                  <UploadCloud size={32} className="text-surface-300 mb-2" />
                  <span className="text-xs font-medium text-surface-500">Upload Media</span>
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </section>

          <section className="p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
            <h3 className="text-lg font-bold">Status</h3>
            <select value={formData.status} onChange={e => handleInput('status', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </section>

          <section className="p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
            <h3 className="text-lg font-bold">Badges</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured</span>
                <input type="checkbox" checked={formData.is_featured} onChange={e => handleInput('is_featured', e.target.checked)} className="w-5 h-5 accent-admin-primary-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Arrival</span>
                <input type="checkbox" checked={formData.is_new} onChange={e => handleInput('is_new', e.target.checked)} className="w-5 h-5 accent-admin-primary-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#C41230] font-bold">Limited Edition</span>
                <input type="checkbox" checked={formData.is_limited} onChange={e => handleInput('is_limited', e.target.checked)} className="w-5 h-5 accent-[#C41230]" />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
