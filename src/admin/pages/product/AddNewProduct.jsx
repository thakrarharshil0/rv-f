import React, { useMemo, useState } from 'react';
import { Calendar, ImagePlus, Plus, Save, UploadCloud, WandSparkles, Loader2, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../lib/api';

const defaultForm = {
  name: '',
  sku: '',
  category: '',
  subCategory: '',
  unit: 'pcs',
  brand: 'RoyalVirtus',
  shortDescription: '',
  description: '',
  listPrice: '',
  sellingPrice: '',
  discountType: 'Flat',
  discountValue: '',
  stock: '',
  minQty: 1,
  tags: '',
  metaTitle: '',
  metaDescription: '',
  isFeatured: false,
  isNew: true,
  isLimited: false,
  isTaxable: true,
  isDigital: false,
};

const AddNewProduct = () => {
  const [form, setForm] = useState(defaultForm);
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const navigate = useNavigate();

  const fetchCats = async () => {
    try {
      const res = await api.categories.list();
      setCategories(res.items || []);
      
      const subRes = await api.subCategories.list();
      setSubCategories(subRes.items || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCats(false);
    }
  };

  React.useEffect(() => {
    fetchCats().then(() => {
      // We need the items directly from the fetch or use a secondary effect
    });
  }, []);

  // Separate effect to handle default selection once categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !form.category) {
      const firstCat = categories[0];
      onInput('category', firstCat.name);
      
      const firstSub = subCategories.find(s => s.categoryId === firstCat.id);
      if (firstSub) {
        onInput('subCategory', firstSub.name);
      }
    }
  }, [categories, subCategories]);

  const filteredSubCats = useMemo(() => {
    const parent = categories.find(c => c.name === form.category);
    if (!parent) return [];
    return subCategories.filter(s => s.categoryId === parent.id);
  }, [form.category, categories, subCategories]);

  const discountPreview = useMemo(() => {
    const list = Number(form.listPrice || 0);
    const sell = Number(form.sellingPrice || 0);
    if (!list || !sell || list <= sell) return 0;
    return Math.round(((list - sell) / list) * 100);
  }, [form.listPrice, form.sellingPrice]);

  const onInput = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleMainImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMainImage(file);
    // In a real app, we would upload to S3/Cloudinary here
    // For now, we'll store the filename or a dummy URL
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setGallery((prev) => [...prev, ...files]);
  };

  const handleAIGenerate = () => {
    if (!form.name) {
      toast.error("Please enter a product name first");
      return;
    }

    setIsSaving(true); // Reusing isSaving as a generic loading state for now
    
    // Simulating AI generation delay
    setTimeout(() => {
      const name = form.name;
      const cat = form.category;
      
      const generatedDescription = `Experience ultimate comfort and style with our new ${name}. Specifically designed for those who value both performance and aesthetics, this ${cat} essential features premium materials and a modern fit. Whether you're at the gym or on the streets, the ${name} ensures you stand out from the crowd.`;
      
      const generatedMetaTitle = `${name} | Premium ${cat} | Royal Virtus`;
      const generatedMetaDescription = `Shop the latest ${name} at Royal Virtus. High-quality ${cat} designed for modern lifestyles. Free shipping on all premium collections.`;

      setForm(prev => ({
        ...prev,
        description: generatedDescription,
        metaTitle: generatedMetaTitle,
        metaDescription: generatedMetaDescription,
        shortDescription: `Premium ${name} from our ${cat} collection.`
      }));

      toast.success("AI Content generated successfully!");
      setIsSaving(false);
    }, 1500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.sellingPrice);
      formData.append('originalPrice', form.listPrice || '');
      formData.append('quantity', form.stock || '0');
      formData.append('sku', form.sku || '');
      formData.append('description', form.description || '');
      formData.append('is_featured', form.isFeatured ? '1' : '0');
      formData.append('is_new', form.isNew ? '1' : '0');
      formData.append('is_limited', form.isLimited ? '1' : '0');

      if (mainImage) {
        formData.append('image', mainImage);
      }

      if (gallery.length > 0) {
        gallery.forEach((file) => {
          formData.append('gallery[]', file);
        });
      }

      await api.products.create(formData);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setMainImage(null);
    setGallery([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Add New <span className="text-admin-primary-600">Product</span>
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Reference-inspired setup with structured product, pricing, media, and SEO sections.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
          <Calendar size={16} className="text-admin-primary-500" />
          <span className="whitespace-nowrap">Draft Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Basic Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-end gap-2">
              <label className="space-y-1 flex-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Product Name</span>
                <input required value={form.name} onChange={(e) => onInput('name', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
              </label>
              <button 
                type="button"
                onClick={handleAIGenerate}
                disabled={isSaving}
                className="h-11 px-4 bg-admin-primary-50 text-admin-primary-600 rounded-xl border border-admin-primary-100 hover:bg-admin-primary-100 transition-all flex items-center gap-2 text-sm font-bold whitespace-nowrap"
              >
                <WandSparkles size={16} />
                AI Generate
              </button>
            </div>
            <label className="space-y-1">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">SKU</span>
              <input required value={form.sku} onChange={(e) => onInput('sku', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Brand</span>
              <input value={form.brand} onChange={(e) => onInput('brand', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Category</span>
              <select 
                value={form.category} 
                onChange={(e) => {
                  const val = e.target.value;
                  onInput('category', val);
                  // Auto set first subcategory if available
                  const parent = categories.find(c => c.name === val);
                  const firstSub = subCategories.find(s => s.categoryId === parent?.id);
                  if (firstSub) onInput('subCategory', firstSub.name);
                }} 
                className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
              >
                {loadingCats ? (
                  <option>Loading...</option>
                ) : (
                  <>
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </>
                )}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sub Category</span>
              <select 
                value={form.subCategory} 
                onChange={(e) => onInput('subCategory', e.target.value)} 
                className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
              >
                <option value="" disabled>Select Sub Category</option>
                {filteredSubCats.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
                {filteredSubCats.length === 0 && <option disabled>No subcategories found</option>}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Unit</span>
              <input value={form.unit} onChange={(e) => onInput('unit', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Short Description</span>
              <input value={form.shortDescription} onChange={(e) => onInput('shortDescription', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Description</span>
              <textarea rows={5} value={form.description} onChange={(e) => onInput('description', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
            </label>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Main Image</h2>
          <div className="relative group/img">
            {mainImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-admin-primary-100 dark:border-admin-primary-900/30 aspect-square">
                <img 
                  src={URL.createObjectURL(mainImage)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={() => setMainImage(null)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover/img:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-6 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-admin-primary-500 transition-colors">
                <ImagePlus size={28} className="text-admin-primary-500 mb-2" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Upload product thumbnail</span>
                <span className="text-xs text-surface-500 mt-1">JPG, PNG up to 2MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
              </label>
            )}
          </div>
          <div className="text-xs text-surface-500 space-y-1">
            <p>Recommended ratio: 1:1 square</p>
            <p>Reference style: clean card visual with centered preview</p>
          </div>
        </section>
      </div>

      <section className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Pricing & Others</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">List Price</span>
            <input type="number" min="0" value={form.listPrice} onChange={(e) => onInput('listPrice', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Selling Price</span>
            <input type="number" min="0" value={form.sellingPrice} onChange={(e) => onInput('sellingPrice', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Discount Type</span>
            <select value={form.discountType} onChange={(e) => onInput('discountType', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500">
              <option>Flat</option>
              <option>Percent</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Discount Value</span>
            <input type="number" min="0" value={form.discountValue} onChange={(e) => onInput('discountValue', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Current Stock</span>
            <input type="number" min="0" value={form.stock} onChange={(e) => onInput('stock', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Minimum Qty</span>
            <input type="number" min="1" value={form.minQty} onChange={(e) => onInput('minQty', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <div className="md:col-span-2 p-4 rounded-xl bg-admin-primary-50 dark:bg-admin-primary-900/20 border border-admin-primary-100 dark:border-admin-primary-900/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-admin-primary-600">Calculated Margin Hint</p>
              <p className="text-sm text-surface-700 dark:text-surface-300 mt-1">Auto discount preview from list vs selling price.</p>
            </div>
            <span className="text-2xl font-extrabold text-admin-primary-600">{discountPreview}%</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Visibility & Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700">
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">Featured Product</p>
                <p className="text-xs text-surface-500">Show in 'Bestsellers' on Home page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => onInput('isFeatured', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary-300 dark:peer-focus:ring-admin-primary-800 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-admin-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700">
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">New Arrival</p>
                <p className="text-xs text-surface-500">Display a 'NEW' badge on product.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={(e) => onInput('isNew', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary-300 dark:peer-focus:ring-admin-primary-800 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-admin-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700">
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">Limited Edition</p>
                <p className="text-xs text-surface-500">Show in 'Limited Edition' section.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.isLimited} onChange={(e) => onInput('isLimited', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary-300 dark:peer-focus:ring-admin-primary-800 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-admin-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Tags</label>
            <input value={form.tags} onChange={(e) => onInput('tags', e.target.value)} placeholder="yoga, mat, eco-friendly" className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </div>
        </section>

        <section className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Gallery</h2>
          <label className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-5 min-h-[120px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-admin-primary-500 transition-colors">
            <UploadCloud size={26} className="text-admin-primary-500 mb-2" />
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Upload gallery images</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
          </label>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative group/gal rounded-xl overflow-hidden aspect-square border border-surface-200 dark:border-surface-700">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Gallery" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button"
                    onClick={() => setGallery(prev => prev.filter((_, i) => i !== index))}
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">SEO Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Meta Title</span>
            <input value={form.metaTitle} onChange={(e) => onInput('metaTitle', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
          <button 
            type="button"
            onClick={handleAIGenerate}
            disabled={isSaving}
            className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 flex gap-3 items-start text-left hover:border-admin-primary-500 transition-all group"
          >
            <div className="p-2 bg-admin-primary-50 text-admin-primary-600 rounded-lg group-hover:bg-admin-primary-100 transition-colors">
              <WandSparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-1">AI Smart SEO</p>
              <p className="text-[10px] text-surface-500 line-clamp-2">Click to automatically generate SEO optimized title and meta description.</p>
            </div>
          </button>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Meta Description</span>
            <textarea rows={3} value={form.metaDescription} onChange={(e) => onInput('metaDescription', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500" />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={handleReset} disabled={isSaving}>Reset</Button>
        <Button type="submit" variant="primary" icon={isSaving ? Loader2 : Save} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddNewProduct;
