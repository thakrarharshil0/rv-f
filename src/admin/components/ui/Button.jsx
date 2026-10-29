import React from 'react';

const Button = React.forwardRef(
  ({
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    children,
    icon: Icon,
    iconPosition = 'left',
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 font-inter rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-admin-primary-600 text-white hover:bg-admin-primary-700 focus:ring-admin-primary-300 dark:focus:ring-admin-primary-900/30 shadow-lg shadow-admin-primary-500/20 hover:shadow-xl hover:shadow-admin-primary-500/30 hover:scale-105 active:scale-95',
      secondary: 'bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-white hover:bg-surface-200 dark:hover:bg-surface-700 focus:ring-surface-300 dark:focus:ring-surface-600',
      outline: 'border-2 border-admin-primary-600 text-admin-primary-600 hover:bg-admin-primary-50 dark:hover:bg-admin-primary-900/20 focus:ring-admin-primary-300 dark:focus:ring-admin-primary-900/30',
      ghost: 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 focus:ring-surface-300 dark:focus:ring-surface-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-900/30',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-900/30',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {Icon && iconPosition === 'left' && !isLoading && <Icon size={18} />}
        {children}
        {Icon && iconPosition === 'right' && !isLoading && <Icon size={18} />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
