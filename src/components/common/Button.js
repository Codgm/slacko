import React from 'react';

/**
 * 공통 Button 컴포넌트
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'danger'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {string} [props.ariaLabel]
 * @param {function} [props.onClick]
 * @param {string} [props.type]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  ariaLabel,
  onClick,
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
} 