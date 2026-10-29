import React, { useMemo, useState, useEffect } from 'react';
import { Download, Filter, Search, Star, Loader2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { reviews as reviewApi } from '../../../lib/api';
import { toast } from 'sonner';

const CustomerReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewApi.adminList({ search: searchQuery });
      setReviewsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Reviews Error:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [searchQuery]);

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewApi.delete(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      await reviewApi.toggleApproval(id);
      toast.success('Review status updated');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredReviews = useMemo(() => {
    return reviewsList.filter((row) => {
      const matchesRating = minRating === 'All' || row.rating >= Number(minRating);
      const matchesStatus = statusFilter === 'All' || 
          (statusFilter === 'Approved' ? row.isApproved : !row.isApproved);
      return matchesRating && matchesStatus;
    });
  }, [reviewsList, minRating, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">19 People & Content</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Customer Reviews</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Track product reviews, ratings, and reply coverage from one moderated review queue.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Customer Reviews List</h2>
            <p className="text-sm text-surface-500 inline-flex items-center gap-2">Total reviews <Badge variant="primary" size="sm">{filteredReviews.length}</Badge></p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-[18rem]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by id, product, customer" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100" />
            </div>
            <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5 text-sm text-surface-700 dark:text-surface-100">
              <option value="All">All Ratings</option>
              <option value="5">5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5 text-sm text-surface-700 dark:text-surface-100">
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
            <Button variant="secondary" icon={Filter} onClick={fetchReviews}>Refresh</Button>
            <Button variant="secondary" icon={Download}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Product</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Customer</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Rating</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Review</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
                <th className="px-5 py-4 text-right text-xs uppercase tracking-wide text-surface-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-admin-primary-600 animate-spin" />
                      <p className="text-sm font-bold text-surface-500 uppercase tracking-widest">Loading Reviews...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredReviews.map((row, index) => (
                    <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900/40 transition-colors">
                      <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                      <td className="px-5 py-4 text-surface-700 dark:text-surface-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-900">
                            {row.product?.image ? (
                              <img src={row.product.image} alt={row.product.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <span className="font-bold max-w-[12rem] truncate">{row.product?.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-surface-700 dark:text-surface-200">
                        <div className="flex items-center gap-2">
                          <img src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${row.user?.name}`} alt={row.user?.name} className="h-8 w-8 rounded-full border border-surface-200 dark:border-surface-700" />
                          <span className="font-medium">{row.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {row.rating}
                          <Star size={12} fill="currentColor" />
                        </span>
                      </td>
                      <td className="px-5 py-4 text-surface-700 dark:text-surface-200 max-w-[18rem]">
                        <p className="font-bold text-xs mb-1 truncate">{row.title}</p>
                        <p className="text-xs text-surface-500 line-clamp-2" title={row.comment}>{row.comment}</p>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => handleToggleApproval(row.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            row.isApproved 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          {row.isApproved ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {row.isApproved ? 'Approved' : 'Pending'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteReview(row.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReviews.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-surface-500 dark:text-surface-400 font-bold uppercase tracking-widest text-xs">No reviews match the current filters.</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CustomerReviewsPage;
