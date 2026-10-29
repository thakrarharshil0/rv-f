import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';

const OrderCard = ({ order, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs font-mono bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">
              {order.orderId}
            </code>
            <Badge variant={order.status.toLowerCase().replace(/ /g, '')} size="sm">
              {order.status}
            </Badge>
          </div>
          <p className="text-sm font-medium text-surface-900 dark:text-white">{order.customer}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">{order.email}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onView?.(order)}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-admin-primary-600"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit?.(order)}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-surface-600 dark:text-surface-400"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete?.(order)}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Date</p>
          <p className="text-sm font-medium text-surface-900 dark:text-white">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Amount</p>
          <p className="text-sm font-bold text-admin-primary-600">₹{order.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Payment Status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Payment</p>
          <Badge
            variant={order.paymentStatus === 'Paid' ? 'paid' : order.paymentStatus === 'Unpaid' ? 'unpaid' : 'pending_payment'}
            size="sm"
            dot
          >
            {order.paymentStatus}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
