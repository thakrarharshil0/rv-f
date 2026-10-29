import React from 'react';

const Badge = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon: Icon,
  className = '',
  dot = false 
}) => {
  const baseStyles = 'inline-flex items-center gap-2 font-medium rounded-full transition-all duration-200';

  const variants = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    packaging: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivery: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    returned: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    canceled: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending_payment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    primary: 'bg-admin-primary-100 text-admin-primary-700 dark:bg-admin-primary-900/30 dark:text-admin-primary-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotColors = {
    pending: 'bg-amber-500',
    confirmed: 'bg-blue-500',
    packaging: 'bg-purple-500',
    delivery: 'bg-cyan-500',
    delivered: 'bg-green-500',
    returned: 'bg-orange-500',
    failed: 'bg-red-500',
    canceled: 'bg-slate-500',
    paid: 'bg-green-500',
    unpaid: 'bg-red-500',
    pending_payment: 'bg-amber-500',
    primary: 'bg-admin-primary-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant] || dotColors.primary}`} />}
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};

export default Badge;
