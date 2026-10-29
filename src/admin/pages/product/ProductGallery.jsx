import React, { useMemo, useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Filter,
  Grid3X3,
  ImagePlus,
  List,
  Search,
  Trash2,
  UploadCloud,
  X,
  Eye,
  Star,
  Loader2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../../lib/api';
import { toast } from 'sonner';

const ProductGallery = () => {
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState(null);
  
  // Upload modal state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAssets = async () => {
    try {
      const response = await api.products.list({ perPage: 100 });
      const productList = response.items || [];
      setProducts(productList);
      if (productList.length > 0 && !selectedProductId) {
        setSelectedProductId(productList[0].id);
      }

      const galleryAssets = productList.flatMap(product => {
        const items = [];
        if (product.image) {
          items.push({
            id: `IMG-${product.id}`,
            productId: product.id,
            productName: product.name,
            title: product.name,
            fileType: 'Image',
            status: 'Published',
            sizeKb: 250,
            dimensions: '1200x1200',
            uploadedBy: 'System',
            tags: [product.category?.toLowerCase() || 'general'],
            isCover: true,
            preview: product.image,
          });
        }
        if (product.gallery && Array.isArray(product.gallery)) {
          product.gallery.forEach((img, idx) => {
            items.push({
              id: `GAL-${product.id}-${idx}`,
              productId: product.id,
              productName: product.name,
              title: `${product.name} Gallery ${idx + 1}`,
              fileType: 'Image',
              status: 'Published',
              sizeKb: 180,
              dimensions: '1200x1200',
              uploadedBy: 'System',
              tags: [(product.category?.toLowerCase() || 'general'), 'gallery'],
              isCover: false,
              preview: img,
            });
          });
        }
        return items;
      });

      setAssets(galleryAssets);
    } catch (error) {
      console.error("Failed to fetch gallery assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch = !q || asset.title.toLowerCase().includes(q) || asset.id.toLowerCase().includes(q) || (asset.tags || []).join(' ').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
      const matchesType = typeFilter === 'All' || asset.fileType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, query, statusFilter, typeFilter]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image file');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('gallery[]', file);
      });

      await api.products.update(selectedProductId, formData);
      toast.success('Gallery images added successfully!');
      setIsUploadOpen(false);
      setSelectedFiles([]);
      await fetchAssets();
    } catch (err) {
      console.error('Failed to upload gallery images:', err);
      toast.error(err.message || 'Failed to upload images');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-admin-primary-600 mb-4" />
        <p className="text-surface-500">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Product <span className="text-admin-primary-600">Gallery</span></h1>
        <Button variant="primary" icon={ImagePlus} onClick={() => setIsUploadOpen(true)}>Add To Gallery</Button>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 border border-surface-200 dark:border-surface-700 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search media..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden shadow-card group">
            <div className="relative aspect-square">
              <img src={asset.preview} alt={asset.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => setPreviewAsset(asset)} className="p-2 bg-white rounded-full text-admin-primary-600 shadow-lg"><Eye size={20} /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-bold truncate">{asset.title}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-widest mt-1">{asset.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsUploadOpen(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <ImagePlus size={20} className="text-admin-primary-600" />
                Add Image To Product Gallery
              </h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 hover:bg-surface-100 rounded-lg text-surface-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase mb-2">
                  Select Product
                </label>
                {products.length === 0 ? (
                  <p className="text-xs text-amber-500">No products available. Please create a product first.</p>
                ) : (
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                    required
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku || `ID: ${p.id}`})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase mb-2">
                  Upload Gallery Image(s)
                </label>
                <label className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-admin-primary-500 transition-colors bg-surface-50 dark:bg-surface-800/50">
                  <UploadCloud size={32} className="text-admin-primary-600 mb-2" />
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected: ${selectedFiles.map(f => f.name).join(', ')}`
                      : 'Click to browse images (JPG, PNG, WEBP)'}
                  </span>
                  <span className="text-xs text-surface-400 mt-1">You can select multiple photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                <Button type="button" variant="secondary" onClick={() => setIsUploadOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={ImagePlus} disabled={isSaving || selectedFiles.length === 0}>
                  {isSaving ? 'Uploading...' : 'Upload & Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewAsset(null)}>
          <div className="max-w-4xl w-full bg-white dark:bg-surface-900 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="font-bold">{previewAsset.title}</h3>
              <button onClick={() => setPreviewAsset(null)} className="p-1 hover:bg-surface-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-4 flex justify-center bg-surface-100 dark:bg-surface-950">
              <img src={previewAsset.preview} alt="" className="max-h-[70vh] object-contain shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
