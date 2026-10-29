import React from 'react';
import { Check, Clock } from 'lucide-react';

const StatusTracker = ({ currentStatus, order }) => {
  const statuses = [
    { key: 'pending', label: 'Pending', description: 'Order received' },
    { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed' },
    { key: 'packaging', label: 'Packaging', description: 'Being packaged' },
    { key: 'delivery', label: 'Delivery', description: 'Out for delivery' },
    { key: 'delivered', label: 'Delivered', description: 'Order delivered' },
  ];

  const statusMap = {
    'pending': 0,
    'confirmed': 1,
    'packaging': 2,
    'delivery': 3,
    'delivered': 4,
    'returned': 4,
    'failed': 2,
    'canceled': 0,
  };

  const currentIndex = statusMap[currentStatus] ?? 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Order Progress</h3>
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {currentIndex + 1} of {statuses.length}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {statuses.map((status, index) => (
            <React.Fragment key={status.key}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                    ${index <= currentIndex
                      ? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/40'
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'}
                  `}
                >
                  {index < currentIndex ? (
                    <Check size={20} />
                  ) : index === currentIndex ? (
                    <Clock size={20} className="animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium text-surface-600 dark:text-surface-400 mt-2 text-center whitespace-nowrap">
                  {status.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < statuses.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 transition-all duration-300 ${
                    index < currentIndex
                      ? 'bg-admin-primary-600'
                      : 'bg-surface-300 dark:bg-surface-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Timeline Details */}
      <div className="space-y-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Timeline</h4>
        <div className="space-y-2">
          {Array.isArray(order?.timeline) && order.timeline.length > 0 ? (
            order.timeline.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-admin-primary-600 mt-2" />
                  {index < order.timeline.length - 1 && <div className="w-0.5 h-8 bg-surface-200 dark:bg-surface-700" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{event.title || 'Event'}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{event.timestamp || ''}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-surface-500 dark:text-surface-400 italic">No timeline events recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;
